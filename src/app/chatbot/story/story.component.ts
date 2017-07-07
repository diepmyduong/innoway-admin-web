import { Component, OnInit } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal/modal.component';
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

  constructor(
    private modal: Modal
  ) { }

  ngOnInit() {
    console.log($);
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
      data: portal.data
    })
    console.log("STACK",this.stack);
  }

  scrollToIndex(index){
    setTimeout(()=>{
      console.log("TARGET",$("#portal-"+index).offset().left);
      $(".portal-container").animate({
          scrollLeft: $("#portal-"+index).offset().left
      }, 1000);
    },500);
    
    // $("portal-container").scrollTo("portal-"+index);
  }

  onPortalLoaded(portal){
    console.log("LOADED PORTAL",portal);
    this.scrollToIndex(portal.index);
  }

}
