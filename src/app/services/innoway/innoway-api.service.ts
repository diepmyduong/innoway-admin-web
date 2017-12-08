import { Injectable } from '@angular/core';
import { InnowayAuthService } from './innoway-auth.service'
import { InnowayConfigService } from './innoway-config.service'

@Injectable()
export class InnowayApiService {

  constructor(
    public innowayConfig: InnowayConfigService,
    public innowayAuth: InnowayAuthService
  ) { 

  }
}
