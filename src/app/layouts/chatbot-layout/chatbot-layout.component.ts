import { Component, OnInit, NgZone } from '@angular/core';
import { PageService } from 'app/apps/chatbot/services/page.service';

@Component({
  selector: 'app-chatbot-layout',
  templateUrl: './chatbot-layout.component.html',
  styleUrls: ['./chatbot-layout.component.scss']
})
export class ChatbotLayoutComponent implements OnInit {

  public subscribedPage = [];

  constructor(
    public pageService: PageService,
    private zone: NgZone
  ) { 
    
  }

  ngOnInit() {
    this.pageService.getPages().subscribe(pages =>{
      this.zone.run(()=>{
        this.subscribedPage = pages.filter(page =>{
          return page.is_webhooks_subscribed;
        })
        // console.log("SUBSCRIED PAGE",this.subscribedPage);
      });
    })
  }

}
