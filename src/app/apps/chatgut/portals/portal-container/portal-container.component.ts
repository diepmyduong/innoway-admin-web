import { Component, OnInit, ViewChild, ComponentFactoryResolver, ViewContainerRef, ChangeDetectorRef, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Subscription } from 'rxjs/Subscription'
import * as _ from 'lodash'
@Component({
  selector: 'app-portal-container',
  templateUrl: './portal-container.component.html',
  styleUrls: ['./portal-container.component.scss']
})
export class PortalContainerComponent implements OnInit {

  @ViewChild("swiper") swiperComp: any
  @ViewChild("swiperWrapper", {read: ViewContainerRef}) swiperWrapper: ViewContainerRef
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    public ref: ChangeDetectorRef,
    public zone: NgZone
  ) {
    this.swiperOptions = {
      spaceBetween: 10,
      scrollbarHide: false,
      mousewheelControl: true,
      slidesPerView: 'auto',
      grabCursor: false,
      autoResize: false,
      slideToClickedSlide: true,
      scrollbar: {
        el: '.portal-scrollbar',
        draggable: true,
      },
    }
    this.portals = []
    this.portalInited = new BehaviorSubject<number>(-1)
    
  }
  swiperOptions:any
  portals:any[]
  portalInited: BehaviorSubject<number>
  subscriptions: { [key:string] : Subscription } = {}

  async ngOnInit() {
    
  }

  async ngAfterViewInit() {
    this.subscriptions.portalInited = this.portalInited.subscribe((index => {
      this.swiper.slideTo(index);
    }).bind(this))
  }

  async ngOnDestroy() {
    this.subscriptions.portalInited.unsubscribe()
  }

  get swiper(){
    return this.swiperComp.Swiper
  }
  get warpper() {
    return this.swiperWrapper
  }

  pushPortal(portalComp:any, params:any = {}) {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(portalComp);
    let componentRef = componentFactory.create(this.swiperWrapper.parentInjector)
    let newIndex = this.portals.length
    let viewRef = this.swiperWrapper.insert(componentRef.hostView,newIndex)
    let component:any = componentRef.instance
    component.viewRef = viewRef
    component.viewInited = this.portalInited
    _.merge(component,params)
    this.portals.push(component)
    return componentRef
  }

  clear() {
    this.swiperWrapper.clear()
    this.portals = []
  }

  popPortal(index:number) {
    this.zone.run(()=>{
      const l = this.swiperWrapper.length
      for(let i = index; i < l; i++){
        this.swiperWrapper.remove(i)
        this.ref.detectChanges()
      }
      this.portals.length = index
      this.swiper.slideTo(index - 1)
    })
  }

  pushPortalAt(index:number, portalComp:any, params:any = {}) {
    this.popPortal(index)
    return this.pushPortal(portalComp,params)
  }

}
