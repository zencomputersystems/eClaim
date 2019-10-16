import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { TitleCasePipe } from '@angular/common';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { PaymentTypeSetup_Model } from '../../models/paymenttypesetup_model';
import { PaymentTypeSetup_Service } from '../../services/paymenttypesetup_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';
import { LoginPage } from '../login/login';

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
export class PaymenttypesetupPage {
  Paymenttype_entry: PaymentTypeSetup_Model = new PaymentTypeSetup_Model();
  Paymenttypeform: FormGroup;
  //paymenttype: PaymentTypeSetup_Model = new PaymentTypeSetup_Model();
  public page:number = 1;
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
  AdminLogin: boolean = false; Add_Form: boolean = false; Edit_Form: boolean = false;
  tenants: any;
  Key_Param: string = 'api_key=' + constants.DREAMFACTORY_API_KEY;

  public AddPaymenttypeClick() {
    if (this.Edit_Form == false) {
      this.AddPaymentTypeClicked = true; this.Add_Form = true; this.Edit_Form = false;
      this.ClearControls();
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

    this.ClearControls();
    this.AddPaymentTypeClicked = true; this.Add_Form = false; this.Edit_Form = true;

    var self = this;
    this.paymenttypesetupservice
      .get(PAYMENT_TYPE_GUID)
      .subscribe((data) => {
        self.paymenttype_details = data;
        this.Tenant_Add_ngModel = self.paymenttype_details.TENANT_GUID;
        this.NAME_ngModel_Add = self.paymenttype_details.NAME; localStorage.setItem('Prev_Name', self.paymenttype_details.NAME); localStorage.setItem('Prev_TenantGuid', self.paymenttype_details.TENANT_GUID);
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
      this.Add_Form = true; this.Edit_Form = false;
    }
  }

  loading: Loading; button_Add_Disable: boolean = false; button_Edit_Disable: boolean = false; button_Delete_Disable: boolean = false; button_View_Disable: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private paymenttypesetupservice: PaymentTypeSetup_Service, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private titlecasePipe: TitleCasePipe) {
    if (localStorage.getItem("g_USER_GUID") == null) {
      alert('Sorry, you are not logged in. Please login.');
      this.navCtrl.push(LoginPage);
    }
    else {
      this.button_Add_Disable = false; this.button_Edit_Disable = false; this.button_Delete_Disable = false; this.button_View_Disable = false;
      if (localStorage.getItem("g_USER_GUID") != "sva") {
        //Get the role for this page------------------------------        
        if (localStorage.getItem("g_KEY_ADD") == "0") { this.button_Add_Disable = true; }
        if (localStorage.getItem("g_KEY_EDIT") == "0") { this.button_Edit_Disable = true; }
        if (localStorage.getItem("g_KEY_DELETE") == "0") { this.button_Delete_Disable = true; }
        if (localStorage.getItem("g_KEY_VIEW") == "0") { this.button_View_Disable = true; }

        //Clear localStorage value--------------------------------
        this.ClearLocalStorage();

        //fill all the tenant details----------------------------
        this.FillTenant();

        //Display Grid---------------------------------------------
        this.DisplayGrid();
      }
      else {
        alert('Sorry, you are not authorized for the action. authorized.');
        this.navCtrl.setRoot(this.navCtrl.getActive().component);
      }

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
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymenttypesetupPage');
  }

  ClearLocalStorage() {
    if (localStorage.getItem('Prev_Name') == null) {
      localStorage.setItem('Prev_Name', null);
    }
    else {
      localStorage.removeItem("Prev_Name");
    }
    if (localStorage.getItem('Prev_TenantGuid') == null) {
      localStorage.setItem('Prev_TenantGuid', null);
    }
    else {
      localStorage.removeItem("Prev_TenantGuid");
    }
  }

  FillTenant() {
    if (localStorage.getItem("g_USER_GUID") == "sva") {
      let tenantUrl: string = this.baseResource_Url + 'tenant_main?order=TENANT_ACCOUNT_NAME&' + this.Key_Param;
      this.http
        .get(tenantUrl)
        .map(res => res.json())
        .subscribe(data => {
          this.tenants = data.resource;
        });
      this.AdminLogin = true;
    }
    else {
      this.AdminLogin = false;
    }
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
    this.Paymenttype_entry.DESCRIPTION = this.titlecasePipe.transform(this.DESCRIPTION_ngModel_Add.trim());

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

  ClearControls() {
    this.NAME_ngModel_Add = "";
    this.DESCRIPTION_ngModel_Add = "";
    this.Tenant_Add_ngModel = "";
  }
}