//import * as constants from '../config/constants';
import { Observable } from 'rxjs/Observable';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { BaseHttpService } from '../services/base-http';
import * as constants from '../app/config/constants';
import { getURL } from '../providers/sanitizer/sanitizer';



@Injectable()

export class Xml {
  constructor(public http: Http, private httpService: BaseHttpService) {
    this.xml();
  }

  xml() {
    var queryHeaders = new Headers();
    queryHeaders.append('accept', 'text/xml');
    queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
    return this.httpService.http.get(getURL("table","view_xml"), { headers: queryHeaders })
  }
}