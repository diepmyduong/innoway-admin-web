import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { overlayConfigFactory } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { CardTypesModalContext, ModalCardTypesComponent } from '../../modals/modal-card-types/modal-card-types.component';
import { TextCardModalContext, ModalTextCardComponent } from '../../modals/modal-text-card/modal-text-card.component';
import { ButtonCardModalContext, ModalButtonCardComponent } from '../../modals/modal-button-card/modal-button-card.component';
import { ImageCardModalContext, ModalImageCardComponent} from '../../modals/modal-image-card/modal-image-card.component';
import { ButtonTypesModalContext, ModalButtonTypesComponent } from '../../modals/modal-button-types/modal-button-types.component';
import { GenericCardModalContext, ModalGenericCardComponent} from '../../modals/modal-generic-card/modal-generic-card.component';
import { ElementModalContext, ModalElementComponent} from '../../modals/modal-element/modal-element.component';
import { PageService } from '../../services/page.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-story-portal',
  templateUrl: './story-portal.component.html',
  styleUrls: ['./story-portal.component.scss']
})
export class StoryPortalComponent implements OnInit {

  @Input() story:any;
  @Input() stackIndex:number;
  @Output() onLoaded = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<any>();
  @Output() onPostbackSelected = new EventEmitter<any>();
  @Output() onQuickRepliesSelected = new EventEmitter<any>();
  @Output() onSchedule = new EventEmitter<any>();

  public data:any;
  page:any;
  keys = [];
  // keyValidators = [this.onAddingKey];
  cards = []; 

  constructor(
    private modal : Modal,
    private pageService: PageService,
    private route:ActivatedRoute
  ) {
    
  }

  ngOnInit() {
    
    this.onLoaded.emit({
      index: this.stackIndex,
      data: this.story
    })
    this.page = this.story._page;
    this.data = this.story._story;
    this.getCards();
    this.getKeys();
  }

  getCards(){
    console.log("GET CARDS",this.story);
    this.pageService.getCards(this.story).then((cards:any) =>{
      this.cards = cards;
    })
  }
  getKeys(){
    this.pageService.getKeys(this.story).then((keys:any)=>{
      this.keys = keys;
    });
  }

  closePortal(){
    this.onClose.emit({
      index: this.stackIndex
    })
  }

  addCard(){
    this.showModal("card_types",{
      type: "text"
    }).then(modal =>{
      modal.result.then(res => {
        if(res){
          switch(res.type){
            case "text":
              this.addTextCard();
              break;
            case "buttons":
              this.addButtonCard();
              break;
            case "generic":
              this.addGenericCard();
              break;
            default:
              return;
          }
        }
      });
    })
  }

  addTextCard(){
    this.showModal("text_card",{
      data: {
        text: "hello"
      }
    }).then(modal =>{
      modal.result.then(res =>{
        if(res){
          this.pageService.addTextCard(this.story,res).then(success =>{
            this.cards.push(success);
            console.log("ADD TEXT",success);
          })
        }
      });
    });
  }

  editTextCard(card){
    this.showModal("text_card",{
      data: card.data
    }).then(modal =>{
      modal.result.then(res =>{
        if(res){
          card.data = res;
          this.pageService.updateCard(this.story,card).then(success =>{
            card = success;
            console.log("EDIT TEXT",success);
          });
        }
        
      })
    })
  }

  addButtonCard(){
    this.showModal("button_card",{
      data: {text: ""}
    }).then(modal =>{
      modal.result.then(res =>{
        if(res){
          this.pageService.addButtonCard(this.story,res).then(success =>{
            this.cards.push(success);
            console.log("ADD BUTTON CARD",success);
          })
        }
      });
    });
  }

  editButtonsCard(card){
    this.showModal("button_card",{
      data: card.data
    }).then(modal =>{
      modal.result.then(res =>{
        if(res){
          card.data = Object.assign(card.data,res);
          this.pageService.updateCard(this.story,card).then(success =>{
            card = success;
            console.log("EDIT BUTTONS",success);
          });
        }
      })
    });
  }

  addGenericCard(){
    this.showModal("generic_card",{
      data: { 
        type: "static"
      }
    }).then(modal =>{
      modal.result.then(res =>{
        if(res){
          res.elements = [{
            title: "Title",
            subtitle: "Sub Title",
            image_url: "https://hlfppt.org/wp-content/uploads/2017/04/placeholder.png"
          }];
          this.pageService.addGenericCard(this.story,res).then(success =>{
            this.cards.push(success);
            console.log("ADD GENERIC CARD",success);
          })
        }
      })
    });
  }

  editGenericCard(card){
    this.showModal("generic_card",{
      data: card.data
    }).then(modal =>{
      modal.result.then(res =>{
        if(res){
          card.data = Object.assign(card.data,res);
          this.pageService.updateCard(this.story,card).then(success =>{
            card = success;
            console.log("EDIT GENERIC",success);
          });
        }
      })
    });
  }

  addImageCard(){
    this.showModal("image_card").then(modal =>{
      modal.result.then(res =>{

      });
    });
  }

  showModal(type,option = {}){
    switch (type) {
      case "card_types":
        return this.modal.open(ModalCardTypesComponent, 
        overlayConfigFactory(option,CardTypesModalContext));
      case "text_card":
        return this.modal.open(ModalTextCardComponent,
        overlayConfigFactory(option,TextCardModalContext));
      case "button_card":
        return this.modal.open(ModalButtonCardComponent,
        overlayConfigFactory(option,ButtonCardModalContext));
      case "image_card":
        return this.modal.open(ModalImageCardComponent,
        overlayConfigFactory(option,ImageCardModalContext));
      case "button_type":
        return this.modal.open(ModalButtonTypesComponent, 
          overlayConfigFactory(option,ButtonTypesModalContext));
      case "generic_card":
        return this.modal.open(ModalGenericCardComponent, 
          overlayConfigFactory(option,GenericCardModalContext));
      case "generic_element":
        return this.modal.open(ModalElementComponent, 
          overlayConfigFactory(option,ElementModalContext));
      default:
        break;
    }
  }

  onCardEdited(card,index){
    var c = this.cards[index];
    switch(c.type){
      case 'text':
        this.editTextCard(c);
        break;
      case 'buttons':
        this.editButtonsCard(c);
        break;
      case 'generic':
        this.editGenericCard(c);
        break;
    }
    console.log("On card edited",this.cards[index]);
  }

  onCardRemoved(card,index){
    this.modal.confirm()
      .title("Xoá Card")
      .okBtn("Xoá")
      .cancelBtn("Huỷ")
      .size("sm")
      .message("Bạn có chắc muốn xoá Card này")
      .open()
      .catch(err =>{}).then((modal:any) =>{
        modal.result.then(res =>{
          if(res){
            var c = this.cards[index];
            this.pageService.removeCard(this.story,c).then(success =>{
              this.cards.splice(index,1);
              console.log("Remove card",success);
            });
          }
        })
      })
    console.log("On card removed",index);
  }

  onCardOrderChanged(direction,index){
    if(direction == "up" && index > 0){
      this.swapCard(index,index-1);
    }else if(direction == "down" && index < this.cards.length -1 ){
      this.swapCard(index,index+1);
    }
    console.log("On card order changed",index);
  }

  private swapCard(from,to){
    var temp = this.cards[to];
    this.cards[to] = this.cards[from];
    this.cards[from] = temp;
  }

  onAddingKey(tag){
    this.keys.length = this.keys.length - 1;
    console.log('ADD KEY',tag);
    this.pageService.addKey(this.story,tag.key).then(success=>{
      this.keys.push(success);
    })
  }

  onAddButton(cardIndex){
    console.log("Add button at ",cardIndex);
    this.showModal("button_type",{
      type: "web_url",
      data: {
        title: ""
      }
    }).then(modal =>{
      modal.result.then(res =>{
        if(res){
          var card = this.cards[cardIndex];
          if(!card.data.buttons){
            card.data.buttons = [res];
          }else if(card.data.buttons.length < 3){
            card.data.buttons.push(res);
          }
          this.pageService.updateCard(this.story,card).then(success =>{
            console.log("EDITED");
          });
        }
        
      })
    })
  }
  
  onEditButton(buttonIndex,cardIndex){
    console.log("Edit button "+buttonIndex+" at",cardIndex);
    var card = this.cards[cardIndex];
    var button = card.data.buttons[buttonIndex];
    switch(button.type){
      case "web_url":
        this.showModal("button_type",{
          type : button.type,
          data: {
            title: button.title,
            url: button.url
          }
        }).then(modal =>{
          modal.result.then(res =>{
            if(res){
              card.data.buttons[buttonIndex] = res;
              this.pageService.updateCard(this.story,card).then(success =>{
                console.log("UPDATE SUCCESS",success);
              })
            }
          });
        });
        break;
      case "postback":
        this.showModal("button_type",{
          type : button.type,
          data: {
            title: button.title,
            payload: button.payload
          }
        }).then(modal =>{
          modal.result.then(res =>{
            if(res){
              card.data.buttons[buttonIndex] = res;
              this.pageService.updateCard(this.story,card).then(success =>{
                console.log("UPDATE SUCCESS",success);
              })
            }
          });
        });
        break;
      default:
        return;
    }
  }

  onRemoveButton(buttonIndex,cardIndex){
    console.log("Remove button "+buttonIndex+" at",cardIndex);
    this.cards[cardIndex].data.buttons.splice(buttonIndex,1);
    this.pageService.updateCard(this.story,this.cards[cardIndex]).then(success=>{
      console.log("REMOVED",success);
    });
  }

  onPostback(buttonIndex,cardIndex){
    console.log("Open button "+buttonIndex+" postback at",cardIndex);
    var card = this.cards[cardIndex];
    var button = card.data.buttons[buttonIndex];
    this.pageService.getStory(this.page,button.payload).then((story:any) =>{
      console.log('Selected value is: ', story);
      this.onPostbackSelected.emit({
        index: this.stackIndex,
        data: story._story
      });
    })
  }

  onElementPostback(event,cardIndex){
    console.log("Open button "+event.buttonIndex+" postback at",cardIndex);
    var card = this.cards[cardIndex];
    var button = card.data.elements[event.elementIndex].buttons[event.buttonIndex];
    this.pageService.getStory(this.page,button.payload).then((story:any) =>{
      console.log('Selected value is: ', story);
      this.onPostbackSelected.emit({
        index: this.stackIndex,
        data: story._story
      });
    })
  }

  onQuickReplies(cardIndex){
    
    this.onQuickRepliesSelected.emit({
      index: this.stackIndex,
      data: {
        story: this.story,
        card: this.cards[cardIndex]
      }
    });
  }

  onAddElement(swiper,cardIndex){
    console.log("Add element at",cardIndex);
    this.showModal("generic_element",{
      data: {
        title: "",
        subtitle: "",
        image_url: ""
      }
    }).then(modal =>{
      modal.result.then(res =>{
        if(res){
          var card = this.cards[cardIndex];
          if(card.data.elements.length < 10){
            card.data.elements.push(res);
          }
          this.pageService.updateCard(this.story,card).then(success =>{
            console.log("ADDED",success);
            swiper.slideTo(swiper.slides.length - 1);
          });
        }
      })
    })
  }

  onEditElement(elementIndex,cardIndex){
    console.log("Edit element "+elementIndex+" at",cardIndex);
    var card = this.cards[cardIndex];
    var element = card.data.elements[elementIndex];
    this.showModal("generic_element",{
      data: element
    }).then(modal =>{
      modal.result.then(res =>{
        if(res){
          card.data.elements[elementIndex] = Object.assign(element,res);
          this.pageService.updateCard(this.story,card).then(success =>{
            console.log("EDITED",success);
          });
        }
      })
    })
  }

  onRemoveElement(event,cardIndex){
    console.log("Remove element "+event.index+ " at",cardIndex);
    this.cards[cardIndex].data.elements.splice(event.index,1);
    this.pageService.updateCard(this.story,this.cards[cardIndex]).then(success=>{
      console.log("REMOVED",success);
      event.swiper.removeSlide(event.index);
    });
  }

  onAddElementButton(event,cardIndex){
    console.log("Add button at ",cardIndex);
    this.showModal("button_type",{
      type: "web_url",
      data: {
        title: ""
      }
    }).then(modal =>{
      modal.result.then(res =>{
        if(res){
          var card = this.cards[cardIndex];
          card.data.elements[event.elementIndex].buttons
          if(!card.data.elements[event.elementIndex].buttons){
            card.data.elements[event.elementIndex].buttons = [res];
          }else if(card.data.elements[event.elementIndex].buttons.length < 3){
            card.data.elements[event.elementIndex].buttons.push(res);
          }
          this.pageService.updateCard(this.story,card).then(success =>{
            console.log("ADDED");
          });
        }
        
      })
    })
  }

  onEditElementButton(event,cardIndex){
    console.log("Edit button "+event.buttonIndex+" at",cardIndex);
    var card = this.cards[cardIndex];
    var button = card.data.elements[event.elementIndex].buttons[event.buttonIndex];
    switch(button.type){
      case "web_url":
        this.showModal("button_type",{
          type : button.type,
          data: {
            title: button.title,
            url: button.url
          }
        }).then(modal =>{
          modal.result.then(res =>{
            if(res){
              card.data.elements[event.elementIndex].buttons[event.buttonIndex] = res;
              this.pageService.updateCard(this.story,card).then(success =>{
                console.log("UPDATE SUCCESS",success);
              })
            }
          });
        });
        break;
      case "postback":
        this.showModal("button_type",{
          type : button.type,
          data: {
            title: button.title,
            payload: button.payload
          }
        }).then(modal =>{
          modal.result.then(res =>{
            if(res){
              card.data.elements[event.elementIndex].buttons[event.buttonIndex] = res;
              this.pageService.updateCard(this.story,card).then(success =>{
                console.log("UPDATE SUCCESS",success);
              })
            }
          });
        });
        break;
      default:
        return;
    }
  }

  onRemoveElementButton(event,cardIndex){
    console.log("Remove button "+event.buttonIndex+" at",cardIndex);
    this.cards[cardIndex].data.elements[event.elementIndex].buttons.splice(event.buttonIndex,1);
    this.pageService.updateCard(this.story,this.cards[cardIndex]).then(success=>{
      console.log("REMOVED",success);
    });
  }

  showSchedule(){
    this.onSchedule.emit({
      index: this.stackIndex,
      data: this.story
    })
  }

}
