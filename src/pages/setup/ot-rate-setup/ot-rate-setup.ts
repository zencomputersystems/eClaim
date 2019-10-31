import 'rxjs/add/operator/map';

import * as constants from '../../../app/config/constants';

import { AlertController, IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
//import { FormBuilder, FormGroup } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BaseHttpService } from '../../../services/base-http';
import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { OTRateSetup_Model } from '../../../models/ot_rate_setup_model';
import { OTRateSetup_Service } from '../../../services/ot_rate_setup_service';
import { TitleCasePipe } from '@angular/common';
import { UUID } from 'angular2-uuid';
import { authCheck } from '../../../shared/authcheck';

/**
 * Generated class for the OtRateSetupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ot-rate-setup',
  templateUrl: 'ot-rate-setup.html', providers: [OTRateSetup_Service, BaseHttpService, TitleCasePipe]
})
export class OtRateSetupPage extends authCheck {

  otrate_entry: OTRateSetup_Model = new OTRateSetup_Model();
  OTRateform: FormGroup;
  public page: number = 1;

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/ot_rate' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  public otrates: OTRateSetup_Model[] = [];

  public AddOTRateClicked: boolean = false;
  public EditOTRateClicked: boolean = false;
  public Exist_Record: boolean = false;

  public otRate_details: any;
  public exist_record_details: any;

  //Set the Model Name for Add------------------------------------------
  public HOURS_ngModel_Add: any;
  public WEEK_DAY_RATE_ngModel_Add: any;
  public WEEK_END_RATE_ngModel_Add: any;
  public Tenant_Add_ngModel: any;
  //---------------------------------------------------------------------

  AdminLogin: boolean = false; Add_Form: boolean = false; Edit_Form: boolean = false;
  tenants: any;
  Key_Param: string = 'api_key=' + constants.DREAMFACTORY_API_KEY;

  public AddOTRateClick() {
    if (this.Edit_Form == false) {
      this.AddOTRateClicked = true; this.Add_Form = true; this.Edit_Form = false;
      this.ClearControls();
    }
    else {
      alert('Sorry. You are in Edit Mode.');
    }
  }

  public EditClick(ot_rate_guid: any) {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();

    this.ClearControls();
    this.AddOTRateClicked = true; this.Add_Form = false; this.Edit_Form = true;

    var self = this;
    this.otratesetupservice
      .get(ot_rate_guid)
      .subscribe((data) => {
        self.otRate_details = data;

        this.Tenant_Add_ngModel = self.otRate_details.tenant_guid;
        this.HOURS_ngModel_Add = self.otRate_details.hours; localStorage.setItem('Prev_Hours', self.otRate_details.hours); localStorage.setItem('Prev_TenantGuid', self.otRate_details.tenant_guid); localStorage.setItem('Prev_Week_Day_Rate', self.otRate_details.week_day_rate);
        this.WEEK_DAY_RATE_ngModel_Add = self.otRate_details.week_day_rate;
        this.WEEK_END_RATE_ngModel_Add = self.otRate_details.week_end_rate;

        this.loading.dismissAll();
      });
  }

  // public DeleteClick(MILEAGE_GUID: any) {
  //   let alert = this.alertCtrl.create({
  //     title: 'Remove Confirmation',
  //     message: 'Are you sure to remove?',
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         handler: () => {
  //           console.log('Cancel clicked');
  //         }
  //       },
  //       {
  //         text: 'OK',
  //         handler: () => {
  //           console.log('OK clicked');
  //           var self = this;
  //           this.mileagesetupservice.remove(MILEAGE_GUID)
  //             .subscribe(() => {
  //               self.mileages = self.mileages.filter((item) => {
  //                 return item.MILEAGE_GUID != MILEAGE_GUID
  //               });
  //             });
  //         }
  //       }
  //     ]
  //   }); alert.present();
  // }

  public CloseOTRateClick() {
    if (this.AddOTRateClicked == true) {
      this.AddOTRateClicked = false;
      this.Add_Form = true; this.Edit_Form = false;
    }
  }

  loading: Loading;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    fb: FormBuilder,
    public http: Http,
    private otratesetupservice: OTRateSetup_Service,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private titlecasePipe: TitleCasePipe
  ) {
    super(navCtrl, true);
    //Display Grid---------------------------------------------
    this.DisplayGrid();

    //-------------------------------------------------------

    if (localStorage.getItem("g_USER_GUID") != "sva") {
      this.OTRateform = fb.group({
        TENANT_NAME: [null],
        HOURS: [null, Validators.compose([Validators.pattern('^[0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        WEEK_DAY_RATE: [null, Validators.compose([Validators.pattern('^[0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        WEEK_END_RATE: ["", Validators.required],
      });
    }
    else {
      this.OTRateform = fb.group({
        TENANT_NAME: [null],
        HOURS: [null, Validators.compose([Validators.pattern('^[0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        WEEK_DAY_RATE: [null, Validators.compose([Validators.pattern('^[0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        WEEK_END_RATE: ["", Validators.required],
      });
    }
}

ionViewDidLoad() {
  console.log('ionViewDidLoad OtRateSetupPage');
}

DisplayGrid() {
  //Display Grid---------------------------------------------
  this.loading = this.loadingCtrl.create({
    content: 'Loading...',
  });
  this.loading.present();

  if (localStorage.getItem("g_USER_GUID") == "sva") {
    this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_ot_rate' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
    this.AdminLogin = true;
  }
  else {
    this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_ot_rate' + '?filter=(TENANT_GUID=' + localStorage.getItem('g_TENANT_GUID') + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.AdminLogin = false;
  }
  this.http
    .get(this.baseResourceUrl)
    .map(res => res.json())
    .subscribe(data => {
      this.otrates = data.resource;
      this.loading.dismissAll();
    });
}

Save() {
  if (this.OTRateform.valid) {
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

    let strPrev_Hours: string = "";
    if (localStorage.getItem('Prev_Hours') != null) { strPrev_Hours = localStorage.getItem('Prev_Hours').toUpperCase(); }

    if (this.HOURS_ngModel_Add.trim().toUpperCase() != strPrev_Hours || this.Tenant_Add_ngModel != localStorage.getItem('Prev_TenantGuid') || this.WEEK_DAY_RATE_ngModel_Add != localStorage.getItem('Prev_Week_Day_Rate')) {
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
          alert("The ot rate is already Exist.");
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
  this.otrate_entry.ot_rate_guid = UUID.UUID();

  this.otrate_entry.hours = this.titlecasePipe.transform(this.HOURS_ngModel_Add.trim());
  this.otrate_entry.week_day_rate = this.WEEK_DAY_RATE_ngModel_Add.trim();
  this.otrate_entry.week_end_rate = this.WEEK_END_RATE_ngModel_Add.trim();
  this.otrate_entry.tenant_guid = this.Tenant_Add_ngModel;
}

SetEntityForUpdate() {
  this.otrate_entry.ot_rate_guid = this.otRate_details.ot_rate_guid;
}

SetCommonEntityForAddUpdate() {
  this.otrate_entry.hours = this.titlecasePipe.transform(this.HOURS_ngModel_Add.trim());
  this.otrate_entry.week_day_rate = this.WEEK_DAY_RATE_ngModel_Add.trim();
  this.otrate_entry.week_end_rate = this.WEEK_END_RATE_ngModel_Add.trim();
  this.otrate_entry.tenant_guid = this.Tenant_Add_ngModel;
}

RemoveStorageValues() {
  localStorage.removeItem("Prev_Hours");
  localStorage.removeItem("Prev_TenantGuid");
  localStorage.removeItem("Prev_Week_Day_Rate");
}

Insert() {
  this.otratesetupservice.save(this.otrate_entry)
    .subscribe((response) => {
      if (response.status == 200) {
        alert('OT Rate Registered successfully');

        //Remove all storage values-----------------------------------------
        this.RemoveStorageValues();
        //------------------------------------------------------------------

        this.navCtrl.setRoot(this.navCtrl.getActive().component);
      }
    });
}

Update() {
  this.otratesetupservice.update(this.otrate_entry)
    .subscribe((response) => {
      if (response.status == 200) {
        alert('OT Rate updated successfully');

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
    url = this.baseResource_Url + "ot_rate?filter=hours=" + this.HOURS_ngModel_Add.trim() + ' AND TENANT_GUID=' + localStorage.getItem("g_TENANT_GUID") + ' AND week_day_rate=' + this.WEEK_DAY_RATE_ngModel_Add + '&api_key=' + constants.DREAMFACTORY_API_KEY;
  }
  else {
    url = this.baseResource_Url + "ot_rate?filter=hours=" + this.HOURS_ngModel_Add.trim() + ' AND TENANT_GUID=' + this.Tenant_Add_ngModel + ' AND week_day_rate=' + this.WEEK_DAY_RATE_ngModel_Add + '&api_key=' + constants.DREAMFACTORY_API_KEY;
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
  this.HOURS_ngModel_Add = "";
  this.WEEK_DAY_RATE_ngModel_Add = "";
  this.WEEK_END_RATE_ngModel_Add = "";
  this.Tenant_Add_ngModel = "";
}

}
