import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { DREAMFACTORY_API_KEY, DREAMFACTORY_TABLE_URL } from '../app/config/constants';
import { Headers, RequestOptions, URLSearchParams } from '@angular/http';

import { BaseHttpService } from './base-http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserAddress_Model } from '../models/usersetup_address_model';
import { UserCertification_Model } from '../models/user_certification_model';
import { UserChildren_Model } from '../models/user_children_model';
import { UserCompany_Model } from '../models/user_company_model';
import { UserContact_Model } from '../models/user_contact_model';
//import {EntertainmentClaim_Model} from '../models/entertainment_model';
import { UserInfo_Model } from '../models/usersetup_info_model';
import { UserMain_Model } from '../models/user_main_model';
import { UserQualification_Model } from '../models/user_qualification_model';
import { UserRole_Model } from '../models/user_role_model';
import { UserSpouse_Model } from '../models/user_spouse_model';

@Injectable()

export class UserSetup_Service {
	UserUrl = {
	"info": DREAMFACTORY_TABLE_URL + 'user_info',
	"main": DREAMFACTORY_TABLE_URL + 'user_main',
	"contact": DREAMFACTORY_TABLE_URL + 'user_contact',
	"company": DREAMFACTORY_TABLE_URL + 'user_company',
	"address": DREAMFACTORY_TABLE_URL + 'user_address',
	"baseResource_Url": DREAMFACTORY_TABLE_URL,
	"qualification": DREAMFACTORY_TABLE_URL + 'user_qualification',
	"role": DREAMFACTORY_TABLE_URL + 'user_role',
	"view_user_display": DREAMFACTORY_TABLE_URL + 'view_user_display',
	"certification": DREAMFACTORY_TABLE_URL + 'user_certification',
	"spouse": DREAMFACTORY_TABLE_URL + 'user_spouse',
	"children": DREAMFACTORY_TABLE_URL + 'user_children'
	};

	queryHeaders: any = new Headers();

	public USER_GUID: any;

	constructor(private httpService: BaseHttpService) { 
		this.queryHeaders.append('Content-Type', 'application/json');
		//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
		this.queryHeaders.append('X-Dreamfactory-API-Key', DREAMFACTORY_API_KEY);

	};

	private handleError(error: any) {
		let errMsg = (error.message) ? error.message :
			error.status ? `${error.status} - ${error.statusText}` : 'Server error';
		console.log(errMsg); // log to console instead
		//localStorage.setItem('session_token', '');       
		return Observable.throw(errMsg);
	}

	query(params?: URLSearchParams): Observable<UserInfo_Model[]> {
		return this.httpService.http
			.get(this.UserUrl.address, { search: params, headers: this.queryHeaders })
			.map(() => {
					let banks: Array<UserInfo_Model> = [];
					return banks;
				}).catch(this.handleError);
	};

	SaveUserData(modelData: any, tableURL: string): Observable<any> {
		let options = new RequestOptions({headers: this.queryHeaders });
		return this.httpService.http.post(tableURL, modelData.toJson(true), options)
			.map((response) => {
				console.log(response + " - NEW - " + tableURL);
				console.log(modelData);
				return response;
			})
	}

	PatchUserData(modelData: any, tableURL: string): Observable<any> {
		let options = new RequestOptions({headers: this.queryHeaders });
		return this.httpService.http.patch(tableURL, modelData.toJson(true), options)
			.map((response) => {
				console.log(response + " - PATCH - " + tableURL);
				console.log(modelData);
				return response;
			})
	}
	

	save_user_info(user_info: UserInfo_Model): Observable<any> {
		return this.SaveUserData(user_info, this.UserUrl.info);
	}

	save_user_main(user_main: UserMain_Model): Observable<any> {
		return this.SaveUserData(user_main, this.UserUrl.main); 
	}

	save_user_contact(user_contact: UserContact_Model): Observable<any> {
		return this.SaveUserData(user_contact, this.UserUrl.contact);
	}

	save_user_company(user_company: UserCompany_Model): Observable<any> {
		return this.SaveUserData(user_company, this.UserUrl.company);
	}

	save_user_role(user_role: UserRole_Model): Observable<any> {
		return this.SaveUserData(user_role, this.UserUrl.role);
	}

	save_user_address(user_address: UserAddress_Model): Observable<any> {
		return this.SaveUserData(user_address, this.UserUrl.address);
	}

	save_user_qualification(user_qualification: UserQualification_Model): Observable<any> {
		return this.SaveUserData(user_qualification, this.UserUrl.qualification);
	}

	save_user_certification(user_certification: UserCertification_Model): Observable<any> {
		return this.SaveUserData(user_certification, this.UserUrl.certification);
	}

	save_user_spouse(user_spouse: UserSpouse_Model): Observable<any> {
		return this.SaveUserData(user_spouse, this.UserUrl.spouse);
	}

	save_user_children(user_children: UserChildren_Model): Observable<any> {
		return this.SaveUserData(user_children, this.UserUrl.children);
		
	}

	//Edit	
	update_user_main(user_main: UserMain_Model): Observable<any> {
		return this.PatchUserData(user_main, this.UserUrl.main);
	}

	update_user_info(user_info: UserInfo_Model): Observable<any> {
		return this.PatchUserData(user_info, this.UserUrl.info);
	}

	update_user_contact(user_contact: UserContact_Model): Observable<any> {
		return this.PatchUserData(user_contact, this.UserUrl.contact);
	}

	update_user_company(user_company: UserCompany_Model): Observable<any> {
		return this.PatchUserData(user_company, this.UserUrl.company);
	}

	update_user_address(user_address: UserAddress_Model): Observable<any> {
		return this.PatchUserData(user_address, this.UserUrl.address);
	}

	update_user_role(user_role: UserRole_Model): Observable<any> {
		return this.PatchUserData(user_role, this.UserUrl.role);
	}

	update_user_qualification(user_qualification: UserQualification_Model): Observable<any> {
		return this.PatchUserData(user_qualification, this.UserUrl.qualification);
	}

	get(id: string, params?: URLSearchParams): Observable<UserAddress_Model> {
		console.log('Starting of UserSetup service');
		return this.httpService.http
			.get(this.UserUrl.address + "?filter=(USER_GUID=" + id + ')&api_key=' + DREAMFACTORY_API_KEY, { search: params, headers: this.queryHeaders })
			.map((response) => {
				let viewtype: Array<UserAddress_Model> = response.json();
				return viewtype;

			}).catch(this.handleError);

	};

	remove(id: string) {
		return this.httpService.http
			.delete(this.UserUrl.main + '/' + id, { headers: this.queryHeaders })
			.map((response) => {
				var result: any = response.json();
				return result.USER_GUID;
			});
	}


	remove_multiple(id: string, tablename: string) {
		let url_multiple = this.UserUrl.baseResource_Url + tablename + "?filter=(USER_GUID=" + id + ")AND(ROLE_FLAG=ADDITIONAL)";
		console.log(url_multiple);
		return this.httpService.http
			.delete(url_multiple, { headers: this.queryHeaders })
			.map((response) => {
				return response;
			});
	}

	remove_multiple_records(id: string, tablename: string) {
		let url_multiple = this.UserUrl.baseResource_Url + tablename + "?filter=(USER_GUID=" + id + ")";
		return this.httpService.http
			.delete(url_multiple, { headers: this.queryHeaders })
			.map((response) => {
				//return result.PAGE_GUID; 
				return response;
			});
	}
}
