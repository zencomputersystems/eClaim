import { Injectable } from '@angular/core';
import { Headers, RequestOptions, URLSearchParams } from '@angular/http';

import * as constants from '../app/config/constants';
import { Settings_Model } from '../models/settings_model';
import { BaseHttpService } from './base-http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
//import 'rxjs/add/observable/throw';

import { NavController } from 'ionic-angular';

@Injectable()
export class Settings_Service {
    baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/permission_keys';
    baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

    constructor(private httpService: BaseHttpService) { };

    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.log(errMsg); // log to console instead
        //localStorage.setItem('session_token', '');       
        return Observable.throw(errMsg);
    }

    // query(params?: URLSearchParams): Observable<Settings_Model[]> {
    //     var queryHeaders = new Headers();
    //     queryHeaders.append('Content-Type', 'application/json');
    //     queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
    //     return this.httpService.http
    //         .get(this.baseResourceUrl, { search: params, headers: queryHeaders })
    //         .map((response) => {
    //             let banks: Array<Settings_Model> = [];
    //             return banks;

    //         }).catch(this.handleError);
    // };

    save(Settings_main: Settings_Model, Table_Name: string): Observable<any> {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        let options = new RequestOptions({ headers: queryHeaders });
        return this.httpService.http.post(this.baseResource_Url + Table_Name, Settings_main.toJson(true), options)
            .map((response) => {
                return response;
            });
    }

    update(Settings_main: Settings_Model, Table_Name: string): Observable<any> {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        let options = new RequestOptions({ headers: queryHeaders });
        return this.httpService.http.patch(this.baseResource_Url + Table_Name, Settings_main.toJson(true), options)
            .map((response) => {
                return response;
            });
    }

    remove(id: string, Table_Name: string) {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        return this.httpService.http
            .delete(this.baseResource_Url + Table_Name + '/' + id, { headers: queryHeaders })
            .map((response) => {
                var result: any = response.json();
                return result.PERMISSION_KEY_GUID;
            });
    }

    get(id: string, params?: URLSearchParams): Observable<Settings_Model> {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);

        return this.httpService.http
            .get(this.baseResourceUrl + '/' + id, { search: params, headers: queryHeaders })
            .map((response) => {
                var result: any = response.json();
                let bank: Settings_Model = Settings_Model.fromJson(result);
                return bank;
            }).catch(this.handleError);
    };

    GetExistingRecord(KEY_NAME: string): Observable<Settings_Model> {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');

        let options = new RequestOptions({ headers: queryHeaders });
        let url: string;
        url = "http://api.zen.com.my/api/v2/zcs/_table/permission_keys?filter=(KEY_NAME=" + KEY_NAME + ")&api_key=cb82c1df0ba653578081b3b58179158594b3b8f29c4ee1050fda1b7bd91c3881";

        return this.httpService.http
            .get(url, options)
            .map((response) => {
                var result: any = response.json();
                let bank: Settings_Model = Settings_Model.fromJson(result); alert("In GetExist" + JSON.stringify(result));
                return bank;
            }).catch(this.handleError);
    };
}