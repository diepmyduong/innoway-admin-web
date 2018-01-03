import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { InnowayApiService } from 'app/services/innoway'
import { DetailPageInterface } from "app/apps/interface/detailPageInterface";
import { NgModel } from "@angular/forms";
import { SelectComponent } from "ng2-select";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Subscription } from 'rxjs/Subscription'
import * as Ajv from 'ajv';
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

import * as Console from 'console-prefix'

declare var swal, _: any;
declare var $:any;

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  item: any;
  itemFields: any;

  id: any;
  isEdit: boolean = false;

  submitting: boolean = false;

  name: string;
  description: string;
  category: string;
  status: string;
  topping: string;
  base_price: string;
  price: string;
  list_image: any[] = [];
  image_on_hover: number;
  unit: string;
  attribute: string;
  thumb: string;
  product_type: string;
  topping_items = new BehaviorSubject<any[]>([]);

  toppingValues = new BehaviorSubject<any[]>([]);
  categories = new BehaviorSubject<any[]>([]);
  toppings = new BehaviorSubject<any[]>([]);
  units = new BehaviorSubject<any[]>([]);
  attributes = new BehaviorSubject<any[]>([]);

  numberMask = createNumberMask({
    prefix: '',
    suffix: ' đ'
  })

  @ViewChild('categoryControl') categoryControl: NgModel;
  @ViewChild('toppingSelecter') toppingSelecter: SelectComponent;
  @ViewChild('imageSwiper') imageSwiper: any;

  imageConfig = {
    pagination: '.swiper-pagination',
    paginationClickable: true,
    slidesPerView: 3,
    centeredSlides: true,
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    spaceBetween: 10
  };
  subscriptions: Subscription[] = []

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public innowayApi: InnowayApiService
  ) {
  }

  async ngOnInit() {

    this.id = this.route.snapshot.params['id'];
    await this.loadToppingData();
    if (this.id) {
      this.setData()
    } else {
      this.alertItemNotFound()
      this.backToList()
    }

    $.FroalaEditor.froalaEditor({
      htmlAllowedAttrs: ['readonly','title', 'href', 'alt', 'src', 'style']
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach( subscription => {
      subscription.unsubscribe()
    })
  }

  get log() { return Console(`[Product Detail]`).log }

  async setData() {
    try {
      let product = await this.innowayApi.product.getItem(this.id, {
        local: true, reload: true, query: {
          fields: ["$all", {
            toppings: ["id", {
              topping: ["id", "name", {
                values: ["id", "name"]
              }]
            }],
            unit: ["name"],
            category: ["name"],
            product_type: ["name"]
          }]
        }
      })

      this.name = product.name
      this.thumb = product.thumb
      this.description = product.description
      this.price = _.toString(product.price)
      this.base_price = _.toString(product.base_price)
      this.unit = product.unit == null ? "Không có" : product.unit.name;
      this.status = product.status == 1 ? "Hoạt động" : "Không hoạt động";
      this.category = product.category.name;
      this.product_type = product.product_type == null ? "Không có" : product.product_type.name;
      this.list_image = product.list_image;
      let toppings = this.toppings.getValue();
      if (toppings != null) {
        this.toppingSelecter.active = product.toppings.map(product_topping => {
          let index = _.findIndex(toppings, { id: product_topping.topping.id });
          toppings[index].values = product_topping.topping.values;
          toppings[index].selected = true;
          return {
            id: product_topping.topping.id,
            text: product_topping.topping.name
          }
        })
        this.toppings.next(toppings);
      }
    } catch (err) {
      console.log('ERROR', err);
      try { await this.alertItemNotFound() } catch (err) { }
      this.backToList()
    }
  }

  editItem() {
    this.router.navigate(['../add', this.id], { relativeTo: this.route });
  }

  backToList() {
    this.router.navigate(['../list'], { relativeTo: this.route });
  }

  alertItemNotFound() {
    return swal({
      title: 'Không còn tồn tại',
      type: 'warning',
      timer: 2000
    })
  }

  async loadToppingData() {
    try {
      this.subscriptions.push(this.toppings.subscribe(toppings => {
        let items = toppings.map(topping => {
          return {
            text: topping.name,
            id: topping.id
          }
        })
        this.topping_items.next(items);
      }))
      this.toppings.next(await this.innowayApi.topping.getList({
        local: true, reload: true, query: {
          fields: ["id", "name"],
          limit: 0
        }
      }))
    } catch (err) {
      console.error("cannot load toppings", err);
    }
  }
}
