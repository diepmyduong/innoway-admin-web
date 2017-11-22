import { Component, OnInit, HostBinding, Host, Input, Output, EventEmitter, ViewRef } from '@angular/core';
import { PortalContainerComponent } from './portal-container.component'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Subscription } from 'rxjs/Subscription'
import * as _ from 'lodash'
export interface IProgressBarOption {
    show: boolean
    color: 'primary' | 'accent' | 'warn'
    mode: 'determinate' | 'indeterminate' | 'buffer' | 'query'
    value: number
    buffer: number
}
export class BasePortal {
    @HostBinding('class.swiper-slide') swiperSlideClass = true

    constructor(
        @Host() protected container: PortalContainerComponent,
        // protected viewRef: ViewContainerRef
    ) {
        this.subscriptions = {}
    }
    viewInited: BehaviorSubject<number>
    subscriptions: { [key:string]: Subscription }
    viewRef: ViewRef
    progressBar: IProgressBarOption = {
        show: false,
        color: 'primary',
        mode: 'query',
        value: 0,
        buffer: 0
    }

    async ngAfterContentInit() {
        setTimeout(()=>{
            this.viewInited.next(this.index)
        })
    }

    async ngOnDestroy() {
        _.forEach(this.subscriptions,(sub:Subscription) => {
            sub.unsubscribe()
        })
    }

    async close() {
        this.container.popPortal(this.index)
    }

    async focus() {
        this.container.swiper.slideTo(this.index)
    }

    get currentIndex(){
        return 1
    }

    get index() {
        return this.container.swiperWrapper.indexOf(this.viewRef)
    }

    showLoading() {
        setTimeout(() => { this.progressBar.show = true })
    }

    hideLoading() {
        setTimeout(() => { this.progressBar.show = false })
    }
}