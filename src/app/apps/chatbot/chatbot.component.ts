import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from './services/auth.service';
import { PageService } from './services/page.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit {

  public user: any;
  public pages = [];

  constructor(
    public auth: AuthService,
    public pageService: PageService,
    public zone: NgZone,
    private router: Router
  ) { 
    var self = this;
    this.auth.user.getInfo((err,user)=>{
      this.zone.run(()=>{
        this.user = user;
      })
    },"picture,name");
    this.pageService.getPages().subscribe(pages =>{
      this.zone.run(()=>{
        this.pages = pages;
        console.log("PAGES",this.pages);
      })
    });
  }

  ngOnInit() {
    
  }

  subscribeState(is_webhooks_subscribed){
    if(is_webhooks_subscribed){
      return "Đã đăng ký";
    }else{
      return "Chưa đăng ký";
    }
  }

  logout(){
    this.auth.logout();
  }

  subscribePage(page){
    this.pageService.subscribe(page).then(success =>{
      console.log("SUB SUCCESS",success);
      this.router.navigate(["/chatbot/dashboard/settings"]);
    }).catch(err =>{
      console.error("SUB ERROR",err);   
    })
  }

  unsubscribePage(page){
    this.pageService.unsubscribe(page).then(success =>{
      console.log("UNSUB SUCCESS",success);
    }).catch(err =>{
      console.error("UNSUB ERROR",err);   
    })
  }

  // selectPage(page){
  //   this.router.navigate(["/chatbot/dashboard",page.id]);
  //   // this.pageService.getPage(page.access_token).then((page:any)=>{
  //   //   console.log("GET PAGE",page);
  //   //   this.router.navigate(["/chatbot/dashboard",page.id]);
  //   // })
    
  // }

}
