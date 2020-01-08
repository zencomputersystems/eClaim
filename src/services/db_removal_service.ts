import { DREAMFACTORY_API_KEY, DREAMFACTORY_TABLE_URL } from "../app/config/constants";
import { Headers, Http } from '@angular/http';

import { sanitizeURL } from "../providers/sanitizer/sanitizer";

export function remove_multiple(id: string, tablename: string) {
    let http: Http;
    let url_multiple = sanitizeURL(DREAMFACTORY_TABLE_URL + tablename + "?filter=(USER_GUID=" + id + ")");		
    var queryHeaders =  new Headers();
    queryHeaders.append('Content-Type', 'application/json');
    queryHeaders.append('X-Dreamfactory-API-Key', DREAMFACTORY_API_KEY);
    return http
        .delete(url_multiple, { headers: queryHeaders })
        .map((response: any) => {
            return response;
        });
}

export function remove_multiple_records(id: string, tablename: string) {
    let url_multiple = this.UserUrl.baseResource_Url + tablename + "?filter=(USER_GUID=" + id + ")";
    return this.httpService.http
        .delete(url_multiple, { headers: this.queryHeaders })
        .map((response: any) => {
            //return result.PAGE_GUID;
            return response;
        });
}