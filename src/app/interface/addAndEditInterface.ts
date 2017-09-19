export interface AddAndEditInterface {
  isUpdate: boolean;
  statuses: string[];
  notificationOption: any;
  data: any;

  submitAndNew();
  submitAndClose();
  submit(isNagativeToDashboard: boolean);
  updateAndClose();
  deleteAndClose();

  pushNotification(title: string, content: string, type: number);
}
