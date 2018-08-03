import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import * as constants from '../config/constants';
import { MainClaimRequestModel } from '../models/main-claim-request.model';
import { DatePipe, DecimalPipe } from '@angular/common'
import moment from 'moment';

@Injectable()

export class ApiManagerProvider {
  emailUrl: string = 'http://api.zen.com.my/api/v2/zenmail?api_key=' + constants.DREAMFACTORY_API_KEY;
  claimDetailsData: any[];
  result: any[];

  constructor(public numberPipe: DecimalPipe, public http: Http, public toastCtrl: ToastController, public datepipe: DatePipe) { }

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
    let url = this.getModelUrl(endPoint, args);
    var queryHeaders = new Headers();
    queryHeaders.append('Content-Type', 'application/json');
    queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
    return this.http.get(url, { headers: queryHeaders }).map(res => res.json())
  }

  sendEmail(ClaimType_GUID: string, startDate: any, endDate: any, CreatedDate: string, TravelDate: string, CLAIM_REQUEST_GUID: string) {
    
    console.log(moment(startDate).format('YYYY-MM-DDTHH:mm'));
    console.log(this.datepipe.transform(startDate, 'dd/MM/yyyy HH:mm'));
    let url = constants.DREAMFACTORY_TABLE_URL + '/view_email_details?filter=USER_GUID=' + localStorage.getItem("g_USER_GUID") + '&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http
      .get(url)
      .map(res => res.json())
      .subscribe(data => {
        let email_details = data["resource"];
        if (email_details.length > 0) {
          let name: string; let email: string
          name = email_details[0]["APPLIER_NAME"]; email = email_details[0]["APPLIER_EMAIL"];

          let Approver1_name: string; let Approver1_email: string
          Approver1_name = email_details[0]["APPROVER1_NAME"]; Approver1_email = email_details[0]["APPROVER1_EMAIL"];
          let ename = email_details[0]["APPLIER_NAME"];
          //let level = '1';
          let assignedTo = email_details[0]["APPROVER1_NAME"];
          
          //Get the Total Claim Amount and Status----------------------
          let ClaimAmt: string = "0.00"; let Status: string = "";
          let url_Amt_Status = constants.DREAMFACTORY_TABLE_URL + '/main_claim_request?filter=(CLAIM_REQUEST_GUID=' + CLAIM_REQUEST_GUID + ')AND(CLAIM_TYPE_GUID = ' + ClaimType_GUID + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
          this.http
            .get(url_Amt_Status)
            .map(res => res.json())
            .subscribe(data => {
              let Amt_Status_details = data["resource"];
              if (Amt_Status_details.length > 0) {
                ClaimAmt = this.numberPipe.transform(Amt_Status_details[0]["CLAIM_AMOUNT"], '1.2-2');
                Status = Amt_Status_details[0]["STATUS"];

                var queryHeaders = new Headers();
                queryHeaders.append('Content-Type', 'application/json');
                queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
                queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
                let options = new RequestOptions({ headers: queryHeaders });
                let claimType: string = "";
                let strSubjectApplier: string = ""; let strSubjectApprover: string; let strBody_html: string;

                //For Cliam Type-------------------------------------------------
                let url_claim_type = constants.DREAMFACTORY_TABLE_URL + "/main_claim_type?filter=(CLAIM_TYPE_GUID=" + ClaimType_GUID + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
                this.http
                  .get(url_claim_type)
                  .map(res => res.json())
                  .subscribe(data => {
                    let claimType_details = data["resource"];
                    if (claimType_details.length > 0) {
                      claimType = claimType_details[0]["NAME"];

                      if (claimType == "Travel Claim" || claimType == "Overtime Claim") {
                        strSubjectApplier = "Your " + claimType + " application (" + moment(startDate).format('YYYY-MM-DDTHH:mm')  + " - " + moment(endDate).format('YYYY-MM-DDTHH:mm')  + ") has been forwarded for your superior approval.";
                        strBody_html = '<HTML><HEAD><META name=GENERATOR content="MSHTML 10.00.9200.17606"></HEAD><BODY><DIV style="FONT-FAMILY: Century Gothic"><DIV style="MIN-WIDTH: 500px"><BR><DIV style="PADDING-BOTTOM: 10px; TEXT-ALIGN: center; PADDING-TOP: 10px; PADDING-LEFT: 10px; PADDING-RIGHT: 10px"><IMG style="WIDTH: 130px" alt=zen2.png src="http://zentranet.zen.com.my/_catalogs/masterpage/Layout/images/zen2.png"></DIV><DIV style="MARGIN: 0px 100px; BACKGROUND-COLOR: #ec008c"><DIV style="FONT-SIZE: 30px; COLOR: white; PADDING-BOTTOM: 10px; TEXT-ALIGN: center; PADDING-TOP: 10px; PADDING-LEFT: 20px; PADDING-RIGHT: 20px"><B><I>Notification</I></B></DIV></DIV><BR><DIV style="FONT-SIZE: 12px; TEXT-ALIGN: center; PADDING-TOP: 20px">Dear ' + name + '<BR><BR>Your ' + claimType + ' application has been forwarded to your superior for approval.<H1 style="FONT-SIZE: 14px; TEXT-ALIGN: center; PADDING-TOP: 10px"><BR><B>Claim Details :</B><BR></H1><TABLE style="FONT-SIZE: 12px; FONT-FAMILY: Century Gothic; MARGIN: 0px auto;"><TBODY><TR><TD style="TEXT-ALIGN: left">EMPLOYEE</TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + ename + '</TD></TR><TR><TD style="TEXT-ALIGN: left">START DATE</TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + moment(startDate).format('YYYY-MM-DDTHH:mm')  + '</TD></TR><TR><TD style="TEXT-ALIGN: left">END DATE </TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + moment(endDate).format('YYYY-MM-DDTHH:mm') + '</TD></TR><TR><TD style="TEXT-ALIGN: left">APPLIED DATE</TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + this.datepipe.transform(CreatedDate, 'dd/MM/yyyy HH:mm') + '</TD></TR><TR><TD style="TEXT-ALIGN: left">Superior Name</TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + assignedTo + '</TD></TR><TR><TD style="TEXT-ALIGN: left">Claim Amount</TD><TD>: </TD><TD style="TEXT-ALIGN: left" colSpan=2> RM ' + ClaimAmt + '</TD></TR><TR><TD style="TEXT-ALIGN: left">Status</TD><TD>: </TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + Status + '</TD></TR></TBODY></TABLE><BR><DIV style="TEXT-ALIGN: center; PADDING-TOP: 20px">Thank you.</DIV></DIV></DIV></DIV></BODY></HTML>';
                      }
                      else {
                        strSubjectApplier = "Your " + claimType + " application has been forwarded for your superior approval.";
                        strBody_html = '<HTML><HEAD><META name=GENERATOR content="MSHTML 10.00.9200.17606"></HEAD><BODY><DIV style="FONT-FAMILY: Century Gothic"><DIV style="MIN-WIDTH: 500px"><BR><DIV style="PADDING-BOTTOM: 10px; TEXT-ALIGN: center; PADDING-TOP: 10px; PADDING-LEFT: 10px; PADDING-RIGHT: 10px"><IMG style="WIDTH: 130px" alt=zen2.png src="http://zentranet.zen.com.my/_catalogs/masterpage/Layout/images/zen2.png"></DIV><DIV style="MARGIN: 0px 100px; BACKGROUND-COLOR: #ec008c"><DIV style="FONT-SIZE: 30px; COLOR: white; PADDING-BOTTOM: 10px; TEXT-ALIGN: center; PADDING-TOP: 10px; PADDING-LEFT: 20px; PADDING-RIGHT: 20px"><B><I>Notification</I></B></DIV></DIV><BR><DIV style="FONT-SIZE: 12px; TEXT-ALIGN: center; PADDING-TOP: 20px">Dear ' + name + '<BR><BR>Your ' + claimType + ' application has been forwarded to your superior for approval.<H1 style="FONT-SIZE: 14px; TEXT-ALIGN: center; PADDING-TOP: 10px"><BR><B>Claim Details :</B><BR></H1><TABLE style="FONT-SIZE: 12px; FONT-FAMILY: Century Gothic; MARGIN: 0px auto;"><TBODY><TR><TD style="TEXT-ALIGN: left">EMPLOYEE</TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + ename + '</TD></TR><TR><TD style="TEXT-ALIGN: left">APPLIED DATE</TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + this.datepipe.transform(CreatedDate, 'dd/MM/yyyy HH:mm') + '</TD></TR><TR><TD style="TEXT-ALIGN: left">CLAIM DATE</TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + this.datepipe.transform(TravelDate, 'dd/MM/yyyy HH:mm') + '</TD></TR><TR><TD style="TEXT-ALIGN: left">Superior Name</TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + assignedTo + '</TD></TR><TR><TD style="TEXT-ALIGN: left">Claim Amount</TD><TD>: </TD><TD style="TEXT-ALIGN: left" colSpan=2> RM ' + ClaimAmt + '</TD></TR><TR><TD style="TEXT-ALIGN: left">Status</TD><TD>: </TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + Status + '</TD></TR></TBODY></TABLE><BR><DIV style="TEXT-ALIGN: center; PADDING-TOP: 20px">Thank you.</DIV></DIV></DIV></DIV></BODY></HTML>';
                      }

                      //Body Contents For Applier------------------------
                      let body = {
                        "template": "",
                        "template_id": 0,
                        "to": [
                          {
                            "name": name,
                            "email": email
                          }
                        ],
                        "subject": strSubjectApplier,
                        "body_text": "",
                        // "body_html": '<HTML><HEAD><META name=GENERATOR content="MSHTML 10.00.9200.17606"></HEAD><BODY><DIV style="FONT-FAMILY: Century Gothic"><DIV style="MIN-WIDTH: 500px"><BR><DIV style="PADDING-BOTTOM: 10px; TEXT-ALIGN: center; PADDING-TOP: 10px; PADDING-LEFT: 10px; PADDING-RIGHT: 10px"><IMG style="WIDTH: 130px" alt=zen2.png src="http://zentranet.zen.com.my/_catalogs/masterpage/Layout/images/zen2.png"></DIV><DIV style="MARGIN: 0px 100px; BACKGROUND-COLOR: #ec008c"><DIV style="FONT-SIZE: 30px; COLOR: white; PADDING-BOTTOM: 10px; TEXT-ALIGN: center; PADDING-TOP: 10px; PADDING-LEFT: 20px; PADDING-RIGHT: 20px"><B><I>Notification</I></B></DIV></DIV><BR><DIV style="FONT-SIZE: 12px; TEXT-ALIGN: center; PADDING-TOP: 20px">Dear ' + name + '<BR><BR>Your ' + claimType + ' application has been forwarded to your superior for approval.<H1 style="FONT-SIZE: 14px; TEXT-ALIGN: center; PADDING-TOP: 10px"><BR><B>Claim Details :</B><BR></H1><TABLE style="FONT-SIZE: 12px; FONT-FAMILY: Century Gothic; MARGIN: 0px auto;"><TBODY><TR><TD style="TEXT-ALIGN: left">EMPLOYEE</TD><TD>:</TD><TD colSpan=2> ' + ename + '</TD></TR><TR><TD style="TEXT-ALIGN: left">START DATE</TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + this.datepipe.transform(startDate, 'dd/MM/yyyy HH:mm') + '</TD></TR><TR><TD style="TEXT-ALIGN: left">END DATE </TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + this.datepipe.transform(endDate, 'dd/MM/yyyy HH:mm') + '</TD></TR><TR><TD style="TEXT-ALIGN: left">APPLIED DATE</TD><TD>:</TD><TD colSpan=2> ' + this.datepipe.transform(CreatedDate, 'dd/MM/yyyy HH:mm') + '</TD></TR><TR><TD style="TEXT-ALIGN: left">Superior Name</TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + assignedTo + '</TD></TR><TR><TD style="TEXT-ALIGN: left">Department</TD><TD>: </TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + dept + '</TD></TR></TBODY></TABLE><BR><DIV style="TEXT-ALIGN: center; PADDING-TOP: 20px">Thank you.</DIV></DIV></DIV></DIV></BODY></HTML>',
                        "body_html": strBody_html,
                        "from_name": "eClaim",
                        "from_email": "balasingh73@gmail.com",
                        "reply_to_name": "",
                        "reply_to_email": ""
                      };
                      //Body Contents For Approver-----------------------
                      if (claimType == "Travel Claim" || claimType == "Overtime Claim") {
                        strSubjectApprover = "Pending Your Approval - " + claimType + " application by " + name + " (" + moment(startDate).format('YYYY-MM-DDTHH:mm')  + " - " + moment(endDate).format('YYYY-MM-DDTHH:mm') + ")";
                        strBody_html = '<HTML><HEAD><META name=GENERATOR content="MSHTML 10.00.9200.17606"></HEAD><BODY><DIV style="FONT-FAMILY: Century Gothic"><DIV style="MIN-WIDTH: 500px"><BR><DIV style="PADDING-BOTTOM: 10px; TEXT-ALIGN: center; PADDING-TOP: 10px; PADDING-LEFT: 10px; PADDING-RIGHT: 10px"><IMG style="WIDTH: 130px" alt=zen2.png src="http://zentranet.zen.com.my/_catalogs/masterpage/Layout/images/zen2.png"></DIV><DIV style="MARGIN: 0px 100px; BACKGROUND-COLOR: #ec008c"><DIV style="FONT-SIZE: 30px; COLOR: white; PADDING-BOTTOM: 10px; TEXT-ALIGN: center; PADDING-TOP: 10px; PADDING-LEFT: 20px; PADDING-RIGHT: 20px"><B><I>Notification</I></B></DIV></DIV><BR><DIV style="FONT-SIZE: 12px; TEXT-ALIGN: center; PADDING-TOP: 20px">Dear ' + Approver1_name + '<BR><BR>Your action is required for the below ' + claimType + ' application.<H1 style="FONT-SIZE: 14px; TEXT-ALIGN: center; PADDING-TOP: 10px"><BR><B>Claim Details :</B><BR></H1><TABLE style="FONT-SIZE: 12px; FONT-FAMILY: Century Gothic; MARGIN: 0px auto;"><TBODY><TR><TD style="TEXT-ALIGN: left">EMPLOYEE</TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + ename + '</TD></TR><TR><TD style="TEXT-ALIGN: left">START DATE</TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + moment(startDate).format('YYYY-MM-DDTHH:mm')  + '</TD></TR><TR><TD style="TEXT-ALIGN: left">END DATE </TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + moment(endDate).format('YYYY-MM-DDTHH:mm') + '</TD></TR><TR><TD style="TEXT-ALIGN: left">APPLIED DATE</TD><TD>:</TD><TD colSpan=2> ' + this.datepipe.transform(CreatedDate, 'dd/MM/yyyy HH:mm') + '</TD></TR><TR><TD style="TEXT-ALIGN: left">Superior Name</TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + assignedTo + '</TD></TR><TR><TD style="TEXT-ALIGN: left">Claim Amount</TD><TD>: </TD><TD style="TEXT-ALIGN: left" colSpan=2> RM ' + ClaimAmt + '</TD></TR><TR><TD style="TEXT-ALIGN: left">Status</TD><TD>: </TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + Status + '</TD></TR></TBODY></TABLE><BR><DIV style="TEXT-ALIGN: center; PADDING-TOP: 20px">Thank you.</DIV></DIV></DIV></DIV></BODY></HTML>';
                      }
                      else {
                        strSubjectApprover = "Pending Your Approval - " + claimType + " application by " + name;
                        strBody_html = '<HTML><HEAD><META name=GENERATOR content="MSHTML 10.00.9200.17606"></HEAD><BODY><DIV style="FONT-FAMILY: Century Gothic"><DIV style="MIN-WIDTH: 500px"><BR><DIV style="PADDING-BOTTOM: 10px; TEXT-ALIGN: center; PADDING-TOP: 10px; PADDING-LEFT: 10px; PADDING-RIGHT: 10px"><IMG style="WIDTH: 130px" alt=zen2.png src="http://zentranet.zen.com.my/_catalogs/masterpage/Layout/images/zen2.png"></DIV><DIV style="MARGIN: 0px 100px; BACKGROUND-COLOR: #ec008c"><DIV style="FONT-SIZE: 30px; COLOR: white; PADDING-BOTTOM: 10px; TEXT-ALIGN: center; PADDING-TOP: 10px; PADDING-LEFT: 20px; PADDING-RIGHT: 20px"><B><I>Notification</I></B></DIV></DIV><BR><DIV style="FONT-SIZE: 12px; TEXT-ALIGN: center; PADDING-TOP: 20px">Dear ' + Approver1_name + '<BR><BR>Your action is required for the below ' + claimType + ' application.<H1 style="FONT-SIZE: 14px; TEXT-ALIGN: center; PADDING-TOP: 10px"><BR><B>Claim Details :</B><BR></H1><TABLE style="FONT-SIZE: 12px; FONT-FAMILY: Century Gothic; MARGIN: 0px auto;"><TBODY><TR><TD style="TEXT-ALIGN: left">EMPLOYEE</TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + ename + '</TD></TR><TR><TD style="TEXT-ALIGN: left">APPLIED DATE</TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + this.datepipe.transform(CreatedDate, 'dd/MM/yyyy HH:mm') + '</TD></TR><TR><TD style="TEXT-ALIGN: left">CLAIM DATE</TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + this.datepipe.transform(TravelDate, 'dd/MM/yyyy HH:mm') + '</TD></TR><TR><TD style="TEXT-ALIGN: left">Superior Name</TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + assignedTo + '</TD></TR><TR><TD style="TEXT-ALIGN: left">Claim Amount</TD><TD>: </TD><TD style="TEXT-ALIGN: left" colSpan=2> RM ' + ClaimAmt + '</TD></TR><TR><TD style="TEXT-ALIGN: left">Status</TD><TD>: </TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + Status + '</TD></TR></TBODY></TABLE><BR><DIV style="TEXT-ALIGN: center; PADDING-TOP: 20px">Thank you.</DIV></DIV></DIV></DIV></BODY></HTML>';
                      }
                      let body1 = {
                        "template": "",
                        "template_id": 0,
                        "to": [
                          {
                            "name": Approver1_name,
                            "email": Approver1_email
                          }
                        ],
                        // "subject": "Pending Your Approval - " + claimType + " application by " + name + " (" + this.datepipe.transform(startDate, 'dd/MM/yyyy HH:mm') + " - " + this.datepipe.transform(endDate, 'dd/MM/yyyy HH:mm') + ")",
                        "subject": strSubjectApprover,
                        "body_text": "",
                        // "body_html": '<HTML><HEAD><META name=GENERATOR content="MSHTML 10.00.9200.17606"></HEAD><BODY><DIV style="FONT-FAMILY: Century Gothic"><DIV style="MIN-WIDTH: 500px"><BR><DIV style="PADDING-BOTTOM: 10px; TEXT-ALIGN: center; PADDING-TOP: 10px; PADDING-LEFT: 10px; PADDING-RIGHT: 10px"><IMG style="WIDTH: 130px" alt=zen2.png src="http://zentranet.zen.com.my/_catalogs/masterpage/Layout/images/zen2.png"></DIV><DIV style="MARGIN: 0px 100px; BACKGROUND-COLOR: #ec008c"><DIV style="FONT-SIZE: 30px; COLOR: white; PADDING-BOTTOM: 10px; TEXT-ALIGN: center; PADDING-TOP: 10px; PADDING-LEFT: 20px; PADDING-RIGHT: 20px"><B><I>Notification</I></B></DIV></DIV><BR><DIV style="FONT-SIZE: 12px; TEXT-ALIGN: center; PADDING-TOP: 20px">Dear ' + Approver1_name + '<BR><BR>Your action is required for the below ' + claimType + ' application.<H1 style="FONT-SIZE: 14px; TEXT-ALIGN: center; PADDING-TOP: 10px"><BR><B>Claim Details :</B><BR></H1><TABLE style="FONT-SIZE: 12px; FONT-FAMILY: Century Gothic; MARGIN: 0px auto;"><TBODY><TR><TD style="TEXT-ALIGN: left">EMPLOYEE</TD><TD>:</TD><TD colSpan=2> ' + ename + '</TD></TR><TR><TD style="TEXT-ALIGN: left">START DATE</TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + this.datepipe.transform(startDate, 'dd/MM/yyyy HH:mm') + '</TD></TR><TR><TD style="TEXT-ALIGN: left">END DATE </TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + this.datepipe.transform(endDate, 'dd/MM/yyyy HH:mm') + '</TD></TR><TR><TD style="TEXT-ALIGN: left">APPLIED DATE</TD><TD>:</TD><TD colSpan=2> ' + this.datepipe.transform(CreatedDate, 'dd/MM/yyyy HH:mm') + '</TD></TR><TR><TD style="TEXT-ALIGN: left">Superior Name</TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + assignedTo + '</TD></TR><TR><TD style="TEXT-ALIGN: left">Department</TD><TD>: </TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + dept + '</TD></TR></TBODY></TABLE><BR><DIV style="TEXT-ALIGN: center; PADDING-TOP: 20px">Thank you.</DIV></DIV></DIV></DIV></BODY></HTML>',
                        "body_html": strBody_html,
                        "from_name": "eClaim",
                        "from_email": "balasingh73@gmail.com",
                        "reply_to_name": "",
                        "reply_to_email": ""
                      };
                      //Send Email For Applier---------------------------------------------- 
                      this.http.post(this.emailUrl, body, options)
                        .map(res => res.json())
                        .subscribe(() => {
                          });

                      //Send Email For Approver 1-------------------------------------------
                      this.http.post(this.emailUrl, body1, options)
                        .map(res => res.json())
                        .subscribe(() => {
                          });
                      //---------------------------------------------------------
                    }
                  });
              }
            });
          //-----------------------------------------------------------
        }
      });
    //---------------------------------------------------------------
  }

  EmailNextApprover(CLAIM_REQUEST_GUID: string, ASSIGNED_TO: string, claimStatus: string) {
    let url = constants.DREAMFACTORY_TABLE_URL + '/view_email_approver?filter=CLAIM_REQUEST_GUID=' + CLAIM_REQUEST_GUID + '&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http
      .get(url)
      .map(res => res.json())
      .subscribe(data => {
        let email_details = data["resource"];
        if (email_details.length > 0) {
          let name: string = ''; let email: string = ''; let assignedTo: string = ''; let Direct_Manager: string = '';
          name = email_details[0]["APPLIER_NAME"]; email = email_details[0]["APPLIER_EMAIL"];

          let Approver_name: string; let Approver_email: string
          //Approver_name = email_details[0]["APPROVER_NAME"]; //Approver_email = email_details[0]["APPROVER_EMAIL"];
          Direct_Manager = email_details[0]["DIRECT_MANAGER"];

          let ename = email_details[0]["APPLIER_NAME"];
          let ClaimAmt = this.numberPipe.transform(email_details[0]["CLAIM_AMOUNT"], '1.2-2');

          let Status = email_details[0]["STATUS"];
          if (claimStatus === 'Rejected') {
            Status = claimStatus;
          }
          let Role_Name = email_details[0]["ROLE_NAME"];

          //Here get the approver name and emailid----------------------------------
          let url_approver: string = constants.DREAMFACTORY_TABLE_URL + '/view_user_email?filter=USER_GUID=' + ASSIGNED_TO + '&api_key=' + constants.DREAMFACTORY_API_KEY;;
          this.http
            .get(url_approver)
            .map(res => res.json())
            .subscribe(data => {
              let approver_details = data["resource"];
              if (approver_details.length > 0) {
                Approver_name = approver_details[0]["FULLNAME"];                
                assignedTo = approver_details[0]["FULLNAME"];
                Approver_email = approver_details[0]["EMAIL"];
                
                let startDate: any = ""; let endDate: any = "";
                let CreatedDate: string = ""; let TravelDate: string = "";
                startDate = email_details[0]["START_DATE"];
                endDate = email_details[0]["END_DATE"];
                CreatedDate = email_details[0]["APPLIED_DATE"];
                TravelDate = email_details[0]["TRAVEL_DATE"];                

                // console.log(moment(startDate).format('YYYY-MM-DDTHH:mm'));
                // console.log(this.datepipe.transform(startDate, 'dd/MM/yyyy HH:mm'));
            
                var queryHeaders = new Headers();
                queryHeaders.append('Content-Type', 'application/json');
                queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
                queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
                let options = new RequestOptions({ headers: queryHeaders });
                let claimType: string = ""; claimType = email_details[0]["CLAIM_TYPE"];
                let strSubjectApplier: string = ""; let strSubjectApprover: string; let strBody_html: string;
                
                if (claimType == "Travel Claim" || claimType == "Overtime Claim") {
                  strSubjectApplier = "Your " + claimType + " application (" + moment(startDate).format('YYYY-MM-DDTHH:mm')  + " - " + moment(endDate).format('YYYY-MM-DDTHH:mm') + ") has been forwarded for " + localStorage.getItem("g_ROLE_NAME") + " approval.";
                  strBody_html = '<HTML><HEAD><META name=GENERATOR content="MSHTML 10.00.9200.17606"></HEAD><BODY><DIV style="FONT-FAMILY: Century Gothic"><DIV style="MIN-WIDTH: 500px"><BR><DIV style="PADDING-BOTTOM: 10px; TEXT-ALIGN: center; PADDING-TOP: 10px; PADDING-LEFT: 10px; PADDING-RIGHT: 10px"><IMG style="WIDTH: 130px" alt=zen2.png src="http://zentranet.zen.com.my/_catalogs/masterpage/Layout/images/zen2.png"></DIV><DIV style="MARGIN: 0px 100px; BACKGROUND-COLOR: #ec008c"><DIV style="FONT-SIZE: 30px; COLOR: white; PADDING-BOTTOM: 10px; TEXT-ALIGN: center; PADDING-TOP: 10px; PADDING-LEFT: 20px; PADDING-RIGHT: 20px"><B><I>Notification</I></B></DIV></DIV><BR><DIV style="FONT-SIZE: 12px; TEXT-ALIGN: center; PADDING-TOP: 20px">Dear ' + name + '<BR><BR>Your ' + claimType + ' application has been forwarded to ' + Role_Name + ' for approval.<H1 style="FONT-SIZE: 14px; TEXT-ALIGN: center; PADDING-TOP: 10px"><BR><B>Claim Details :</B><BR></H1><TABLE style="FONT-SIZE: 12px; FONT-FAMILY: Century Gothic; MARGIN: 0px auto;"><TBODY><TR><TD style="TEXT-ALIGN: left">EMPLOYEE</TD><TD>:</TD><TD colSpan=2> ' + ename + '</TD></TR><TR><TD style="TEXT-ALIGN: left">START DATE</TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + moment(startDate).format('YYYY-MM-DDTHH:mm')  + '</TD></TR><TR><TD style="TEXT-ALIGN: left">END DATE </TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + moment(endDate).format('YYYY-MM-DDTHH:mm') + '</TD></TR><TR><TD style="TEXT-ALIGN: left">Superior Name</TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + assignedTo + '</TD></TR><TR><TD style="TEXT-ALIGN: left">Claim Amount</TD><TD>: </TD><TD style="TEXT-ALIGN: left" colSpan=2> RM ' + ClaimAmt + '</TD></TR><TR><TD style="TEXT-ALIGN: left">Status</TD><TD>: </TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + Status + '</TD></TR></TBODY></TABLE><BR><DIV style="TEXT-ALIGN: center; PADDING-TOP: 20px">Thank you.</DIV></DIV></DIV></DIV></BODY></HTML>';
                }
                else {
                  strSubjectApplier = "Your " + claimType + " application has been forwarded for " + Role_Name + " approval.";
                  strBody_html = '<HTML><HEAD><META name=GENERATOR content="MSHTML 10.00.9200.17606"></HEAD><BODY><DIV style="FONT-FAMILY: Century Gothic"><DIV style="MIN-WIDTH: 500px"><BR><DIV style="PADDING-BOTTOM: 10px; TEXT-ALIGN: center; PADDING-TOP: 10px; PADDING-LEFT: 10px; PADDING-RIGHT: 10px"><IMG style="WIDTH: 130px" alt=zen2.png src="http://zentranet.zen.com.my/_catalogs/masterpage/Layout/images/zen2.png"></DIV><DIV style="MARGIN: 0px 100px; BACKGROUND-COLOR: #ec008c"><DIV style="FONT-SIZE: 30px; COLOR: white; PADDING-BOTTOM: 10px; TEXT-ALIGN: center; PADDING-TOP: 10px; PADDING-LEFT: 20px; PADDING-RIGHT: 20px"><B><I>Notification</I></B></DIV></DIV><BR><DIV style="FONT-SIZE: 12px; TEXT-ALIGN: center; PADDING-TOP: 20px">Dear ' + name + '<BR><BR>Your ' + claimType + ' application has been forwarded to ' + Role_Name + ' for approval.<H1 style="FONT-SIZE: 14px; TEXT-ALIGN: center; PADDING-TOP: 10px"><BR><B>Claim Details :</B><BR></H1><TABLE style="FONT-SIZE: 12px; FONT-FAMILY: Century Gothic; MARGIN: 0px auto;"><TBODY><TR><TD style="TEXT-ALIGN: left">EMPLOYEE</TD><TD>:</TD><TD colSpan=2> ' + ename + '</TD></TR><TR><TD style="TEXT-ALIGN: left">APPLIED DATE</TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + this.datepipe.transform(CreatedDate, 'dd/MM/yyyy HH:mm') + '</TD></TR><TR><TD style="TEXT-ALIGN: left">CLAIM DATE</TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + this.datepipe.transform(TravelDate, 'dd/MM/yyyy HH:mm') + '</TD></TR><TR><TD style="TEXT-ALIGN: left">Superior Name</TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + assignedTo + '</TD></TR><TR><TD style="TEXT-ALIGN: left">Claim Amount</TD><TD>: </TD><TD style="TEXT-ALIGN: left" colSpan=2> RM ' + ClaimAmt + '</TD></TR><TR><TD style="TEXT-ALIGN: left">Status</TD><TD>: </TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + Status + '</TD></TR></TBODY></TABLE><BR><DIV style="TEXT-ALIGN: center; PADDING-TOP: 20px">Thank you.</DIV></DIV></DIV></DIV></BODY></HTML>';
                }

                //Body Contents For Applier------------------------
                let body = {
                  "template": "",
                  "template_id": 0,
                  "to": [
                    {
                      "name": name,
                      "email": email
                    }
                  ],
                  "subject": strSubjectApplier,
                  "body_text": "",
                  // "body_html": '<HTML><HEAD><META name=GENERATOR content="MSHTML 10.00.9200.17606"></HEAD><BODY><DIV style="FONT-FAMILY: Century Gothic"><DIV style="MIN-WIDTH: 500px"><BR><DIV style="PADDING-BOTTOM: 10px; TEXT-ALIGN: center; PADDING-TOP: 10px; PADDING-LEFT: 10px; PADDING-RIGHT: 10px"><IMG style="WIDTH: 130px" alt=zen2.png src="http://zentranet.zen.com.my/_catalogs/masterpage/Layout/images/zen2.png"></DIV><DIV style="MARGIN: 0px 100px; BACKGROUND-COLOR: #ec008c"><DIV style="FONT-SIZE: 30px; COLOR: white; PADDING-BOTTOM: 10px; TEXT-ALIGN: center; PADDING-TOP: 10px; PADDING-LEFT: 20px; PADDING-RIGHT: 20px"><B><I>Notification</I></B></DIV></DIV><BR><DIV style="FONT-SIZE: 12px; TEXT-ALIGN: center; PADDING-TOP: 20px">Dear ' + name + '<BR><BR>Your ' + claimType + ' application has been forwarded to your superior for approval.<H1 style="FONT-SIZE: 14px; TEXT-ALIGN: center; PADDING-TOP: 10px"><BR><B>Claim Details :</B><BR></H1><TABLE style="FONT-SIZE: 12px; FONT-FAMILY: Century Gothic; MARGIN: 0px auto;"><TBODY><TR><TD style="TEXT-ALIGN: left">EMPLOYEE</TD><TD>:</TD><TD colSpan=2> ' + ename + '</TD></TR><TR><TD style="TEXT-ALIGN: left">START DATE</TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + this.datepipe.transform(startDate, 'dd/MM/yyyy HH:mm') + '</TD></TR><TR><TD style="TEXT-ALIGN: left">END DATE </TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + this.datepipe.transform(endDate, 'dd/MM/yyyy HH:mm') + '</TD></TR><TR><TD style="TEXT-ALIGN: left">APPLIED DATE</TD><TD>:</TD><TD colSpan=2> ' + this.datepipe.transform(CreatedDate, 'dd/MM/yyyy HH:mm') + '</TD></TR><TR><TD style="TEXT-ALIGN: left">Superior Name</TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + assignedTo + '</TD></TR><TR><TD style="TEXT-ALIGN: left">Department</TD><TD>: </TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + dept + '</TD></TR></TBODY></TABLE><BR><DIV style="TEXT-ALIGN: center; PADDING-TOP: 20px">Thank you.</DIV></DIV></DIV></DIV></BODY></HTML>',
                  "body_html": strBody_html,
                  "from_name": "eClaim",
                  "from_email": "balasingh73@gmail.com",
                  "reply_to_name": "",
                  "reply_to_email": ""
                };
                let mailInitial;
                if (claimStatus === 'Rejected') {                                  
                  mailInitial = 'You have Rejected the below '+ claimType + ' application.'
                }
                else{
                  mailInitial = 'Your action is required for the below ' + claimType + ' application.'
                }

                //Body Contents For Approver-----------------------                
                if (claimType == "Travel Claim" || claimType == "Overtime Claim") {
                  strSubjectApprover = "Pending Your Approval - " + claimType + " application by " + name + " (" + moment(startDate).format('YYYY-MM-DDTHH:mm')  + " - " + moment(endDate).format('YYYY-MM-DDTHH:mm') + ")";
                  // strBody_html = '<HTML><HEAD><META name=GENERATOR content="MSHTML 10.00.9200.17606"></HEAD><BODY><DIV style="FONT-FAMILY: Century Gothic"><DIV style="MIN-WIDTH: 500px"><BR><DIV style="PADDING-BOTTOM: 10px; TEXT-ALIGN: center; PADDING-TOP: 10px; PADDING-LEFT: 10px; PADDING-RIGHT: 10px"><IMG style="WIDTH: 130px" alt=zen2.png src="http://zentranet.zen.com.my/_catalogs/masterpage/Layout/images/zen2.png"></DIV><DIV style="MARGIN: 0px 100px; BACKGROUND-COLOR: #ec008c"><DIV style="FONT-SIZE: 30px; COLOR: white; PADDING-BOTTOM: 10px; TEXT-ALIGN: center; PADDING-TOP: 10px; PADDING-LEFT: 20px; PADDING-RIGHT: 20px"><B><I>Notification</I></B></DIV></DIV><BR><DIV style="FONT-SIZE: 12px; TEXT-ALIGN: center; PADDING-TOP: 20px">Dear ' + Approver_name + '<BR><BR>'+mailInitial+'<H1 style="FONT-SIZE: 14px; TEXT-ALIGN: center; PADDING-TOP: 10px"><BR><B>Claim Details :</B><BR></H1><TABLE style="FONT-SIZE: 12px; FONT-FAMILY: Century Gothic; MARGIN: 0px auto;"><TBODY><TR><TD style="TEXT-ALIGN: left">EMPLOYEE</TD><TD>:</TD><TD colSpan=2> ' + ename + '</TD></TR><TR><TD style="TEXT-ALIGN: left">START DATE</TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + moment(startDate).format('YYYY-MM-DDTHH:mm')  + '</TD></TR><TR><TD style="TEXT-ALIGN: left">END DATE </TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + moment(endDate).format('YYYY-MM-DDTHH:mm') + '</TD></TR><TR><TD style="TEXT-ALIGN: left">APPLIED DATE</TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + this.datepipe.transform(CreatedDate, 'dd/MM/yyyy HH:mm') + '</TD></TR><TR><TD style="TEXT-ALIGN: left">Superior Name</TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + assignedTo + '</TD></TR><TR><TD style="TEXT-ALIGN: left">Claim Amount</TD><TD>: </TD><TD style="TEXT-ALIGN: left" colSpan=2> RM ' + ClaimAmt + '</TD></TR><TR><TD style="TEXT-ALIGN: left">Status</TD><TD>: </TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + Status + '</TD></TR></TBODY></TABLE><BR><DIV style="TEXT-ALIGN: center; PADDING-TOP: 20px">Thank you.</DIV></DIV></DIV></DIV></BODY></HTML>';
                  strBody_html = '<HTML><HEAD><META name=GENERATOR content="MSHTML 10.00.9200.17606"></HEAD><BODY><DIV style="FONT-FAMILY: Century Gothic"><DIV style="MIN-WIDTH: 500px"><BR><DIV style="PADDING-BOTTOM: 10px; TEXT-ALIGN: center; PADDING-TOP: 10px; PADDING-LEFT: 10px; PADDING-RIGHT: 10px"><IMG style="WIDTH: 130px" alt=zen2.png src="http://zentranet.zen.com.my/_catalogs/masterpage/Layout/images/zen2.png"></DIV><DIV style="MARGIN: 0px 100px; BACKGROUND-COLOR: #ec008c"><DIV style="FONT-SIZE: 30px; COLOR: white; PADDING-BOTTOM: 10px; TEXT-ALIGN: center; PADDING-TOP: 10px; PADDING-LEFT: 20px; PADDING-RIGHT: 20px"><B><I>Notification</I></B></DIV></DIV><BR><DIV style="FONT-SIZE: 12px; TEXT-ALIGN: center; PADDING-TOP: 20px">Dear ' + Approver_name + '<BR><BR>'+mailInitial+'<H1 style="FONT-SIZE: 14px; TEXT-ALIGN: center; PADDING-TOP: 10px"><BR><B>Claim Details :</B><BR></H1><TABLE style="FONT-SIZE: 12px; FONT-FAMILY: Century Gothic; MARGIN: 0px auto;"><TBODY><TR><TD style="TEXT-ALIGN: left">EMPLOYEE</TD><TD>:</TD><TD colSpan=2> ' + ename + '</TD></TR><TR><TD style="TEXT-ALIGN: left">START DATE</TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + moment(startDate).format('YYYY-MM-DDTHH:mm')  + '</TD></TR><TR><TD style="TEXT-ALIGN: left">END DATE </TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + moment(endDate).format('YYYY-MM-DDTHH:mm') + '</TD></TR><TR><TD style="TEXT-ALIGN: left">APPLIED DATE</TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + this.datepipe.transform(CreatedDate, 'dd/MM/yyyy HH:mm') + '</TD></TR><TR><TD style="TEXT-ALIGN: left">Superior Name</TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + Direct_Manager + '</TD></TR><TR><TD style="TEXT-ALIGN: left">Claim Amount</TD><TD>: </TD><TD style="TEXT-ALIGN: left" colSpan=2> RM ' + ClaimAmt + '</TD></TR><TR><TD style="TEXT-ALIGN: left">Status</TD><TD>: </TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + Status + '</TD></TR></TBODY></TABLE><BR><DIV style="TEXT-ALIGN: center; PADDING-TOP: 20px">Thank you.</DIV></DIV></DIV></DIV></BODY></HTML>';
                }
                else {
                  strSubjectApprover = "Pending Your Approval - " + claimType + " application by " + name;
                  // strBody_html = '<HTML><HEAD><META name=GENERATOR content="MSHTML 10.00.9200.17606"></HEAD><BODY><DIV style="FONT-FAMILY: Century Gothic"><DIV style="MIN-WIDTH: 500px"><BR><DIV style="PADDING-BOTTOM: 10px; TEXT-ALIGN: center; PADDING-TOP: 10px; PADDING-LEFT: 10px; PADDING-RIGHT: 10px"><IMG style="WIDTH: 130px" alt=zen2.png src="http://zentranet.zen.com.my/_catalogs/masterpage/Layout/images/zen2.png"></DIV><DIV style="MARGIN: 0px 100px; BACKGROUND-COLOR: #ec008c"><DIV style="FONT-SIZE: 30px; COLOR: white; PADDING-BOTTOM: 10px; TEXT-ALIGN: center; PADDING-TOP: 10px; PADDING-LEFT: 20px; PADDING-RIGHT: 20px"><B><I>Notification</I></B></DIV></DIV><BR><DIV style="FONT-SIZE: 12px; TEXT-ALIGN: center; PADDING-TOP: 20px">Dear ' + Approver_name + '<BR><BR>'+mailInitial+'<H1 style="FONT-SIZE: 14px; TEXT-ALIGN: center; PADDING-TOP: 10px"><BR><B>Claim Details :</B><BR></H1><TABLE style="FONT-SIZE: 12px; FONT-FAMILY: Century Gothic; MARGIN: 0px auto;"><TBODY><TR><TD style="TEXT-ALIGN: left">EMPLOYEE</TD><TD>:</TD><TD colSpan=2> ' + ename + '</TD></TR><TR><TD style="TEXT-ALIGN: left">APPLIED DATE</TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + this.datepipe.transform(CreatedDate, 'dd/MM/yyyy HH:mm') + '</TD></TR><TR><TD style="TEXT-ALIGN: left">CLAIM DATE</TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + this.datepipe.transform(TravelDate, 'dd/MM/yyyy HH:mm') + '</TD><TR><TD style="TEXT-ALIGN: left">Superior Name</TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + assignedTo + '</TD></TR><TR><TD style="TEXT-ALIGN: left">Claim Amount</TD><TD>: </TD><TD style="TEXT-ALIGN: left" colSpan=2> RM ' + ClaimAmt + '</TD></TR><TR><TD style="TEXT-ALIGN: left">Status</TD><TD>: </TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + Status + '</TD></TR></TBODY></TABLE><BR><DIV style="TEXT-ALIGN: center; PADDING-TOP: 20px">Thank you.</DIV></DIV></DIV></DIV></BODY></HTML>';
                  strBody_html = '<HTML><HEAD><META name=GENERATOR content="MSHTML 10.00.9200.17606"></HEAD><BODY><DIV style="FONT-FAMILY: Century Gothic"><DIV style="MIN-WIDTH: 500px"><BR><DIV style="PADDING-BOTTOM: 10px; TEXT-ALIGN: center; PADDING-TOP: 10px; PADDING-LEFT: 10px; PADDING-RIGHT: 10px"><IMG style="WIDTH: 130px" alt=zen2.png src="http://zentranet.zen.com.my/_catalogs/masterpage/Layout/images/zen2.png"></DIV><DIV style="MARGIN: 0px 100px; BACKGROUND-COLOR: #ec008c"><DIV style="FONT-SIZE: 30px; COLOR: white; PADDING-BOTTOM: 10px; TEXT-ALIGN: center; PADDING-TOP: 10px; PADDING-LEFT: 20px; PADDING-RIGHT: 20px"><B><I>Notification</I></B></DIV></DIV><BR><DIV style="FONT-SIZE: 12px; TEXT-ALIGN: center; PADDING-TOP: 20px">Dear ' + Approver_name + '<BR><BR>'+mailInitial+'<H1 style="FONT-SIZE: 14px; TEXT-ALIGN: center; PADDING-TOP: 10px"><BR><B>Claim Details :</B><BR></H1><TABLE style="FONT-SIZE: 12px; FONT-FAMILY: Century Gothic; MARGIN: 0px auto;"><TBODY><TR><TD style="TEXT-ALIGN: left">EMPLOYEE</TD><TD>:</TD><TD colSpan=2> ' + ename + '</TD></TR><TR><TD style="TEXT-ALIGN: left">APPLIED DATE</TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + this.datepipe.transform(CreatedDate, 'dd/MM/yyyy HH:mm') + '</TD></TR><TR><TD style="TEXT-ALIGN: left">CLAIM DATE</TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + this.datepipe.transform(TravelDate, 'dd/MM/yyyy HH:mm') + '</TD><TR><TD style="TEXT-ALIGN: left">Superior Name</TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + Direct_Manager + '</TD></TR><TR><TD style="TEXT-ALIGN: left">Claim Amount</TD><TD>: </TD><TD style="TEXT-ALIGN: left" colSpan=2> RM ' + ClaimAmt + '</TD></TR><TR><TD style="TEXT-ALIGN: left">Status</TD><TD>: </TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + Status + '</TD></TR></TBODY></TABLE><BR><DIV style="TEXT-ALIGN: center; PADDING-TOP: 20px">Thank you.</DIV></DIV></DIV></DIV></BODY></HTML>';
                }
                let body1 = {
                  "template": "",
                  "template_id": 0,
                  "to": [
                    {
                      "name": Approver_name,
                      "email": Approver_email
                    }
                  ],
                  // "subject": "Pending Your Approval - " + claimType + " application by " + name + " (" + this.datepipe.transform(startDate, 'dd/MM/yyyy HH:mm') + " - " + this.datepipe.transform(endDate, 'dd/MM/yyyy HH:mm') + ")",
                  "subject": strSubjectApprover,
                  "body_text": "",
                  // "body_html": '<HTML><HEAD><META name=GENERATOR content="MSHTML 10.00.9200.17606"></HEAD><BODY><DIV style="FONT-FAMILY: Century Gothic"><DIV style="MIN-WIDTH: 500px"><BR><DIV style="PADDING-BOTTOM: 10px; TEXT-ALIGN: center; PADDING-TOP: 10px; PADDING-LEFT: 10px; PADDING-RIGHT: 10px"><IMG style="WIDTH: 130px" alt=zen2.png src="http://zentranet.zen.com.my/_catalogs/masterpage/Layout/images/zen2.png"></DIV><DIV style="MARGIN: 0px 100px; BACKGROUND-COLOR: #ec008c"><DIV style="FONT-SIZE: 30px; COLOR: white; PADDING-BOTTOM: 10px; TEXT-ALIGN: center; PADDING-TOP: 10px; PADDING-LEFT: 20px; PADDING-RIGHT: 20px"><B><I>Notification</I></B></DIV></DIV><BR><DIV style="FONT-SIZE: 12px; TEXT-ALIGN: center; PADDING-TOP: 20px">Dear ' + Approver_name + '<BR><BR>Your action is required for the below ' + claimType + ' application.<H1 style="FONT-SIZE: 14px; TEXT-ALIGN: center; PADDING-TOP: 10px"><BR><B>Claim Details :</B><BR></H1><TABLE style="FONT-SIZE: 12px; FONT-FAMILY: Century Gothic; MARGIN: 0px auto;"><TBODY><TR><TD style="TEXT-ALIGN: left">EMPLOYEE</TD><TD>:</TD><TD colSpan=2> ' + ename + '</TD></TR><TR><TD style="TEXT-ALIGN: left">START DATE</TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + this.datepipe.transform(startDate, 'dd/MM/yyyy HH:mm') + '</TD></TR><TR><TD style="TEXT-ALIGN: left">END DATE </TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + this.datepipe.transform(endDate, 'dd/MM/yyyy HH:mm') + '</TD></TR><TR><TD style="TEXT-ALIGN: left">APPLIED DATE</TD><TD>:</TD><TD colSpan=2> ' + this.datepipe.transform(CreatedDate, 'dd/MM/yyyy HH:mm') + '</TD></TR><TR><TD style="TEXT-ALIGN: left">Superior Name</TD><TD>:</TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + assignedTo + '</TD></TR><TR><TD style="TEXT-ALIGN: left">Department</TD><TD>: </TD><TD style="TEXT-ALIGN: left" colSpan=2> ' + dept + '</TD></TR></TBODY></TABLE><BR><DIV style="TEXT-ALIGN: center; PADDING-TOP: 20px">Thank you.</DIV></DIV></DIV></DIV></BODY></HTML>',
                  "body_html": strBody_html,
                  "from_name": "eClaim",
                  "from_email": "balasingh73@gmail.com",
                  "reply_to_name": "",
                  "reply_to_email": ""
                };
                //Send Email For Applier---------------------------------------------- 
                this.http.post(this.emailUrl, body, options)
                  .map(res => res.json())
                  .subscribe(() => {
                    });

                //Send Email For Approver 1-------------------------------------------
                this.http.post(this.emailUrl, body1, options)
                  .map(res => res.json())
                  .subscribe(() => {
                    });
                //---------------------------------------------------------
              }
            });
        }
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

  deleteUrl(table: string, id: string) {
    return constants.DREAMFACTORY_TABLE_URL + '/' + table + '/' + id;
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
    return this.http.patch(this.getUrl('main_claim_request'), claim_main.toJson(true), options)
      .map((response) => {
        return response;
      });
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

  updateApiModel(endPoint: string, modelJSONData: any, isClaim: boolean) {   
    let modelJSON = modelJSONData["resource"][0];
    var queryHeaders = new Headers();
    queryHeaders.append('Content-Type', 'application/json');
    queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
    let options = new RequestOptions({ headers: queryHeaders });
    return this.http.patch(this.postUrl(endPoint), modelJSONData, options)
      .map((response) => {
        if (isClaim && modelJSON.STATUS != 'Draft')        
        // this.sendEmail(modelJSON.CLAIM_TYPE_GUID, modelJSON.START_TS, modelJSON.END_TS, modelJSON.CREATION_TS, modelJSON.TRAVEL_DATE, modelJSON.CLAIM_REQUEST_GUID);
        return response;
      });
  }

  deleteApiModel(endPoint: string, args: string) {
    var queryHeaders = new Headers();
    queryHeaders.append('Content-Type', 'application/json');
    queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
    let options = new RequestOptions({ headers: queryHeaders });
    console.log(this.deleteUrl(endPoint, args));
    return this.http.delete(this.deleteUrl(endPoint, args), options)
      .map((response) => {
        return response;
      });
  }


  getClaimRequestByClaimReqGUID(claimReqGUID: string): Observable<MainClaimRequestModel[]> {
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
    return new Promise((resolve) => {
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

}
