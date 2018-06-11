import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from 'ionic-angular';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Services } from '../Services';
import * as constants from '../../config/constants';
import { ClaimWorkFlowHistoryModel } from '../../models/claim-work-flow-history.model';
import {TravelclaimPage} from '../../pages/travel-claim/travel-claim.component';
import { UUID } from 'angular2-uuid';
import { ApiManagerProvider } from '../../providers/api-manager.provider';
import { ProfileManagerProvider } from '../../providers/profile-manager.provider';

@IonicPage()
@Component({
  selector: 'page-travel-claim-view',
  templateUrl: 'travel-claim-view.html',
})
export class TravelClaimViewPage {
  totalClaimAmount:number=0;
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
  // totalAmount: number = 0;

  constructor(public profileMngProvider: ProfileManagerProvider, public api: ApiManagerProvider, public api1: Services, public http: Http, platform: Platform, public translate: TranslateService, public navCtrl: NavController, public navParams: NavParams) {
    this.isApprover = this.navParams.get("isApprover");
    this.claimRequestGUID = this.navParams.get("cr_GUID");
    this.Approver_GUID = this.navParams.get("approver_GUID");
    this.level = this.navParams.get('level_no');    
    this.LoadMainClaim();
  }

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
      let claimResult = this.LoadClaimDetails();
      claimResult.then((tollorParkAmount: number) => {
        this.api.getApiModel('view_claim_request', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID).subscribe(res => {
          this.claimRequestData = res['resource'];
          this.claimRequestData.forEach(element => {
            if (element.ATTACHMENT_ID !== null)
              element.ATTACHMENT_ID = this.api.getImageUrl(element.ATTACHMENT_ID);
            this.totalClaimAmount = element.MILEAGE_AMOUNT;
          });
          this.totalClaimAmount += tollorParkAmount;
        })
      })
    }
  // LoadMainClaim() {
  //   this.LoadClaimDetails();
  //   console.log(Services.getUrl('view_claim_request', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID))
  //   this.http
  //     .get(Services.getUrl('view_claim_request', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID))
  //     .map(res => res.json())
  //     .subscribe(data => {
  //       this.claimRequestData = data["resource"];
  //       this.claimRequestData.forEach(element => {
  //         element.ATTACHMENT_ID = this.api.getImageUrl(element.ATTACHMENT_ID);
  //         this.totalClaimAmount = element.MILEAGE_AMOUNT + element.Allowance;
  //         console.log(this.totalClaimAmount)
  //       }); 
  //       this.totalClaimAmount += this.tollParkAmount ;
  //     }
  //     );
  // }

  LoadClaimDetails() {
    return new Promise((resolve, reject) => {
      this.api.getApiModel('view_claim_details', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID).subscribe(res => {
        this.claimDetailsData = res['resource'];
        this.claimDetailsData.forEach(element => {
          if (element.ATTACHMENT_ID !== null)
          element.ATTACHMENT_ID = this.api.getImageUrl(element.ATTACHMENT_ID);
          this.tollParkAmount += element.AMOUNT;
        });
        resolve(this.tollParkAmount);
      })
    });
  }

  // LoadClaimDetails() {
  //   this.http
  //     .get(Services.getUrl('view_claim_details', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID))
  //     .map(res => res.json())
  //     .subscribe(data => {
  //       this.claimDetailsData = data["resource"];

  //   this.claimDetailsData.forEach(element => {
  //     if (element.ATTACHMENT_ID !== null)
  //         element.ATTACHMENT_ID = this.api.getImageUrl(element.ATTACHMENT_ID);
  //     this.tollParkAmount += element.AMOUNT;
  //   }); 
  //       });
  // }

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

  imageURL: string;
  DisplayImage(val: any) {
    this.displayImage = true;
    this.imageURL = val;
  }
}
