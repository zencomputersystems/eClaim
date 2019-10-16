import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Http } from '@angular/http';
//import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { BaseHttpService } from '../../services/base-http';
//import { ClaimHistory_Model } from '../../models/ClaimHistory_Model';
import { AllClaimListPage } from '../all-claim-list/all-claim-list';

import { ExcelService } from '../../providers/excel.service';
import * as Settings from '../../dbSettings/companySettings'


// import { Observable } from 'rxjs/Observable';
// import { Subject }    from 'rxjs/Subject';
// import { of }         from 'rxjs/observable/of';

// import {
//    debounceTime, distinctUntilChanged, switchMap
//  } from 'rxjs/operators';
// import { Response } from '@angular/http/src/static_response';


/**
 * Generated class for the ClaimhistoryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-claimhistory',
  templateUrl: 'claimhistory.html', providers: [BaseHttpService, ExcelService]
})
export class AllClaimhistoryPage {
  searchboxValue: string;
  claimhistorys: any[];
  claimhistorys1: any[] = [];
  deptList: any[];
  employeeList: any[] = [];
  employeeList1: any[] = [];
  yearsList: any[] = [];
  currentYear: number = new Date().getFullYear();
  loginUserRole:string;
  currency = localStorage.getItem("cs_default_currency")

  // baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimhistory?filter=(TENANT_COMPANY_SITE_GUID=' + localStorage.getItem("g_TENANT_COMPANY_SITE_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResourceUrl: string;
  public page: number = 1;
  constructor(private excelService: ExcelService, public navCtrl: NavController, public navParams: NavParams, public http: Http) {
    this.loginUserRole = localStorage.getItem("g_ROLE_NAME");
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimhistory?&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.BindDepartment();
    this.BindEmployeesbyDepartment("All");
    this.BindYears();
    this.BindData("All", "All","All");

    this.excelService = excelService;
  }

  ExcelData: any[] = [];
  BindData(ddlDept: string, ddlEmployee: string, ddlmonth: string) {
    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.claimhistorys = this.claimhistorys1 = data["resource"];
        this.claimhistorys = this.claimhistorys1;
        if (this.claimhistorys.length != 0) {
          if (ddlDept.toString() !== "All") { this.claimhistorys = this.claimhistorys.filter(s => s.DEPT_GUID.toString() === ddlDept.toString()) }
          if (ddlEmployee.toString() !== "All") { this.claimhistorys = this.claimhistorys.filter(s => s.USER_GUID.toString() === ddlEmployee.toString()) }
          if (ddlmonth.toString() !== "All") { this.claimhistorys = this.claimhistorys.filter(s => s.MONTH.toString() === ddlmonth.toString()) }
    
        }
        for (var item in data["resource"]) {
          this.ExcelData.push({ Employee: data["resource"][item]["FULLNAME"], Department: data["resource"][item]["DEPT"], Month: data["resource"][item]["MONTH"], ApprovedAmt: data["resource"][item]["APPROVEDAMOUNT"], RejectedAmount: data["resource"][item]["REJECTEDAMOUNT"] });
        }
      });
  }

  onSearchInput() {
    let val = this.searchboxValue;
    if (val && val.trim() != '') {
      this.claimhistorys = this.claimhistorys1.filter((item) => {
        let fullname: number;
        let dept: number;
        let month: number;
        let approveamount: number;
        let rejamount: number;

        if (item.FULLNAME != null) { fullname = item.FULLNAME.toLowerCase().indexOf(val.toLowerCase()) }
        if (item.DEPT != null) { dept = item.DEPT.toString().toLowerCase().indexOf(val.toLowerCase()) }
        if (item.MONTH != null) { month = item.MONTH.toString().toLowerCase().indexOf(val.toLowerCase()) }
        if (item.APPROVEDAMOUNT != null) { approveamount = item.APPROVEDAMOUNT.toString().toLowerCase().indexOf(val.toLowerCase()) }
        if (item.REJECTEDAMOUNT != null) { rejamount = item.REJECTEDAMOUNT.toString().toLowerCase().indexOf(val.toLowerCase()) }

        return (
          (fullname > -1)
          || (dept > -1)
          || (month > -1)
          || (approveamount > -1)
          || (rejamount > -1)
        );
      });
    }
    else {
      this.claimhistorys = this.claimhistorys1
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClaimhistoryPage');
  }


  goToClaimHistoryDetail(claimrefguid: any, userguid: any, month: any) {
    this.navCtrl.push(AllClaimListPage, {
      claimRefGuid: claimrefguid,
      userGuid: userguid,
      Month: month
    })
  }

  ExportToExcel() {
    // this.excelService.exportAsExcelFile(this.claimhistorys, 'Data');
    this.excelService.exportAsExcelFile(this.ExcelData, 'Data');
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

  BindYears() {
    for (let i = 2016; i <= new Date().getFullYear(); i++) {
      this.yearsList.push(i);
    }
  }

  SearchClaimsData(ddlDept: string, ddlEmployee: string, ddlmonth: string, ddlYear: number) {
    if (this.loginUserRole === "Finance Admin") {
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimhistory?filter=(APPROVER_GUID=' + localStorage.getItem("g_USER_GUID") + ')AND(PROFILE_LEVEL=3)AND(YEAR=' + ddlYear + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    else {
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimhistory?filter=(APPROVER_GUID=' + localStorage.getItem("g_USER_GUID") + ')AND(PROFILE_LEVEL=2)AND(YEAR=' + ddlYear + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
     this.BindData(ddlDept,ddlEmployee,ddlmonth);
    
  }

}
