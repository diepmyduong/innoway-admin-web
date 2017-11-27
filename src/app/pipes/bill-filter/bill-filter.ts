import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'bill-filter'
})
export class BillFilterPipe implements PipeTransform {
  transform(items: any[], options: any[]): any[] {
        if(!items) return [];

    //     if(!options) return items;
    // searchText = searchText.toLowerCase();
    // return items.filter( it => {
    //     return it.toLowerCase().includes(searchText);
    //     });
   }
}