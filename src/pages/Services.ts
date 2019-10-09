import * as constants from '../app/config/constants';

import { Headers, Http, RequestOptions } from '@angular/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { sanitizeURL } from '../providers/sanitizer/sanitizer';

@Injectable()

export class Services {
  constructor(public http:Http) {

  }


  static getUrl(table: string, args?: string) {
    if (args != null) {
      return constants.DREAMFACTORY_TABLE_URL + '/' + table + '?' + args + '&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    return constants.DREAMFACTORY_TABLE_URL + '/' + table + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  }
  postUrl(table: string) {
    return sanitizeURL(constants.DREAMFACTORY_TABLE_URL + '/' + table);
  }
  postData(endpoint: string, body: any): Observable<any> {
    var queryHeaders = new Headers();
    queryHeaders.append('Content-Type', 'application/json');
    //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
    let options = new RequestOptions({ headers: queryHeaders });
    return this.http.post(this.postUrl(endpoint), body, options)
      .map((response) => {
        return response;
      });
  }
}
