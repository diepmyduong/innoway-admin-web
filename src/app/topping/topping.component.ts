import { Component, OnInit } from '@angular/core';
import { NgZone } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

declare let innoway2:any;

@Component({
  selector: 'app-topping',
  templateUrl: './topping.component.html',
  styleUrls: ['./topping.component.scss']
})
export class ToppingComponent implements OnInit {

  constructor(private zone: NgZone, private router: Router) { }

  toppingValues: [any] =[{}];
  seletectedItems: string[] = [];
  isMultipleSelect: boolean = false;
  searchName:string="";
  numberOfItem:number=10;
  numberOfPage:number=0;
  pageOptions: number[] = [10,25,50,100,200];
  currentPageOption: number;

  ngOnInit() {
  	innoway2.api.module('topping_value').getAll().then(data =>{
      this.zone.run(()=>{
        this.toppingValues=data;
      });
        // if (data) {
        //   var count = 0;
        //   data.forEach((item) => {
        //     this.items.push(new Topping(item.id, item.name, item.description, item.price, item.status, count.toString(), false));
        //     count++;
        //   });
        // }
  	}).catch(err =>{
  		console.error(err);
  	});
  }

  selectItem(model){
    alert("select "+model.id);
  	this.router.navigate(['/topping/detail', model.id]);
  }

  addItem(){
    this.router.navigate(['/topping/add']);
  }

  editItem(model){
    this.router.navigate(['/topping/add', model.id]);
  }

  viewItem(model){
    this.router.navigate(['/topping/detail', model.id]);
  }

  deleteItem(model){
  	innoway2.api.module('topping-value').delete(model.id).then(data =>{
  		this.reloadPage();
  		alert("delete "+model.id);
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
    this.toppingValues.forEach((item) => {
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
  }
}
