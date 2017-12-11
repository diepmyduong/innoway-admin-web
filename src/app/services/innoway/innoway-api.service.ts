import { Injectable } from '@angular/core';
import { InnowayAuthService } from './innoway-auth.service'
import { InnowayConfigService } from './innoway-config.service'
import { Attribute } from './api/crud/attribute'
import { Product } from './api/crud/product'
import { ProductCategory } from './api/crud/product-category'
import { ProductType } from './api/crud/product-type'
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
}
