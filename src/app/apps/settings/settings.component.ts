import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public pid:string;

  constructor(
    private router: Router,
    private route : ActivatedRoute
  ) { 
    
    // const parentActivatedRoute = router.routerState.root.parent(activatedRoute);
    // this.pid = parentActivatedRoute.params.map(routeParams => routeParams.id);
  }

  ngOnInit() {
  }

}
