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
        console.log('close',this.index)
        this.container.popCardComp(this.index)
    }

    // focus() {
    //     this.container.swiper.slideTo(this.index)
    // }

    get currentIndex(){
        return 1
    }

    get index() {
        return this.container.cardViewContainer.indexOf(this.viewRef)
    }
}