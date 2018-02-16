import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
//import { FormBuilder, FormGroup } from '@angular/forms';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import * as constants from '../../app/config/constants';
import { UserInfo_Model } from '../../models/usersetup_info_model';
import { UserMain_Model } from '../../models/user_main_model';
import { UserContact_Model } from '../../models/user_contact_model';
import { UserCompany_Model } from '../../models/user_company_model';
import { UserAddress_Model } from '../../models/usersetup_address_model';
import { ViewUser_Model } from '../../models/viewuser_model';
import { View_Dropdown_Model } from '../../models/view_dropdown';
import { UserSetup_Service } from '../../services/usersetup_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';

import { Camera, CameraOptions } from '@ionic-native/camera';
//import {Camera} from 'ionic-native';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';

import { LoadingController, ActionSheetController, Platform, Loading, ToastController } from 'ionic-angular';
import { elementDef } from '@angular/core/src/view/element';

import { LoginPage } from '../login/login';

/**
 * Generated class for the UserPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html', providers: [UserSetup_Service, BaseHttpService, FileTransfer]
})
export class UserPage {
  //selectedValue: number;
  genders: Array<{ value: number, text: string, checked: boolean }> = [];
  maritals: Array<{ value: number, text: string, checked: boolean }> = [];
  emptypes: Array<{ value: number, text: string, checked: boolean }> = [];
  empstatuss: Array<{ value: number, text: string, checked: boolean }> = [];
  public designations: any;
  public companies: any;
  public departments: any;
  public branches: any;
  public data: any;
  //public employees: any;
  public address: any;

  isReadyToSave: boolean;
  userinfo_entry: UserInfo_Model = new UserInfo_Model();
  usermain_entry: UserMain_Model = new UserMain_Model();
  usercontact_entry: UserContact_Model = new UserContact_Model();
  usercompany_entry: UserCompany_Model = new UserCompany_Model();
  // tenantcompany_entry: UserCompany_Model = new UserCompany_Model();
  useraddress_entry: UserAddress_Model = new UserAddress_Model();
  viewuser_entry: ViewUser_Model = new ViewUser_Model();
  viewdropdown_entry: View_Dropdown_Model = new View_Dropdown_Model();
  view_user_details: any;
  user_details: any;
  Userform: FormGroup;

  baseResourceUrl1: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/user_info' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url1: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  baseResourceUrl2: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/user_main' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResourceUrl2_URL: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
  baseResourceUrl3: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/user_contact' + '?api_key=' + constants.DREAMFACTORY_API_KEY;

  baseResourceUrl4: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/user_company' + '?api_key=' + constants.DREAMFACTORY_API_KEY;

  // baseResourceUrl5: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/tenant_company_site' + '?api_key=' + constants.DREAMFACTORY_API_KEY;

  // baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/user_address' + '?api_key=' + constants.DREAMFACTORY_API_KEY;

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + "/api/v2/zcs/_table/user_address?filter=(USER_GUID=" + localStorage.getItem("g_USER_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;

  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  baseResourceUrl_designation: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_designation' + '?api_key=' + constants.DREAMFACTORY_API_KEY;

  //baseResourceUrl_company: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_company' + '?api_key=' + constants.DREAMFACTORY_API_KEY;

  // baseResourceUrl_company: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/tenant_company' + '?api_key=' + constants.DREAMFACTORY_API_KEY;

  baseResourceUrl_company: string = constants.DREAMFACTORY_INSTANCE_URL + "/api/v2/zcs/_table/tenant_company?filter=(TENANT_GUID=" + localStorage.getItem("g_TENANT_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;

  baseResourceUrl_department: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_department' + '?api_key=' + constants.DREAMFACTORY_API_KEY;

  // baseResourceUrl_branch: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_branch' + '?api_key=' + constants.DREAMFACTORY_API_KEY;

  baseResourceUrl_branch: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_tenantcompanysitedetails' + '?api_key=' + constants.DREAMFACTORY_API_KEY;


  // baseResourceView: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/personaldetails_emp' + '?api_key=' + constants.DREAMFACTORY_API_KEY;

  // baseResourceView: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_user_display' + '?api_key=' + constants.DREAMFACTORY_API_KEY;

  // filter view
  baseResourceView: string = constants.DREAMFACTORY_INSTANCE_URL + "/api/v2/zcs/_table/view_user_display?filter=(USER_GUID=" + localStorage.getItem("g_USER_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;

  // baseResourceView1: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_dropdown' + '?api_key=' + constants.DREAMFACTORY_API_KEY;

  baseResourceView1: string = constants.DREAMFACTORY_INSTANCE_URL + "/api/v2/zcs/_table/view_dropdown?filter=(USER_GUID=" + localStorage.getItem("g_USER_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;


  //public users: UserMain_Model[] = [];
  public users: ViewUser_Model[] = [];
  public users_local: ViewUser_Model[] = [];

  //public employees: UserInfo_Model[] =[];
  public employees: View_Dropdown_Model[] = [];
  public employees_local: View_Dropdown_Model[] = [];
  // public employees_local: UserInfo_Model[] =[];

  public Exist_Record: boolean = false;
  public AddUserClicked: boolean = false;
  public EditUserClicked: boolean = false;

  //Set the Model Name for Add------------------------------------------
  public User_Name_ngModel: any;
  public User_Email_ngModel: any;
  public User_LoginId_ngModel: any;
  public User_Password_ngModel: any;
  public User_PersonalNo_ngModel: any;
  public User_CompanyNo_ngModel: any;
  public User_Marital_ngModel: any;
  public User_StaffID_ngModel: any;
  public User_ICNo_ngModel: any;
  public User_DOB_ngModel: any;
  public User_Gender_ngModel: any;

  public User_Designation_ngModel: any;
  public User_Company_ngModel: any;
  public User_Department_ngModel: any;
  public User_JoinDate_ngModel: any;
  public User_ConfirmationDate_ngModel: any;
  public User_ResignationDate_ngModel: any;
  public User_Branch_ngModel: any;
  public User_EmployeeType_ngModel: any;
  public User_Approver1_ngModel: any;
  public User_Approver2_ngModel: any;
  public User_Employment_ngModel: any;

  public User_Address1_ngModel: any;
  public User_Address2_ngModel: any;
  public User_Address3_ngModel: any;
  //---------------------------------------------------------------------

  //Set the Model Name for edit------------------------------------------
  public User_Name_Edit_ngModel: any;
  public User_Email_Edit_ngModel: any;
  public User_LoginId_Edit_ngModel: any;
  public User_Password_Edit_ngModel: any;
  public User_PersonalNo_Edit_ngModel: any;
  public User_CompanyNo_Edit_ngModel: any;
  public User_Marital_Edit_ngModel: any;
  public User_StaffID_Edit_ngModel: any;
  public User_ICNo_Edit_ngModel: any;
  public User_DOB_Edit_ngModel: any;
  public User_Gender_Edit_ngModel: any;

  public User_Designation_Edit_ngModel: any;
  public User_Company_Edit_ngModel: any;
  public User_Department_Edit_ngModel: any;
  public User_JoinDate_Edit_ngModel: any;
  public User_ConfirmationDate_Edit_ngModel: any;
  public User_ResignationDate_Edit_ngModel: any;
  public User_Branch_Edit_ngModel: any;
  public User_EmployeeType_Edit_ngModel: any;
  public User_Approver1_Edit_ngModel: any;
  public User_Approver2_Edit_ngModel: any;
  public User_Employment_Edit_ngModel: any;

  public User_Address1_Edit_ngModel: any;
  public User_Address2_Edit_ngModel: any;
  public User_Address3_Edit_ngModel: any;
  // private _users: any[];
  public AddUserClick() {

    this.AddUserClicked = true;
    this.ClearControls();
  }

  public CloseUserClick() {

    if (this.AddUserClicked == true) {
      this.AddUserClicked = false;
    }
    if (this.EditUserClicked == true) {
      this.EditUserClicked = false;
    }
  }

  // Edit Function
  USER_INFO_GUID_FOR_UPDATE: any;
  USER_GUID_FOR_CONTACT: any;
  USER_GUID_FOR_ADDRESS: any;
  USER_GUID_FOR_COMPANY_CONTACT: any;

  public EditClick_Personaldetails(id: any) {
    this.USER_GUID_FOR_UPDATE = id;
    this.EditUserClicked = true;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    //let url: string;
    let url = this.baseResourceUrl2_URL + "view_user_display?filter=(USER_GUID=" + id + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    let url2 = this.baseResourceUrl2_URL + "user_info?filter=(USER_GUID=" + id + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    // let url2 = this.baseResourceUrl2_URL + "view_dropdown?filter=(USER_GUID=" + id + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    let url3 = this.baseResourceUrl2_URL + "user_address?filter=(USER_GUID=" + id + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    let url4 = this.baseResourceUrl2_URL + "user_contact?filter=(USER_GUID=" + id + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    let url5 = this.baseResourceUrl2_URL + "user_company?filter=(USER_GUID=" + id + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    // let url5 = this.baseResourceUrl2_URL + "user_company?filter=(TENANT_GUID=" + id + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http.get(url, options)
      .map(res => res.json())
      .subscribe(
        data => {
          // let res = data["resource"];
          this.view_user_details = data["resource"];
          //this.USER_GUID_FOR_CONTACT =this.view_user_details[0]["CONTACT_INFO_GUID"];
          this.User_Name_Edit_ngModel = this.view_user_details[0]["NAME"];

          this.User_Email_Edit_ngModel = this.view_user_details[0]["EMAIL"];
          this.User_LoginId_Edit_ngModel = this.view_user_details[0]["LOGIN_ID"];
          this.User_Password_Edit_ngModel = this.view_user_details[0]["PASSWORD"];
          //this.User_PersonalNo_Edit_ngModel = this.view_user_details[0]["CONTACT_NO"];
          //this.User_CompanyNo_Edit_ngModel = this.view_user_details[0]["companyno"];
          this.User_Marital_Edit_ngModel = this.view_user_details[0]["MARITAL_STATUS"];
          this.User_StaffID_Edit_ngModel = this.view_user_details[0]["PERSONAL_ID_TYPE"];
          this.User_ICNo_Edit_ngModel = this.view_user_details[0]["PERSONAL_ID"];
          this.User_DOB_Edit_ngModel = this.view_user_details[0]["DOB"];
          this.User_Gender_Edit_ngModel = this.view_user_details[0]["GENDER"];
        });
    this.http.get(url2, options)
      .map(res => res.json())
      .subscribe(
        data => {
          // let res = data["resource"];
          this.view_user_details = data["resource"];
          this.USER_INFO_GUID_FOR_UPDATE = this.view_user_details[0]["USER_INFO_GUID"];
          this.User_Designation_Edit_ngModel = this.view_user_details[0]["DESIGNATION_GUID"];
          // this.User_Company_Edit_ngModel = this.view_user_details[0]["TENANT_COMPANY_GUID"];
          this.User_Company_Edit_ngModel = this.view_user_details[0]["TENANT_COMPANY_GUID"];
          this.User_Department_Edit_ngModel = this.view_user_details[0]["DEPT_GUID"];
          this.User_JoinDate_Edit_ngModel = this.view_user_details[0]["JOIN_DATE"];
          this.User_ConfirmationDate_Edit_ngModel = this.view_user_details[0]["CONFIRMATION_DATE"];
          this.User_ResignationDate_Edit_ngModel = this.view_user_details[0]["RESIGNATION_DATE"];
          this.User_Branch_Edit_ngModel = this.view_user_details[0]["BRANCH"];
          this.User_EmployeeType_Edit_ngModel = this.view_user_details[0]["EMPLOYEE_TYPE"];
          this.User_Approver1_Edit_ngModel = this.view_user_details[0]["APPROVER1"];
          this.User_Approver2_Edit_ngModel = this.view_user_details[0]["APPROVER2"];
          this.User_Employment_Edit_ngModel = this.view_user_details[0]["EMPLOYEE_STATUS"];
        });
    this.http.get(url3, options)
      .map(res => res.json())
      .subscribe(
        data => {
          // let res = data["resource"];
          this.view_user_details = data["resource"];
          this.USER_GUID_FOR_ADDRESS = this.view_user_details[0]["USER_ADDRESS_GUID"];
          this.User_Address1_Edit_ngModel = this.view_user_details[0]["USER_ADDRESS1"];
          this.User_Address2_Edit_ngModel = this.view_user_details[0]["USER_ADDRESS2"];
          this.User_Address3_Edit_ngModel = this.view_user_details[0]["USER_ADDRESS3"];
        });
    this.http.get(url4, options)
      .map(res => res.json())
      .subscribe(
        data => {
          // let res = data["resource"];
          this.view_user_details = data["resource"];
          this.USER_GUID_FOR_CONTACT = this.view_user_details[0]["CONTACT_INFO_GUID"];
          this.User_PersonalNo_Edit_ngModel = this.view_user_details[0]["CONTACT_NO"];
        });
    this.http.get(url5, options)
      .map(res => res.json())
      .subscribe(
        data => {
          // let res = data["resource"];
          this.view_user_details = data["resource"];
          this.USER_GUID_FOR_COMPANY_CONTACT = this.view_user_details[0]["USER_COMPANY_GUID"];
          this.User_CompanyNo_Edit_ngModel = this.view_user_details[0]["COMPANY_CONTACT_NO"];
        });
  }

  public DeleteClick(USER_GUID: any) {
    let alert = this.alertCtrl.create({
      title: 'Remove Confirmation',
      message: 'Do you want to remove ?',
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
            this.userservice.remove(USER_GUID)
              .subscribe(() => {
                self.users = self.users.filter((item) => {
                  return item.USER_GUID != USER_GUID
                });
              });
          }
        }
      ]
    }); alert.present();
  }

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private userservice: UserSetup_Service, private alertCtrl: AlertController, private camera: Camera, public actionSheetCtrl: ActionSheetController, private loadingCtrl: LoadingController, private file: File, private filePath: FilePath, private transfer: FileTransfer, public toastCtrl: ToastController) {

    if (localStorage.getItem("g_USER_GUID") != null) {
      //this.GetDropdown();
      this.GetDesignation();
      this.GetCompany();
      this.GetDepartment();
      this.GetBranch();


      this.http
        .get(this.baseResourceView1)

        .map(res => res.json())
        .subscribe(data => {
          this.employees_local = data.resource;
          let i: number = 0;
          this.employees_local.forEach(element => {
            let temp: View_Dropdown_Model = element;
            if (element.EMPLOYEE_TYPE == '0') temp.EMPLOYEE_TYPE = 'Permanent'
            else if (element.EMPLOYEE_TYPE == '1') temp.EMPLOYEE_TYPE = 'Contract'
            else temp.EMPLOYEE_TYPE = 'Temporary';

            if (element.EMPLOYEE_STATUS == '0') temp.EMPLOYEE_TYPE = 'Probation'
            else if (element.EMPLOYEE_STATUS == '1') temp.EMPLOYEE_STATUS = 'Confirmed'
            else temp.EMPLOYEE_STATUS = 'Terminated';

            this.employees.push(temp);
          })
        });

      this.http
        .get(this.baseResourceView)

        .map(res => res.json())
        .subscribe(data => {
          this.users_local = data.resource;
          let i: number = 0;
          this.users_local.forEach(element => {
            let temp: ViewUser_Model = element;
            if (element.GENDER == '1') temp.GENDER = 'Male'
            else temp.GENDER = 'Female';

            if (element.MARITAL_STATUS == '1') temp.MARITAL_STATUS = 'Married'
            else temp.MARITAL_STATUS = 'Single';

            this.users.push(temp);
          });
        });

      this.http
        .get(this.baseResourceUrl)
        .map(res => res.json())
        .subscribe(data => {
          this.address = data.resource;
          //console.table(this.address)
        });

      //     let headers = new Headers();
      // headers.append('Content-Type', 'application/json');
      // let options = new RequestOptions({ headers: headers });
      // let url: string;
      // url = this.baseResource_Url1 + "vw_tenantcompanysitedetails?filter=(TENANT_GUID=" + this.User_Company_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      // this.http.get(url, options)
      //   .map(res => res.json())
      //   .subscribe(
      //   data => {
      //     let res = data["resource"];
      //   });

      this.Userform = fb.group({
        NAME: ['', Validators.required],
        EMAIL: ['', Validators.required],
        LOGIN_ID: ['', Validators.required],
        PASSWORD: ['', Validators.required],
        CONTACT_NO: ['', Validators.required],
        COMPANY_CONTACT_NO: ['', Validators.required],
        MARITAL_STATUS: ['', Validators.required],
        PERSONAL_ID_TYPE: ['', Validators.required],
        PERSONAL_ID: ['', Validators.required],
        DOB: ['', Validators.required],
        GENDER: ['', Validators.required],

        DESIGNATION_GUID: ['', Validators.required],
        TENANT_COMPANY_GUID: ['', Validators.required],
        DEPT_GUID: ['', Validators.required],
        JOIN_DATE: ['', Validators.required],
        CONFIRMATION_DATE: ['', Validators.required],
        RESIGNATION_DATE: ['', Validators.required],
        BRANCH: ['', Validators.required],
        EMPLOYEE_TYPE: ['', Validators.required],
        APPROVER1: ['', Validators.required],
        APPROVER2: ['', Validators.required],
        EMPLOYEE_STATUS: ['', Validators.required],

        USER_ADDRESS1: ['', Validators.required],
        USER_ADDRESS2: ['', Validators.required],
        USER_ADDRESS3: ['', Validators.required],
      });
      this.genders.push({ value: 1, text: 'Male', checked: false });
      this.genders.push({ value: 0, text: 'Female', checked: false });
      this.maritals.push({ value: 0, text: 'Single', checked: false });
      this.maritals.push({ value: 1, text: 'Maried', checked: false });
      this.emptypes.push({ value: 0, text: 'Permanent', checked: false });
      this.emptypes.push({ value: 1, text: 'Contract', checked: false });
      this.emptypes.push({ value: 2, text: 'Temporary', checked: false });
      this.empstatuss.push({ value: 0, text: 'Probation', checked: false });
      this.empstatuss.push({ value: 1, text: 'Confirmed', checked: false });
      this.empstatuss.push({ value: 2, text: 'Terminated', checked: false });
    }
    else {
      this.navCtrl.push(LoginPage);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserPage');
  }

  // GetAddressData() {
  //   this.http
  //     .get(this.baseResourceUrl)
  //     .map(res => res.json())
  //     .subscribe(data => {
  //       // this.address = data.resource;
  //       this.address = data["resource"];
  //       console.table(this.address)
  //     });
  // }

  GetDesignation() {
    this.http
      .get(this.baseResourceUrl_designation)
      .map(res => res.json())
      .subscribe(data => {
        this.designations = data["resource"];
      });
  }

  GetCompany() {
    this.http
      .get(this.baseResourceUrl_company)
      .map(res => res.json())
      .subscribe(data => {
        this.companies = data["resource"];
      });
  }
  public guid: any;

  GetDepartment() {
    this.http
      .get(this.baseResourceUrl_department)
      .map(res => res.json())
      .subscribe(data => {
        this.departments = data["resource"];
      });
  }

  // GetDropdown() {
  //   this.http
  //     .get(this.baseResourceView1)
  //     .map(res => res.json())
  //     .subscribe(data => {
  //       this.employees = data["resource"];
  //       console.table(this.employees);

  //     });
  // }


  // test(selectedValue: any) {
  //   alert('selected: ' + selectedValue);
  // }
  GetBranch() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    let url: string;
    url = this.baseResource_Url1 + "tenant_company_site?filter=(TENANT_COMPANY_GUID=" + this.User_Company_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http
      .get(url)
      .map(res => res.json())
      .subscribe(data => {
        this.branches = data["resource"];


      });
  }

  Save() {

    if (this.Userform) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      let url: string;
      url = this.baseResourceUrl2_URL + "user_main?filter=(EMAIL=" + this.User_Email_ngModel.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      console.log(url);
      this.http.get(url, options)
        .map(res => res.json())
        .subscribe(
          data => {
            let res = data["resource"];
            if (res.length == 0) {
              console.log("No records Found");
              if (this.Exist_Record == false) {

                this.usermain_entry.EMAIL = this.User_Email_ngModel.trim();
                //this.usermain_entry.STAFF_ID = this.User_StaffID_ngModel.trim();  
                this.usermain_entry.USER_GUID = UUID.UUID();
                this.usermain_entry.TENANT_GUID = localStorage.getItem("g_TENANT_GUID");
                //this.usermain_entry.USER_GUID = this.userinfo_entry.USER_GUID;
                this.usermain_entry.LOGIN_ID = this.User_LoginId_ngModel.trim();
                this.usermain_entry.PASSWORD = this.User_Password_ngModel.trim();
                this.usermain_entry.ACTIVATION_FLAG = 1;
                this.usermain_entry.CREATION_TS = new Date().toISOString();
                this.usermain_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
                this.usermain_entry.UPDATE_TS = new Date().toISOString();
                this.usermain_entry.UPDATE_USER_GUID = "";

                this.userservice.save_user_main(this.usermain_entry)
                  .subscribe((response) => {
                    if (response.status == 200) {
                      alert('user_main Registered successfully');
                      //location.reload();

                      this.userinfo_entry.FULLNAME = this.User_Name_ngModel.trim();
                      this.userinfo_entry.MARITAL_STATUS = this.User_Marital_ngModel;
                      this.userinfo_entry.PERSONAL_ID_TYPE = this.User_StaffID_ngModel.trim();
                      this.userinfo_entry.PERSONAL_ID = this.User_ICNo_ngModel.trim();
                      this.userinfo_entry.DOB = this.User_DOB_ngModel.trim();
                      this.userinfo_entry.GENDER = this.User_Gender_ngModel;
                      this.userinfo_entry.USER_INFO_GUID = UUID.UUID();
                      this.userinfo_entry.USER_GUID = this.usermain_entry.USER_GUID;
                      //this.userinfo_entry.USER_GUID = "254a0525-c725-11e6-bb9f-00155de7e742";
                      this.userinfo_entry.TENANT_COMPANY_SITE_GUID = this.User_Branch_ngModel.trim();
                      //this.userinfo_entry.TENANT_COMPANY_GUID = "254a0525-c725-11e6-bb9f-00155de7e742";
                      this.userinfo_entry.CREATION_TS = new Date().toISOString();
                      this.userinfo_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
                      this.userinfo_entry.UPDATE_TS = new Date().toISOString();
                      this.userinfo_entry.UPDATE_USER_GUID = "";
                      this.userinfo_entry.DESIGNATION_GUID = this.User_Designation_ngModel.trim();
                      this.userinfo_entry.TENANT_COMPANY_GUID = this.User_Company_ngModel.trim();

                      this.userinfo_entry.DEPT_GUID = this.User_Department_ngModel.trim();
                      // alert(this.User_Department_ngModel.trim());
                      this.userinfo_entry.JOIN_DATE = this.User_JoinDate_ngModel.trim();
                      this.userinfo_entry.CONFIRMATION_DATE = this.User_ConfirmationDate_ngModel.trim();
                      this.userinfo_entry.RESIGNATION_DATE = this.User_ResignationDate_ngModel.trim();
                      this.userinfo_entry.BRANCH = this.User_Branch_ngModel.trim();
                      this.userinfo_entry.EMPLOYEE_TYPE = this.User_EmployeeType_ngModel.trim();
                      this.userinfo_entry.APPROVER1 = this.User_Approver1_ngModel.trim();
                      this.userinfo_entry.APPROVER2 = this.User_Approver2_ngModel.trim();
                      this.userinfo_entry.EMPLOYEE_STATUS = this.User_Employment_ngModel.trim();

                      this.userservice.save_user_info(this.userinfo_entry)
                        .subscribe((response) => {
                          alert('Entered into 2');
                          if (response.status == 200) {
                            alert('user_info Registered successfully');
                            // this.navCtrl.setRoot(this.navCtrl.getActive().component);


                            this.usercontact_entry.CONTACT_NO = this.User_PersonalNo_ngModel.trim();
                            this.usercontact_entry.CONTACT_INFO_GUID = UUID.UUID();
                            this.usercontact_entry.USER_GUID = this.usermain_entry.USER_GUID;
                            this.usercontact_entry.CREATION_TS = new Date().toISOString();
                            this.usercontact_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
                            this.usercontact_entry.UPDATE_TS = new Date().toISOString();
                            this.usercontact_entry.UPDATE_USER_GUID = "";

                            this.userservice.save_user_contact(this.usercontact_entry)
                              .subscribe((response) => {
                                alert('Entered into 3');
                                if (response.status == 200) { 
                                  alert('user_contact Registered successfully');
                                  // this.navCtrl.setRoot(this.navCtrl.getActive().component);


                                  this.usercompany_entry.COMPANY_CONTACT_NO = this.User_CompanyNo_ngModel.trim();

                                  this.usercompany_entry.USER_COMPANY_GUID = UUID.UUID();
                                  this.usercompany_entry.USER_GUID = this.usermain_entry.USER_GUID;
                                  this.usercompany_entry.CREATION_TS = new Date().toISOString();
                                  this.usercompany_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
                                  this.usercompany_entry.UPDATE_TS = new Date().toISOString();
                                  this.usercompany_entry.UPDATE_USER_GUID = "";

                                  this.userservice.save_user_company(this.usercompany_entry)
                                    .subscribe((response) => {
                                      alert('Entered into 4');
                                      if (response.status == 200) {
                                        alert('user_company Registered successfully');
                                        //location.reload();
                                        // this.navCtrl.setRoot(this.navCtrl.getActive().component);


                                        this.useraddress_entry.USER_ADDRESS1 = this.User_Address1_ngModel.trim();
                                        this.useraddress_entry.USER_ADDRESS2 = this.User_Address2_ngModel.trim();
                                        this.useraddress_entry.USER_ADDRESS3 = this.User_Address3_ngModel.trim();
                                        this.useraddress_entry.USER_ADDRESS_GUID = UUID.UUID();
                                        this.useraddress_entry.USER_GUID = this.usermain_entry.USER_GUID;
                                        this.useraddress_entry.CREATION_TS = new Date().toISOString();
                                        this.useraddress_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
                                        this.useraddress_entry.UPDATE_TS = new Date().toISOString();
                                        this.useraddress_entry.UPDATE_USER_GUID = "";

                                        this.userservice.save_user_address(this.useraddress_entry)

                                          .subscribe((response) => {
                                            alert('Entered into 5');
                                            if (response.status == 200) {
                                              alert('user_address Registered successfully');
                                              this.navCtrl.setRoot(this.navCtrl.getActive().component);
                                              //location.reload();

                                              if (this.usermain_entry.USER_GUID != null && this.userinfo_entry.USER_INFO_GUID != null &&
                                                this.usercontact_entry.CONTACT_INFO_GUID != null && this.usercompany_entry.USER_COMPANY_GUID != null
                                                && this.useraddress_entry.USER_ADDRESS_GUID != null) {

                                                alert('all recors are inserted');
                                              }

                                              this.navCtrl.setRoot(this.navCtrl.getActive().component);
                                            } else {
                                              alert('5 records not inserted');
                                            }
                                          });
                                      } else {
                                        alert('4 records not inserted');
                                      }
                                    });
                                } else {
                                  alert('3 records not inserted');
                                }
                              });
                          }
                          else {
                            alert('2 records not inserted');
                          }
                        });

                      // this.navCtrl.setRoot(this.navCtrl.getActive().component);
                    }
                    else {
                      alert('1 records not inserted');
                      // if( this.usermain_entry.USER_GUID != null && this.userinfo_entry.USER_INFO_GUID != null &&
                      //   this.usercontact_entry.CONTACT_INFO_GUID != null &&  this.usercompany_entry.USER_COMPANY_GUID != null
                      //   && this.useraddress_entry.USER_ADDRESS_GUID != null){

                      //   alert('all recors are inserted');
                      // } 
                      // else{
                      //   alert('records not inserted');
                      // }
                    }
                  });


              }
            }
            else {
              console.log("Records Found");
              alert("The User is already Exist.")
            }
          },
          err => {
            this.Exist_Record = false;
            console.log("ERROR!: ", err);
          });
    }
  }


  USER_GUID_FOR_UPDATE: any;
  Update(USER_GUID: any) {
    if (this.Userform) {
      // let headers = new Headers();
      // headers.append('Content-Type', 'application/json');
      // let options = new RequestOptions({ headers: headers });

      let url: string;
      //let request_id = UUID.UUID();
      //url = this.baseResource_Url + "claim_request_detail?filter=(DESCRIPTION=" + this.Travel_Description_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      //url = this.baseResourceUrl2 + "user_main?filter=(USER_GUID=" + request_id + ')&api_key=' + constants.DREAMFACTORY_API_KEY;

      // url = this.baseResourceUrl2_URL + "user_main?filter=(EMAIL=" + this.User_Email_Edit_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY;          
      // this.http.get(url)
      //   .map(res => res.json())
      //   .subscribe(
      //   data => {
      //     let res = data["resource"];

      //     if (res.length == 0) {
      if (this.Exist_Record == false) {

        this.usermain_entry.EMAIL = this.User_Email_Edit_ngModel;
        this.usermain_entry.USER_GUID = this.USER_GUID_FOR_UPDATE;
        //this.usermain_entry.TENANT_GUID = "x";
        //this.usermain_entry.STAFF_ID	 = "y";
        //this.usermain_entry.PASSWORD = "z";
        //this.usermain_entry.LOGIN_ID = "925f21cf-7994-0716-b23c-ac8bff3167a4";
        this.usermain_entry.LOGIN_ID = this.User_LoginId_Edit_ngModel;
        this.usermain_entry.PASSWORD = this.User_Password_Edit_ngModel;
        //this.usermain_entry.ACTIVATION_FLAG = 1;
        this.usermain_entry.CREATION_TS = new Date().toISOString();
        this.usermain_entry.CREATION_USER_GUID = "1";
        this.usermain_entry.UPDATE_TS = new Date().toISOString();
        this.usermain_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");

        this.userservice.edit_user_main(this.usermain_entry)
          .subscribe((response) => {
            if (response.status == 200) {
              alert('user_main updated successfully');
              //location.reload();


              this.userinfo_entry.FULLNAME = this.User_Name_Edit_ngModel;
              // this.viewuser_entry.NAME = this.User_Name_Edit_ngModel;                    
              this.userinfo_entry.MARITAL_STATUS = this.User_Marital_Edit_ngModel;
              this.userinfo_entry.PERSONAL_ID_TYPE = this.User_StaffID_Edit_ngModel;
              this.userinfo_entry.PERSONAL_ID = this.User_ICNo_Edit_ngModel;
              this.userinfo_entry.DOB = this.User_DOB_Edit_ngModel;
              this.userinfo_entry.GENDER = this.User_Gender_Edit_ngModel;
              this.userinfo_entry.USER_INFO_GUID = this.USER_INFO_GUID_FOR_UPDATE;
              this.userinfo_entry.USER_GUID = this.USER_GUID_FOR_UPDATE;
              this.userinfo_entry.CREATION_TS = new Date().toISOString();
              this.userinfo_entry.CREATION_USER_GUID = "1";
              this.userinfo_entry.UPDATE_TS = new Date().toISOString();
              this.userinfo_entry.UPDATE_USER_GUID = "";
              this.userinfo_entry.DESIGNATION_GUID = this.User_Designation_Edit_ngModel;
              this.userinfo_entry.TENANT_COMPANY_GUID = this.User_Company_Edit_ngModel;

              this.userinfo_entry.DEPT_GUID = this.User_Department_Edit_ngModel;
              this.userinfo_entry.JOIN_DATE = this.User_JoinDate_Edit_ngModel;
              this.userinfo_entry.CONFIRMATION_DATE = this.User_ConfirmationDate_Edit_ngModel;
              this.userinfo_entry.RESIGNATION_DATE = this.User_ResignationDate_Edit_ngModel;
              this.userinfo_entry.BRANCH = this.User_Branch_Edit_ngModel;
              this.userinfo_entry.EMPLOYEE_TYPE = this.User_EmployeeType_Edit_ngModel;
              this.userinfo_entry.APPROVER1 = this.User_Approver1_Edit_ngModel;
              this.userinfo_entry.APPROVER2 = this.User_Approver2_Edit_ngModel;
              this.userinfo_entry.EMPLOYEE_STATUS = this.User_Employment_Edit_ngModel;

              this.userservice.edit_user_info(this.userinfo_entry)
                .subscribe((response) => {
                  if (response.status == 200) {
                    alert('user_info Updated successfully');
                    this.navCtrl.setRoot(this.navCtrl.getActive().component);
                  }
                });

              this.navCtrl.setRoot(this.navCtrl.getActive().component);
            }
          });

        this.usercontact_entry.CONTACT_NO = this.User_PersonalNo_Edit_ngModel.trim();
        //this.usercontact_entry.CONTACT_INFO_GUID = this.USER_GUID_FOR_CONTACT;
        this.usercontact_entry.CONTACT_INFO_GUID = this.USER_GUID_FOR_CONTACT;
        this.usercontact_entry.USER_GUID = this.USER_GUID_FOR_UPDATE;
        this.usercontact_entry.CREATION_TS = new Date().toISOString();
        this.usercontact_entry.CREATION_USER_GUID = "1";
        this.usercontact_entry.UPDATE_TS = new Date().toISOString();
        this.usercontact_entry.UPDATE_USER_GUID = "";

        this.userservice.edit_user_contact(this.usercontact_entry)
          .subscribe((response) => {
            if (response.status == 200) {
              alert('user_contact Registered successfully');

              this.navCtrl.setRoot(this.navCtrl.getActive().component);
            }
          });

        this.usercompany_entry.COMPANY_CONTACT_NO = this.User_CompanyNo_Edit_ngModel.trim();
        this.usercompany_entry.USER_COMPANY_GUID = this.USER_GUID_FOR_COMPANY_CONTACT;
        this.usercompany_entry.USER_GUID = this.USER_GUID_FOR_UPDATE;
        this.usercompany_entry.CREATION_TS = new Date().toISOString();
        this.usercompany_entry.CREATION_USER_GUID = "1";
        this.usercompany_entry.UPDATE_TS = new Date().toISOString();
        this.usercompany_entry.UPDATE_USER_GUID = "";

        this.userservice.edit_user_company(this.usercompany_entry)
          .subscribe((response) => {
            if (response.status == 200) {
              alert('user_company Registered successfully');
              //location.reload();
              this.navCtrl.setRoot(this.navCtrl.getActive().component);
            }
          });

        this.useraddress_entry.USER_ADDRESS1 = this.User_Address1_Edit_ngModel.trim();
        this.useraddress_entry.USER_ADDRESS2 = this.User_Address2_Edit_ngModel.trim();
        this.useraddress_entry.USER_ADDRESS3 = this.User_Address3_Edit_ngModel.trim();
        this.useraddress_entry.USER_ADDRESS_GUID = this.USER_GUID_FOR_ADDRESS;
        this.useraddress_entry.USER_GUID = this.USER_GUID_FOR_UPDATE;
        this.useraddress_entry.CREATION_TS = new Date().toISOString();
        this.useraddress_entry.CREATION_USER_GUID = "1";
        this.useraddress_entry.UPDATE_TS = new Date().toISOString();
        this.useraddress_entry.UPDATE_USER_GUID = "";

        this.userservice.edit_user_address(this.useraddress_entry)

          .subscribe((response) => {
            if (response.status == 200) {
              alert('user_address Registered successfully');
              //location.reload();
              this.navCtrl.setRoot(this.navCtrl.getActive().component);
            }
          });
      }
      //   }
      //   else {
      //     console.log("Records Found");
      //     alert("The User is already Exist.")
      //   }
      // },
      // err => {
      //   this.Exist_Record = false;
      //   console.log("ERROR!: ", err);
      // });
    }
  }


  ClearControls() {
    this.User_Name_ngModel = "";
    this.User_Email_ngModel = "";
    this.User_PersonalNo_ngModel = "";
    this.User_CompanyNo_ngModel = "";
    this.User_Marital_ngModel = "";
    this.User_StaffID_ngModel = "";
    this.User_ICNo_ngModel = "";
    this.User_DOB_ngModel = "";
    this.User_Gender_ngModel = "";
    this.User_Designation_ngModel = "";
    this.User_Company_ngModel = "";
    this.User_Department_ngModel = "";
    this.User_JoinDate_ngModel = "";
    this.User_ConfirmationDate_ngModel = "";
    this.User_ResignationDate_ngModel = "";
    this.User_Branch_ngModel = "";
    this.User_Approver1_ngModel = "";
    this.User_Approver2_ngModel = "";
    this.User_EmployeeType_ngModel = "";
    this.User_Employment_ngModel = "";
    this.User_Address1_ngModel = "";
    this.User_Address2_ngModel = "";
    this.User_Address3_ngModel = "";

  }
}