import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import * as constants from '../app/config/constants';

import { Headers, RequestOptions, URLSearchParams } from '@angular/http';

import { BaseHttpService } from './base-http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SubsciptionSetup_Model } from '../models/subsciptionsetup_model';

@Injectable()
export class SubsciptionSetup_Service {
    baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_subscription';
    baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

    constructor(private httpService: BaseHttpService) { };

    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.log(errMsg); // log to console instead
        //localStorage.setItem('session_token', '');       
        return Observable.throw(errMsg);
    }  
    
    query(params?: URLSearchParams): Observable<SubsciptionSetup_Model[]> {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        return this.httpService.http
            .get(this.baseResourceUrl, { search: params, headers: queryHeaders })
            .map(() => {
                    let branches: Array<SubsciptionSetup_Model> = [];
                    // result.resource.forEach((branch) => {
                    // 	branches.push(BranchSetup_Model.fromJson(branche));
                    // });  
                    return branches;
                }).catch(this.handleError);
    };


    save(subsciption_main: SubsciptionSetup_Model): Observable<any> {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        let options = new RequestOptions({ headers: queryHeaders });
        return this.httpService.http.post(this.baseResourceUrl, subsciption_main.toJson(true), options)
            .map((response) => {
                return response;
            });
    }

    update(subsciption_main: SubsciptionSetup_Model): Observable<any> {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        let options = new RequestOptions({ headers: queryHeaders });
        return this.httpService.http.patch(this.baseResourceUrl, subsciption_main.toJson(true), options)
            .map((response) => {
                return response;
            });
    }

    get_subscription(params?: URLSearchParams): Observable<SubsciptionSetup_Model[]> {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        return this.httpService.http
            .get(this.baseResourceUrl, { search: params, headers: queryHeaders })
            .map(() => {
                    let branches: Array<SubsciptionSetup_Model> = [];
                    // result.resource.forEach((branch) => {
                    //  	branches.push(BranchSetup_Model.fromJson(branch));
                    //  });
                    return branches;
                }).catch(this.handleError);
    };

    remove(id: string) {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        return this.httpService.http
            .delete(this.baseResourceUrl + '/' + id, { headers: queryHeaders })
            .map((response) => {
                var result: any = response.json();
                return result.SUBSCRIPTION_GUID;
            });
    }

    get(id: string, params?: URLSearchParams): Observable<SubsciptionSetup_Model> {        
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);

        return this.httpService.http
            .get(this.baseResourceUrl + '/' + id, { search: params, headers: queryHeaders })
            .map((response) => {
                let subsciption: Array<SubsciptionSetup_Model> = response.json();
                return subsciption;
            }).catch(this.handleError);
    };
}


