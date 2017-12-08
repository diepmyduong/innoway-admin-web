import { Injectable } from '@angular/core';
import { InnowayAuthService } from './innoway-auth.service'
import { InnowayConfigService } from './innoway-config.service'
import { Attribute } from './api/crud/attribute'
import { Product } from './api/crud/product'
@Injectable()
export class InnowayApiService {

  constructor(
    public innowayConfig: InnowayConfigService,
    public innowayAuth: InnowayAuthService
  ) { 

  }
  attribute = new Attribute(this)
  product = new Product(this)
}
