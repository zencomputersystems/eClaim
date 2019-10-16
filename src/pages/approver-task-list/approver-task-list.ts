import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
// import { BaseHttpService } from '../../services/base-http';
import { Checkbox } from 'ionic-angular/components/checkbox/checkbox';

@IonicPage()
@Component({
  selector: 'page-approver-task-list',
  templateUrl: 'approver-task-list.html',
})
export class ApproverTaskListPage {
  baseResourceUrl: string;
  claimrequestdetails: any[];
  selectAll: boolean;
  claimrefguid: any;
  claimRequestGUID: string;
  level: string;
  currency = localStorage.getItem("cs_default_currency");


  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) {
    //this.claimrefguid = '243b6b02-ff10-6ad4-3907-4d3ee899644f'
   // this.claimrefguid = '7f595e19-3e20-b9ee-8505-a86215278eb1'
    // this.claimrefguid = 'c9623104-ac0c-e811-0fbf-eb9864ec263c'
    // this.claimrefguid = 'd9a3c051-e674-7c5b-81c4-dd9cd2f89b26'
    //this.claimrefguid = 'fdadf529-5277-28ef-8298-b176c38d9ebb'
    // this.claimrefguid = 'eb341cca-cf4d-8b69-d66a-b5d01e06a77b'
    // this.claimrefguid = '12fa8f8a-f8b7-82f2-5efb-1dcc39f21391'
    //this.claimrefguid = 'e60dee1f-0460-5f14-c74f-9bbfc04e6877'       
    //this.claimrefguid ='8254ea7a-e64f-a2f5-4d4c-7225de2d3559'   
    
    
    
     //this.claimrefguid =navParams.get("claimRefGuid");
    if (this.claimrefguid != 'null') {
      this.baseResourceUrl = constants.DREAMFACTORY_TABLE_URL + '/vw_claimrequestlist?filter=(CLAIM_REF_GUID=' + this.claimrefguid + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    else {
      this.baseResourceUrl = constants.DREAMFACTORY_TABLE_URL + '/vw_claimrequestlist?filter=(ASSIGNED_TO=' + localStorage.getItem("g_USER_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.claimrequestdetails = data["resource"]; 
        this.claimrequestdetails.forEach(element => {
          element.TRAVEL_DATE = new Date(element.TRAVEL_DATE.replace(/-/g, "/"))
        });
        console.table(this.claimrequestdetails);      
      });
  }

  checkAllCheckBoxes(event: Checkbox) {
    if (event.checked) { this.selectAll = true; }
    else {
      this.selectAll = false;
    }


  }

  getCheckboxValue() {
    // console.log(event);
    // alert(event.id);
    // alert(event.checked);
    // alert(claimRequestGuid);
  }

  // viewClaim(claimRequestGUID: string,level:number) {
  //   console.log(claimRequestGUID)
  //   //this.navCtrl.push(TravelClaimViewPage, {
  //      this.navCtrl.push(EntertainmentClaimViewPage, {
  //        //this.navCtrl.push(MedicalClaimViewPage, {
  //          //this.navCtrl.push(OvertimeClaimViewPage, {
  //            //this.navCtrl.push(PrintClaimViewPage, {
  //              //this.navCtrl.push(GiftClaimViewPage, {
  //     cr_GUID: claimRequestGUID,
  //     level_no: level,
  //     approver_GUID : localStorage.getItem('g_USER_GUID')
  //   });
  // }

  viewClaim(claimRequestGUID: string, level: any, claimType: any) {
    this.claimRequestGUID = claimRequestGUID;
    this.level = level;

    switch (claimType) {
      case '2d8d7c80-c9ae-9736-b256-4d592e7b7887': this.pushPage('GiftClaimViewPage'); break;
      case '37067b3d-1bf4-33a3-2b60-3ca40baf589a': this.pushPage('OvertimeClaimViewPage'); break;
      case '40dbaf56-98e4-77b9-df95-85ec232ff714': this.pushPage('MedicalClaimViewPage'); break;
      case '58c59b56-289e-31a2-f708-138e81a9c823': this.pushPage('TravelClaimViewPage'); break;
      case 'd9567482-033a-6d92-3246-f33043155746': this.pushPage('PrintClaimViewPage'); break;
      case 'f3217ecc-19d7-903a-6c56-78fdbd7bbcf1': this.pushPage('EntertainmentClaimViewPage'); break;
    }

  }

  pushPage(claimType: any) {
    this.navCtrl.push(claimType, {
      cr_GUID: this.claimRequestGUID,
      level_no: this.level,
      approver_GUID: localStorage.getItem('g_USER_GUID')
    });
  }

  approveClaims() {
  }

}
