import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ApiManagerProvider } from '../../../providers/api-manager.provider';
import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { PrintclaimPage } from '../../claim-forms/printclaim/printclaim';
import { ProfileManagerProvider } from '../../../providers/profile-manager.provider';
import { Services } from '../../Services';
import { TranslateService } from '@ngx-translate/core';
import { getResultantStatus } from '../claim-status';

@IonicPage()
@Component({
  selector: 'page-print-claim-view',
  templateUrl: 'print-claim-view.html',
})
export class PrintClaimViewPage {
  totalClaimAmount: number = 0;
  remarks: any;
  claimRequestData: any[];
  Remarks_NgModel: any;
  ToggleNgModel: any;
  claimRequestGUID: any;
  Approver_GUID: any;
  isApprover: any;
  currency = localStorage.getItem("cs_default_currency")

  level: any;
  isRemarksAccepted: boolean = false;
  // approverDesignation: any;
  isActionTaken: boolean = false;

  constructor(public profileMngProvider: ProfileManagerProvider, public api: ApiManagerProvider, public api1: Services, public http: Http, public translate: TranslateService, public navCtrl: NavController, public navParams: NavParams) {
    this.isApprover = this.navParams.get("isApprover");
    this.claimRequestGUID = this.navParams.get("cr_GUID");
    this.Approver_GUID = this.navParams.get("approver_GUID");
    this.level = navParams.get('level_no');
    // this.approverDesignation = this.navParams.get("approverDesignation");

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

  isImage: boolean = false;
  LoadMainClaim() {
    this.api.getApiModel('view_claim_request', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID).subscribe(res => {
      this.claimRequestData = res['resource'];
      this.claimRequestData.forEach(element => {
        // element.TRAVEL_DATE = new Date(element.TRAVEL_DATE.replace(/-/g, "/"))
        this.travelDate = element.TRAVEL_DATE = new Date(element.TRAVEL_DATE.replace(/-/g, "/"))
        element.CREATION_TS = new Date(element.CREATION_TS.replace(/-/g, "/"));
        element.STATUS = getResultantStatus(element);
        if (element.ATTACHMENT_ID !== null) {
          this.imageURL = this.api.getImageUrl(element.ATTACHMENT_ID);
        }
        this.totalClaimAmount = element.MILEAGE_AMOUNT;
        this.remarks = element.REMARKS;
      });
    })
  }

  EditClaim() {
    this.navCtrl.push(PrintclaimPage, {
      isFormEdit: 'true',
      cr_GUID: this.claimRequestGUID
    });
  }

  displayImage: any
  CloseDisplayImage() {
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
