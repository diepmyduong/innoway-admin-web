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
    private route: ActivatedRoute,
    private router: Router
  ) { 
    this.id = route.snapshot.params.id;
  }

  ngOnInit() {
  }

  backToList(){
    this.router.navigate(['./bills'],{ relativeTo: this.route.parent});
  }

}
