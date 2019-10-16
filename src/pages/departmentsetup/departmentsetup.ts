import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { TitleCasePipe } from '@angular/common';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { DepartmentSetup_Model } from '../../models/departmentsetup_model';
import { DepartmentSetup_Service } from '../../services/departmentsetup_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';
import { LoginPage } from '../login/login';

/**
 * Generated class for the DepartmentsetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-departmentsetup',
  templateUrl: 'departmentsetup.html', providers: [DepartmentSetup_Service, BaseHttpService, TitleCasePipe]
})
export class DepartmentsetupPage {
  department_entry: DepartmentSetup_Model = new DepartmentSetup_Model();
  Departmentform: FormGroup;
  public page:number = 1;
  baseResourceUrl: string = "";
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  public departments: DepartmentSetup_Model[] = [];

  public AddDepartmentClicked: boolean = false;
  public Exist_Record: boolean = false;

  public department_details: any;
  public exist_record_details: any;

  //Set the Model Name for Add------------------------------------------
  public NAME_ngModel_Add: any;
  public DESCRIPTION_ngModel_Add: any;
  //---------------------------------------------------------------------

  Tenant_Add_ngModel: any;
  AdminLogin: boolean = false; Add_Form: boolean = false; Edit_Form: boolean = false;
  tenants: any;
  Key_Param: string = 'api_key=' + constants.DREAMFACTORY_API_KEY;

  public AddDepartmentClick() {
    if (this.Edit_Form == false) {
      this.AddDepartmentClicked = true; this.Add_Form = true; this.Edit_Form = false;
      this.ClearControls();
    }
    else {
      alert('Sorry. You are in Edit Mode.');
    }
  }

  public EditClick(DEPARTMENT_GUID: any) {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();

    this.ClearControls();
    this.AddDepartmentClicked = true; this.Add_Form = false; this.Edit_Form = true;

    var self = this;
    this.departmentsetupservice
      .get(DEPARTMENT_GUID)
      .subscribe((data) => {
        self.department_details = data;
        this.Tenant_Add_ngModel = self.department_details.TENANT_GUID;
        this.NAME_ngModel_Add = self.department_details.NAME; localStorage.setItem('Prev_Name', self.department_details.NAME); localStorage.setItem('Prev_TenantGuid', self.department_details.TENANT_GUID);
        this.DESCRIPTION_ngModel_Add = self.department_details.DESCRIPTION;

        this.loading.dismissAll();
      });
  }

  public DeleteClick(DEPARTMENT_GUID: any) {
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
            this.departmentsetupservice.remove(DEPARTMENT_GUID)
              .subscribe(() => {
                self.departments = self.departments.filter((item) => {
                  return item.DEPARTMENT_GUID != DEPARTMENT_GUID
                });
              });
            //this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        }
      ]
    }); alert.present();
  }

  public CloseDepartmentClick() {
    if (this.AddDepartmentClicked == true) {
      this.AddDepartmentClicked = false;
      this.Add_Form = true; this.Edit_Form = false;
    }
  }

  loading: Loading; button_Add_Disable:boolean = false; button_Edit_Disable: boolean = false; button_Delete_Disable: boolean = false; button_View_Disable: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private departmentsetupservice: DepartmentSetup_Service, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private titlecasePipe: TitleCasePipe) {
    if (localStorage.getItem("g_USER_GUID") == null) {
      alert('Sorry, you are not logged in. Please login.');
      this.navCtrl.push(LoginPage);
    }
    else {
      this.button_Add_Disable = false; this.button_Edit_Disable = false; this.button_Delete_Disable = false; this.button_View_Disable = false;
      if (localStorage.getItem("g_USER_GUID") != "sva") {
        //Get the role for this page------------------------------        
        if(localStorage.getItem("g_KEY_ADD") == "0"){ this.button_Add_Disable = true; }
        if(localStorage.getItem("g_KEY_EDIT") == "0"){ this.button_Edit_Disable = true; }
        if(localStorage.getItem("g_KEY_DELETE") == "0"){ this.button_Delete_Disable = true; }
        if(localStorage.getItem("g_KEY_VIEW") == "0"){ this.button_View_Disable = true; }
        
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
        this.Departmentform = fb.group({
          NAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
          DESCRIPTION: [null],
        });
      }
      else {
        this.Departmentform = fb.group({
          NAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
          DESCRIPTION: [null],
          TENANT_NAME: [null, Validators.required],
        });
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DepartmentsetupPage');
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
      this.departments = this.stores;      
      return;
    }
    this.departments = this.filter({
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
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_department_details' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
      this.AdminLogin = true;
    }
    else {
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_department_details' + '?filter=(TENANT_GUID=' + localStorage.getItem('g_TENANT_GUID') + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      this.AdminLogin = false;
    }

    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.departments = this.stores = data.resource;

        this.loading.dismissAll();
      });
  }

  Save() {
    if (this.Departmentform.valid) {
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
            alert("The Department is already Exist.");
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
    this.department_entry.DEPARTMENT_GUID = UUID.UUID();
    this.department_entry.CREATION_TS = new Date().toISOString();
    if (localStorage.getItem("g_USER_GUID") != "sva") {
      this.department_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
    }
    else {
      this.department_entry.CREATION_USER_GUID = 'sva';
    }
    this.department_entry.UPDATE_TS = new Date().toISOString();
    this.department_entry.UPDATE_USER_GUID = "";
  }

  SetEntityForUpdate() {
    this.department_entry.DEPARTMENT_GUID = this.department_details.DEPARTMENT_GUID;
    this.department_entry.CREATION_TS = this.department_details.CREATION_TS;
    this.department_entry.CREATION_USER_GUID = this.department_details.CREATION_USER_GUID;
    this.department_entry.UPDATE_TS = new Date().toISOString();
    if (localStorage.getItem("g_USER_GUID") != "sva") {
      this.department_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");
    }
    else {
      this.department_entry.UPDATE_USER_GUID = 'sva';
    }
  }

  SetCommonEntityForAddUpdate() {
    this.department_entry.NAME = this.titlecasePipe.transform(this.NAME_ngModel_Add.trim());
    this.department_entry.DESCRIPTION = this.titlecasePipe.transform(this.DESCRIPTION_ngModel_Add.trim());

    if (localStorage.getItem("g_USER_GUID") != "sva") {
      this.department_entry.TENANT_GUID = localStorage.getItem("g_TENANT_GUID");
    }
    else {
      this.department_entry.TENANT_GUID = this.Tenant_Add_ngModel;
    }
  }

  RemoveStorageValues() {
    localStorage.removeItem("Prev_Name");
    localStorage.removeItem("Prev_TenantGuid");
  }

  Insert() {
    this.departmentsetupservice.save(this.department_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          alert('Department Registered successfully');

          //Remove all storage values-----------------------------------------
          this.RemoveStorageValues();
          //------------------------------------------------------------------

          this.navCtrl.setRoot(this.navCtrl.getActive().component);
        }
      });
  }

  Update() {
    this.departmentsetupservice.update(this.department_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          alert('Department updated successfully');

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
      url = this.baseResource_Url + "main_department?filter=NAME=" + this.NAME_ngModel_Add.trim() + ' AND TENANT_GUID=' + localStorage.getItem("g_TENANT_GUID") + '&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    else {
      url = this.baseResource_Url + "main_department?filter=NAME=" + this.NAME_ngModel_Add.trim() + ' AND TENANT_GUID=' + this.Tenant_Add_ngModel + '&api_key=' + constants.DREAMFACTORY_API_KEY;
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