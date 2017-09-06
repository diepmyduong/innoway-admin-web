import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgZone } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

declare let innoway2:any;

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  form: FormGroup= null;
  id: string = "";
  category: any = [];
  thumbDefaultCategory: string = "http://www.breeze-animation.com/app/uploads/2013/06/icon-product-gray.png";

  constructor(private route: ActivatedRoute,
  private router: Router,
  private zone: NgZone) {
  	
  }

  ngOnInit() {

   	this.id = this.route.snapshot.paramMap.get('id');
   	// alert(this.id);

  	innoway2.api.module('product_category').get(this.id).then(data =>{
      this.zone.run(()=>{
  		  this.category=data;
        this.form.controls['name'].setValue(data.name);
        this.form.controls['name'].disable(true);
        this.form.controls['description'].setValue(data.description);
        this.form.controls['description'].disable(true);
        this.form.controls['image'].setValue(data.image);
        this.form.controls['image'].disable(false);
      });
  	}).catch(err =>{
  		console.error(err);
  	})
  }

  addItem(){
	   this.router.navigate(['/product-type/add']);
  }

  editItem(){
  	 this.router.navigate(['/product-type/add', this.id]);
  }

  deleteItem(){
  	this.zone.runOutsideAngular(() => {
    	location.reload();
    });
  }

  errorHandler(event) {
    console.debug(event);
    event.target.src = this.thumbDefaultCategory;
  }
}
