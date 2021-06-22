import 'rxjs/add/operator/map';

import { Headers, Http } from '@angular/http';

import { Injectable } from '@angular/core';
import { getURL } from "../providers/sanitizer/sanitizer";

@Injectable()
export class dbServices {
    public headers = new Headers();

    constructor(private http: Http) {}

    GetData(tablename: string, filter: string) {
        return this.http.get(getURL("table",tablename,[filter]))
//            .map((res: Response) => res.json());
    }

    CheckExistence(tablename: string, filter: string) {
        let val = this.GetData(tablename, filter);
        val.subscribe((res:any) => {
            return res.json().resource.length == 0 ? false : true;
        })
    }
}

/* 
export async function CheckDuplicate(tablename: string, filter: string) {
    let urlSearchParams = new URLSearchParams();
    let http = new Http();
    urlSearchParams.append('NAME', 'Maybank');
    let url: string = getURL("table", tablename, [filter]);
    let result: any;
    console.log("URL=", url);
    console.log(http.get("https://api.zen.com.my/api/v2/zcs/_table/main_bank?api_key=cb82c1df0ba653578081b3b58179158594b3b8f29c4ee1050fda1b7bd91c3881&filter=(NAME='Maybank')"));
    return http.get(url.toString()); */
