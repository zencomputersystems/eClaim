import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { BaseHttpService } from '../../services/base-http';

import { TravelClaimViewPage } from '../travel-claim-view/travel-claim-view.component';
import { EntertainmentClaimViewPage } from '../entertainment-claim-view/entertainment-claim-view';
import { OvertimeClaimViewPage } from '../overtime-claim-view/overtime-claim-view';
import { PrintClaimViewPage } from '../print-claim-view/print-claim-view';
import { GiftClaimViewPage } from '../gift-claim-view/gift-claim-view';
import { MiscellaneousClaimViewPage } from '../miscellaneous-claim-view/miscellaneous-claim-view';

import { EntertainmentclaimPage } from '../entertainmentclaim/entertainmentclaim';
import { TravelclaimPage } from '../travel-claim/travel-claim.component';
import { PrintclaimPage } from '../printclaim/printclaim';
import { GiftclaimPage } from '../giftclaim/giftclaim';
import { OvertimeclaimPage } from '../overtimeclaim/overtimeclaim';
import { MiscellaneousClaimPage } from '../miscellaneous-claim/miscellaneous-claim';

import { ApiManagerProvider } from '../../providers/api-manager.provider';

import { ExcelService } from '../../providers/excel.service';
import * as Settings from '../../dbSettings/companySettings'

/**
 * Generated class for the UserclaimslistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-userclaimslist',
  templateUrl: 'all-claim-list.html', providers: [BaseHttpService, ExcelService]
})
export class AllClaimListPage {
  claimhistorydetails: any[];
  claimhistorydetails1: any[];
  userdetails: any;
  claimrefguid: any;
  userguid: any;
  month: any;
  baseResourceUrl: string;
  baseResourceUrl1: string;
  searchboxValue: string;
  FinanceLogin: boolean = false;
  loginUserRole: string;
  public page: number = 1;

  deptList: any[];
  employeeList: any[] = [];
  employeeList1: any[] = [];
  claimTypeList: any[];
  yearsList: any[] = [];
  currentYear: number = new Date().getFullYear();
  currency = localStorage.getItem("cs_default_currency")

  constructor(private excelService: ExcelService, public navCtrl: NavController, public navParams: NavParams, public http: Http) {
    this.claimrefguid = navParams.get("claimRefGuid");
    this.userguid = navParams.get("userGuid");
    this.month = navParams.get("Month");
    this.loginUserRole = localStorage.getItem("g_ROLE_NAME");

    if (this.claimrefguid !== null && this.claimrefguid !== undefined) {
      this.FinanceLogin = true;
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimhistorydetail?filter=(CLAIM_REF_GUID=' + this.claimrefguid + ')&api_key=' + constants.DREAMFACTORY_API_KEY;

    }
    else {
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimhistorydetail?filter=(APPROVER=' + localStorage.getItem("g_USER_GUID") + ')AND(PROFILE_LEVEL=1)AND(YEAR=' + this.currentYear + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    this.BindDepartment();
    this.BindEmployeesbyDepartment("All");
    this.BindClaimTypes();
    this.BindYears();
    this.BindData("All", "All", "All", "All", "All");
    if (this.FinanceLogin) {
      this.baseResourceUrl1 = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_getuserdetails?filter=(USER_GUID=' + this.userguid + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      this.getuserDetails();
    }

    this.excelService = excelService;
  }

  getuserDetails() {
    this.http
      .get(this.baseResourceUrl1)
      .map(res => res.json())
      .subscribe(data => {
        this.userdetails = data["resource"];
      });
  };

  ExcelData: any[] = [];
  BindData(ddlDept: string, ddlEmployee: string, ddlmonth: string, ddlClaimTypes: string, ddlStatus: string) {
    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.claimhistorydetails = data["resource"];
        if (this.claimhistorydetails.length != 0 && this.loginUserRole === "Finance Admin") {
          this.claimhistorydetails.forEach(element => {
            element.TRAVEL_DATE = new Date(element.TRAVEL_DATE.replace(/-/g, "/"))
            if (element.STATUS.toString() === "Approved" && element.PROFILE_LEVEL.toString() === "3") { element.STATUS = "Paid"; }
          });
        }
        this.claimhistorydetails1 = this.claimhistorydetails;
        if (this.claimhistorydetails.length != 0) {
          if (ddlDept.toString() !== "All") { this.claimhistorydetails = this.claimhistorydetails.filter(s => s.DEPARTMENT_GUID.toString() === ddlDept.toString()) }
          if (ddlEmployee.toString() !== "All") { this.claimhistorydetails = this.claimhistorydetails.filter(s => s.USER_GUID.toString() === ddlEmployee.toString()) }
          if (ddlmonth.toString() !== "All") { this.claimhistorydetails = this.claimhistorydetails.filter(s => s.MONTH.toString() === ddlmonth.toString()) }
          if (ddlClaimTypes.toString() !== "All") { this.claimhistorydetails = this.claimhistorydetails.filter(s => s.CLAIM_TYPE_GUID.toString() === ddlClaimTypes.toString()) }
          if (ddlStatus.toString() !== "All") { this.claimhistorydetails = this.claimhistorydetails.filter(s => s.STATUS.toString() === ddlStatus.toString()) }

        }
        for (var item in data["resource"]) {
          this.ExcelData.push({ Name: data["resource"][item]["FULLNAME"], Department: data["resource"][item]["DEPARTMENT"], Month: data["resource"][item]["MONTH"], ClaimType: data["resource"][item]["CLAIM_TYPE"], Date: data["resource"][item]["TRAVEL_DATE"], Status: data["resource"][item]["STATUS"], Amount: data["resource"][item]["CLAIM_AMOUNT"] });
        }
      });
  }
  onSearchInput() {
    // alert('hi')
    let val = this.searchboxValue;
    if (val && val.trim() != '') {
      this.claimhistorydetails = this.claimhistorydetails1.filter((item) => {
        let claimtype: number;
        let status: number;
        let amount: number;
        let date: number;

        if (item.CLAIM_TYPE != null) { claimtype = item.CLAIM_TYPE.toLowerCase().indexOf(val.toLowerCase()) }
        if (item.TRAVEL_DATE != null) { date = item.TRAVEL_DATE.toString().toLowerCase().indexOf(val.toLowerCase()) }
        if (item.STATUS != null) { status = item.STATUS.toString().toLowerCase().indexOf(val.toLowerCase()) }
        if (item.CLAIM_AMOUNT != null) { amount = item.CLAIM_AMOUNT.toString().toLowerCase().indexOf(val.toLowerCase()) }
        return (
          (claimtype > -1)
          || (date > -1)
          || (status > -1)
          || (amount > -1)
        );
      })
    }
    else {
      this.claimhistorydetails = this.claimhistorydetails1;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClaimhistorydetailPage');
  }

  ExportToExcel() {
    // this.excelService.exportAsExcelFile(this.claimhistorydetails,'Data');
    this.excelService.exportAsExcelFile(this.ExcelData, 'Data');
  }

  claimRequestGUID: string; level: string; designation: string;

  ClaimNavigation(designation: string, claimRequestGUID: string, level: string, claimType: any, navType: number) {
    this.claimRequestGUID = claimRequestGUID;
    this.level = level;
    this.designation = designation;
    switch (claimType) {
      case '2d8d7c80-c9ae-9736-b256-4d592e7b7887': if (navType === 1) this.pushPage(GiftClaimViewPage); else this.editPage(GiftclaimPage); break;
      case '37067b3d-1bf4-33a3-2b60-3ca40baf589a': if (navType === 1) this.pushPage(OvertimeClaimViewPage); else this.editPage(OvertimeclaimPage); break;
      case '84b3cee2-9f9d-ccb9-89a1-1e70cef19f86': if (navType === 1) this.pushPage(MiscellaneousClaimViewPage); else this.editPage(MiscellaneousClaimPage); break;

      case '58c59b56-289e-31a2-f708-138e81a9c823': if (navType === 1) this.pushPage(TravelClaimViewPage); else this.editPage(TravelclaimPage); break;
      case 'd9567482-033a-6d92-3246-f33043155746': if (navType === 1) this.pushPage(PrintClaimViewPage); else this.editPage(PrintclaimPage); break;
      case 'f3217ecc-19d7-903a-6c56-78fdbd7bbcf1': if (navType === 1) this.pushPage(EntertainmentClaimViewPage); else this.editPage(EntertainmentclaimPage); break;
    }
  }

  pushPage(claimType: any) {
    this.navCtrl.push(claimType, {
      isApprover: false,
      approverDesignation: this.designation,
      cr_GUID: this.claimRequestGUID,
      level_no: this.level,
      approver_GUID: localStorage.getItem('g_USER_GUID')
    });
  }
  editPage(claimType: any) {
    this.navCtrl.push(claimType, {
      isFormEdit: 'true',
      cr_GUID: this.claimRequestGUID
    });
  }
  BindClaimTypes() {
    this.http
      .get(constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_claim_type?api_key=' + constants.DREAMFACTORY_API_KEY)
      .map(res => res.json())
      .subscribe(data => {
        this.claimTypeList = data["resource"];
      });
  }

  BindYears() {
    for (let i = 2016; i <= new Date().getFullYear(); i++) {
      this.yearsList.push(i);
    }
  }

  BindDepartment() {
    this.http
      .get(constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_department?api_key=' + constants.DREAMFACTORY_API_KEY)
      .map(res => res.json())
      .subscribe(data => {
        this.deptList = data["resource"];
      });
    //console.log(this.deptList);
  }

  BindEmployeesbyDepartment(dept: string) {
    //alert(dept);
    this.http
      .get(constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_user_display_new?api_key=' + constants.DREAMFACTORY_API_KEY)
      .map(res => res.json())
      .subscribe(data => {
        this.employeeList1 = data["resource"];
        this.employeeList = this.employeeList1;
        if (dept !== "All") {
          this.employeeList = this.employeeList1.filter(s => s.DEPT_GUID.toString() === dept.toString());
        }
      });

  }

  SearchClaimsData(ddlDept: string, ddlEmployee: string, ddlmonth: string, ddlClaimTypes: string, ddlStatus: string, ddlYear: number) {
    if (this.claimrefguid !== null && this.claimrefguid !== undefined) {
      if (this.loginUserRole === "Finance Admin") {
        this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimhistorydetail?filter=(CLAIM_REF_GUID=' + this.claimrefguid + ')AND(APPROVER=' + localStorage.getItem("g_USER_GUID") + ')AND(PROFILE_LEVEL=3)&api_key=' + constants.DREAMFACTORY_API_KEY;
      }
      else {
        this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimhistorydetail?filter=(CLAIM_REF_GUID=' + this.claimrefguid + ')AND(APPROVER=' + localStorage.getItem("g_USER_GUID") + ')AND(PROFILE_LEVEL=2)&api_key=' + constants.DREAMFACTORY_API_KEY;
      }

    }
    else {
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimhistorydetail?filter=(APPROVER=' + localStorage.getItem("g_USER_GUID") + ')AND(PROFILE_LEVEL=1)AND(YEAR=' + ddlYear + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    this.BindData(ddlDept, ddlEmployee, ddlmonth, ddlClaimTypes, ddlStatus);

  }


}

