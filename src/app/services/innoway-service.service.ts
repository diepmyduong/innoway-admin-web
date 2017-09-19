import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

declare var $,innoway2:any;

@Injectable()
export class InnowayServiceService {

  service_items:any = {}
  services:any = {};
  modules = [
  	'product_category'
  ] 

  constructor() { 
  	this.modules.forEach(module =>{
  		this.services[module] = innoway2.api.module(module);
  		this.service_items[module] = new BehaviorSubject<[any]>([{}]);

  		$(this.services[module]).on('on_change',(e,data)=>{
  			console.log("on_change",data.items);
  			this.service_items[module].next(data.items);
  		})
  	})
  }

  async getAll(module){
  	var items = await innoway2.api.module(module).getAllWithQuery({
  		page: 1
  	});
  	this.service_items[module].next(items);
  	return this.service_items[module]
  }

}
