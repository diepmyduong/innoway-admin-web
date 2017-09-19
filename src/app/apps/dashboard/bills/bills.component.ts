import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss']
})
export class BillsComponent implements OnInit {

  constructor(
    private router: Router,
    private route:ActivatedRoute
  ) { 
    
  }

  ngOnInit() {
  }

  viewDetail(id){
    this.router.navigate(['../bills/',id],{ relativeTo: this.route});
  }

}
