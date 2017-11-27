import { Pipe, PipeTransform } from '@angular/core';

declare var accounting:any;

/**
 * Generated class for the AccountingPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'accounting',
})
export class AccountingPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: any, options = {}) {
    var number:number;
    options = Object.assign({
      symbol : "đ",
      decimal : ",",
      thousand: ".",
      precision : 0,
      format: "%v %s"
    },options);
    try {
      if(typeof(value) === "string"){
        number = parseFloat(value);
      }else if(typeof(value) === "number"){
        number = value;
      }
      return accounting.formatMoney(number,options);
    } catch(err){
      return "NAN";
    }
  }
}
