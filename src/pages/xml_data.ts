//import * as constants from '../config/constants';
import { Observable } from 'rxjs/Observable';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { BaseHttpService } from '../services/base-http';
import * as constants from '../app/config/constants';



@Injectable()

export class Xml {

    baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_xml';

  constructor(public http:Http, private httpService: BaseHttpService) {
   this.xml();
  }

  xml() {
    console.log(this.baseResourceUrl);
    //let bank :any;
    var queryHeaders = new Headers();
    queryHeaders.append('accept', 'text/xml');
    //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
    return this.httpService.http
        .get(this.baseResourceUrl, {  headers: queryHeaders })
        .map(() => {
                // let banks: Array<UserInfo_Model> = [];
                // result.resource.forEach((bank) => {
                // 	banks.push(BankSetup_Model.fromJson(bank));
                // });  
                // return banks;
            })
           
}

//   save_user_qualification(): Observable<any> {
//     var queryHeaders = new Headers();
//     queryHeaders.append('Content-Type', 'application/json');
//     //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
//     queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
//     let options = new RequestOptions({ headers: queryHeaders });
//     return this.httpService.http.post(this.baseResourceUrl5, user_qualification.toJson(true), options)
//         .map((response) => {
//             return response;
//         });
// }
}