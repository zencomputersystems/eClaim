import * as constants from '../app/config/constants';

import { DatePipe, DecimalPipe } from '@angular/common';
import { Headers, Http, RequestOptions } from '@angular/http';
import { getURL, sanitizeURL } from './sanitizer/sanitizer';

import { Injectable } from '@angular/core';
import { MainClaimRequestModel } from '../models/main-claim-request.model';
import { Observable } from 'rxjs/Observable';
import { ToastController } from 'ionic-angular';
import moment from 'moment';

//import { postHeaders } from '../models/extended_headers_model';
@Injectable()
export class ApiManagerProvider {
  emailUrl: string = getURL("email");
  claimDetailsData: any[];
  result: any[];
  userClaimCutoffDate: number;
  approverCutoffDate: number;
  queryHeaders: any = new Headers();

  constructor(public numberPipe: DecimalPipe, public http: Http, public toastCtrl: ToastController, public datepipe: DatePipe) {
    this.queryHeaders.append('Content-Type', 'application/json');
    //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    this.queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);


  }

  CreateTimestamp(utc: boolean = true) {
    let oriTime = new Date();
    let theTime = utc ? moment.utc(oriTime).utcOffset(-localStorage.getItem("cs_timestamp")).format('YYYY-MM-DDTHH:mm') : moment.utc(oriTime).utcOffset(localStorage.getItem("cs_timestamp")).format('YYYY-MM-DDTHH:mm');
    return theTime;
  }

  LoadMainClaim(claimReqGUID: any) {
    let totalAmount: number;
    return new Promise((resolve) => {
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
    let url = this.getModelUrl(endPoint, args);;
    return this.http
      .get(sanitizeURL(url)) //, { headers: queryHeaders })
      .map(res => res.json())
  }

  EmailReject(CLAIM_REQUEST_GUID: string, Remarks: string, ApproverStatus: string, RejectedByStatus: string, Level: string) {
    let url = getURL("table", "view_email_details_new", [`CLAIM_REQUEST_GUID=${CLAIM_REQUEST_GUID}`]);

    this.http
      .get(url)
      .map(res => res.json())
      .subscribe(data => {
        let email_details = data["resource"];
        if (email_details.length > 0) {
          let name: string = "";
          let email: string = "";
          let Project_OR_Customer_Name: string = "";
          let ClaimAmt: string = "0.00";
          let Status: string = "";
          let claimType: string = "";
          let startDate: string = "";
          let endDate: string = "";
          let travelDate: string = "";
          let Description: string = "";
          let OriginPlace: string = "";
          let Destination: string = "";
          let AppliedDate: string = "";

          name = email_details[0]["APPLIER_NAME"]; email = email_details[0]["APPLIER_EMAIL"];
          let ename = email_details[0]["APPLIER_NAME"];

          let superior_email: string = email_details[0]["SUPERIOR_EMAIL"];

          if (email_details[0]["SOC_NO"] != null) {
            Project_OR_Customer_Name = email_details[0]["PROJECT_NAME"] + ' / ' + email_details[0]["SOC_NO"];
          }
          if (email_details[0]["CUSTOMER_NAME"] != null) {
            Project_OR_Customer_Name = email_details[0]["CUSTOMER_NAME"];
          }

          AppliedDate = email_details[0]["APPLIED_DATE"];
          startDate = email_details[0]["START_DATE"];
          endDate = email_details[0]["END_DATE"];
          travelDate = email_details[0]["TRAVEL_DATE"];

          OriginPlace = email_details[0]["ORIGIN"];
          Destination = email_details[0]["DESTINATION"];

          ClaimAmt = this.numberPipe.transform(email_details[0]["CLAIM_AMOUNT"], '1.2-2');
          Status = email_details[0]["STATUS"];

          claimType = email_details[0]["CLAIM_TYPE"];
          Description = email_details[0]["DESCRIPTION"];

          var queryHeaders = new Headers();
          queryHeaders.append('Content-Type', 'application/json');
          queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
          queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
          let options = new RequestOptions({ headers: queryHeaders });
          let strSubjectApplier: string = ""; let strBody_html: string;

          if (ApproverStatus == "Rejected") {
            strSubjectApplier = RejectedByStatus;
          }
          let body1: any;
          let ImgageSrc: string = constants.DREAMFACTORY_IMAGE_URL + localStorage.getItem("cs_email_logo") + "?api_key=" + constants.DREAMFACTORY_API_KEY;

          if (claimType == "Entertainment Claim" || claimType == "Printing Claim" || claimType == "Overtime Claim" || claimType == "Gift Claim" || claimType == "Miscellaneous Claim") {
            if (ApproverStatus == "Rejected") {
              strBody_html = `<HTML>
              <HEAD>
                 <META name=GENERATOR content="MSHTML 10.00.9200.17606">
              </HEAD>
              <BODY>
                 <DIV style="FONT-FAMILY: Century Gothic">
                    <DIV style="MIN-WIDTH: 500px">
                       <BR>
                       <DIV style="PADDING-BOTTOM: 10px; text-align: left; PADDING-TOP: 10px; PADDING-LEFT: 10px; PADDING-RIGHT: 10px"><IMG style="WIDTH: 130px" alt=zen2.png src=${ImgageSrc}></DIV>
                       <DIV style="MARGIN: 0 30px;">
                          <DIV style="FONT-SIZE: 24px; COLOR: black; PADDING-BOTTOM: 10px; TEXT-ALIGN: left; PADDING-TOP: 10px; PADDING-RIGHT: 20px"><B>${strSubjectApplier}</B></DIV>
                       </DIV>
                       <DIV style="FONT-SIZE: 12px; TEXT-ALIGN: left; padding:11px 30px">
                          &nbsp;
                          <hr>
                          <div style="FONT-SIZE: 16px; TEXT-ALIGN: left; "><B>Claim Details :</B></div>
                          <BR/>
                          <TABLE style="FONT-SIZE: 12px; FONT-FAMILY: Century Gothic; MARGIN: 0px auto;">
                             <TBODY>
                                <TR>
                                   <TD style="TEXT-ALIGN: left">Employee</TD>
                                   <TD>:</TD>
                                   <TD colSpan=2> ${ename}</TD>
                                </TR>
                                <TR>
                                   <TD style="TEXT-ALIGN: left">Applied Date</TD>
                                   <TD>:</TD>
                                   <TD style="TEXT-ALIGN: left" colSpan=2> ${moment(AppliedDate).format('DD/MM/YYYY')}</TD>
                                </TR>
                                <TR>
                                   <TD style="TEXT-ALIGN: left">Claim Date </TD>
                                   <TD>:</TD>
                                   <TD style="TEXT-ALIGN: left" colSpan=2>${moment(travelDate).format('DD/MM/YYYY')}</TD>
                                </TR>
                                <TR>
                                   <TD style="TEXT-ALIGN: left">Claim Type</TD>
                                   <TD>: </TD>
                                   <TD style="TEXT-ALIGN: left" colSpan=2>${claimType}</TD>
                                </TR>
                                <TR>
                                   <TD style="TEXT-ALIGN: left">Project / Customer / SOC</TD>
                                   <TD>:</TD>
                                   <TD style="TEXT-ALIGN: left" colSpan=2> ${Project_OR_Customer_Name}</TD>
                                </TR>
                                <TR>
                                   <TD style="TEXT-ALIGN: left">Claim Amount</TD>
                                   <TD>: </TD>
                                   <TD style="TEXT-ALIGN: left" colSpan=2> ${localStorage.getItem("cs_default_currency")} ${ClaimAmt}</TD>
                                </TR>
                                <TR>
                                   <TD style="TEXT-ALIGN: left">Description</TD>
                                   <TD>: </TD>
                                   <TD style="TEXT-ALIGN: left" colSpan=2>${Description}</TD>
                                </TR>
                                <tr>
                                   <td style="TEXT-ALIGN: left">Remarks</td>
                                   <td>: </td>
                                   <td style="TEXT-ALIGN: left" colspan="2">${Remarks} </td>
                                </tr>
                                <TR>
                                   <TD style="TEXT-ALIGN: left"></TD>
                                   <TD></TD>
                                   <TD style="TEXT-ALIGN: left" colSpan=2><a href="http://claim.beesuite.app/#/UserclaimslistPage" style="background: #0492C2; padding: 10px; color: white; text-decoration: none; border-radius: 5px; display:inline-block;">Open eClaim</a></TD>
                                </TR>
                             </TBODY>
                          </TABLE>
                          <HR>
                          <DIV style="TEXT-ALIGN: left; PADDING-TOP: 20px">Thank you.</DIV>
                       </DIV>
                    </DIV>
                 </DIV>
              </BODY>
           </HTML>`
            }
          }
          else if (claimType == "Travel Claim") {
            if (ApproverStatus == "Rejected") {
              strBody_html = `<HTML>
              <HEAD>
                 <META name=GENERATOR content="MSHTML 10.00.9200.17606">
              </HEAD>
              <BODY>
                 <DIV style="FONT-FAMILY: Century Gothic">
                    <DIV style="MIN-WIDTH: 500px">
                       <BR>
                       <DIV style="PADDING-BOTTOM: 10px; text-align: left; PADDING-TOP: 10px; PADDING-LEFT: 10px; PADDING-RIGHT: 10px"><IMG style="WIDTH: 130px" alt=zen2.png src='${ImgageSrc}'></DIV>
                       <DIV style="MARGIN: 0 30px;">
                          <DIV style="FONT-SIZE: 24px; COLOR: black; PADDING-BOTTOM: 10px; TEXT-ALIGN: left; PADDING-TOP: 10px; PADDING-RIGHT: 20px"><B>${strSubjectApplier}</B></DIV>
                       </DIV>
                       <DIV style="FONT-SIZE: 12px; TEXT-ALIGN: left; padding:11px 30px">
                          &nbsp;
                          <hr>
                          <div style="FONT-SIZE: 16px; TEXT-ALIGN: left; "><B>Claim Details :</B></div>
                          <BR/>
                          <TABLE style="FONT-SIZE: 12px; FONT-FAMILY: Century Gothic; MARGIN: 0px auto;">
                             <TBODY>
                                <TR>
                                   <TD style="TEXT-ALIGN: left">Employee</TD>
                                   <TD>:</TD>
                                   <TD colSpan=2>${ename}</TD>
                                </TR>
                                <TR>
                                   <TD style="TEXT-ALIGN: left">Applied Date</TD>
                                   <TD>:</TD>
                                   <TD style="TEXT-ALIGN: left" colSpan=2>${moment(AppliedDate).format('DD/MM/YYYY')}</TD>
                                </TR>
                                <TR>
                                   <TD style="TEXT-ALIGN: left">Claim Date </TD>
                                   <TD>:</TD>
                                   <TD style="TEXT-ALIGN: left" colSpan=2>${moment(startDate).format('DD/MM/YYYY')}</TD>
                                </TR>
                                <TR>
                                   <TD style="TEXT-ALIGN: left">Claim Type</TD>
                                   <TD>: </TD>
                                   <TD style="TEXT-ALIGN: left" colSpan=2>${claimType}</TD>
                                </TR>
                                <TR>
                                   <TD style="TEXT-ALIGN: left">Project / Customer / SOC</TD>
                                   <TD>:</TD>
                                   <TD style="TEXT-ALIGN: left" colSpan=2>${Project_OR_Customer_Name}</TD>
                                </TR>
                                <TR>
                                   <TD style="TEXT-ALIGN: left">Origin</TD>
                                   <TD>:</TD>
                                   <TD style="TEXT-ALIGN: left" colSpan=2>${OriginPlace}</TD>
                                </TR>
                                <TR>
                                   <TD style="TEXT-ALIGN: left">Destination</TD>
                                   <TD>:</TD>
                                   <TD style="TEXT-ALIGN: left" colSpan=2>${Destination}</TD>
                                </TR>
                                <TR>
                                   <TD style="TEXT-ALIGN: left">Claim Amount</TD>
                                   <TD>: </TD>
                                   <TD style="TEXT-ALIGN: left" colSpan=2>${localStorage.getItem("cs_default_currency")} ${ClaimAmt}</TD>
                                </TR>
                                <TR>
                                   <TD style="TEXT-ALIGN: left">Description</TD>
                                   <TD>: </TD>
                                   <TD style="TEXT-ALIGN: left" colSpan=2>${Description}</TD>
                                </TR>
                                <tr>
                                   <td style="TEXT-ALIGN: left">Remarks</td>
                                   <td>: </td>
                                   <td style="TEXT-ALIGN: left" colspan="2">${Remarks}</td>
                                </tr>
                                <TR>
                                   <TD style="TEXT-ALIGN: left"></TD>
                                   <TD></TD>
                                   <TD style="TEXT-ALIGN: left" colSpan=2><a href="http://claim.beesuite.app/#/UserclaimslistPage" style="background: #0492C2; padding: 10px; color: white; text-decoration: none; border-radius: 5px; display:inline-block;">Open eClaim</a></TD>
                                </TR>
                             </TBODY>
                          </TABLE>
                          <HR>
                          <DIV style="TEXT-ALIGN: left; PADDING-TOP: 20px">Thank you.</DIV>
                       </DIV>
                    </DIV>
                 </DIV>
              </BODY>
           </HTML>`
            }
          }

          body1 = {
            "template": "",
            "template_id": 0,
            "to": [
              {
                "name": strSubjectApplier,
                "email": email
              }
            ],
            "subject": strSubjectApplier,
            "body_text": "",
            "body_html": strBody_html,
            "from_name": "eClaim",
            "from_email": "balasingh73@gmail.com",
            "reply_to_name": "",
            "reply_to_email": ""
          };

          //Added by bijay on 18/10/2018--------------
          if (Level == '3' || Level == '-1') {
            body1 = {
              "template": "",
              "template_id": 0,
              "to": [
                {
                  "name": strSubjectApplier,
                  "email": email,
                }
              ],
              "cc": [
                {
                  "name": strSubjectApplier,
                  "email": superior_email,
                }
              ],
              "subject": strSubjectApplier,
              "body_text": "",
              "body_html": strBody_html,
              "from_name": "eClaim",
              "from_email": "balasingh73@gmail.com",
              "reply_to_name": "",
              "reply_to_email": ""
            };
          }

          //Send Email For Applier 1-------------------------------------------
          this.http.post(this.emailUrl, body1, options)
            .map(res => res.json())
            .subscribe(() => {
            });
          //-------------------------------------------------------------------
        }
      });
    //-------------------------------------------------------------------------
  }


  getImageUrl(imageName: string) {
    return constants.IMAGE_VIEW_URL + encodeURIComponent((imageName)).replace(/\%20/gi, '%2520'); //+constants.SAS_QUERY_STRING;

    //    return constants.DREAMFACTORY_IMAGE_URL + imageName + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  }

  getModelUrl(table: string, args?: string) {
    if (args != null) {
      return getURL("table", table) + `&${args}`
      //     return constants.DREAMFACTORY_TABLE_URL + '/' + table + '?' + args;
    }
    return getURL("table", table);
    //    return constants.DREAMFACTORY_TABLE_URL + '/' + table;
  }

  postUrl(table: string) {
    return sanitizeURL(constants.DREAMFACTORY_TABLE_URL + '/' + table);
  }

  deleteUrl(table: string, id: string) {
    return sanitizeURL(constants.DREAMFACTORY_TABLE_URL + '/' + table + '/' + id);
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
    var queryHeaders = new Headers();
    queryHeaders.append('Content-Type', 'application/json');
    queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
    let options = new RequestOptions({ headers: queryHeaders });
    return this.http.patch(getURL("table", 'main_claim_request'), JSON.stringify({ resource: claim_main }), options)
      .map((response) => {
        return response;
      });
  }

  updateApiModel(endPoint: string, modelJSONData: any, isClaim: boolean) {
    //    let modelJSON = modelJSONData["resource"][0];
    var queryHeaders = new Headers();
    queryHeaders.append('Content-Type', 'application/json');
    queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
    console.log(queryHeaders);
    let options = new RequestOptions({ headers: queryHeaders });
    return this.http.patch(this.postUrl(endPoint), modelJSONData, options)
    /*       .map((response) => {
            // if (isClaim && modelJSON.STATUS != 'Draft')
            // this.sendEmail(modelJSON.CLAIM_TYPE_GUID, modelJSON.START_TS, modelJSON.END_TS, modelJSON.CREATION_TS, modelJSON.TRAVEL_DATE, modelJSON.CLAIM_REQUEST_GUID);
            return response; 
          }); */
  }

  deleteApiModel(endPoint: string, args: string) {
    var queryHeaders = new Headers();
    queryHeaders.append('Content-Type', 'application/json');
    queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
    let options = new RequestOptions({ headers: queryHeaders });
    console.log(this.deleteUrl(endPoint, args));
    return this.http.delete(this.deleteUrl(endPoint, args), options)
    /*       .map((response) => {
            return response;
          }); */
  }


  getClaimRequestByClaimReqGUID(claimReqGUID: string): Observable<MainClaimRequestModel[]> {
    return this.http
      .get(getURL("table", 'main_claim_request', [`CLAIM_REQUEST_GUID=${claimReqGUID}`]))
      .map((response) => {
        var result: any = response.json();
        console.log('getClaimRequestByClaimReqGUID(', claimReqGUID, ')')
        console.log(response.json().resource);
        let claimData: Array<MainClaimRequestModel> = result.resource;
        return claimData;
      });
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
    this.http.get(sanitizeURL(url)).map(res => res.json()).subscribe(data => {
      items = data["predictions"];
      return items;
    });
    return items;
  }

  stringToSplit: string = "";
  tempSplit: string = "";
  isFileImage(val: any) {
    if (val !== null) {
      this.stringToSplit = val;
      this.tempSplit = this.stringToSplit.split(".")[2];
      if (this.tempSplit == "jpeg" || this.tempSplit == "jpg" || this.tempSplit == "png")
        return true
      else {
        return false
      }
    }
  }

  isClaimExpired(travelDate: any, isApprover: boolean) {
    this.userClaimCutoffDate = parseInt(localStorage.getItem("cs_claim_cutoff_date"));
    this.approverCutoffDate = parseInt(localStorage.getItem("cs_approval_cutoff_date"));

    let claimExpiry: any;
    if (isApprover) {
      claimExpiry = this.approverCutoffDate;
    }
    else {
      claimExpiry = this.userClaimCutoffDate;
    }
    let myDate = new Date(travelDate);
    let travelMonth: number = myDate.getMonth();
    let currentMonth: number = new Date().getMonth();
    let currentDate: number = new Date().getDate();
    let longBack = (travelMonth + 1) < currentMonth;
    let previous = travelMonth === (currentMonth - 1) && currentDate > claimExpiry;
    let current = (travelMonth === currentMonth);
    if (current)
      return false;
    if (longBack || previous) {
      if (isApprover)
        alert('The date to approve the claim has expired.');
      else
        alert('The date to apply the claim has expired.')
      return true;
    }
    return false;
  }

}
