import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationTypeRoutingModule } from './notification-type-routing.module';
import { NotificationTypeComponent } from './notification-type.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  imports: [
    CommonModule,
    NotificationTypeRoutingModule
  ],
  declarations: [NotificationTypeComponent, AddComponent, DetailComponent]
})
export class NotificationTypeModule { }
