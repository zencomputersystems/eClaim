import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,ModalController } from 'ionic-angular';
import { Services } from '../Services';
import { TranslateService } from '@ngx-translate/core';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { BaseHttpService } from '../../services/base-http';
//import { ClaimHistory_Model } from '../../models/claimhistory_model';
import { ClaimapprovertasklistPage } from '../claimapprovertasklist/claimapprovertasklist';
import { ResourceLoader } from '@angular/compiler';

/**
 * Generated class for the ClaimtasklistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-claimtasklist',
  templateUrl: 'claimtasklist.html', providers: [BaseHttpService]
})
export class ClaimtasklistPage {

  //ClaimHistory_Model = new ClaimHistory_Model();
   claimTaskLists:any[];
   claimTaskLists1:any[]=[];
   claimTaskListTotal: any[];
   searchboxValue: string;
  //baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimreftasklist?filter=(ASSIGNED_TO='+localStorage.getItem("g_USER_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
  //baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimreftasklist?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimrequestlist?filter=(ASSIGNED_TO=' + localStorage.getItem("g_USER_GUID") + ')AND(STATUS=Pending)&api_key=' + constants.DREAMFACTORY_API_KEY;

  constructor(public navCtrl: NavController, public navParams: NavParams,public http: Http, private httpService: BaseHttpService) {
    this.BindData();
    }

BindData()
{
  this.http
  .get(this.baseResourceUrl)
  .map(res => res.json())
  .subscribe(data => {
    this.claimTaskListTotal= data["resource"];

    this.claimTaskListTotal.forEach(element => {
      if(this.claimTaskLists1.length===0 || (this.claimTaskLists1.length>0 && this.claimTaskLists1.find(e=>e.CLAIM_REF_GUID==element.CLAIM_REF_GUID)===undefined))
      {
         this.claimTaskLists1.push(element);
     }
      else
      {
        this.claimTaskLists1.find(e=>e.CLAIM_REF_GUID===element.CLAIM_REF_GUID).CLAIM_AMOUNT+=element.CLAIM_AMOUNT;
      }
    });
    this.claimTaskLists=this.claimTaskLists1;
  });
}

onSearchInput(ev: any) {  
  // alert('hi')
        let val = this.searchboxValue;
        if (val && val.trim() != '') {
         this.claimTaskLists = this.claimTaskLists1.filter((item) => {
      let fullname:number;
      let month:number;
      let dept:number;
      let amount:number;
           console.log(item);
           if(item.FULLNAME!=null)
           {fullname=item.FULLNAME.toLowerCase().indexOf(val.toLowerCase())}
           if(item.DEPARTMENT!=null)
           {dept=item.DEPARTMENT.toString().toLowerCase().indexOf(val.toLowerCase())}
           if(item.MONTH!=null)
           {month=item.MONTH.toString().toLowerCase().indexOf(val.toLowerCase())}
           if(item.CLAIM_AMOUNT!=null)
           {amount=item.CLAIM_AMOUNT.toString().toLowerCase().indexOf(val.toLowerCase()) }
           return (
             (fullname > -1) 
           || (dept > -1) 
           || ( month> -1)
           || (amount> -1) 
         );
         })
       }
       else
       {
         
        this.claimTaskLists=this.claimTaskLists1;
       }
 }


    goToClaimApproverTaskList(claimrefguid:any){
    this.navCtrl.push(ClaimapprovertasklistPage,{
    claimRefGuid:claimrefguid
     })
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ClaimtasklistPage');
  }

}
