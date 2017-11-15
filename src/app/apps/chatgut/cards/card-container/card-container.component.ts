import { Component, OnInit, ComponentFactoryResolver, ViewContainerRef, ViewChild, ElementRef, Input, ViewRef, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Subscription } from 'rxjs/Subscription'
import { PortalContainerComponent } from '../../portals'
import { iCard } from 'app/services/chatbot'
import { MatSlideToggle } from '@angular/material'
import * as _ from 'lodash'
declare var $:any;
export interface iOnCardsChange {
  status: string,
  data: iCard
}
@Component({
  selector: 'app-card-container',
  templateUrl: './card-container.component.html',
  styleUrls: ['./card-container.component.scss']
})
export class CardContainerComponent implements OnInit {

  @Input() container:PortalContainerComponent
  @Input() parentViewRef: ViewRef
  @Input() cards: iCard[]
  @Output() change = new EventEmitter<iOnCardsChange>()
  @ViewChild("cardViewContainer", { read: ViewContainerRef }) cardViewContainer: ViewContainerRef
  @ViewChild("cardListRef", { read: ElementRef }) cardListRef: ElementRef
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewRef: ViewContainerRef
  ) {
    this.cardComps = []
    this.cardInited = new BehaviorSubject<number>(-1)
  }
  cardComps: any[]
  cardInited: BehaviorSubject<number>

  ngOnInit() {
  }

  pushCardComp(cardComp: any, params: any = {}, scroll:boolean = true) {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(cardComp);
    let componentRef = componentFactory.create(this.cardViewContainer.parentInjector)
    let newIndex = this.cardComps.length
    let viewRef = this.cardViewContainer.insert(componentRef.hostView, newIndex)
    let component: any = componentRef.instance
    component.viewRef = viewRef
    component.viewInited = this.cardInited
    _.merge(component, params)
    this.cardComps.push(component)
    if(scroll)  this.scrollToBottom()
    return componentRef
  }

  scrollToBottom(): void {
    try {
      $(this.cardListRef.nativeElement)
        .closest('.portal-content-block')
        .animate({ 
          scrollTop:this.cardListRef.nativeElement.scrollHeight
        },1000)
    } catch (err) { }
  }

  popCardComp(index:number){
    this.cardViewContainer.remove(index)
    this.cardComps.splice(index,1)
  }

  async saveCards() {
    for(let cardCmp of this.cardComps) {
      const saveToggle = cardCmp.saveToggle as MatSlideToggle
      if(saveToggle && !saveToggle.checked && cardCmp.cardFrm && cardCmp.onSave) {
        saveToggle.toggle()
        cardCmp.onSave(cardCmp.cardFrm, {
          checked: saveToggle.checked,
          source: saveToggle
        })
      }
    }
  }

}
