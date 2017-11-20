import { Component, Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DashboardService {
    private actionSource = new BehaviorSubject<string>("");
    selectedAction = this.actionSource.asObservable();

    private employeeSource = new BehaviorSubject<string>("");
    selectedEmployee = this.employeeSource.asObservable();

    private areaSource = new BehaviorSubject<number>(0);
    selectedArea = this.areaSource.asObservable();

    private customerSource = new BehaviorSubject<any>({});
    selectedCustomer = this.customerSource.asObservable();

    private customerNameSource = new BehaviorSubject<any>({});
    selectedCustomerName = this.customerSource.asObservable();

    private billSource = new BehaviorSubject<string>("");
    selectedBill = this.billSource.asObservable();

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
}
