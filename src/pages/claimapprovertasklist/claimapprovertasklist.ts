import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { BaseHttpService } from '../../services/base-http';
import { Checkbox } from 'ionic-angular/components/checkbox/checkbox';
import { Checkboxlist } from '../../models/checkbox-list.model';

import { ApiManagerProvider } from '../../providers/api-manager.provider';
import { ProfileManagerProvider } from '../../providers/profile-manager.provider';
import { TravelClaimViewPage } from '../travel-claim-view/travel-claim-view.component';
import { EntertainmentClaimViewPage } from '../entertainment-claim-view/entertainment-claim-view';
import { OvertimeClaimViewPage } from '../overtime-claim-view/overtime-claim-view';
import { MedicalClaimViewPage } from '../medical-claim-view/medical-claim-view';
import { PrintClaimViewPage } from '../print-claim-view/print-claim-view';
import { GiftClaimViewPage } from '../gift-claim-view/gift-claim-view';
import { MiscellaneousClaimViewPage } from '../miscellaneous-claim-view/miscellaneous-claim-view';
import { ClaimtasklistPage } from '../claimtasklist/claimtasklist';
import { LoginPage } from '../login/login';
import * as Settings from '../../dbSettings/companySettings'
import { FinancePaymentTasklistPage } from '../finance-payment-tasklist/finance-payment-tasklist';


@IonicPage()
@Component({
  selector: 'page-claimapprovertasklist',
  templateUrl: 'claimapprovertasklist.html', providers: [BaseHttpService]
})
export class ClaimapprovertasklistPage {
  ddlEmp: any = 'All';
  ddlClaim: any = 'All';
  baseResourceUrl: string;
  claimrequestdetails: any[];
  claimrequestdetails1: any[];
  selectAll: boolean;
  claimrefguid: any;
  role: any;
  searchboxValue: string;
  checkboxDataList: Checkboxlist[] = [];
  loginUserGuid: string;
  claimRequestGUID: any;
  level: any;
  loginUserRole = localStorage.getItem("g_ROLE_NAME");
  claimreqData: any[];
  buttonText: string;
  totalClaimAmount: number = 0;
  public page: number = 1;
  FinanceLogin: boolean = false;
  currency = localStorage.getItem("cs_default_currency")

  deptList: any[];
  employeeList: any[];
  claimTypeList: any[];
  yearsList: any[] = [];
  currentYear: number = new Date().getFullYear();
  btnSearch: boolean = false;
  month: any;

  constructor(public profileMngProvider: ProfileManagerProvider, public api: ApiManagerProvider, public navCtrl: NavController, public navParams: NavParams, public http: Http) {

    this.month = navParams.get("month");
    if (this.month != undefined) {
      this.month = this.month.substring(0, 3);
      this.searchboxValue=this.month;
    }
    // console.log(this.month)



    if (localStorage.getItem("g_USER_GUID") == null) {
      alert('Sorry, Please login.');
      this.navCtrl.push(LoginPage);
    }
    else {

      this.loginUserGuid = localStorage.getItem("g_USER_GUID");
      this.claimrefguid = navParams.get("claimRefGuid");
      this.role = navParams.get("role");
      // alert(this.claimrefguid);

      if (this.claimrefguid !== null && this.claimrefguid !== undefined) {
        this.FinanceLogin = true;
        if (this.role == "Payment") {
          this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimrequestlist?filter=(CLAIM_REF_GUID=' + this.claimrefguid + ')AND(STATUS=Approved)AND(PROFILE_LEVEL=3)&api_key=' + constants.DREAMFACTORY_API_KEY;
          this.buttonText = "Pay";
        }
        else {
          this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimrequestlist?filter=(CLAIM_REF_GUID=' + this.claimrefguid + ')AND(STATUS=Pending)AND(PROFILE_LEVEL=2)&api_key=' + constants.DREAMFACTORY_API_KEY;
          this.buttonText = "Approve";
        }
      }
      else {
        this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimrequestlist?filter=(ASSIGNED_TO=' + localStorage.getItem("g_USER_GUID") + ')AND(STATUS=Pending)AND(PROFILE_LEVEL=1)AND(YEAR=' + this.currentYear + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
        this.buttonText = "Approve";
        this.FinanceLogin = false;
      }
      // this.Pending = navParams.get("Pending");
      this.BindEmployeesbyDepartment();
      this.BindClaimTypes();
      this.BindYears();
      this.BindData("All", "All");
      // alert(this.Pending);
      // this.searchboxValue = this.Pending ;
      // if (this.searchboxValue != undefined) {
      //   this.onSearchInput( this.Pending);
      // }
      // else { this.BindData(); }

      // this.searchboxValue = this.month;
      // if (this.searchboxValue != undefined) {
      //   // alert(this.searchboxValue);
      //   this.onSearchInput();
      // }
      // else { this.BindData('All', 'All'); }

    }
// this.navCtrl.getPrevious(FinancePaymentTasklistPage:this.page)
  }
  BindData(ddlEmployee?: string, ddlClaimTypes?: string) {

    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.claimrequestdetails = [];
       
        this.claimrequestdetails = data["resource"];
        // console.log( this.claimrequestdetails)
        this.totalClaimAmount = 0;
        let key: any;
        this.claimrequestdetails.forEach(element => {
          element.TRAVEL_DATE = new Date(element.TRAVEL_DATE.replace(/-/g, "/"))

          // if (this.FinanceLogin) {
          // For Status changing
          if (element.PROFILE_LEVEL == Settings.ProfileLevels.ONE && element.STATUS == Settings.StatusConstants.PENDING)
            element.STATUS = Settings.StatusConstants.PENDINGSUPERIOR
          else if (element.PROFILE_LEVEL == Settings.ProfileLevels.TWO && element.STATUS == Settings.StatusConstants.PENDING)
            element.STATUS = Settings.StatusConstants.PENDINGFINANCEVALIDATION
          else if (element.PROFILE_LEVEL == Settings.ProfileLevels.THREE && element.STATUS == Settings.StatusConstants.APPROVED)
            element.STATUS = Settings.StatusConstants.PENDINGPAYMENT
          // }
          // if (element.STATUS === 'Rejected') {
          //   element.STAGE_GUID = null;
          // }
          // else {
          //   key = element.PROFILE_LEVEL;
          // }

          // switch (key) {
          //   case 1: element.STAGE_GUID = 'Superior'; break;
          //   case 2: element.STAGE_GUID = 'Finance Executive'; break;
          //   case 3:
          //   case -1: element.STAGE_GUID = 'Finance & Admin'; break;
          // }
        });
        this.claimrequestdetails1 = this.claimrequestdetails;
        if (this.claimrequestdetails.length != 0) {
          if (ddlEmployee.toString() !== "All") { this.claimrequestdetails = this.claimrequestdetails.filter(s => s.USER_GUID.toString() === ddlEmployee.toString()) }
          if (ddlClaimTypes.toString() !== "All") { this.claimrequestdetails = this.claimrequestdetails.filter(s => s.CLAIM_TYPE_GUID.toString() === ddlClaimTypes.toString()) }
        }
        this.FindTotalAmount();
        // Lakshman
        if (this.searchboxValue != undefined) {
          this.onSearchInput();
        }
       // Lakshman
        this.btnSearch = true;
      });

  }

  FindTotalAmount() {
    this.totalClaimAmount = 0;
    this.claimrequestdetails.forEach(element => {
      this.totalClaimAmount = this.totalClaimAmount + element.CLAIM_AMOUNT;
    });
  }

  onSearchInput() {
    // alert('hi')
    // alert(this.searchboxValue);
    let val = this.searchboxValue;
    if (val && val.trim() != '') {
      // alert(this.searchboxValue);
      // alert(val);
      this.claimrequestdetails = this.claimrequestdetails1.filter((item) => {
        let fullname: number;
        let claimtype: number;
        let status: number;
        let stage: number;
        let amount: number;
        let date: number;
        let month: number;
        //console.log(item);

        if (item.FULLNAME != null && !this.FinanceLogin) { fullname = item.FULLNAME.toLowerCase().indexOf(val.toLowerCase()) }
        if (item.CLAIMTYPE != null) { claimtype = item.CLAIMTYPE.toLowerCase().indexOf(val.toLowerCase()) }
        if (item.TRAVEL_DATE != null) { date = item.TRAVEL_DATE.toString().toLowerCase().indexOf(val.toLowerCase()) }
        if (item.STATUS != null) { status = item.STATUS.toString().toLowerCase().indexOf(val.toLowerCase()) }
        if (item.STAGE != null) { stage = item.STAGE.toString().toLowerCase().indexOf(val.toLowerCase()) }
        if (item.CLAIM_AMOUNT != null) { amount = item.CLAIM_AMOUNT.toString().toLowerCase().indexOf(val.toLowerCase()) }
        if(this.month!=undefined){
         
        if (item.MONTH != null) { month = item.MONTH.toString().toLowerCase().indexOf(val.toLowerCase()) }
        }
        return (
          (fullname > -1)
          || (date > -1)
          || (claimtype > -1)
          || (status > -1)
          || (stage > -1)
          || (amount > -1)
          || (month > -1)
        );
      })
    }
    else {
      this.claimrequestdetails = this.claimrequestdetails1;
    }
    this.FindTotalAmount();
  }


  checkAllCheckBoxes(event: Checkbox) {
    if (event.checked) { this.selectAll = true; }
    else {
      this.selectAll = false;
    }
  }

  // getCheckboxValue(event:Checkbox,claimRequestGuid:any){
  //   // console.log(event);
  //   // alert(event.id);
  //   // alert(event.checked);
  //   // alert(claimRequestGuid);
  // }

  getCheckboxValue(event: Checkbox, claimRequestGuid: any, level: number, status: string) {
    // alert(event.id);
    // alert(event.checked);
    // alert(claimRequestGuid);
    // debugger;
    let checkboxData: Checkboxlist = new Checkboxlist(event.checked, claimRequestGuid, level, status);
    if (event.checked) {
      this.checkboxDataList.push(checkboxData);
    }
    else {
      let chkItem: Checkboxlist = this.checkboxDataList.find(item => item.ClaimRequestGuid == claimRequestGuid);
      const index: number = this.checkboxDataList.indexOf(chkItem);
      if (index !== -1) {
        this.checkboxDataList.splice(index, 1);
      }
    }
    // console.log(this.checkboxDataList);
    // alert(this.checkboxDataList.length);
    // alert(this.checkboxDataList.find(item => item.Chkid == event.id).Chkid + ","+this.checkboxDataList.find(item => item.Chkid == event.id).Checked+ ","+this.checkboxDataList.find(item => item.Chkid == event.id).claimRequestGuid);
  }

  approveAll() {
    return new Promise(() => {

      this.checkboxDataList.forEach(element => {
        if (element.Checked && element.status !== 'Paid') {
          //debugger;
          this.profileMngProvider.ProcessProfileMng(null, this.loginUserGuid, element.level, element.ClaimRequestGuid, true, 2);
          this.count++;
        }
      });
    })
  }

  count: number = 0;
  approveButtonEnabled: boolean = true;
  approveClaims() {
    this.approveButtonEnabled = false;
    //console.table(this.claimrequestdetails);
    this.count = 0;
    //debugger;
    if (this.checkboxDataList.length > 0) {
      let temp = this.approveAll();
      temp.then(() => {
      })

      if (this.count > 0 && this.claimrefguid !== null && this.claimrefguid !== undefined) {
        this.claimreqData = [];
        let pendingFlag = false;
        let approvedFlag = false;
        let url = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_claim_request?filter=(CLAIM_REF_GUID=' + this.claimrefguid + ')AND(STATUS!=Paid)&api_key=' + constants.DREAMFACTORY_API_KEY;
        console.log(url)

        this.api.getApiModel('main_claim_ref', 'filter=CLAIM_REF_GUID=' + this.claimrefguid)
          .subscribe(data => {
            let claimRefObj = data;
            //debugger;
            this.http
              .get(url)
              .map(res => res.json())
              .subscribe(data1 => {
                //debugger;
                this.claimreqData = data1["resource"];

                if (this.claimreqData !== null && this.claimreqData !== undefined && this.claimreqData.length > 0) {
                  this.claimreqData.forEach(element => {
                    //debugger;
                    if (element.STATUS == "Pending" && !pendingFlag) {
                      pendingFlag = true;
                    }
                    else if (element.STATUS == "Approved" && !approvedFlag) {
                      approvedFlag = true;
                    }
                  });
                }

                if (pendingFlag)
                  claimRefObj["resource"][0].STATUS = 'Pending';
                else if (approvedFlag)
                  claimRefObj["resource"][0].STATUS = 'Approved';
                else
                  claimRefObj["resource"][0].STATUS = 'Paid';
                //debugger;
                this.api.updateApiModel('main_claim_ref', claimRefObj, false).subscribe(() => {
                  alert('Claim has been Approved.');
                  this.BindData("All", "All");
                  this.checkboxDataList = [];
                  this.navCtrl.setRoot(ClaimtasklistPage);
                })
              });
          })
      }
      if (this.claimrefguid === null || this.claimrefguid === undefined) {
        alert('Claim has been Approved.')
        this.claimrequestdetails = [];
        this.checkboxDataList = [];
        this.BindData("All", "All");
        this.navCtrl.setRoot(ClaimapprovertasklistPage);
      }

    }
    else {
      alert("Please select the claim(s) which you want to approve.");
      this.approveButtonEnabled = true;
    }
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ClaimapprovertasklistPage');
  }

  // designation: string;
  viewClaim(claimRequestGUID: string, level: any, claimType: any) {
    this.claimRequestGUID = claimRequestGUID;
    this.level = level;
    // this.designation = designation;

    switch (claimType) {
      case '2d8d7c80-c9ae-9736-b256-4d592e7b7887': this.pushPage(GiftClaimViewPage); break;
      case '37067b3d-1bf4-33a3-2b60-3ca40baf589a': this.pushPage(OvertimeClaimViewPage); break;
      case '40dbaf56-98e4-77b9-df95-85ec232ff714': this.pushPage(MedicalClaimViewPage); break;
      case '58c59b56-289e-31a2-f708-138e81a9c823': this.pushPage(TravelClaimViewPage); break;
      case 'd9567482-033a-6d92-3246-f33043155746': this.pushPage(PrintClaimViewPage); break;
      case 'f3217ecc-19d7-903a-6c56-78fdbd7bbcf1': this.pushPage(EntertainmentClaimViewPage); break;
      case '84b3cee2-9f9d-ccb9-89a1-1e70cef19f86': this.pushPage(MiscellaneousClaimViewPage); break;
    }
  }

  pushPage(claimType: any) {
    this.navCtrl.push(claimType, {
      isApprover: true,
      // approverDesignation: this.designation,
      cr_GUID: this.claimRequestGUID,
      level_no: this.level,
      approver_GUID: localStorage.getItem('g_USER_GUID')
    });
  }

  ionViewWillEnter() {
    //if(!this.isFormEdit)
    this.BindData("All", "All");

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

  BindEmployeesbyDepartment() {
    //alert(dept);
    this.http
      .get(constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_user_display_new?api_key=' + constants.DREAMFACTORY_API_KEY)
      .map(res => res.json())
      .subscribe(data => {
        this.employeeList = data["resource"];
      });

  }


  SearchClaimsData() {
    this.btnSearch = false;
    if (this.claimrefguid !== null && this.claimrefguid !== undefined) {
      if (this.role == "Payment") {
        this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimrequestlist?filter=(CLAIM_REF_GUID=' + this.claimrefguid + ')AND(STATUS=Approved)AND(PROFILE_LEVEL=3)&api_key=' + constants.DREAMFACTORY_API_KEY;
      }
      else {
        this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimrequestlist?filter=(CLAIM_REF_GUID=' + this.claimrefguid + ')AND(STATUS=Pending)AND(PROFILE_LEVEL=2)&api_key=' + constants.DREAMFACTORY_API_KEY;
      }
    }
    else {
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimrequestlist?filter=(ASSIGNED_TO=' + localStorage.getItem("g_USER_GUID") + ')AND(STATUS=Pending)AND(PROFILE_LEVEL=1)AND(YEAR=' + this.currentYear + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    this.BindData(this.ddlEmp, this.ddlClaim);
  }
}
