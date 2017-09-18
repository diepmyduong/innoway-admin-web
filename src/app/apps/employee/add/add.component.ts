import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CustomValidators } from "ng2-validation/dist";
import { InnowayService } from 'app/services'
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Router, ActivatedRoute } from "@angular/router";
import { AddPageInterface } from "app/apps/interface/addPageInterface";
import { NgForm } from "@angular/forms";

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

  employeeService: any;
  employeeTypeService: any;
  branchService: any;

  name: string;
  phone: string;
  email: string;
  address: string;
  birthday: string;
  sex: number = 1;
  fullname: string;
  username: string;
  password: string;
  repassword: string;
  avatar: string;
  area: number = 1;
  areas: any[] = [
    {
      id: 0,
      name: "Quận 1"
    }, {
      id: 1,
      name: "Quận 3"
    }, {
      id: 2,
      name: "Quận 4"
    }, {
      id: 3,
      name: "Quận 5"
    }, {
      id: 4,
      name: "Quận 7"
    }, {
      id: 5,
      name: "Quận 10"
    }, {
      id: 6,
      name: "Quận Phú Nhuận"
    }, {
      id: 7,
      name: "Quận Bình Thạnh"
    }
  ];

  gender: number = 1;
  status: number = 1;
  branchData: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  employeeType: number = 1;
  branch_id: string;
  employee_type_id: string;
  employeeTypeData: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    public innoway: InnowayService) {
    this.employeeService = innoway.getService('employee');
    this.employeeTypeService = innoway.getService('employee_type');
    this.branchService = innoway.getService('branch');
  }

  async ngOnInit() {
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

    await this.loadBranchData();
    await this.loadEmployeeTypeData();
  }

  setDefaultData() {
    this.status = 1;
    if (this.branchData.getValue()[0]) {
      this.branch_id = this.branchData.getValue()[0].id;
    }
    if (this.employeeTypeData.getValue()[0]) {
      this.employee_type_id = this.employeeTypeData.getValue()[0].id;
    }
    return {
      status: this.status,
      branch_id: this.branch_id,
      employee_type_id: this.employee_type_id
    }
  }

  async setData() {
    try {
      let data = await this.employeeService.get(this.id, {
        fields: ["$all", {
          type: ["id", "name"], branch: ["id", "name"]
        }]
      });
      this.name = data.name
      this.fullname = data.fullname
      this.username = data.username
      this.password = data.password
      this.phone = data.phone
      this.email = data.email
      this.address = data.address
      this.avatar = data.avatar
      this.branch_id = data.branch_id
      this.employee_type_id = data.employee_type_id
      this.status = data.status
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
    }
  }

  async loadBranchData() {
    try {
      this.branchData = await this.innoway.getAll('branch', {
        fields: ["id", "name"]
      });
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
    }
  }

  async loadEmployeeTypeData() {
    try {
      this.employeeTypeData = await this.innoway.getAll('employee_type', {
        fields: ["id", "name"]
      });
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
    }
  }

  backToList() {
    this.router.navigate(['/employee/list'])
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
      let { name, phone, email, branch_id, fullname, password, address, avatar, employee_type_id, status } = this;
      await this.employeeService.add({ name, phone, email, branch_id, fullname, password, address, avatar, employee_type_id, status })
      this.alertAddSuccess();
      form.reset();
      form.controls["status"].setValue(1);
    } else {
      this.alertFormNotValid();
    }
  }

  async updateItem(form: NgForm) {
    if (form.valid) {
      let { name, phone, email, branch_id, fullname, password, address, avatar, employee_type_id, status } = this;
      await this.employeeService.update(this.id, { name, phone, email, branch_id, fullname, password, address, avatar, employee_type_id, status })
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
      console.log("ERROR SUBMIT", err);
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

}
