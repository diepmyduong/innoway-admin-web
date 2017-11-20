import { Component, OnInit, HostBinding, Host, Input, Output, EventEmitter, ViewRef, ViewChild } from '@angular/core';
import { CardContainerComponent } from './card-container.component'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Subscription } from 'rxjs/Subscription'
import * as _ from 'lodash'
import { NgForm } from '@angular/forms'
import { MatSlideToggleChange, MatSlideToggle } from '@angular/material'
import { iCard, ChatbotApiService , iSetting } from 'app/services/chatbot'
import { QuickReplyPortalComponent, StoriesPortalComponent } from '../../portals'
declare var swal: any
export class BaseCard {
    // @HostBinding('class.swiper-slide') swiperSlideClass = true
    @Input() card: iCard
    @ViewChild('cardFrm', { read: NgForm }) cardFrm: NgForm
    @ViewChild('saveToggle', { read: MatSlideToggle }) saveToggle: MatSlideToggle
    constructor(
        @Host() protected container: CardContainerComponent,
        public chatbotApi: any
    ) {
        this.subscriptions = {}
        this.chatbotApi = chatbotApi as ChatbotApiService
    }
    viewInited: BehaviorSubject<number>
    subscriptions: { [key: string]: Subscription }
    viewRef: ViewRef
    cardState: iCard

    ngOnInit() {
        this.updateCardState()
    }

    ngAfterContentInit() {
        setTimeout(() => {
            this.viewInited.next(this.index)
        })
    }

    ngOnDestroy() {
        _.forEach(this.subscriptions, (sub: Subscription) => {
            sub.unsubscribe()
        })
    }

    async close() {
        console.log('close', this.index)
        this.container.popCardComp(this.index)
    }

    // focus() {
    //     this.container.swiper.slideTo(this.index)
    // }

    get currentIndex() {
        return 1
    }

    get index() {
        return this.container.cardViewContainer.indexOf(this.viewRef)
    }

    onCardDrop(event) {
        const fromIndex = event.dragData
        const toIndex = this.index
        const fromComp = this.container.cardComps[fromIndex]
        const toComp = this.container.cardComps[toIndex]
        const fromRef = fromComp.viewRef
        const toRef = toComp.viewRef
        // Swap component

        if (fromIndex < toIndex) {
            this.container.cardComps.splice(toIndex + 1, 0, fromComp)
            this.container.cardComps.splice(fromIndex, 1)
        } else {
            this.container.cardComps.splice(toIndex, 0, fromComp)
            this.container.cardComps.splice(fromIndex + 1, 1)
        }
        // Swap ViewRef
        this.container.cardViewContainer.move(fromRef, toIndex)
        // Emit event
        this.container.change.emit({
            status: "order",
            data: {
                from: fromComp.card,
                to: toComp.card
            }
        })
        console.log('from ', fromIndex)
        console.log('to', toIndex)
    }

    get portalIndex() {
        return this.container.container.warpper.indexOf(this.container.parentViewRef)
    }

    async onSave(formCtrl: NgForm, toggleChange: MatSlideToggleChange) {
        if (toggleChange.checked) {
            // Disable Change
            toggleChange.source.setDisabledState(true)
            formCtrl.form.disable()
            // Update Card
            try {
                const card = await this.chatbotApi.card.update(this.card._id, this.card, { reload: true })
                formCtrl.form.enable()
                this.resetForm(formCtrl, this.card)
                this.updateCardState()
                this.container.change.emit({
                    status: "save",
                    data: card
                })
            } catch (err) {
                swal("Không thể lưu", "Vui lòng thử lại sau", "warning")
                formCtrl.form.enable()
                this.resetForm(formCtrl, this.cardState)
            }

        }
    }

    resetForm(formCtrl: NgForm, card: iCard | iSetting ) { }

    updateCardState() {
        this.cardState = Object.assign({}, this.card)
    }

    async remove() {
        await swal({
            title: 'Xác nhận xoá thẻ',
            showCancelButton: true,
            confirmButtonText: 'Xoá',
            cancelButtonText: 'Huỷ'
        })
        const currentPortal = this.container.container.portals[this.portalIndex]
        currentPortal.showLoading()
        await this.chatbotApi.card.delete(this.card._id)
        currentPortal.hideLoading()
        this.container.popCardComp(this.index)
        const nextPortal = this.container.container.portals[this.portalIndex + 1]
        if(nextPortal && (nextPortal instanceof StoriesPortalComponent || nextPortal instanceof QuickReplyPortalComponent)) {
            this.container.container.popPortal(this.portalIndex + 1)
        }
        this.container.change.emit({
            status: "remove",
            data: this.card
        })
    }

    async quickReply() {
        const componentRef = this.container.container.pushPortalAt(this.portalIndex + 1, QuickReplyPortalComponent, {
            cardId: this.card._id
        })
        const component = componentRef.instance as QuickReplyPortalComponent
    }
}