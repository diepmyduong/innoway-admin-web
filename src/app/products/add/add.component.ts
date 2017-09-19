import { Component, OnInit, ChangeDetectorRef , ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm,NgModel } from '@angular/forms';
import { InnowayService } from '../../services';
import { BehaviorSubject } from "rxjs/BehaviorSubject";

declare var swal, _: any;

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  id: any;
  isEdit: boolean = false;

  submitting: boolean = false;
  categoryService: any;
  toppingService: any;
  unitService: any;
  attributeService: any;

  name: string;
  description: string;
  image: string;
  category: string;
  status: number = 1;
  topping: string;
  basePrice: string;
  price: string;
  images: any[];
  unit: string;
  attribute: string;
  selectedToppingValue: string;

  toppingValues: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  categories: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  toppings: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  units: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  attributes: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  @ViewChild('categoryControl') categoryControl:NgModel;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    public innoway: InnowayService
  ) {
    this.categoryService = innoway.getService('product_category');
    this.toppingService = innoway.getService('topping');
    // this.unitService = innoway.getService('unit');
    // this.attributeService = innoway.getService('attribute');
  }

  async ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    await this.loadCategoryData();
    this.loadToppingData();
    if (this.id == null) {
      this.isEdit = false;
      this.setDefaultData();
    } else {
      this.isEdit = true;
    }

    if (this.isEdit) {
      this.setData();
    }


  }

  setDefaultData() {
    this.status = 1;
    this.category = this.categories.getValue()[0].id;
    return {
      status : this.status,
      category : this.category
    }
  }

  async loadCategoryData() {
    try {
      this.categories = await this.innoway.getAll('product_category', {
        fields: ["id", "name"]
      });
      this.ref.detectChanges();
    } catch (err) {
      console.log("error",err);
      try { await this.alertItemNotFound() } catch (err) { }
      this.router.navigate(['products'])
    }
  }

  async loadToppingData() {
    try {
      this.toppings = await this.innoway.getAll('topping', {
        fields: ["id", "name"]
      });
      alert(JSON.stringify(this.toppings));
      this.toppings.subscribe(toppings => {
        let items = toppings.map(topping => {
          return {
            text: topping.name,
            id: topping.id
          }
        })
        this.selectedToppingValues.next(items);
        console.log("selectedToppingValues",items)
        // let toppingValues = toppings.map(topping => {
        //   return topping.values.name;
        // })
        //this.toppingValues.next(toppingValues);
        //alert(JSON.stringify(toppings));
        this.ref.detectChanges();
      });
    } catch (err) {
      console.log("ERROR", err);
      try { await this.alertItemNotFound() } catch (err) { }
      // this.router.navigate(['products'])
    }
  }

  async getToppingValues(topping_id: string) {
    let topping = await this.toppingService.get(topping_id, {
      fields: [{
        values: ["$all"]
      }]
    });
    return topping.values;
  }

  async loadToppingValueData(toppingId: string) {
    // try {
    //   let data = await this.innoway.getAll('topping_value', {
    //     fields: ["id", "name"],
    //     filter: ["toppingId"]
    //   });
    //   this.toppings = data._value;
    //   this.topping = this.toppings[0].name;
    //   alert(this.toppings);
    //   // this.topping_id.value=this.toppings[0].name;
    //   this.ref.detectChanges();
    // } catch (err) {
    //   try { await this.alertItemNotFound() } catch (err) { }
    //   this.router.navigate(['products'])
    // }
  }

  async setData() {
    // try {
    //   let category = await this.categoryService.get(this.id, {
    //     fields: ["name", "description", "image", "status"]
    //   });
    //   this.name = category.name
    //   this.image = category.image
    //   this.description = category.description
    //   this.status = category.status
    // } catch (err) {
    //   try { await this.alertItemNotFound() } catch (err) { }
    //   this.router.navigate(['product-type'])
    // }
  }

  backToList() {
    this.router.navigate(['/product-type/list'])
  }

  alertItemNotFound() {
    swal({
      title: 'Không còn tồn tại',
      type: 'warning',
      timer: 2000
    })
  }

  alertAddSuccess() {
    return swal({
      title: 'Đã thêm',
      type: 'success',
      timer: 2000,
    })
  }

  alertUpdateSuccess() {
    return swal({
      title: 'Đã cập nhật',
      type: 'success',
      timer: 2000,
    })
  }

  alertFormNotValid() {
    return swal({
      title: 'Nội dung nhập không hợp lệ',
      type: 'warning',
      timer: 2000,
    })
  }

  alertAddFailed() {
    return swal({
      title: 'Thêm không thành công',
      type: 'warning',
      timer: 2000,
    })
  }

  alertUpdateFailed() {
    return swal({
      title: 'Cập nhật không thành công',
      type: 'warning',
      timer: 2000,
    })
  }

  async addItem(form: NgForm) {


  }

  async updateItem(form: NgForm) {
    // if (form.valid) {
    //   let { name, description, image, status } = this;
    //   await this.categoryService.update(this.id, { name, description, image, status })
    //   this.alertUpdateSuccess();
    //   form.reset();
    // } else {
    //   this.alertFormNotValid();
    // }
  }

  async submitAndNew(form: NgForm) {
    this.submitting = true;
    try {
      if (form.valid) {
        let { name, description, image, price , basePrice, unit, status } = this;
        let category_id = this.category;
        let productService = this.innoway.getService('product');
        let product = await productService.add({ name, description, image, price , basePrice, unit, status, category_id })

        this.alertAddSuccess();
        form.resetForm(this.setDefaultData());
      } else {
        this.alertFormNotValid();
      }
    }catch(err){
      console.log('error',err);
    }finally{
      this.submitting = false;
    }
  }

  async submitAndClose(form: NgForm) {
    // this.submitting = true;
    // try {
    //   await this.addItem(form);
    //   this.backToList();
    // } catch (err) {
    //   this.alertAddFailed()
    // } finally {
    //   this.submitting = false;
    // }
  }

  async updateAndClose(form: NgForm) {
    // this.submitting = true;
    // try {
    //   await this.updateItem(form);
    //   this.backToList();
    // } catch (err) {
    //   this.alertUpdateFailed();
    // } finally {
    //   this.submitting = false;
    // }
  }


  public selectedToppingValues: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  private value: any = [];
  private _disabledV: string = '0';
  private disabled: boolean = false;

  private get disabledV(): string {
    return this._disabledV;
  }

  private set disabledV(value: string) {
    this._disabledV = value;
    this.disabled = this._disabledV === '1';
  }

  async selected(value: any) {
    console.log('Selected value is: ', value);
    let { id } = value;
    let values = await this.getToppingValues(id);
    console.log('topping values',values);
    let toppings = this.toppings.getValue();
    console.log('toppings',toppings);
    let index = _.findIndex(toppings, { id });
    console.log('index',index);
    console.log('topping',toppings[index]);
    toppings[index].values = values;
    toppings[index].selected = true;
    this.toppings.next(toppings);

  }

  public removed(value: any): void {
    let { id } = value;
    let toppings = this.toppings.getValue();
    let index = _.findIndex(toppings, { id });
    toppings[index].selected = false;
    this.toppings.next(toppings);
    console.log('Removed value is: ', value);
  }

  public refreshValue(value: any): void {
    this.value = value;
    // alert(value);
  }

  public itemsToString(value: Array<any> = []): string {
    //alert(JSON.stringify(value));
    return value
      .map((item: any) => {
        return item.text;
      }).join(',');
  }
}
