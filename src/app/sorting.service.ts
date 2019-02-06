import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SortingService {

  constructor() { }

  static sortAlphanumeric(a: any, b: any) {
    const reA = /[^a-zA-Z]/g;
    const reN = /[^0-9]/g;

    a = a.toString();
    b = b.toString();

    const aA = a.replace(reA, '');
    const bA = b.replace(reA, '');
    if (aA === bA) {
      const aN = parseInt(a.replace(reN, ''), 10);
      const bN = parseInt(b.replace(reN, ''), 10);
      return aN === bN ? 0 : aN > bN ? 1 : -1;
    } else {
      return aA > bA ? 1 : -1;
    }
  }
}
