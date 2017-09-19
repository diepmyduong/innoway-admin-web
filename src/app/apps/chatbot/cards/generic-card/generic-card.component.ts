import { Component, OnInit, Input, Output, EventEmitter,ViewChild,AfterViewInit } from '@angular/core';


@Component({
  selector: 'app-generic-card',
  templateUrl: './generic-card.component.html',
  styleUrls: ['./generic-card.component.scss']
})
export class GenericCardComponent implements OnInit,AfterViewInit {

  @Input() data:any;
  @Output() onEdited = new EventEmitter<any>();
  @Output() onRemoved = new EventEmitter<any>();
  @Output() onOrderChanged = new EventEmitter<any>();
  @Output() onAddButton = new EventEmitter<any>();
  @Output() onEditButton = new EventEmitter<any>();
  @Output() onRemoveButton = new EventEmitter<any>();
  @Output() onPostback = new EventEmitter<any>();
  @Output() onQuickReplies = new EventEmitter<any>();
  @Output() onAddElement = new EventEmitter<any>();
  @Output() onEditElement = new EventEmitter<any>();
  @Output() onRemoveElement = new EventEmitter<any>();

  @ViewChild('mySwiper') mySwiper:any;
  imagePlaceholder = "./assets/img/image-placeholder.png"
  swiper:any;

  constructor() { }

  ngOnInit() {
    // this.mySwiper.
    // this.swiper = ;
    
    // this.swiper.slideTo(this.swiper.slides.length - 1);
  }
  ngAfterViewInit(){
    // console.log("After View Init",this);
    if(this.mySwiper.Swiper){
      this.swiper = this.mySwiper.Swiper;
      console.log("SWIPER",this.swiper);
    }
    
  }

  editCard(){
    this.onEdited.emit(this.data);
  }

  removeCard(){
    this.onRemoved.emit(this.data);
  }

  upOrder(){
    this.onOrderChanged.emit("up");
  }

  downOrder(){
    this.onOrderChanged.emit("down");
  }

  addElementButton(elementIndex){
    this.onAddButton.emit({
      elementIndex: elementIndex
    });
  }

  editElementButton(elementIndex,buttonIndex){
    this.onEditButton.emit({
      elementIndex: elementIndex,
      buttonIndex: buttonIndex
    });
  }

  removeElementButton(elementIndex,buttonIndex){
    this.onRemoveButton.emit({
      elementIndex: elementIndex,
      buttonIndex: buttonIndex
    });
  }

  showStory(elementIndex,buttonIndex){
    this.onPostback.emit({
      elementIndex: elementIndex,
      buttonIndex: buttonIndex
    });
  }

  quickReplies(){
    this.onQuickReplies.emit();
  }

  config: Object = {
      pagination: '.swiper-pagination',
      paginationClickable: true,
      slidesPerView: 1,
      centeredSlides: true,
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev',
      spaceBetween: 10
  };

  addElement(){
    this.onAddElement.emit(this.swiper);
  }

  editElement(elementIndex){
    this.onEditElement.emit(elementIndex);
  }

  removeElement(elementIndex){
    console.log('SWIPER',this.swiper);
    this.onRemoveElement.emit({
      swiper: this.swiper,
      index: elementIndex
    });
  }

}
