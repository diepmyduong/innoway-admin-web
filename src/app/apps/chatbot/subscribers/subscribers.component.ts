import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PageService } from '../services/page.service';
import { overlayConfigFactory } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';

@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrls: ['./subscribers.component.scss']
})
export class SubscribersComponent implements OnInit {

  stack = [
    {
      type: "subscribers",
      data: {}
    }
  ];

  public page: any;
  public pid: string;
  public pageObject: any;

  constructor(
    private router:Router,
    private route: ActivatedRoute,
    private modal: Modal,
    private pageService: PageService
  ) { }

  ngOnInit() {
    this.route.parent.params.subscribe(params =>{
      this.pid = params.pid;
      if(this.pageService._pages[this.pid]){
        this.pageObject = this.pageService._pages[this.pid];
        this.page = this.pageObject.data;
      }else{
        this.pageService.getPageWithId(this.pid).then((page:any) =>{
          this.page = page;
          this.pageObject = this.pageService._pages[this.pid];
          this.pageService.getPageWithId(this.pid).then(page =>{
            this.page = page;
          });
        });
      }
    })
  }

  scrollToIndex(index){
    setTimeout(()=>{
      var offset = 0;
      for(var i = 0; i <= index;i++){
        offset += $("#portal-"+index).width();
      }
      $(".portal-container").animate({
          scrollLeft: offset
      }, 1000);
    },500);
  }

  onPortalLoaded(portal){
    this.scrollToIndex(portal.index);
  }

  onPortalClosed(portal){
    this.stack.length = portal.index;
  }

}
