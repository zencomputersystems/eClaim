import { Component,Input,OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Http } from '@angular/http';
//import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { BaseHttpService } from '../../services/base-http';
//import { ClaimHistory_Model } from '../../models/ClaimHistory_Model';
import { ClaimhistorydetailPage } from '../claimhistorydetail/claimhistorydetail';

import { ExcelService } from '../../providers/excel.service';
/**
 * Generated class for the CommonHistorylistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-common-historylist',
  templateUrl: 'common-historylist.html',
  providers: [BaseHttpService, ExcelService]
})
export class CommonHistorylistPage implements OnInit {
  @Input() role:any;
  searchboxValue: string;
  claimhistorys: any[];
  claimhistorys1: any[] = [];
  deptList: any[];
  employeeList: any[] = [];
  employeeList1: any[] = [];
  yearsList: any[] = [];
  currentYear: number = new Date().getFullYear();
  loginUserRole: string;
  btnSearch:boolean = false;
  // claimhistoryTotal: any[];
  currency = localStorage.getItem("cs_default_currency")

  // baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimhistory?filter=(TENANT_COMPANY_SITE_GUID=' + localStorage.getItem("g_TENANT_COMPANY_SITE_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResourceUrl: string;
  public page: number = 1;
  constructor(private excelService: ExcelService, public navCtrl: NavController, public navParams: NavParams, public http: Http) {
    //this.loginUserRole = localStorage.getItem("g_ROLE_NAME");
    //this.excelService = excelService;
  }

  ngOnInit()
  {
    if (this.role == "Payment") {
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimhistory?filter=(PROFILE_LEVEL=3)AND(YEAR=' + this.currentYear + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    else {
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimhistory?filter=(PROFILE_LEVEL=2)AND(YEAR=' + this.currentYear + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    this.BindDepartment();
    this.BindEmployeesbyDepartment("All");
    this.BindYears();
    this.BindData("All", "All", "All");

    this.excelService = this.excelService;
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
        // for (var item in data["resource"]) {
        //   this.ExcelData.push({ Employee: data["resource"][item]["FULLNAME"], Department: data["resource"][item]["DEPT"], Month: data["resource"][item]["MONTH"], ApprovedAmt: data["resource"][item]["APPROVEDAMOUNT"], RejectedAmount: data["resource"][item]["REJECTEDAMOUNT"] });
        // }
        this.btnSearch=true;
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


  goToClaimHistoryDetail(claimrefguid: any, userguid: any, month: any) {
    this.navCtrl.push(ClaimhistorydetailPage, {
      claimRefGuid: claimrefguid,
      userGuid: userguid,
      Month: month,
      role:this.role
    })
  }

  // ExportToExcel() {
  //   // this.excelService.exportAsExcelFile(this.claimhistorys, 'Data');
  //   this.excelService.exportAsExcelFile(this.ExcelData, 'Data');
  // }

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
    this.btnSearch=false;
    if (this.role == "Payment") {
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimhistory?filter=(PROFILE_LEVEL=3)AND(YEAR=' + ddlYear + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    else {
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimhistory?filter=(PROFILE_LEVEL=2)AND(YEAR=' + ddlYear + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    this.BindData(ddlDept, ddlEmployee, ddlmonth);
   
  }

  ExportExcelClicked: boolean = false; ExcelColumns: any[] = [];
  ExportToExcel() {
    this.ExportExcelClicked = true;
    this.ExcelColumns = [];
    this.ExcelColumns.push({ Columns: 'Employee' });
    this.ExcelColumns.push({ Columns: 'Department' });
    this.ExcelColumns.push({ Columns: 'Month' });
    this.ExcelColumns.push({ Columns: 'ApprovedAmt' });
    this.ExcelColumns.push({ Columns: 'RejectedAmount' });
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

  RemoveCheckedFromArray(checkbox: String) {
    return this.checked.findIndex((category) => {
      return category === checkbox;
    })
  }

  SubmitExportExcel() {
    this.ExcelData = [];
    if (this.checked.length > 0) {
      for (var item in this.claimhistorys) {
        if (this.checked.length > 0) {
          let ctr: number = 0;
          let jsonStr = '';
          for (var chkItem in this.checked) {
            ctr = ctr + 1;
            switch (this.checked[chkItem]["Columns"]) {
              case "Employee":
                if (this.checked.length == 1) {
                  jsonStr += '{"Employee":"' + this.claimhistorys[item]["FULLNAME"] + '"';
                }
                else {
                  jsonStr += '{"Employee":"' + this.claimhistorys[item]["FULLNAME"] + '",';
                }
                break;
              case "Department":
                if (jsonStr.length > 0) {
                  if (ctr == this.checked.length) {
                    jsonStr += '"Department":"' + this.claimhistorys[item]["DEPT"] + '"';
                  }
                  else {
                    jsonStr += '"Department":"' + this.claimhistorys[item]["DEPT"] + '",';
                  }
                }
                else {
                  if (this.checked.length == 1) {
                    jsonStr += '{"Department":"' + this.claimhistorys[item]["DEPT"] + '"';
                  }
                  else {
                    jsonStr += '{"Department":"' + this.claimhistorys[item]["DEPT"] + '",';
                  }
                }
                break;
              case "Month":
                if (jsonStr.length > 0) {
                  if (ctr == this.checked.length) {
                    jsonStr += '"Month":"' + this.claimhistorys[item]["MONTH"] + '"';
                  }
                  else {
                    jsonStr += '"Month":"' + this.claimhistorys[item]["MONTH"] + '",';
                  }
                }
                else {
                  if (this.checked.length == 1) {
                    jsonStr += '{"Month":"' + this.claimhistorys[item]["MONTH"] + '"';
                  }
                  else {
                    jsonStr += '{"Month":"' + this.claimhistorys[item]["MONTH"] + '",';
                  }
                }
                break;
              case "ApprovedAmt":
                if (jsonStr.length > 0) {
                  if (ctr == this.checked.length) {
                    jsonStr += '"ApprovedAmt":"' + this.claimhistorys[item]["APPROVEDAMOUNT"] + '"';
                  }
                  else {
                    jsonStr += '"ApprovedAmt":"' + this.claimhistorys[item]["APPROVEDAMOUNT"] + '",';
                  }
                }
                else {
                  if (this.checked.length == 1) {
                    jsonStr += '{"ApprovedAmt":"' + this.claimhistorys[item]["APPROVEDAMOUNT"] + '"';
                  }
                  else {
                    jsonStr += '{"ApprovedAmt":"' + this.claimhistorys[item]["APPROVEDAMOUNT"] + '",';
                  }
                }
                break;
              case "RejectedAmount":
                if (jsonStr.length > 0) {
                  if (ctr == this.checked.length) {
                    jsonStr += '"RejectedAmount":"' + this.claimhistorys[item]["REJECTEDAMOUNT"] + '"';
                  }
                  else {
                    jsonStr += '"RejectedAmount":"' + this.claimhistorys[item]["REJECTEDAMOUNT"] + '",';
                  }
                }
                else {
                  if (this.checked.length == 1) {
                    jsonStr += '{"RejectedAmount":"' + this.claimhistorys[item]["REJECTEDAMOUNT"] + '"';
                  }
                  else {
                    jsonStr += '{"RejectedAmount":"' + this.claimhistorys[item]["REJECTEDAMOUNT"] + '",';
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


  ionViewDidLoad() {
    console.log('ionViewDidLoad CommonHistorylistPage');
  }

}
