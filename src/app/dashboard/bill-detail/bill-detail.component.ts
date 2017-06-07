import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-bill-detail',
  templateUrl: './bill-detail.component.html',
  styleUrls: ['./bill-detail.component.scss']
})
export class BillDetailComponent implements OnInit {

  id:string

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router
  ) { 
    var params = (activateRoute.params as BehaviorSubject<any>).getValue();
    this.id = params.id;
  }

  ngOnInit() {
  }

  backToList(){
    this.router.navigate(['/dashboard/bills']);
  }

}
