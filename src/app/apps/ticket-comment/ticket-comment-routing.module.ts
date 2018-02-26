import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';

import { TicketCommentComponent } from './ticket-comment.component';
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
      title: 'Loại TicketComment'
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
	    	component: TicketCommentComponent,
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
export class TicketCommentRoutingModule {}
