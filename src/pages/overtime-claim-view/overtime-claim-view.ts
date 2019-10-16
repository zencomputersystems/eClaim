import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Http } from '@angular/http';
import { Services } from '../Services';
import {OvertimeclaimPage} from '../overtimeclaim/overtimeclaim';
import { ApiManagerProvider } from '../../providers/api-manager.provider';
import { ProfileManagerProvider } from '../../providers/profile-manager.provider';
import * as Settings from '../../dbSettings/companySettings'; 


@IonicPage()
@Component({
  selector: 'page-overtime-claim-view',
  templateUrl: 'overtime-claim-view.html',
})
export class OvertimeClaimViewPage {

  totalClaimAmount:number=0;
  remarks: any;
  claimRequestData: any[];
  Approver_GUID: any;
  claimRequestGUID: any;
  ToggleNgModel: any;
  Remarks_NgModel: any;
  isApprover: any;
  currency = localStorage.getItem("cs_default_currency")

  isRemarksAccepted: boolean =false;
  level: any;
  approverDesignation: any;
  isActionTaken: boolean = false;

  constructor(public profileMngProvider: ProfileManagerProvider, public api: ApiManagerProvider, public api1: Services, public http: Http, public translate: TranslateService, public navCtrl: NavController, public navParams: NavParams) {    
    this.isApprover = this.navParams.get("isApprover");
    this.claimRequestGUID = this.navParams.get("cr_GUID");
    this.Approver_GUID = this.navParams.get("approver_GUID");
    this.level = navParams.get('level_no');
    this.approverDesignation = this.navParams.get("approverDesignation");
    this.LoadMainClaim();
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
    } 
  }

  LoadMainClaim() {
    this.api.getApiModel('view_claim_request', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID).subscribe(res => {
      this.claimRequestData = res['resource'];
      this.claimRequestData.forEach(element => {
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

        if (element.ATTACHMENT_ID !== null)
        element.ATTACHMENT_ID = this.api.getImageUrl(element.ATTACHMENT_ID);
        this.totalClaimAmount = element.MILEAGE_AMOUNT;
        this.remarks = element.REMARKS;
      });
    })
}

  EditClaim() {
    this.navCtrl.push(OvertimeclaimPage, {
      isFormEdit: 'true',
      cr_GUID: this.claimRequestGUID
    });
  }  
}
