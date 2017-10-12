import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import * as _ from 'lodash'
@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.scss']
})
export class PosComponent implements OnInit {

  constructor() { 
    this.swiperOptions = {
      spaceBetween: 10,
      scrollbarHide: false,
      mousewheelControl: true,
      slidesPerView: 5,
      slidesPerColumn: 2,
      grabCursor: true
    }
    this.itemsChange = new BehaviorSubject<any[]>(_.times(5, _.stubObject))
  }
  swiperOptions:any;
  itemsChange:BehaviorSubject<any[]>

  ngOnInit() {

  }
  async reloadItems(params) {
    await this.getItems();
  }
  async getItems(){

  }

}

