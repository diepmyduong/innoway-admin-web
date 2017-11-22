import { Component, OnInit, HostBinding, Host, Input, Output, EventEmitter, ViewRef } from '@angular/core';
import { ButtonContainerComponent } from './button-container.component'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Subscription } from 'rxjs/Subscription'
import * as _ from 'lodash'
export class BaseButton {
    @Input() button:any
    @Output() onClick = new EventEmitter<any>()
    constructor(
        @Host() public container: ButtonContainerComponent
    ) {
        this.subscriptions = {}
    }
    viewInited: BehaviorSubject<number>
    subscriptions: { [key:string]: Subscription }
    viewRef: ViewRef

    ngAfterContentInit() {
        setTimeout(()=>{
            this.viewInited.next(this.index)
        })
    }

    ngOnDestroy() {
        _.forEach(this.subscriptions,(sub:Subscription) => {
            sub.unsubscribe()
        })
    }

    async close() {
        this.container.popButtonComp(this.index)
    }

    // focus() {
    //     this.container.swiper.slideTo(this.index)
    // }

    get currentIndex(){
        return 1
    }

    get index() {
        return this.container.buttonViewContainer.indexOf(this.viewRef)
    }

    async editTitle(){
        this.button.title = await this.container.getTitleDialog(this.button.title)
        this.container.onButtonChange(this.index)
    }

    async defaultAction(button) {
        this.onClick.emit(this.button)
        this.container.onButtonClick.emit(this)
    }
}

export interface IValidButtons {
    web_url?: any,
    postback?: any,
    phone_number?: any,
    nested?: any,
    quick_reply_text?: any,
    quick_reply_location?: any,
}