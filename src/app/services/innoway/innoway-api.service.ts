import { Injectable } from '@angular/core';
import { InnowayAuthService } from './innoway-auth.service'
import { InnowayConfigService } from './innoway-config.service'
import { Attribute } from './api/crud/attribute'
import { Product } from './api/crud/product'
import { ProductCategory } from './api/crud/product-category'
import { ProductType } from './api/crud/product-type'
import { Topping } from './api/crud/topping'
import { Unit } from './api/crud/unit'
import { ShipArea } from './api/crud/ship-area'
import { Brand } from './api/crud/brand'
import { Branch } from './api/crud/branch'
import { Bill } from './api/crud/bill'
import { BillActivity } from './api/crud/bill-activity'
import { Employee } from './api/crud/employee'
import { PaidHistory } from './api/crud/paid-history'
@Injectable()
export class InnowayApiService {

  constructor(
    public innowayConfig: InnowayConfigService,
    public innowayAuth: InnowayAuthService
  ) { 

  }
  attribute = new Attribute(this)
  product = new Product(this)
  productCategory = new ProductCategory(this)
  productType = new ProductType(this)
  topping = new Topping(this)
  unit = new Unit(this)
  shipArea = new ShipArea(this)
  brand = new Brand(this)
  branch = new Branch(this)
  bill = new Bill(this)
  billActivity = new BillActivity(this)
  employee = new Employee(this)
  paidHistory = new PaidHistory(this)
}
