import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';

import { FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ApprovalProfilePage } from '../approval-profile/approval-profile';
import { BanksetupPage } from '../banksetup/banksetup';
import { BaseHttpService } from '../../services/base-http';
import { BranchsetupPage } from '../branchsetup/branchsetup';
import { CashcardsetupPage } from '../cashcardsetup/cashcardsetup';
import { ClaimtypePage } from '../claimtype/claimtype';
import { CompanysettingsPage } from '../companysettings/companysettings';
import { CompanysetupPage } from './companysetup/companysetup';
import { Component } from '@angular/core';
import { CountrysetupPage } from './countrysetup/countrysetup';
import { CustomerSetupPage } from './customer-setup/customer-setup';
import { DbmaintenancePage } from '../dbmaintenance/dbmaintenance';
import { DepartmentsetupPage } from './departmentsetup/departmentsetup';
import { DesignationsetupPage } from './designationsetup/designationsetup';
import { DeviceSetupPage } from './device-setup/device-setup';
import { Http } from '@angular/http';
import { ImportExcelDataPage } from '../import-excel-data/import-excel-data';
import { LoginPage } from '../login/login';
import { MileagesetupPage } from '../mileagesetup/mileagesetup';
import { OtRateSetupPage } from '../ot-rate-setup/ot-rate-setup';
import { PaymenttypesetupPage } from '../paymenttypesetup/paymenttypesetup';
import { QualificationsetupPage } from '../qualificationsetup/qualificationsetup';
import { RolemodulesetupPage } from '../rolemodulesetup/rolemodulesetup';
import { RolesetupPage } from '../rolesetup/rolesetup';
import { SettingsPage } from '../settings/settings';
import { SetupguidePage } from './setupguide/setupguide';
import { SocRegistrationPage } from '../soc-registration/soc-registration';
import { StatesetupPage } from './statesetup/statesetup';
import { TenantCompanySetup_Model } from '../../models/tenantcompanysetup_model';
import { TenantCompanySetup_Service } from '../../services/tenantcompanysetup_service';
import { TenantCompanySiteSetup_Model } from '../../models/tenantcompanysitesetup_model';
import { TenantCompanySiteSetup_Service } from '../../services/tenantcompanysitesetup_service';
import { UUID } from 'angular2-uuid';
import { UserPage } from '../user/user';

/**
 * Generated class for the SetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-setup',
  templateUrl: 'setup.html', providers: [TenantCompanySetup_Service, TenantCompanySiteSetup_Service, BaseHttpService]
})
export class SetupPage {
  tenant_company_entry: TenantCompanySetup_Model = new TenantCompanySetup_Model();
  tenant_company_site_entry: TenantCompanySiteSetup_Model = new TenantCompanySiteSetup_Model();

  Branchform: FormGroup;

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_branch' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
  public branchs: any; public hqDetails: any;

  public AddBranchsClicked: boolean = false;
  public EditBranchsClicked: boolean = false;
  public Exist_Record: boolean = false;

  public AddBranchesClicked: boolean = false;
  public branch_details: any;
  public exist_record_details: any;

  //Set the Model Name for Add------------------------------------------
  public BRANCHNAME_ngModel_Add: any;
  public COMPANYNAME_ngModel_Add: any;
  public ISHQ_FLAG_ngModel_Add: any;
  //---------------------------------------------------------------------

  //Set the Model Name for edit------------------------------------------
  public NAME_ngModel_Edit: any;
  //---------------------------------------------------------------------

  SetupGuideDisplay: boolean = false;
  TenantCompanyDisplay: boolean = false;
  BankDisplay: boolean = false;
  CashcardDisplay: boolean = false;
  ClaimTypeDisplay: boolean = false;
  DesignationDisplay: boolean = false;
  DepartmentDisplay: boolean = false;
  MileageDisplay: boolean = false;
  PaymentTypeDisplay: boolean = false;
  QualificationDisplay: boolean = false;
  UserDisplay: boolean = false;
  CustomerDisplay: boolean = false;
  SocDisplay: boolean = false;
  CountryDisplay: boolean = false;
  StateDisplay: boolean = false;
  DeviceDisplay: boolean = false;
  ImportDataDisplay: boolean = false;
  CompanySettingsDisplay: boolean = false;
  DBMaintenanceDisplay: boolean = false;
  RoleSetupDisplay: boolean = false;
  RoleModuleDisplay: boolean = false;
  ApprovalProfileDisplay: boolean = false;
  OtRateDisplay: boolean = false;

  public AddBranchsClick() {
    this.AddBranchsClicked = true;
    this.ClearControls();
    this.COMPANYNAME_ngModel_Add = this.branchs[0]["NAME"];
  }

  public CloseBranchsClick() {
    if (this.AddBranchsClicked == true) {
      this.AddBranchsClicked = false;
    }
    if (this.EditBranchsClicked == true) {
      this.EditBranchsClicked = false;
    }
  }

  public EditClick() {
    // this.ClearControls();
    // this.EditBranchsClicked = true;
    // var self = this;
    // this.branchsetupservice
    //   .get(BRANCH_GUID)
    //   .subscribe((data) => {
    //     self.branch_details = data;
    //     this.NAME_ngModel_Edit = self.branch_details.NAME; localStorage.setItem('Prev_br_Name', self.branch_details.NAME);
    //   });
  }

  public DeleteClick() {
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
    //         this.branchsetupservice.remove(BRANCH_GUID)
    //           .subscribe(() => {
    //             self.branchs = self.branchs.filter((item) => {
    //               return item.BRANCH_GUID != BRANCH_GUID
    //             });
    //           });
    //       }
    //     }
    //   ]
    // }); alert.present();
  }

  submodules: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private TenantCompanySetupService: TenantCompanySetup_Service, private tenantcompanysitesetupservice: TenantCompanySiteSetup_Service) {
    if (localStorage.getItem("g_USER_GUID") != null) {
      // this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + "/api/v2/zcs/_table/vw_tenantcompanysitedetails?filter=(TENANT_GUID=" + localStorage.getItem("g_TENANT_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      // this.http
      //   .get(this.baseResourceUrl)
      //   .map(res => res.json())
      //   .subscribe(data => {
      //     this.branchs = data.resource;
      //   });

      // this.Branchform = fb.group({
      //   COMPANYNAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
      //   BRANCHNAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
      //   ISHQ_FLAG: ["", Validators.required],
      // });
      this.SetupGuideDisplay = false;
      this.TenantCompanyDisplay = false;
      this.BankDisplay = false;
      this.CashcardDisplay = false;
      this.ClaimTypeDisplay = false;
      this.DesignationDisplay = false;
      this.DepartmentDisplay = false;
      this.MileageDisplay = false;
      this.PaymentTypeDisplay = false;
      this.QualificationDisplay = false;
      this.UserDisplay = false;
      this.CustomerDisplay = false;
      this.SocDisplay = false;
      this.CountryDisplay = false;
      this.StateDisplay = false;
      this.DeviceDisplay = false;
      this.ImportDataDisplay = false;
      this.CompanySettingsDisplay = false;
      this.DBMaintenanceDisplay = false;
      this.RoleSetupDisplay = false;
      this.RoleModuleDisplay = false;
      this.ApprovalProfileDisplay = false;
      this.OtRateDisplay = false;

      if (localStorage.getItem("g_USER_GUID") == "sva" || localStorage.getItem("g_IS_TENANT_ADMIN") == "1") {
        this.SetupGuideDisplay = true;
        this.TenantCompanyDisplay = true;
        this.BankDisplay = true;
        this.CashcardDisplay = true;
        this.ClaimTypeDisplay = true;
        this.DesignationDisplay = true;
        this.DepartmentDisplay = true;
        this.MileageDisplay = true;
        this.PaymentTypeDisplay = true;
        this.QualificationDisplay = true;
        this.UserDisplay = true;
        this.CustomerDisplay = true;
        this.SocDisplay = true;
        this.CountryDisplay = true;
        this.StateDisplay = true;
        this.DeviceDisplay = true;
        this.ImportDataDisplay = true;
        this.CompanySettingsDisplay = true;
        this.DBMaintenanceDisplay = true;
        this.RoleSetupDisplay = true;
        this.RoleModuleDisplay = true;
        this.ApprovalProfileDisplay = true;
        this.OtRateDisplay = true;
      }
      else {
        //Get all the setup menu details for that particular role-----------------
        this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + "/api/v2/zcs/_table/view_user_role_submenu?filter=(USER_GUID=" + localStorage.getItem("g_USER_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
        this.http
          .get(this.baseResourceUrl)
          .map(res => res.json())
          .subscribe(data => {
            this.submodules = data.resource;
            for (var item in data.resource) {
              if (data.resource[item]["CODE_PAGE_NAME"] == 'SetupguidePage') { this.SetupGuideDisplay = true; }
              if (data.resource[item]["CODE_PAGE_NAME"] == 'BranchsetupPage') { this.TenantCompanyDisplay = true; }
              if (data.resource[item]["CODE_PAGE_NAME"] == 'BanksetupPage') { this.BankDisplay = true; }
              if (data.resource[item]["CODE_PAGE_NAME"] == 'CashcardsetupPage') { this.CashcardDisplay = true; }
              if (data.resource[item]["CODE_PAGE_NAME"] == 'ClaimtypePage') { this.ClaimTypeDisplay = true; }
              if (data.resource[item]["CODE_PAGE_NAME"] == 'DesignationsetupPage') { this.DesignationDisplay = true; }
              if (data.resource[item]["CODE_PAGE_NAME"] == 'DepartmentsetupPage') { this.DepartmentDisplay = true; }
              if (data.resource[item]["CODE_PAGE_NAME"] == 'MileagesetupPage') { this.MileageDisplay = true; }
              if (data.resource[item]["CODE_PAGE_NAME"] == 'PaymenttypesetupPage') { this.PaymentTypeDisplay = true; }
              if (data.resource[item]["CODE_PAGE_NAME"] == 'QualificationsetupPage') { this.QualificationDisplay = true; }
              if (data.resource[item]["CODE_PAGE_NAME"] == 'UserPage') { this.UserDisplay = true; }
              if (data.resource[item]["CODE_PAGE_NAME"] == 'SocRegistrationPage') { this.SocDisplay = true; }
              if (data.resource[item]["CODE_PAGE_NAME"] == 'CountrysetupPage') { this.CountryDisplay = true; }
              if (data.resource[item]["CODE_PAGE_NAME"] == 'StatesetupPage') { this.StateDisplay = true; }
              if (data.resource[item]["CODE_PAGE_NAME"] == 'ImportExcelDataPage') { this.ImportDataDisplay = true; }
              if (data.resource[item]["CODE_PAGE_NAME"] == 'DeviceSetupPage') { this.DeviceDisplay = true; }
              if (data.resource[item]["CODE_PAGE_NAME"] == 'RolesetupPage') { this.RoleSetupDisplay = true; }
              if (data.resource[item]["CODE_PAGE_NAME"] == 'RolemodulesetupPage') { this.RoleModuleDisplay = true; }
              if (data.resource[item]["CODE_PAGE_NAME"] == 'CustomerSetupPage') { this.CustomerDisplay = true; }
              if (data.resource[item]["CODE_PAGE_NAME"] == 'ApprovalProfilePage') { this.ApprovalProfileDisplay = true; }
              if (data.resource[item]["CODE_PAGE_NAME"] == 'DbmaintenancePage') { this.DBMaintenanceDisplay = true; }
              if (data.resource[item]["CODE_PAGE_NAME"] == 'CompanysettingsPage') { this.CompanySettingsDisplay = true; }
            }
          });
        //------------------------------------------------------------------------
      }
    }
    else {
      this.navCtrl.setRoot(LoginPage);
    }
  }

  goToSetupGuide() {
    this.navCtrl.push(SetupguidePage);
  }

  goToBanksetup() {
    this.navCtrl.push(BanksetupPage)
  }

  goToBranchsetup() {
    this.navCtrl.push(BranchsetupPage)
  }

  goToCashcardsetup() {
    this.navCtrl.push(CashcardsetupPage)
  }

  goToClaimtypesetup() {
    this.navCtrl.push(ClaimtypePage)
  }

  goToUser() {
    this.navCtrl.push(UserPage)
  }

  goToCustomer() {
    this.navCtrl.push(CustomerSetupPage);
  }

  goToSOC() {
    this.navCtrl.push(SocRegistrationPage)
  }

  goToCompanysetup() {
    this.navCtrl.push(CompanysetupPage)
  }

  goToDesignationsetup() {
    this.navCtrl.push(DesignationsetupPage)
  }

  goToDepartmentsetup() {
    this.navCtrl.push(DepartmentsetupPage)
  }

  goToPaymenttypesetup() {
    this.navCtrl.push(PaymenttypesetupPage)
  }

  goToStatesetup() {
    this.navCtrl.push(StatesetupPage)
  }

  goToCountrysetup() {
    this.navCtrl.push(CountrysetupPage)
  }

  goToQualificationsetup() {
    this.navCtrl.push(QualificationsetupPage)
  }

  goToMileagesetup() {
    this.navCtrl.push(MileagesetupPage)
  }

  goToDevicesetup() {
    this.navCtrl.push(DeviceSetupPage);
  }

  goToImport_Excel_Data_setup() {
    this.navCtrl.push(ImportExcelDataPage)
  }

  goToOtRateSetup(){
    this.navCtrl.push(OtRateSetupPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetupPage');
  }

  Save() {
    if (this.Branchform.valid) {
      this.Save_Tenant_Company();
    }
  }

  Save_Tenant_Company() {
    //----------Check if the new tenant_company entered then take new guid else take the previous-------------
    this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + "/api/v2/zcs/_table/tenant_company?filter=(NAME=" + this.COMPANYNAME_ngModel_Add.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {

        if (data.resource[0] != undefined) {
          this.tenant_company_entry.TENANT_COMPANY_GUID = data.resource[0]["TENANT_COMPANY_GUID"];
          this.Save_Tenant_Company_Site();
        }
        else {
          this.tenant_company_entry.TENANT_COMPANY_GUID = UUID.UUID();
          this.tenant_company_entry.TENANT_GUID = localStorage.getItem("g_TENANT_GUID");
          this.tenant_company_entry.NAME = this.COMPANYNAME_ngModel_Add.trim();

          this.tenant_company_entry.ACTIVATION_FLAG = "1";

          this.tenant_company_entry.CREATION_TS = new Date().toISOString();
          this.tenant_company_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
          this.tenant_company_entry.UPDATE_TS = new Date().toISOString();
          this.tenant_company_entry.UPDATE_USER_GUID = "";

          this.TenantCompanySetupService.save(this.tenant_company_entry)
            .subscribe((response) => {
              if (response.status == 200) {
                this.Save_Tenant_Company_Site();
              }
            })
        }
      });

  }

  Save_Tenant_Company_Site() {
    this.tenant_company_site_entry.TENANT_COMPANY_SITE_GUID = UUID.UUID();
    this.tenant_company_site_entry.TENANT_COMPANY_GUID = this.tenant_company_entry.TENANT_COMPANY_GUID;
    this.tenant_company_site_entry.SITE_NAME = this.BRANCHNAME_ngModel_Add.trim();
    this.tenant_company_site_entry.ACTIVATION_FLAG = "1";
    this.tenant_company_site_entry.CREATION_TS = new Date().toISOString();
    this.tenant_company_site_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
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
          //Check if previous tenant_company_site is hq active but current tenant_company_site is updating to hq active then previous tenant_company_site will inactive.      
          if (this.ISHQ_FLAG_ngModel_Add == true) {
            this.UpdateHQ();
          }
          else {
            alert('Company & Site Registered successfully');
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        }
      })
  }

  UpdateHQ() {
    if (this.ISHQ_FLAG_ngModel_Add == true) {
      //-------------Get all the details of previous tenant_company_site------------------------------
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + "/api/v2/zcs/_table/tenant_company_site?filter=(TENANT_COMPANY_SITE_GUID=" + localStorage.getItem("g_TENANT_COMPANY_SITE_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      this.http
        .get(this.baseResourceUrl)
        .map(res => res.json())
        .subscribe(data => {
          this.hqDetails = data.resource;
          this.tenant_company_site_entry.TENANT_COMPANY_SITE_GUID = localStorage.getItem("g_TENANT_COMPANY_SITE_GUID");
          this.tenant_company_site_entry.TENANT_COMPANY_GUID = localStorage.getItem("g_TENANT_COMPANY_GUID");
          this.tenant_company_site_entry.SITE_NAME = this.hqDetails[0]["SITE_NAME"];
          this.tenant_company_site_entry.REGISTRATION_NUM = this.hqDetails[0]["REGISTRATION_NUM"];
          this.tenant_company_site_entry.ADDRESS = this.hqDetails[0]["ADDRESS"];
          this.tenant_company_site_entry.ADDRESS2 = this.hqDetails[0]["ADDRESS2"];
          this.tenant_company_site_entry.ADDRESS3 = this.hqDetails[0]["ADDRESS3"];
          this.tenant_company_site_entry.CONTACT_NO = this.hqDetails[0]["CONTACT_NO"];
          this.tenant_company_site_entry.EMAIL = this.hqDetails[0]["EMAIL"];
          this.tenant_company_site_entry.ACTIVATION_FLAG = this.hqDetails[0]["ACTIVATION_FLAG"];

          this.tenant_company_site_entry.CONTACT_PERSON = this.hqDetails[0]["CONTACT_PERSON"];
          this.tenant_company_site_entry.CONTACT_PERSON_CONTACT_NO = this.hqDetails[0]["CONTACT_PERSON_CONTACT_NO"];
          this.tenant_company_site_entry.CONTACT_PERSON_EMAIL = this.hqDetails[0]["CONTACT_PERSON_EMAIL"];
          this.tenant_company_site_entry.WEBSITE = this.hqDetails[0]["WEBSITE"];

          this.tenant_company_site_entry.CREATION_TS = this.hqDetails[0]["CREATION_TS"];
          this.tenant_company_site_entry.CREATION_USER_GUID = this.hqDetails[0]["CREATION_USER_GUID"];
          this.tenant_company_site_entry.UPDATE_TS = new Date().toISOString();
          this.tenant_company_site_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");
          this.tenant_company_site_entry.ISHQ = "0";

          this.tenantcompanysitesetupservice.update(this.tenant_company_site_entry)
            .subscribe((response) => {
              if (response.status == 200) {
                alert('Company & Site Registered successfully');
                this.navCtrl.setRoot(this.navCtrl.getActive().component);
              }
            })
        });
    }
  }

  getBranchList() {

  }

  Update() {

  }

  ClearControls() {
    this.BRANCHNAME_ngModel_Add = "";
    this.COMPANYNAME_ngModel_Add = "";

    this.NAME_ngModel_Edit = "";
  }

  goToSettings() {
    this.navCtrl.push(SettingsPage);
  }

  goToCompanySettings() {
    this.navCtrl.push(CompanysettingsPage);
  }

  goToDBMaintenance() {
    this.navCtrl.push(DbmaintenancePage);
  }

  goToRolesetup() {
    this.navCtrl.push(RolesetupPage)
  }

  goToRoleModulesetup() {
    this.navCtrl.push(RolemodulesetupPage)
  }

  goToApprovalProfileSetup() {
    this.navCtrl.push(ApprovalProfilePage);
  }

}
