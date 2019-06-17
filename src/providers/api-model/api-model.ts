import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getURL } from '../sanitizer/sanitizer';

/*
  Generated class for the ApiModelProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiModelProvider {

  constructor(public http: HttpClient) {
    console.log('Hello ApiModelProvider Provider');
  }

  getApiModel(endPoint: string, args?: string[]) {
    let url = getURL("table",endPoint, (args) ? args : []);
    return this.http
      .get(url) //, { headers: queryHeaders })
      .map(res => res.json())
  }
}
