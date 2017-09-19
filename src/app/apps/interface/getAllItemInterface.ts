import { BehaviorSubject } from "rxjs/BehaviorSubject";

export interface GetAllItemInterface {
  notificationOption: any;
  data: Array<any>;
  canLoadMore: boolean;
  limit: number;
  isMultipleSelect: boolean;
  seletectedItems: string[];
  searchName: string;
  numberOfItem: number;
  numberOfPage: number;
  pageOptions: number[];
  currentPageOption: number;
  defaultThumb: string;
  loadDataMode: number;

  loadData();

  addItem();
  editItem(id: string);
  viewItem(id: string);
  deleteOneItem(id: string)
  deleteItem(ids: string[], index: number);
  deleteSelectedItem();

  selectAllItem();
  deselectAllItem();

  queryName();
  loadMore();

  pagination();
  switchModeSelectItem(event: any);

  pushNotification(title: string, content: string, type: number);
}
