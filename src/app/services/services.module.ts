import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InnowayService } from './innoway.service';
<<<<<<< HEAD
import { AuthService } from './auth.service';

//Guard
import { AuthGuard } from './guards/auth.guard';
import { AnonymousGuard } from './guards/anonymous.guard';
=======
>>>>>>> master

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
<<<<<<< HEAD
  providers: [
    InnowayService,
    AuthService,

    AuthGuard,

    AnonymousGuard,
  ]
=======
  providers: [InnowayService]
>>>>>>> master
})
export class ServicesModule { }
