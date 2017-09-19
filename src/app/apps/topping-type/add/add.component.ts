import { Component, OnInit, NgZone, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { Modal } from "angular2-modal/plugins/bootstrap";
import { NotificationsService } from "angular2-notifications";
import { AddPageInterface } from "../../interface/addPageInterface"
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, Validators, NgForm } from "@angular/forms";
import { CustomValidators } from "ng2-validation/dist";
import { InnowayService } from 'app/services'
import { BehaviorSubject } from "rxjs/BehaviorSubject";

declare var swal: any;

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})

export class AddComponent implements OnInit, AddPageInterface {
  id: any;
  isEdit: boolean = false;
  submitting: boolean = false;
  toppingTypeService: any;
  name: string;
  description: string;
  status: number = 1;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    public innoway: InnowayService) {
    this.toppingTypeService = innoway.getService('topping');
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    if (this.id == null) {
      this.isEdit = false;
      this.setDefaultData();
    } else {
      this.isEdit = true;
    }

    if (this.isEdit) {
      this.setData();
    }
  }

  setDefaultData() {
    this.status = 1;
  }

  async setData() {
    try {
      let category = await this.toppingTypeService.get(this.id, {
        fields: ["name", "description", "status"]
      });
      this.name = category.name
      this.description = category.description
      this.status = category.status
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      this.backToList()
    }
  }

  backToList() {
    this.router.navigate(['../../list'], { relativeTo: this.route});
  }

  alertItemNotFound() {
    swal({
      title: 'Không còn tồn tại',
      type: 'warning',
      timer: 2000
    })
  }

  alertAddSuccess() {
    return swal({
      title: 'Đã thêm',
      type: 'success',
      timer: 2000,
    })
  }

  alertUpdateSuccess() {
    return swal({
      title: 'Đã cập nhật',
      type: 'success',
      timer: 2000,
    })
  }

  alertFormNotValid() {
    return swal({
      title: 'Nội dung nhập không hợp lệ',
      type: 'warning',
      timer: 2000,
    })
  }

  alertAddFailed() {
    return swal({
      title: 'Thêm không thành công',
      type: 'warning',
      timer: 2000,
    })
  }

  alertUpdateFailed() {
    return swal({
      title: 'Cập nhật không thành công',
      type: 'warning',
      timer: 2000,
    })
  }

  async addItem(form: NgForm) {
    if (form.valid) {
      let { name, description, status } = this;
      await this.toppingTypeService.add({ name, description, status })
      this.alertAddSuccess();
      form.reset();
      form.controls["status"].setValue(1);
    } else {
      this.alertFormNotValid();
    }
  }

  async updateItem(form: NgForm) {
    if (form.valid) {
      let { name, description, status } = this;
      await this.toppingTypeService.update(this.id, { name, description, status })
      this.alertUpdateSuccess();
      form.reset();
    } else {
      this.alertFormNotValid();
    }
  }

  async submitAndNew(form: NgForm) {
    console.log('submit', form);
    this.submitting = true;
    try {
      await this.addItem(form);
    } catch (err) {
      this.alertAddFailed()
    } finally {
      this.submitting = false;
    }
  }

  async submitAndClose(form: NgForm) {
    this.submitting = true;
    try {
      await this.addItem(form);
      this.backToList();
    } catch (err) {
      this.alertAddFailed()
    } finally {
      this.submitting = false;
    }
  }

  async updateAndClose(form: NgForm) {
    this.submitting = true;
    try {
      await this.updateItem(form);
      this.backToList();
    } catch (err) {
      this.alertUpdateFailed();
    } finally {
      this.submitting = false;
    }
  }






  // public isUpdate;
  // public statuses;
  // public notificationOption;
  // public data;
  // public dataId;
  //
  // private form: FormGroup;
  // private toppingService: any;
  //
  // constructor(
  //   public innoway: InnowayService,
  //   private modal: Modal,
  //   private pageService: PageService,
  //   private zone: NgZone,
  //   private route: ActivatedRoute,
  //   private router: Router,
  //   private notificationService: NotificationsService,
  //   private ref: ChangeDetectorRef,
  //   private vcRef: ViewContainerRef) {
  //
  //   //default value
  //   this.isUpdate = false;
  //   this.statuses = [0, 1];
  //
  //   //init form
  //   this.form = new FormGroup({
  //     nameInput: new FormControl('', [Validators.required, Validators.minLength(6)]),
  //     descriptionInput: new FormControl('', null),
  //     statusInput: new FormControl(1, Validators.required)
  //   });
  //
  //   //config notification
  //   this.notificationOption = {
  //     position: ["top", "right"],
  //     timeOut: 1000,
  //     lastOnBottom: true,
  //   };
  //
  //   //config modal
  //   modal.overlay.defaultViewContainer = vcRef;
  //
  //   //add topping service
  //   this.toppingService = innoway.getService('topping');
  // }
  //
  // ngOnInit() {
  //
  //   //check Add or Update
  //   this.dataId = this.route.snapshot.paramMap.get('id');
  //   if (this.dataId == null) {
  //     this.isUpdate = false;
  //   } else {
  //     this.isUpdate = true;
  //   }
  //
  //   if (this.isUpdate) {
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
  // submitAndNew() {
  //   if (this.form.valid) {
  //     this.submit(false);
  //   } else {
  //     this.pushNotification("Error!", "Kiểm tra lại thông tin!", -1);
  //   }
  // }
  //
  // submitAndClose() {
  //   if (this.form.valid) {
  //     this.submit(true);
  //   } else {
  //     this.pushNotification("Error!", "Kiểm tra lại thông tin!", -1);
  //   }
  // }
  //
  // async submit(isNagativeToDashboard: boolean) {
  //   this.data = {
  //     "name": this.form.controls["nameInput"].value,
  //     "description": this.form.controls["descriptionInput"].value,
  //     "status": this.form.controls["statusInput"].value
  //   };
  //
  //   try {
  //     //call api
  //     let topping = await this.toppingService.add(this.data);
  //
  //     this.form.reset();
  //     this.form.controls['statusInput'].setValue(1);
  //
  //     //push notification
  //     this.zone.run(() => {
  //       this.pushNotification(topping.name, "Thêm " + topping.name + " thành công!", 0);
  //     });
  //
  //     if (isNagativeToDashboard) {
  //       this.router.navigate(['../../list'], { relativeTo: this.route});;
  //     }
  //   } catch (err) {
  //     this.pushNotification("Error!", "Thêm dữ liệu bị lỗi", -1);
  //   }
  // }
  //
  // async updateAndClose() {
  //   this.data = {
  //     "name": this.form.controls["nameInput"].value,
  //     "description": this.form.controls["descriptionInput"].value,
  //     "status": this.form.controls["statusInput"].value.toString()
  //   };
  //
  //   try {
  //     //call api
  //     let topping = await this.toppingService.update(this.dataId, this.data);
  //     // this.form.reset();
  //     console.log('success',topping);
  //     //push notification
  //     this.pushNotification(topping.name, "Cập nhật " + topping.name + " thành công!", 0);
  //     this.ref.detectChanges();
  //     this.router.navigate(['../../list'], { relativeTo: this.route});;
  //   } catch (err) {
  //     this.pushNotification("Error!", "Cập nhật dữ liệu bị lỗi", -1);
  //   }
  // }
  //
  // async deleteAndClose() {
  //   try {
  //     //call api
  //     await this.toppingService.delete(this.dataId);
  //
  //     //push notification
  //     this.pushNotification("Success", "Xóa thành công!", 0);
  //     this.ref.detectChanges();
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
