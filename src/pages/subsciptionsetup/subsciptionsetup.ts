import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController  } from 'ionic-angular';
//import { FormBuilder, FormGroup } from '@angular/forms';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
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
  //subscription: SubsciptionSetup_Model = new SubsciptionSetup_Model();
  Subscriptionform: FormGroup;
  public page:number = 1;
  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_subscription' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  public subscriptions: SubsciptionSetup_Model[] = []; 

  public AddSubscriptionClicked: boolean = false; 
  public EditSubscriptionClicked: boolean = false; 
  public Exist_Record: boolean = false;
  
  public subscription_details: any; 
  public exist_record_details: any;

  //Set the Model Name for Add------------------------------------------
  public PLAN_NAME_ngModel_Add:      any;
  public DURATION_ngModel_Add:       any;
  public RATE_ngModel_Add:           any;  
  public EFFECTIVE_DATE_ngModel_Add: any;  
  public ACTIVE_FLAG_ngModel_Add:    any;  
  public DESCRIPTION_ngModel_Add:    any;   
  //---------------------------------------------------------------------

  //Set the Model Name for edit------------------------------------------
  public PLAN_NAME_ngModel_Edit:        any;
  public DURATION_ngModel_Edit:         any;
  public RATE_ngModel_Edit:             any;  
  public EFFECTIVE_DATE_ngModel_Edit:   any;  
  public ACTIVE_FLAG_ngModel_Edit:      any;  
  public DESCRIPTION_ngModel_Edit:      any;  
  //---------------------------------------------------------------------

  
   
    public AddSubscriptionClick() {
      this.ClearControls();
        this.AddSubscriptionClicked = true; 
        this.ACTIVE_FLAG_ngModel_Add = false;
        this.EFFECTIVE_DATE_ngModel_Add = "";
    }

    public EditClick(SUBSCRIPTION_GUID: any) {
      this.ClearControls();
      this.EditSubscriptionClicked = true;
      var self = this;
      this.subscriptionsetupservice
        .get(SUBSCRIPTION_GUID)
        .subscribe((data) => 
        {
          self.subscription_details = data;

          this.PLAN_NAME_ngModel_Edit = self.subscription_details.PLAN_NAME; localStorage.setItem('Prev_sub_Name', self.subscription_details.PLAN_NAME);
          this.DURATION_ngModel_Edit = self.subscription_details.DURATION;
          this.RATE_ngModel_Edit = self.subscription_details.RATE;
          this.EFFECTIVE_DATE_ngModel_Edit = new Date(self.subscription_details.EFFECTIVE_DATE).toISOString();
          this.DESCRIPTION_ngModel_Edit = self.subscription_details.DESCRIPTION;   
          if(self.subscription_details.ACTIVE_FLAG == "1"){
            this.ACTIVE_FLAG_ngModel_Edit = true;
          }
          else{
            this.ACTIVE_FLAG_ngModel_Edit = false;
          }    
      });
    }
       
    public DeleteClick(SUBSCRIPTION_GUID: any) {
      let alert = this.alertCtrl.create({
        title: 'Remove Confirmation',
        message: 'Are you sure to remove?',
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
  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private subscriptionsetupservice: SubsciptionSetup_Service, private alertCtrl: AlertController) {
    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.subscriptions = data.resource;
     console.table(this.subscriptions)
    });

    this.Subscriptionform = fb.group({
      //PLAN_NAME: ["", Validators.required],
      //PLAN_NAME: [null, Validators.compose([Validators.pattern('[a-zA-Z0-9][a-zA-Z0-9 ]+'), Validators.required])],
      PLAN_NAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
      
      //DURATION: ["", Validators.required],
      DURATION: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
      
      //NAME: [null, Validators.compose([Validators.pattern('[a-zA-Z][a-zA-Z0-9 ]+'), Validators.required])], 
      //RATE: [null, Validators.compose([Validators.pattern('^[a-zA-Z][a-zA-Z0-9\\s]+$'), Validators.required])],
      //RATE: ["", Validators.required],
      //RATE: [null, Validators.compose([Validators.pattern('[a-zA-Z0-9][a-zA-Z0-9 ]+'), Validators.required])],
      RATE: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
      
      EFFECTIVE_DATE: ["", Validators.required],
      //DESCRIPTION: ["", Validators.required],
      //DESCRIPTION: [null, Validators.compose([Validators.pattern('[a-zA-Z0-9][a-zA-Z0-9 ]+'), Validators.required])],
      DESCRIPTION: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
      
      ACTIVE_FLAG: ["", Validators.required],
             
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
      url = this.baseResource_Url+ "main_subscription?filter=(PLAN_NAME=" + this.PLAN_NAME_ngModel_Add.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;      
      this.http.get(url, options)
        .map(res => res.json())
        .subscribe(
        data => {
          let res = data["resource"];
          if (res.length == 0) {
            console.log("No records Found");
            if (this.Exist_Record == false) {
              this.Subscription_entry.PLAN_NAME = this.PLAN_NAME_ngModel_Add.trim();
              this.Subscription_entry.DURATION = this.DURATION_ngModel_Add.trim();
              this.Subscription_entry.RATE = this.RATE_ngModel_Add.trim();
              this.Subscription_entry. EFFECTIVE_DATE = this. EFFECTIVE_DATE_ngModel_Add;
              this.Subscription_entry.DESCRIPTION = this.DESCRIPTION_ngModel_Add.trim();
              this.Subscription_entry.ACTIVE_FLAG = this.ACTIVE_FLAG_ngModel_Add;

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
        });
    }
  }
  else {
    console.log("Records Found");
    alert("The Subscription is already Exist.")
    
  } 
},
err => {
  this.Exist_Record = false;
  console.log("ERROR!: ", err);
});
}
}
getSubscriptionList() {
  let self = this;
  let params: URLSearchParams = new URLSearchParams();
  self.subscriptionsetupservice.get_subscription(params)
    .subscribe((subscriptions: SubsciptionSetup_Model[]) => {
      self.subscriptions = subscriptions;
    });
}

 Update(SUBSCRIPTION_GUID: any) {  

  if (this.Subscriptionform.valid) {
 if(this.Subscription_entry.PLAN_NAME==null){this.Subscription_entry.PLAN_NAME = this.PLAN_NAME_ngModel_Edit.trim();}
 if(this.Subscription_entry.DURATION==null){this.Subscription_entry.DURATION = this.DURATION_ngModel_Edit.trim();}
 if(this.Subscription_entry.RATE==null){this.Subscription_entry.RATE = this.RATE_ngModel_Edit.trim();}
 if(this.Subscription_entry.EFFECTIVE_DATE==null){this.Subscription_entry.EFFECTIVE_DATE = this.EFFECTIVE_DATE_ngModel_Edit;}
 if(this.Subscription_entry.DESCRIPTION==null){this.Subscription_entry.DESCRIPTION = this.DESCRIPTION_ngModel_Edit.trim();}
 if(this.Subscription_entry.ACTIVE_FLAG==null){this.Subscription_entry.ACTIVE_FLAG = this.ACTIVE_FLAG_ngModel_Edit;}

      this.Subscription_entry.CREATION_TS = this.subscription_details.CREATION_TS
      this.Subscription_entry.CREATION_USER_GUID = this.subscription_details.CREATION_USER_GUID;
      this.Subscription_entry.UPDATE_TS = this.subscription_details.UPDATE_TS;
      this.Subscription_entry.SUBSCRIPTION_GUID = SUBSCRIPTION_GUID;
      this.Subscription_entry.UPDATE_TS = new Date().toISOString();
      this.Subscription_entry.UPDATE_USER_GUID = '1';
      
      //debugger;
      if (this.PLAN_NAME_ngModel_Edit.trim() != localStorage.getItem('Prev_sub_Name')) {
        let url: string;
        url = this.baseResource_Url + "main_subscription?filter=(PLAN_NAME=" + this.PLAN_NAME_ngModel_Edit + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
        this.http.get(url)
          .map(res => res.json())
          .subscribe(
          data => {
            let res = data["resource"];
            console.log('Current Name : ' + this.PLAN_NAME_ngModel_Edit.trim() + ', Previous Name : ' + localStorage.getItem('Prev_sub_Name'));

            if (res.length == 0) {
             
              console.log("No records Found");
              this.Subscription_entry.PLAN_NAME = this.PLAN_NAME_ngModel_Edit.trim();
              
              //**************Update service if it is new details*************************
              this.subscriptionsetupservice.update(this.Subscription_entry)
                .subscribe((response) => {
                  if (response.status == 200) {
                    alert('Subscription updated successfully');
                    this.navCtrl.setRoot(this.navCtrl.getActive().component);
                  }
                });
              //**************************************************************************
            }
            else {
              console.log("Records Found");
              alert("The Subscription is already Exist. ");
            }
          },
          err => {
            this.Exist_Record = false;
            console.log("ERROR!: ", err);
          });
      }
      else {
        if (this.Subscription_entry.PLAN_NAME == null) { this.Subscription_entry.PLAN_NAME = localStorage.getItem('Prev_sub_Name'); }
        this.Subscription_entry.PLAN_NAME = this.PLAN_NAME_ngModel_Edit.trim();
        
        //**************Update service if it is old details************************
      
      this.subscriptionsetupservice.update(this.Subscription_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            alert('Subscription updated successfully');
            //location.reload();
            this.navCtrl.setRoot(this.navCtrl.getActive().component); 
          }
        });
    }
  }
}
ClearControls()
{
  this.PLAN_NAME_ngModel_Add = "";
  this.DURATION_ngModel_Add = "";
  this.RATE_ngModel_Add = "";
  this.EFFECTIVE_DATE_ngModel_Add = "";
  this.DESCRIPTION_ngModel_Add = "";
  this.ACTIVE_FLAG_ngModel_Add = false;

  this.PLAN_NAME_ngModel_Edit = "";
  this.DURATION_ngModel_Edit = "";
  this.RATE_ngModel_Edit = "";
  this.EFFECTIVE_DATE_ngModel_Edit = "";
  this.DESCRIPTION_ngModel_Edit = "";
  this.ACTIVE_FLAG_ngModel_Edit = false;

}
}

// if (this.Subscriptionform.valid) {
  
//         let headers = new Headers();
//         headers.append('Content-Type', 'application/json');
//         let options = new RequestOptions({ headers: headers });
//         let url: string;
//         url = "http://api.zen.com.my/api/v2/zcs/_table/main_subscription?filter=(PLAN_NAME=" + this.Subscription_entry.PLAN_NAME + ")&api_key=cb82c1df0ba653578081b3b58179158594b3b8f29c4ee1050fda1b7bd91c3881";
//         this.http.get(url, options)
//           .map(res => res.json())
//           .subscribe(
//           data => {
//             let res = data["resource"];
//             if (res.length == 0) {
//               console.log("No records Found");
//               if (this.Exist_Record == false) {
//     if (this.Subscriptionform.valid) {

//}
// else {
//   console.log("Records Found");
//   alert("The Subscription is already Added.")
  
// }
// },
// err => {
//   this.Exist_Record = false;
//   console.log("ERROR!: ", err);
// }
// );
// }
// }
// }


