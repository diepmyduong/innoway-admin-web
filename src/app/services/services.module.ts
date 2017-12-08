import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InnowayService } from './innoway.service';
import { AuthService } from './auth.service';

//Guard
import { AuthGuard } from './guards/auth.guard';
import { AnonymousGuard } from './guards/anonymous.guard';
import { InnowayConfigService } from './innoway/innoway-config.service';
import { InnowayAuthService } from './innoway/innoway-auth.service';
import { InnowayApiService } from './innoway/innoway-api.service';

import { SharedDataService } from './shared-data/shared-data.service'

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    InnowayService,
    AuthService,
    AuthGuard,
    AnonymousGuard,
    InnowayConfigService,
    InnowayAuthService,
    InnowayApiService,
    SharedDataService,
  ]
})
export class ServicesModule { }
