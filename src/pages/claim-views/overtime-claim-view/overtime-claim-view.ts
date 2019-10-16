import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ApiManagerProvider } from '../../../providers/api-manager.provider';
import { Component } from '@angular/core';
import { OvertimeclaimPage } from '../../claim-forms/overtimeclaim/overtimeclaim';
import { ProfileManagerProvider } from '../../../providers/profile-manager.provider';
import { TranslateService } from '@ngx-translate/core';
import { getResultantStatus } from '../claim-status';

@IonicPage()
@Component({
  selector: 'page-overtime-claim-view',
  templateUrl: 'overtime-claim-view.html',
})
export class OvertimeClaimViewPage {

  totalClaimAmount: number = 0;
  remarks: any;
  claimRequestData: any[];
  Approver_GUID: any;
  claimRequestGUID: any;
  ToggleNgModel: any;
  Remarks_NgModel: any;
  isApprover: any;
  currency = localStorage.getItem("cs_default_currency")

  isRemarksAccepted: boolean = false;
  level: any;
  approverDesignation: any;
  isActionTaken: boolean = false;

  constructor(public profileMngProvider: ProfileManagerProvider, public api: ApiManagerProvider, public translate: TranslateService, public navCtrl: NavController, public navParams: NavParams) {
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
    if (this.claimRequestGUID) {
      this.api.getApiModel('claim_work_flow_history', 'filter=(CLAIM_REQUEST_GUID=' + this.claimRequestGUID + ')AND(STATUS="Rejected")')
        .subscribe(data => {
          if (data["resource"].length <= 0)
            if (this.api.isClaimExpired(this.travelDate, true)) { return; }
          if (!this.isRemarksAccepted) {
            if (!this.Remarks_NgModel) {
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
        element.END_TS = new Date(element.END_TS.replace(/-/g, "/"));
        element.STATUS = getResultantStatus(element);
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
