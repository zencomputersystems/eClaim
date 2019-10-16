import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { TitleCasePipe } from '@angular/common';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { DeviceSetup_Model } from '../../models/devicesetup_model';
import { DeviceSetup_Service } from '../../services/devicesetup_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';
import { LoginPage } from '../login/login';

/**
 * Generated class for the DeviceSetupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-device-setup',
  templateUrl: 'device-setup.html', providers: [DeviceSetup_Service, BaseHttpService, TitleCasePipe]
})
export class DeviceSetupPage {
  Deviceform: FormGroup;
  device_entry: DeviceSetup_Model = new DeviceSetup_Model();
  public page: number = 1;
  baseResourceUrl: string;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  public devices: DeviceSetup_Model[] = [];
  public AddDeviceClicked: boolean = false;
  public Exist_Record: boolean = false;

  public device_details: any;
  public exist_record_details: any;

  //Set the Model Name for Add------------------------------------------
  public NAME_ngModel_Add: any;
  public Tenant_Add_ngModel: any;
  public Role_ngModel: any;
  public Status_ngModel: any;
  //--------------------------------------------------------------------


  AdminLogin: boolean = false; Add_Form: boolean = false; Edit_Form: boolean = false;
  tenants: any;
  Key_Param: string = 'api_key=' + constants.DREAMFACTORY_API_KEY;
  HeaderText: string = "";

  public AddDeviceClick() {
    if (this.Edit_Form == false) {
      this.AddDeviceClicked = true; this.Add_Form = true; this.Edit_Form = false;
      this.ClearControls();
      this.HeaderText = "ADD NEW DEVICE";
    }
    else {
      alert('Sorry. You are in Edit Mode.');
    }
  }

  public CloseDeviceClick() {
    if (this.AddDeviceClicked == true) {
      this.AddDeviceClicked = false;
      this.Add_Form = true; this.Edit_Form = false;
    }
  }

  public EditClick(DEVICE_GUID: any) {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();

    this.ClearControls();
    this.AddDeviceClicked = true; this.Add_Form = false; this.Edit_Form = true;
    this.HeaderText = "UPDATE DEVICE";

    var self = this;
    this.devicesetupservice
      .get(DEVICE_GUID)
      .subscribe((data) => {
        self.device_details = data;
        this.Tenant_Add_ngModel = self.device_details.TENANT_GUID;
        this.NAME_ngModel_Add = self.device_details.DEVICE_NAME; localStorage.setItem('Prev_Name', self.device_details.DEVICE_NAME); localStorage.setItem('Prev_TenantGuid', self.device_details.TENANT_GUID);
        this.Role_ngModel = self.device_details.ROLE;
        this.Status_ngModel = self.device_details.ACTIVATION_FLAG;

        this.loading.dismissAll();
      });
  }

  public DeleteClick(DEVICE_GUID: any) {
    // let alert = this.alertCtrl.create({
    //   title: 'Remove Confirmation',
    //   message: 'Are you sure to remove?',
    //   buttons: [
    //     {
    //       text: 'Cancel',
    //       role: 'cancel',
    //       handler: () => {
    //         console.log('Cancel clicked');
    //       }
    //     },
    //     {
    //       text: 'OK',
    //       handler: () => {
    //         console.log('OK clicked');
    //         var self = this;
    //         this.devicesetupservice.remove(DEVICE_GUID)
    //           .subscribe(() => {
    //             self.devices = self.devices.filter((item) => {
    //               return item.DEVICE_GUID != DEVICE_GUID
    //             });
    //           });
    //         //this.navCtrl.setRoot(this.navCtrl.getActive().component);
    //       }
    //     }
    //   ]
    // }); alert.present();

    let val = this.Check_Record_Exist(DEVICE_GUID);
    val.then((res) => {
      if (res.toString() == "0") {
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

                this.devicesetupservice.remove(DEVICE_GUID)
                  .subscribe(() => {
                    self.devices = self.devices.filter((item) => {
                      return item.DEVICE_GUID != DEVICE_GUID
                    });
                  });
                // this.navCtrl.setRoot(this.navCtrl.getActive().component);
              }
            }
          ]
        }); alert.present();
        // ----------------------------------------------------------------------------
      }
      else {
        alert("Sorry, this device is already in use.");
      }
    });
    val.catch((err) => {
      console.log(err);
    });
  }

  Check_Record_Exist(DEVICE_GUID: any) {
    let url: string = "";
    url = this.baseResource_Url + "device_raw_data?filter=DEVICE_GUID=" + DEVICE_GUID + '&api_key=' + constants.DREAMFACTORY_API_KEY;

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

  loading: Loading; button_Add_Disable: boolean = false; button_Edit_Disable: boolean = false; button_Delete_Disable: boolean = false; button_View_Disable: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private devicesetupservice: DeviceSetup_Service, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private titlecasePipe: TitleCasePipe) {
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
          this.Deviceform = fb.group({
            NAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
            ROLE: [null, Validators.required],
            STATUS: [null, Validators.required],
          });
        }
        else {
          this.Deviceform = fb.group({
            NAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
            ROLE: [null, Validators.required],
            STATUS: [null, Validators.required],
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
    console.log('ionViewDidLoad DeviceSetupPage');
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
      this.devices = this.stores;
      return;
    }
    this.devices = this.filter({
      DEVICE_NAME: val,
      ROLE: val,
      ACTIVATION_FLAG: val,
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
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_device' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
      this.AdminLogin = true;
    }
    else {
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_device' + '?filter=(TENANT_GUID=' + localStorage.getItem('g_TENANT_GUID') + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      this.AdminLogin = false;
    }

    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.devices = this.stores = data.resource;
        this.loading.dismissAll();
      });
  }

  Save() {
    if (this.Deviceform.valid) {
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
            alert("The Device is already Exist.");
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
    this.device_entry.DEVICE_GUID = UUID.UUID();
    this.device_entry.CREATION_TS = new Date().toISOString();
    if (localStorage.getItem("g_USER_GUID") != "sva") {
      this.device_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
    }
    else {
      this.device_entry.CREATION_USER_GUID = 'sva';
    }
    this.device_entry.UPDATE_TS = new Date().toISOString();
    this.device_entry.UPDATE_USER_GUID = "";
  }

  SetEntityForUpdate() {
    this.device_entry.DEVICE_GUID = this.device_details.DEVICE_GUID;
    this.device_entry.CREATION_TS = this.device_details.CREATION_TS;
    this.device_entry.CREATION_USER_GUID = this.device_details.CREATION_USER_GUID;
    this.device_entry.UPDATE_TS = new Date().toISOString();
    if (localStorage.getItem("g_USER_GUID") != "sva") {
      this.device_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");
    }
    else {
      this.device_entry.UPDATE_USER_GUID = 'sva';
    }
  }

  SetCommonEntityForAddUpdate() {
    this.device_entry.DEVICE_NAME = this.titlecasePipe.transform(this.NAME_ngModel_Add.trim());
    this.device_entry.ROLE = this.Role_ngModel;
    this.device_entry.ACTIVATION_FLAG = this.Status_ngModel;

    if (localStorage.getItem("g_USER_GUID") != "sva") {
      this.device_entry.TENANT_GUID = localStorage.getItem("g_TENANT_GUID");
    }
    else {
      this.device_entry.TENANT_GUID = this.Tenant_Add_ngModel;
    }
  }

  RemoveStorageValues() {
    localStorage.removeItem("Prev_Name");
    localStorage.removeItem("Prev_TenantGuid");
  }

  Insert() {
    this.devicesetupservice.save(this.device_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          alert('Device registered successfully');

          //Remove all storage values-----------------------------------------
          this.RemoveStorageValues();
          //------------------------------------------------------------------

          this.navCtrl.setRoot(this.navCtrl.getActive().component);
        }
      });
  }

  Update() {
    this.devicesetupservice.update(this.device_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          alert('Device updated successfully');

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
      url = this.baseResource_Url + "main_device?filter=DEVICE_NAME=" + this.NAME_ngModel_Add.trim() + ' AND TENANT_GUID=' + localStorage.getItem("g_TENANT_GUID") + '&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    else {
      url = this.baseResource_Url + "main_device?filter=DEVICE_NAME=" + this.NAME_ngModel_Add.trim() + ' AND TENANT_GUID=' + this.Tenant_Add_ngModel + '&api_key=' + constants.DREAMFACTORY_API_KEY;
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
    this.Status_ngModel = "";
    this.Role_ngModel = "";
    this.Tenant_Add_ngModel = "";
  }


}
