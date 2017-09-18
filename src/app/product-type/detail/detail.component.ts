import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { InnowayService } from '../../services'

declare let swal:any;

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  categoryService:any;
  id:string;
  item:any;
  itemFields = ['$all']

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public innoway:InnowayService
  ) {
  	this.categoryService = innoway.getService('product_category');
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
      this.item = await this.categoryService.get(this.id,{
        fields: this.itemFields
      })
    }catch(err){
      this.alertItemNotFound()
      this.backToList()
    }
  }

  editItem(){
    this.router.navigate(['/product-type/add', this.id]);
  }

  backToList(){
    this.router.navigate(['/product-type/list'])
  }

  alertItemNotFound(){
    return swal({
      title: 'Không còn tồn tại',
      type: 'warning',
      timer: 2000
    })
  }
}
