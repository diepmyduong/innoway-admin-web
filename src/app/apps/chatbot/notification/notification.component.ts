import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PageService } from '../services/page.service';


@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  stack = [
    {
      type: "schedule",
      data: {}
    }
  ];

  public page: any;
  public pid: string;
  public pageObject: any;

  constructor(
    private router:Router,
    private activatedRoute: ActivatedRoute,
    private pageService: PageService
  ) { }

  ngOnInit() {
    this.activatedRoute.parent.params.subscribe(params =>{
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
