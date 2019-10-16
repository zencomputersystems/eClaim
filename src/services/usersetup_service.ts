import { Injectable } from '@angular/core';
import { Headers, RequestOptions, URLSearchParams } from '@angular/http';

import * as constants from '../app/config/constants';
//import {EntertainmentClaim_Model} from '../models/entertainment_model';
import { UserInfo_Model } from '../models/usersetup_info_model';
import { UserMain_Model } from '../models/user_main_model';
import { UserContact_Model } from '../models/user_contact_model';
import { UserCompany_Model } from '../models/user_company_model';
import { UserRole_Model } from '../models/user_role_model';
import { UserAddress_Model } from '../models/usersetup_address_model';
import { UserQualification_Model } from '../models/user_qualification_model';
import { UserCertification_Model } from '../models/user_certification_model';
import { UserSpouse_Model } from '../models/user_spouse_model';
import { UserChildren_Model } from '../models/user_children_model';
import { BaseHttpService } from './base-http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';


@Injectable()

export class UserSetup_Service {
	baseResourceUrl1: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/user_info';
	baseResource_Url1: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

	baseResourceUrl2: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/user_main';
	baseResource_Url2: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

	baseResourceUrl3: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/user_contact';
	baseResource_Url3: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

	baseResourceUrl4: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/user_company';
	baseResource_Url4: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

	// baseResourceUrl5: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/tenant_company_site';
	// baseResource_Url5: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

	baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/user_address';
	baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

	baseResourceUrl5: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/user_qualification';
	baseResourceUrl6: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/user_role';

	baseResourceView: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_user_display';
	baseResourceView_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

	baseResourceView6: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/user_certification';
	baseResourceView7: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/user_spouse';
	baseResourceView8: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/user_children';

	public USER_GUID: any;

	constructor(private httpService: BaseHttpService) { };

	private handleError(error: any) {
		let errMsg = (error.message) ? error.message :
			error.status ? `${error.status} - ${error.statusText}` : 'Server error';
		console.log(errMsg); // log to console instead
		//localStorage.setItem('session_token', '');       
		return Observable.throw(errMsg);
	}

	query(params?: URLSearchParams): Observable<UserInfo_Model[]> {
		//let bank :any;
		var queryHeaders = new Headers();
		queryHeaders.append('Content-Type', 'application/json');
		//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
		queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		return this.httpService.http
			.get(this.baseResourceUrl, { search: params, headers: queryHeaders })
			.map(() => {
					let banks: Array<UserInfo_Model> = [];
					// result.resource.forEach((bank) => {
					// 	banks.push(BankSetup_Model.fromJson(bank));
					// });  
					return banks;
				}).catch(this.handleError);
	};

	save_user_info(user_info: UserInfo_Model): Observable<any> {
		var queryHeaders = new Headers();
		queryHeaders.append('Content-Type', 'application/json');
		//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
		queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		let options = new RequestOptions({ headers: queryHeaders });
		return this.httpService.http.post(this.baseResourceUrl1, user_info.toJson(true), options)
			.map((response) => {
				return response;
			});
	}

	save_user_main(user_main: UserMain_Model): Observable<any> {
		var queryHeaders = new Headers();
		queryHeaders.append('Content-Type', 'application/json');
		//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
		queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		let options = new RequestOptions({ headers: queryHeaders });
		return this.httpService.http.post(this.baseResourceUrl2, user_main.toJson(true), options)
			.map((response) => {
				return response;
			});
	}

	save_user_contact(user_contact: UserContact_Model): Observable<any> {
		var queryHeaders = new Headers();
		queryHeaders.append('Content-Type', 'application/json');
		//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
		queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		let options = new RequestOptions({ headers: queryHeaders });
		return this.httpService.http.post(this.baseResourceUrl3, user_contact.toJson(true), options)
			.map((response) => {
				return response;
			});
	}

	save_user_company(user_company: UserCompany_Model): Observable<any> {
		var queryHeaders = new Headers();
		queryHeaders.append('Content-Type', 'application/json');
		//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
		queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		let options = new RequestOptions({ headers: queryHeaders });
		return this.httpService.http.post(this.baseResourceUrl4, user_company.toJson(true), options)
			.map((response) => {
				return response;
			});
	}

	save_user_role(user_role: UserRole_Model): Observable<any> {
		var queryHeaders = new Headers();
		queryHeaders.append('Content-Type', 'application/json');
		//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
		queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		let options = new RequestOptions({ headers: queryHeaders });
		return this.httpService.http.post(this.baseResourceUrl6, user_role.toJson(true), options)
			.map((response) => {
				return response;
			});
	}

	save_user_address(user_address: UserAddress_Model): Observable<any> {
		var queryHeaders = new Headers();
		queryHeaders.append('Content-Type', 'application/json');
		//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
		queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		let options = new RequestOptions({ headers: queryHeaders });
		return this.httpService.http.post(this.baseResourceUrl, user_address.toJson(true), options)
			.map((response) => {
				return response;
			});
	}

	save_user_qualification(user_qualification: UserQualification_Model): Observable<any> {
		var queryHeaders = new Headers();
		queryHeaders.append('Content-Type', 'application/json');
		//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
		queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		let options = new RequestOptions({ headers: queryHeaders });
		return this.httpService.http.post(this.baseResourceUrl5, user_qualification.toJson(true), options)
			.map((response) => {
				return response;
			});
	}

	save_user_certification(user_cetrtification: UserCertification_Model): Observable<any> {
		var queryHeaders = new Headers();
		queryHeaders.append('Content-Type', 'application/json');
		//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
		queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		let options = new RequestOptions({ headers: queryHeaders });
		return this.httpService.http.post(this.baseResourceView6, user_cetrtification.toJson(true), options)
			.map((response) => {
				return response;
			});
	}

	save_user_spouse(user_spouse: UserSpouse_Model): Observable<any> {
		var queryHeaders = new Headers();
		queryHeaders.append('Content-Type', 'application/json');
		//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
		queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		let options = new RequestOptions({ headers: queryHeaders });
		return this.httpService.http.post(this.baseResourceView7, user_spouse.toJson(true), options)
			.map((response) => {
				return response;
			});
	}

	save_user_children(user_children: UserChildren_Model): Observable<any> {
		var queryHeaders = new Headers();
		queryHeaders.append('Content-Type', 'application/json');
		//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
		queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		let options = new RequestOptions({ headers: queryHeaders });
		return this.httpService.http.post(this.baseResourceView8, user_children.toJson(true), options)
			.map((response) => {
				return response;
			});
	}

	//Edit	
	update_user_main(user_main: UserMain_Model): Observable<any> {
		var queryHeaders = new Headers();
		queryHeaders.append('Content-Type', 'application/json');
		//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
		queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);

		let options = new RequestOptions({ headers: queryHeaders });
		return this.httpService.http.patch(this.baseResourceUrl2, user_main.toJson(true), options)
			.map((response) => {
				return response;
			});
	}

	update_user_info(user_info: UserInfo_Model): Observable<any> {
		var queryHeaders = new Headers();
		queryHeaders.append('Content-Type', 'application/json');
		//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
		queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);

		let options = new RequestOptions({ headers: queryHeaders });
		return this.httpService.http.patch(this.baseResourceUrl1, user_info.toJson(true), options)
			.map((response) => {
				return response;
			});
	}

	update_user_contact(user_contact: UserContact_Model): Observable<any> {
		var queryHeaders = new Headers();
		queryHeaders.append('Content-Type', 'application/json');
		//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
		queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);

		let options = new RequestOptions({ headers: queryHeaders });
		return this.httpService.http.patch(this.baseResourceUrl3, user_contact.toJson(true), options)
			.map((response) => {
				return response;
			});
	}

	update_user_company(user_company: UserCompany_Model): Observable<any> {
		var queryHeaders = new Headers();
		queryHeaders.append('Content-Type', 'application/json');
		//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
		queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);

		let options = new RequestOptions({ headers: queryHeaders });
		return this.httpService.http.patch(this.baseResourceUrl4, user_company.toJson(true), options)
			.map((response) => {
				return response;
			});
	}

	update_user_address(user_address: UserAddress_Model): Observable<any> {
		var queryHeaders = new Headers();
		queryHeaders.append('Content-Type', 'application/json');
		//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
		queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);

		let options = new RequestOptions({ headers: queryHeaders });
		return this.httpService.http.patch(this.baseResourceUrl, user_address.toJson(true), options)
			.map((response) => {
				return response;
			});
	}

	update_user_role(user_role: UserRole_Model): Observable<any> {
		var queryHeaders = new Headers();
		queryHeaders.append('Content-Type', 'application/json');
		//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
		queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		let options = new RequestOptions({ headers: queryHeaders });
		return this.httpService.http.patch(this.baseResourceUrl6, user_role.toJson(true), options)
			.map((response) => {
				return response;
			});
	}

	update_user_qualification(user_qualification: UserQualification_Model): Observable<any> {
		var queryHeaders = new Headers();
		queryHeaders.append('Content-Type', 'application/json');
		//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
		queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);

		let options = new RequestOptions({ headers: queryHeaders });
		return this.httpService.http.patch(this.baseResourceUrl5, user_qualification.toJson(true), options)
			.map((response) => {
				return response;
			});
	}

	get(id: string, params?: URLSearchParams): Observable<UserAddress_Model> {
		alert('stating of service');
		var queryHeaders = new Headers();
		queryHeaders.append('Content-Type', 'application/json');

		queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		//let url = this.baseResourceView + "?filter=(USER_GUID=" + id + ')&api_key=' + constants.DREAMFACTORY_API_KEY; 
		//alert(id);
		return this.httpService.http
			.get(this.baseResourceUrl + "?filter=(USER_GUID=" + id + ')&api_key=' + constants.DREAMFACTORY_API_KEY, { search: params, headers: queryHeaders })
			// .get(this.baseResourceUrl + '/' + id, { search: params, headers: queryHeaders })
			.map((response) => {

				var result: any = response.json();
				console.log(result);
				alert(this.baseResourceUrl);
				let viewtype: UserAddress_Model = UserAddress_Model.fromJson(result);
				console.log(viewtype);
				alert(JSON.stringify(viewtype));
				alert('end of service');
				return viewtype;

			}).catch(this.handleError);

	};

	remove(id: string) {
		var queryHeaders = new Headers();
		queryHeaders.append('Content-Type', 'application/json');
		//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
		queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		return this.httpService.http
			.delete(this.baseResourceUrl2 + '/' + id, { headers: queryHeaders })
			.map((response) => {
				var result: any = response.json();
				return result.USER_GUID;
			});
	}

	remove_multiple(id: string, tablename: string) {
		// let url_multiple: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/' + tablename;		

		// var queryHeaders = new Headers();
		// queryHeaders.append('Content-Type', 'application/json');
		// //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
		// queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		// return this.httpService.http
		// 	.delete(url_multiple + '/' + id, { headers: queryHeaders })
		// 	.map((response) => {
		// 		var result: any = response.json();
		// 		//return result.USER_GUID;
		// 		return response;
		// 	});

		let url_multiple = this.baseResource_Url + tablename + "?filter=(USER_GUID=" + id + ")AND(ROLE_FLAG=ADDITIONAL)";
		console.log(url_multiple);

		var queryHeaders = new Headers();
		queryHeaders.append('Content-Type', 'application/json');
		queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);

		return this.httpService.http
			.delete(url_multiple, { headers: queryHeaders })
			.map((response) => {
				//return result.PAGE_GUID;
				return response;
			});
	}

	remove_multiple_records(id: string, tablename: string) {
		let url_multiple = this.baseResource_Url + tablename + "?filter=(USER_GUID=" + id + ")";

		var queryHeaders = new Headers();
		queryHeaders.append('Content-Type', 'application/json');
		queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);

		return this.httpService.http
			.delete(url_multiple, { headers: queryHeaders })
			.map((response) => {
				//return result.PAGE_GUID;
				return response;
			});
	}

	// get_bijay(id: string): Observable<ViewUser_Model> {
	// 	var queryHeaders = new Headers();
	// 	queryHeaders.append('Content-Type', 'application/json');
	// 	//queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);

	// 	return this.httpService.http
	// 		//.get(this.baseResourceUrl + '/' + id, { search: params, headers: queryHeaders})
	// 		.get(this.baseResourceView + "?filter=(USER_GUID=" + id + ')&api_key=' + constants.DREAMFACTORY_API_KEY, { headers: queryHeaders })
	// 		.map((response) => {
	// 			var result: any = response.json();
	// 			let user: ViewUser_Model = ViewUser_Model.fromJson(result);
	// 			//alert(JSON.stringify(user)); 
	// 			return user;
	// 		}).catch(this.handleError);
	// };
}
