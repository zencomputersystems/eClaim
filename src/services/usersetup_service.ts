import {Injectable} from '@angular/core';
import {Http, Headers,RequestOptions, URLSearchParams} from '@angular/http';

import * as constants from '../app/config/constants';
//import {EntertainmentClaim_Model} from '../models/entertainment_model';
import {UserInfo_Model} from '../models/usersetup_info_model';
import {UserMain_Model} from '../models/user_main_model';
import {UserContact_Model} from '../models/user_contact_model';
import { UserCompany_Model } from '../models/user_company_model';
import {UserAddress_Model} from '../models/usersetup_address_model';
import {BaseHttpService} from './base-http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';
//import 'rxjs/add/observable/throw';

import { NavController } from 'ionic-angular';

class ServerResponse {
	constructor(public resource: any) {
        
	}
};
@Injectable()
export class UserSetup_Service 
{	
	baseResourceUrl1: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/user_info';
	baseResource_Url1: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

	baseResourceUrl2: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/user_main';
	baseResource_Url2: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

	baseResourceUrl3: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/user_contact';
	baseResource_Url3: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

	baseResourceUrl4: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/user_company';
	baseResource_Url4: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

	baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/user_address';
	baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

	
	
	constructor(private httpService: BaseHttpService, private nav: NavController) {};
	
    private handleError (error: any) {
	   let errMsg = (error.message) ? error.message :
	   error.status ? `${error.status} - ${error.statusText}` : 'Server error';
	   console.log(errMsg); // log to console instead
	   //localStorage.setItem('session_token', '');       
	  return Observable.throw(errMsg);
    }
    
    query (params?:URLSearchParams): Observable<UserInfo_Model[]> 
    {       
        //let bank :any;
		var queryHeaders = new Headers();
    	queryHeaders.append('Content-Type', 'application/json');
    	//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    	queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);    	
		return this.httpService.http
			.get(this.baseResourceUrl, { search: params, headers: queryHeaders})
			.map((response) => {
				var result: any = response.json();
				let banks: Array<UserInfo_Model> = [];
				
				// result.resource.forEach((bank) => {
				// 	banks.push(BankSetup_Model.fromJson(bank));
				// });  
				return banks;
				
			}).catch(this.handleError);
    };
    
    save_user_info (user_info: UserInfo_Model): Observable<any> 
	{
		var queryHeaders = new Headers();
    	queryHeaders.append('Content-Type', 'application/json');
    	//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    	queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		let options = new RequestOptions({ headers: queryHeaders });
		return this.httpService.http.post(this.baseResourceUrl1, user_info.toJson(true),options)
			.map((response) => {
				return response;
			});
	}

	save_user_main (user_main: UserMain_Model): Observable<any> 
	{
		var queryHeaders = new Headers();
    	queryHeaders.append('Content-Type', 'application/json');
    	//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    	queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		let options = new RequestOptions({ headers: queryHeaders });
		return this.httpService.http.post(this.baseResourceUrl2, user_main.toJson(true),options)
			.map((response) => {
				return response;
			});
	}

	save_user_contact (user_contact: UserContact_Model): Observable<any> 
	{
		var queryHeaders = new Headers();
    	queryHeaders.append('Content-Type', 'application/json');
    	//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    	queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		let options = new RequestOptions({ headers: queryHeaders });
		return this.httpService.http.post(this.baseResourceUrl3, user_contact.toJson(true),options)
			.map((response) => {
				return response;
			});
	}

	save_user_company (user_company: UserCompany_Model): Observable<any> 
	{
		var queryHeaders = new Headers();
    	queryHeaders.append('Content-Type', 'application/json');
    	//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    	queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		let options = new RequestOptions({ headers: queryHeaders });
		return this.httpService.http.post(this.baseResourceUrl4, user_company.toJson(true),options)
			.map((response) => {
				return response;
			});
	}
	
	save_user_address (user_address: UserAddress_Model): Observable<any> 
	{
		var queryHeaders = new Headers();
    	queryHeaders.append('Content-Type', 'application/json');
    	//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    	queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		let options = new RequestOptions({ headers: queryHeaders });
		return this.httpService.http.post(this.baseResourceUrl, user_address.toJson(true),options)
			.map((response) => {
				return response;
			});
    }
}
