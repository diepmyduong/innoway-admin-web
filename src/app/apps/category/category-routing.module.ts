import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';

import { CategoryComponent } from './category.component';
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
      title: 'Loại sản phẩm'
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
	    	component: CategoryComponent,
	    	data: {
	    		title: "Danh sách"
	    	}
    	},
    	{
	    	path: 'detail/:id',
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
export class CategoryRoutingModule {}
