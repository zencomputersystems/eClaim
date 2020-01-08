import 'rxjs/add/operator/map';

import { Http } from "@angular/http";
import { getURL } from "../providers/sanitizer/sanitizer";

export async function CheckDuplicate(tablename: string, filter: string) {
    let http: Http;
    let url: string = getURL("table", tablename, [filter]);
    let result: any;
    console.log("URL=", url);
    return new Promise((resolve) => {
        http
            .get(getURL("table",tablename,[filter]))
            .map(res => {
                console.log(res);
                return res.json();
            })
            .subscribe(data => {
                result = data["resource"];
                resolve(result.length);
            });
    });
}