import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { InnowayService } from 'app/services';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Globals } from './../../../globals';

declare let swal:any

@Component({
  selector: 'app-add',
  providers: [Globals],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  id: any;
  isEdit: boolean = false;

  submitting: boolean = false;

  billService: any;
  billActitivyService: any;
  employeeService: any;

  employee: string;
  employees: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  // bill_actions: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  bill_actions: any[];

  name: string;
  action: number = 1;
  actions: any[] = [
    {
      action: -2,
      name: "Chỉnh sửa"
    },
    {
      action: -1,
      name: "Đã hủy"
    },
    {
      action: 0,
      name: "Đặt hàng thành công"
    },
    {
      action: 1,
      name: "Đang điều phối"
    },
    {
      action: 2,
      name: "Đang xử lý"
    },
    {
      action: 3,
      name: "Đã chuẩn bị"
    },
    {
      action: 4,
      name: "Đã chuyển cho giao hàng"
    },
    {
      action: 5,
      name: "Đang giao"
    },
    {
      action: 6,
      name: "Đã thanh toán"
    },
    {
      action: 7,
      name: "Đã thu tiền"
    },
  ];
  avaiable_actions: any[];
  status: number = 1;

  constructor(
    private globals: Globals,
    private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    public innoway: InnowayService
  ) {
    this.billService = innoway.getService('bill');
    this.employeeService = innoway.getService('employee');
    this.billActitivyService = innoway.getService('bill_activity');
  }

  async ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    await this.loadEmployeeData();

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
    this.action = 1;
    if (this.employees.getValue()[0]) {
      this.employee = this.employees.getValue()[0].id;
    }
    this.status = 1;
    return {
      status: this.status,
      action: this.action,
      employee: this.employee
    }
  }

  async setData() {
    try {
      let bill = await this.billService.get(this.id, {
        fields: ["$all", {
          activities: ["$all"]
        }]
      });
      this.bill_actions = bill.activities;
      let activity = bill.activities;
      this.avaiable_actions = [];
      this.actions.forEach(action => {
        if (action.action > activity[activity.length - 1].action) {
          let data = {
            action: action.action,
            name: action.name
          };
          this.avaiable_actions.push(data);
        }
      });
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      this.backToList()
    }
  }

  async loadEmployeeData() {
    try {
      this.employees = await this.innoway.getAll('employee', {
        fields: ["id", "fullname", "phone", "email"]
      });
    } catch (err) {
      console.error("cannot load employees", err);
    }
  }

  backToList() {
    this.router.navigate(['../../list'], { relativeTo: this.route });
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
    // if (form.valid) {
    //   let { name, description, image, status } = this;
    //   await this.billService.add({ name, description, image, status })
    //   this.alertAddSuccess();
    //   form.reset();
    //   form.resetForm(this.setDefaultData());
    // } else {
    //   this.alertFormNotValid();
    // }
  }

  async updateItem(form: NgForm) {
    // if (form.valid) {
    //   let { name, description, image, status } = this;
    //   await this.billService.update(this.id, { name, description, image, status })
    //   this.alertUpdateSuccess();
    //   form.reset();
    // } else {
    //   this.alertFormNotValid();
    // }
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

  async addAction(form: NgForm) {
    if (form.valid) {
      let { action, employee } = this;
      let employee_id = employee;
      let bill_id = this.id;
      await this.billActitivyService.add({ bill_id, action, employee_id })
      this.alertAddSuccess();
      form.reset();
      form.resetForm(this.setDefaultData());
      this.bill_actions = null;
      this.setData();
    } else {
      this.alertFormNotValid();
    }
  }

  checkAction(v): boolean {
    if (Number.parseInt(v.action) > 3) {
      return true;
    }
    return false;
  }
}
