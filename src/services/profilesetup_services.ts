import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import * as constants from '../app/config/constants';

import { Headers, RequestOptions, URLSearchParams } from '@angular/http';

import { BaseHttpService } from './base-http';
import { Injectable } from '@angular/core';
import { Main_Profile_Model } from '../models/main_profile_model';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProfileSetup_Service {
	baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_profile';
	baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

	constructor(private httpService: BaseHttpService) { };

	private handleError(error: any) {
		let errMsg = (error.message) ? error.message :
			error.status ? `${error.status} - ${error.statusText}` : 'Server error';
		console.log(errMsg);
		return Observable.throw(errMsg);
	}

	query(params?: URLSearchParams): Observable<Main_Profile_Model[]> {
		var queryHeaders = new Headers();
		queryHeaders.append('Content-Type', 'application/json');
		queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		return this.httpService.http
			.get(this.baseResourceUrl, { search: params, headers: queryHeaders })
			.map(() => {
					let profiles: Array<Main_Profile_Model> = [];
					return profiles;
				}).catch(this.handleError);
	};

	save(profile: Main_Profile_Model): Observable<any> {
		var queryHeaders = new Headers();
		queryHeaders.append('Content-Type', 'application/json');
		queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		let options = new RequestOptions({ headers: queryHeaders });
		return this.httpService.http.post(this.baseResourceUrl, profile.toJson(true), options)
			.map((response) => {
				return response;
			});
	}

	update_profile(profile: Main_Profile_Model): Observable<any> {
		var queryHeaders = new Headers();
		queryHeaders.append('Content-Type', 'application/json');
		queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		let options = new RequestOptions({ headers: queryHeaders });
		return this.httpService.http.patch(this.baseResourceUrl, profile.toJson(true), options)
			.map((response) => {
				return response;
			});
	}

	get_profile(params?: URLSearchParams): Observable<Main_Profile_Model[]> {
		var queryHeaders = new Headers();
		queryHeaders.append('Content-Type', 'application/json');
		queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		return this.httpService.http
			.get(this.baseResourceUrl, { search: params, headers: queryHeaders })
			.map((response) => {
				let profiles: Array<Main_Profile_Model> = [];
				return profiles;
			}).catch(this.handleError);
	};

	remove(id: string) {
		var queryHeaders = new Headers();
		queryHeaders.append('Content-Type', 'application/json');
		queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		return this.httpService.http
			.delete(this.baseResourceUrl + '/' + id, { headers: queryHeaders })
			.map((response) => {
				var result: any = response.json();
				return result.MAIN_PROFILE_GUID;
			});
	}

	get(id: string, params?: URLSearchParams): Observable<Main_Profile_Model> {
		var queryHeaders = new Headers();
		queryHeaders.append('Content-Type', 'application/json');
		queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		return this.httpService.http
			.get(this.baseResourceUrl + '/' + id, { search: params, headers: queryHeaders })
			.map((response) => {
				let profiles: Array<Main_Profile_Model> = response.json();
				return profiles;
			}).catch(this.handleError);
	};

	GetExistingRecord(PROFILE_NAME: string): Observable<Main_Profile_Model> {
		var queryHeaders = new Headers();
		queryHeaders.append('Content-Type', 'application/json');
		let options = new RequestOptions({ headers: queryHeaders });
		let url: string;
		url = constants.DREAMFACTORY_INSTANCE_URL + "/api/v2/zcs/_table/main_profile?filter=(PROFILE_NAME=" + PROFILE_NAME + ")&api_key=cb82c1df0ba653578081b3b58179158594b3b8f29c4ee1050fda1b7bd91c3881";

		return this.httpService.http
			.get(url, options)
			.map((response) => {
				var result: any = response.json();
				let profiles: Main_Profile_Model = Main_Profile_Model.fromJson(result); alert("In GetExist" + JSON.stringify(result));
				return profiles;
			}).catch(this.handleError);
	};
}
