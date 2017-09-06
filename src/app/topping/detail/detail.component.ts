import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgZone } from '@angular/core';

declare let innoway2:any;

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  id: string = "";
  toppingValue: any = [];
  topping: any = [];

  constructor(private route: ActivatedRoute,
  private router: Router,
  private zone: NgZone) {
  	
  }

  ngOnInit() {

   	this.id = this.route.snapshot.paramMap.get('id');

  	innoway2.api.module('topping_value').get(this.id).then(data =>{
      this.zone.run(()=>{
  		this.toppingValue=data;
  		//alert(this.toppingValue.topping_id);
  		this.loadTopping(this.toppingValue.topping_id);
      });
  	}).catch(err =>{
  		console.error(err);
  	})
  }

  loadTopping(topping_id){
	innoway2.api.module('topping').get(topping_id).then(data =>{
	  this.zone.run(()=>{
	  	// alert(data.name);	
		this.topping=data;
	  });
	}).catch(err =>{
  		console.error(err);
  		alert(err);
  	});
  }

  addItem(){
	 this.router.navigate(['/topping/add']);
  }

  editItem(){
  	 this.router.navigate(['/topping/add', this.id]);
  }

  deleteItem(){
  	this.zone.runOutsideAngular(() => {
    	location.reload();
    });
  }
}
