import 'rxjs/add/operator/map';

import * as constants from '../../../app/config/constants';

import { AlertController, IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Headers, Http, RequestOptions } from '@angular/http';

import { BaseHttpService } from '../../../services/base-http';
import { Component } from '@angular/core';
import { LoginPage } from '../../login/login';
import { Settings_Model } from '../../../models/settings_model';
import { Settings_Service } from '../../../services/settings_service';
import { TitleCasePipe } from '@angular/common';
import { UUID } from 'angular2-uuid';

// import { Item } from 'ionic-angular/components/item/item';
// import { Flags } from '@ionic-native/file';

/**
 * Generated class for the CompanysettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-companysettings',
  templateUrl: 'companysettings.html', providers: [Settings_Service, BaseHttpService, TitleCasePipe]
})
export class CompanysettingsPage {
  CompanySettingsform: FormGroup;
  loading: Loading; button_Add_Disable: boolean = false; button_Edit_Disable: boolean = false; button_Delete_Disable: boolean = false; button_View_Disable: boolean = false;
  setting_details_new: any;

  SettingsModel: Settings_Model[] = [];
  Settings_Entry: Settings_Model = new Settings_Model();

  CountryCodes: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private settingservice: Settings_Service, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private titlecasePipe: TitleCasePipe) {
    if (localStorage.getItem("g_USER_GUID") == null) {
      alert('Sorry, you are not logged in. Please login.');
      this.navCtrl.setRoot(LoginPage);
    }
    else {
      this.button_Add_Disable = false; this.button_Edit_Disable = false; this.button_Delete_Disable = false; this.button_View_Disable = false;
      if (localStorage.getItem("g_USER_GUID") != "sva") {
        //Get the role for this page------------------------------        
        if (localStorage.getItem("g_KEY_ADD") == "0") { this.button_Add_Disable = true; }
        if (localStorage.getItem("g_KEY_EDIT") == "0") { this.button_Edit_Disable = true; }
        if (localStorage.getItem("g_KEY_DELETE") == "0") { this.button_Delete_Disable = true; }
        if (localStorage.getItem("g_KEY_VIEW") == "0") { this.button_View_Disable = true; }
      }

      this.Bind_Country(); this.Bind_PaymentType(); this.BindControls(); localStorage.removeItem("default_payment_type"); this.BindProfiles()

      this.CompanySettingsform = fb.group({
        DateFormat: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        // Currency: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        Currency: [null, Validators.required],
        // EmailLogo: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        Country: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        MaxClaimAmt: [null, Validators.compose([Validators.pattern('^[0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        MinClaimAmt: [null, Validators.compose([Validators.pattern('^[0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        ClaimCutOffDate: [null, Validators.compose([Validators.pattern('^[0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        YearStartMonth: [null, Validators.compose([Validators.pattern('^[0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        YearEndMonth: [null, Validators.compose([Validators.pattern('^[0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        ApprovalCutoffDate: [null, Validators.compose([Validators.pattern('^[0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        PaymentType: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        Language: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        avatar1: null,
        avatar: null,
        EmailSchedule: [null, Validators.required],
        EmailTime: [null, Validators.required],
        Version: null,
        DefaultProfile: [null, Validators.required],
        DraftNotification: null,
        Timezone: null,
      });

      this.VisibleControls();
    }
  }

  Countrys: any;
  Bind_Country() {
    let url: string = "";
    url = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_country' + '?order=NAME&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http
      .get(url)
      .map(res => res.json())
      .subscribe(data => {
        this.Countrys = data.resource;
      });
  }

  PaymentTypes: any;
  Bind_PaymentType() {
    let url: string = "";
    url = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_payment_type' + '?filter=(TENANT_GUID=' + localStorage.getItem('g_TENANT_GUID') + ')&order=NAME&api_key=' + constants.DREAMFACTORY_API_KEY;
    if (localStorage.getItem("g_USER_GUID") == "sva") {
      url = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_payment_type' + '?order=NAME&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    this.http
      .get(url)
      .map(res => res.json())
      .subscribe(data => {
        this.PaymentTypes = data.resource;
      });
  }

  Profiles: any;
  BindProfiles() {
    let url: string = "";
    url = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_profile' + '?filter=(TENANT_GUID=' + localStorage.getItem('g_TENANT_GUID') + ')&order=PROFILE_NAME&api_key=' + constants.DREAMFACTORY_API_KEY;
    if (localStorage.getItem("g_USER_GUID") == "sva") {
      url = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_profile' + '?order=PROFILE_NAME&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    this.http
      .get(url)
      .map(res => res.json())
      .subscribe(data => {
        this.Profiles = data.resource;
      });
  }

  Add_Form: boolean = true;
  FormControls: any;
  DateFormat_ngModel: any; Currency_ngModel: any; EmailLogo_ngModel: any; Country_ngModel: any;
  MaxClaimAmt_ngModel: any; MinClaimAmt_ngModel: any; ClaimCuttoffDate_ngModel: any; YearStartMonth_ngModel: any;
  YearEndMonth_ngModel: any; ApprovalCutoffDate_ngModel: any; PaymentType_ngModel: any; Language_ngModel: any;
  Email_Schedule_ngModel: any; Email_Time_ngModel: any; Version_ngModel: any;
  DraftNotification_ngModel: any; Profile_ngModel: any; Timezone_ngModel: any;

  isVisibleToSVA: boolean = false;

  BindControls() {
    this.Add_Form = true;
    this.KeyNameValue = [];
    let url: string = "";
    if (localStorage.getItem("g_USER_GUID") == "sva") {
      url = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/permission_keys' + '?filter=(CREATION_USER_GUID=' + localStorage.getItem('g_USER_GUID') + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    else {
      url = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/permission_keys' + '?filter=(TENANT_GUID=' + localStorage.getItem('g_TENANT_GUID') + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    }

    this.http
      .get(url)
      .map(res => res.json())
      .subscribe(data => {
        this.FormControls = data.resource;
        for (var item in this.FormControls) {
          this.KeyNameValue.push({ PERMISSION_KEY_GUID: this.FormControls[item]["PERMISSION_KEY_GUID"], KEY_NAME: this.FormControls[item]["KEY_NAME"], KEY_VALUE: this.FormControls[item]["KEY_VALUE"] });
          if (this.FormControls[item]["KEY_NAME"] == "date_format") { this.DateFormat_ngModel = this.FormControls[item]["KEY_VALUE"]; }
          if (this.FormControls[item]["KEY_NAME"] == "default_currency") { this.Currency_ngModel = this.FormControls[item]["KEY_VALUE"]; }
          // if (this.FormControls[item]["KEY_NAME"] == "email_logo") { this.EmailLogo_ngModel = this.FormControls[item]["KEY_VALUE"]; }
          this.isImage = true;
          if (this.FormControls[item]["KEY_NAME"] == "email_logo") { this.EmailImage = constants.DREAMFACTORY_IMAGE_URL + this.FormControls[item]["KEY_VALUE"] + '?api_key=' + constants.DREAMFACTORY_API_KEY; this.imageGUID = this.FormControls[item]["KEY_VALUE"]; }
          if (this.FormControls[item]["KEY_NAME"] == "default_country") {
            var charNo = this.FormControls[item]["KEY_VALUE"].indexOf(",");
            var curKeyNameValue = this.FormControls[item]["KEY_VALUE"].substring(0, charNo);
            localStorage.setItem("temp_country_code", this.FormControls[item]["KEY_VALUE"].substr(charNo + 1, (this.FormControls[item]["KEY_VALUE"].length) - charNo));
            // this.Country_ngModel = this.FormControls[item]["KEY_VALUE"];
            this.Country_ngModel = curKeyNameValue;
          }
          if (this.FormControls[item]["KEY_NAME"] == "max_claim_amt") { this.MaxClaimAmt_ngModel = this.FormControls[item]["KEY_VALUE"]; }
          if (this.FormControls[item]["KEY_NAME"] == "min_claim_amt") { this.MinClaimAmt_ngModel = this.FormControls[item]["KEY_VALUE"]; }
          if (this.FormControls[item]["KEY_NAME"] == "claim_cutoff_date") { this.ClaimCuttoffDate_ngModel = this.FormControls[item]["KEY_VALUE"]; }
          if (this.FormControls[item]["KEY_NAME"] == "month_start") { this.YearStartMonth_ngModel = this.FormControls[item]["KEY_VALUE"]; }
          if (this.FormControls[item]["KEY_NAME"] == "month_end") { this.YearEndMonth_ngModel = this.FormControls[item]["KEY_VALUE"]; }
          if (this.FormControls[item]["KEY_NAME"] == "approval_cutoff_date") { this.ApprovalCutoffDate_ngModel = this.FormControls[item]["KEY_VALUE"]; }
          if (this.FormControls[item]["KEY_NAME"] == "default_payment_type") {
            var charNo_1 = this.FormControls[item]["KEY_VALUE"].indexOf(",");
            var curKeyNameValue_1 = this.FormControls[item]["KEY_VALUE"].substring(0, charNo_1);
            // this.PaymentType_ngModel = this.FormControls[item]["KEY_VALUE"];          
            this.PaymentType_ngModel = curKeyNameValue_1;
          }
          if (this.FormControls[item]["KEY_NAME"] == "default_language") { this.Language_ngModel = this.FormControls[item]["KEY_VALUE"]; }
          if (this.FormControls[item]["KEY_NAME"] == "email_schedule") {
            // this.Email_Schedule_ngModel = this.FormControls[item]["KEY_VALUE"]; 
            this.Email_Schedule_ngModel = this.FormControls[item]["KEY_VALUE"].split(",");
          }
          if (this.FormControls[item]["KEY_NAME"] == "email_time") { this.Email_Time_ngModel = this.FormControls[item]["KEY_VALUE"]; }
          if (this.FormControls[item]["KEY_NAME"] == "version") { this.Version_ngModel = this.FormControls[item]["KEY_VALUE"]; }

          if (this.FormControls[item]["KEY_NAME"] == "profile_guid") { this.Profile_ngModel = this.FormControls[item]["KEY_VALUE"]; }
          if (this.FormControls[item]["KEY_NAME"] == "draft_notification") {
            if (this.FormControls[item]["KEY_VALUE"] == "1") {
              this.DraftNotification_ngModel = true;
            }
            else {
              this.DraftNotification_ngModel = false;
            }
          }

          if (this.FormControls[item]["KEY_NAME"] == "default_time_zone") { this.Timezone_ngModel = this.FormControls[item]["KEY_VALUE"]; }

          this.Add_Form = false;
        }
      });

    //For Tenant Admin version should display from sva creation_guid
    if (localStorage.getItem("g_USER_GUID") != "sva") {
      url = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/permission_keys' + '?filter=(CREATION_USER_GUID=sva)&api_key=' + constants.DREAMFACTORY_API_KEY;
      this.http
        .get(url)
        .map(res => res.json())
        .subscribe(data => {
          this.FormControls = data.resource;
          for (var item in this.FormControls) {
            if (this.FormControls[item]["KEY_NAME"] == "version") { this.Version_ngModel = this.FormControls[item]["KEY_VALUE"]; }
          }
        });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CompanysettingsPage');
  }

  KeyNameValue: any[] = []; blnDataInsert: boolean = false; blnDataUpdate: boolean = false;
  Save(formValues: any) {
    if (this.Add_Form == true) {
      this.KeyNameValue = [];
      this.KeyNameValue.push({ PERMISSION_KEY_GUID: UUID.UUID(), KEY_NAME: "date_format", KEY_VALUE: formValues.DateFormat.trim() });
      this.KeyNameValue.push({ PERMISSION_KEY_GUID: UUID.UUID(), KEY_NAME: "default_currency", KEY_VALUE: formValues.Currency.trim() });
      this.KeyNameValue.push({ PERMISSION_KEY_GUID: UUID.UUID(), KEY_NAME: "email_logo", KEY_VALUE: this.imageGUID });
      // this.KeyNameValue.push({ PERMISSION_KEY_GUID: UUID.UUID(), KEY_NAME: "default_country", KEY_VALUE: formValues.Country.trim() });
      this.KeyNameValue.push({ PERMISSION_KEY_GUID: UUID.UUID(), KEY_NAME: "default_country", KEY_VALUE: formValues.Country.trim() + ',' + this.CountryCodes[0]["alpha2Code"] });
      this.KeyNameValue.push({ PERMISSION_KEY_GUID: UUID.UUID(), KEY_NAME: "max_claim_amt", KEY_VALUE: formValues.MaxClaimAmt.trim() });
      this.KeyNameValue.push({ PERMISSION_KEY_GUID: UUID.UUID(), KEY_NAME: "min_claim_amt", KEY_VALUE: formValues.MinClaimAmt.trim() });
      this.KeyNameValue.push({ PERMISSION_KEY_GUID: UUID.UUID(), KEY_NAME: "claim_cutoff_date", KEY_VALUE: formValues.ClaimCutOffDate.trim() });
      this.KeyNameValue.push({ PERMISSION_KEY_GUID: UUID.UUID(), KEY_NAME: "month_start", KEY_VALUE: formValues.YearStartMonth.trim() });
      this.KeyNameValue.push({ PERMISSION_KEY_GUID: UUID.UUID(), KEY_NAME: "month_end", KEY_VALUE: formValues.YearEndMonth.trim() });
      this.KeyNameValue.push({ PERMISSION_KEY_GUID: UUID.UUID(), KEY_NAME: "approval_cutoff_date", KEY_VALUE: formValues.ApprovalCutoffDate.trim() });

      // this.KeyNameValue.push({ PERMISSION_KEY_GUID: UUID.UUID(), KEY_NAME: "default_payment_type", KEY_VALUE: formValues.PaymentType.trim() });
      for (var item in this.PaymentTypes) {
        if (this.PaymentTypes[item]["PAYMENT_TYPE_GUID"] == formValues.PaymentType.trim()) {
          this.KeyNameValue.push({ PERMISSION_KEY_GUID: UUID.UUID(), KEY_NAME: "default_payment_type", KEY_VALUE: formValues.PaymentType.trim() + ',' + this.PaymentTypes[item]["NAME"] });
        }
      }
      this.KeyNameValue.push({ PERMISSION_KEY_GUID: UUID.UUID(), KEY_NAME: "default_language", KEY_VALUE: formValues.Language.trim() });
      var ctr = 0; var scheduler_val = "";
      for (var ScheduleVal of this.Email_Schedule_ngModel) {
        if (this.Email_Schedule_ngModel.length > 1) {
          if (ctr == 0) {
            scheduler_val = ScheduleVal;
          }
          else {
            scheduler_val = scheduler_val + ',' + ScheduleVal;
          }
        }
        else {
          scheduler_val = ScheduleVal;
        }
        ctr = ctr + 1;
      }

      // this.KeyNameValue.push({ PERMISSION_KEY_GUID: UUID.UUID(), KEY_NAME: "email_schedule", KEY_VALUE: formValues.EmailSchedule.trim() });
      this.KeyNameValue.push({ PERMISSION_KEY_GUID: UUID.UUID(), KEY_NAME: "email_schedule", KEY_VALUE: scheduler_val });
      this.KeyNameValue.push({ PERMISSION_KEY_GUID: UUID.UUID(), KEY_NAME: "email_time", KEY_VALUE: formValues.EmailTime.trim() });
      this.KeyNameValue.push({ PERMISSION_KEY_GUID: UUID.UUID(), KEY_NAME: "version", KEY_VALUE: formValues.Version.trim() });

      this.KeyNameValue.push({ PERMISSION_KEY_GUID: UUID.UUID(), KEY_NAME: "profile_guid", KEY_VALUE: formValues.DefaultProfile.trim() });
      if (formValues.DraftNotification == true) {
        this.KeyNameValue.push({ PERMISSION_KEY_GUID: UUID.UUID(), KEY_NAME: "draft_notification", KEY_VALUE: "1" });
      }
      else {
        this.KeyNameValue.push({ PERMISSION_KEY_GUID: UUID.UUID(), KEY_NAME: "draft_notification", KEY_VALUE: "0" });
      }

      this.KeyNameValue.push({ PERMISSION_KEY_GUID: UUID.UUID(), KEY_NAME: "default_time_zone", KEY_VALUE: formValues.Timezone.trim() });

      this.Settings_Entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
      this.Settings_Entry.CREATION_TS = new Date().toISOString();
      this.Settings_Entry.UPDATE_TS = new Date().toISOString();
      this.Settings_Entry.UPDATE_USER_GUID = null;
    }
    else {
      // this.KeyNameValue.push({ PERMISSION_KEY_GUID: UUID.UUID(), KEY_NAME: "version", KEY_VALUE: formValues.Version.trim() });
      // this.KeyNameValue.push({ PERMISSION_KEY_GUID: UUID.UUID(), KEY_NAME: "profile_guid", KEY_VALUE: formValues.DefaultProfile.trim() });
      // if(formValues.DraftNotification == true){
      //   this.KeyNameValue.push({ PERMISSION_KEY_GUID: UUID.UUID(), KEY_NAME: "draft_notification", KEY_VALUE: "1" });
      // }
      // else{
      //   this.KeyNameValue.push({ PERMISSION_KEY_GUID: UUID.UUID(), KEY_NAME: "draft_notification", KEY_VALUE: "0" });
      // }
      // this.KeyNameValue.push({ PERMISSION_KEY_GUID: UUID.UUID(), KEY_NAME: "default_time_zone", KEY_VALUE: formValues.Timezone.trim() });

      this.KeyNameValue.forEach(element => {
        if (element.KEY_NAME == "date_format") { element.KEY_VALUE = formValues.DateFormat.trim(); }
        if (element.KEY_NAME == "default_currency") { element.KEY_VALUE = formValues.Currency.trim(); }
        if (element.KEY_NAME == "email_logo") { element.KEY_VALUE = this.imageGUID; }
        // if (element.KEY_NAME == "default_country") { element.KEY_VALUE = formValues.Country.trim() + ',' + this.CountryCodes[0]["alpha2Code"]; }

        if (element.KEY_NAME == "default_country") {
          for (var item in this.Countrys) {
            if (this.Countrys[item]["COUNTRY_GUID"] == formValues.Country.trim()) {
              if (this.CountryCodes != undefined) {
                if (element.KEY_NAME == "default_country") { element.KEY_VALUE = formValues.Country.trim() + ',' + this.CountryCodes[0]["alpha2Code"]; }
              }
              else {
                if (element.KEY_NAME == "default_country") { element.KEY_VALUE = formValues.Country.trim() + ',' + localStorage.getItem("temp_country_code"); }
              }
            }
          }
        }

        if (element.KEY_NAME == "max_claim_amt") { element.KEY_VALUE = formValues.MaxClaimAmt.trim(); }
        if (element.KEY_NAME == "min_claim_amt") { element.KEY_VALUE = formValues.MinClaimAmt.trim(); }
        if (element.KEY_NAME == "claim_cutoff_date") { element.KEY_VALUE = formValues.ClaimCutOffDate.trim(); }
        if (element.KEY_NAME == "month_start") { element.KEY_VALUE = formValues.YearStartMonth.trim(); }
        if (element.KEY_NAME == "month_end") { element.KEY_VALUE = formValues.YearEndMonth.trim(); }
        if (element.KEY_NAME == "approval_cutoff_date") { element.KEY_VALUE = formValues.ApprovalCutoffDate.trim(); }
        // if (element.KEY_NAME == "default_payment_type") { element.KEY_VALUE = formValues.PaymentType.trim(); }

        if (element.KEY_NAME == "default_payment_type") {
          for (var item in this.PaymentTypes) {
            if (this.PaymentTypes[item]["PAYMENT_TYPE_GUID"] == formValues.PaymentType.trim()) {
              if (element.KEY_NAME == "default_payment_type") { element.KEY_VALUE = formValues.PaymentType.trim() + ',' + this.PaymentTypes[item]["NAME"]; }
            }
          }
        }

        if (element.KEY_NAME == "default_language") { element.KEY_VALUE = formValues.Language.trim(); }

        if (element.KEY_NAME == "email_schedule") {
          var ctr = 0;
          for (var ScheduleVal of this.Email_Schedule_ngModel) {
            if (this.Email_Schedule_ngModel.length > 1) {
              if (ctr == 0) {
                element.KEY_VALUE = ScheduleVal;
              }
              else {
                element.KEY_VALUE = element.KEY_VALUE + ',' + ScheduleVal
              }
            }
            else {
              element.KEY_VALUE = ScheduleVal
            }
            ctr = ctr + 1;
          }
          // element.KEY_VALUE = formValues.EmailSchedule.trim(); 
        }
        if (element.KEY_NAME == "email_time") { element.KEY_VALUE = formValues.EmailTime.trim(); }
        if (element.KEY_NAME == "version") { element.KEY_VALUE = formValues.Version.trim(); }

        if (element.KEY_NAME == "profile_guid") { element.KEY_VALUE = formValues.DefaultProfile.trim(); }
        if (formValues.DraftNotification == true) {
          if (element.KEY_NAME == "draft_notification") { element.KEY_VALUE = "1"; }
        }
        else {
          if (element.KEY_NAME == "draft_notification") { element.KEY_VALUE = "0"; }
        }
        if (element.KEY_NAME == "default_time_zone") { element.KEY_VALUE = formValues.Timezone.trim(); }

        this.Settings_Entry.CREATION_USER_GUID = this.FormControls[0]["CREATION_USER_GUID"];
        this.Settings_Entry.CREATION_TS = this.FormControls[0]["CREATION_TS"];
        this.Settings_Entry.UPDATE_TS = new Date().toISOString();
        this.Settings_Entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");
      });
    }

    this.KeyNameValue.forEach(element => {
      this.Settings_Entry.PERMISSION_KEY_GUID = element.PERMISSION_KEY_GUID;
      this.Settings_Entry.KEY_NAME = element.KEY_NAME;
      this.Settings_Entry.KEY_VALUE = element.KEY_VALUE;
      this.Settings_Entry.SHIFT_GUID = null;
      this.Settings_Entry.DEVICE_GUID = null;
      this.Settings_Entry.ROLE_GUID = null;
      this.Settings_Entry.COMPANY_GUID = null;
      this.Settings_Entry.DEPT_GUID = null;
      this.Settings_Entry.USER_GUID = null;
      this.Settings_Entry.TENANT_COMPANY_GUID = localStorage.getItem("g_TENANT_COMPANY_GUID");
      this.Settings_Entry.TENANT_COMPANY_SITE_GUID = localStorage.getItem("g_TENANT_COMPANY_SITE_GUID");
      this.Settings_Entry.TENANT_GUID = localStorage.getItem("g_TENANT_GUID");

      if (this.Add_Form == true) {
        this.settingservice.save(this.Settings_Entry, "permission_keys")
          .subscribe((response) => {
            if (response.status == 200) {
              this.blnDataInsert = true; this.blnDataUpdate = false;
            }
          });
      }
      else {
        this.settingservice.update(this.Settings_Entry, "permission_keys")
          .subscribe((response) => {
            if (response.status == 200) {
              this.blnDataUpdate = true; this.blnDataInsert = false;
            }
          });

        // if (this.Settings_Entry.KEY_NAME == "default_time_zone") {
        //   this.settingservice.save(this.Settings_Entry, "permission_keys")
        //     .subscribe((response) => {
        //       if (response.status == 200) {
        //         this.blnDataInsert = true; this.blnDataUpdate = false;
        //       }
        //     });
        // }
      }
    });
    // if (this.blnDataInsert == true) {
    alert('Submitted successfully');
    // }
    // if (this.blnDataUpdate == true) {
    //   alert('Updated successfully');
    // }
    this.BindControls();
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

  fileName1: string;
  EmailImage: any;
  fileList: FileList;
  imageGUID: any;
  uploadFileName: string;
  chooseFile: boolean = false;
  newImage: boolean = true;
  ImageUploadValidation: boolean = false;

  private EmailImageDisplay(e: any, fileChoose: string): void {
    let reader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      this.CompanySettingsform.get(fileChoose).setValue(file);
      if (fileChoose === 'avatar1')
        this.fileName1 = file.name;

      reader.onload = (event: any) => {
        this.EmailImage = event.target.result;
      }
      reader.readAsDataURL(e.target.files[0]);
    }
    this.imageGUID = this.uploadFileName;
    this.chooseFile = true;
    this.newImage = false;
    this.onFileChange(e);
    this.ImageUploadValidation = false;
    this.saveIm();
  }

  isImage: boolean = false;
  selectedImage: any = null;

  onFileChange(event: any, ) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.type === 'image/jpeg' || file.type === 'image/png')
        this.isImage = true;
      else
        this.isImage = false;
      this.CompanySettingsform.get('avatar').setValue(file);
      this.uploadFileName = file.name;

      reader.onload = () => {
        this.CompanySettingsform.get('avatar').setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result.split(',')[1]
        });
      };
    }
  }

  uniqueName: any;
  saveIm() {
    let uploadImage = this.UploadImage();
    uploadImage.then(() => {
      this.imageGUID = this.uniqueName;
      this.chooseFile = false;
      this.ImageUploadValidation = true;
    })
  }

  CloudFilePath: string;
  UploadImage() {
    this.CloudFilePath = 'eclaim/'
    this.uniqueName = new Date().toISOString() + this.uploadFileName;

    const queryHeaders = new Headers();
    queryHeaders.append('filename', this.uploadFileName);
    queryHeaders.append('Content-Type', 'multipart/form-data');
    queryHeaders.append('fileKey', 'file');
    queryHeaders.append('chunkedMode', 'false');
    queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
    const options = new RequestOptions({ headers: queryHeaders });
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
    });
    this.loading.present();

    return new Promise((resolve) => {
      this.http.post('http://api.zen.com.my/api/v2/azurefs/' + this.CloudFilePath + this.uniqueName, this.CompanySettingsform.get('avatar').value, options)
        .map((response) => {
          this.loading.dismissAll()
          return response;
        }).subscribe((response) => {
          resolve(response.json());
        })
    })
  }

  onCountrySelect() {
    for (var item in this.Countrys) {
      if (this.Countrys[item]["COUNTRY_GUID"] == this.Country_ngModel) {
        let url: string = "https://restcountries.eu/rest/v2/name/" + this.Countrys[item]["NAME"] + "?fullText=true";
        this.http
          .get(url)
          .map(res => res.json())
          .subscribe(data => {
            this.CountryCodes = data;
            this.Currency_ngModel = this.CountryCodes[0]["currencies"][0]["symbol"];
            this.Timezone_ngModel = this.CountryCodes[0]["timezones"].toString().substr(3, 6);
          });
      }
    }
  }

  VisibleControls() {
    if (localStorage.getItem("g_USER_GUID") == "sva") {
      this.isVisibleToSVA = true;
    }
    else {
      this.isVisibleToSVA = false;
    }
  }
  
}
