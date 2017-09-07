import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
//import { FormBuilder, FormGroup } from '@angular/forms';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { PaymentTypeSetup_Model } from '../../models/paymenttypesetup_model';
import { PaymentTypeSetup_Service } from '../../services/paymenttypesetup_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';


/**
 * Generated class for the PaymenttypesetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-paymenttypesetup',
  templateUrl: 'paymenttypesetup.html', providers: [PaymentTypeSetup_Service, BaseHttpService]
})
export class PaymenttypesetupPage {
  Paymenttype_entry: PaymentTypeSetup_Model = new PaymentTypeSetup_Model();
  Paymenttypeform: FormGroup;
  paymenttype: PaymentTypeSetup_Model = new PaymentTypeSetup_Model();


  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_payment_type' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';


  public paymenttypes: PaymentTypeSetup_Model[] = [];

  public AddPaymentTypeClicked: boolean = false; public EditPaymentTypeClicked: boolean = false;
  Exist_Record: boolean = false;
  public paymenttype_details: any; public exist_record_details: any;


// Paymentform: FormGroup;
//    public AddPaymentTypeClicked: boolean = false; 
   
    public AddPaymenttypeClick() {

        this.AddPaymentTypeClicked = true; 
    }

     public EditClick(PAYMENT_TYPE_GUID: any) {    
    this.EditPaymentTypeClicked = true;
    var self = this;
    this.paymenttypesetupservice
      .get(PAYMENT_TYPE_GUID)
      .subscribe((paymenttype) => self.paymenttype = paymenttype);
    return self.paymenttype;
  }


  public DeleteClick(PAYMENT_TYPE_GUID: any) {
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
            this.paymenttypesetupservice.remove(PAYMENT_TYPE_GUID)
              .subscribe(() => {
                self.paymenttypes = self.paymenttypes.filter((item) => {
                  return item.PAYMENT_TYPE_GUID != PAYMENT_TYPE_GUID
                });
              });
            //this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        }
      ]
    }); alert.present();
  }


      public ClosePaymentTypeClick() {

        if (this.AddPaymentTypeClicked == true) {
      this.AddPaymentTypeClicked = false;
    }
    if (this.EditPaymentTypeClicked == true) {
      this.EditPaymentTypeClicked = false;
    }
    }
  constructor(public navCtrl: NavController, public navParams: NavParams, fb:FormBuilder, public http: Http, private httpService: BaseHttpService, private paymenttypesetupservice: PaymentTypeSetup_Service, private alertCtrl: AlertController) {
    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.paymenttypes = data.resource;
      });


this.Paymenttypeform = fb.group({
      NAME: ["", Validators.required],
      DESCRIPTION: ["", Validators.required],
    });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymenttypesetupPage');
  }

  Save() {
    if (this.Paymenttypeform.valid) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      let url: string;
      url = "http://api.zen.com.my/api/v2/zcs/_table/main_payment_type?filter=(NAME=" + this.Paymenttype_entry.NAME + ")&api_key=cb82c1df0ba653578081b3b58179158594b3b8f29c4ee1050fda1b7bd91c3881";
      this.http.get(url, options)
        .map(res => res.json())
        .subscribe(
        data => {
          let res = data["resource"];
          if (res.length == 0) {
            console.log("No records Found");
            if (this.Exist_Record == false) {
      this.Paymenttype_entry.PAYMENT_TYPE_GUID = UUID.UUID();
      this.Paymenttype_entry.TENANT_GUID = UUID.UUID();
      this.Paymenttype_entry.CREATION_TS = new Date().toISOString();
      this.Paymenttype_entry.CREATION_USER_GUID = '1';
      this.Paymenttype_entry.UPDATE_TS = new Date().toISOString();
      this.Paymenttype_entry.UPDATE_USER_GUID = "";

      this.paymenttypesetupservice.save(this.Paymenttype_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            alert('Payment Type Registered successfully');
            //location.reload();
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        });
    }
  }
  else {
    console.log("Records Found");
    alert("The PaymentType is already Added.")
    
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
  self.paymenttypesetupservice.get_paymenttype(params)
    .subscribe((paymenttypes: PaymentTypeSetup_Model[]) => {
      self.paymenttypes = paymenttypes;
    });
}


    Update(PAYMENT_TYPE_GUID: any) {    
    // if(this.Paymenttype_entry.NAME==null){this.Paymenttype_entry.NAME = this.paymenttype.NAME;}
    // if(this.Paymenttype_entry.DESCRIPTION==null){this.Paymenttype_entry.DESCRIPTION = this.paymenttype.DESCRIPTION;}
    if (this.Paymenttypeform.valid) {
      
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            let options = new RequestOptions({ headers: headers });
            let url: string;
            url = "http://api.zen.com.my/api/v2/zcs/_table/main_payment_type?filter=(NAME=" + this.Paymenttype_entry.NAME + ")&api_key=cb82c1df0ba653578081b3b58179158594b3b8f29c4ee1050fda1b7bd91c3881";
            this.http.get(url, options)
              .map(res => res.json())
              .subscribe(
              data => {
                let res = data["resource"];
                if (res.length == 0) {
                  console.log("No records Found");
                  if (this.Exist_Record == false) {
    if (this.Paymenttypeform.valid) {
      this.Paymenttype_entry.TENANT_GUID = this.paymenttype.TENANT_GUID;
      this.Paymenttype_entry.CREATION_TS = this.paymenttype.CREATION_TS;
      this.Paymenttype_entry.CREATION_USER_GUID = this.paymenttype.CREATION_USER_GUID;

      this.Paymenttype_entry.PAYMENT_TYPE_GUID = PAYMENT_TYPE_GUID;
      this.Paymenttype_entry.UPDATE_TS = new Date().toISOString();
      this.Paymenttype_entry.UPDATE_USER_GUID = '1';
      
      this.paymenttypesetupservice.update(this.Paymenttype_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            alert('Payment Type updated successfully');
            //location.reload();
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        })
    }
  }
}
  else {
    console.log("Records Found");
    alert("The Paymenttype is already Added.")
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
