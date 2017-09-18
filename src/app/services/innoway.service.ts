import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

/*
  Generated class for the InnowayProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/

declare var innoway2,$:any;

@Injectable()
export class InnowayService {

  modules = [
    'product_category',
    'product',
    'customer',
    'topping',
    'basket',
    'topping_value',
    'employee',
    'bill',
    'unit',
    'attribute',
    'category',
    'employee_type',
    'customer_type',
    'branch',
    'brand'
  ]
  service_items:any = {}
  services:any = {}
  authState:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  constructor() {
    console.log('Hello InnowayProvider Provider');
    this.modules.forEach(m =>{
      this.services[m] = innoway2.api.module(m);
      this.service_items[m] = new BehaviorSubject<[any]>([{}]);
      $(this.services[m]).on('on_change',(e,data)=>{
        this.service_items[m].next(data.items);
      })
    })
    this.runAuthService();

  }

  async getAll(module,options = {}){
    options = Object.assign({
      page: 1,
      limit: 20
    },options);
    console.log("query",options);
    var items = await innoway2.api.module(module).getAllWithQuery(options);
    this.service_items[module].next(items);
    return this.service_items[module];
  }

  async getAllWithoutQuery(module){
    var items = await innoway2.api.module(module).getAll();
    this.service_items[module].next(items);
    return this.service_items[module];
  }

  getService(module){
    return this.services[module];
  }

  getAuthState(){
    return this.authState;
  }

  private runAuthService(){
    $(this.services['customer']).on('on_auth_change',(e,state)=>{
      this.authState.next(state);
    });
  }

  getAccessToken(){
    return innoway2.api.getAccessToken();
  }

  setAccessToken(token){
    return innoway2.api.setAccessToken(token);
  }
}
