import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { NgForm } from '@angular/forms';

export interface AddPageInterface {
  id: any;
  isEdit: boolean;
  submitting: boolean;

  setDefaultData();
  setData();
  backToList();
  alertItemNotFound();
  alertAddSuccess();
  alertUpdateSuccess();
  alertFormNotValid();
  alertAddFailed();
  alertUpdateFailed();
  addItem(form:NgForm);
  updateItem(form:NgForm);
  submitAndNew(form:NgForm);
  submitAndClose(form:NgForm);
  updateAndClose(form:NgForm);
}
