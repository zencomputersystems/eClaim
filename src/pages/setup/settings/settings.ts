import 'rxjs/add/operator/map';

import * as constants from '../../../app/config/constants';

import { AlertController, IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BaseHttpService } from '../../../services/base-http';
import { Component } from '@angular/core';
// import { GlobalFunction } from '../../../shared/GlobalFunction';
import { Http } from '@angular/http';
import { Settings_Model } from '../../../models/settings_model';
import { Settings_Service } from '../../../services/settings_service';
import { TitleCasePipe } from '@angular/common';
import { UUID } from 'angular2-uuid';
import { authCheck } from '../../../shared/authcheck';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html', providers: [Settings_Service, BaseHttpService, TitleCasePipe]
})
export class SettingsPage extends authCheck {
  AdminLogin: boolean = false; Add_Form: boolean = false; Edit_Form: boolean = false;
  KEY_NAME_ngModel_Add: any; KEY_VALUE_ngModel_Add: any;
  AddSettingsClicked: boolean = false;
  loading: Loading; 

  setting_details: Settings_Model = new Settings_Model(); setting_entry: Settings_Model = new Settings_Model();
  public setting_detail: Settings_Model[] = [];
  public settings: Settings_Model[] = [];
  Settingsform: FormGroup;

  public page: number = 1;

  constructor(
    fb: FormBuilder, 
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public http: Http, 
    private settingservice: Settings_Service, 
    private alertCtrl: AlertController, 
    private loadingCtrl: LoadingController    ) {
    super(navCtrl, true);
        //Display Grid---------------------------------------------      
        this.DisplayGrid();

        //----------------------------------------------------------

        this.Settingsform = fb.group({
          KEY_NAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
          KEY_VALUE: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        });
  }

  public AddSettingsClick() {
    if (this.Edit_Form == false) {
      this.AddSettingsClicked = true; this.Add_Form = true; this.Edit_Form = false;
      this.ClearControls();
    }
    else {
      alert('Sorry. You are in Edit Mode.');
    }
  }

  public CloseSettingssClick() {
    if (this.AddSettingsClicked == true) {
      this.AddSettingsClicked = false;
      this.Add_Form = true; this.Edit_Form = false;
    }
  }

  setting_details_new: any;
  public EditClick(PERMISSION_KEY_GUID: any) {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();

    this.ClearControls();
    this.AddSettingsClicked = true; this.Add_Form = false; this.Edit_Form = true;

    var self = this;
    this.settingservice
      .get(PERMISSION_KEY_GUID)
      .subscribe((data) => {
        self.setting_details_new = data;
        this.KEY_NAME_ngModel_Add = self.setting_details_new.KEY_NAME;
        this.KEY_VALUE_ngModel_Add = self.setting_details_new.KEY_VALUE;
        localStorage.setItem('Prev_KEY_NAME', self.setting_details_new.KEY_NAME);

        this.loading.dismissAll();
      });
  }

  public DeleteClick(PERMISSION_KEY_GUID: any) {
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
            this.settingservice.remove(PERMISSION_KEY_GUID, "permission_keys")
              .subscribe(() => {
                self.settings = self.settings.filter((item) => {
                  return item.PERMISSION_KEY_GUID != PERMISSION_KEY_GUID
                });
              });
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
            this.DisplayGrid();
          }
        }
      ]
    }); alert.present();
  }

  DisplayGrid() {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();

    let view_url: string = "";
    view_url = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/permission_keys' + '?order=KEY_NAME&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http
      .get(view_url)
      .map(res => res.json())
      .subscribe(data => {
        this.setting_details_new = this.settings = data.resource;

        this.loading.dismissAll();
      });
  }

  ClearControls() {
    this.KEY_NAME_ngModel_Add = "";
    this.KEY_VALUE_ngModel_Add = "";
  }


  Save() {
    if (this.Settingsform.valid) {
      //for Save Set Entities------------------------------------------------------------------------
      if (this.Add_Form == true) {
        this.SetEntityForAdd();
      }
      //for Update Set Entities----------------------------------------------------------------------
      else {
        this.SetEntityForUpdate();
      }
      //Common Entitity For Insert/Update-----------------    
      this.SetCommonEntityForAddUpdate();

      //Load the Controller--------------------------------
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...',
      });
      this.loading.present();
      //--------------------------------------------------

      let strPrev_KEY_NAME: string = "";
      if (localStorage.getItem('Prev_KEY_NAME') != null) {
        strPrev_KEY_NAME = localStorage.getItem('Prev_KEY_NAME').toUpperCase();
      }

      if (this.KEY_NAME_ngModel_Add.trim().toUpperCase() != strPrev_KEY_NAME) {
        let val = this.CheckDuplicate();
        val.then((res) => {
          if (res.toString() == "0") {
            //---Insert or Update-----------
            if (this.Add_Form == true) {
              //**************Save service if it is new details***************************              
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
            alert("The Keyname is already exist.");
            this.loading.dismissAll();
          }
        });
        val.catch((err) => {
          console.log(err);
        });
      }
      else {
        //Simple update----------        
        this.Update();
      }
    }
  }

  SetEntityForAdd() {
    if (this.Add_Form == true) {
      this.setting_entry.PERMISSION_KEY_GUID = UUID.UUID();
      this.setting_entry.CREATION_TS = new Date().toISOString();
      if (localStorage.getItem("g_USER_GUID") != "sva") {
        this.setting_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
      }
      else {
        this.setting_entry.CREATION_USER_GUID = 'sva';
      }
      this.setting_entry.UPDATE_TS = new Date().toISOString();
      this.setting_entry.UPDATE_USER_GUID = "";
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  SetEntityForUpdate() {
    this.setting_entry.PERMISSION_KEY_GUID = this.setting_details_new.PERMISSION_KEY_GUID;
    this.setting_entry.CREATION_TS = this.setting_details_new.CREATION_TS;
    this.setting_entry.CREATION_USER_GUID = this.setting_details_new.CREATION_USER_GUID;
    this.setting_entry.UPDATE_TS = new Date().toISOString();
    if (localStorage.getItem("g_USER_GUID") != "sva") {
      this.setting_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");
    }
    else {
      this.setting_entry.UPDATE_USER_GUID = 'sva';
    }
  }

  SetCommonEntityForAddUpdate() {
    // this.setting_entry.KEY_NAME = this.titlecasePipe.transform(this.KEY_NAME_ngModel_Add.trim());
    // this.setting_entry.KEY_VALUE = this.titlecasePipe.transform(this.KEY_VALUE_ngModel_Add.trim());
    this.setting_entry.KEY_NAME = this.KEY_NAME_ngModel_Add.trim();
    this.setting_entry.KEY_VALUE = this.KEY_VALUE_ngModel_Add.trim();
    this.setting_entry.SHIFT_GUID = null;
    this.setting_entry.DEVICE_GUID = null;
    this.setting_entry.ROLE_GUID = null;
    this.setting_entry.COMPANY_GUID = null;
    this.setting_entry.DEPT_GUID = null;
    this.setting_entry.USER_GUID = null;
    if (localStorage.getItem("g_USER_GUID") != "sva") {
      this.setting_entry.TENANT_COMPANY_GUID = localStorage.getItem("g_TENANT_COMPANY_GUID");
      this.setting_entry.TENANT_COMPANY_SITE_GUID = localStorage.getItem("g_TENANT_COMPANY_SITE_GUID");
      this.setting_entry.TENANT_GUID = localStorage.getItem("g_TENANT_GUID");
    }
    else {
      this.setting_entry.TENANT_GUID = null;
      this.setting_entry.TENANT_COMPANY_GUID = null;
      this.setting_entry.TENANT_COMPANY_SITE_GUID = null;
    }
  }

  RemoveStorageValues() {
    localStorage.removeItem("Prev_KEY_NAME");
  }

  Insert() {
    this.settingservice.save(this.setting_entry, "permission_keys")
      .subscribe((response) => {
        if (response.status == 200) {
          alert('Setting Key registered successfully');

          //Remove all storage values-----------------------------------------          
          this.RemoveStorageValues();
          //------------------------------------------------------------------

          this.navCtrl.setRoot(this.navCtrl.getActive().component);
        }
      });
  }

  Update() {
    this.settingservice.update(this.setting_entry, "permission_keys")
      .subscribe((response) => {
        if (response.status == 200) {
          alert('Setting Key updated successfully');

          //Remove all storage values-----------------------------------------          
          this.RemoveStorageValues();
          //------------------------------------------------------------------

          this.navCtrl.setRoot(this.navCtrl.getActive().component);
        }
      });
  }

  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
  CheckDuplicate() {
    let url: string = "";
    url = this.baseResource_Url + "permission_keys?filter=KEY_NAME=" + this.KEY_NAME_ngModel_Add.trim() + '&api_key=' + constants.DREAMFACTORY_API_KEY;

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
