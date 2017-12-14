import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from 'angular-2-data-table-bootstrap4';

import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';

import { ColorPickerModule } from 'ngx-color-picker';
import { CustomFormsModule } from 'ng2-validation';

import { TextMaskModule } from 'angular2-text-mask';
import { AreaComponent } from './area/area.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { SellComponent } from './sell/sell.component';
import { ConfigComponent } from './config/config.component';

@NgModule({
  imports: [
    CommonModule,
    SettingsRoutingModule,

    FormsModule,
    ReactiveFormsModule,
    LaddaModule,
    DataTableModule,

    ColorPickerModule,
    CustomFormsModule,
    TextMaskModule
  ],
  declarations: [SettingsComponent, AreaComponent, ScheduleComponent, ChatbotComponent, SellComponent, ConfigComponent],
})
export class SettingsModule { }
