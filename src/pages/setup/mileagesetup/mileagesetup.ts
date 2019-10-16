import 'rxjs/add/operator/map';

import * as constants from '../../../app/config/constants';

import { AlertController, IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
//import { FormBuilder, FormGroup } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BaseHttpService } from '../../../services/base-http';
import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { LoginPage } from '../../login/login';
import { MileageSetup_Model } from '../../../models/mileagesetup_model';
import { MileageSetup_Service } from '../../../services/mileagesetup_service';
import { TitleCasePipe } from '@angular/common';
import { UUID } from 'angular2-uuid';

/**
 * Generated class for the MileagesetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-mileagesetup',
  templateUrl: 'mileagesetup.html', providers: [MileageSetup_Service, BaseHttpService, TitleCasePipe]
})
export class MileagesetupPage {
  mileage_entry: MileageSetup_Model = new MileageSetup_Model();
  Mileageform: FormGroup;
  public page: number = 1;
  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_mileage' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  public mileages: MileageSetup_Model[] = [];
  //public mileages: any;

  public AddMileageClicked: boolean = false;
  public EditMileageClicked: boolean = false;
  public Exist_Record: boolean = false;

  public mileage_details: any;
  public exist_record_details: any;

  //Set the Model Name for Add------------------------------------------
  public CATEGORY_ngModel_Add: any;
  public RATE_PER_UNIT_ngModel_Add: any;
  public RATE_DATE_ngModel_Add: any;
  public ACTIVATION_FLAG_ngModel_Add: any;
  //---------------------------------------------------------------------

  Tenant_Add_ngModel: any;
  AdminLogin: boolean = false; Add_Form: boolean = false; Edit_Form: boolean = false;
  tenants: any;
  Key_Param: string = 'api_key=' + constants.DREAMFACTORY_API_KEY;

  public AddMileageClick() {
    console.log(this.AdminLogin);
    if (this.Edit_Form == false) {
      this.AddMileageClicked = true; this.Add_Form = true; this.Edit_Form = false;
      this.ClearControls();
    }
    else {
      alert('Sorry. You are in Edit Mode.');
    }
    // console.log(localStorage.getItem("g_IS_TENANT_ADMIN"));
  }

  public EditClick(MILEAGE_GUID: any) {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();

    this.ClearControls();
    this.AddMileageClicked = true; this.Add_Form = false; this.Edit_Form = true;

    var self = this;
    this.mileagesetupservice
      .get(MILEAGE_GUID)
      .subscribe((data) => {
        self.mileage_details = data;

        this.Tenant_Add_ngModel = self.mileage_details.TENANT_GUID;
        this.CATEGORY_ngModel_Add = self.mileage_details.CATEGORY; localStorage.setItem('Prev_Category', self.mileage_details.CATEGORY); localStorage.setItem('Prev_TenantGuid', self.mileage_details.TENANT_GUID); localStorage.setItem('Prev_RateDate', new Date(self.mileage_details.RATE_DATE).toISOString());
        this.RATE_PER_UNIT_ngModel_Add = self.mileage_details.RATE_PER_UNIT.toFixed(2);
        this.RATE_DATE_ngModel_Add = new Date(self.mileage_details.RATE_DATE).toISOString();

        if (self.mileage_details.ACTIVATION_FLAG == "1") {
          this.ACTIVATION_FLAG_ngModel_Add = true;
        }
        else {
          this.ACTIVATION_FLAG_ngModel_Add = false;
        }

        this.loading.dismissAll();
      });
  }

  public DeleteClick(MILEAGE_GUID: any) {
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
            this.mileagesetupservice.remove(MILEAGE_GUID)
              .subscribe(() => {
                self.mileages = self.mileages.filter((item) => {
                  return item.MILEAGE_GUID != MILEAGE_GUID
                });
              });
          }
        }
      ]
    }); alert.present();
  }

  public CloseMileageClick() {
    if (this.AddMileageClicked == true) {
      this.AddMileageClicked = false;
      this.Add_Form = true; this.Edit_Form = false;
    }
  }

  loading: Loading; button_Add_Disable: boolean = false; button_Edit_Disable: boolean = false; button_Delete_Disable: boolean = false; button_View_Disable: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private mileagesetupservice: MileageSetup_Service, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private titlecasePipe: TitleCasePipe) {
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
        this.Mileageform = fb.group({
          TENANT_NAME: [null],
          CATEGORY: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
          RATE_PER_UNIT: [null, Validators.compose([Validators.pattern('^[0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
          RATE_DATE: ["", Validators.required],
          ACTIVATION_FLAG: [""],
        });
      }
      else {
        this.Mileageform = fb.group({
          CATEGORY: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
          RATE_PER_UNIT: [null, Validators.compose([Validators.pattern('^[0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
          RATE_DATE: ["", Validators.required],
          ACTIVATION_FLAG: [""],
          TENANT_NAME: [null, Validators.required],
        });
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MileagesetupPage');
  }

  ClearLocalStorage() {
    if (localStorage.getItem('Prev_Category') == null) {
      localStorage.setItem('Prev_Category', null);
    }
    else {
      localStorage.removeItem("Prev_Category");
    }
    if (localStorage.getItem('Prev_TenantGuid') == null) {
      localStorage.setItem('Prev_TenantGuid', null);
    }
    else {
      localStorage.removeItem("Prev_TenantGuid");
    }
    if (localStorage.getItem('Prev_RateDate') == null) {
      localStorage.setItem('Prev_RateDate', null);
    }
    else {
      localStorage.removeItem("Prev_RateDate");
    }
  }

  FillTenant() {
    //fill all the tenant details----------------------------
    if (localStorage.getItem("g_USER_GUID") != "sva") {
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
    //Display Grid---------------------------------------------
    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();

    if (localStorage.getItem("g_USER_GUID") == "sva") {
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_mileage_details' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
      this.AdminLogin = true;
    }
    else {
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_mileage_details' + '?filter=(TENANT_GUID=' + localStorage.getItem('g_TENANT_GUID') + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      this.AdminLogin = false;
    }

    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.mileages = data.resource;
        this.mileages.forEach(element => {
          element.RATE_DATE = '' + new Date(element.RATE_DATE.replace(/-/g, "/"))

        });
        this.loading.dismissAll();
      });
  }

  Save() {
    if (this.Mileageform.valid) {
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

      //---------------------------------------------------

      let strPrev_Category: string = "";
      if (localStorage.getItem('Prev_Category') != null) { strPrev_Category = localStorage.getItem('Prev_Category').toUpperCase(); }

      if (this.CATEGORY_ngModel_Add.trim().toUpperCase() != strPrev_Category || this.Tenant_Add_ngModel != localStorage.getItem('Prev_TenantGuid') || this.RATE_DATE_ngModel_Add != localStorage.getItem('Prev_RateDate')) {
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
            alert("The Mileage is already Exist.");
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
    this.mileage_entry.MILEAGE_GUID = UUID.UUID();

    this.mileage_entry.CATEGORY = this.titlecasePipe.transform(this.CATEGORY_ngModel_Add.trim());
    this.mileage_entry.RATE_PER_UNIT = this.RATE_PER_UNIT_ngModel_Add.trim();
    this.mileage_entry.RATE_DATE = this.RATE_DATE_ngModel_Add.trim();
    this.mileage_entry.ACTIVATION_FLAG = this.ACTIVATION_FLAG_ngModel_Add;

    this.mileage_entry.CREATION_TS = new Date().toISOString();
    if (localStorage.getItem("g_USER_GUID") != "sva") {
      this.mileage_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
    }
    else {
      this.mileage_entry.CREATION_USER_GUID = 'sva';
    }
    this.mileage_entry.UPDATE_TS = new Date().toISOString();
    this.mileage_entry.UPDATE_USER_GUID = "";
  }

  SetEntityForUpdate() {
    this.mileage_entry.MILEAGE_GUID = this.mileage_details.MILEAGE_GUID;

    if (this.mileage_entry.CATEGORY == null) { this.mileage_entry.CATEGORY = this.titlecasePipe.transform(this.CATEGORY_ngModel_Add.trim()); }
    if (this.mileage_entry.RATE_PER_UNIT == null) { this.mileage_entry.RATE_PER_UNIT = this.RATE_PER_UNIT_ngModel_Add; }
    if (this.mileage_entry.RATE_DATE == null) { this.mileage_entry.RATE_DATE = this.RATE_DATE_ngModel_Add.trim(); }
    if (this.mileage_entry.ACTIVATION_FLAG == null) { this.mileage_entry.ACTIVATION_FLAG = this.ACTIVATION_FLAG_ngModel_Add; }

    this.mileage_entry.CREATION_TS = this.mileage_details.CREATION_TS;
    this.mileage_entry.CREATION_USER_GUID = this.mileage_details.CREATION_USER_GUID;
    this.mileage_entry.UPDATE_TS = new Date().toISOString();
    if (localStorage.getItem("g_USER_GUID") != "sva") {
      this.mileage_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");
    }
    else {
      this.mileage_entry.UPDATE_USER_GUID = 'sva';
    }
  }

  SetCommonEntityForAddUpdate() {
    if (localStorage.getItem("g_USER_GUID") != "sva") {
      this.mileage_entry.TENANT_GUID = localStorage.getItem("g_TENANT_GUID");
    }
    else {
      this.mileage_entry.TENANT_GUID = this.Tenant_Add_ngModel;
    }
  }

  RemoveStorageValues() {
    localStorage.removeItem("Prev_Category");
    localStorage.removeItem("Prev_TenantGuid");
    localStorage.removeItem("Prev_RateDate");
  }

  Insert() {
    this.mileagesetupservice.save(this.mileage_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          alert('Mileage Registered successfully');

          //Remove all storage values-----------------------------------------
          this.RemoveStorageValues();
          //------------------------------------------------------------------

          this.navCtrl.setRoot(this.navCtrl.getActive().component);
        }
      });
  }

  Update() {
    this.mileagesetupservice.update(this.mileage_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          alert('Mileage updated successfully');

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
      url = this.baseResource_Url + "main_mileage?filter=CATEGORY=" + this.CATEGORY_ngModel_Add.trim() + ' AND TENANT_GUID=' + localStorage.getItem("g_TENANT_GUID") + ' AND RATE_DATE=' + this.RATE_DATE_ngModel_Add + '&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    else {
      url = this.baseResource_Url + "main_mileage?filter=CATEGORY=" + this.CATEGORY_ngModel_Add.trim() + ' AND TENANT_GUID=' + this.Tenant_Add_ngModel + ' AND RATE_DATE=' + this.RATE_DATE_ngModel_Add + '&api_key=' + constants.DREAMFACTORY_API_KEY;
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
    this.CATEGORY_ngModel_Add = "";
    this.RATE_PER_UNIT_ngModel_Add = "";
    this.RATE_DATE_ngModel_Add = "";
    this.ACTIVATION_FLAG_ngModel_Add = false;
    this.Tenant_Add_ngModel = "";
  }
}