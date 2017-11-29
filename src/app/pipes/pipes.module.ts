import { NgModule } from '@angular/core';
import { AccountingPipe } from './accounting/accounting';
import { LoopPipe } from './loop/loop';
import { BillFilterPipe } from './bill-filter/bill-filter';
@NgModule({
	declarations: [AccountingPipe,
    LoopPipe, BillFilterPipe],
	imports: [],
	exports: [AccountingPipe,
    LoopPipe, BillFilterPipe]
})
export class PipesModule {

	
}
