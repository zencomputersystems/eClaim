import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { DREAMFACTORY_API_KEY, DREAMFACTORY_INSTANCE_URL } from '../app/config/constants';
import { Headers, RequestOptions, URLSearchParams } from '@angular/http';

import { BaseHttpService } from './base-http';
import { DepartmentSetup_Model } from '../models/departmentsetup_model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { remove_multiple } from './db_removal_service';

@Injectable()
export class DepartmentSetup_Service {
    baseResourceUrl: string = DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_department';
    baseResource_Url: string = DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

    constructor(private httpService: BaseHttpService) { };

    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.log(errMsg); // log to console instead
        //localStorage.setItem('session_token', '');       
        return Observable.throw(errMsg);
    }    

    query(params?: URLSearchParams): Observable<DepartmentSetup_Model[]> {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', DREAMFACTORY_API_KEY);
        return this.httpService.http
            .get(this.baseResourceUrl, { search: params, headers: queryHeaders })
            .map(() => {
                    let depts: Array<DepartmentSetup_Model> = [];
                    // result.resource.forEach((branch) => {
                    // 	branches.push(BranchSetup_Model.fromJson(branche));
                    // });  
                    return depts;
                }).catch(this.handleError);
    };


    save(department_main: DepartmentSetup_Model): Observable<any> {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', DREAMFACTORY_API_KEY);
        let options = new RequestOptions({ headers: queryHeaders });//alert(JSON.stringify(department_main));
        return this.httpService.http.post(this.baseResourceUrl, department_main.toJson(true), options)
            .map((response) => {
                return response;
            });
    }

    update(department_main: DepartmentSetup_Model): Observable<any> {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', DREAMFACTORY_API_KEY);
        let options = new RequestOptions({ headers: queryHeaders });
        return this.httpService.http.patch(this.baseResourceUrl, department_main.toJson(true), options)
            .map((response) => {
                return response;
            });
    }

    get_department(params?: URLSearchParams): Observable<DepartmentSetup_Model[]> {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', DREAMFACTORY_API_KEY);
        return this.httpService.http
            .get(this.baseResourceUrl, { search: params, headers: queryHeaders })
            .map(() => {
                    let branches: Array<DepartmentSetup_Model> = [];
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
        queryHeaders.append('X-Dreamfactory-API-Key', DREAMFACTORY_API_KEY);
        return this.httpService.http
            .delete(this.baseResourceUrl + '/' + id, { headers: queryHeaders })
            .map((response) => {
                var result: any = response.json();
                return result.DEPARTMENT_GUID;
            });
    }

    remove_multiple(id: string, tablename: string) {
        return remove_multiple(id, tablename);
	}

    get(id: string, params?: URLSearchParams): Observable<DepartmentSetup_Model> {        
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', DREAMFACTORY_API_KEY);
        return this.httpService.http
            .get(this.baseResourceUrl + '/' + id, { search: params, headers: queryHeaders })
            .map((response) => {
                let claimtype: Array<DepartmentSetup_Model> = response.json();
                return claimtype;
            }).catch(this.handleError);
    };
}
