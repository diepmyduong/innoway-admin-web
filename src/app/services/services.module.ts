import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InnowayService } from './innoway.service';
import { AuthService } from './auth.service';

//Guard
import { AuthGuard } from './guards/auth.guard';
import { AnonymousGuard } from './guards/anonymous.guard';

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
  ]
})
export class ServicesModule { }
