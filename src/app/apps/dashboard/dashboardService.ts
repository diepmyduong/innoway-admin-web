import { Component, Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DashboardService {
  private actionSource = new BehaviorSubject<string>(null);
  selectedAction = this.actionSource.asObservable();

  private employeeSource = new BehaviorSubject<any>(null);
  selectedEmployee = this.employeeSource.asObservable();

  private areaSource = new BehaviorSubject<number>(0);
  selectedArea = this.areaSource.asObservable();

  private customerSource = new BehaviorSubject<string>(null);
  selectedCustomer = this.customerSource.asObservable();

  private customerNameSource = new BehaviorSubject<string>(null);
  selectedCustomerName = this.customerNameSource.asObservable();

  private billSource = new BehaviorSubject<string>("");
  selectedBill = this.billSource.asObservable();

  private loadDailySummarySource = new BehaviorSubject<boolean>(false);
  loadDailySummary = this.loadDailySummarySource.asObservable();

  // private updateTopicFromFCMSource = new BehaviorSubject<any>({});
  // updateTopicFromFCM = this.updateTopicFromFCMSource.asObservable();

  private filterBillSource = new BehaviorSubject<boolean>(false);
  filterBill = this.filterBillSource.asObservable();

  filterBillAction(update: any) {
    this.filterBillSource.next(update);
  }

  // getTopicFromFCM(update: any) {
  //   // this.updateTopicFromFCMSource.next(update);
  // }

  updateAction(update: any) {
    this.actionSource.next(update);
  }

  updateEmployee(update: any) {
    this.employeeSource.next(update);
  }

  updateArea(update: any) {
    this.areaSource.next(update);
  }

  updateCustomer(update: any) {
    this.customerSource.next(update);
  }

  updateCustomerName(update: any) {
    this.customerNameSource.next(update);
  }

  updateBill(update: any) {
    this.billSource.next(update);
  }

  updateDailySummary(update: any) {
    this.loadDailySummarySource.next(update)
  }
}
