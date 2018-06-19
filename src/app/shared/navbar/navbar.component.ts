import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router, NavigationStart, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/Subscription';
import { InnowayApiService } from '../../services/innoway';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    employee: any

    constructor(
        public location: Location,
        public router: Router,
        public route: ActivatedRoute,
        private element: ElementRef,
        public innowayApi: InnowayApiService
    ) {
    }

    async ngOnInit() {
        this.employee = this.innowayApi.innowayAuth.innowayUser;

    }

    logout() {
        this.innowayApi.innowayAuth.logout();
    }

    goToDashboardLayout() {
        this.router.navigate(['/dashboard-layout'], { relativeTo: this.route });
    }

    goToCustomerLayout() {
        this.router.navigate(['/customer-layout'], { relativeTo: this.route });
    }

    goToEmployeeLayout() {
        this.router.navigate(['/employee-layout'], { relativeTo: this.route });
    }

    goToProductLayout() {
        this.router.navigate(['/product-layout'], { relativeTo: this.route });
    }

    goToPromotionLayout() {
        this.router.navigate(['/promotion-layout'], { relativeTo: this.route });
    }

    goToBillLayout() {
        this.router.navigate(['/bill-layout'], { relativeTo: this.route });
    }

    goToSettingLayout() {
        this.router.navigate(['/setting-layout'], { relativeTo: this.route });
    }

    goToPOSLayout() {
        this.router.navigate(['/pos'], { relativeTo: this.route });
    }

}
