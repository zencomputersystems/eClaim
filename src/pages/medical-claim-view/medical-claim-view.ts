import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import { Services } from '../Services';
import {MedicalclaimPage} from '../medicalclaim/medicalclaim';
import { ApiManagerProvider } from '../../providers/api-manager.provider';
import { ProfileManagerProvider } from '../../providers/profile-manager.provider';

@IonicPage()
@Component({
  selector: 'page-medical-claim-view',
  templateUrl: 'medical-claim-view.html',
})
export class MedicalClaimViewPage {

  totalClaimAmount:number=0;
  claimRequestData: any[];
  Remarks_NgModel: any;
  claimRequestGUID: any;
  ToggleNgModel: any;
  Approver_GUID: any;

  isRemarksAccepted: boolean =false;
  level: any;

  constructor(public profileMngProvider: ProfileManagerProvider, public api: ApiManagerProvider, public api1: Services, public http: Http, platform: Platform, public translate: TranslateService, public navCtrl: NavController, public navParams: NavParams) {
    this.translateToEnglish();
    this.translate.setDefaultLang('en'); //Fallback language

    platform.ready().then(() => {
    }); 
    this.claimRequestGUID = this.navParams.get("cr_GUID");
    this.Approver_GUID = this.navParams.get("approver_GUID");
    //this.userGUID = localStorage.getItem('g_USER_GUID');
    this.level = navParams.get('level_no');

    this.LoadMainClaim();
  }

  isAccepted(val:string) {   
    this.isRemarksAccepted = val==='Accepted'?true:false;
    alert('Claim '+val)
  }

  LoadMainClaim() {
    this.api.getApiModel('view_claim_request', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID).subscribe(res => {
      this.claimRequestData = res['resource'];
      this.claimRequestData.forEach(element => {
        this.totalClaimAmount = element.MILEAGE_AMOUNT;
      });
    })
}

SubmitAction() {
  if (!this.isRemarksAccepted) {
    if (this.Remarks_NgModel === undefined) {
      alert('Please input valid Remarks');
      return;
    }
  }
  this.profileMngProvider.ProcessProfileMng(this.Remarks_NgModel, this.Approver_GUID, this.level, this.claimRequestGUID, this.isRemarksAccepted,1);
}

EditClaim() {
  this.navCtrl.push(MedicalclaimPage, {
    isFormEdit: 'true',
    cr_GUID: this.claimRequestGUID
  });
}


  // isAccepted(event: any) {
  //   if (event.checked) {
  //     this.ToggleNgModel = true
  //   }
  // }

  // emailUrl: string = 'http://api.zen.com.my/api/v2/emailnotificationtest?api_key=' + constants.DREAMFACTORY_API_KEY;
  // sendEmail() {
  //   let name: string; let email: string
  //   name = 'shabbeer'; email = 'shabbeer@zen.com.my'
  //   var queryHeaders = new Headers();
  //   queryHeaders.append('Content-Type', 'application/json');
  //   queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
  //   queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
  //   let options = new RequestOptions({ headers: queryHeaders });

  //   let body = {
  //     "template": "",
  //     "template_id": 0,
  //     "to": [
  //       {
  //         "name": name,
  //         "email": email
  //       }
  //     ],
  //     "cc": [
  //       {
  //         "name": name,
  //         "email": email
  //       }
  //     ],
  //     "bcc": [
  //       {
  //         "name": name,
  //         "email": email
  //       }
  //     ],
  //     "subject": "Test",
  //     "body_text": "",
  //     "body_html": '<HTML><HEAD> <META name=GENERATOR content="MSHTML 10.00.9200.17606"></HEAD> <BODY> <DIV style="FONT-FAMILY: Century Gothic"> <DIV style="MIN-WIDTH: 500px"><BR> <DIV style="PADDING-BOTTOM: 10px; TEXT-ALIGN: center; PADDING-TOP: 10px; PADDING-LEFT: 10px; PADDING-RIGHT: 10px"><IMG style="WIDTH: 130px" alt=zen2.png src="http://zentranet.zen.com.my/_catalogs/masterpage/Layout/images/zen2.png"></DIV> <DIV style="MARGIN: 0px 100px; BACKGROUND-COLOR: #ec008c"> <DIV style="FONT-SIZE: 30px; COLOR: white; PADDING-BOTTOM: 10px; TEXT-ALIGN: center; PADDING-TOP: 10px; PADDING-LEFT: 20px; PADDING-RIGHT: 20px"><B><I>Notification</I></B></DIV></DIV><BR> <DIV style="FONT-SIZE: 12px; TEXT-ALIGN: center; PADDING-TOP: 20px">Dear [%Variable: @Employee%]<BR><BR>Your&nbsp;[%Variable: @LeaveType%] application has been forwarded to your superior for approval.  <H1 style="FONT-SIZE: 14px; TEXT-ALIGN: center; PADDING-TOP: 10px"><BR><B>Leave Details :</B><BR></H1> <TABLE style="FONT-SIZE: 12px; FONT-FAMILY: Century Gothic; MARGIN: 0px auto"> <TBODY> <TR> <TD style="TEXT-ALIGN: left">EMPLOYEE</TD> <TD style="PADDING-BOTTOM: 6px; PADDING-TOP: 6px; PADDING-LEFT: 6px; PADDING-RIGHT: 6px">:</TD> <TD colSpan=2>[%Variable: @Employee%]</TD></TR> <TR> <TD>START DATE</TD> <TD>:</TD> <TD style="TEXT-ALIGN: left" colSpan=2>[%Variable: @StartDate%]</TD></TR> <TR> <TD style="TEXT-ALIGN: left">END DATE </TD> <TD>:</TD> <TD style="TEXT-ALIGN: left" colSpan=2>[%Variable: @EndDate%]</TD></TR> <TR> <TD style="TEXT-ALIGN: left">APPLIED DATE</TD> <TD style="PADDING-BOTTOM: 6px; PADDING-TOP: 6px; PADDING-LEFT: 6px; PADDING-RIGHT: 6px">:</TD> <TD colSpan=2>[%Variable: @AppliedDate%]</TD></TR> <TR> <TD style="TEXT-ALIGN: left">DAYS</TD> <TD>:</TD> <TD style="TEXT-ALIGN: left">[%Variable: @NoOfDays%] </TD> <TD style="TEXT-ALIGN: left">[%Variable: @HalfDay%]</TD></TR></TR> <TR> <TD>LEAVE TYPE</TD> <TD>:</TD> <TD style="TEXT-ALIGN: left" colSpan=2>[%Variable: @LeaveType%]</TD></TR> <TR> <TD style="TEXT-ALIG: left">REASON</TD> <TD>: </TD> <TD style="TEXT-ALIGN: left" colSpan=2>[%Current Item:Reason%]</TD></TR></TBODY></TABLE><BR> <DIV style="TEXT-ALIGN: center; PADDING-TOP: 20px">Thank you.</DIV></DIV></DIV></DIV></BODY></HTML>',
  //     "from_name": "Ajay DAV",
  //     "from_email": "ajay1591ani@gmail.com",
  //     "reply_to_name": "",
  //     "reply_to_email": ""
  //   };
  //   this.http.post(this.emailUrl, body, options)
  //     .map(res => res.json())
  //     .subscribe(data => {
  //       // this.result= data["resource"];
  //       alert(JSON.stringify(data));
  //     });
  // }

  // SubmitAction() {
  //   if (this.ToggleNgModel) {
  //     // || this.Remarks_NgModel.toString().length < 25
  //     let claimHistoryRef: ClaimWorkFlowHistory_Model = new ClaimWorkFlowHistory_Model();
  //     claimHistoryRef.CLAIM_WFH_GUID = UUID.UUID();
  //     claimHistoryRef.CLAIM_REQUEST_GUID = this.claimRequestGUID;
  //     claimHistoryRef.REMARKS = this.Remarks_NgModel;
  //     claimHistoryRef.STATUS = 'Pending';
  //     claimHistoryRef.USER_GUID = this.Approver_GUID;
  //     console.table(claimHistoryRef);     
  //     this.api.postData('claim_work_flow_history', claimHistoryRef.toJson(true)).subscribe((response) => {
  //       var postClaimMain = response.json();
  //       this.sendEmail();
  //       // this.ClaimRequestMain = postClaimMain["resource"][0].CLAIM_REQUEST_GUID;
  //       // this.MainClaimSaved = true;
  //       alert('History Saved.')
  //     })

  //   }
  //   else {
  //     if (this.Remarks_NgModel === undefined) {
  //       alert('Please input valid Remarks');
  //     }
  //     let claimHistoryRef: ClaimWorkFlowHistory_Model = new ClaimWorkFlowHistory_Model();
  //     claimHistoryRef.CLAIM_WFH_GUID = UUID.UUID();
  //     claimHistoryRef.CLAIM_REQUEST_GUID = this.claimRequestGUID;
  //     claimHistoryRef.REMARKS = this.Remarks_NgModel;
  //     claimHistoryRef.STATUS = 'Pending';
  //     claimHistoryRef.USER_GUID = this.Approver_GUID;
  //     console.table(claimHistoryRef)
  //     this.api.postData('claim_work_flow_history', claimHistoryRef.toJson(true)).subscribe((response) => {
  //       var postClaimMain = response.json();
  //       this.sendEmail();
  //       // this.ClaimRequestMain = postClaimMain["resource"][0].CLAIM_REQUEST_GUID;
  //       // this.MainClaimSaved = true;
  //       alert('History Saved.')
  //     })
  //   }
  // }

  // LoadMainClaim() {    
  //   console.log(Services.getUrl('view_claim_request', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID))
  //   this.http
  //     .get(Services.getUrl('view_claim_request', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID))
  //     .map(res => res.json())
  //     .subscribe(data => {
  //       this.claimRequestData = data["resource"];
  //       this.claimRequestData.forEach(element => {
  //         this.totalClaimAmount = element.MILEAGE_AMOUNT;
  //         console.log(this.totalClaimAmount)
  //       }); 
  //       //this.totalClaimAmount += this.tollParkAmount ;
  //     }
  //     );
  // }

  // EditClaim() {
  //   // this.navCtrl.push(TravelclaimPage, {
  //     // this.navCtrl.push(EntertainmentclaimPage, {
  //       this.navCtrl.push(MedicalclaimPage, {
  //     isFormEdit: 'true',
  //     //cr_GUID: '2253e352-2c87-81fa-8cba-a4fddf0189f3'
  //     cr_GUID: this.claimRequestGUID
  //   });
  // }

   //---------------------Language module start---------------------//
   public translateToMalayClicked: boolean = false;
   public translateToEnglishClicked: boolean = true;
 
   public translateToEnglish() {
     this.translate.use('en');
     this.translateToMalayClicked = !this.translateToMalayClicked;
     this.translateToEnglishClicked = !this.translateToEnglishClicked;
   }
 
   public translateToMalay() {
     this.translate.use('ms');
     this.translateToEnglishClicked = !this.translateToEnglishClicked;
     this.translateToMalayClicked = !this.translateToMalayClicked;
   }
   //---------------------Language module end---------------------//

  //  profileJSON: any; profileLevel: any; assignedTo: any; stage: any; userGUID: any; level: any;
  //  readProfile() {
  //    return this.http.get('assets/profile.json').map((response) => response.json()).subscribe(data => {
  //      this.profileJSON = JSON.stringify(data);
  //      // console.log(data)
  //      let levels: any[] = data.profile.levels.level
  //      levels.forEach(element => {
  //        if (element['-id'] == this.level) {
  //          this.profileLevel = this.level;
  //          if (element['approver']['-directManager'] === '1') {
 
  //            this.http
  //              .get(Services.getUrl('user_info', 'filter=USER_GUID=' + this.userGUID))
  //              .map(res => res.json())
  //              .subscribe(data => {
  //                let userInfo: any[] = data["resource"]
  //                userInfo.forEach(userElm => {
  //                  this.assignedTo = userElm.MANAGER_USER_GUID
 
  //                  this.http
  //                    .get(Services.getUrl('user_info', 'filter=USER_GUID=' + userElm.MANAGER_USER_GUID))
  //                    .map(res => res.json())
  //                    .subscribe(data => {
  //                      let userInfo: any[] = data["resource"]
  //                      userInfo.forEach(approverElm => {
  //                        this.stage = approverElm.DEPT_GUID
  //                      });
  //                    });
 
  //                });
  //              });
  //            // console.log('Direct Manager ' + element['approver']['-directManager'])
  //            let varf:any[] =  element['conditions']['condition']
  //            varf.forEach(condElement => {
  //              if (condElement['-status'] === 'approved') {
  //                console.log('Next Level ' + condElement['nextlevel']['#text'])
  //              }
  //              console.log('Status ' + condElement['-status'])
  //            });
  //          }
           
  //        }
 
 
  //      });
  //    });
  //  }

}
