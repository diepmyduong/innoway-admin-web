import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';

import { ImportHistoryComponent } from './import-history.component';
import { AddComponent } from './add/add.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'list',
		pathMatch: 'full'
	},
  	{
    path: '',
    data: {
      title: 'Lịch sử nhập khẩu'
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
	    	component: ImportHistoryComponent,
	    	data: {
	    		title: "Danh sách"
	    	}
    	}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportHistoryRoutingModule {}
