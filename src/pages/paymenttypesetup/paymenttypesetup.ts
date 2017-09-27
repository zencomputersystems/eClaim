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
  //paymenttype: PaymentTypeSetup_Model = new PaymentTypeSetup_Model();

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_payment_type' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';


  public paymenttypes: PaymentTypeSetup_Model[] = [];

  public AddPaymentTypeClicked: boolean = false;
  public EditPaymentTypeClicked: boolean = false;
  public Exist_Record: boolean = false;

  public paymenttype_details: any; 
  public exist_record_details: any;

  //Set the Model Name for Add------------------------------------------
  public NAME_ngModel_Add: any;
  public DESCRIPTION_ngModel_Add: any;
  //---------------------------------------------------------------------

  //Set the Model Name for edit------------------------------------------
  public NAME_ngModel_Edit: any;
  public DESCRIPTION_ngModel_Edit: any;
  //---------------------------------------------------------------------

    public AddPaymenttypeClick() {
      this.ClearControls();
        this.AddPaymentTypeClicked = true; 
    }

     public EditClick(PAYMENT_TYPE_GUID: any) {  
      this.ClearControls();  
    this.EditPaymentTypeClicked = true;
    var self = this;
    this.paymenttypesetupservice
      .get(PAYMENT_TYPE_GUID)
      .subscribe((data) => {
      self.paymenttype_details = data;
      this.NAME_ngModel_Edit = self.paymenttype_details.NAME; localStorage.setItem('Prev_pa_Name', self.paymenttype_details.NAME); 
      this.DESCRIPTION_ngModel_Edit = self.paymenttype_details.DESCRIPTION;
  });
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
      //NAME: ["", Validators.required],
      //NAME: [null, Validators.compose([Validators.pattern('[a-zA-Z0-9][a-zA-Z0-9 ]+'), Validators.required])], 
      NAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
      
      //DESCRIPTION: ["", Validators.required],
      DESCRIPTION: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],      
      //DESCRIPTION: [null, Validators.compose([Validators.pattern('[a-zA-Z0-9][a-zA-Z0-9 ]+'), Validators.required])], 
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
      url = this.baseResource_Url + "main_payment_type?filter=(NAME=" + this.NAME_ngModel_Add.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      this.http.get(url, options)
        .map(res => res.json())
        .subscribe(
        data => {
          let res = data["resource"];
          if (res.length == 0) {
            console.log("No records Found");
            if (this.Exist_Record == false) {
              this.Paymenttype_entry.NAME = this.NAME_ngModel_Add.trim();
              this.Paymenttype_entry.DESCRIPTION = this.DESCRIPTION_ngModel_Add.trim();

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
    alert("The PaymentType is already Exist.")
    
  } 
},
err => {
  this.Exist_Record = false;
  console.log("ERROR!: ", err);
});
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
      if (this.Paymenttypeform.valid) {  
    if(this.Paymenttype_entry.NAME==null){this.Paymenttype_entry.NAME = this.NAME_ngModel_Edit.trim();}
    if(this.Paymenttype_entry.DESCRIPTION==null){this.Paymenttype_entry.DESCRIPTION = this.DESCRIPTION_ngModel_Edit.trim();}
    
      this.Paymenttype_entry.TENANT_GUID = this.paymenttype_details.TENANT_GUID;
      this.Paymenttype_entry.CREATION_TS = this.paymenttype_details.CREATION_TS;
      this.Paymenttype_entry.CREATION_USER_GUID = this.paymenttype_details.CREATION_USER_GUID;

      this.Paymenttype_entry.PAYMENT_TYPE_GUID = PAYMENT_TYPE_GUID;
      this.Paymenttype_entry.UPDATE_TS = new Date().toISOString();
      this.Paymenttype_entry.UPDATE_USER_GUID = '1';

      if (this.NAME_ngModel_Edit.trim() != localStorage.getItem('Prev_pa_Name')) {
        let url: string;
        url = this.baseResource_Url + "main_payment_type?filter=(NAME=" + this.NAME_ngModel_Edit.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
        this.http.get(url)
          .map(res => res.json())
          .subscribe(
          data => {
            let res = data["resource"];
            console.log('Current Name : ' + this.NAME_ngModel_Edit + ', Previous Name : ' + localStorage.getItem('Prev_pa_Name'));

            if (res.length == 0) {
              console.log("No records Found");
              this.Paymenttype_entry.NAME = this.NAME_ngModel_Edit.trim();
              
              //**************Update service if it is new details*************************
              this.paymenttypesetupservice.update(this.Paymenttype_entry)
                .subscribe((response) => {
                  if (response.status == 200) {
                    alert('Payment updated successfully');
                    this.navCtrl.setRoot(this.navCtrl.getActive().component);
                  }
                });
              //**************************************************************************
            }
            else {
              console.log("Records Found");
              alert("The Payment is already Exist. ");
            }
          },
          err => {
            this.Exist_Record = false;
            console.log("ERROR!: ", err);
          });
      }
      else {
        if (this.Paymenttype_entry.NAME == null) { this.Paymenttype_entry.NAME = localStorage.getItem('Prev_pa_Name'); }
        this.Paymenttype_entry.NAME = this.NAME_ngModel_Edit.trim();
        //**************Update service if it is old details*************************
      
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
ClearControls()
{
  this.NAME_ngModel_Add = "";
  this.DESCRIPTION_ngModel_Add = "";

  this.NAME_ngModel_Edit = "";
  this.DESCRIPTION_ngModel_Edit = "";
}
}
// if (this.Paymenttypeform.valid) {
      
    //         let headers = new Headers();
    //         headers.append('Content-Type', 'application/json');
    //         let options = new RequestOptions({ headers: headers });
    //         let url: string;
    //         url = "http://api.zen.com.my/api/v2/zcs/_table/main_payment_type?filter=(NAME=" + this.Paymenttype_entry.NAME + ")&api_key=cb82c1df0ba653578081b3b58179158594b3b8f29c4ee1050fda1b7bd91c3881";
    //         this.http.get(url, options)
    //           .map(res => res.json())
    //           .subscribe(
    //           data => {
    //             let res = data["resource"];
    //             if (res.length == 0) {
    //               console.log("No records Found");
    //               if (this.Exist_Record == false) {

//   else {
//     console.log("Records Found");
//     alert("The Paymenttype is already Added.")
//   }

// },
//   err => {
//     this.Exist_Record = false;
//     console.log("ERROR!: ", err);
//   }
//   );
// }
// }
// }
