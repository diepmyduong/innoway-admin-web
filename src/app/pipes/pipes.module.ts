import { NgModule } from '@angular/core';
import { AccountingPipe } from './accounting/accounting';
import { LoopPipe } from './loop/loop';
import { BillFilterPipe } from './bill-filter/bill-filter';
import { Ng2OrderModule } from 'ng2-order-pipe';
@NgModule({
	declarations: [AccountingPipe,
    LoopPipe, BillFilterPipe],
	imports: [Ng2OrderModule],
	exports: [AccountingPipe,
    LoopPipe, BillFilterPipe, Ng2OrderModule]
})
export class PipesModule {


}
