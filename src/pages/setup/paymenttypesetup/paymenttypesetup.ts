import 'rxjs/add/operator/map';

import * as constants from '../../../app/config/constants';

import { AlertController, IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BaseHttpService } from '../../../services/base-http';
import { ClearControls } from '../../../services/controls_service';
import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { PaymentTypeSetup_Model } from '../../../models/paymenttypesetup_model';
import { PaymentTypeSetup_Service } from '../../../services/paymenttypesetup_service';
import { TitleCasePipe } from '@angular/common';
import { UUID } from 'angular2-uuid';
import { authCheck } from '../../../shared/authcheck';

/**
 * Generated class for the PaymenttypesetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-paymenttypesetup',
  templateUrl: 'paymenttypesetup.html', providers: [PaymentTypeSetup_Service, BaseHttpService, TitleCasePipe]
})
export class PaymenttypesetupPage extends authCheck {
  Paymenttype_entry: PaymentTypeSetup_Model = new PaymentTypeSetup_Model();
  Paymenttypeform: FormGroup;
  //paymenttype: PaymentTypeSetup_Model = new PaymentTypeSetup_Model();
  public page: number = 1;
  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_payment_type' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  public paymenttypes: PaymentTypeSetup_Model[] = [];

  public AddPaymentTypeClicked: boolean = false;
  public Exist_Record: boolean = false;

  public paymenttype_details: any;
  public exist_record_details: any;

  //Set the Model Name for Add------------------------------------------
  public NAME_ngModel_Add: any;
  public DESCRIPTION_ngModel_Add: any;
  //---------------------------------------------------------------------

  Tenant_Add_ngModel: any;
  AdminLogin: boolean = false; 
  Add_Form: boolean = false; 
  Edit_Form: boolean = false;
  tenants: any;
  Key_Param: string = 'api_key=' + constants.DREAMFACTORY_API_KEY;

  public AddPaymenttypeClick() {
    if (this.Edit_Form == false) {
      this.AddPaymentTypeClicked = true; this.Add_Form = true; this.Edit_Form = false;
      ClearControls(this);
    }
    else {
      alert('Sorry. You are in Edit Mode.');
    }
  }

  public EditClick(PAYMENT_TYPE_GUID: any) {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();

    ClearControls(this);
    this.AddPaymentTypeClicked = true;
    this.Add_Form = false;
    this.Edit_Form = true;

    var self = this;
    this.paymenttypesetupservice
      .get(PAYMENT_TYPE_GUID)
      .subscribe((data) => {
        self.paymenttype_details = data;
        this.Tenant_Add_ngModel = self.paymenttype_details.TENANT_GUID;
        this.NAME_ngModel_Add = self.paymenttype_details.NAME;
        localStorage.setItem('Prev_Name', self.paymenttype_details.NAME);
        localStorage.setItem('Prev_TenantGuid', self.paymenttype_details.TENANT_GUID);
        this.DESCRIPTION_ngModel_Add = self.paymenttype_details.DESCRIPTION;

        this.loading.dismissAll();
      });
  }

  public DeleteClick(PAYMENT_TYPE_GUID: any) {
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
            var self = this;
            this.paymenttypesetupservice.remove(PAYMENT_TYPE_GUID)
              .subscribe(() => {
                self.paymenttypes = self.paymenttypes.filter((item) => {
                  return item.PAYMENT_TYPE_GUID != PAYMENT_TYPE_GUID
                });
              });
          }
        }
      ]
    });
    alert.present();
  }

  public ClosePaymentTypeClick() {
    if (this.AddPaymentTypeClicked == true) {
      this.AddPaymentTypeClicked = false;
      this.Add_Form = true; this.Edit_Form = false;
    }
  }

  loading: Loading;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    fb: FormBuilder,
    public http: Http,
    private paymenttypesetupservice: PaymentTypeSetup_Service,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private titlecasePipe: TitleCasePipe
  ) {
    // Get super();
    super(navCtrl, true);

    //Display Grid---------------------------------------------
        this.DisplayGrid();

      //-------------------------------------------------------
      if (localStorage.getItem("g_USER_GUID") != "sva") {
        this.Paymenttypeform = fb.group({
          NAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
          DESCRIPTION: [null],
        });
      }
      else {
        this.Paymenttypeform = fb.group({
          NAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
          DESCRIPTION: [null],
          TENANT_NAME: [null, Validators.required],
        });
      }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymenttypesetupPage');
  }

  DisplayGrid() {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();

    if (localStorage.getItem("g_USER_GUID") == "sva") {
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_payment_type_details' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
      this.AdminLogin = true;
    }
    else {
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_payment_type_details' + '?filter=(TENANT_GUID=' + localStorage.getItem('g_TENANT_GUID') + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      this.AdminLogin = false;
    }

    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.paymenttypes = data.resource;

        this.loading.dismissAll();
      });
  }

  Save() {
    if (this.Paymenttypeform.valid) {
      //for Save Set Entities-------------------------------------------------------------
      if (this.Add_Form == true) {
        this.SetEntityForAdd();
      }
      //for Update Set Entities------------------------------------------------------------
      else {
        this.SetEntityForUpdate();
      }
      //Common Entitity For Insert/Update------------------------------------------------- 
      this.SetCommonEntityForAddUpdate();

      //Load the Controller--------------------------------
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...',
      });
      this.loading.present();
      //--------------------------------------------------

      let strPrev_Name: string = "";
      if (localStorage.getItem('Prev_Name') != null) { strPrev_Name = localStorage.getItem('Prev_Name').toUpperCase(); }

      if (this.NAME_ngModel_Add.trim().toUpperCase() != strPrev_Name || this.Tenant_Add_ngModel != localStorage.getItem('Prev_TenantGuid')) {
        let val = this.CheckDuplicate();
        val.then((res) => {
          if (res.toString() == "0") {
            //---Insert or Update-------------------------------------------------------
            if (this.Add_Form == true) {
              //**************Save service if it is new details*************************
              this.Insert();
              //**************************************************************************
            }
            else {
              //**************Update service if it is new details*************************
              this.Update();
              //**************************************************************************
            }
          }
          else {
            alert("The Payment Type is already Exist.");
            this.loading.dismissAll();
          }
        });
        val.catch((err) => {
          console.log(err);
        });
      }
      else {
        //Simple update----------------------------------------------------------
        this.Update();
      }
    }
  }

  SetEntityForAdd() {
    this.Paymenttype_entry.PAYMENT_TYPE_GUID = UUID.UUID();
    this.Paymenttype_entry.CREATION_TS = new Date().toISOString();
    if (localStorage.getItem("g_USER_GUID") != "sva") {
      this.Paymenttype_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
    }
    else {
      this.Paymenttype_entry.CREATION_USER_GUID = 'sva';
    }
    this.Paymenttype_entry.UPDATE_TS = new Date().toISOString();
    this.Paymenttype_entry.UPDATE_USER_GUID = "";
  }

  SetEntityForUpdate() {
    this.Paymenttype_entry.PAYMENT_TYPE_GUID = this.paymenttype_details.PAYMENT_TYPE_GUID;
    this.Paymenttype_entry.CREATION_TS = this.paymenttype_details.CREATION_TS;
    this.Paymenttype_entry.CREATION_USER_GUID = this.paymenttype_details.CREATION_USER_GUID;
    this.Paymenttype_entry.UPDATE_TS = new Date().toISOString();
    if (localStorage.getItem("g_USER_GUID") != "sva") {
      this.Paymenttype_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");
    }
    else {
      this.Paymenttype_entry.UPDATE_USER_GUID = 'sva';
    }
  }

  SetCommonEntityForAddUpdate() {
    this.Paymenttype_entry.NAME = this.titlecasePipe.transform(this.NAME_ngModel_Add.trim());
    this.Paymenttype_entry.DESCRIPTION = this.titlecasePipe.transform(this.DESCRIPTION_ngModel_Add ? this.DESCRIPTION_ngModel_Add.trim(): "");

    if (localStorage.getItem("g_USER_GUID") != "sva") {
      this.Paymenttype_entry.TENANT_GUID = localStorage.getItem("g_TENANT_GUID");
    }
    else {
      this.Paymenttype_entry.TENANT_GUID = this.Tenant_Add_ngModel;
    }
  }

  RemoveStorageValues() {
    localStorage.removeItem("Prev_Name");
    localStorage.removeItem("Prev_TenantGuid");
  }

  Insert() {
    this.paymenttypesetupservice.save(this.Paymenttype_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          alert('Payment Type Registered successfully');

          //Remove all storage values-----------------------------------------
          this.RemoveStorageValues();
          //------------------------------------------------------------------

          this.navCtrl.setRoot(this.navCtrl.getActive().component);
        }
      });

  }

  Update() {
    this.paymenttypesetupservice.update(this.Paymenttype_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          alert('Payment Type updated successfully');

          //Remove all storage values-----------------------------------------
          this.RemoveStorageValues();
          //------------------------------------------------------------------

          this.navCtrl.setRoot(this.navCtrl.getActive().component);
        }
      });
  }

  CheckDuplicate() {
    let url: string = "";
    if (localStorage.getItem("g_USER_GUID") != "sva") {
      url = this.baseResource_Url + "main_payment_type?filter=NAME=" + this.NAME_ngModel_Add.trim() + ' AND TENANT_GUID=' + localStorage.getItem("g_TENANT_GUID") + '&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    else {
      url = this.baseResource_Url + "main_payment_type?filter=NAME=" + this.NAME_ngModel_Add.trim() + ' AND TENANT_GUID=' + this.Tenant_Add_ngModel + '&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    let result: any;
    return new Promise((resolve) => {
      this.http
        .get(url)
        .map(res => res.json())
        .subscribe(data => {
          result = data["resource"];
          resolve(result.length);
        });
    });
  }
}