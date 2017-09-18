import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { ActivatedRoute , Router} from '@angular/router';
import { PageService } from '../services/page.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  public pid:string;
  public page: any;
  public pageObject:any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private pageService: PageService,
    private router: Router
  ) { 
    

  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params =>{
      this.pid = params.pid;
      if(this.pageService._pages[this.pid]){
        this.pageObject = this.pageService._pages[this.pid];
        this.page = this.pageObject.data;
        console.log("PAGE OBJECT",this.pageObject);
      }else{
        this.pageService.getPageWithId(this.pid).then((page:any) =>{
          this.page = page;
          this.pageObject = this.pageService._pages[this.pid];
          console.log("PAGE",this.page);
          console.log("PAGE OBJECT",this.pageObject);
          if(!page.is_webhooks_subscribed) this.router.navigate(['/chatbot/pages']);
        });
      }
      
      
    })
  }

}
