import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,ModalController } from 'ionic-angular';
import { Services } from '../Services';
import { TranslateService } from '@ngx-translate/core';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { BaseHttpService } from '../../services/base-http';

import { TravelClaimViewPage } from '../../pages/travel-claim-view/travel-claim-view.component';
import { EntertainmentClaimViewPage } from '../../pages/entertainment-claim-view/entertainment-claim-view';
import { OvertimeClaimViewPage } from '../../pages/overtime-claim-view/overtime-claim-view';
import { PrintClaimViewPage } from '../../pages/print-claim-view/print-claim-view';
import { GiftClaimViewPage } from '../../pages/gift-claim-view/gift-claim-view';
import { MiscellaneousClaimViewPage } from '../../pages/miscellaneous-claim-view/miscellaneous-claim-view';

import { EntertainmentclaimPage } from '../../pages/entertainmentclaim/entertainmentclaim';
import { TravelclaimPage } from '../../pages/travel-claim/travel-claim.component';
import { PrintclaimPage } from '../../pages/printclaim/printclaim';
import { GiftclaimPage } from '../../pages/giftclaim/giftclaim';
import { OvertimeclaimPage } from '../../pages/overtimeclaim/overtimeclaim';
import { MiscellaneousClaimPage } from '../../pages/miscellaneous-claim/miscellaneous-claim';

import { ApiManagerProvider } from '../../providers/api-manager.provider';


/**
 * Generated class for the UserclaimslistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-userclaimslist',
  templateUrl: 'userclaimslist.html', providers: [BaseHttpService]
})
export class UserclaimslistPage {
  userClaimhistorydetails: any[]; 
  userClaimhistorydetails1: any[]; 

  userdetails: any; 
  //claimrefguid:any;
  //userguid:any;
  //month:any;
  baseResourceUrl: string;
  baseResourceUrl1: string;
  searchboxValue: string;

  
  constructor( private api: ApiManagerProvider,public navCtrl: NavController, public navParams: NavParams,public http: Http, private httpService: BaseHttpService,private alertCtrl: AlertController) {
  //  this.claimrefguid=navParams.get("claimRefGuid");
  //  this.userguid=navParams.get("userGuid");
  //  this.month=navParams.get("Month");
   //alert(this.userguid);
    this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimrequestlist?filter=(USER_GUID='+localStorage.getItem("g_USER_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.baseResourceUrl1 = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_getuserdetails?filter=(USER_GUID='+localStorage.getItem("g_USER_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    console.log(this.baseResourceUrl);
   this.BindData();
    this.getuserDetails();
  }

BindData()
{
  this.http
  .get(this.baseResourceUrl)
  .map(res => res.json())
  .subscribe(data => {
    this.userClaimhistorydetails= data["resource"];
    this.userClaimhistorydetails1=this.userClaimhistorydetails;
    console.log(this.userClaimhistorydetails);
  });
}

  onSearchInput(ev: any) {  
    // alert('hi')
          let val = this.searchboxValue;
          if (val && val.trim() != '') {
           this.userClaimhistorydetails = this.userClaimhistorydetails1.filter((item) => {
        let claimtype:number;
        let status:number;
        let stage:number;
        let amount:number;
        let date:number;
            // console.log(item);
             if(item.CLAIM_TYPE!=null)
             {claimtype=item.CLAIMTYPE.toLowerCase().indexOf(val.toLowerCase())}
             if(item.TRAVEL_DATE!=null)
             {date=item.TRAVEL_DATE.toString().toLowerCase().indexOf(val.toLowerCase())}
             if(item.STATUS!=null)
             {status=item.STATUS.toString().toLowerCase().indexOf(val.toLowerCase())}
             if(item.STAGE!=null)
             {stage=item.STAGE.toString().toLowerCase().indexOf(val.toLowerCase())}
             if(item.CLAIM_AMOUNT!=null)
             {amount=item.CLAIM_AMOUNT.toString().toLowerCase().indexOf(val.toLowerCase()) }
             return (
               (claimtype > -1) 
             || (date > -1) 
             || (status > -1) 
             || ( stage> -1)
             || (amount> -1) 
           );
           })
         }
         else
         {
this.userClaimhistorydetails=this.userClaimhistorydetails1;
         }
   }

  getuserDetails(){
    this.http
    .get(this.baseResourceUrl1)
    .map(res => res.json())
    .subscribe(data => {
      //alert(JSON.stringify(data));
      this.userdetails= data["resource"];
      //alert(this.userdetails);
    });
  };

  claimRequestGUID: string; level: string;

  ClaimNavigation(claimRequestGUID: string, level:string, claimType:any, navType:number) {
    this.claimRequestGUID = claimRequestGUID;
    this.level = level;

    switch (claimType) {
      case '2d8d7c80-c9ae-9736-b256-4d592e7b7887': if (navType === 1) this.pushPage(GiftClaimViewPage); else this.editPage(GiftclaimPage); break;
      case '37067b3d-1bf4-33a3-2b60-3ca40baf589a': if (navType === 1) this.pushPage(OvertimeClaimViewPage); else this.editPage(OvertimeclaimPage); break;
      case '84b3cee2-9f9d-ccb9-89a1-1e70cef19f86': if (navType === 1) this.pushPage(MiscellaneousClaimViewPage); else this.editPage(MiscellaneousClaimPage); break;

      case '58c59b56-289e-31a2-f708-138e81a9c823': if (navType === 1) this.pushPage(TravelClaimViewPage); else this.editPage(TravelclaimPage); break;
      case 'd9567482-033a-6d92-3246-f33043155746': if (navType === 1) this.pushPage(PrintClaimViewPage); else this.editPage(PrintclaimPage); break;
      case 'f3217ecc-19d7-903a-6c56-78fdbd7bbcf1': if (navType === 1) this.pushPage(EntertainmentClaimViewPage); else this.editPage(EntertainmentclaimPage); break;
    }
  }

  pushPage(claimType:any) {
    this.navCtrl.push(claimType, {
      isApprover: false,
      cr_GUID: this.claimRequestGUID,
      level_no: this.level,
      approver_GUID: localStorage.getItem('g_USER_GUID')
    });
  }

  editPage(claimType:any) {
    this.navCtrl.push(claimType, {
      isFormEdit: 'true',
      cr_GUID: this.claimRequestGUID
    });
  }
  DeleteClaimRequest(claimReqGuid:any,claimTypeGuid:any)
  {
   // var deleteflag=false;
       let alert1 = this.alertCtrl.create({
        title: 'Confirm delete claim',
        message: 'Are you sure you want to delete this claim?',
        buttons: [
            {
                text: 'No',
                handler: () => {
                    return
                }
            },
            {
                text: 'Yes',
                handler: () => {
                  this.api.deleteApiModel('main_claim_request',claimReqGuid).subscribe(res =>{
                    this.BindData();
                    alert('Claim has been deleted successfully.')
                   // deleteflag=true;
                  });
                }
            }
        ]
    })
    alert1.present();
    // if(deleteflag)
    // { }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserclaimslistPage');
  }

}
