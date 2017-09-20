import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { InnowayService } from "app/services";
import { DetailPageInterface } from "app/apps/interface/detailPageInterface";
import { NgModel } from "@angular/forms";
import { SelectComponent } from "ng2-select";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import * as Ajv from 'ajv';
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

declare var swal, _: any;

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, DetailPageInterface {
  item: any;
  itemFields: any;

  id: any;
  isEdit: boolean = false;

  submitting: boolean = false;
  categoryService: any;
  toppingService: any;
  unitService: any;
  attributeService: any;
  productService: any;

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


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public innoway: InnowayService
  ) {
    this.productService = innoway.getService('product');
    this.toppingService = innoway.getService('topping');
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
  }

  async setData() {
    try {
      let product = await this.productService.get(this.id, {
        fields: ["$all", {
          toppings: ["id", {
            topping: ["id", "name", {
              values: ["id", "name"]
            }]
          }],
          unit: ["name"],
          category: ["name"]
        }]
      });

      this.name = product.name;
      this.thumb = product.thumb;
      this.description = product.description;
      this.price = product.price;
      this.base_price = product.base_price;
      this.unit = product.unit == null ? "" : product.unit.name;
      this.status = product.status == 1?"Hoạt động":"Không hoạt động";
      this.category = product.category.name;
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
    this.router.navigate(['../../add', this.id], { relativeTo: this.route });
  }

  backToList() {
    this.router.navigate(['../../list'], { relativeTo: this.route });
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
      this.toppings = await this.innoway.getAll('topping', {
        fields: ["id", "name"]
      });
      this.toppings.subscribe(toppings => {
        let items = toppings.map(topping => {
          return {
            text: topping.name,
            id: topping.id
          }
        })
        this.topping_items.next(items);
      });
    } catch (err) {
      console.error("cannot load toppings", err);
    }
  }
}
