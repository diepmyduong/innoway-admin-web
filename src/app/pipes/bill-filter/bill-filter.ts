import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'billFilter',
  pure: false
})
export class BillFilterPipe implements PipeTransform {
  transform(items: any[], options: any): any[] {
        if(!items) return [];
        
        if(!options) return items;

        if (options.billId)
        {
          items = items.filter( (val, index, array) => {
            return val.id.indexOf(options.billId) >=0;
          });
        }

        if (options.billAction)
        {
          items = items.filter( (val, index, array) => {
            return val.activity.action == options.billAction;
          });
        }

        if (options.billPhone)
        {
          items = items.filter( (val, index, array) => {
            if (val.customer && val.customer.phone)
            return val.customer.phone.indexOf(options.billPhone) >=0;
          });
        }
        
        if (options.billCustomer)
        {
          items = items.filter( (val, index, array) => {
            if (val.customer && val.customer.fullname)
            return val.customer.fullname.indexOf(options.billCustomer) >=0;
          });
        }
        
        if (options.billEmployee)
        {
          items = items.filter( (val, index, array) => {
            if (val.activity && val.activity.employee_id)
            return val.activity.employee_id == options.billEmployee;
          });
        }
        if (options.billArea)
        {
          items = items.filter( (val, index, array) => {
            return val.address.indexOf(options.billArea + ',') >= 0;
          });
        }
        
        return items;

    //     if(!options) return items;
    // searchText = searchText.toLowerCase();
    // return items.filter( it => {
    //     return it.toLowerCase().includes(searchText);
    //     });
   }
}