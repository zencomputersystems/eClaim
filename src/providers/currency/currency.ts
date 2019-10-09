import { Injectable } from '@angular/core';
import { formatMoney } from 'accounting-js';

/*
  Generated class for the CurrencyProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CurrencyProvider {

  constructor() {
    
  }

}

export function toCurrency( amount: any, currencyCode: string="RM") {
  if (Array.isArray(amount)) {
    return amount.map((value) => formatMoney(value, { symbol: currencyCode }));
  }
//  console.log("Returning: ",formatMoney(amount, { symbol: currencyCode }));
  return formatMoney(amount,{ symbol: (currencyCode) ? currencyCode : "" });
}