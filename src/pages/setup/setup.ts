import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';

import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ApprovalProfilePage } from './approval-profile/approval-profile';
import { BanksetupPage } from './banksetup/banksetup';
import { BaseHttpService } from '../../services/base-http';
import { BranchsetupPage } from './branchsetup/branchsetup';
import { CashcardsetupPage } from './cashcardsetup/cashcardsetup';
import { ClaimtypePage } from './claimtype/claimtype';
import { CompanysettingsPage } from './companysettings/companysettings';
import { Component } from '@angular/core';
import { CountrysetupPage } from './countrysetup/countrysetup';
import { CustomerSetupPage } from './customer-setup/customer-setup';
import { DbmaintenancePage } from './dbmaintenance/dbmaintenance';
import { DepartmentsetupPage } from './departmentsetup/departmentsetup';
import { DesignationsetupPage } from './designationsetup/designationsetup';
import { DeviceSetupPage } from './device-setup/device-setup';
import { FormGroup } from '@angular/forms';
import { Http } from '@angular/http';
import { ImportExcelDataPage } from '../import-excel-data/import-excel-data';
import { LoginPage } from '../login/login';
import { MenuCardInterface } from '../../interfaces/menu-card';
import { MileagesetupPage } from './mileagesetup/mileagesetup';
import { OtRateSetupPage } from './ot-rate-setup/ot-rate-setup';
import { PaymenttypesetupPage } from './paymenttypesetup/paymenttypesetup';
import { QualificationsetupPage } from './qualificationsetup/qualificationsetup';
import { RolemodulesetupPage } from './rolemodulesetup/rolemodulesetup';
import { RolesetupPage } from './rolesetup/rolesetup';
import { SetupguidePage } from './setupguide/setupguide';
import { SocRegistrationPage } from './soc-registration/soc-registration';
import { StatesetupPage } from './statesetup/statesetup';
import { TenantCompanySetup_Model } from '../../models/tenantcompanysetup_model';
import { TenantCompanySetup_Service } from '../../services/tenantcompanysetup_service';
import { TenantCompanySiteSetup_Model } from '../../models/tenantcompanysitesetup_model';
import { TenantCompanySiteSetup_Service } from '../../services/tenantcompanysitesetup_service';
import { UserPage } from './user/user';

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

  SetupCards: MenuCardInterface[] = [
    { altname: "SetupGuide", name: 'SetupguidePage', page: SetupguidePage, icon: "ios-cog", text: "SETUP_GUID" },
    { altname: "TenantCompany", name: 'BranchsetupPage', page: BranchsetupPage, icon: "ios-briefcase", text: "TENANT_COMPANY" },
    { altname: "Bank", name: 'BanksetupPage', page: BanksetupPage, icon: "logo-usd", text: "BANK" },
    { altname: "Cashcard", name: 'CashcardsetupPage', page: CashcardsetupPage, icon: "cash", text: "CASH_CARD" },
    { altname: "ClaimType", name: 'ClaimtypePage', page: ClaimtypePage, icon: "list", text: "SETUP_CLAIM_TYPE" },
    { altname: "Designation", name: 'DesignationsetupPage', page: DesignationsetupPage, icon: "person", text: "SETUP_DESIGNATION" },
    { altname: "Department", name: 'DepartmentsetupPage', page: DepartmentsetupPage, icon: "git-pull-request", text: "SETUP_DEPARTMENT" },
    { altname: "Mileage", name: 'MileagesetupPage', page: MileagesetupPage, icon: "car", text: "SETUP_MILEAGE" },
    { altname: "PaymentType", name: 'PaymenttypesetupPage', page: PaymenttypesetupPage, icon: "list-box", text: "PAYMENT_TYPE" },
    { altname: "Qualification", name: 'QualificationsetupPage', page: QualificationsetupPage, icon: "medal", text: "SETUP_QUALIFICATION" },
    { altname: "User", name: 'UserPage', page: UserPage, icon: "people", text: "USER_REGISTRATION" },
    { altname: "Customer", name: 'CustomerSetupPage', page: CustomerSetupPage, icon: "man", text: "SETUP_CUSTOMER_REGISTRATION" },
    { altname: "Soc", name: 'SocRegistrationPage', page: SocRegistrationPage, icon: "md-clipboard", text: "S_SETUP_GUID" },
    { altname: "Country", name: 'CountrysetupPage', page: CountrysetupPage, icon: "ios-pin", text: "SETUP_COUNTRY" },
    { altname: "State", name: 'StatesetupPage', page: StatesetupPage, icon: "ios-pin-outline", text: "SETUP_STATE" },
    { altname: "Device", name: 'DeviceSetupPage', page: DeviceSetupPage, icon: "ios-finger-print-outline", text: "ATTENDANCE" },
    { altname: "ImportData", name: 'ImportExcelDataPage', page: ImportExcelDataPage, icon: "ios-stats-outline", text: "SETUP_IMPORT_DATA" },
    { altname: "CompanySettings", name: 'CompanysettingsPage', page: CompanysettingsPage, icon: "settings", text: "COMPANY_SETTINGS" },
    { altname: "DBMaintenance", name: 'DbmaintenancePage', page: DbmaintenancePage, icon: "cloud-download", text: "DB_MAINTENANCE" },
    { altname: "RoleSetup", name: 'RolesetupPage', page: RolesetupPage, icon: "git-network", text: "Role Setup" },
    { altname: "RoleModule", name: "RolemodulesetupPage", page: RolemodulesetupPage, icon: "ios-git-network", text: "Role Module Setup" },
    { altname: "ApprovalProfile", name: "ApprovalProfilePage", page: ApprovalProfilePage, icon: "basket", text: "Approval Profile" },
    { altname: "OtRate", name: "OTRateSetupPage", page: OtRateSetupPage, icon: "calculator", text: "OT Rate Setup" }
  ];

  public DisableSetupAccess() {
    // Alternative testing:
    for (let item of this.SetupCards) {
      item.enabled = false;
    }
  }

  public EnableSetupAccess() {
    // Alternative testing:
    for (let item of this.SetupCards) {
      item.enabled = true;
    }
  }

  submodules: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
//    fb: FormBuilder,
    public http: Http
  ) {
    this.DisableSetupAccess()
    if (localStorage.getItem("g_IS_TENANT_ADMIN") == "1") {
      this.EnableSetupAccess();
    }
    else if (localStorage.getItem("g_USER_GUID")) {
      //Get all the setup menu details for that particular role-----------------
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + "/api/v2/zcs/_table/view_user_role_submenu?filter=(USER_GUID=" + localStorage.getItem("g_USER_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      this.http
        .get(this.baseResourceUrl)
        .map(res => res.json())
        .subscribe(data => {
          this.submodules = data.resource;
          for (var item in data.resource) {
            // Alternative testing: 
            let n = this.SetupCards.findIndex( i => i.name === data.resource[item]["CODE_PAGE_NAME"]);
            if (n !== -1) { 
              this.SetupCards[n].enabled = true;
            }
          }
        });
      //------------------------------------------------------------------------
    }
    else {
      this.navCtrl.setRoot(LoginPage);
    }
  }

  goToPage(PageIndex: any) {
    this.navCtrl.push(PageIndex);
  }
}
