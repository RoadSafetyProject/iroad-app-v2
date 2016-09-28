import { Injectable, Pipe } from '@angular/core';

/*
  Generated class for the Keys pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
@Pipe({
  name: 'keys'
})
@Injectable()
export class Keys {
  /*
    Takes a value and makes it lowercase.
   */
  transform(value: any, args: any[]) {
    let keys = [];
    if(value){
      for (let key in value) {
        let newValue = value[key];
        let newKey = (key.charAt(0).toUpperCase() + key.slice(1)).replace(/([A-Z])/g, ' $1').trim();
        keys.push({key: newKey, value: newValue});
      }
    }
    return keys;
  }
}
