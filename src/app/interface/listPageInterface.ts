import { BehaviorSubject } from "rxjs/BehaviorSubject";

export interface ListPageInterface {
  items: BehaviorSubject<any[]>;
  itemCount: number; // item total  count
  thumbDefault: string;
  itemFields: any; //Get All field

  //Search bar
  query: any; //query to search and paging items
  searchTimeOut: number; //milisecond
  searchRef: any;

  reloadItems(params);
  getItems();
  rowClick(event);
  rowDoubleClick(event);
  addItem();
  editItem(item);
  viewItem(item);
  confirmDelete();
  alertCannotDelete();
  alertDeleteSuccess();
  deleteItem(item);
  deleteAll();
  onSearch(e);
}
