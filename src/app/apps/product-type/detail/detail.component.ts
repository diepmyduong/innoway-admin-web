import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { InnowayApiService } from 'app/services/innoway'

declare let swal:any;

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  id:string;
  item:any;
  itemFields = ['$all']

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public innowayApi: InnowayApiService
  ) {
  }

  ngOnInit() {

   	this.id = this.route.snapshot.params['id'];

    if(this.id){
      this.setData()
    }else{
      this.alertItemNotFound()
      this.backToList()
    }
  }

  async setData(){
    try {
      this.item = await this.innowayApi.productType.getItem(this.id, {
        query: { fields: this.itemFields }
      })
    }catch(err){
      this.alertItemNotFound()
      this.backToList()
    }
  }

  editItem(){
        this.router.navigate(['../../add', this.id], { relativeTo: this.route});
  }

  backToList(){
    this.router.navigate(['../../list'], { relativeTo: this.route});
  }

  alertItemNotFound(){
    return swal({
      title: 'Không còn tồn tại',
      type: 'warning',
      timer: 2000
    })
  }
}
