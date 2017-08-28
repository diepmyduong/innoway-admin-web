import { Component, OnInit ,Output, EventEmitter ,Input} from '@angular/core';
import { PageService } from '../../services/page.service';

@Component({
  selector: 'app-schedule-portal',
  templateUrl: './schedule-portal.component.html',
  styleUrls: ['./schedule-portal.component.scss']
})
export class SchedulePortalComponent implements OnInit {

  @Input() stackIndex:number = 0;
  @Input() page:any;
  @Output() onLoaded = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<any>();

  public hours = [];
  public days = [
    { 
      title: "CN",
      actives : []
    },
    { 
      title: "T2",
      actives : []
    },
    { 
      title: "T3" ,
      actives : []
    },
    { 
      title: "T4" ,
      actives : [] 
    },
    { 
      title: "T5" ,
      actives : []
    },
    { 
      title: "T6" ,
      actives : []
    },
    { 
      title: "T7" ,
      actives : []
    }
  ];
  public jobs = [
    {
      cron: "30 12 * * 0,1,2,4,5"
    },
    {
      cron: "0 17 * * 2,6"
    },
    {
      cron: "0 13 * * 3,1"
    }
  ]

  constructor() { }

  ngOnInit() {
    this.onLoaded.emit({
      index: this.stackIndex,
      data: {}
    })
    for(var i = 1; i <=24; i++){
      this.hours.push(i);
    }
    this.jobs.forEach((job:any) =>{
      var result = this.renderCron(job.cron);
      job.days = result.days;
      job.time = result.time;
      console.log("JOB",job);
    })
  }

  closePortal(){
    this.onClose.emit({
      index: this.stackIndex
    })
  }

  sortNumber(a,b){
    return a - b
  }

  private renderCron(cron){
    var temp = cron.split(" ");
    var dayOfWeek = temp[4].split(",");
    console.log("TIME",(parseInt(this.pad(temp[1],2))+1)+":"+this.pad(temp[0],2));
    var result = {
      time: (parseInt(this.pad(temp[1],2))+1)+":"+this.pad(temp[0],2),
      days: {}
    };

    dayOfWeek.forEach(day => {
      result.days[day] =  true;
      var index = dayOfWeek.indexOf(parseInt(temp[1]));
      if(index == -1){
        this.days[day].actives.push(parseInt(temp[1]));
        this.days[day].actives.sort(this.sortNumber);
      }
    });
    return result;
    // return null;
  }

  private pad(n, width, z = '0') {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

}
