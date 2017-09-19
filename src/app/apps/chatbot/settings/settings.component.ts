import { Component, OnInit , NgZone} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PageService } from '../services/page.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public nodes = [
    {
      id: 1,
      name: 'root1',
      children: [
        { id: 2, name: 'child1' },
        { id: 3, name: 'child2' }
      ]
    },
    {
      id: 4,
      name: 'root2',
      children: [
        { id: 5, name: 'child2.1' },
        {
          id: 6,
          name: 'child2.2',
          children: [
            { id: 7, name: 'subsub' }
          ]
        }
      ]
    }
  ];
  public pid: string;
  public page: any;
  public settings: any;
  public pageObject:any;

  public stack = [];

  constructor(
    private router:Router,
    private route: ActivatedRoute,
    private pageService: PageService,
    private zone: NgZone
  ) { 
    
  }

  ngOnInit() {
    this.route.parent.params.subscribe(params =>{
      this.pid = params.pid;
      if(this.pageService._pages[this.pid]){
        this.pageObject = this.pageService._pages[this.pid];
        this.page = this.pageObject.data;
        console.log("PAGE OBJECT",this.pageObject);
        this.getPageSettings();
      }else{
        this.pageService.getPageWithId(this.pid).then((page:any) =>{
          this.page = page;
          this.pageObject = this.pageService._pages[this.pid];
          console.log("PAGE",this.page);
          console.log("PAGE OBJECT",this.pageObject);
          this.pageService.getPageWithId(this.pid).then(page =>{
            this.page = page;
            this.getPageSettings();
          });
        });
      }
    })
  }

  private getPageSettings(){
    this.pageService.getPageSettings(this.pageObject).then(settings =>{
      console.log("SETTINGS",settings);
      this.zone.run(()=>{
        this.settings = settings;
        this.stack = [{
          type: "get_started",
          data: {}
        }]
      });
    });
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

  openMenuSetting(){
    this.zone.run(()=>{
      this.stack = [];
      this.stack.push({
        type: "menu",
        data: this.settings.settings.persistent_menu
      })
    });
    
  }

  openGreetingSetting(){
    this.zone.run(()=>{
      this.stack = [];
      this.stack.push({
        type: "greeting",
        data: this.settings.settings.greeting
      })
    });
  }
  openGetStartedSetting(){
    this.zone.run(()=>{
      this.stack = [];
      this.stack.push({
        type: "get_started",
        data: this.settings.settings.get_started
      })
    })
  }

  onStorySelected(portal){
    console.log("STORY SELECTED",portal);
    this.stack.length = portal.index + 1;
    this.stack.push({
      type: "story",
      data: portal.data
    })
  }

  onNestedMenuSelected(portal){
    console.log("Item Selected",portal);
    this.stack.length = portal.index + 1;
    this.stack.push({
      type: "submenu",
      data: portal.data
    })
  }

  onPortalClosed(portal){
    console.log("CLOSE PORTAL",portal);
    this.stack.length = portal.index;
  }

}
