import { NgModule } from '@angular/core';
import { AccountingPipe } from './accounting/accounting';
import { LoopPipe } from './loop/loop';
import { BillFilterPipe } from './bill-filter/bill-filter';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { SafePipe } from "app/pipes/safe/safe-pipe";
@NgModule({
	declarations: [AccountingPipe,SafePipe,
    LoopPipe, BillFilterPipe],
	imports: [Ng2OrderModule],
	exports: [AccountingPipe,SafePipe,
    LoopPipe, BillFilterPipe, Ng2OrderModule]
})
export class PipesModule {


}
