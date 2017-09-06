import { Component, OnInit, NgZone, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { PageService } from "app/chatbot/services/page.service";
import { Modal } from "angular2-modal/plugins/bootstrap";
import { NotificationsService } from "angular2-notifications";
import { AddAndEditInterface } from '../../interface/addAndEditInterface';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CustomValidators } from "ng2-validation/dist";
import { InnowayService } from '../../services'

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})

export class AddComponent implements OnInit, AddAndEditInterface {

  public isUpdate;
  public statuses;
  public notificationOption;
  public data;
  public dataId;

  private form: FormGroup;
  private toppingService: any;

  constructor(
    public innoway: InnowayService,
    private modal: Modal,
    private pageService: PageService,
    private zone: NgZone,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationsService,
    private ref: ChangeDetectorRef,
    private vcRef: ViewContainerRef) {

    //default value
    this.isUpdate = false;
    this.statuses = [0, 1];

    //init form
    this.form = new FormGroup({
      nameInput: new FormControl('', [Validators.required, Validators.minLength(6)]),
      descriptionInput: new FormControl('', null),
      statusInput: new FormControl(1, Validators.required)
    });

    //config notification
    this.notificationOption = {
      position: ["top", "right"],
      timeOut: 1000,
      lastOnBottom: true,
    };

    //config modal
    modal.overlay.defaultViewContainer = vcRef;

    //add topping service
    this.toppingService = innoway.getService('topping');
  }

  ngOnInit() {

    //check Add or Update
    this.dataId = this.route.snapshot.paramMap.get('id');
    if (this.dataId == null) {
      this.isUpdate = false;
    } else {
      this.isUpdate = true;
    }

    if (this.isUpdate) {
      this.updateUIFollowDataId(this.dataId);
    }
  }

  async updateUIFollowDataId(id: string) {
    try {
      //call api
      let topping = await this.toppingService.get(id, {
        fields: ["name", "status"]
      });

      //update data for form
      this.form.controls['nameInput'].setValue(topping.name);
      this.form.controls['descriptionInput'].setValue(topping.description);
      this.form.controls['statusInput'].setValue(topping.status);

      //update UI
      this.ref.detectChanges();
    } catch (err) {
      this.pushNotification("Error!", "Cập nhật dữ liệu bị lỗi", -1);
      this.router.navigate(['/topping-type/list']);
    }
  }

  submitAndNew() {
    if (this.form.valid) {
      this.submit(false);
    } else {
      this.pushNotification("Error!", "Kiểm tra lại thông tin!", -1);
    }
  }

  submitAndClose() {
    if (this.form.valid) {
      this.submit(true);
    } else {
      this.pushNotification("Error!", "Kiểm tra lại thông tin!", -1);
    }
  }

  async submit(isNagativeToDashboard: boolean) {
    this.data = {
      "name": this.form.controls["nameInput"].value,
      "description": this.form.controls["descriptionInput"].value,
      "status": this.form.controls["statusInput"].value
    };

    try {
      //call api
      let topping = await this.toppingService.add(this.data);

      this.form.reset();
      this.form.controls['statusInput'].setValue(1);

      //push notification
      this.zone.run(() => {
        this.pushNotification(topping.name, "Thêm " + topping.name + " thành công!", 0);
      });

      if (isNagativeToDashboard) {
        this.router.navigate(['/topping-type/list']);
      }
    } catch (err) {
      this.pushNotification("Error!", "Thêm dữ liệu bị lỗi", -1);
    }
  }

  async updateAndClose() {
    this.data = {
      "name": this.form.controls["nameInput"].value,
      "description": this.form.controls["descriptionInput"].value,
      "status": this.form.controls["statusInput"].value.toString()
    };

    try {
      //call api
      let topping = await this.toppingService.update(this.dataId, this.data);
      // this.form.reset();
      console.log('success',topping);
      //push notification
      this.pushNotification(topping.name, "Cập nhật " + topping.name + " thành công!", 0);
      this.ref.detectChanges();
      this.router.navigate(['/topping-type/list']);
    } catch (err) {
      this.pushNotification("Error!", "Cập nhật dữ liệu bị lỗi", -1);
    }
  }

  async deleteAndClose() {
    try {
      //call api
      await this.toppingService.delete(this.dataId);

      //push notification
      this.pushNotification("Success", "Xóa thành công!", 0);
      this.ref.detectChanges();
      this.router.navigate(['/topping-type/list']);
    } catch (err) {
      this.pushNotification("Error!", "Xóa dữ liệu bị lỗi", -1);
    }
  }

  pushNotification(title, content, type: number) {
    switch (type) {
      case -1: {
        this.notificationService.alert(
          title.toString(),
          content.toString(),
          {
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: false,
          }
        )
        break;
      } case 0: {
        this.notificationService.success(
          title.toString(),
          content.toString(),
          {
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: false,
          }
        )
        break;
      } default: {
        this.notificationService.success(
          title.toString(),
          content.toString(),
          {
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: false,
          }
        )
      }
    }
  }
}
