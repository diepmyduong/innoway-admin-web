import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { CustomValidators } from 'ng2-validation';
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

declare var innoway2:any;

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  
  form: FormGroup= null;
  isEdit: boolean = false;
  statuses: string[]=['Hoạt động','Không hoạt động'];
  indexSelectedStatus: number = 0;

  indexSelectedTopping: number = 0;
  toppingValue: any = [];
  toppingTypes: [any];
  currentToppingValue: any = [];
  currentTopping: any =[];

  public mask = createNumberMask({
    prefix: '',
    suffix: ' Đồng'
  });

  public notification_option = {
    position: ["top", "right"],
    timeOut: 1000,
    lastOnBottom: true,
  };

  constructor(
    private zone:NgZone,
    private route: ActivatedRoute,
    private router: Router,
    private _service: NotificationsService,
  ) { 
      this.form = new FormGroup({
        name: new FormControl('', [Validators.required]),
        av_price: new FormControl('', Validators.required),
        price: new FormControl('', null),
        description: new FormControl('', null)
      });
      this.form.controls['av_price'].valueChanges.subscribe(this.unmaskPrice.bind(this))
  }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    if(id == null){
      this.isEdit=false;
    }else{
      this.isEdit=true;
    }

  	innoway2.api.module('topping').getAll().then(data =>{
      this.zone.run(()=>{
         this.toppingTypes=data;
      })
    }).catch(err =>{
      console.error(err);
    });

    if(this.isEdit){
      innoway2.api.module('topping_value').get(id).then(data =>{
        this.zone.run(()=>{
          this.currentToppingValue=data;
          this.loadTopping(this.currentToppingValue.topping_id);
        });
      }).catch(err =>{
        console.error(err);
      })
    }
  }

  loadTopping(topping_id){
    innoway2.api.module('topping').get(topping_id).then(data =>{
      this.zone.run(()=>{  
        this.currentTopping=data;
      });
    }).catch(err =>{
      console.error(err);
    });
  }

  onChangeTopping(index){
    this.indexSelectedTopping=index;
  }

  onChangeStatus(index){
    this.indexSelectedStatus=index;
  }

  submitAndNew(){

    alert(this.form.valid);

    if(this.form.valid){
      this.addToppingValue();
    }
  }

  submitAndClose(){
    if(this.form.valid){
      this.addToppingValue();
      this.zone.runOutsideAngular(() => {
          location.reload();
      });
    }
  }

  updateAndClose(){

  }

  addToppingValue(){
    this.toppingValue={
        "name":this.form.controls['name'].value,
        "price":this.form.controls['price'].value,
        "description":this.form.controls['description'].value,
        "topping_id":this.toppingTypes[this.indexSelectedTopping].id,
        "status":this.statuses[this.indexSelectedStatus]
      };

    alert(Object.keys(this.toppingValue)+ " " +this.toppingValue.topping_id+ " "+this.toppingValue.status);

    this.createNotification();

    // innoway2.api.module('topping_value').add(this.toppingValue).then(data =>{
    //     this.createNotification();
    //     alert(data.code);
    // }).catch(err =>{
    //   console.error(err);
    // });
  }

  unmaskPrice(raw){
    let price = parseFloat(raw.replace(new RegExp("(,)|(Đồng)|(\ )","g"),""));
    this.form.controls['price'].setValue(price);
    return price;
  }

  createNotification() {
    this._service.success(
        this.toppingValue.name,
        'Được thêm thành công',
        {
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: false,             
        }
    )
  }

}
