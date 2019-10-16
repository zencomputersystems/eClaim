import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { TitleCasePipe } from '@angular/common';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { DesignationSetup_Model } from '../../models/designationsetup_model';
import { DesignationSetup_Service } from '../../services/designationsetup_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';
import { LoginPage } from '../login/login';

/**
 * Generated class for the DesignationsetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-designationsetup',
  templateUrl: 'designationsetup.html', providers: [DesignationSetup_Service, BaseHttpService, TitleCasePipe]
})
export class DesignationsetupPage {

  Designationform: FormGroup;
  designation_entry: DesignationSetup_Model = new DesignationSetup_Model();
  public page:number = 1;
  baseResourceUrl: string;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  public designations: DesignationSetup_Model[] = [];
  public AddDesignationClicked: boolean = false;
  public Exist_Record: boolean = false;

  public designation_details: any;
  public exist_record_details: any;

  //Set the Model Name for Add------------------------------------------
  public NAME_ngModel_Add: any;
  public DESCRIPTION_ngModel_Add: any;
  //---------------------------------------------------------------------

  Tenant_Add_ngModel: any;
  AdminLogin: boolean = false; Add_Form: boolean = false; Edit_Form: boolean = false;
  tenants: any;
  Key_Param: string = 'api_key=' + constants.DREAMFACTORY_API_KEY;
  HeaderText: string = "";

  public AddDesignationClick() {
    if (this.Edit_Form == false) {
      this.AddDesignationClicked = true; this.Add_Form = true; this.Edit_Form = false;
      this.ClearControls();
      this.HeaderText = "REGISTER NEW DESIGNATION";
    }
    else {
      alert('Sorry. You are in Edit Mode.');
    }
  }

  public EditClick(DESIGNATION_GUID: any) {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();

    this.ClearControls();
    this.AddDesignationClicked = true; this.Add_Form = false; this.Edit_Form = true;
    this.HeaderText = "UPDATE DESIGNATION";

    var self = this;
    this.designationsetupservice
      .get(DESIGNATION_GUID)
      .subscribe((data) => {
        self.designation_details = data;
        this.Tenant_Add_ngModel = self.designation_details.TENANT_GUID;
        this.NAME_ngModel_Add = self.designation_details.NAME; localStorage.setItem('Prev_Name', self.designation_details.NAME); localStorage.setItem('Prev_TenantGuid', self.designation_details.TENANT_GUID);
        this.DESCRIPTION_ngModel_Add = self.designation_details.DESCRIPTION;

        this.loading.dismissAll();
      });
  }

  public DeleteClick(DESIGNATION_GUID: any) {
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
            this.designationsetupservice.remove(DESIGNATION_GUID)
              .subscribe(() => {
                self.designations = self.designations.filter((item) => {
                  return item.DESIGNATION_GUID != DESIGNATION_GUID
                });
              });
            //this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        }
      ]
    }); alert.present();
  }

  public CloseDesignationClick() {
    if (this.AddDesignationClicked == true) {
      this.AddDesignationClicked = false;
      this.Add_Form = true; this.Edit_Form = false;
    }
  }

  loading: Loading; button_Add_Disable: boolean = false; button_Edit_Disable: boolean = false; button_Delete_Disable: boolean = false; button_View_Disable: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private designationsetupservice: DesignationSetup_Service, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private titlecasePipe: TitleCasePipe) {
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

        //-------------------------------------------------------
        if (localStorage.getItem("g_USER_GUID") != "sva") {
          this.Designationform = fb.group({
            NAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
            DESCRIPTION: [null],
          });
        }
        else {
          this.Designationform = fb.group({
            NAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
            DESCRIPTION: [null],
            TENANT_NAME: [null, Validators.required],
          });
        }
      }
      else {
        alert('Sorry, you are not authorized for the action. authorized.');
        this.navCtrl.setRoot(this.navCtrl.getActive().component);
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DesignationsetupPage');
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

  stores: any[]; 
  search(searchString: any) {
    let val = searchString.target.value;
    if (!val || !val.trim()) {
      this.designations = this.stores;      
      return;
    }
    this.designations = this.filter({
      NAME: val      
    });
  }

  filter(params?: any) {
    if (!params) {
      return this.stores;
    }
    
    return this.stores.filter((item) => {
      for (let key in params) {
        let field = item[key];
        if (typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
          return item;
        } else if (field == params[key]) {
          return item;
        }
      }
      return null;
    });
  }

  DisplayGrid() {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();

    if (localStorage.getItem("g_USER_GUID") == "sva") {
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_designation_details' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
      this.AdminLogin = true;
    }
    else {
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_designation_details' + '?filter=(TENANT_GUID=' + localStorage.getItem('g_TENANT_GUID') + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      this.AdminLogin = false;
    }

    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.designations = this.stores = data.resource;
        this.loading.dismissAll();
      });
  }

  Save() {
    if (this.Designationform.valid) {
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
            alert("The Designation is already Exist.");
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
    this.designation_entry.DESIGNATION_GUID = UUID.UUID();
    this.designation_entry.CREATION_TS = new Date().toISOString();
    if (localStorage.getItem("g_USER_GUID") != "sva") {
      this.designation_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
    }
    else {
      this.designation_entry.CREATION_USER_GUID = 'sva';
    }
    this.designation_entry.UPDATE_TS = new Date().toISOString();
    this.designation_entry.UPDATE_USER_GUID = "";
  }

  SetEntityForUpdate() {
    this.designation_entry.DESIGNATION_GUID = this.designation_details.DESIGNATION_GUID;
    this.designation_entry.CREATION_TS = this.designation_details.CREATION_TS;
    this.designation_entry.CREATION_USER_GUID = this.designation_details.CREATION_USER_GUID;
    this.designation_entry.UPDATE_TS = new Date().toISOString();
    if (localStorage.getItem("g_USER_GUID") != "sva") {
      this.designation_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");
    }
    else {
      this.designation_entry.UPDATE_USER_GUID = 'sva';
    }
  }

  SetCommonEntityForAddUpdate() {
    this.designation_entry.NAME = this.titlecasePipe.transform(this.NAME_ngModel_Add.trim());
    this.designation_entry.DESCRIPTION = this.titlecasePipe.transform(this.DESCRIPTION_ngModel_Add.trim());

    if (localStorage.getItem("g_USER_GUID") != "sva") {
      this.designation_entry.TENANT_GUID = localStorage.getItem("g_TENANT_GUID");
    }
    else {
      this.designation_entry.TENANT_GUID = this.Tenant_Add_ngModel;
    }
  }

  RemoveStorageValues() {
    localStorage.removeItem("Prev_Name");
    localStorage.removeItem("Prev_TenantGuid");
  }

  Insert() {
    this.designationsetupservice.save(this.designation_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          alert('Designation Registered successfully');

          //Remove all storage values-----------------------------------------
          this.RemoveStorageValues();
          //------------------------------------------------------------------

          this.navCtrl.setRoot(this.navCtrl.getActive().component);
        }
      });
  }

  Update() {
    this.designationsetupservice.update(this.designation_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          alert('Designation updated successfully');

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
      url = this.baseResource_Url + "main_designation?filter=NAME=" + this.NAME_ngModel_Add.trim() + ' AND TENANT_GUID=' + localStorage.getItem("g_TENANT_GUID") + '&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    else {
      url = this.baseResource_Url + "main_designation?filter=NAME=" + this.NAME_ngModel_Add.trim() + ' AND TENANT_GUID=' + this.Tenant_Add_ngModel + '&api_key=' + constants.DREAMFACTORY_API_KEY;
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

