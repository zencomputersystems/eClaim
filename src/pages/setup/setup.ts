import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';

import { FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ApprovalProfilePage } from './approval-profile/approval-profile';
import { BanksetupPage } from './banksetup/banksetup';
import { BaseHttpService } from '../../services/base-http';
import { BranchsetupPage } from './branchsetup/branchsetup';
import { CashcardsetupPage } from './cashcardsetup/cashcardsetup';
import { ClaimtypePage } from './claimtype/claimtype';
import { CompanysettingsPage } from './companysettings/companysettings';
import { CompanysetupPage } from './companysetup/companysetup';
import { Component } from '@angular/core';
import { CountrysetupPage } from './countrysetup/countrysetup';
import { CustomerSetupPage } from './customer-setup/customer-setup';
import { DbmaintenancePage } from './dbmaintenance/dbmaintenance';
import { DepartmentsetupPage } from './departmentsetup/departmentsetup';
import { DesignationsetupPage } from './designationsetup/designationsetup';
import { DeviceSetupPage } from './device-setup/device-setup';
import { Http } from '@angular/http';
import { ImportExcelDataPage } from '../import-excel-data/import-excel-data';
import { LoginPage } from '../login/login';
import { MileagesetupPage } from './mileagesetup/mileagesetup';
import { OtRateSetupPage } from './ot-rate-setup/ot-rate-setup';
import { PaymenttypesetupPage } from './paymenttypesetup/paymenttypesetup';
import { QualificationsetupPage } from './qualificationsetup/qualificationsetup';
import { RolemodulesetupPage } from './rolemodulesetup/rolemodulesetup';
import { RolesetupPage } from './rolesetup/rolesetup';
import { SettingsPage } from './settings/settings';
import { SetupguidePage } from './setupguide/setupguide';
import { SocRegistrationPage } from './soc-registration/soc-registration';
import { StatesetupPage } from './statesetup/statesetup';
import { TenantCompanySetup_Model } from '../../models/tenantcompanysetup_model';
import { TenantCompanySetup_Service } from '../../services/tenantcompanysetup_service';
import { TenantCompanySiteSetup_Model } from '../../models/tenantcompanysitesetup_model';
import { TenantCompanySiteSetup_Service } from '../../services/tenantcompanysitesetup_service';
import { UserPage } from './user/user';
import { getKeyByValue } from '../../shared/GlobalFunction';

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

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
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

  /* SetupGuideDisplay: boolean = false;
  TenantCompanyDisplay: boolean = false;
  BankDisplay: boolean = false;
  CashcardDisplay: boolean = false; */
  Setup: { [ index: string] : boolean } = {
    "SetupGuide"     : false,
    "TenantCompany"  : false,
    "Bank"           : false,
    "Cashcard"       : false,
    "ClaimType"      : false,
    "Designation"    : false,
    "Department"     : false,
    "Mileage"        : false,
    "PaymentType"    : false,
    "Qualification"  : false,
    "User"           : false,
    "Customer"       : false,
    "Soc"            : false,
    "Country"        : false,
    "State"          : false,
    "Device"         : false,
    "ImportData"     : false,
    "CompanySettings": false,
    "DBMaintenance"  : false,
    "RoleSetup"      : false,
    "RoleModule"     : false,
    "ApprovalProfile": false,
    "OtRate"         : false,
  }
 
  SetupPageMap: { [index: string] : string } = {
    "SetupGuide"          : 'SetupguidePage',
    "TenantCompany"       : 'BranchsetupPage',
    "Bank"                : 'BanksetupPage',
    "Cashcard"            : 'CashcardsetupPage',
    "ClaimType"           : 'ClaimtypePage',
    "Designation"         : 'DesignationsetupPage',
    "Department"          : 'DepartmentsetupPage',
    "Mileage"             : 'MileagesetupPage',
    "PaymentType"         : 'PaymenttypesetupPage',
    "Qualification"       : 'QualificationsetupPage',
    "User"                : 'UserPage',
    "Customer"            : 'CustomerSetupPage',
    "Soc"                 : 'SocRegistrationPage',
    "Country"             : 'CountrysetupPage',
    "State"               : 'StatesetupPage',
    "Device"              : 'DeviceSetupPage',
    "ImportData"          : 'ImportExcelDataPage',
    "CompanySettings"     : 'CompanysettingsPage',
    "DBMaintenance"       : 'DbmaintenancePage',
    "RoleSetup"           : 'RolesetupPage',
    "RoleModule"          : 'RolemodulesetupPage',
    "ApprovalProfile"     : 'ApprovalProfilePage',
    "OtRate"              : 'OTRateSetupPage'
  }

  public DisableSetupAccess() {
    let Key: any;
    for (Key of Object.keys(this.Setup)) {
      this.Setup[Key] = false;
    }
  }

  public EnableSetupAccess() {
    let Key: any;
    for (Key of Object.keys(this.Setup)) {
      this.Setup[Key] = true;
    }
  }

  submodules: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private TenantCompanySetupService: TenantCompanySetup_Service, private tenantcompanysitesetupservice: TenantCompanySiteSetup_Service) {
    if (localStorage.getItem("g_USER_GUID") != null) {
      this.DisableSetupAccess();
      if (localStorage.getItem("g_IS_TENANT_ADMIN") == "1") {
        this.EnableSetupAccess();
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
              this.Setup[getKeyByValue(this.SetupPageMap,data.resource[item]["CODE_PAGE_NAME"])] = true;
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
    console.log(this.Setup);
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
