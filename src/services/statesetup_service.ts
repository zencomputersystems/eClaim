import { Injectable } from '@angular/core';
import { Headers, RequestOptions, URLSearchParams } from '@angular/http';

import * as constants from '../app/config/constants';
import { StateSetup_Model } from '../models/statesetup_model';
import { BaseHttpService } from './base-http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
//import 'rxjs/add/observable/throw';

import { NavController } from 'ionic-angular';

class ServerResponse {
    constructor(public resource: any) {

    }
};

@Injectable()
export class StateSetup_Service {
    baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_state';
    baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

    constructor(private httpService: BaseHttpService, private nav: NavController) { };

    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.log(errMsg); // log to console instead
        //localStorage.setItem('session_token', '');       
        return Observable.throw(errMsg);
    }    

    // query(params?: URLSearchParams): Observable<StateSetup_Model[]> {
    //     var queryHeaders = new Headers();
    //     queryHeaders.append('Content-Type', 'application/json');
    //     //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    //     queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
    //     return this.httpService.http
    //         .get(this.baseResourceUrl, { search: params, headers: queryHeaders })
    //         .map((response) => {
    //             var result: any = response.json();
    //             let branches: Array<StateSetup_Model> = [];

    //             // result.resource.forEach((branch) => {
    //             // 	branches.push(BranchSetup_Model.fromJson(branche));
    //             // });  
    //             return branches;

    //         }).catch(this.handleError);
    // };


    Save(state_main: StateSetup_Model): Observable<any> {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        let options = new RequestOptions({ headers: queryHeaders });
        return this.httpService.http.post(this.baseResourceUrl, state_main.toJson(true), options)
            .map((response) => {
                return response;
            });
    }

    Update(state_main: StateSetup_Model): Observable<any> {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        let options = new RequestOptions({ headers: queryHeaders });
        return this.httpService.http.patch(this.baseResourceUrl, state_main.toJson(true), options)
            .map((response) => {
                return response;
            });
    }

    remove (id: string) {
		var queryHeaders = new Headers();
    	queryHeaders.append('Content-Type', 'application/json');
    	//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    	queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		return this.httpService.http
			.delete(this.baseResourceUrl + '/' + id,{ headers: queryHeaders})
			.map((response) => {
				var result: any = response.json();
				//console.log(result.bank_GUID);
				return result.STATE_GUID;
			});
	}

    // get_cashcard(params?: URLSearchParams): Observable<CashcardSetup_Model[]> {
    //     var queryHeaders = new Headers();
    //     queryHeaders.append('Content-Type', 'application/json');
    //     //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    //     queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
    //     return this.httpService.http
    //         .get(this.baseResourceUrl, { search: params, headers: queryHeaders })
    //         .map((response) => {
    //             var result: any = response.json();
    //             let cashcards: Array<CashcardSetup_Model> = [];

    //             // result.resource.forEach((cashcard) => {
    //             //  	cashcards.push(CashcardSetup_Model.fromJson(cashcard));
    //             //  });
    //             return cashcards;
    //         }).catch(this.handleError);
    // };

    // remove(id: string) {
    //     var queryHeaders = new Headers();
    //     queryHeaders.append('Content-Type', 'application/json');
    //     //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    //     queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
    //     return this.httpService.http
    //         .delete(this.baseResourceUrl + '/' + id, { headers: queryHeaders })
    //         .map((response) => {
    //             var result: any = response.json();
    //             return result.cashcard_GUID;
    //         });
    // }

    get(id: string, params?: URLSearchParams): Observable<StateSetup_Model> {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);

        return this.httpService.http
            .get(this.baseResourceUrl + '/' + id, { search: params, headers: queryHeaders })
            .map((response) => {
                var result: any = response.json();
                let state: StateSetup_Model = StateSetup_Model.fromJson(result);
                return state;
            }).catch(this.handleError);
    };
}
