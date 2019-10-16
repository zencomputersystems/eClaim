import { Injectable } from '@angular/core';
import { Headers, RequestOptions, URLSearchParams } from '@angular/http';

import * as constants from '../app/config/constants';
import { SocMain_Model } from '../models/socmain_model';
import { SocProject_Model } from '../models/soc_project_model';
import { SocCustomer_Model } from '../models/soc_customer_model';
import { SocCustomerLocation_Model } from '../models/soc_customer_location_model';
import { View_SOC_Model } from '../models/view_soc_model';
import { BaseHttpService } from './base-http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SocMain_Service {
    baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/soc_main';
    baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

    baseResourceUrl1: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_project';
    baseResourceUrl2: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_customer';
    baseResourceUrl3: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/soc_registration';
    baseResourceUrl4: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_customer_location';

    constructor(private httpService: BaseHttpService) { };

    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.log(errMsg); // log to console instead
        //localStorage.setItem('session_token', '');       
        return Observable.throw(errMsg);
    }

    query(params?: URLSearchParams): Observable<SocMain_Model[]> {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        return this.httpService.http
            .get(this.baseResourceUrl, { search: params, headers: queryHeaders })
            .map(() => {
                    let socs: Array<SocMain_Model> = [];
                    // result.resource.forEach((branch) => {
                    // 	branches.push(BranchSetup_Model.fromJson(branche));
                    // });  
                    return socs;
                }).catch(this.handleError);
    };


    save_main(soc_main: SocMain_Model): Observable<any> {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        let options = new RequestOptions({ headers: queryHeaders });
        return this.httpService.http.post(this.baseResourceUrl, soc_main.toJson(true), options)
            .map((response) => {
                return response;
            });
    }

    save_project(soc_project: SocProject_Model): Observable<any> {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        let options = new RequestOptions({ headers: queryHeaders });
        return this.httpService.http.post(this.baseResourceUrl1, soc_project.toJson(true), options)
            .map((response) => {
                return response;
            });
    }

    save_customer(soc_customer: SocCustomer_Model): Observable<any> {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        let options = new RequestOptions({ headers: queryHeaders });
        return this.httpService.http.post(this.baseResourceUrl2, soc_customer.toJson(true), options)
            .map((response) => {
                return response;
            });
    }

    save_customer_location(soc_customer_location: SocCustomerLocation_Model): Observable<any> {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        let options = new RequestOptions({ headers: queryHeaders });
        return this.httpService.http.post(this.baseResourceUrl4, soc_customer_location.toJson(true), options)
            .map((response) => {
                return response;
            });
    }

    update_soc(soc_main: SocMain_Model): Observable<any> {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        let options = new RequestOptions({ headers: queryHeaders });
        return this.httpService.http.patch(this.baseResourceUrl, soc_main.toJson(true), options)
            .map((response) => {
                return response;
            });
    }

    update_project(soc_project: SocProject_Model): Observable<any> {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        let options = new RequestOptions({ headers: queryHeaders });
        return this.httpService.http.patch(this.baseResourceUrl1, soc_project.toJson(true), options)
            .map((response) => {
                return response;
            });
    }


    update_customer(soc_main: SocCustomer_Model): Observable<any> {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        let options = new RequestOptions({ headers: queryHeaders });
        return this.httpService.http.patch(this.baseResourceUrl2, soc_main.toJson(true), options)
            .map((response) => {
                return response;
            });
    }

    update_customer_location(soc_customer_location: SocCustomerLocation_Model): Observable<any> {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        let options = new RequestOptions({ headers: queryHeaders });
        return this.httpService.http.patch(this.baseResourceUrl4, soc_customer_location.toJson(true), options)
            .map((response) => {
                return response;
            });
    }

    edit_soc(view_soc: SocMain_Model): Observable<any> {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        let options = new RequestOptions({ headers: queryHeaders });
        //console.log(JSON.stringify(view_soc));
        return this.httpService.http.patch(this.baseResourceUrl, view_soc.toJson(true), options)

            .map((response) => {
                //console.log(this.baseResourceUrl2);
                return response;
            });
    }

    edit_customer(view_customer: SocCustomer_Model): Observable<any> {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        let options = new RequestOptions({ headers: queryHeaders });
        console.log(JSON.stringify(view_customer));
        return this.httpService.http.patch(this.baseResourceUrl2, view_customer.toJson(true), options)

            .map((response) => {
                //console.log(this.baseResourceUrl2);
                return response;
            });
    }

    edit_project(view_project: SocProject_Model): Observable<any> {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        let options = new RequestOptions({ headers: queryHeaders });
        console.log(JSON.stringify(view_project));
        return this.httpService.http.patch(this.baseResourceUrl1, view_project.toJson(true), options)

            .map((response) => {
                //console.log(this.baseResourceUrl2);
                return response;
            });
    }

    get_soc(params?: URLSearchParams): Observable<SocMain_Model[]> {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        return this.httpService.http
            .get(this.baseResourceUrl, { search: params, headers: queryHeaders })
            .map(() => {
                    let socs: Array<SocMain_Model> = [];
                    // result.resource.forEach((branch) => {
                    //  	branches.push(BranchSetup_Model.fromJson(branch));
                    //  });
                    return socs;
                }).catch(this.handleError);
    };

    remove_soc(id: string) {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        return this.httpService.http
            // .delete(this.baseResourceUrl + '/' + id, { headers: queryHeaders })
            .delete(this.baseResourceUrl + "?filter=(SOC_GUID=" + id + ')', { headers: queryHeaders })
            .map((response) => {
                var result: any = response.json();
                return result.SOC_GUID;
            });
    }

    remove_customer(id: string) {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        return this.httpService.http
            // .delete(this.baseResourceUrl + '/' + id, { headers: queryHeaders })
            .delete(this.baseResourceUrl2 + "?filter=(CUSTOMER_GUID=" + id + ')', { headers: queryHeaders })
            .map((response) => {
                var result: any = response.json();
                return result.CUSTOMER_GUID;
            });
    }

    remove_customer_location(id: string) {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        return this.httpService.http
            // .delete(this.baseResourceUrl + '/' + id, { headers: queryHeaders })
            .delete(this.baseResourceUrl4 + "?filter=(CUSTOMER_LOCATION_GUID=" + id + ')', { headers: queryHeaders })
            .map((response) => {
                var result: any = response.json();
                return result.CUSTOMER_LOCATION_GUID;
            });
    }

    remove_project(id: string) {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        return this.httpService.http
            // .delete(this.baseResourceUrl + '/' + id, { headers: queryHeaders })
            .delete(this.baseResourceUrl1 + "?filter=(PROJECT_GUID=" + id + ')', { headers: queryHeaders })
            .map((response) => {
                var result: any = response.json();
                return result.PROJECT_GUID;
            });
    }

    get1(id: string, params?: URLSearchParams): Observable<View_SOC_Model> {
        var queryHeaders = new Headers();
        alert('service edit1');
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        alert('service edit2');
        return this.httpService.http
            .get(this.baseResourceUrl3 + '/' + id, { search: params, headers: queryHeaders })
            .map((response) => {
                var result: any = response.json();
                let soc: View_SOC_Model = View_SOC_Model.fromJson(result);
                //alert('service edit3');
                return soc;

            }).catch(this.handleError);
    };

    get2(id: string, params?: URLSearchParams): Observable<SocProject_Model> {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);

        return this.httpService.http
            .get(this.baseResourceUrl + '/' + id, { search: params, headers: queryHeaders })
            .map((response) => {
                var result: any = response.json();
                let soc_project: SocProject_Model = SocProject_Model.fromJson(result);
                return soc_project;
            }).catch(this.handleError);
    };

    get3(id: string, params?: URLSearchParams): Observable<SocCustomer_Model> {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);

        return this.httpService.http
            .get(this.baseResourceUrl + '/' + id, { search: params, headers: queryHeaders })
            .map((response) => {
                var result: any = response.json();
                let soc_customer: SocCustomer_Model = SocCustomer_Model.fromJson(result);
                return soc_customer;
            }).catch(this.handleError);
    };
}


