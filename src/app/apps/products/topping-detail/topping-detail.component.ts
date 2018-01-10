import { Component, OnInit, Input } from '@angular/core';
import { iTopping } from 'app/services/innoway';

@Component({
  selector: 'app-topping-detail',
  templateUrl: './topping-detail.component.html',
  styleUrls: ['./topping-detail.component.scss']
})
export class ToppingDetailComponent implements OnInit {

  @Input() topping: iTopping
  @Input() price: string
  constructor() { }

  ngOnInit() {
  }

  async showPrice(value_price) {
    return value_price + parseInt(this.price);
  }

}
