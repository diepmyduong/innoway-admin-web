import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';

import { NotificationTypeComponent } from './notification-type.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'list',
		pathMatch: 'full'
	},
  {
    path: '',
    data: {
      title: 'Loại notification'
    },
    children:[
    	{
	    	path: 'add',
	    	component: AddComponent,
	    	data: {
	    		title: "Thêm"
	    	}
    	},
    	{
	    	path: 'list',
	    	component: NotificationTypeComponent,
	    	data: {
	    		title: "Danh sách"
	    	}
    	},
    	{
	    	path: 'detail',
	    	component: DetailComponent,
	    	data: {
	    		title: "Chi tiết"
	    	}
    	},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationTypeRoutingModule {}
