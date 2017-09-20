import { Component, OnInit, NgZone, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { Modal } from "angular2-modal/plugins/bootstrap";
import { NotificationsService } from "angular2-notifications";
import { DetailPageInterface } from '../../interface/detailPageInterface';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CustomValidators } from "ng2-validation/dist";
import { InnowayService } from 'app/services'
import { BehaviorSubject } from "rxjs/BehaviorSubject";

declare let swal:any;

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, DetailPageInterface {

  toppingTypeService: any;
  id: string;
  item: any;
  itemFields: any = ['$all'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public innoway:InnowayService
  ) {
    this.toppingTypeService = innoway.getService('topping');
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
      this.item = await this.toppingTypeService.get(this.id,{
        fields: this.itemFields
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




  // public dataId: string;
  // public notificationOption: any;
  // public statuses;
  //
  // private form: FormGroup;
  // private toppingService: any;
  //
  // constructor(
  //   public innoway: InnowayService,
  //   private zone: NgZone,
  //   private route: ActivatedRoute,
  //   private router: Router,
  //   private notificationService: NotificationsService,
  //   private ref: ChangeDetectorRef) {
  //
  //   //default value
  //   this.statuses = [0, 1];
  //
  //   //config notification
  //   this.notificationOption = {
  //     position: ["top", "right"],
  //     timeOut: 1000,
  //     lastOnBottom: true,
  //   };
  //
  //   //add topping service
  //   this.toppingService = innoway.getService('topping');
  //
  //   //init form
  //   this.form = new FormGroup({
  //     nameInput: new FormControl('', [Validators.required, Validators.minLength(6)]),
  //     descriptionInput: new FormControl('', null),
  //     statusInput: new FormControl(1, Validators.required)
  //   });
  //   this.form.disable();
  // }
  //
  // ngOnInit() {
  //   this.dataId = this.route.snapshot.paramMap.get('id');
  //   if (this.dataId == null) {
  //     this.zone.run(() => {
  //       this.pushNotification("Error", "Không cập nhật được dữ liệu", -1);
  //     });
  //     this.router.navigate(['../dashboard']);
  //   } else {
  //     this.updateUIFollowDataId(this.dataId);
  //   }
  // }
  //
  // async updateUIFollowDataId(id: string) {
  //   try {
  //     //call api
  //     let topping = await this.toppingService.get(id, {
  //       fields: ["name", "status"]
  //     });
  //
  //     //update data for form
  //     this.form.controls['nameInput'].setValue(topping.name);
  //     this.form.controls['descriptionInput'].setValue(topping.description);
  //     this.form.controls['statusInput'].setValue(topping.status);
  //
  //     //update UI
  //     this.ref.detectChanges();
  //   } catch (err) {
  //     this.pushNotification("Error!", "Cập nhật dữ liệu bị lỗi", -1);
  //     this.router.navigate(['../../list'], { relativeTo: this.route});;
  //   }
  // }
  //
  // addItem() {
  //   this.router.navigate(['../add'], { relativeTo : this.route});
  // }
  //
  // editItem() {
  //   this.router.navigate(['../add', this.dataId]);
  // }
  //
  // async deleteItem() {
  //   try {
  //     //call api
  //     await this.toppingService.delete(this.dataId);
  //
  //     //push notification
  //     this.pushNotification("Success", "Xóa thành công!", 0);
  //     this.router.navigate(['../../list'], { relativeTo: this.route});;
  //   } catch (err) {
  //     this.pushNotification("Error!", "Xóa dữ liệu bị lỗi", -1);
  //   }
  // }
  //
  // pushNotification(title, content, type: number) {
  //   switch (type) {
  //     case -1: {
  //       this.notificationService.alert(
  //         title.toString(),
  //         content.toString(),
  //         {
  //           showProgressBar: true,
  //           pauseOnHover: false,
  //           clickToClose: false,
  //         }
  //       )
  //       break;
  //     } case 0: {
  //       this.notificationService.success(
  //         title.toString(),
  //         content.toString(),
  //         {
  //           showProgressBar: true,
  //           pauseOnHover: false,
  //           clickToClose: false,
  //         }
  //       )
  //       break;
  //     } default: {
  //       this.notificationService.success(
  //         title.toString(),
  //         content.toString(),
  //         {
  //           showProgressBar: true,
  //           pauseOnHover: false,
  //           clickToClose: false,
  //         }
  //       )
  //     }
  //   }
  // }

}
