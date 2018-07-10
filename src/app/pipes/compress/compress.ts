import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the AccountingPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'compress',
})
export class CompressPipe implements PipeTransform {

  token: string = ''
  constructor() {
    this.token = 'ce81e01ac'
  }

  transform(value: string, width: number):any {
    if (!value || value.startsWith('dynamic/')) {
      return value
    } else {
      if (!width || width == 0) {
        width = 180
      }
      return '//' + this.token + '.cloudimg.io/width/' + width + '/png-lossy-20/' + value
    }
  }
}
