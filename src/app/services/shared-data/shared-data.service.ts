import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable() 
export class SharedDataService {
  billFilterInfo = {};
  employees: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  employeeData: any;
}