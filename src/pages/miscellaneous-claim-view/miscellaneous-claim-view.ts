import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiManagerProvider } from '../../providers/api-manager.provider';
import { ProfileManagerProvider } from '../../providers/profile-manager.provider';
import { MiscellaneousClaimPage } from '../miscellaneous-claim/miscellaneous-claim';
import * as Settings from '../../dbSettings/companySettings'; 



@IonicPage()
@Component({
  selector: 'page-miscellaneous-claim-view',
  templateUrl: 'miscellaneous-claim-view.html',
})
export class MiscellaneousClaimViewPage {
  claimRequestData: any[];
  totalClaimAmount: number = 0;
  remarks: any;
  Approver_GUID: any; level: any;
  claimRequestGUID: any;
  ToggleNgModel: any;
  Remarks_NgModel: any;
  isRemarksAccepted: any;
  isApprover: any;
  // approverDesignation: any;
  isActionTaken: boolean = false;
  currency = localStorage.getItem("cs_default_currency")

  constructor(public profileMngProvider: ProfileManagerProvider, public api: ApiManagerProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.isApprover = this.navParams.get("isApprover");
    this.claimRequestGUID = this.navParams.get("cr_GUID");
    this.Approver_GUID = this.navParams.get("approver_GUID");
    this.level = navParams.get('level_no');
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
    }  }
  
  stringToSplit: string = "";
  tempUserSplit1: string = "";
  tempUserSplit2: string = "";
  tempUserSplit3: string = "";
  isImage: boolean = false;
  LoadMainClaim() {
    this.api.getApiModel('view_claim_request', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID).subscribe(res => {
      this.claimRequestData = res['resource'];
      this.claimRequestData.forEach(element => { 
        if (element.ATTACHMENT_ID !== null) { 
          this.imageURL = this.api.getImageUrl(element.ATTACHMENT_ID); 
      }    
      // element.TRAVEL_DATE = new Date(element.TRAVEL_DATE.replace(/-/g, "/"))
      this.travelDate = element.TRAVEL_DATE = new Date(element.TRAVEL_DATE.replace(/-/g, "/"))
      element.CREATION_TS = new Date(element.CREATION_TS.replace(/-/g, "/"))

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
   
        this.totalClaimAmount = element.MILEAGE_AMOUNT;
        this.remarks = element.REMARKS;
      });
    })
}  

  EditClaim() {
    this.navCtrl.push(MiscellaneousClaimPage, {
      isFormEdit: 'true',
      cr_GUID: this.claimRequestGUID
    });
  }

  displayImage: any
  CloseDisplayImage()  {
    this.displayImage = false;
  }
  imageURL: string;
  // DisplayImage(val: any) {
  //   this.displayImage = true;
  //   this.imageURL = val;
  //   if (val !== null) { 
  //     this.imageURL = this.api.getImageUrl(val); 
  //     this.displayImage = true; 
  //     this.isImage = this.api.isFileImage(val); 
  //   }
  // }
 
}
