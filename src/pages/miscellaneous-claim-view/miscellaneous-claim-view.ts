import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiManagerProvider } from '../../providers/api-manager.provider';
import { ProfileManagerProvider } from '../../providers/profile-manager.provider';
import { MiscellaneousClaimPage } from '../../pages/miscellaneous-claim/miscellaneous-claim';


@IonicPage()
@Component({
  selector: 'page-miscellaneous-claim-view',
  templateUrl: 'miscellaneous-claim-view.html',
})
export class MiscellaneousClaimViewPage {
  claimRequestData: any[];
  totalClaimAmount: number = 0;
  Approver_GUID: any; level: any;
  claimRequestGUID: any;
  ToggleNgModel: any;
  Remarks_NgModel: any;
  isRemarksAccepted: any;
  isApprover: any;

  constructor(public profileMngProvider: ProfileManagerProvider, public api: ApiManagerProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.isApprover = this.navParams.get("isApprover");
    this.claimRequestGUID = this.navParams.get("cr_GUID");
    this.Approver_GUID = this.navParams.get("approver_GUID");
    this.level = navParams.get('level_no');
    this.LoadMainClaim();

    // this.api.LoadMainClaim(this.claimRequestGUID).then((totalAmount: number) => {
    //   this.totalClaimAmount = totalAmount;
    // })
  }

  // isAccepted(event: any) {
  //   this.ToggleNgModel = event.checked;
  //   this.isRemarksAccepted = event.checked;
  // }

  // isAccepted(val:string) {   
  //   this.isRemarksAccepted = val==='Accepted'?true:false;
  //   alert('Claim '+val)
  // }

  isAccepted(val: string) {
    this.isRemarksAccepted = val === 'accepted' ? true : false;
    if (!this.isRemarksAccepted) {
          if (this.Remarks_NgModel === undefined) {
            alert('Please enter valid remarks');
            return;
          }
        }
        this.profileMngProvider.ProcessProfileMng(this.Remarks_NgModel, this.Approver_GUID, this.level, this.claimRequestGUID, this.isRemarksAccepted);
     
  }
  

  LoadMainClaim() {
    this.api.getApiModel('view_claim_request', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID).subscribe(res => {
      this.claimRequestData = res['resource'];
      this.claimRequestData.forEach(element => {
        if (element.ATTACHMENT_ID !== null)
        element.ATTACHMENT_ID = this.api.getImageUrl(element.ATTACHMENT_ID);
        this.totalClaimAmount = element.MILEAGE_AMOUNT;
      });
    })
}  

  // SubmitAction() {
  //   if (!this.isRemarksAccepted) {
  //     if (this.Remarks_NgModel === undefined) {
  //       alert('Please input valid Remarks');
  //       return;
  //     }
  //   }
  //   this.profileMngProvider.ProcessProfileMng(this.Remarks_NgModel, this.Approver_GUID, this.level, this.claimRequestGUID, this.isRemarksAccepted);
  // }

  EditClaim() {
    this.navCtrl.push(MiscellaneousClaimPage, {
      isFormEdit: 'true',
      cr_GUID: this.claimRequestGUID
    });
  }
 
}
