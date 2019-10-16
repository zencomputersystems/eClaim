import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
//import { FormBuilder, FormGroup } from '@angular/forms';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Http, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import CryptoJS from 'crypto-js';
import { GlobalFunction } from '../../shared/GlobalFunction';

import { TenantMainSetup_Model } from '../../models/tenantmainsetup_model';
import { TenantMainSetup_Service } from '../../services/tenantmainsetup_service';

import { TenantCompanySetup_Model } from '../../models/tenantcompanysetup_model';
import { TenantCompanySetup_Service } from '../../services/tenantcompanysetup_service';

import { TenantCompanySiteSetup_Model } from '../../models/tenantcompanysitesetup_model';
import { TenantCompanySiteSetup_Service } from '../../services/tenantcompanysitesetup_service';

import { UserMain_Model } from '../../models/user_main_model';
import { UserInfo_Model } from '../../models/usersetup_info_model';
import { UserContact_Model } from '../../models/user_contact_model';
import { UserCompany_Model } from '../../models/user_company_model';
import { UserAddress_Model } from '../../models/usersetup_address_model';
import { UserRole_Model } from '../../models/user_role_model'

import { UserSetup_Service } from '../../services/usersetup_service';


import { BaseHttpService } from '../../services/base-http';
import { UUID } from 'angular2-uuid';
import { LoginPage } from '../login/login';

/**
 * Generated class for the TenantsetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-tenantsetup',
  templateUrl: 'tenantsetup.html', providers: [TenantMainSetup_Service, TenantCompanySetup_Service, TenantCompanySiteSetup_Service, UserSetup_Service, BaseHttpService]
})
export class TenantsetupPage {
  tenant_main_entry: TenantMainSetup_Model = new TenantMainSetup_Model();
  tenant_company_entry: TenantCompanySetup_Model = new TenantCompanySetup_Model();
  tenant_company_site_entry: TenantCompanySiteSetup_Model = new TenantCompanySiteSetup_Model();

  usermain_entry: UserMain_Model = new UserMain_Model();
  userinfo_entry: UserInfo_Model = new UserInfo_Model();
  usercontact_entry: UserContact_Model = new UserContact_Model();
  usercompany_entry: UserCompany_Model = new UserCompany_Model();
  useraddress_entry: UserAddress_Model = new UserAddress_Model();
  userrole_entry: UserRole_Model = new UserRole_Model();

  Tenantform: FormGroup; TenantUSerform: FormGroup;
  public page:number = 1;
  //baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/tenant_company_site' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_tenantdetails' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  baseResourceUrl_tenantuser: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_tenantuser' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  //baseResourceUrl_tenantuser: string = constants.DREAMFACTORY_INSTANCE_URL + "/api/v2/zcs/_table/vw_tenantuser?filter=(TENANT_GUID=" + this.tenant_company_site_entry.SITE_NAME + ')&api_key=' + constants.DREAMFACTORY_API_KEY;

  public tenants: TenantCompanySiteSetup_Model[] = [];
  public tenantusers: any;
  public tenantuserdetails: any;
  public tenant_user_details: any;

  //Set the Model Name for Add------------------------------------------
  public TENANT_NAME_ngModel_Add: any;
  public TENANT_COMPANY_NAME_ngModel_Add: any;
  public COMPANY_SITE_NAME_ngModel_Add: any;
  public ADDRESS1_ngModel_Add: any;
  public ADDRESS2_ngModel_Add: any;
  public ADDRESS3_ngModel_Add: any;
  public CONTACTNO_ngModel_Add: any;
  public EMAIL_ngModel_Add: any;
  public CONTACT_PERSON_ngModel_Add: any;
  public CONTACT_PERSON_NO_ngModel_Add: any;
  public CONTACT_PERSON_EMAIL_ngModel_Add: any;
  public WEBSITE_ngModel_Add: any;
  public ISHQ_FLAG_ngModel_Add: any;
  public ACTIVE_FLAG_ngModel_Add: any;

  public SITE_NAME_ngModel_Add: any;
  public REGISTRATION_NUM_ngModel_Add: any;
  public ADDRESS_ngModel_Add: any;
  //public EMAIL_ngModel_Add: any;
  public CONTACT_NO_ngModel_Add: any;
  //public WEBSITE_ngModel_Add: any;
  //public CONTACT_PERSON_ngModel_Add: any;
  public CONTACT_PERSON_CONTACT_NO_ngModel_Add: any;
  //public CONTACT_PERSON_EMAIL_ngModel_Add: any;

  //---------------------------------------------------------------------

  //Set the Model Name for edit------------------------------------------
  public SITE_NAME_ngModel_Edit: any;
  public REGISTRATION_NUM_ngModel_Edit: any;
  public ADDRESS_ngModel_Edit: any;
  public EMAIL_ngModel_Edit: any;
  public CONTACT_NO_ngModel_Edit: any;
  public WEBSITE_ngModel_Edit: any;
  public CONTACT_PERSON_ngModel_Edit: any;
  public CONTACT_PERSON_CONTACT_NO_ngModel_Edit: any;
  public CONTACT_PERSON_EMAIL_ngModel_Edit: any;

  //Set the Model Name for Tenant User for Add---------------------------
  public User_Tenantid_ngModel_Add: any;
  public User_Loginid_ngModel_Add: any;
  public User_Password_ngModel_Add: any;
  public User_Email_ngModel_Add: any;
  public User_Role_ngModel_Add: any;
  //---------------------------------------------------------------------

  public AddTUserClicked: boolean = false;
  public AddTTUserClicked: boolean = false;
  public AddTenantClicked: boolean = false;
  public EditTenantClicked: boolean = false;
  public Exist_Record: boolean = false;

  public tenant_details: any;
  public exist_record_details: any;
  public roles: any;

  Add_Form: boolean = false; Edit_Form: boolean = false;
  Add_User_Form: boolean = false; Edit_User_Form: boolean = false;

  onChange() {
    this.User_Loginid_ngModel_Add = this.User_Email_ngModel_Add
  }

  public AddTenantClick() {
    this.AddTenantClicked = true; this.Add_Form = true; this.Edit_Form = false;
    this.ClearControls();
  }

  public AddTUserClick(TENANT_GUID: any, TENANT_COMPANY_GUID: any, TENANT_COMPANY_SITE_GUID: any) {
    this.AddTUserClicked = true;
    //----------------For tenant User---------------------------------------------------------
    this.baseResourceUrl_tenantuser = constants.DREAMFACTORY_INSTANCE_URL + "/api/v2/zcs/_table/vw_tenantuser?filter=(TENANT_GUID=" + TENANT_GUID + ')&api_key=' + constants.DREAMFACTORY_API_KEY;

    this.http
      .get(this.baseResourceUrl_tenantuser)
      .map(res => res.json())
      .subscribe(data => {
        this.tenantusers = data.resource; this.storeUsers = data["resource"];

        localStorage.setItem('PREV_TENANT_GUID', TENANT_GUID);
        localStorage.setItem('PREV_TENANT_COMPANY_GUID', TENANT_COMPANY_GUID);
        localStorage.setItem('PREV_TENANT_COMPANY_SITE_GUID', TENANT_COMPANY_SITE_GUID);
      });


    //----------------For Tenant User Address, Company, Info----------------------------------
    this.baseResourceUrl_tenantuser = constants.DREAMFACTORY_INSTANCE_URL + "/api/v2/zcs/_table/vw_tenantdetails?filter=(TENANT_COMPANY_GUID=" + TENANT_COMPANY_GUID + ')&api_key=' + constants.DREAMFACTORY_API_KEY;

    this.http
      .get(this.baseResourceUrl_tenantuser)
      .map(res => res.json())
      .subscribe(data => {
        this.tenantuserdetails = data.resource; //console.log(this.tenantuserdetails[0]);
      });
    //----------------------------------------------------------------------------------------
  }

  public CloseTUserClick() {
    this.AddTUserClicked = false;
  }

  Global_Function: GlobalFunction = new GlobalFunction(this.alertCtrl);
  public AddTTUserClick() {
    this.ClearUserControls();
    this.AddTTUserClicked = true;
    this.Add_User_Form = true; this.Edit_User_Form = false;
    //alert(this.tenantusers.EMAIL);

    //Generate Password Encrypt-----------------
    var strPassword = this.Global_Function.Random();
    this.User_Password_ngModel_Add = CryptoJS.SHA256(strPassword).toString(CryptoJS.enc.Hex);

    alert(strPassword);
  }

  public CloseTTUserClick() {
    this.AddTTUserClicked = false; this.Add_User_Form = true; this.Edit_User_Form = false;
  }

  public EditClick(TENANT_COMPANY_SITE_GUID: any) {
    this.ClearControls();
    //this.EditTenantClicked = true;
    this.AddTenantClicked = true; this.Add_Form = false; this.Edit_Form = true;

    let url_tenant_edit = this.baseResource_Url + "view_tenant_edit?filter=(TENANT_COMPANY_SITE_GUID=" + TENANT_COMPANY_SITE_GUID + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http.get(url_tenant_edit)
      .map(res => res.json())
      .subscribe(
        data => {
          this.tenant_details = data["resource"];

          this.TENANT_NAME_ngModel_Add = this.tenant_details[0]["TENANT_ACCOUNT_NAME"];
          this.TENANT_COMPANY_NAME_ngModel_Add = this.tenant_details[0]["TENANT_COMPANY_NAME"];
          this.COMPANY_SITE_NAME_ngModel_Add = this.tenant_details[0]["SITE_NAME"];
          this.REGISTRATION_NUM_ngModel_Add = this.tenant_details[0]["REGISTRATION_NO"];
          this.ADDRESS1_ngModel_Add = this.tenant_details[0]["ADDRESS"];
          this.ADDRESS2_ngModel_Add = this.tenant_details[0]["ADDRESS2"];
          this.ADDRESS3_ngModel_Add = this.tenant_details[0]["ADDRESS3"];
          this.CONTACTNO_ngModel_Add = this.tenant_details[0]["CONTACT_NO"];
          this.EMAIL_ngModel_Add = this.tenant_details[0]["EMAIL"];
          this.CONTACT_PERSON_ngModel_Add = this.tenant_details[0]["CONTACT_PERSON"];
          this.CONTACT_PERSON_NO_ngModel_Add = this.tenant_details[0]["CONTACT_PERSON_CONTACT_NO"];
          this.CONTACT_PERSON_EMAIL_ngModel_Add = this.tenant_details[0]["CONTACT_PERSON_EMAIL"];
          this.WEBSITE_ngModel_Add = this.tenant_details[0]["WEBSITE"];

          if (this.tenant_details[0]["ACTIVATION_FLAG"] == "1") {
            this.ACTIVE_FLAG_ngModel_Add = true;
          }
          else {
            this.ACTIVE_FLAG_ngModel_Add = false;
          }

          if (this.tenant_details[0]["ISHQ"] == "1") {
            this.ISHQ_FLAG_ngModel_Add = true;
          }
          else {
            this.ISHQ_FLAG_ngModel_Add = false;
          }
        });
  }

  public EditUserClick(USER_GUID: any) {
    this.ClearUserControls();
    this.AddTTUserClicked = true; this.Add_User_Form = false; this.Edit_User_Form = true;
    let url_tenant_user_edit = this.baseResource_Url + "view_tenant_user_edit?filter=(USER_GUID=" + USER_GUID + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http.get(url_tenant_user_edit)
      .map(res => res.json())
      .subscribe(
        data => {
          this.tenant_user_details = data["resource"];
          if (this.tenant_user_details.length > 0) {
            this.User_Loginid_ngModel_Add = this.tenant_user_details[0]["LOGIN_ID"];
            this.User_Password_ngModel_Add = this.tenant_user_details[0]["PASSWORD"];
            this.User_Email_ngModel_Add = this.tenant_user_details[0]["EMAIL"];
            this.User_Role_ngModel_Add = this.tenant_user_details[0]["ROLE_GUID"];
          }
        });
  }

  public DeleteClick(TENANT_COMPANY_SITE_GUID: any) {
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
            this.tenantcompanysitesetupservice.remove(TENANT_COMPANY_SITE_GUID)
              .subscribe(() => {
                self.tenants = self.tenants.filter((item) => {
                  this.tenantcompanysitesetupservice.remove(TENANT_COMPANY_SITE_GUID)
                  return item.TENANT_COMPANY_SITE_GUID != TENANT_COMPANY_SITE_GUID
                });
              });
            //this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        }
      ]
    }); alert.present();
  }

  public DeleteUserClick() {
    alert('In Progress....');
  }

  public CloseTenantClick() {

    if (this.AddTenantClicked == true) {
      this.AddTenantClicked = false;
    }
    if (this.EditTenantClicked == true) {
      this.EditTenantClicked = false;
    }
    this.Add_Form = true; this.Edit_Form = false;
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, fb_tenant: FormBuilder, fb_user: FormBuilder, public http: Http, private TenantMainSetupService: TenantMainSetup_Service, private TenantCompanySetupService: TenantCompanySetup_Service, private tenantcompanysitesetupservice: TenantCompanySiteSetup_Service, private userservice: UserSetup_Service, private alertCtrl: AlertController) {
    if (localStorage.getItem("g_USER_GUID") == "sva") {
      //--------------Clear all required storage------------------------
      localStorage.removeItem("PREV_TENANT_GUID");
      localStorage.removeItem("PREV_TENANT_COMPANY_GUID");
      localStorage.removeItem("PREV_TENANT_COMPANY_SITE_GUID");
      //----------------------------------------------------------------
      this.http
        .get(this.baseResourceUrl)
        .map(res => res.json())
        .subscribe(data => {
          this.tenants = data.resource; //console.log(data.resource);
        });

      //Bind Role----------------------------------------
      this.BindRole();

      this.Tenantform = fb_tenant.group({
        TENANT_NAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        TENANT_COMPANY_NAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        COMPANY_SITE_NAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        REGISTRATION_NUM: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        ADDRESS1: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        ADDRESS2: ["", Validators.required],
        ADDRESS3: ["", Validators.required],
        CONTACT_NO: [null, Validators.compose([Validators.pattern('^[0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        EMAIL: [null, Validators.compose([Validators.pattern('[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}'), Validators.required])],
        CONTACT_PERSON: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        CONTACT_PERSON_NO: [null, Validators.compose([Validators.pattern('^[0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        CONTACT_PERSON_EMAIL: [null, Validators.compose([Validators.pattern('[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}'), Validators.required])],
        WEBSITE: [null, Validators.compose([Validators.pattern('^(http[s]?:\\/\\/){0,1}(www\\.){0,1}[a-zA-Z0-9\\.\\-]+\\.[a-zA-Z]{2,5}[\\.]{0,1}$'), Validators.required])],
        ISHQ_FLAG: [null],
        ACTIVE_FLAG: [null],
      });

      this.TenantUSerform = fb_user.group({
        //-------------For Tenant User--------------------
        // TULOGINID: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        TULOGINID: [null],
        // TUPASSWORD: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        TUPASSWORD: [null],
        TUEMAIL: [null, Validators.compose([Validators.pattern('[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}'), Validators.required])],
        TUSERROLE: ["", Validators.required],
        //------------------------------------------------
      });
    }
    else {
      alert("Sorry. This is for only Super Admin.");
      this.navCtrl.push(LoginPage);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TenantsetupPage');
  }

  BindRole() {
    let url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_role' + '?order=NAME&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http
      .get(url)
      .map(res => res.json())
      .subscribe(data => {
        this.roles = data.resource;
      });
  }

  Save_Tenant_Main() {
    if (this.Add_Form == true) {
      this.tenant_main_entry.TENANT_GUID = UUID.UUID();
      this.tenant_main_entry.PARENT_TENANT_GUID = "";
      this.tenant_main_entry.TENANT_ACCOUNT_NAME = this.TENANT_NAME_ngModel_Add.trim();
      if (this.ACTIVE_FLAG_ngModel_Add == true) {
        this.tenant_main_entry.ACTIVATION_FLAG = "1";
      }
      else {
        this.tenant_main_entry.ACTIVATION_FLAG = "0";
      }
      //this.tenant_main_entry.ACTIVATION_FLAG = this.ACTIVE_FLAG_ngModel_Add;
      this.tenant_main_entry.CREATION_TS = new Date().toISOString();
      this.tenant_main_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
      this.tenant_main_entry.UPDATE_TS = new Date().toISOString();
      this.tenant_main_entry.UPDATE_USER_GUID = "";

      this.TenantMainSetupService.save(this.tenant_main_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            //alert('Tenant Main Registered successfully');
            //this.navCtrl.setRoot(this.navCtrl.getActive().component);
            this.Save_Tenant_Company();
          }
        })
    }
    else {
      this.tenant_main_entry.TENANT_GUID = this.tenant_details[0]["TENANT_GUID"];
      this.tenant_main_entry.PARENT_TENANT_GUID = "";
      this.tenant_main_entry.TENANT_ACCOUNT_NAME = this.TENANT_NAME_ngModel_Add.trim();
      if (this.ACTIVE_FLAG_ngModel_Add == true) {
        this.tenant_main_entry.ACTIVATION_FLAG = "1";
      }
      else {
        this.tenant_main_entry.ACTIVATION_FLAG = "0";
      }
      this.tenant_main_entry.CREATION_TS = this.tenant_details[0]["CREATION_TS"];
      this.tenant_main_entry.CREATION_USER_GUID = this.tenant_details[0]["CREATION_USER_GUID"];
      this.tenant_main_entry.UPDATE_TS = new Date().toISOString();
      this.tenant_main_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");

      this.TenantMainSetupService.update(this.tenant_main_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            //alert('Tenant Main Registered successfully');
            //this.navCtrl.setRoot(this.navCtrl.getActive().component);
            this.Save_Tenant_Company();
          }
        })
    }
  }

  Save_Tenant_Company() {
    if (this.Add_Form == true) {
      this.tenant_company_entry.TENANT_COMPANY_GUID = UUID.UUID();
      this.tenant_company_entry.TENANT_GUID = this.tenant_main_entry.TENANT_GUID;
      //localStorage.setItem('tenant_main_entry_TENANT_GUID', this.tenant_main_entry.TENANT_GUID);
      this.tenant_company_entry.NAME = this.TENANT_COMPANY_NAME_ngModel_Add.trim();
      this.tenant_company_entry.REGISTRATION_NO = this.REGISTRATION_NUM_ngModel_Add.trim();
      if (this.ACTIVE_FLAG_ngModel_Add == true) {
        this.tenant_company_entry.ACTIVATION_FLAG = "1";
      }
      else {
        this.tenant_company_entry.ACTIVATION_FLAG = "0";
      }
      this.tenant_company_entry.CREATION_TS = new Date().toISOString();
      this.tenant_company_entry.CREATION_USER_GUID = this.tenant_main_entry.CREATION_USER_GUID;
      this.tenant_company_entry.UPDATE_TS = new Date().toISOString();
      this.tenant_company_entry.UPDATE_USER_GUID = "";

      this.TenantCompanySetupService.save(this.tenant_company_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            //alert('Tenant Company Registered successfully');
            this.Save_Tenant_Company_Site();
          }
        })
    }
    else {
      this.tenant_company_entry.TENANT_COMPANY_GUID = this.tenant_details[0]["TENANT_COMPANY_GUID"];
      this.tenant_company_entry.TENANT_GUID = this.tenant_main_entry.TENANT_GUID;
      this.tenant_company_entry.NAME = this.TENANT_COMPANY_NAME_ngModel_Add.trim();
      this.tenant_company_entry.REGISTRATION_NO = this.REGISTRATION_NUM_ngModel_Add.trim();
      if (this.ACTIVE_FLAG_ngModel_Add == true) {
        this.tenant_company_entry.ACTIVATION_FLAG = "1";
      }
      else {
        this.tenant_company_entry.ACTIVATION_FLAG = "0";
      }
      this.tenant_company_entry.CREATION_TS = this.tenant_main_entry.CREATION_TS;
      this.tenant_company_entry.CREATION_USER_GUID = this.tenant_main_entry.CREATION_USER_GUID;
      this.tenant_company_entry.UPDATE_TS = this.tenant_main_entry.UPDATE_TS;
      this.tenant_company_entry.UPDATE_USER_GUID = this.tenant_main_entry.UPDATE_USER_GUID;

      this.TenantCompanySetupService.update(this.tenant_company_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            //alert('Tenant Company Registered successfully');
            this.Save_Tenant_Company_Site();
          }
        })
    }
  }

  Save_Tenant_Company_Site() {
    if (this.Add_Form == true) {
      //Check if any HQ is available for particular tenant, tenant_company, tenant_company_site
      this.tenant_company_site_entry.TENANT_COMPANY_SITE_GUID = UUID.UUID();
      this.tenant_company_site_entry.TENANT_COMPANY_GUID = this.tenant_company_entry.TENANT_COMPANY_GUID;
      this.tenant_company_site_entry.SITE_NAME = this.COMPANY_SITE_NAME_ngModel_Add.trim();
      this.tenant_company_site_entry.REGISTRATION_NUM = this.REGISTRATION_NUM_ngModel_Add.trim();
      this.tenant_company_site_entry.ADDRESS = this.ADDRESS1_ngModel_Add.trim();
      this.tenant_company_site_entry.ADDRESS2 = this.ADDRESS2_ngModel_Add.trim();
      this.tenant_company_site_entry.ADDRESS3 = this.ADDRESS3_ngModel_Add.trim();
      this.tenant_company_site_entry.CONTACT_NO = this.CONTACTNO_ngModel_Add.trim();
      this.tenant_company_site_entry.EMAIL = this.EMAIL_ngModel_Add.trim();
      if (this.ACTIVE_FLAG_ngModel_Add == true) {
        this.tenant_company_site_entry.ACTIVATION_FLAG = "1";
      }
      else {
        this.tenant_company_site_entry.ACTIVATION_FLAG = "0";
      }
      this.tenant_company_site_entry.CONTACT_PERSON = this.CONTACT_PERSON_ngModel_Add.trim();
      this.tenant_company_site_entry.CONTACT_PERSON_CONTACT_NO = this.CONTACT_PERSON_NO_ngModel_Add.trim();
      this.tenant_company_site_entry.CONTACT_PERSON_EMAIL = this.CONTACT_PERSON_EMAIL_ngModel_Add.trim();
      this.tenant_company_site_entry.WEBSITE = this.WEBSITE_ngModel_Add.trim();
      this.tenant_company_site_entry.CREATION_TS = new Date().toISOString();
      this.tenant_company_site_entry.CREATION_USER_GUID = this.tenant_main_entry.CREATION_USER_GUID;
      this.tenant_company_site_entry.UPDATE_TS = new Date().toISOString();
      this.tenant_company_site_entry.UPDATE_USER_GUID = "";
      if (this.ISHQ_FLAG_ngModel_Add == true) {
        this.tenant_company_site_entry.ISHQ = "1";
      }
      else {
        this.tenant_company_site_entry.ISHQ = "0";
      }
      this.tenantcompanysitesetupservice.save(this.tenant_company_site_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            //alert('Tenant Company Site Registered successfully');
            alert('Tenant Registered successfully');
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        })
    }
    else {
      this.tenant_company_site_entry.TENANT_COMPANY_SITE_GUID = this.tenant_details[0]["TENANT_COMPANY_SITE_GUID"];
      this.tenant_company_site_entry.TENANT_COMPANY_GUID = this.tenant_company_entry.TENANT_COMPANY_GUID;
      this.tenant_company_site_entry.SITE_NAME = this.COMPANY_SITE_NAME_ngModel_Add.trim();
      this.tenant_company_site_entry.REGISTRATION_NUM = this.REGISTRATION_NUM_ngModel_Add.trim();
      this.tenant_company_site_entry.ADDRESS = this.ADDRESS1_ngModel_Add.trim();
      this.tenant_company_site_entry.ADDRESS2 = this.ADDRESS2_ngModel_Add.trim();
      this.tenant_company_site_entry.ADDRESS3 = this.ADDRESS3_ngModel_Add.trim();
      this.tenant_company_site_entry.CONTACT_NO = this.CONTACTNO_ngModel_Add.trim();
      this.tenant_company_site_entry.EMAIL = this.EMAIL_ngModel_Add.trim();
      if (this.ACTIVE_FLAG_ngModel_Add == true) {
        this.tenant_company_site_entry.ACTIVATION_FLAG = "1";
      }
      else {
        this.tenant_company_site_entry.ACTIVATION_FLAG = "0";
      }
      this.tenant_company_site_entry.CONTACT_PERSON = this.CONTACT_PERSON_ngModel_Add.trim();
      this.tenant_company_site_entry.CONTACT_PERSON_CONTACT_NO = this.CONTACT_PERSON_NO_ngModel_Add.trim();
      this.tenant_company_site_entry.CONTACT_PERSON_EMAIL = this.CONTACT_PERSON_EMAIL_ngModel_Add.trim();
      this.tenant_company_site_entry.WEBSITE = this.WEBSITE_ngModel_Add.trim();

      this.tenant_company_site_entry.CREATION_TS = this.tenant_main_entry.CREATION_TS;
      this.tenant_company_site_entry.CREATION_USER_GUID = this.tenant_main_entry.CREATION_USER_GUID;
      this.tenant_company_site_entry.UPDATE_TS = this.tenant_main_entry.UPDATE_TS;
      this.tenant_company_site_entry.UPDATE_USER_GUID = this.tenant_main_entry.UPDATE_USER_GUID;
      if (this.ISHQ_FLAG_ngModel_Add == true) {
        this.tenant_company_site_entry.ISHQ = "1";
      }
      else {
        this.tenant_company_site_entry.ISHQ = "0";
      }
      this.tenantcompanysitesetupservice.update(this.tenant_company_site_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            //alert('Tenant Company Site Registered successfully');
            alert('Tenant update successfully');
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        })
    }
  }

  Save_Tenant_User() {
    if (this.Add_User_Form == true) {
      this.usermain_entry.USER_GUID = UUID.UUID();
      this.usermain_entry.TENANT_GUID = localStorage.getItem('PREV_TENANT_GUID');

      this.usermain_entry.LOGIN_ID = this.User_Loginid_ngModel_Add.trim();
      this.usermain_entry.PASSWORD = this.User_Password_ngModel_Add.trim();
      this.usermain_entry.EMAIL = this.User_Email_ngModel_Add.trim();
      //this.usermain_entry. = this.User_Role_ngModel_Add.trim();

      this.usermain_entry.ACTIVATION_FLAG = 1;
      this.usermain_entry.CREATION_TS = new Date().toISOString();
      this.usermain_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
      this.usermain_entry.UPDATE_TS = new Date().toISOString();
      this.usermain_entry.UPDATE_USER_GUID = "";

      this.userservice.save_user_main(this.usermain_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            this.Save_Tenant_User_Info();
          }
        })
    }
    else {
      this.usermain_entry.USER_GUID = this.tenant_user_details[0]["USER_GUID"];
      this.usermain_entry.TENANT_GUID = localStorage.getItem('PREV_TENANT_GUID');

      this.usermain_entry.STAFF_ID = this.tenant_user_details[0]["STAFF_ID"];
      // this.usermain_entry.LOGIN_ID = this.User_Loginid_ngModel_Add.trim();
      // this.usermain_entry.PASSWORD = this.User_Password_ngModel_Add.trim();

      this.usermain_entry.LOGIN_ID = this.tenant_user_details[0]["LOGIN_ID"];
      this.usermain_entry.PASSWORD = this.tenant_user_details[0]["PASSWORD"];
      this.usermain_entry.EMAIL = this.User_Email_ngModel_Add.trim();

      this.usermain_entry.ACTIVATION_FLAG = 1;
      this.usermain_entry.CREATION_TS = this.tenant_user_details[0]["CREATION_TS"];
      this.usermain_entry.CREATION_USER_GUID = this.tenant_user_details[0]["CREATION_USER_GUID"];
      this.usermain_entry.UPDATE_TS = new Date().toISOString();
      this.usermain_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");
      this.usermain_entry.IS_TENANT_ADMIN = this.tenant_user_details[0]["IS_TENANT_ADMIN"];

      this.userservice.update_user_main(this.usermain_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            this.Save_Tenant_User_Info();
          }
        })
    }
  }

  Save_Tenant_User_Info() {
    if (this.Add_User_Form == true) {
      this.userinfo_entry.FULLNAME = this.tenantuserdetails[0]["CONTACT_PERSON"];
      this.userinfo_entry.USER_INFO_GUID = UUID.UUID();
      this.userinfo_entry.USER_GUID = this.usermain_entry.USER_GUID;
      this.userinfo_entry.TENANT_COMPANY_GUID = localStorage.getItem('PREV_TENANT_COMPANY_GUID');
      this.userinfo_entry.TENANT_COMPANY_SITE_GUID = localStorage.getItem('PREV_TENANT_COMPANY_SITE_GUID');
      this.userinfo_entry.CREATION_TS = new Date().toISOString();
      this.userinfo_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
      this.userinfo_entry.UPDATE_TS = new Date().toISOString();
      this.userinfo_entry.UPDATE_USER_GUID = "";

      this.userservice.save_user_info(this.userinfo_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            this.Save_Tenant_User_Address();
          }
        });
    }
    else {
      this.userinfo_entry.USER_INFO_GUID = this.tenant_user_details[0]["USER_INFO_GUID"];            
      this.userinfo_entry.USER_GUID = this.usermain_entry.USER_GUID;
      this.userinfo_entry.FULLNAME = this.tenant_user_details[0]["FULLNAME"];

      this.userinfo_entry.MANAGER_USER_GUID = this.tenant_user_details[0]["MANAGER_USER_GUID"];
      this.userinfo_entry.PERSONAL_ID_TYPE = this.tenant_user_details[0]["PERSONAL_ID_TYPE"];
      this.userinfo_entry.PERSONAL_ID = this.tenant_user_details[0]["PERSONAL_ID"];
      this.userinfo_entry.DOB = this.tenant_user_details[0]["DOB"];
      this.userinfo_entry.GENDER = this.tenant_user_details[0]["GENDER"];
      this.userinfo_entry.JOIN_DATE = this.tenant_user_details[0]["JOIN_DATE"];
      this.userinfo_entry.MARITAL_STATUS = this.tenant_user_details[0]["MARITAL_STATUS"];
      this.userinfo_entry.BRANCH = this.tenant_user_details[0]["BRANCH"];
      this.userinfo_entry.EMPLOYEE_TYPE = this.tenant_user_details[0]["EMPLOYEE_TYPE"];
      this.userinfo_entry.APPROVER1 = this.tenant_user_details[0]["APPROVER1"];
      this.userinfo_entry.APPROVER2 = this.tenant_user_details[0]["APPROVER2"];
      this.userinfo_entry.EMPLOYEE_STATUS = this.tenant_user_details[0]["EMPLOYEE_STATUS"];
      this.userinfo_entry.DEPT_GUID = this.tenant_user_details[0]["DEPT_GUID"];
      this.userinfo_entry.DESIGNATION_GUID = this.tenant_user_details[0]["DESIGNATION_GUID"];
      this.userinfo_entry.RESIGNATION_DATE = this.tenant_user_details[0]["RESIGNATION_DATE"];      
      this.userinfo_entry.CONFIRMATION_DATE = this.tenant_user_details[0]["CONFIRMATION_DATE"];
      this.userinfo_entry.EMG_CONTACT_NAME_1 = this.tenant_user_details[0]["EMG_CONTACT_NAME_1"];
      this.userinfo_entry.EMG_RELATIONSHIP_1 = this.tenant_user_details[0]["EMG_RELATIONSHIP_1"];
      this.userinfo_entry.EMG_CONTACT_NUMBER_1 = this.tenant_user_details[0]["EMG_CONTACT_NUMBER_1"];
      this.userinfo_entry.EMG_CONTACT_NAME_2 = this.tenant_user_details[0]["EMG_CONTACT_NAME_2"];
      this.userinfo_entry.EMG_RELATIONSHIP_2 = this.tenant_user_details[0]["EMG_RELATIONSHIP_2"];
      this.userinfo_entry.EMG_CONTACT_NUMBER_2 = this.tenant_user_details[0]["EMG_CONTACT_NUMBER_2"];
      this.userinfo_entry.PR_EPF_NUMBER = this.tenant_user_details[0]["PR_EPF_NUMBER"];
      this.userinfo_entry.PR_INCOMETAX_NUMBER = this.tenant_user_details[0]["PR_INCOMETAX_NUMBER"];
      this.userinfo_entry.BANK_GUID = this.tenant_user_details[0]["BANK_GUID"];
      this.userinfo_entry.PR_ACCOUNT_NUMBER = this.tenant_user_details[0]["PR_ACCOUNT_NUMBER"];
      this.userinfo_entry.ATTACHMENT_ID = this.tenant_user_details[0]["ATTACHMENT_ID"];

      this.userinfo_entry.TENANT_COMPANY_GUID = localStorage.getItem('PREV_TENANT_COMPANY_GUID');
      this.userinfo_entry.TENANT_COMPANY_SITE_GUID = localStorage.getItem('PREV_TENANT_COMPANY_SITE_GUID');
      this.userinfo_entry.CREATION_TS = this.usermain_entry.CREATION_TS;
      this.userinfo_entry.CREATION_USER_GUID = this.usermain_entry.CREATION_USER_GUID;
      this.userinfo_entry.UPDATE_TS = this.usermain_entry.UPDATE_TS;
      this.userinfo_entry.UPDATE_USER_GUID = this.usermain_entry.UPDATE_USER_GUID;

      this.userservice.update_user_info(this.userinfo_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            this.Save_Tenant_User_Address();
          }
        });
    }
  }

  Save_Tenant_User_Address() {
    if (this.Add_User_Form == true) {
      this.useraddress_entry.USER_ADDRESS1 = this.tenantuserdetails[0]["ADDRESS"];
      this.useraddress_entry.USER_ADDRESS2 = this.tenantuserdetails[0]["ADDRESS"];
      this.useraddress_entry.USER_ADDRESS3 = this.tenantuserdetails[0]["ADDRESS"];
      this.useraddress_entry.USER_ADDRESS_GUID = UUID.UUID();
      this.useraddress_entry.USER_GUID = this.usermain_entry.USER_GUID;
      this.useraddress_entry.CREATION_TS = new Date().toISOString();
      this.useraddress_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
      this.useraddress_entry.UPDATE_TS = new Date().toISOString();
      this.useraddress_entry.UPDATE_USER_GUID = "";

      this.userservice.save_user_address(this.useraddress_entry)

        .subscribe((response) => {
          if (response.status == 200) {
            this.Save_Tenant_User_Contact();
          }
        });
    }
    else {
      this.useraddress_entry.USER_ADDRESS_GUID = this.tenant_user_details[0]["USER_ADDRESS_GUID"];
      this.useraddress_entry.ADDRESS_TYPE = this.tenant_user_details[0]["ADDRESS_TYPE"];
      this.useraddress_entry.USER_ADDRESS1 = this.tenant_user_details[0]["ADDRESS1"];
      this.useraddress_entry.USER_ADDRESS2 = this.tenant_user_details[0]["ADDRESS2"];
      this.useraddress_entry.USER_ADDRESS3 = this.tenant_user_details[0]["ADDRESS3"];      
      this.useraddress_entry.USER_GUID = this.usermain_entry.USER_GUID;

      this.useraddress_entry.POST_CODE = this.tenant_user_details[0]["POST_CODE"];
      this.useraddress_entry.COUNTRY_GUID = this.tenant_user_details[0]["COUNTRY_GUID"];
      this.useraddress_entry.STATE_GUID = this.tenant_user_details[0]["STATE_GUID"];

      this.useraddress_entry.CREATION_TS = this.usermain_entry.CREATION_TS;
      this.useraddress_entry.CREATION_USER_GUID = this.usermain_entry.CREATION_USER_GUID;
      this.useraddress_entry.UPDATE_TS = this.usermain_entry.UPDATE_TS;
      this.useraddress_entry.UPDATE_USER_GUID = this.usermain_entry.UPDATE_USER_GUID;

      this.userservice.update_user_address(this.useraddress_entry)

        .subscribe((response) => {
          if (response.status == 200) {
            this.Save_Tenant_User_Contact();
          }
        });
    }
  }

  Save_Tenant_User_Contact() {
    if (this.Add_User_Form == true) {
      this.usercontact_entry.CONTACT_NO = this.tenantuserdetails[0]["CONTACT_NO"];
      this.usercontact_entry.CONTACT_INFO_GUID = UUID.UUID();
      this.usercontact_entry.USER_GUID = this.usermain_entry.USER_GUID;
      this.usercontact_entry.CREATION_TS = new Date().toISOString();
      this.usercontact_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
      this.usercontact_entry.UPDATE_TS = new Date().toISOString();
      this.usercontact_entry.UPDATE_USER_GUID = "";

      this.userservice.save_user_contact(this.usercontact_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            this.Save_Tenant_User_Company();
          }
        });
    }
    else {
      this.usercontact_entry.TYPE = this.tenant_user_details[0]["TYPE"];    
      this.usercontact_entry.DESCRIPTION = this.tenant_user_details[0]["DESCRIPTION"];
      this.usercontact_entry.REMARKS = this.tenant_user_details[0]["REMARKS"];  
      this.usercontact_entry.CONTACT_NO = this.tenant_user_details[0]["CONTACT_NO"];
      this.usercontact_entry.CONTACT_INFO_GUID = this.tenant_user_details[0]["CONTACT_INFO_GUID"];
      this.usercontact_entry.USER_GUID = this.usermain_entry.USER_GUID;
      this.usercontact_entry.CREATION_TS = this.usermain_entry.CREATION_TS;
      this.usercontact_entry.CREATION_USER_GUID = this.usermain_entry.CREATION_USER_GUID;
      this.usercontact_entry.UPDATE_TS = this.usermain_entry.UPDATE_TS;
      this.usercontact_entry.UPDATE_USER_GUID = this.usermain_entry.UPDATE_USER_GUID;

      this.userservice.update_user_contact(this.usercontact_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            this.Save_Tenant_User_Company();
          }
        });
    }
  }

  Save_Tenant_User_Company() {
    if (this.Add_User_Form == true) {
      this.usercompany_entry.COMPANY_CONTACT_NO = this.tenantuserdetails[0]["CONTACT_PERSON_CONTACT_NO"];
      this.usercompany_entry.USER_COMPANY_GUID = UUID.UUID();
      this.usercompany_entry.USER_GUID = this.usermain_entry.USER_GUID;
      this.usercompany_entry.CREATION_TS = new Date().toISOString();
      this.usercompany_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
      this.usercompany_entry.UPDATE_TS = new Date().toISOString();
      this.usercompany_entry.UPDATE_USER_GUID = "";

      this.userservice.save_user_company(this.usercompany_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            // alert('Tenant User Registered successfully');
            // this.navCtrl.setRoot(this.navCtrl.getActive().component);
            this.Save_Tenant_User_Role();
          }
        });
    }
    else {
      this.usercompany_entry.COMPANY_CONTACT_NO = this.tenant_user_details[0]["COMPANY_CONTACT_NO"];
      this.usercompany_entry.USER_COMPANY_GUID = this.tenant_user_details[0]["USER_COMPANY_GUID"];
      this.usercompany_entry.USER_GUID = this.usermain_entry.USER_GUID;
      this.usercompany_entry.CREATION_TS = this.usermain_entry.CREATION_TS;
      this.usercompany_entry.CREATION_USER_GUID = this.usermain_entry.CREATION_USER_GUID;
      this.usercompany_entry.UPDATE_TS = this.usermain_entry.UPDATE_TS;
      this.usercompany_entry.UPDATE_USER_GUID = this.usermain_entry.UPDATE_USER_GUID;

      this.userservice.update_user_company(this.usercompany_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            // alert('Tenant User Registered successfully');
            // this.navCtrl.setRoot(this.navCtrl.getActive().component);
            this.Save_Tenant_User_Role();
          }
        });
    }
  }

  Save_Tenant_User_Role() {
    if (this.Add_User_Form == true) {
      this.userrole_entry.USER_ROLE_GUID = UUID.UUID();
      this.userrole_entry.USER_GUID = this.usermain_entry.USER_GUID;
      this.userrole_entry.ROLE_GUID = this.User_Role_ngModel_Add.trim();
      this.userrole_entry.ACTIVATION_FLAG = "1";
      this.userrole_entry.CREATION_TS = new Date().toISOString();
      this.userrole_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
      this.userrole_entry.UPDATE_TS = new Date().toISOString();
      this.userrole_entry.UPDATE_USER_GUID = "";

      this.userservice.save_user_role(this.userrole_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            alert('Tenant User Registered successfully');
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        });
    }
    else {
      this.userrole_entry.USER_ROLE_GUID = this.tenant_user_details[0]["USER_ROLE_GUID"];
      this.userrole_entry.USER_GUID = this.usermain_entry.USER_GUID;
      this.userrole_entry.ROLE_GUID = this.User_Role_ngModel_Add.trim();
      this.userrole_entry.ACTIVATION_FLAG = "1";
      this.userrole_entry.ROLE_FLAG = "MAIN";
      this.userrole_entry.CREATION_TS = this.usermain_entry.CREATION_TS;
      this.userrole_entry.CREATION_USER_GUID = this.usermain_entry.CREATION_USER_GUID;
      this.userrole_entry.UPDATE_TS = this.usermain_entry.UPDATE_TS;
      this.userrole_entry.UPDATE_USER_GUID = this.usermain_entry.UPDATE_USER_GUID;

      this.userservice.update_user_role(this.userrole_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            alert('Tenant User updated successfully');
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        });
    }
  }

  Save() {
    if (this.Tenantform.valid) {
      //Validate existing tenant_name and tenant_company_name and tenant_compay_site_name

      //Insert Record for tenant_main------------------------------------------
      this.Save_Tenant_Main();

      //Insert Record for tenant company---------------------------------------
      //this.Save_Tenant_Company();

      //Insert Record for tenant company site----------------------------------
      //this.Save_Tenant_Company_Site();








      // let headers = new Headers();
      // headers.append('Content-Type', 'application/json');
      // let options = new RequestOptions({ headers: headers });
      // let url: string;
      // url = this.baseResource_Url + "tenant_company_site?filter=(SITE_NAME=" + this.tenant_company_site_entry.SITE_NAME + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      // this.http.get(url, options)
      //   .map(res => res.json())
      //   .subscribe(
      //   data => {
      //     let res = data["resource"];
      //     if (res.length == 0) {
      //       console.log("No records Found");
      //       if (this.Exist_Record == false) {
      //         this.tenant_company_site_entry.SITE_NAME = this.COMPANY_SITE_NAME_ngModel_Add.trim();
      //         this.tenant_company_site_entry.REGISTRATION_NUM = this.REGISTRATION_NUM_ngModel_Add.trim();
      //         this.tenant_company_site_entry.ADDRESS = this.ADDRESS_ngModel_Add.trim();
      //         this.tenant_company_site_entry.EMAIL = this.EMAIL_ngModel_Add.trim();
      //         this.tenant_company_site_entry.CONTACT_NO = this.CONTACT_NO_ngModel_Add.trim();
      //         this.tenant_company_site_entry.WEBSITE = this.WEBSITE_ngModel_Add.trim();
      //         this.tenant_company_site_entry.CONTACT_PERSON = this.CONTACT_PERSON_ngModel_Add.trim();
      //         this.tenant_company_site_entry.CONTACT_PERSON_CONTACT_NO = this.CONTACT_PERSON_CONTACT_NO_ngModel_Add.trim();
      //         this.tenant_company_site_entry.CONTACT_PERSON_EMAIL = this.CONTACT_PERSON_EMAIL_ngModel_Add.trim();

      //         this.tenant_company_site_entry.TENANT_COMPANY_SITE_GUID = UUID.UUID();
      //         this.tenant_company_site_entry.TENANT_COMPANY_GUID = "298204b8-8c85-11e7-91cd-00155de7e742";
      //         this.tenant_company_site_entry.CREATION_TS = new Date().toISOString();
      //         this.tenant_company_site_entry.CREATION_USER_GUID = "1";
      //         this.tenant_company_site_entry.UPDATE_TS = new Date().toISOString();
      //         this.tenant_company_site_entry.UPDATE_USER_GUID = "";

      //         this.tenantcompanysitesetupservice.save(this.tenant_company_site_entry)
      //           .subscribe((response) => {
      //             if (response.status == 200) {
      //               alert('Tenant Registered successfully');                    
      //               this.navCtrl.setRoot(this.navCtrl.getActive().component);
      //             }
      //           })
      //       }
      //     }
      //     else {
      //       console.log("Records Found");
      //       alert("The Tenant is already Exist.")
      //     }

      //   },
      //   err => {
      //     this.Exist_Record = false;
      //     console.log("ERROR!: ", err);
      //   });
    }


  }

  getBankList() {
    let self = this;
    let params: URLSearchParams = new URLSearchParams();
    self.tenantcompanysitesetupservice.get_tenant(params)
      .subscribe((tenants: TenantCompanySiteSetup_Model[]) => {
        self.tenants = tenants;
      });
  }

  Update(TENANT_COMPANY_SITE_GUID: any) {
    if (this.Tenantform.valid) {
      if (this.tenant_company_site_entry.SITE_NAME == null) { this.tenant_company_site_entry.SITE_NAME = this.SITE_NAME_ngModel_Edit.trim(); }
      if (this.tenant_company_site_entry.REGISTRATION_NUM == null) { this.tenant_company_site_entry.REGISTRATION_NUM = this.REGISTRATION_NUM_ngModel_Edit.trim(); }
      if (this.tenant_company_site_entry.ADDRESS == null) { this.tenant_company_site_entry.ADDRESS = this.ADDRESS_ngModel_Edit.trim(); }
      if (this.tenant_company_site_entry.EMAIL == null) { this.tenant_company_site_entry.EMAIL = this.EMAIL_ngModel_Edit.trim(); }
      if (this.tenant_company_site_entry.CONTACT_NO == null) { this.tenant_company_site_entry.CONTACT_NO = this.CONTACT_NO_ngModel_Edit.trim(); }
      if (this.tenant_company_site_entry.WEBSITE == null) { this.tenant_company_site_entry.WEBSITE = this.WEBSITE_ngModel_Edit.trim(); }
      if (this.tenant_company_site_entry.CONTACT_PERSON == null) { this.tenant_company_site_entry.CONTACT_PERSON = this.CONTACT_PERSON_ngModel_Edit.trim(); }
      if (this.tenant_company_site_entry.CONTACT_PERSON_CONTACT_NO == null) { this.tenant_company_site_entry.CONTACT_PERSON_CONTACT_NO = this.CONTACT_PERSON_CONTACT_NO_ngModel_Edit.trim(); }
      if (this.tenant_company_site_entry.CONTACT_PERSON_EMAIL == null) { this.tenant_company_site_entry.CONTACT_PERSON_EMAIL = this.CONTACT_PERSON_EMAIL_ngModel_Edit.trim(); }

      this.tenant_company_site_entry.CREATION_TS = this.tenant_details.CREATION_TS;
      this.tenant_company_site_entry.CREATION_USER_GUID = this.tenant_details.CREATION_USER_GUID;
      this.tenant_company_site_entry.UPDATE_TS = this.tenant_details.UPDATE_TS;
      this.tenant_company_site_entry.TENANT_COMPANY_GUID = this.tenant_details.TENANT_COMPANY_GUID;
      this.tenant_company_site_entry.TENANT_COMPANY_SITE_GUID = TENANT_COMPANY_SITE_GUID;
      this.tenant_company_site_entry.UPDATE_TS = new Date().toISOString();
      this.tenant_company_site_entry.UPDATE_USER_GUID = "";

      if (this.SITE_NAME_ngModel_Edit.trim() != localStorage.getItem('Prev_ten_Category')) {
        let url: string;
        url = this.baseResource_Url + "tenant_company_site?filter=(SITE_NAME=" + this.SITE_NAME_ngModel_Edit.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
        this.http.get(url)
          .map(res => res.json())
          .subscribe(
            data => {
              let res = data["resource"];
              console.log('Current Name : ' + this.SITE_NAME_ngModel_Edit.trim() + ', Previous Name : ' + localStorage.getItem('Prev_ten_Category'));

              if (res.length == 0) {
                console.log("No records Found");
                this.tenant_company_site_entry.SITE_NAME = this.SITE_NAME_ngModel_Edit.trim();

                //**************Update service if it is new details*************************
                this.tenantcompanysitesetupservice.update(this.tenant_company_site_entry)
                  .subscribe((response) => {
                    if (response.status == 200) {
                      alert('Tenant updated successfully');
                      this.navCtrl.setRoot(this.navCtrl.getActive().component);
                    }
                  });
                //**************************************************************************
              }
              else {
                console.log("Records Found");
                alert("The Tenant is already Exist. ");
              }
            },
            err => {
              this.Exist_Record = false;
              console.log("ERROR!: ", err);
            });
      }
      else {
        if (this.tenant_company_site_entry.SITE_NAME == null) { this.tenant_company_site_entry.SITE_NAME = localStorage.getItem('Prev_ten_Category'); }
        this.tenant_company_site_entry.SITE_NAME = this.SITE_NAME_ngModel_Edit.trim();

        //**************Update service if it is old details*************************

        this.tenantcompanysitesetupservice.update(this.tenant_company_site_entry)
          .subscribe((response) => {
            if (response.status == 200) {
              alert('Tenant Type updated successfully');
              //location.reload();
              this.navCtrl.setRoot(this.navCtrl.getActive().component);
            }
          });
      }
    }
  }

  ClearControls() {
    this.COMPANY_SITE_NAME_ngModel_Add = "";
    this.REGISTRATION_NUM_ngModel_Add = "";
    this.EMAIL_ngModel_Add = "";
    this.ADDRESS_ngModel_Add = "";
    this.EMAIL_ngModel_Add = "";
    this.CONTACT_NO_ngModel_Add = "";
    this.WEBSITE_ngModel_Add = "";
    this.CONTACT_PERSON_ngModel_Add = "";
    this.CONTACT_PERSON_CONTACT_NO_ngModel_Add = "";
    this.CONTACT_PERSON_EMAIL_ngModel_Add = "";

    this.SITE_NAME_ngModel_Edit = "";
    this.REGISTRATION_NUM_ngModel_Edit = "";
    this.EMAIL_ngModel_Edit = "";
    this.ADDRESS_ngModel_Edit = "";
    this.EMAIL_ngModel_Edit = "";
    this.CONTACT_NO_ngModel_Edit = "";
    this.WEBSITE_ngModel_Edit = "";
    this.CONTACT_PERSON_ngModel_Edit = "";
    this.CONTACT_PERSON_CONTACT_NO_ngModel_Edit = "";
    this.CONTACT_PERSON_EMAIL_ngModel_Edit = "";

    // this.ISHQ_FLAG_ngModel_Add = false;
    // this.ACTIVE_FLAG_ngModel_Add = false;
  }

  ClearUserControls() {
    this.User_Loginid_ngModel_Add = "";
    this.User_Password_ngModel_Add = "";
    this.User_Email_ngModel_Add = "";
    this.User_Role_ngModel_Add = "";
  }

  storeUsers: any[];
  searchUser(searchString: any) {
    let val = searchString.target.value;
    if (!val || !val.trim()) {
      this.tenantusers = this.storeUsers;
      return;
    }
    this.tenantusers = this.filterUser({
      LOGIN_ID: val,
      ROLENAME: val
    });
  }

  filterUser(params?: any) {
    if (!params) {
      return this.storeUsers;
    }

    return this.storeUsers.filter((item) => {
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

  AdminActivation(USER_GUID: any, Activation_Flag: any) {
    //Here get all the user details and update------------------------
    this.GetUserMain(USER_GUID);

    let strTitle: string;
    if (Activation_Flag == true) {
      strTitle = "Do you want to deactivate ?";
    }
    else {
      strTitle = "Do you want to activate ?";
    }

    let alert = this.alertCtrl.create({
      title: 'Activation Confirmation',
      message: strTitle,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        },
        {
          text: 'OK',
          handler: () => {
            console.log('OK clicked');

            if (Activation_Flag == true) {
              this.usermain_entry.IS_TENANT_ADMIN = "0";
            }
            else {
              this.usermain_entry.IS_TENANT_ADMIN = "1";
            }

            this.userservice.update_user_main(this.usermain_entry)
              .subscribe((response) => {
                if (response.status == 200) {
                  this.navCtrl.setRoot(this.navCtrl.getActive().component);
                }
              });
          }
        }
      ]
    });
    alert.present();
  }
  
  baseResourceUrl2_URL: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
  view_user_details: any;
  GetUserMain(USER_GUID: any) {    
    let UserActivationUrl = this.baseResourceUrl2_URL + "user_main?filter=(USER_GUID=" + USER_GUID + ')&api_key=' + constants.DREAMFACTORY_API_KEY;

    this.http.get(UserActivationUrl)
      .map(res => res.json())
      .subscribe(
        data => {
          this.view_user_details = data["resource"];

          this.usermain_entry.USER_GUID = USER_GUID;
          this.usermain_entry.TENANT_GUID = this.view_user_details[0]["TENANT_GUID"];
          this.usermain_entry.STAFF_ID = this.view_user_details[0]["STAFF_ID"];
          this.usermain_entry.LOGIN_ID = this.view_user_details[0]["LOGIN_ID"]
          this.usermain_entry.PASSWORD = this.view_user_details[0]["PASSWORD"]
          this.usermain_entry.EMAIL = this.view_user_details[0]["EMAIL"]
          // this.usermain_entry.ACTIVATION_FLAG = 1;
          this.usermain_entry.CREATION_TS = this.view_user_details[0]["CREATION_TS"];
          this.usermain_entry.CREATION_USER_GUID = this.view_user_details[0]["CREATION_USER_GUID"];
          this.usermain_entry.UPDATE_TS = new Date().toISOString();
          this.usermain_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");
          this.usermain_entry.IS_TENANT_ADMIN = this.view_user_details[0]["IS_TENANT_ADMIN"];
        });
  }
}