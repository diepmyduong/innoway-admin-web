import { Component, OnInit, HostBinding, Host, Input, Output, EventEmitter, ViewRef } from '@angular/core';
import { CardContainerComponent } from './card-container.component'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Subscription } from 'rxjs/Subscription'
import * as _ from 'lodash'
export class BaseCard {
    // @HostBinding('class.swiper-slide') swiperSlideClass = true

    constructor(
        @Host() protected container: CardContainerComponent
    ) {
        this.subscriptions = {}
    }
    viewInited: BehaviorSubject<number>
    subscriptions: { [key: string]: Subscription }
    viewRef: ViewRef

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
        
        if(fromIndex < toIndex) {
            this.container.cardComps.splice(toIndex + 1, 0,fromComp)
            this.container.cardComps.splice(fromIndex, 1)
        } else {
            this.container.cardComps.splice(toIndex, 0,fromComp)
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
}