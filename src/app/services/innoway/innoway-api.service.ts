import { Injectable } from '@angular/core';
import { InnowayAuthService } from './innoway-auth.service'
import { InnowayConfigService } from './innoway-config.service'
import { FcmService } from './fcm.service'
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
import { Promotion } from './api/crud/promotion'
import { CustomerType } from './api/crud/customer-type'
import { Customer } from './api/crud/customer'
import { BrandShip } from './api/crud/brand-ship';
import { PromotionType } from './api/crud/promotion-type'
import { ToppingValue } from './api/crud/topping-value'
import { CustomerTypePromotion } from './api/crud/customer-type-promotion'
import { BillSubFee } from './api/crud/bill-sub-fee'
import { BillRelatedPeople } from './api/crud/bill-related-people'

@Injectable()
export class InnowayApiService {

  constructor(
    public innowayConfig: InnowayConfigService,
    public innowayAuth: InnowayAuthService,
    public fcm: FcmService
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
  promotion = new Promotion(this)
  customerType = new CustomerType(this)
  customer = new Customer(this)
  brandShip = new BrandShip(this)
  promotionType = new PromotionType(this)
  toppingValue = new ToppingValue(this)
  customerTypePromotion = new CustomerTypePromotion(this)
  billSubFee = new BillSubFee(this)
  billRelatedPeople = new BillRelatedPeople(this)
}
