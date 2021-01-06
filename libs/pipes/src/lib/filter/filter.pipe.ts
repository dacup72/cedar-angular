import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
// TODO: Change to cylinder specific filter
export class FilterPipe implements PipeTransform {
  transform(value: any[], args: Object): any {
    const resultArray = [];

    if(value.length === 0 || !args) {
      return value;
    }

    for(const item of value) {
      let filtersMet = true;

      for(const key in args) {   
        if(args[key] === '') {
          continue;
        }

        if(Array.isArray(item[key]) && Array.isArray(args[key])) {
          for(const argItem of args[key]) {
            if(!item[key].includes(argItem)) {
              filtersMet = false;
              break;
            }
          }
        }
        else if(Array.isArray(args[key])) {
          for(const argItem of args[key]) {
            if(item[key] !== argItem) {
              filtersMet = false;
              break;
            }
          }
        }
        else {
          if(item[key] !== args[key]) {
            filtersMet = false;
            break;
          }
        }
      }

      if(filtersMet) {
        resultArray.push(item);
      }
    }

    return resultArray;
  }

}
