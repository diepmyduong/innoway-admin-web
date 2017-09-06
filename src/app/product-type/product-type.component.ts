import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgZone } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { InnowayServiceService } from '../services/innoway-service.service';

declare let innoway2:any;

@Component({
  selector: 'app-product-type',
  templateUrl: './product-type.component.html',
  styleUrls: ['./product-type.component.scss']
})
export class ProductTypeComponent implements OnInit {

  service:any;
  canLoadMore = true;
  limit = 20;
  isMultipleSelect: boolean = false;
  seletectedItems: string[] = [];
  searchName:string="";
  numberOfItem:number=10;
  numberOfPage:number=0;
  pageOptions: number[] = [10,25,50,100,200];
  currentPageOption: number;
  categories:BehaviorSubject<[any]> = null;
  thumbDefaultCategory: string = "http://www.breeze-animation.com/app/uploads/2013/06/icon-product-gray.png";

  constructor(
    private zone:NgZone,
  	private router:Router,
    private Innoway: InnowayServiceService,
    private ref: ChangeDetectorRef
  ) { 
    
  }

  ngOnInit() {
    this.getCategories();
    this.service = this.Innoway.services['product_category'];
  }

  async getCategories(){
    this.categories = await this.Innoway.getAll('product_category');
  }

  selectItem(model){
    alert("select "+model.id);
  	this.router.navigate(['/product-type/detail', model.id]);
  }

  addItem(){
    this.router.navigate(['/product-type/add']);
  }

  editItem(model){
    this.router.navigate(['/product-type/add', model.id]);
  }

  viewItem(model){
    this.router.navigate(['/product-type/detail', model.id]);
  }

  deleteItem(model){
  	innoway2.api.module('product_category').delete(model.id).then(data =>{
      this.ref.detectChanges();
  	}).catch(err =>{
  		console.error(err);
  	});
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
    this.categories.forEach((item:any) => {
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
    this.currentPageOption=data;
    alert(data);
  }

  errorHandler(event) {
    console.debug(event);
    event.target.src = this.thumbDefaultCategory;
  }

  async loadMore(){
    var items = await this.service.getAllWithQuery({
      page: this.service.pagination.next_page
    });

    if(items.length == 0 || items.length < this.limit) this.canLoadMore = false;

    this.ref.detectChanges();
  }
}
