import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Guard
import { AuthGuard } from './guards/auth.guard';
import { FirebaseAuthGuard } from './innoway/firebase-auth.guard'
import { InnowayConfigService } from './innoway/innoway-config.service';
import { InnowayAuthService } from './innoway/innoway-auth.service';
import { InnowayApiService } from './innoway/innoway-api.service';
import { FcmService } from './innoway/fcm.service'
import { SharedDataService } from './shared-data/shared-data.service'
import { Globals } from "app/globals";
import { IntroService } from './intro.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    AuthGuard,
    InnowayConfigService,
    InnowayAuthService,
    InnowayApiService,
    SharedDataService,
    FirebaseAuthGuard,
    FcmService,
    Globals,
    IntroService
  ]
})
export class ServicesModule { }
