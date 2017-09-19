import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { NgForm } from '@angular/forms';

export interface DetailPageInterface {
  id: string;
  item: any;
  itemFields: any;

  setData();
  editItem();
  backToList();
  alertItemNotFound();
}
