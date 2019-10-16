import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { BaseHttpService } from '../../services/base-http';
import { ExcelService } from '../../providers/excel.service';


import { TravelClaimViewPage } from '../travel-claim-view/travel-claim-view.component';
import { EntertainmentClaimViewPage } from '../entertainment-claim-view/entertainment-claim-view';
import { OvertimeClaimViewPage } from '../overtime-claim-view/overtime-claim-view';
import { PrintClaimViewPage } from '../print-claim-view/print-claim-view';
import { GiftClaimViewPage } from '../gift-claim-view/gift-claim-view';
import { MiscellaneousClaimViewPage } from '../miscellaneous-claim-view/miscellaneous-claim-view';
import * as Settings from '../../dbSettings/companySettings'


/**
 * Generated class for the ClaimhistorydetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-claimhistorydetail',
  templateUrl: 'claimhistorydetail.html', providers: [BaseHttpService, ExcelService]
})
export class ClaimhistorydetailPage {
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
  btnSearch: boolean = false;
  currency = localStorage.getItem("cs_default_currency")


  //role: any;
  deptList: any[];
  employeeList: any[] = [];
  employeeList1: any[] = [];
  claimTypeList: any[];
  yearsList: any[] = [];
  currentYear: number = new Date().getFullYear();
  ddlDep: any = 'All'; ddlName: any = 'All'; ddlMon: any = 'All'; ddlClaim: any = 'All'; ddlSta: any = 'All';

  constructor(private excelService: ExcelService, public navCtrl: NavController, public navParams: NavParams, public http: Http) {
    this.claimrefguid = navParams.get("claimRefGuid");
    this.userguid = navParams.get("userGuid");
    this.month = navParams.get("Month");
    // this.role = navParams.get("role");
    // this.loginUserRole = localStorage.getItem("g_ROLE_NAME");
    // let ddlDept:any;
    //     alert(ddlDept.value)
    //alert(this.userguid);
    //this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimhistorydetail?filter=(CLAIM_REF_GUID='+this.claimrefguid + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    //console.log(this.baseResourceUrl);

    //this.loginUserGuid = localStorage.getItem("g_USER_GUID");
    // this.claimrefguid = navParams.get("claimRefGuid");
    // alert(this.claimrefguid);

    if (this.claimrefguid !== null && this.claimrefguid !== undefined) {
      this.FinanceLogin = true;
      // if (this.role == "Payment") {
      //   this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimhistorydetail?filter=(CLAIM_REF_GUID=' + this.claimrefguid + ')AND(PROFILE_LEVEL=3)&api_key=' + constants.DREAMFACTORY_API_KEY;
      // }
      // else {
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimrequestlist?filter=(CLAIM_REF_GUID=' + this.claimrefguid + ')AND(PROFILE_LEVEL!=1)&api_key=' + constants.DREAMFACTORY_API_KEY;
      //}

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
        let key: any;

        this.claimhistorydetails.forEach(element => {
          element.TRAVEL_DATE = new Date(element.TRAVEL_DATE.replace(/-/g, "/"))
          // if (this.claimhistorydetails.length != 0 && this.loginUserRole === "Finance Admin") {
          //   if (element.STATUS.toString() === "Approved" && element.PROFILE_LEVEL.toString() === "3") { element.STATUS = "Paid"; }
          // }
          if (!this.FinanceLogin) {
            element.PROFILE_LEVEL=element.PROFILE_LEVEL_MAIN;
            element.STATUS=element.REQ_STATUS;
          }
            if (element.PROFILE_LEVEL == Settings.ProfileLevels.ONE && element.STATUS == Settings.StatusConstants.PENDING)
              element.STATUS = Settings.StatusConstants.PENDINGSUPERIOR
            else if (element.PROFILE_LEVEL == Settings.ProfileLevels.TWO && element.STATUS == Settings.StatusConstants.PENDING)
              element.STATUS = Settings.StatusConstants.PENDINGFINANCEVALIDATION
            else if (element.PROFILE_LEVEL == Settings.ProfileLevels.THREE && element.STATUS == Settings.StatusConstants.APPROVED)
              element.STATUS = Settings.StatusConstants.PENDINGPAYMENT
            else if (element.PROFILE_LEVEL == Settings.ProfileLevels.ZERO && element.PREVIOUS_LEVEL == Settings.ProfileLevels.ONE && element.STATUS == Settings.StatusConstants.REJECTED)
              element.STATUS = Settings.StatusConstants.SUPERIORREJECTED
            else if (element.PROFILE_LEVEL == Settings.ProfileLevels.ZERO && element.PREVIOUS_LEVEL == Settings.ProfileLevels.TWO && element.STATUS == Settings.StatusConstants.REJECTED)
              element.STATUS = Settings.StatusConstants.FINANCEREJECTED
            else if (element.PROFILE_LEVEL == Settings.ProfileLevels.ZERO && element.PREVIOUS_LEVEL == Settings.ProfileLevels.THREE && element.STATUS == Settings.StatusConstants.REJECTED)
              element.STATUS = Settings.StatusConstants.PAYMENTREJECTED
         
          // if (element.REQ_STATUS === 'Rejected') {
          //   element.STAGE_GUID = null;
          // }
          // else {
          //   key = element.PROFILE_LEVEL_MAIN;
          // }

          // switch (key) {
          //   case 1: element.STAGE_GUID = 'Superior'; break;
          //   case 2: element.STAGE_GUID = 'Finance Executive'; break;
          //   case 3:
          //   case -1: element.STAGE_GUID = 'Finance & Admin'; break;
          // }

        });
        this.claimhistorydetails1 = this.claimhistorydetails;
        if (this.claimhistorydetails.length != 0) {
          if (ddlDept.toString() !== "All") { this.claimhistorydetails = this.claimhistorydetails.filter(s => s.DEPARTMENT_GUID.toString() === ddlDept.toString()) }
          if (ddlEmployee.toString() !== "All") { this.claimhistorydetails = this.claimhistorydetails.filter(s => s.USER_GUID.toString() === ddlEmployee.toString()) }
          if (ddlmonth.toString() !== "All") { this.claimhistorydetails = this.claimhistorydetails.filter(s => s.MONTH.toString() === ddlmonth.toString()) }
          if (ddlClaimTypes.toString() !== "All") { this.claimhistorydetails = this.claimhistorydetails.filter(s => s.CLAIM_TYPE_GUID.toString() === ddlClaimTypes.toString()) }
          if (ddlStatus.toString() !== "All") { this.claimhistorydetails = this.claimhistorydetails.filter(s => s.STATUS.toString() === ddlStatus.toString().replace("_"," ")) }

        }
        // for (var item in data["resource"]) {
        //   this.ExcelData.push({ Name: data["resource"][item]["FULLNAME"], Department: data["resource"][item]["DEPARTMENT"], Month: data["resource"][item]["MONTH"], ClaimType: data["resource"][item]["CLAIM_TYPE"], Date: data["resource"][item]["TRAVEL_DATE"], Status: data["resource"][item]["STATUS"], Amount: data["resource"][item]["CLAIM_AMOUNT"] });
        // }
        this.btnSearch = true;
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
        let dept: number;
        let user: number;
        let month: number;

        if (item.DEPARTMENT != null && !this.FinanceLogin) { dept = item.DEPARTMENT.toLowerCase().indexOf(val.toLowerCase()) }
        if (item.FULLNAME != null && !this.FinanceLogin) { user = item.FULLNAME.toString().toLowerCase().indexOf(val.toLowerCase()) }
        if (item.MONTH != null && !this.FinanceLogin) { month = item.MONTH.toString().toLowerCase().indexOf(val.toLowerCase()) }
        if (item.CLAIM_TYPE != null) { claimtype = item.CLAIM_TYPE.toLowerCase().indexOf(val.toLowerCase()) }
        if (item.TRAVEL_DATE != null) { date = item.TRAVEL_DATE.toString().toLowerCase().indexOf(val.toLowerCase()) }
        if (item.STATUS != null) { status = item.STATUS.toString().toLowerCase().indexOf(val.toLowerCase()) }
        if (item.CLAIM_AMOUNT != null) { amount = item.CLAIM_AMOUNT.toString().toLowerCase().indexOf(val.toLowerCase()) }
        return (
          (dept > -1)
          || (user > -1)
          || (month > -1)
          || (claimtype > -1)
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

  SearchClaimsData() {
    this.btnSearch = false;
    if (this.claimrefguid !== null && this.claimrefguid !== undefined) {
      // if (this.role == "Payment") {
      //   this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimhistorydetail?filter=(CLAIM_REF_GUID=' + this.claimrefguid + ')AND(APPROVER=' + localStorage.getItem("g_USER_GUID") + ')AND(PROFILE_LEVEL=3)&api_key=' + constants.DREAMFACTORY_API_KEY;
      // }
      // else {
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimrequestlist?filter=(CLAIM_REF_GUID=' + this.claimrefguid + ')AND(PROFILE_LEVEL!=1)&api_key=' + constants.DREAMFACTORY_API_KEY;
      //}

    }
    else {
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimhistorydetail?filter=(APPROVER=' + localStorage.getItem("g_USER_GUID") + ')AND(PROFILE_LEVEL=1)AND(YEAR=' + this.currentYear + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    this.BindData(this.ddlDep, this.ddlName, this.ddlMon, this.ddlClaim, this.ddlSta);
  }

  ExportExcelClicked: boolean = false; ExcelColumns: any[] = [];
  ExportToExcel() {
    // this.excelService.exportAsExcelFile(this.claimhistorydetails,'Data');
    // this.excelService.exportAsExcelFile(this.ExcelData, 'Data');

    this.ExportExcelClicked = true;
    this.ExcelColumns = [];
    this.ExcelColumns.push({ Columns: 'Name' });
    this.ExcelColumns.push({ Columns: 'Department' });
    this.ExcelColumns.push({ Columns: 'Month' });
    this.ExcelColumns.push({ Columns: 'ClaimType' });
    this.ExcelColumns.push({ Columns: 'Date' });
    this.ExcelColumns.push({ Columns: 'Status' });
    this.ExcelColumns.push({ Columns: 'Amount' });
  }

  CloseExportExcel() {
    this.ExportExcelClicked = false;
    this.checked.length = 0;
  }

  checked: any[] = [];
  SelectColumn(e: any, SelectedColumn: any) {
    if (e.checked == true) {
      this.checked.push(SelectedColumn);
    } else {
      let index = this.RemoveCheckedFromArray(SelectedColumn);
      this.checked.splice(index, 1);
    }
  }



  claimRequestGUID: string; level: string; designation: string;

  ClaimNavigation(designation: string, claimRequestGUID: string, level: string, claimType: any, navType: number) {
    this.claimRequestGUID = claimRequestGUID;
    this.level = level;
    this.designation = designation;
    switch (claimType) {
      case '2d8d7c80-c9ae-9736-b256-4d592e7b7887': this.pushPage(GiftClaimViewPage); break;
      case '37067b3d-1bf4-33a3-2b60-3ca40baf589a': this.pushPage(OvertimeClaimViewPage); break;
      case '84b3cee2-9f9d-ccb9-89a1-1e70cef19f86': this.pushPage(MiscellaneousClaimViewPage); break;
      case '58c59b56-289e-31a2-f708-138e81a9c823': this.pushPage(TravelClaimViewPage); break;
      case 'd9567482-033a-6d92-3246-f33043155746': this.pushPage(PrintClaimViewPage); break;
      case 'f3217ecc-19d7-903a-6c56-78fdbd7bbcf1': this.pushPage(EntertainmentClaimViewPage); break;
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

  RemoveCheckedFromArray(checkbox: String) {
    return this.checked.findIndex((category) => {
      return category === checkbox;
    })
  }

  SubmitExportExcel() {
    this.ExcelData = [];
    if (this.checked.length > 0) {
      for (var item in this.claimhistorydetails) {
        if (this.checked.length > 0) {
          let ctr: number = 0;
          let jsonStr = '';
          for (var chkItem in this.checked) {
            ctr = ctr + 1;
            switch (this.checked[chkItem]["Columns"]) {
              case "Name":
                if (this.checked.length == 1) {
                  jsonStr += '{"Name":"' + this.claimhistorydetails[item]["FULLNAME"] + '"';
                }
                else {
                  jsonStr += '{"Name":"' + this.claimhistorydetails[item]["FULLNAME"] + '",';
                }
                break;
              case "Department":
                if (jsonStr.length > 0) {
                  if (ctr == this.checked.length) {
                    jsonStr += '"Department":"' + this.claimhistorydetails[item]["DEPARTMENT"] + '"';
                  }
                  else {
                    jsonStr += '"Department":"' + this.claimhistorydetails[item]["DEPARTMENT"] + '",';
                  }
                }
                else {
                  if (this.checked.length == 1) {
                    jsonStr += '{"Department":"' + this.claimhistorydetails[item]["DEPARTMENT"] + '"';
                  }
                  else {
                    jsonStr += '{"Department":"' + this.claimhistorydetails[item]["DEPARTMENT"] + '",';
                  }
                }
                break;
              case "Month":
                if (jsonStr.length > 0) {
                  if (ctr == this.checked.length) {
                    jsonStr += '"Month":"' + this.claimhistorydetails[item]["MONTH"] + '"';
                  }
                  else {
                    jsonStr += '"Month":"' + this.claimhistorydetails[item]["MONTH"] + '",';
                  }
                }
                else {
                  if (this.checked.length == 1) {
                    jsonStr += '{"Month":"' + this.claimhistorydetails[item]["MONTH"] + '"';
                  }
                  else {
                    jsonStr += '{"Month":"' + this.claimhistorydetails[item]["MONTH"] + '",';
                  }
                }
                break;
              case "ClaimType":
                if (jsonStr.length > 0) {
                  if (ctr == this.checked.length) {
                    jsonStr += '"ClaimType":"' + this.claimhistorydetails[item]["CLAIM_TYPE"] + '"';
                  }
                  else {
                    jsonStr += '"ClaimType":"' + this.claimhistorydetails[item]["CLAIM_TYPE"] + '",';
                  }
                }
                else {
                  if (this.checked.length == 1) {
                    jsonStr += '{"ClaimType":"' + this.claimhistorydetails[item]["CLAIM_TYPE"] + '"';
                  }
                  else {
                    jsonStr += '{"ClaimType":"' + this.claimhistorydetails[item]["CLAIM_TYPE"] + '",';
                  }
                }
                break;
              case "Date":
                if (jsonStr.length > 0) {
                  if (ctr == this.checked.length) {
                    jsonStr += '"Date":"' + this.claimhistorydetails[item]["TRAVEL_DATE"] + '"';
                  }
                  else {
                    jsonStr += '"Date":"' + this.claimhistorydetails[item]["TRAVEL_DATE"] + '",';
                  }
                }
                else {
                  if (this.checked.length == 1) {
                    jsonStr += '{"Date":"' + this.claimhistorydetails[item]["TRAVEL_DATE"] + '"';
                  }
                  else {
                    jsonStr += '{"Date":"' + this.claimhistorydetails[item]["TRAVEL_DATE"] + '",';
                  }
                }
                break;
              case "Status":
                if (jsonStr.length > 0) {
                  if (ctr == this.checked.length) {
                    jsonStr += '"Status":"' + this.claimhistorydetails[item]["STATUS"] + '"';
                  }
                  else {
                    jsonStr += '"Status":"' + this.claimhistorydetails[item]["STATUS"] + '",';
                  }
                }
                else {
                  if (this.checked.length == 1) {
                    jsonStr += '{"Status":"' + this.claimhistorydetails[item]["STATUS"] + '"';
                  }
                  else {
                    jsonStr += '{"Status":"' + this.claimhistorydetails[item]["STATUS"] + '",';
                  }
                }
                break;
              case "Amount":
                if (jsonStr.length > 0) {
                  if (ctr == this.checked.length) {
                    jsonStr += '"Amount":"' + this.claimhistorydetails[item]["CLAIM_AMOUNT"] + '"';
                  }
                  else {
                    jsonStr += '"Amount":"' + this.claimhistorydetails[item]["CLAIM_AMOUNT"] + '",';
                  }
                }
                else {
                  if (this.checked.length == 1) {
                    jsonStr += '{"Amount":"' + this.claimhistorydetails[item]["CLAIM_AMOUNT"] + '"';
                  }
                  else {
                    jsonStr += '{"Amount":"' + this.claimhistorydetails[item]["CLAIM_AMOUNT"] + '",';
                  }
                }
                break;
            }
            if (ctr == this.checked.length) {
              jsonStr += '}';
            }
          }
          this.ExcelData.push(JSON.parse(jsonStr));
        }
      }
      this.excelService.exportAsExcelFile(this.ExcelData, 'Data');
    }
    else {
      alert('Please select one item.');
    }
  }
}
