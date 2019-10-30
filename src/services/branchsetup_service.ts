import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import * as constants from '../app/config/constants';

import { Headers, RequestOptions, URLSearchParams } from '@angular/http';

import { BaseHttpService } from './base-http';
import { BranchSetup_Model } from '../models/branchsetup_model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

;

@Injectable()
export class BranchSetup_Service {
    baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_branch';
    baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
    queryHeaders: any = new Headers();
    constructor(private httpService: BaseHttpService) { 
        this.queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        this.queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
    };

    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.log(errMsg); // log to console instead
        //localStorage.setItem('session_token', '');       
        return Observable.throw(errMsg);
    }

    query(params?: URLSearchParams): Observable<BranchSetup_Model[]> {
        return this.httpService.http
            .get(this.baseResourceUrl, { search: params, headers: this.queryHeaders })
            .map((response) => {
                let branches: Array<BranchSetup_Model> = [];

                // result.resource.forEach((branch) => {
                // 	branches.push(BranchSetup_Model.fromJson(branche));
                // });  
                return branches;

            }).catch(this.handleError);
    };

    save(branch_main: BranchSetup_Model): Observable<any> {
        let options = new RequestOptions({ headers: this.queryHeaders });
        return this.httpService.http.post(this.baseResourceUrl, branch_main.toJson(true), options)
            .map((response) => {
                return response;
            });
    }

    update(branch_main: BranchSetup_Model): Observable<any> {
        let options = new RequestOptions({ headers: this.queryHeaders });
        return this.httpService.http.patch(this.baseResourceUrl, branch_main.toJson(true), options)
            .map((response) => {
                return response;
            });
    }

    get_branch(params?: URLSearchParams): Observable<BranchSetup_Model[]> {
        return this.httpService.http
            .get(this.baseResourceUrl, { search: params, headers: this.queryHeaders })
            .map((response) => {
                let branches: Array<BranchSetup_Model> = [];
                return branches;
            }).catch(this.handleError);
    };

    remove(id: string) {
        return this.httpService.http
            .delete(this.baseResourceUrl + '/' + id, { headers: this.queryHeaders })
            .map((response) => {
                var result: any = response.json();
                return result.branch_GUID;
            });
    }

    get(id: string, params?: URLSearchParams): Observable<BranchSetup_Model> {
        return this.httpService.http
            .get(this.baseResourceUrl + '/' + id, { search: params, headers: this.queryHeaders })
            .map((response) => {
                let branch: BranchSetup_Model = response.json();
                return branch;
            }).catch(this.handleError);
    };
}
