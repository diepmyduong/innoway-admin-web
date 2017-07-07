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

  constructor(
    private activatedRoute: ActivatedRoute,
    private pageService: PageService,
    private router: Router
  ) { 
    

  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params =>{
      this.pid = params.pid;
      this.pageService.getPageWithId(this.pid).then((page:any) =>{
        this.page = page;
        console.log("PAGE",this.page);
        if(!page.is_webhooks_subscribed) this.router.navigate(['/chatbot/pages']);
      });
    })
  }

}
