import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss']
})
export class BillsComponent implements OnInit {

  constructor(
    private router: Router
  ) { 
    
  }

  ngOnInit() {
  }

  viewDetail(id){
    this.router.navigate(['/dashboard/bills/',id]);
  }

}
