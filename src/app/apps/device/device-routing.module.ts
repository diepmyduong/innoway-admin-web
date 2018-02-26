import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';

import { DeviceComponent } from './device.component';
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
      title: 'Loại hợp đồng'
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
	    	path: 'add/:id',
	    	component: AddComponent,
	    	data: {
	    		title: "Sửa"
	    	}
    	},
    	{
	    	path: 'list',
	    	component: DeviceComponent,
	    	data: {
	    		title: "Danh sách"
	    	}
    	},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceRoutingModule {}
