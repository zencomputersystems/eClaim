import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController  } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
//import { FormBuilder, FormGroup } from '@angular/forms';
import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { SubsciptionSetup_Model } from '../../models/subsciptionsetup_model';
import { SubsciptionSetup_Service } from '../../services/subsciptionsetup_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';

/**
 * Generated class for the SubsciptionsetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-subsciptionsetup',
  templateUrl: 'subsciptionsetup.html', providers: [SubsciptionSetup_Service, BaseHttpService]
})
export class SubsciptionsetupPage {
  Subscription_entry: SubsciptionSetup_Model = new SubsciptionSetup_Model();
  subscription: SubsciptionSetup_Model = new SubsciptionSetup_Model();
  Subscriptionform: FormGroup;

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_subscription' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  public subscriptions: SubsciptionSetup_Model[] = []; 
  public AddSubscriptionClicked: boolean = false; 
  public EditSubscriptionClicked: boolean = false; 
  Exist_Record: boolean = false;
  public subscription_details: any; public exist_record_details: any;

  
   
    public AddSubscriptionClick() {

        this.AddSubscriptionClicked = true; 
    }

    public EditClick(SUBSCRIPTION_GUID: any) {
      //alert(MILEAGE_GUID);
      this.EditSubscriptionClicked = true;
      var self = this;
      this.subscriptionsetupservice
        .get(SUBSCRIPTION_GUID)
        .subscribe((subscription) => self.subscription = subscription);
      return self.subscription;
    }

    public DeleteClick(SUBSCRIPTION_GUID: any) {
      let alert = this.alertCtrl.create({
        title: 'Remove Confirmation',
        message: 'Do you want to remove ?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'OK',
            handler: () => {
              console.log('OK clicked');
              var self = this;
              this.subscriptionsetupservice.remove(SUBSCRIPTION_GUID)
                .subscribe(() => {
                  self.subscriptions = self.subscriptions.filter((item) => {
                    return item.SUBSCRIPTION_GUID != SUBSCRIPTION_GUID
                  });
                });
              //this.navCtrl.setRoot(this.navCtrl.getActive().component);
            }
          }
        ]
      }); alert.present();
    }
  

      public CloseSubscriptionClick() {

        if (this.AddSubscriptionClicked == true) {
          this.AddSubscriptionClicked = false;
        }
        if (this.EditSubscriptionClicked == true) {
          this.EditSubscriptionClicked = false;
        }
    }
  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private subscriptionsetupservice: SubsciptionSetup_Service, private alertCtrl: AlertController) {
    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.subscriptions = data.resource;
     console.table(this.subscriptions)
    });

    this.Subscriptionform = fb.group({
      PLAN_NAME: ["", Validators.required],
      DURATION: ["", Validators.required],
      RATE: ["", Validators.required],
      EFFECTIVE_DATE: ["", Validators.required],
      ACTIVE_FLAG: ["", Validators.required],
      DESCRIPTION: ["", Validators.required],
       
    });
  }

  


  ionViewDidLoad() {
    console.log('ionViewDidLoad SubsciptionsetupPage');
  }

  Save() {
    if (this.Subscriptionform.valid) {

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      let url: string;
      url = "http://api.zen.com.my/api/v2/zcs/_table/main_subscription?filter=(PLAN_NAME=" + this.Subscription_entry.PLAN_NAME + ")&api_key=cb82c1df0ba653578081b3b58179158594b3b8f29c4ee1050fda1b7bd91c3881";
      this.http.get(url, options)
        .map(res => res.json())
        .subscribe(
        data => {
          let res = data["resource"];
          if (res.length == 0) {
            console.log("No records Found");
            if (this.Exist_Record == false) {
      this.Subscription_entry.SUBSCRIPTION_GUID = UUID.UUID();
      this.Subscription_entry.CREATION_TS = new Date().toISOString();
      this.Subscription_entry.CREATION_USER_GUID = "1";
      this.Subscription_entry.UPDATE_TS = new Date().toISOString();
      this.Subscription_entry.TENANT_GUID = UUID.UUID();
      this.Subscription_entry.UPDATE_USER_GUID = "";
      //this.mileage_entry.ACTIVATION_FLAG = boolean;
      
      this.subscriptionsetupservice.save(this.Subscription_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            alert('Subscription Registered successfully');
            //location.reload();
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        })
    }
  }
  else {
    console.log("Records Found");
    alert("The Subscription is already Added.")
    
  }
  
},
err => {
  this.Exist_Record = false;
  console.log("ERROR!: ", err);
}
);

}
}
getBankList() {
  let self = this;
  let params: URLSearchParams = new URLSearchParams();
  self.subscriptionsetupservice.get_subscription(params)
    .subscribe((subscriptions: SubsciptionSetup_Model[]) => {
      self.subscriptions = subscriptions;
    });
}

 Update(SUBSCRIPTION_GUID: any) {  
//  if(this.Subscription_entry.PLAN_NAME==null){this.Subscription_entry.PLAN_NAME = this.Subscription_entry.PLAN_NAME;}
//  if(this.Subscription_entry.DURATION==null){this.Subscription_entry.DURATION = this.Subscription_entry.DURATION;}
if (this.Subscriptionform.valid) {
  
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        let url: string;
        url = "http://api.zen.com.my/api/v2/zcs/_table/main_subscription?filter=(PLAN_NAME=" + this.Subscription_entry.PLAN_NAME + ")&api_key=cb82c1df0ba653578081b3b58179158594b3b8f29c4ee1050fda1b7bd91c3881";
        this.http.get(url, options)
          .map(res => res.json())
          .subscribe(
          data => {
            let res = data["resource"];
            if (res.length == 0) {
              console.log("No records Found");
              if (this.Exist_Record == false) {
    if (this.Subscriptionform.valid) {
      this.Subscription_entry.CREATION_TS = this.subscription.CREATION_TS
      this.Subscription_entry.CREATION_USER_GUID = this.subscription.CREATION_USER_GUID;
      this.Subscription_entry.UPDATE_TS = this.subscription.UPDATE_TS;

      this.Subscription_entry.SUBSCRIPTION_GUID = SUBSCRIPTION_GUID;
      this.Subscription_entry.UPDATE_TS = new Date().toISOString();
      this.Subscription_entry.UPDATE_USER_GUID = '1';
      
      this.subscriptionsetupservice.update(this.Subscription_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            alert('Subscription updated successfully');
            //location.reload();
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        })
    }
  }

}
else {
  console.log("Records Found");
  alert("The Subscription is already Added.")
  
}
},
err => {
  this.Exist_Record = false;
  console.log("ERROR!: ", err);
}
);
}
}
}


