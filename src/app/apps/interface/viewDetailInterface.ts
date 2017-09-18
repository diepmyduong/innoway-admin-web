export interface ViewDetailInterface {
  dataId: string;
  notificationOption: any;
  statuses: string[];

  addItem();
  editItem();
  deleteItem();

  pushNotification(title: string, content: string, type: number);
}
