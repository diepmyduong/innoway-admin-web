import { Component, OnInit } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal/modal.component';
import { Router, ActivatedRoute } from '@angular/router';
import { PageService } from '../services/page.service';
import { overlayConfigFactory } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { CardTypesModalContext, ModalCardTypesComponent } from '../modals/modal-card-types/modal-card-types.component';
import { TextCardModalContext, ModalTextCardComponent } from '../modals/modal-text-card/modal-text-card.component';
import { ButtonCardModalContext, ModalButtonCardComponent } from '../modals/modal-button-card/modal-button-card.component';
import { ImageCardModalContext, ModalImageCardComponent} from '../modals/modal-image-card/modal-image-card.component';

declare var $:any;

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss']
})
export class StoryComponent implements OnInit {

  stack = [
    {
      type: "stories",
      data: {}
    }
  ];

  public page: any;
  public pid: string;
  public pageObject: any;

  constructor(
    private router:Router,
    private activatedRoute: ActivatedRoute,
    private modal: Modal,
    private pageService: PageService
  ) { }

  ngOnInit() {
    this.activatedRoute.parent.params.subscribe(params =>{
      this.pid = params.pid;
      if(this.pageService._pages[this.pid]){
        this.pageObject = this.pageService._pages[this.pid];
        this.page = this.pageObject.data;
        console.log("PAGE OBJECT",this.pageObject);;
      }else{
        this.pageService.getPageWithId(this.pid).then((page:any) =>{
          this.page = page;
          this.pageObject = this.pageService._pages[this.pid];
          console.log("PAGE",this.page);
          console.log("PAGE OBJECT",this.pageObject);
          this.pageService.getPageWithId(this.pid).then(page =>{
            this.page = page;
          });
        });
      }
    })
  }

  showModal(type){
    switch (type) {
      case "card_types":
        this.modal.open(ModalCardTypesComponent, 
        overlayConfigFactory({ 
          type: "text" 
        },
        CardTypesModalContext));
        break;
      case "text_card":
        this.modal.open(ModalTextCardComponent,
        overlayConfigFactory({
          data: {
            text: "Hello"
          }
        },TextCardModalContext));
        break;
      case "button_card":
        this.modal.open(ModalButtonCardComponent,
        overlayConfigFactory({
          data: {}
        },ButtonCardModalContext));
        break;
      case "image_card":
        this.modal.open(ModalImageCardComponent,
        overlayConfigFactory({
          data: {}
        },ImageCardModalContext));
        break;
      default:
        break;
    }
  }

  onStorySelected(portal){
    console.log("SELECTED STORY",portal);
    this.stack.length = portal.index + 1;
    this.stack.push({
      type: "story",
      data: this.pageObject.buildStory(portal.data)
    })
    console.log("STACK",this.stack);
  }

  scrollToIndex(index){
    setTimeout(()=>{
      console.log("TARGET",$("#portal-"+index).offset().left);
      var offset = 0;
      for(var i = 0; i <= index;i++){
        offset += $("#portal-"+index).width();
      }
      $(".portal-container").animate({
          scrollLeft: offset
      }, 1000);
    },500);
    
    // $("portal-container").scrollTo("portal-"+index);
  }

  onPortalLoaded(portal){
    console.log("LOADED PORTAL",portal);
    this.scrollToIndex(portal.index);
  }

  onPortalClosed(portal){
    console.log("CLOSE PORTAL",portal);
    this.stack.length = portal.index;
  }

  onQuickReplies(portal){
    console.log('quick replies at', portal);
    this.stack.length = portal.index + 1;
    this.stack.push({
      type: "quick_replies",
      data: portal.data
    })
  }
  

}
