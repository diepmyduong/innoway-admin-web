import { NgModule } from '@angular/core';
import { AccountingPipe } from './accounting/accounting';
import { LoopPipe } from './loop/loop';
@NgModule({
	declarations: [AccountingPipe,
    LoopPipe],
	imports: [],
	exports: [AccountingPipe,
    LoopPipe]
})
export class PipesModule {

	
}
