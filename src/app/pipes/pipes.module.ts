import { NgModule } from '@angular/core';
import { AccountingPipe } from './../pipes/accounting/accounting';
import { LoopPipe } from './../pipes/loop/loop';
@NgModule({
	declarations: [AccountingPipe,
    LoopPipe],
	imports: [],
	exports: [AccountingPipe,
    LoopPipe]
})
export class PipesModule {}
