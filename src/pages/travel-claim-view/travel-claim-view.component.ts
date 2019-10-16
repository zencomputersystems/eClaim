import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Http } from '@angular/http';
import { Services } from '../Services';
import { TravelclaimPage } from '../travel-claim/travel-claim.component';
import { ApiManagerProvider } from '../../providers/api-manager.provider';
import { ProfileManagerProvider } from '../../providers/profile-manager.provider';
import * as Settings from '../../dbSettings/companySettings'; 


@IonicPage()
@Component({
  selector: 'page-travel-claim-view',
  templateUrl: 'travel-claim-view.html',
})
export class TravelClaimViewPage {
 // totalClaimAmount: number = 0;
  remarks: any;
  claimRequestData: any[];
  claimDetailsData: any[];
  tollParkLookupClicked = false;
  tollParkAmount: number = 0;
  claimRequestGUID: any;
  Remarks_NgModel: any;
  ToggleNgModel: any; Approver_GUID: any;
  isApprover: any;
  isRemarksAccepted: boolean = false;
  level: any;
  // approverDesignation: any;
  // totalAmount: number = 0;
  isActionTaken: boolean = false;
  currency = localStorage.getItem("cs_default_currency")

  constructor(public profileMngProvider: ProfileManagerProvider, public api: ApiManagerProvider, public api1: Services, public http: Http, public translate: TranslateService, public navCtrl: NavController, public navParams: NavParams) {
    this.isApprover = this.navParams.get("isApprover");
    this.claimRequestGUID = this.navParams.get("cr_GUID");
    this.Approver_GUID = this.navParams.get("approver_GUID");
    this.level = this.navParams.get('level_no');
    this.LoadMainClaim();
    // this.approverDesignation = this.navParams.get("approverDesignation");
  }
  

  travelDate: any;
  isAccepted(val: string) {
    this.isActionTaken = true;
    this.isRemarksAccepted = val === 'accepted' ? true : false;
    if (this.claimRequestGUID !== undefined || this.claimRequestGUID !== null) {
      this.api.getApiModel('claim_work_flow_history', 'filter=(CLAIM_REQUEST_GUID=' + this.claimRequestGUID + ')AND(STATUS="Rejected")')
        .subscribe(data => {
          if (data["resource"].length <= 0)
            if (this.api.isClaimExpired(this.travelDate, true)) { return; }
          if (!this.isRemarksAccepted) {
            if (this.Remarks_NgModel === undefined) {
              alert('Please enter valid remarks');
              this.isActionTaken = false;
              return;
            }
          }
          this.profileMngProvider.ProcessProfileMng(this.Remarks_NgModel, this.Approver_GUID, this.level, this.claimRequestGUID, this.isRemarksAccepted, 1);
        })
    } }

    updateCheckbox() {
      console.log('checkbox:' + this.checkbox_ngModel);
    }

  checkbox: any;
  checkbox_ngModel: boolean = false;
  imageURL: any;
  isImage: boolean = false;
  TravelType: any;
  LoadMainClaim() {
    let claimResult = this.LoadClaimDetails();
    claimResult.then((tollorParkAmount: number) => {
      this.api.getApiModel('view_claim_request', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID).subscribe(res => {
        this.claimRequestData = res['resource'];
        this.claimRequestData.forEach(element => {
        this.checkbox_ngModel = element.ROUND_TRIP === 1?true: false;
          // element.START_TS = new Date(element.START_TS.replace(/-/g, "/"))
          this.travelDate = element.START_TS = new Date(element.START_TS.replace(/-/g, "/"))
          element.CREATION_TS = new Date(element.CREATION_TS.replace(/-/g, "/"))
          element.END_TS = new Date(element.END_TS.replace(/-/g, "/"))

          if (element.PROFILE_LEVEL == Settings.ProfileLevels.ONE && element.STATUS == Settings.StatusConstants.PENDING)
          element.STATUS = Settings.StatusConstants.PENDINGSUPERIOR
          else if (element.PROFILE_LEVEL == Settings.ProfileLevels.TWO && element.STATUS == Settings.StatusConstants.PENDING)
          element.STATUS = Settings.StatusConstants.PENDINGFINANCEVALIDATION
          else if (element.PROFILE_LEVEL == Settings.ProfileLevels.THREE && element.STATUS == Settings.StatusConstants.APPROVED)
          element.STATUS = Settings.StatusConstants.PENDINGPAYMENT
          else if (element.PROFILE_LEVEL == Settings.ProfileLevels.ZERO && element.PREVIOUS_LEVEL == Settings.ProfileLevels.ONE && element.STATUS == Settings.StatusConstants.REJECTED)
          element.STATUS = Settings.StatusConstants.SUPERIORREJECTED
          else if (element.PROFILE_LEVEL == Settings.ProfileLevels.ZERO && element.PREVIOUS_LEVEL == Settings.ProfileLevels.TWO && element.STATUS == Settings.StatusConstants.REJECTED)
          element.STATUS = Settings.StatusConstants.FINANCEREJECTED
          else if (element.PROFILE_LEVEL == Settings.ProfileLevels.ZERO && element.PREVIOUS_LEVEL == Settings.ProfileLevels.THREE && element.STATUS == Settings.StatusConstants.REJECTED)
          element.STATUS = Settings.StatusConstants.PAYMENTREJECTED 

          if (element.ATTACHMENT_ID !== null) {
            this.imageURL = this.api.getImageUrl(element.ATTACHMENT_ID);
          }
          this.TravelType = element.TRAVEL_TYPE === '0' ? 'Local' : 'Outstation';
         // this.totalClaimAmount = element.CLAIM_AMOUNT;
          this.remarks = element.REMARKS;
        });
        //  this.totalClaimAmount += tollorParkAmount;
      })
    })   
  }

  LoadClaimDetails() {
    return new Promise((resolve) => {
      this.api.getApiModel('view_claim_details', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID).subscribe(res => {
        this.claimDetailsData = res['resource'];
        this.claimDetailsData.forEach(element => {
          if (element.ATTACHMENT_ID !== null) {
            element.ATTACHMENT_ID = this.api.getImageUrl(element.ATTACHMENT_ID);
          }
          this.tollParkAmount += element.AMOUNT;
        });
        resolve(this.tollParkAmount);
      })
    });
  }

  EditClaim() {
    this.navCtrl.push(TravelclaimPage, {
      isFormEdit: 'true',
      cr_GUID: this.claimRequestGUID
    });
  }

  CloseTollParkLookup() {
    this.tollParkLookupClicked = false;
  }

  TollParkLookup() {
    this.tollParkLookupClicked = true;
    this.LoadClaimDetails();
    this.tollParkAmount = 0;
  }

  displayImage: any
  CloseDisplayImage() {
    this.displayImage = false;
  }

  // imageURL: string;
  // DisplayImage(val: any) {
  //   this.displayImage = true;
  //   this.imageURL = val;
  //   if (val !== null) { 
  //     this.imageURL = this.api.getImageUrl(val); 
  //     this.displayImage = true; 
  //     this.isImage = this.api.isFileImage(val); 
  //   }
  // }


  isImageUrl: boolean = true;
  CheckAttachment() {
    this.isImageUrl = true;
  }
}
