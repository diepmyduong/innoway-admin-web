import { Component, OnInit, NgZone, ViewChild ,ChangeDetectorRef} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { CustomValidators } from 'ng2-validation';

declare var innoway2:any;

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  form: FormGroup= null;
  id: any=[];
  isEdit: boolean = false;
  statuses: number[]=[1,0];
  indexSelectedStatus: number = 0;
  indexSelectedTopping: number = 0;
  thumbDefaultCategory: string = "http://www.breeze-animation.com/app/uploads/2013/06/icon-product-gray.png";

  category: any = [];
  //currentCategory: any =[];

  public notification_option = {
    position: ["top", "right"],
    timeOut: 1000,
    lastOnBottom: true,
  };

  @ViewChild('imageCategory') input:any; 

    // ngAfterViewInit() {
    //  alert(this.input);      
    // }

  constructor(
    private zone:NgZone,
    private route: ActivatedRoute,
    private router: Router,
    private _service: NotificationsService,
    private ref: ChangeDetectorRef
  ) { 
      this.form = new FormGroup({
        name: new FormControl('', [Validators.required]),
        description: new FormControl('', null),
        image: new FormControl('', CustomValidators.url),
      });
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if(this.id == null){
      this.isEdit=false;
    }else{
      this.isEdit=true;

    }

    if(this.isEdit){
      this.setData();
    }
  }

  async setData(){
    this.category = await innoway2.api.module('product_category').get(this.id);
    console.log('Set Data', this.category );
    this.form.controls['name'].setValue(this.category.name);
    this.form.controls['description'].setValue(this.category.description);
    this.form.controls['image'].setValue(this.category.image);
    this.ref.detectChanges();
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
      this.addToppingValue(false);
    }else{
      this.createNotification("Xảy ra lỗi", "Nội dung chưa hợp lệ!");
    }
  }

  submitAndClose(){
    if(this.form.valid){
      this.addToppingValue(true);
    }else{
      this.createNotification("Xảy ra lỗi", "Nội dung chưa hợp lệ!");
    }
  }

  updateAndClose(){
    this.category={
        "name":this.form.controls['name'].value,
        "description":this.form.controls['description'].value,
        "image":this.form.controls['image'].value.toString(),
        "status":this.statuses[this.indexSelectedStatus].toString()
    };

    // alert(JSON.stringify(this.category));
    if(this.form.valid){
      innoway2.api.module('product_category').update(this.id,this.category).then(data =>{
        this.zone.run(()=>{
          this.createNotification(this.category.name, "Cập nhật "+this.category.name+" thành công!");
        });
      }).catch(err =>{
        console.error(err);
      });
    }
  }

  addToppingValue(isNagativeToDashboard){
    this.category={
        "name":this.form.controls['name'].value,
        "description":this.form.controls['description'].value,
        "image":this.form.controls['image'].value,
        "status":this.statuses[this.indexSelectedStatus].toString()
    };

    // alert(JSON.stringify(this.category));

    innoway2.api.module('product_category').add(this.category).then(data =>{
        this.zone.run(()=>{
          this.createNotification(this.category.name, "Thêm "+this.category.name+" thành công!");
        });
        if(isNagativeToDashboard){
          this.router.navigate(['/dashboard']);
        }else{
          this.category=[];
          this.form.controls['name'].setValue("");
          this.form.controls['description'].setValue("");
          this.form.controls['image'].setValue("");
        }
    }).catch(err =>{
      console.error(err);
    });
  }

  unmaskPrice(raw){
    let price = parseFloat(raw.replace(new RegExp("(,)|(Đồng)|(\ )","g"),""));
    this.form.controls['price'].setValue(price);
    return price;
  }

  createNotification(title, content) {
    this._service.success(
	    title.toString(),
	    content.toString(),
	    {
	        showProgressBar: true,
	        pauseOnHover: false,
	        clickToClose: false,             
	    }
    )
  }

  errorHandler(event){

  }

  validateData(isEdit, data, field){
    let output;
    if(isEdit){
      if(data==null){
        output="";
        this.category[field]="";
      }else{
        output=data;
        this.category[field]=data;
      }
    }else{
      if(data==null){
        output="";
        this.category[field]="";
      }else{
        output=data;
        this.category[field]=data;
      }
    }
    return output;
  }
}
