import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as constants from '../config/constants';
import { MainClaimRequestModel } from '../models/main-claim-request.model';

@Injectable()

export class ApiManagerProvider {
    emailUrl: string = 'http://api.zen.com.my/api/v2/zenmail?api_key=' + constants.DREAMFACTORY_API_KEY;
    claimDetailsData :any[];
    result :any[];

    constructor(public http: Http) { }

    LoadMainClaim(claimReqGUID:any) {
        let totalAmount: number;
        return new Promise((resolve, reject) => {
          this.getApiModel('view_claim_request', 'filter=CLAIM_REQUEST_GUID=' + claimReqGUID).subscribe(res => {
            this.claimDetailsData = res['resource'];         
            this.claimDetailsData.forEach(element => {
              totalAmount += element.AMOUNT;
              //['resource']
            });
            resolve(totalAmount);
          })
        });
      }

      getApiModel(endPoint: string, args?: string) {
        let url = this.getModelUrl(endPoint, args);
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        return this.http.get(url, { headers: queryHeaders }).map(res => res.json())
      }

      // updateApiModel(endPoint: string, modelJSON: any) {
      //   var queryHeaders = new Headers();
      //   queryHeaders.append('Content-Type', 'application/json');
      //   queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
      //   let options = new RequestOptions({ headers: queryHeaders });
      //   return this.http.patch(this.postUrl(endPoint), modelJSON, options)
      //     .map((response) => {
      //       return response;
      //     }); 
      // }

      sendEmail() {
        let name: string; let email: string
        name = 'shabbeer'; email = 'pratap@zen.com.my'
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        let options = new RequestOptions({ headers: queryHeaders });
        let ename = 'Shabbeer Hussain';
        let startDate = '1-1-2018 11:12';
        let endDate = '1-1-2018 11:12';
        let CreatedDate = '1-1-2018 11:12';
        let level = '1';
        let assignedTo = 'Bala';
        let dept = 'Research';
        let claimType = 'Travel Claim';
    
        let body = {
          "template": "",
          "template_id": 0,
          "to": [
            {
              "name": name,
              "email": email
            }
          ],
          "cc": [
            {
              "name": name,
              "email": email
            }
          ],
          "bcc": [
            {
              "name": name,
              "email": email
            }
          ],
          "subject": "Test",
          "body_text": "",
          "body_html": '<HTML><HEAD> <META name=GENERATOR content="MSHTML 10.00.9200.17606"></HEAD> <BODY> <DIV style="FONT-FAMILY: Century Gothic"> <DIV style="MIN-WIDTH: 500px"><BR> <DIV style="PADDING-BOTTOM: 10px; TEXT-ALIGN: center; PADDING-TOP: 10px; PADDING-LEFT: 10px; PADDING-RIGHT: 10px"><IMG style="WIDTH: 130px" alt=zen2.png src="http://zentranet.zen.com.my/_catalogs/masterpage/Layout/images/zen2.png"></DIV> <DIV style="MARGIN: 0px 100px; BACKGROUND-COLOR: #ec008c"> <DIV style="FONT-SIZE: 30px; COLOR: white; PADDING-BOTTOM: 10px; TEXT-ALIGN: center; PADDING-TOP: 10px; PADDING-LEFT: 20px; PADDING-RIGHT: 20px"><B><I>Notification</I></B></DIV></DIV><BR> <DIV style="FONT-SIZE: 12px; TEXT-ALIGN: center; PADDING-TOP: 20px">Dear [' + name + ']<BR><BR>Your&nbsp;[' + claimType + '] application has been forwarded to your superior for approval.  <H1 style="FONT-SIZE: 14px; TEXT-ALIGN: center; PADDING-TOP: 10px"><BR><B>Leave Details :</B><BR></H1> <TABLE style="FONT-SIZE: 12px; FONT-FAMILY: Century Gothic; MARGIN: 0px auto"> <TBODY> <TR> <TD style="TEXT-ALIGN: left">EMPLOYEE</TD> <TD style="PADDING-BOTTOM: 6px; PADDING-TOP: 6px; PADDING-LEFT: 6px; PADDING-RIGHT: 6px">:</TD> <TD colSpan=2>      [' + ename + ']</TD></TR> <TR> <TD>START DATE</TD> <TD>:</TD> <TD style="TEXT-ALIGN: left" colSpan=2>      [' + startDate + ']</TD></TR> <TR> <TD style="TEXT-ALIGN: left">END DATE </TD> <TD>:</TD> <TD style="TEXT-ALIGN: left" colSpan=2>      [' + endDate + ']</TD></TR> <TR> <TD style="TEXT-ALIGN: left">APPLIED DATE</TD> <TD style="PADDING-BOTTOM: 6px; PADDING-TOP: 6px; PADDING-LEFT: 6px; PADDING-RIGHT: 6px">:</TD> <TD colSpan=2>      [' + CreatedDate + ']</TD></TR> <TR> <TD style="TEXT-ALIGN: left">Level</TD> <TD>:</TD> <TD style="TEXT-ALIGN: left">      [' + level + '] </TD> </TR></TR> <TR> <TD>Superior Name</TD></TD> <TD>:</TD> <TD style="TEXT-ALIGN: left" colSpan=2>      [' + assignedTo + ']</TD></TR> <TR> <TD style="TEXT-ALIG: left">Dept</TD> <TD>: </TD> <TD style="TEXT-ALIGN: left" colSpan=2>      [' + dept + ']</TD></TR></TBODY></TABLE><BR> <DIV style="TEXT-ALIGN: center; PADDING-TOP: 20px">Thank you.</DIV></DIV></DIV></DIV></BODY></HTML>',
          "from_name": "eClaim",
          "from_email": "balasingh73@gmail.com",
          "reply_to_name": "",
          "reply_to_email": ""
        };
        this.http.post(this.emailUrl, body, options)
          .map(res => res.json())
          .subscribe(data => {
            // this.result= data["resource"];
            // alert(JSON.stringify(data));
          });
      }

      getImageUrl(imageName: string) {
        return constants.IMAGE_URL + imageName + '?api_key=' + constants.DREAMFACTORY_API_KEY;
      }

      getUrl(table: string, args?: string) {
        if (args != null) {
          return constants.DREAMFACTORY_TABLE_URL + '/' + table + '?' + args + '&api_key=' + constants.DREAMFACTORY_API_KEY;
        }
        return constants.DREAMFACTORY_TABLE_URL + '/' + table + '?api_key=' + constants.DREAMFACTORY_API_KEY;
      }

      getModelUrl(table: string, args?: string) {
        if (args != null) {
          return constants.DREAMFACTORY_TABLE_URL + '/' + table + '?' + args;
        }
        return constants.DREAMFACTORY_TABLE_URL + '/' + table;
      }

      postUrl(table: string) {
        return constants.DREAMFACTORY_TABLE_URL + '/' + table;
      }

      deleteUrl(table: string,id:string) {
        return constants.DREAMFACTORY_TABLE_URL + '/' + table+ '/' + id;
      }

      postData(endpoint: string, body: any): Observable<any> {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        let options = new RequestOptions({ headers: queryHeaders });
        return this.http.post(this.postUrl(endpoint), body, options)
          .map((response) => {
            return response;
          });
      }

      updateClaimRequest(claim_main: MainClaimRequestModel): Observable<any> {
        debugger;
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        let options = new RequestOptions({ headers: queryHeaders });
        return this.http.patch(this.getUrl('main_claim_request'), claim_main.toJson(true), options)
          .map((response) => {
            return response;
          });
      }

      updateApiModel(endPoint: string, modelJSON:any) {
        debugger;
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        let options = new RequestOptions({ headers: queryHeaders });
        return this.http.patch(this.postUrl(endPoint), modelJSON, options)
          .map((response) => {
            return response;
          }); 
      }

      deleteApiModel(endPoint: string, args:string) {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        let options = new RequestOptions({ headers: queryHeaders });
        console.log(this.deleteUrl(endPoint,args));
        return this.http.delete(this.deleteUrl(endPoint,args), options)
          .map((response) => {
            return response;
          }); 
      }
    

      getClaimRequestByClaimReqGUID(claimReqGUID: string, params?: URLSearchParams): Observable<MainClaimRequestModel[]> {
       debugger;
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        return this.http
          .get(this.getUrl('main_claim_request', 'filter=	CLAIM_REQUEST_GUID=' + claimReqGUID))
          .map((response) => {
            var result: any = response.json();
            let claimData: Array<MainClaimRequestModel> = [];
            var temp: any[] = result.resource;
            temp.forEach((bank) => {
              claimData.push(MainClaimRequestModel.fromJson(bank));
            });
    
            return claimData;
          });
      }

      getApiData(endPoint: string, args?: string) {    
        return new Promise((resolve, reject) => {
          this.http
            .get(this.getUrl(endPoint, args))
            .map(res => res.json())
            .subscribe(data => {
              //this.claimRequestData = data["resource"];
              resolve(data['resource']);
            })
        })
      }

      GetGoogleDistance(url: any) {
        let DistKm: string;
        // var origin = this.Travel_From_ngModel;
        // var destination;
        // var url = 'http://api.zen.com.my/api/v2/google/distancematrix/json?destinations=place_id:' + this.DestinationPlaceID + '&origins=place_id:' + this.OriginPlaceID + '&api_key=' + constants.DREAMFACTORY_API_KEY;
        this.http.get(url).map(res => res.json()).subscribe(data => {
          let temp = data["rows"][0]["elements"][0];
          // console.table(data)
          if (temp["distance"] != null) {
            DistKm = data["rows"][0]["elements"][0]["distance"]["text"];
            // console.log(DistKm)
            DistKm = DistKm.replace(',', '')
            return DistKm;
            // this.Travel_Distance_ngModel = destination = DistKm.substring(0, DistKm.length - 2)
            // this.Travel_Mode_ngModel = this.vehicleCategory;
            // this.travelAmount = destination * this.VehicleRate, -2;
            // this.Travel_Amount_ngModel
          }
          else {
            return DistKm;
          }
          // alert('Please select Valid Origin & Destination Places');
        });
        return DistKm;
      }

      SearchLocation(key: any) {
        let val = key.target.value;
        let items: any;
        val = val.replace(/ /g, '');
        if (!val || !val.trim()) {
          // this.currentItems = [];
          items = [];
          return;
        }
        var url = 'http://api.zen.com.my/api/v2/google/place/autocomplete/json?json?radius=50000&input=' + val + '&api_key=' + constants.DREAMFACTORY_API_KEY;
        this.http.get(url).map(res => res.json()).subscribe(data => {
          items = data["predictions"];
          return items;
        });
        return items;
      }


}
