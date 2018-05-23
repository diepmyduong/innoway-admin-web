import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { ListPageInterface } from "app/apps/interface/listPageInterface";
import { DataTable } from "angular-2-data-table-bootstrap4/dist";
import { Router, ActivatedRoute } from "@angular/router";
import { InnowayApiService } from "app/services/innoway";
import { Globals } from "./../../Globals"
import { MatDialog } from "@angular/material";
import { SendMessageDialog } from "app/modal/send-message/send-message.component";
import { SendStoryDialog } from "app/modal/send-story/send-story.component";
declare let swal: any
declare var accounting: any;

@Component({
  selector: 'app-customer',
  providers: [Globals],
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit, ListPageInterface {
  items: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  itemCount: number = 0;
  thumbDefault: string = "http://www.breeze-animation.com/app/uploads/2013/06/icon-product-gray.png";;
  itemFields: any = ["$all"];
  query: any = {};
  searchTimeOut: number = 250;
  searchRef: any;

  story: string;
  stories: any[];

  isConnectChatbot: boolean = false;

  @ViewChild('itemsTable') itemsTable: DataTable;

  @ViewChild("fileImportUploader")
  fileImportUploader: ElementRef;

  constructor(
    private router: Router,
    private globals: Globals,
    public dialog: MatDialog,
    public innowayApi: InnowayApiService,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef
  ) {

  }

  subscriptions:any = {}

  ngOnInit() {
    this.subscriptions.onItemsChange = this.innowayApi.customer.items.subscribe(items => {
      if(items)  this.itemsTable.reloadItems()
    })
  }

  ngAfterViewDestroy() {
    this.subscriptions.forEach(s => {
      s.unsubscribe()
    })
  }

  async reloadItems(params) {
    let { limit, offset, sortBy, sortAsc } = params;
    this.query.limit = limit;
    this.query.offset = offset;
    this.query.order = sortBy ? [[sortBy, sortAsc ? 'ASC' : 'DESC']] : null;
    await this.getItems();
  }

  async loadBrand() {
    try {
      let brandId = this.innowayApi.innowayAuth.innowayUser.brand_id
      let data = await this.innowayApi.brand.getItem(brandId, {
        query: {
          local: false,
          fields: ["$all", {
            thirdparty_chatbot: ["$all"]
          }]
        }
      })
      if (data.thirdparty_chatbot) {
        this.isConnectChatbot = true
      }
    } catch (err) {

    }
  }

  async getItems() {
    let query = Object.assign({
      local: false,
      fields: this.itemFields
    }, this.query);
    console.log("bibi: " + JSON.stringify(query));
    this.items.next(await this.innowayApi.customer.getList({ query }))
    this.itemCount = this.innowayApi.customer.pagination.totalItems
    this.items.subscribe(items => console.log(items))
    this.ref.detectChanges();
    return this.items;
  }

  rowClick(event) {
    console.log('Row clicked', event);
  }

  rowDoubleClick(event) {
    console.log('Row double click', event);
  }

  addItem() {
    this.router.navigate(['../add'], { relativeTo: this.route });
  }

  editItem(item) {
    this.router.navigate(['../add', item.id], { relativeTo: this.route });
  }

  viewItem(item) {
    this.router.navigate(['../detail', item.id], { relativeTo: this.route });
  }

  async confirmDelete() {
    return await swal({
      title: 'Xoá',
      text: "Bạn có chắc la muốn xoá",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Quay lại'
    })
  }

  async alertCannotDelete() {
    return await swal({
      title: 'Không thể xoá',
      type: 'warning',
      timer: 1000,
    });
  }

  async alertUpdateFail() {
    return await swal({
      title: 'Xử lý thất bại',
      type: 'warning',
      timer: 1000,
    });
  }

  async alertDeleteSuccess() {
    return await swal({
      title: 'Xoá thành công',
      type: 'success',
      timer: 1000,
    });
  }

  async alertUpdateSuccess() {
    return await swal({
      title: 'Xử lý thành công',
      type: 'success',
      timer: 1000,
    });
  }

  async deleteItem(item) {
    item.deleting = true;
    try {
      try { await this.confirmDelete() } catch (err) { return };
      await this.innowayApi.customer.delete(item.id)
      this.itemsTable.reloadItems();
      this.alertDeleteSuccess();
    } catch (err) {
      this.alertCannotDelete();
    } finally {
      item.deleting = false;
    }
  }

  async deleteAll() {
    if (this.itemsTable.selectedRows.length == 0)
      return;

    let rows = this.itemsTable.selectedRows;
    let ids = [];
    rows.forEach(row => {
      row.item.deleting = true;
      ids.push(row.item.id);
    });
    try {
      try { await this.confirmDelete() } catch (err) { return };
      await this.innowayApi.customer.deleteAll(ids)
      this.itemsTable.selectAllCheckbox = false;
      this.itemsTable.reloadItems();
      this.alertDeleteSuccess();
    } catch (err) {
      this.alertCannotDelete();
    } finally {
      rows.forEach(row => {
        row.item.deleting = false;
      });
    }
  }

  onSearch(e) {
    const key = e.target.value;
    if (this.searchRef) clearTimeout(this.searchRef);
    this.searchRef = setTimeout(() => {
      this.query.filter = {
        $or: {
          fullname: { $iLike: `%${key}%` },
          phone: { $iLike: `%${key}%` },
        }
      }
      this.getItems();
    }, this.searchTimeOut);
  }

  sendMessageChatbot(item) {
    let data = {

    };

    let dialogRef = this.dialog.open(SendMessageDialog, {
      width: '560px',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        this.sendMessage({
          content: result.contentInput,
          media: {
            type: result.mediaType,
            link: result.mediaLinkInput
          }
        })
      }
    })
  }

  async sendMessage(input: any) {
    try {
      let request = {
        content: input.content,
        media: {
          type: input.media.type,
          link: input.media.link
        }
      }
      // let data = await this.innowayApi.thirdpartyChatbot.sendMessageToCustomer(request);
      this.alertUpdateSuccess()
      // console.log("response", JSON.stringify(data))
    } catch (err) {
      this.alertUpdateFail()
      console.log("response", err)
    }
  }

  sendStoryChatbot(item) {

    let data = {
      stories: this.stories ? this.stories : [],
      subscriberId: item.id
    };

    let dialogRef = this.dialog.open(SendStoryDialog, {
      width: '560px',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        if (result.result) {
          this.sendStory(result.storyId)
        }
      }
    })
  }

  async getStories() {
    try {
      let response = await this.innowayApi.thirdpartyChatbot.getStories({
        thirdparty_chatbot_id: null
      });
      this.stories = response.rows;
      this.story = this.stories[0]._id;
      console.log("getStories", response);
    } catch (err) {
      console.log(err);
    }
  }

  async sendStory(storyId: string) {
    try {
      let response = await this.innowayApi.thirdpartyChatbot.sendStory({
        story_id: storyId,
        thirdparty_chatbot_id: null,
        send_by: "all",
        send_to: []
      });
      console.log("send message", JSON.stringify(response))
      alert(true)
    } catch (err) {
      console.log("send message", err)
      alert(false)
    }
  }

  async export() {
    try {
      let response: any = await this.innowayApi.customer.export()
      this.downloadFile(response)
    } catch (err) {
      console.log("export", err);
    }
  }

  downloadFile(data) {
    let blob = new Blob(['\ufeff' + data], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", "file-khách-hàng.csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  async import(event) {
    let files = this.fileImportUploader.nativeElement.files
    let file = files[0];
    console.log("onChangeImportFile", file);
    try {
      let response = await this.innowayApi.customer.import(file, {
        mode: "overwrite"
      })
    } catch (err) {
      console.log("onChangeImportFile", err);
    }
  }
}
