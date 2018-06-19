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
        private element : ElementRef,
        public innowayApi: InnowayApiService
    ) {
    }

    async ngOnInit() {
        this.employee = this.innowayApi.innowayAuth.innowayUser;

    }
}
