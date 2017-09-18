import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the LoopPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'loop',
})
export class LoopPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value, ...args) {
    let res = [];
    for (let i = 0; i < value; i++) {
        res.push(i);
      }
      return res;
  }
}
