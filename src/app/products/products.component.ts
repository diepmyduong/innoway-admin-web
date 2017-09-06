import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgZone } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { InnowayService } from '../services';

declare let innoway2:any;

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  service:any;
  canLoadMore = true;
  limit = 1;
  isMultipleSelect: boolean = false;
  seletectedItems: string[] = [];
  searchName:string="";
  numberOfItem:number=10;
  numberOfPage:number=0;
  pageOptions: number[] = [1,2,3,10,20,50,100,200];
  currentPageOption: number;
  products:BehaviorSubject<[any]> = null;
  thumbDefaultCategory: string = "http://www.breeze-animation.com/app/uploads/2013/06/icon-product-gray.png";
  productService:any;


  constructor(
    private zone:NgZone,
    private router:Router,
    private innoway: InnowayService,
    private ref: ChangeDetectorRef
  ) {

  }

  ngOnInit() {
    this.getproducts({
      limit: this.limit
    });
    this.productService = this.innoway.getService('products');
  }

  async getproducts(...params){
    console.log(params);
    this.products = await this.innoway.getAll('products',params);
  }

  selectItem(model){
    alert("select "+model.id);
    this.router.navigate(['/products/detail', model.id]);
  }

  addItem(){
    this.router.navigate(['/products/add']);
  }

  editItem(model){
    this.router.navigate(['/products/add', model.id]);
  }

  viewItem(model){
    this.router.navigate(['/products/detail', model.id]);
  }

  async deleteItem(model){
    await this.productService.delete(model.id);
    this.ref.detectChanges();
  }

  reloadPage() { // click handler or similar
    this.zone.runOutsideAngular(() => {
        location.reload();
    });
  }

  switchModeSelectItem(event){
    this.isMultipleSelect=event;
  }

  selectAllItems(){
    this.seletectedItems=[];
    this.products.forEach((item:any) => {
      this.seletectedItems.push(item.id);
    });
  }

  deselectAllItems(){
    this.seletectedItems=[];
  }

  deleteSelectedItems(){
    alert(this.seletectedItems);
  }

  queryName(event){
    alert(event);
  }

  queryKeyDownFunction(event, data) {
    if(event.keyCode == 13) {
      alert(data);
    }
  }

  onChangePageOption(data){
    this.limit=data;
    alert(data);
  }

  errorHandler(event) {
    console.debug(event);
    event.target.src = this.thumbDefaultCategory;
  }

  async loadMore(){
    var items = await this.productService.getAllWithQuery({
      page: this.service.pagination.next_page,
      limit:this.limit
    });

    if(items.length == 0 || items.length < this.limit) this.canLoadMore = false;

    this.ref.detectChanges();
  }

}
