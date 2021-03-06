import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { DREAMFACTORY_API_KEY, DREAMFACTORY_INSTANCE_URL, DREAMFACTORY_TABLE_URL } from '../app/config/constants';
import { Headers, RequestOptions, URLSearchParams } from '@angular/http';

import { BaseHttpService } from './base-http';
import { ClaimTypeSetup_Model } from '../models/claimtypesetup_model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { getURL } from '../providers/sanitizer/sanitizer';

@Injectable()
export class ClaimTypeSetup_Service {
    baseResourceUrl: string = DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_claim_type';
    baseResource_Url: string = DREAMFACTORY_TABLE_URL;

    constructor(private httpService: BaseHttpService) { };

    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.log(errMsg); // log to console instead
        //localStorage.setItem('session_token', '');       
        return Observable.throw(errMsg);
    }    

    query (params?:URLSearchParams): Observable<ClaimTypeSetup_Model[]> 
    {       
        //let bank :any;
		var queryHeaders = new Headers();
    	queryHeaders.append('Content-Type', 'application/json');
    	//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    	queryHeaders.append('X-Dreamfactory-API-Key', DREAMFACTORY_API_KEY);    	
		return this.httpService.http
			.get(this.baseResourceUrl, { search: params, headers: queryHeaders})
			.map(() => {
                    let banks: Array<ClaimTypeSetup_Model> = [];
                    // result.resource.forEach((bank) => {
                    // 	banks.push(BankSetup_Model.fromJson(bank));
                    // });  
                    return banks;
                }).catch(this.handleError);
	};

    save(claim_type_main: ClaimTypeSetup_Model): Observable<any> {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', DREAMFACTORY_API_KEY);
        let options = new RequestOptions({ headers: queryHeaders });
        return this.httpService.http.post(this.baseResourceUrl, claim_type_main.toJson(true), options)
            .map((response) => {
                return response;
            });
    }

    update(claim_type_main: ClaimTypeSetup_Model): Observable<any> {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', DREAMFACTORY_API_KEY);
        let options = new RequestOptions({ headers: queryHeaders });
        return this.httpService.http.patch(this.baseResourceUrl, claim_type_main.toJson(true), options)
            .map((response) => {
                return response;
            });
    }

    get_claim (params?: URLSearchParams): Observable<ClaimTypeSetup_Model[]> 
	{
		var queryHeaders = new Headers();
    	queryHeaders.append('Content-Type', 'application/json');		
    	//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    	queryHeaders.append('X-Dreamfactory-API-Key', DREAMFACTORY_API_KEY);
		return this.httpService.http
			.get(this.baseResourceUrl, { search: params ,headers: queryHeaders})
			.map(() => {
                    let banks: Array<ClaimTypeSetup_Model> = [];
                    // result.resource.forEach((bank) => {
                    //  	banks.push(BankSetup_Model.fromJson(bank));
                    //  });
                    return banks;
                }).catch(this.handleError);
	};

    remove(id: string) {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', DREAMFACTORY_API_KEY);
        return this.httpService.http
            .delete(this.baseResourceUrl + '/' + id, { headers: queryHeaders })
            .map((response) => {
                var result: any = response.json();
                return result.CLAIM_TYPE_GUID;
            });
    }

    get(id: string, params?: URLSearchParams): Observable<ClaimTypeSetup_Model> {        
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', DREAMFACTORY_API_KEY);

        return this.httpService.http
            .get(this.baseResourceUrl + '/' + id, { search: params, headers: queryHeaders })
            .map((response) => {
                let claimtype: Array<ClaimTypeSetup_Model> = response.json();
                return claimtype;
            }).catch(this.handleError);
    };
    GetExistingRecord (bank_name:string): Observable<ClaimTypeSetup_Model> {		
		var queryHeaders = new Headers();
    	queryHeaders.append('Content-Type', 'application/json');
		let options = new RequestOptions({ headers: queryHeaders });
		let url:string;
        url = getURL("table","main_claim_type", ["(NAME="+bank_name])		
		return this.httpService.http
			.get(url, options)
			.map((response) => {
				var result: any = response.json();				
				let bank: ClaimTypeSetup_Model = ClaimTypeSetup_Model.fromJson(result);alert("In GetExist"+JSON.stringify(result));
				return bank; 
			}).catch(this.handleError);	
	};
}
