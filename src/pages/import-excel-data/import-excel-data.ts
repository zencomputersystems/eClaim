import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController } from 'ionic-angular';
import { SocCustomer_Model } from '../../models/soc_customer_model';
import { SocProject_Model } from '../../models/soc_project_model';
import { SocMain_Model } from '../../models/socmain_model';
import { SocCustomerLocation_Model } from '../../models/soc_customer_location_model';
import { UserMain_Model } from '../../models/user_main_model';
import { UserInfo_Model } from '../../models/usersetup_info_model';
import { UserAddress_Model } from '../../models/usersetup_address_model';
import { UserCompany_Model } from '../../models/user_company_model';
import { UserContact_Model } from '../../models/user_contact_model';
import { UserQualification_Model } from '../../models/user_qualification_model';
import { UserRole_Model } from '../../models/user_role_model';
import { Main_Attendance_Model } from '../../models/main_attendance_model';
import { Device_Raw_Data_Model } from '../../models/device_raw_data_model';
import { User_Attendance_Main_Model } from '../../models/user_attendance_main_model';
import { Leave_Raw_Data_Model } from '../../models/leave_raw_data_model';
import * as constants from '../../app/config/constants';
import { Http, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import * as XLSX from 'xlsx';
import { UUID } from 'angular2-uuid';
import { ApiManagerProvider } from '../../providers/api-manager.provider';
import moment from 'moment';
import { Observable } from 'rxjs/Rx';
import { saveAs as importedSaveAs } from "file-saver";
import { sanitizeURL } from '../../providers/sanitizer/sanitizer';

/**
 * Generated class for the ImportExcelDataPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()

@Component({
  selector: 'page-import-excel-data',
  templateUrl: 'import-excel-data.html',
  // providers: [DatePipe, DataTransfer]
  providers: []
})

export class ImportExcelDataPage {
  t_user: any;
  t_bank: any;
  t_designation: any;
  t_department: any;
  t_qualification: any;
  t_role: any;

  @ViewChild('fileInputAttendance') fileInputAttendance: ElementRef;
  @ViewChild('fileInputLeave') fileInputLeave: ElementRef;

  // test_model: test_model = new test_model();  

  test_model: SocProject_Model = new SocProject_Model();
  // test_model: SocMain_Model = new SocMain_Model();

  SocCustomerLocation_Model: SocCustomerLocation_Model = new SocCustomerLocation_Model();
  UserMain_Model: UserMain_Model = new UserMain_Model();

  baseResourceurl_Excel: string;
  new_data: any[];
  chooseFile: boolean = false;

  main_customer_location_Url: any;
  main_customer_location_data: any[];

  // constructor(private apiMng: ApiManagerProvider, public datepipe: DatePipe, public navCtrl: NavController, public navParams: NavParams, public http: Http, private loadingCtrl: LoadingController) {
    constructor(private apiMng: ApiManagerProvider, public navCtrl: NavController, public navParams: NavParams, public http: Http, private loadingCtrl: LoadingController) {
    this.Get_Device_GUID();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImportExcelDataPage');
  }

  //duplicate check for main_customer
  duplicateCheck_mainCustomer(checkData: any) {
    this.apiMng.getApiModel('main_customer', 'filter=CUSTOMER_GUID=' + checkData.CUSTOMER_GUID)
      .subscribe(data => {
        let checkDataFromDB = data["resource"];
        if (checkDataFromDB.length == 0) {
          this.SocCustomer_Model.CUSTOMER_GUID = checkData.CUSTOMER_GUID;
          this.SocCustomer_Model.TENANT_GUID = checkData.TENANT_GUID;
          this.SocCustomer_Model.NAME = checkData.NAME;
          this.SocCustomer_Model.DESCRIPTION = checkData.DESCRIPTION;
          this.SocCustomer_Model.CREATION_TS = new Date().toISOString();;
          this.SocCustomer_Model.CREATION_USER_GUID = 'sva_test';
          this.SocCustomer_Model.UPDATE_TS = new Date().toISOString();;
          this.SocCustomer_Model.UPDATE_USER_GUID = 'sva_test';

          var queryHeaders = new Headers();
          queryHeaders.append('Content-Type', 'application/json');
          queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
          let options = new RequestOptions({ headers: queryHeaders });
          return new Promise((resolve) => {
            this.http.post(this.main_customer_Url, this.SocCustomer_Model.toJson(true), options)
              .map((response) => {
                return response;
              }).subscribe((response) => {
                resolve(response.json());
              })
          })
        }
        else {
          return
        }
      })
  }

  // For main_customer
  chooseFile_main_customer: boolean = false;
  SocCustomer_Model: SocCustomer_Model = new SocCustomer_Model();
  arrayBuffer_main_customer: any;
  file_main_customer: File;
  main_customer_Url: any;
  main_customer_data: any[];

  main_customer(event: any) {
    this.chooseFile_main_customer = true;
    this.file_main_customer = event.target.files[0];
  }
  main_customer_click() {
    this.main_customer_Url = constants.DREAMFACTORY_TABLE_URL + '/main_customer?&api_key=' + constants.DREAMFACTORY_API_KEY;
    let fileReader = new FileReader();
    fileReader.onload = () => {
      this.arrayBuffer_main_customer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer_main_customer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      // zero for first sheet
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      // console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));
      this.main_customer_data = XLSX.utils.sheet_to_json(worksheet, { raw: true })
      console.log(this.main_customer_data)
      console.log(this.main_customer_data.length)

      this.main_customer_data.forEach(element => {
        this.duplicateCheck_mainCustomer(element);
        // For main_customer
        // this.SocCustomer_Model.CUSTOMER_GUID = element.CUSTOMER_GUID;
        // this.SocCustomer_Model.TENANT_GUID = element.TENANT_GUID;
        // this.SocCustomer_Model.NAME = element.NAME;
        // this.SocCustomer_Model.DESCRIPTION = element.DESCRIPTION;
        // this.SocCustomer_Model.CREATION_TS = new Date().toISOString();;
        // this.SocCustomer_Model.CREATION_USER_GUID = 'sva_test';
        // this.SocCustomer_Model.UPDATE_TS = new Date().toISOString();;
        // this.SocCustomer_Model.UPDATE_USER_GUID = 'sva_test';


        // var queryHeaders = new Headers();
        // queryHeaders.append('Content-Type', 'application/json');
        // queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        // let options = new RequestOptions({ headers: queryHeaders });
        // return new Promise((resolve, reject) => {
        //   this.http.post(this.main_customer_Url, this.SocCustomer_Model.toJson(true), options)
        //     .map((response) => {
        //       return response;
        //     }).subscribe((response) => {
        //       resolve(response.json());
        //     })
        // })
      });
    }
    fileReader.readAsArrayBuffer(this.file_main_customer);
  }

  //duplicate check for main_customer
  duplicateCheck_mainProject(checkData: any) {
    this.apiMng.getApiModel('main_project', 'filter=CUSTOMER_GUID=' + checkData.CUSTOMER_GUID)
      .subscribe(data => {
        let checkDataFromDB = data["resource"];
        if (checkDataFromDB.length == 0) {
          this.test_model.PROJECT_GUID = checkData.PROJECT_GUID;
          this.test_model.NAME = checkData.NAME;
          this.test_model.CUSTOMER_GUID = checkData.CUSTOMER_GUID;
          this.test_model.CUSTOMER_LOCATION_GUID = checkData.CUSTOMER_LOCATION_GUID;
          this.test_model.TENANT_GUID = checkData.TENANT_GUID;
          this.test_model.ACTIVATION_FLAG = checkData.ACTIVATION_FLAG;
          this.test_model.CREATION_TS = new Date().toISOString();;
          this.test_model.CREATION_USER_GUID = 'sva_test';
          this.test_model.UPDATE_TS = new Date().toISOString();;
          this.test_model.UPDATE_USER_GUID = 'sva_test';

          var queryHeaders = new Headers();
          queryHeaders.append('Content-Type', 'application/json');
          queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
          let options = new RequestOptions({ headers: queryHeaders });
          return new Promise((resolve) => {
            this.http.post(this.baseResourceurl_Excel, this.test_model.toJson(true), options)
              .map((response) => {
                return response;
              }).subscribe((response) => {
                resolve(response.json());
              })
          })
        }
        else {
          return
        }
      })
  }

  // For main_project
  chooseFile_incomingfile: boolean = false;
  arrayBuffer: any;
  file: File;
  incomingfile(event: any) {
    this.chooseFile_incomingfile = true;
    this.file = event.target.files[0];
  }

  Upload() {
    //  debugger;
    //this.chooseFile = true;
    // this.baseResourceurl_Excel = constants.DREAMFACTORY_TABLE_URL + '/newtable?&api_key=' + constants.DREAMFACTORY_API_KEY;
    // this.baseResourceurl_Excel = constants.DREAMFACTORY_TABLE_URL + '/main_customer?&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.baseResourceurl_Excel = constants.DREAMFACTORY_TABLE_URL + '/main_project?&api_key=' + constants.DREAMFACTORY_API_KEY;
    // this.baseResourceurl_Excel = constants.DREAMFACTORY_TABLE_URL + '/soc_main?&api_key=' + constants.DREAMFACTORY_API_KEY;
    let fileReader = new FileReader();
    fileReader.onload = () => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      // zero for first sheet
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      // console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));

      this.new_data = XLSX.utils.sheet_to_json(worksheet, { raw: true })
      console.log(this.new_data)
      console.log(this.new_data.length)
      // for(var i=0 ; i<=this.new_data.length ; i++)
      // {
      this.new_data.forEach(element => {
        this.duplicateCheck_mainProject(element);
      });
    }
    fileReader.readAsArrayBuffer(this.file);

  }

  //duplicate check for main_customer_location
  duplicateCheck_mainCustomerLocation(checkData: any) {
    this.apiMng.getApiModel('main_project', 'filter=CUSTOMER_GUID=' + checkData.CUSTOMER_GUID)
      .subscribe(data => {
        let checkDataFromDB = data["resource"];
        if (checkDataFromDB.length == 0) {
          this.SocCustomerLocation_Model.CUSTOMER_GUID = checkData.CUSTOMER_GUID;
          this.SocCustomerLocation_Model.CUSTOMER_LOCATION_GUID = checkData.CUSTOMER_LOCATION_GUID;
          this.SocCustomerLocation_Model.NAME = checkData.NAME;
          this.SocCustomerLocation_Model.DESCRIPTION = checkData.DESCRIPTION;
          this.SocCustomerLocation_Model.REGISTRATION_NO = checkData.REGISTRATION_NO;
          this.SocCustomerLocation_Model.ADDRESS1 = checkData.ADDRESS1;
          this.SocCustomerLocation_Model.ADDRESS2 = checkData.ADDRESS2;
          this.SocCustomerLocation_Model.ADDRESS3 = checkData.ADDRESS3;
          this.SocCustomerLocation_Model.CONTACT_PERSON = checkData.CONTACT_PERSON;
          this.SocCustomerLocation_Model.CONTACT_PERSON_MOBILE_NO = checkData.CONTACT_PERSON_MOBILE_NO;
          this.SocCustomerLocation_Model.CONTACT_NO1 = checkData.CONTACT_NO1;
          this.SocCustomerLocation_Model.CONTACT_NO2 = checkData.CONTACT_NO2;
          this.SocCustomerLocation_Model.EMAIL = checkData.EMAIL;
          this.SocCustomerLocation_Model.DIVISION = checkData.DIVISION;


          this.SocCustomerLocation_Model.CREATION_TS = new Date().toISOString();;
          this.SocCustomerLocation_Model.CREATION_USER_GUID = 'sva_test';
          this.SocCustomerLocation_Model.UPDATE_TS = new Date().toISOString();;
          this.SocCustomerLocation_Model.UPDATE_USER_GUID = 'sva_test';

          var queryHeaders = new Headers();
          queryHeaders.append('Content-Type', 'application/json');
          queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
          let options = new RequestOptions({ headers: queryHeaders });
          return new Promise((resolve) => {
            this.http.post(this.main_customer_location_Url, this.SocCustomerLocation_Model.toJson(true), options)
              .map((response) => {
                return response;
              }).subscribe((response) => {
                resolve(response.json());
              })
          })
        }
        else {
          return
        }
      })
  }

  // For main_customer_location
  chooseFile_main_customer_location: boolean = false;
  arrayBuffer_main_customer_location: any;
  file_main_customer_location: File;
  main_customer_location(event: any) {
    this.chooseFile_main_customer_location = true;
    this.file = event.target.files[0];
  }
  main_customer_location_click() {
    this.main_customer_location_Url = constants.DREAMFACTORY_TABLE_URL + '/main_customer_location?&api_key=' + constants.DREAMFACTORY_API_KEY;
    let fileReader = new FileReader();
    fileReader.onload = () => {
      this.arrayBuffer_main_customer_location = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer_main_customer_location);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      // zero for first sheet
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      // console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));

      this.main_customer_location_data = XLSX.utils.sheet_to_json(worksheet, { raw: true })
      console.log(this.main_customer_location_data)
      console.log(this.main_customer_location_data.length)

      this.main_customer_location_data.forEach(element => {
        this.duplicateCheck_mainCustomerLocation(element);
      });
    }
    fileReader.readAsArrayBuffer(this.file);

  }

  //duplicate check for soc_main
  duplicateCheck_SOCMain(checkData: any) {
    this.apiMng.getApiModel('soc_main', 'filter=PROJECT_GUID=' + checkData.CUSTOMER_GUID)
      .subscribe(data => {
        let checkDataFromDB = data["resource"];
        if (checkDataFromDB.length == 0) {
          this.SocMain_Model.SOC_GUID = checkData.SOC_GUID;
          this.SocMain_Model.SOC_NO = checkData.SOC_NO;
          this.SocMain_Model.PROJECT_GUID = checkData.PROJECT_GUID;
          this.SocMain_Model.TENANT_GUID = checkData.TENANT_GUID;
          this.SocMain_Model.ACTIVATION_FLAG = checkData.ACTIVATION_FLAG;

          this.SocMain_Model.CREATION_TS = new Date().toISOString();;
          this.SocMain_Model.CREATION_USER_GUID = 'sva_test';
          this.SocMain_Model.UPDATE_TS = new Date().toISOString();;
          this.SocMain_Model.UPDATE_USER_GUID = 'sva_test';

          var queryHeaders = new Headers();
          queryHeaders.append('Content-Type', 'application/json');
          queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
          let options = new RequestOptions({ headers: queryHeaders });
          return new Promise((resolve) => {
            this.http.post(this.soc_main_Url, this.SocMain_Model.toJson(true), options)
              .map((response) => {
                return response;
              }).subscribe((response) => {
                resolve(response.json());
              })
          })
        }
        else {
          return
        }
      })
  }

  // For soc_main
  chooseFile_soc_main: boolean = false;
  SocMain_Model: SocMain_Model = new SocMain_Model();
  arrayBuffer_soc_main: any;
  file_soc_main: File;
  soc_main_Url: any;
  soc_main_data: any[];

  soc_main(event: any) {
    this.chooseFile_soc_main = true;
    this.file_soc_main = event.target.files[0];
  }
  soc_main_click() {
    this.soc_main_Url = constants.DREAMFACTORY_TABLE_URL + '/soc_main?&api_key=' + constants.DREAMFACTORY_API_KEY;
    let fileReader = new FileReader();
    fileReader.onload = () => {
      this.arrayBuffer_main_customer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer_main_customer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      // zero for first sheet
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      // console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));
      this.soc_main_data = XLSX.utils.sheet_to_json(worksheet, { raw: true })
      console.log(this.soc_main_data)
      console.log(this.soc_main_data.length)

      this.soc_main_data.forEach(element => {
        this.duplicateCheck_SOCMain(element);
      });
    }
    fileReader.readAsArrayBuffer(this.file_soc_main);
  }

  //duplicate check for user_main
  duplicateCheck_userMain(checkData: any) {
    this.apiMng.getApiModel('user_main', 'filter=USER_GUID=' + checkData.USER_GUID)
      .subscribe(data => {
        let checkDataFromDB = data["resource"];
        if (checkDataFromDB.length == 0) {
          this.UserMain_Model.USER_GUID = checkData.USER_GUID;
          this.UserMain_Model.TENANT_GUID = checkData.TENANT_GUID;
          this.UserMain_Model.STAFF_ID = checkData.STAFF_ID;
          this.UserMain_Model.LOGIN_ID = checkData.LOGIN_ID;
          this.UserMain_Model.PASSWORD = checkData.PASSWORD;
          this.UserMain_Model.EMAIL = checkData.EMAIL;
          this.UserMain_Model.ACTIVATION_FLAG = checkData.ACTIVATION_FLAG;
          this.UserMain_Model.IS_TENANT_ADMIN = checkData.IS_TENANT_ADMIN;

          this.UserMain_Model.CREATION_TS = new Date().toISOString();;
          this.UserMain_Model.CREATION_USER_GUID = 'sva_test';
          this.UserMain_Model.UPDATE_TS = new Date().toISOString();;
          this.UserMain_Model.UPDATE_USER_GUID = 'sva_test';

          var queryHeaders = new Headers();
          queryHeaders.append('Content-Type', 'application/json');
          queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
          let options = new RequestOptions({ headers: queryHeaders });
          return new Promise((resolve) => {
            this.http.post(this.user_main_Url, this.UserMain_Model.toJson(true), options)
              .map((response) => {
                return response;
              }).subscribe((response) => {
                resolve(response.json());
              })
          })
        }
        else {
          return
        }
      })
  }


  // For user_main
  chooseFile_user_main: boolean = false;
  arrayBuffer_user_main: any;
  file_user_main: File;
  user_main_Url: any;
  user_main(event: any) {
    this.chooseFile_user_main = true;
    this.file_user_main = event.target.files[0];
  }
  user_main_click() {
    this.user_main_Url = constants.DREAMFACTORY_TABLE_URL + '/user_main?&api_key=' + constants.DREAMFACTORY_API_KEY;
    let fileReader = new FileReader();
    fileReader.onload = () => {
      this.arrayBuffer_user_main = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer_user_main);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      // zero for first sheet
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      // console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));

      this.main_customer_location_data = XLSX.utils.sheet_to_json(worksheet, { raw: true })
      console.log(this.main_customer_location_data)
      console.log(this.main_customer_location_data.length)

      this.main_customer_location_data.forEach(element => {
        this.duplicateCheck_userMain(element);
      });
    }
    fileReader.readAsArrayBuffer(this.file_user_main);
  }

  //duplicate check for user_info
  duplicateCheck_userInfo(checkData: any) {
    this.apiMng.getApiModel('user_info', 'filter=USER_GUID=' + checkData.USER_GUID)
      .subscribe(data => {
        let checkDataFromDB = data["resource"];
        if (checkDataFromDB.length == 0) {
          this.UserInfo_Model.USER_INFO_GUID = checkData.USER_INFO_GUID;
          this.UserInfo_Model.USER_GUID = checkData.USER_GUID;
          this.UserInfo_Model.FULLNAME = checkData.FULLNAME;
          this.UserInfo_Model.NICKNAME = checkData.NICKNAME;
          this.UserInfo_Model.SALUTATION = checkData.SALUTATION;
          this.UserInfo_Model.MANAGER_USER_GUID = checkData.MANAGER_USER_GUID;
          this.UserInfo_Model.PERSONAL_ID_TYPE = checkData.PERSONAL_ID_TYPE;
          this.UserInfo_Model.PERSONAL_ID = checkData.PERSONAL_ID;
          this.UserInfo_Model.DOB = checkData.DOB;
          this.UserInfo_Model.GENDER = checkData.GENDER;
          this.UserInfo_Model.JOIN_DATE = checkData.JOIN_DATE;
          this.UserInfo_Model.MARITAL_STATUS = checkData.MARITAL_STATUS;
          this.UserInfo_Model.BRANCH = checkData.BRANCH;
          this.UserInfo_Model.EMPLOYEE_TYPE = checkData.EMPLOYEE_TYPE;
          this.UserInfo_Model.APPROVER1 = checkData.APPROVER1;
          this.UserInfo_Model.APPROVER2 = checkData.APPROVER2;
          this.UserInfo_Model.EMPLOYEE_STATUS = checkData.EMPLOYEE_STATUS;
          this.UserInfo_Model.DEPT_GUID = checkData.DEPT_GUID;
          this.UserInfo_Model.DESIGNATION_GUID = checkData.DESIGNATION_GUID;
          this.UserInfo_Model.RESIGNATION_DATE = checkData.RESIGNATION_DATE;
          this.UserInfo_Model.TENANT_COMPANY_GUID = checkData.TENANT_COMPANY_GUID;
          this.UserInfo_Model.CONFIRMATION_DATE = checkData.CONFIRMATION_DATE;
          this.UserInfo_Model.TENANT_COMPANY_SITE_GUID = checkData.TENANT_COMPANY_SITE_GUID;
          this.UserInfo_Model.EMG_CONTACT_NAME_1 = checkData.EMG_CONTACT_NAME_1;
          this.UserInfo_Model.EMG_RELATIONSHIP_1 = checkData.EMG_RELATIONSHIP_1;
          this.UserInfo_Model.EMG_CONTACT_NUMBER_1 = checkData.EMG_CONTACT_NUMBER_1;
          this.UserInfo_Model.EMG_CONTACT_NAME_2 = checkData.EMG_CONTACT_NAME_2;
          this.UserInfo_Model.EMG_RELATIONSHIP_2 = checkData.EMG_RELATIONSHIP_2;
          this.UserInfo_Model.EMG_CONTACT_NUMBER_2 = checkData.EMG_CONTACT_NUMBER_2;
          this.UserInfo_Model.PR_EPF_NUMBER = checkData.PR_EPF_NUMBER;
          this.UserInfo_Model.PR_INCOMETAX_NUMBER = checkData.PR_INCOMETAX_NUMBER;
          this.UserInfo_Model.BANK_GUID = checkData.BANK_GUID;
          this.UserInfo_Model.PR_ACCOUNT_NUMBER = checkData.PR_ACCOUNT_NUMBER;
          this.UserInfo_Model.ATTACHMENT_ID = checkData.ATTACHMENT_ID;

          this.UserInfo_Model.CREATION_TS = new Date().toISOString();;
          this.UserInfo_Model.CREATION_USER_GUID = 'sva_test';
          this.UserInfo_Model.UPDATE_TS = new Date().toISOString();;
          this.UserInfo_Model.UPDATE_USER_GUID = 'sva_test';

          var queryHeaders = new Headers();
          queryHeaders.append('Content-Type', 'application/json');
          queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
          let options = new RequestOptions({ headers: queryHeaders });
          return new Promise((resolve) => {
            this.http.post(this.user_info_Url, this.UserInfo_Model.toJson(true), options)
              .map((response) => {
                return response;
              }).subscribe((response) => {
                resolve(response.json());
              })
          })
        }
        else {
          return
        }
      })
  }

  // For user_info
  chooseFile_user_info: boolean = false;
  arrayBuffer_user_info: any;
  file_user_info: File;
  user_info_Url: any;
  UserInfo_Model: UserInfo_Model = new UserInfo_Model();
  user_info_data: any[];

  user_info(event: any) {
    this.chooseFile_user_info = true;
    this.file_user_info = event.target.files[0];
  }
  user_info_click() {
    this.user_info_Url = constants.DREAMFACTORY_TABLE_URL + '/user_info?&api_key=' + constants.DREAMFACTORY_API_KEY;
    let fileReader = new FileReader();
    fileReader.onload = () => {
      this.arrayBuffer_user_info = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer_user_info);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      //  var workbook = XLSX.read(bstr, { type: "binary" });
      var workbook = XLSX.read(bstr, { type: "binary", cellDates: true, cellNF: false, cellText: false });
      // zero for first sheet
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      // console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));

      //  this.main_customer_location_data = XLSX.utils.sheet_to_json(worksheet, { raw: true})
      this.main_customer_location_data = XLSX.utils.sheet_to_json(worksheet)
      console.log(this.main_customer_location_data)
      console.log(this.main_customer_location_data.length)

      this.main_customer_location_data.forEach(element => {
        this.duplicateCheck_userInfo(element);
      });
    }
    fileReader.readAsArrayBuffer(this.file_user_info);

  }

  //duplicate check for user_address
  duplicateCheck_userAddress(checkData: any) {
    this.apiMng.getApiModel('user_address', 'filter=USER_GUID=' + checkData.USER_GUID)
      .subscribe(data => {
        let checkDataFromDB = data["resource"];
        if (checkDataFromDB.length == 0) {
          this.UserAddress_Model.USER_ADDRESS_GUID = checkData.USER_ADDRESS_GUID;
          this.UserAddress_Model.USER_GUID = checkData.USER_GUID;
          this.UserAddress_Model.ADDRESS_TYPE = checkData.ADDRESS_TYPE;
          this.UserAddress_Model.USER_ADDRESS1 = checkData.USER_ADDRESS1;
          this.UserAddress_Model.USER_ADDRESS2 = checkData.USER_ADDRESS2;
          this.UserAddress_Model.USER_ADDRESS3 = checkData.USER_ADDRESS3;
          this.UserAddress_Model.POST_CODE = checkData.POST_CODE;
          this.UserAddress_Model.COUNTRY_GUID = checkData.COUNTRY_GUID;
          this.UserAddress_Model.STATE_GUID = checkData.STATE_GUID;

          this.UserAddress_Model.CREATION_TS = new Date().toISOString();;
          this.UserAddress_Model.CREATION_USER_GUID = 'sva_test';
          this.UserAddress_Model.UPDATE_TS = new Date().toISOString();;
          this.UserAddress_Model.UPDATE_USER_GUID = 'sva_test';

          var queryHeaders = new Headers();
          queryHeaders.append('Content-Type', 'application/json');
          queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
          let options = new RequestOptions({ headers: queryHeaders });
          return new Promise((resolve) => {
            this.http.post(this.user_address_Url, this.UserAddress_Model.toJson(true), options)
              .map((response) => {
                return response;
              }).subscribe((response) => {
                resolve(response.json());
              })
          })
        }
        else {
          return
        }
      })
  }

  // For user_address
  chooseFile_user_address: boolean = false;
  arrayBuffer_user_address: any;
  file_user_address: File;
  user_address_Url: any;
  UserAddress_Model: UserAddress_Model = new UserAddress_Model();
  user_address_data: any[];

  user_address(event: any) {
    this.chooseFile_user_address = true;
    this.file_user_address = event.target.files[0];
  }
  user_address_click() {
    this.user_address_Url = constants.DREAMFACTORY_TABLE_URL + '/user_address?&api_key=' + constants.DREAMFACTORY_API_KEY;
    let fileReader = new FileReader();
    fileReader.onload = () => {
      this.arrayBuffer_user_address = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer_user_address);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      // zero for first sheet
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      // console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));

      this.user_address_data = XLSX.utils.sheet_to_json(worksheet, { raw: true })
      console.log(this.user_address_data)
      console.log(this.user_address_data.length)

      this.user_address_data.forEach(element => {
        this.duplicateCheck_userAddress(element);

      });
    }
    fileReader.readAsArrayBuffer(this.file_user_address);

  }

  //duplicate check for user_address
  duplicateCheck_userCompany(checkData: any) {
    this.apiMng.getApiModel('user_company', 'filter=USER_GUID=' + checkData.USER_GUID)
      .subscribe(data => {
        let checkDataFromDB = data["resource"];
        if (checkDataFromDB.length == 0) {
          this.UserCompany_Model.USER_COMPANY_GUID = checkData.USER_COMPANY_GUID;
          this.UserCompany_Model.USER_GUID = checkData.USER_GUID;
          this.UserCompany_Model.TENANT_COMPANY_SITE_GUID = checkData.TENANT_COMPANY_SITE_GUID;
          this.UserCompany_Model.COMPANY_CONTACT_NO = checkData.COMPANY_CONTACT_NO;

          this.UserCompany_Model.CREATION_TS = new Date().toISOString();;
          this.UserCompany_Model.CREATION_USER_GUID = 'sva_test';
          this.UserCompany_Model.UPDATE_TS = new Date().toISOString();;
          this.UserCompany_Model.UPDATE_USER_GUID = 'sva_test';

          var queryHeaders = new Headers();
          queryHeaders.append('Content-Type', 'application/json');
          queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
          let options = new RequestOptions({ headers: queryHeaders });
          return new Promise((resolve) => {
            this.http.post(this.user_company_Url, this.UserCompany_Model.toJson(true), options)
              .map((response) => {
                return response;
              }).subscribe((response) => {
                resolve(response.json());
              })
          })
        }
        else {
          return
        }
      })
  }

  // For user_company
  chooseFile_user_company: boolean = false;
  arrayBuffer_user_company: any;
  file_user_company: File;
  user_company_Url: any;
  UserCompany_Model: UserCompany_Model = new UserCompany_Model();
  user_company_data: any[];

  user_company(event: any) {
    this.chooseFile_user_company = true;
    this.file_user_company = event.target.files[0];
  }
  user_company_click() {
    this.user_company_Url = constants.DREAMFACTORY_TABLE_URL + '/user_company?&api_key=' + constants.DREAMFACTORY_API_KEY;
    let fileReader = new FileReader();
    fileReader.onload = () => {
      this.arrayBuffer_user_company = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer_user_company);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      // zero for first sheet
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      // console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));

      this.user_company_data = XLSX.utils.sheet_to_json(worksheet, { raw: true })
      console.log(this.user_company_data)
      console.log(this.user_company_data.length)

      this.user_company_data.forEach(element => {
        this.duplicateCheck_userCompany(element);

      });
    }
    fileReader.readAsArrayBuffer(this.file_user_company);

  }

  //duplicate check for user_contact
  duplicateCheck_userContact(checkData: any) {
    this.apiMng.getApiModel('user_contact', 'filter=USER_GUID=' + checkData.USER_GUID)
      .subscribe(data => {
        let checkDataFromDB = data["resource"];
        if (checkDataFromDB.length == 0) {
          this.UserContact_Model.CONTACT_INFO_GUID = checkData.CONTACT_INFO_GUID;
          this.UserContact_Model.USER_GUID = checkData.USER_GUID;
          this.UserContact_Model.TYPE = checkData.TYPE;
          this.UserContact_Model.CONTACT_NO = checkData.CONTACT_NO;
          this.UserContact_Model.DESCRIPTION = checkData.DESCRIPTION;
          this.UserContact_Model.REMARKS = checkData.REMARKS;

          this.UserContact_Model.CREATION_TS = new Date().toISOString();;
          this.UserContact_Model.CREATION_USER_GUID = 'sva_test';
          this.UserContact_Model.UPDATE_TS = new Date().toISOString();;
          this.UserContact_Model.UPDATE_USER_GUID = 'sva_test';

          var queryHeaders = new Headers();
          queryHeaders.append('Content-Type', 'application/json');
          queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
          let options = new RequestOptions({ headers: queryHeaders });
          return new Promise((resolve) => {
            this.http.post(this.user_contact_Url, this.UserContact_Model.toJson(true), options)
              .map((response) => {
                return response;
              }).subscribe((response) => {
                resolve(response.json());
              })
          })
        }
        else {
          return
        }
      })
  }

  // For user_contact
  chooseFile_user_contact: boolean = false;
  arrayBuffer_user_contact: any;
  file_user_contact: File;
  user_contact_Url: any;
  UserContact_Model: UserContact_Model = new UserContact_Model();
  user_contact_data: any[];

  user_contact(event: any) {
    this.chooseFile_user_contact = true;
    this.file_user_contact = event.target.files[0];
  }
  user_contact_click() {
    this.user_contact_Url = constants.DREAMFACTORY_TABLE_URL + '/user_contact?&api_key=' + constants.DREAMFACTORY_API_KEY;
    let fileReader = new FileReader();
    fileReader.onload = () => {
      this.arrayBuffer_user_contact = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer_user_contact);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      // zero for first sheet
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      // console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));

      this.user_contact_data = XLSX.utils.sheet_to_json(worksheet, { raw: true })
      console.log(this.user_contact_data)
      console.log(this.user_contact_data.length)

      this.user_contact_data.forEach(element => {
        this.duplicateCheck_userContact(element);
      });
    }
    fileReader.readAsArrayBuffer(this.file_user_contact);

  }

  //duplicate check for user_qualification
  duplicateCheck_userQualification(checkData: any) {
    this.apiMng.getApiModel('user_qualification', 'filter=USER_GUID=' + checkData.USER_GUID)
      .subscribe(data => {
        let checkDataFromDB = data["resource"];
        if (checkDataFromDB.length == 0) {
          this.UserQualification_Model.USER_QUALIFICATION_GUID = checkData.USER_QUALIFICATION_GUID;
          this.UserQualification_Model.QUALIFICATION_GUID = checkData.QUALIFICATION_GUID;
          this.UserQualification_Model.USER_GUID = checkData.USER_GUID;
          this.UserQualification_Model.HIGHEST_QUALIFICATION = checkData.HIGHEST_QUALIFICATION;
          this.UserQualification_Model.MAJOR = checkData.MAJOR;
          this.UserQualification_Model.UNIVERSITY = checkData.UNIVERSITY;
          this.UserQualification_Model.YEAR = checkData.YEAR;
          this.UserQualification_Model.ATTACHMENT = checkData.ATTACHMENT;

          this.UserQualification_Model.CREATION_TS = new Date().toISOString();;
          this.UserQualification_Model.CREATION_USER_GUID = 'sva_test';
          this.UserQualification_Model.UPDATE_TS = new Date().toISOString();;
          this.UserQualification_Model.UPDATE_USER_GUID = 'sva_test';

          var queryHeaders = new Headers();
          queryHeaders.append('Content-Type', 'application/json');
          queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
          let options = new RequestOptions({ headers: queryHeaders });
          return new Promise((resolve) => {
            this.http.post(this.user_qualification_Url, this.UserQualification_Model.toJson(true), options)
              .map((response) => {
                return response;
              }).subscribe((response) => {
                resolve(response.json());
              })
          })
        }
        else {
          return
        }
      })
  }

  // For user_qualification
  chooseFile_user_qualification: boolean = false;
  arrayBuffer_user_qualification: any;
  file_user_qualification: File;
  user_qualification_Url: any;
  UserQualification_Model: UserQualification_Model = new UserQualification_Model();
  user_qualification_data: any[];

  user_qualification(event: any) {
    this.chooseFile_user_qualification = true;
    this.file_user_qualification = event.target.files[0];
  }
  user_qualification_click() {
    this.user_qualification_Url = constants.DREAMFACTORY_TABLE_URL + '/user_qualification?&api_key=' + constants.DREAMFACTORY_API_KEY;
    let fileReader = new FileReader();
    fileReader.onload = () => {
      this.arrayBuffer_user_qualification = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer_user_qualification);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      // zero for first sheet
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      // console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));

      this.user_qualification_data = XLSX.utils.sheet_to_json(worksheet, { raw: true })
      console.log(this.user_qualification_data)
      console.log(this.user_qualification_data.length)

      this.user_qualification_data.forEach(element => {
        this.duplicateCheck_userQualification(element);
      });
    }
    fileReader.readAsArrayBuffer(this.file_user_qualification);
  }

  //duplicate check for user_role
  duplicateCheck_userRole(checkData: any) {
    this.apiMng.getApiModel('user_role', 'filter=USER_GUID=' + checkData.USER_GUID)
      .subscribe(data => {
        let checkDataFromDB = data["resource"];
        if (checkDataFromDB.length == 0) {
          this.UserRole_Model.USER_ROLE_GUID = checkData.USER_ROLE_GUID;
          this.UserRole_Model.USER_GUID = checkData.USER_GUID;
          this.UserRole_Model.ROLE_GUID = checkData.ROLE_GUID;
          this.UserRole_Model.ACTIVATION_FLAG = checkData.ACTIVATION_FLAG;

          this.UserRole_Model.CREATION_TS = new Date().toISOString();;
          this.UserRole_Model.CREATION_USER_GUID = 'sva_test';
          this.UserRole_Model.UPDATE_TS = new Date().toISOString();;
          this.UserRole_Model.UPDATE_USER_GUID = 'sva_test';

          var queryHeaders = new Headers();
          queryHeaders.append('Content-Type', 'application/json');
          queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
          let options = new RequestOptions({ headers: queryHeaders });
          return new Promise((resolve) => {
            this.http.post(this.user_role_Url, this.UserRole_Model.toJson(true), options)
              .map((response) => {
                return response;
              }).subscribe((response) => {
                resolve(response.json());
              })
          })
        }
        else {
          return
        }
      })
  }

  // For user_role
  chooseFile_user_role: boolean = false;
  arrayBuffer_user_role: any;
  file_user_role: File;
  user_role_Url: any;
  UserRole_Model: UserRole_Model = new UserRole_Model();
  user_role_data: any[];

  user_role(event: any) {
    this.chooseFile_user_role = true;
    this.file_user_role = event.target.files[0];
  }

  user_role_click() {
    this.user_role_Url = constants.DREAMFACTORY_TABLE_URL + '/user_role?&api_key=' + constants.DREAMFACTORY_API_KEY;
    let fileReader = new FileReader();
    fileReader.onload = () => {
      this.arrayBuffer_user_role = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer_user_role);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      // zero for first sheet
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      // console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));

      this.user_role_data = XLSX.utils.sheet_to_json(worksheet, { raw: true })
      console.log(this.user_role_data)
      console.log(this.user_role_data.length)

      this.user_role_data.forEach(element => {
        this.duplicateCheck_userRole(element);
      });
    }
    fileReader.readAsArrayBuffer(this.file_user_role);
  }

  //  For main_attendance
  chooseFile_main_attendance: boolean = false;
  arrayBuffer_main_attendance: any;
  file_main_attendance: File;
  // main_attendance_Url: any;
  loading: Loading;

  Main_Attendance_Model: Main_Attendance_Model = new Main_Attendance_Model();
  Device_Raw_Data_Model: Device_Raw_Data_Model = new Device_Raw_Data_Model();
  main_attendance_data: any[]; attendance_data: any[];

  main_attendance(event: any) {
    this.chooseFile_main_attendance = true;
    this.file_main_attendance = event.target.files[0];
  }

  attendance_Url: string = "";
  attendance_click() {
    this.attendance_Url = constants.DREAMFACTORY_TABLE_URL + '/device_raw_data?&api_key=' + constants.DREAMFACTORY_API_KEY;
    let fileReader = new FileReader();

    fileReader.onload = () => {
      this.arrayBuffer_main_attendance = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer_main_attendance);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      // zero for first sheet
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      this.attendance_data = XLSX.utils.sheet_to_json(worksheet, { raw: true });

      this.TempArray = this.attendance_data.sort((n1, n2) => n1.UserID - n2.UserID || + new Date(n1.Att_Time) - +new Date(n2.Att_Time));

      this.TempArray.forEach(element => {
        //Check duplicate & insert record to db---------------------------------
        this.duplicateCheck_device_raw_data(element);
        //----------------------------------------------------------------------        
      }); this.Insert_Main_Attendance();
    }
    fileReader.readAsArrayBuffer(this.file_main_attendance);
  }

  duplicateCheck_device_raw_data(checkData: any) {
    this.apiMng.getApiModel('device_raw_data', 'filter=(REF_NO=' + checkData.UserID.trim() + ') AND (DATA_ENTRY_TS=' + checkData.Att_Time + ')')
      .subscribe(data => {
        let checkDataFromDB = data["resource"];
        if (checkDataFromDB.length == 0) {
          this.Device_Raw_Data_Model.RAW_DATA_GUID = UUID.UUID();
          if (checkData.Dev_ID == "1") {
            this.Device_Raw_Data_Model.DEVICE_GUID = localStorage.getItem("Input_Device_GUID");
          }
          else {
            this.Device_Raw_Data_Model.DEVICE_GUID = localStorage.getItem("Output_Device_GUID");;
          }
          this.Device_Raw_Data_Model.REF_NO = checkData.UserID;
          this.Device_Raw_Data_Model.DATA_ENTRY_TS = checkData.Att_Time;
          this.Device_Raw_Data_Model.CREATION_TS = new Date().toISOString();
          this.Device_Raw_Data_Model.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
          this.Device_Raw_Data_Model.UPDATE_TS = new Date().toISOString();
          this.Device_Raw_Data_Model.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");

          var queryHeaders = new Headers();
          queryHeaders.append('Content-Type', 'application/json');
          queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
          let options = new RequestOptions({ headers: queryHeaders });
          return new Promise((resolve) => {
            this.http.post(this.attendance_Url, this.Device_Raw_Data_Model.toJson(true), options)
              .map((response) => {
                return response;
              }).subscribe((response) => {
                if (response.status == 200) {
                }
                resolve(response.json());

                this.fileInputAttendance.nativeElement.value = '';
                this.chooseFile_main_attendance = false;
              })
          })
        }
        else {
          this.fileInputAttendance.nativeElement.value = '';
          this.chooseFile_main_attendance = false;
          // return;
        }
      })
  }

  User_Attendance_Main_Model_List: any[] = [];
  User_Attendance_Main_Model = new User_Attendance_Main_Model();
  Insert_Main_Attendance() {
    console.table(this.TempArray);
    this.User_Attendance_Main_Model_List = [];
    this.TempArray.forEach(element => {
      if (element.Dev_ID == "1") {
        this.User_Attendance_Main_Model_List.push({ "USERID": element.UserID, "DATE": element.Att_Time.substring(0, 10), "INTIME": element.Att_Time, "OUTTIME": null });
      }
      else {
        if (this.User_Attendance_Main_Model_List[this.User_Attendance_Main_Model_List.length - 1]["OUTTIME"] == null) {
          this.User_Attendance_Main_Model_List[this.User_Attendance_Main_Model_List.length - 1]["OUTTIME"] = element.Att_Time;
        }
        else {
          this.User_Attendance_Main_Model_List.push({ "USERID": element.UserID, "DATE": element.Att_Time.substring(0, 10), "INTIME": null, "OUTTIME": element.Att_Time });
        }
      }
    });

    console.log(this.User_Attendance_Main_Model_List);

    this.User_Attendance_Main_Model_List.forEach(element => {
      // let val = this.GetUser_Id(element.USERID);
      this.User_Attendance_Main_Model.USER_ATTENDANCE_GUID = UUID.UUID();
      // val.then((res) => {        
      //   this.User_Attendance_Main_Model.USER_GUID = res.toString();
      this.User_Attendance_Main_Model.USER_GUID = element.USERID;
      this.User_Attendance_Main_Model.ATTENDANCE_DATE = element.DATE;
      this.User_Attendance_Main_Model.IN_TS = element.INTIME;
      this.User_Attendance_Main_Model.OUT_TS = element.OUTTIME;
      this.User_Attendance_Main_Model.WORKING_HOURS = null;
      this.User_Attendance_Main_Model.OVERTIME_FLAG = null;

      this.User_Attendance_Main_Model.CREATION_TS = new Date().toISOString();
      this.User_Attendance_Main_Model.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
      this.User_Attendance_Main_Model.UPDATE_TS = new Date().toISOString();
      this.User_Attendance_Main_Model.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");
      var queryHeaders = new Headers();
      queryHeaders.append('Content-Type', 'application/json');
      queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
      let options = new RequestOptions({ headers: queryHeaders });
      return new Promise((resolve) => {
        this.http.post(this.attendance_main_Url, this.User_Attendance_Main_Model.toJson(true), options)
          .map((response) => {
            return response;
          }).subscribe((response) => {
            resolve(response.json());
          });
      });
    });



  }

  GetUser_Id(STAFF_ID: any) {
    return new Promise((resolve) => {
      this.apiMng.getApiModel('user_main', 'filter=STAFF_ID=' + STAFF_ID)
        .map((response) => {
          return response;
        })
        .subscribe(response => {
          let checkDataFromDB = response["resource"];
          this.t_user = checkDataFromDB[0]["USER_GUID"];

          resolve(this.t_user);
        })
    })
  }

  GetBank_Id(checkData: any) {
    return new Promise((resolve) => {
      this.apiMng.getApiModel('main_bank', 'filter=NAME=' + checkData)
        .map((response) => {
          return response;
        })
        .subscribe(response => {
          let checkDataFromDB = response["resource"];
          console.log(checkDataFromDB);
          this.Info_Template_Model.BANK_GUID = checkDataFromDB[0]["BANK_GUID"];
          console.log(this.Info_Template_Model.BANK_GUID);
          this.t_bank = checkDataFromDB[0]["BANK_GUID"];
          console.log(this.t_bank)
          resolve(this.t_bank);
        })
    })
  }

  GetDesignation_Id(checkData: any) {
    return new Promise((resolve) => {
      this.apiMng.getApiModel('main_designation', 'filter=NAME=' + checkData)
        .map((response) => {
          return response;
        })
        .subscribe(response => {
          let checkDataFromDB = response["resource"];
          console.log(checkDataFromDB);
          this.Info_Template_Model.DESIGNATION_GUID = checkDataFromDB[0]["DESIGNATION_GUID"];
          console.log(this.Info_Template_Model.DESIGNATION_GUID);
          this.t_designation = checkDataFromDB[0]["DESIGNATION_GUID"];
          console.log(this.t_designation)
          resolve(this.t_designation);
        })
    })
  }

  GetDepartment_Id(checkData: any) {
    return new Promise((resolve) => {
      this.apiMng.getApiModel('main_department', 'filter=NAME=' + checkData)
        .map((response) => {
          return response;
        })
        .subscribe(response => {
          let checkDataFromDB = response["resource"];
          console.log(checkDataFromDB);
          this.Info_Template_Model.DEPT_GUID = checkDataFromDB[0]["DEPARTMENT_GUID"];
          console.log(this.Info_Template_Model.DESIGNATION_GUID);
          this.t_department = checkDataFromDB[0]["DEPARTMENT_GUID"];
          console.log(this.t_department)
          resolve(this.t_department);
        })
    })
  }

  GetQualification_Id(checkData: any) {
    return new Promise((resolve) => {
      this.apiMng.getApiModel('main_qualification_type', 'filter=TYPE_NAME=' + checkData)
        .map((response) => {
          return response;
        })
        .subscribe(response => {
          let checkDataFromDB = response["resource"];
          console.log(checkDataFromDB);
          this.Qualification_Template_Model.HIGHEST_QUALIFICATION = checkDataFromDB[0]["QUALIFICATION_TYPE_GUID"];
          console.log(this.Qualification_Template_Model.HIGHEST_QUALIFICATION);
          this.t_qualification = checkDataFromDB[0]["QUALIFICATION_TYPE_GUID"];
          console.log(this.t_qualification)
          resolve(this.t_qualification);
        })
    })
  }

  GetRole_Id(checkData: any) {
    return new Promise((resolve) => {
      this.apiMng.getApiModel('main_role', 'filter=NAME=' + checkData)
        .map((response) => {
          return response;
        })
        .subscribe(response => {
          let checkDataFromDB = response["resource"];
          console.log(checkDataFromDB);
          this.Role_Template_Model.ROLE_GUID = checkDataFromDB[0]["ROLE_GUID"];
          console.log(this.Role_Template_Model.ROLE_GUID);
          this.t_role = checkDataFromDB[0]["ROLE_GUID"];
          console.log(this.t_role)
          resolve(this.t_role);
        })
    })
  }
  //duplicate check for user_main_template
  duplicateCheck_user_main(checkData: any) {
    this.apiMng.getApiModel('user_main', 'filter=EMAIL=' + checkData.EMAIL)
      .subscribe(data => {
        var queryHeaders = new Headers();
        let checkDataFromDB = data["resource"];
        console.log(checkDataFromDB);

        this.Main_Template_Model.TENANT_GUID = localStorage.getItem("g_TENANT_GUID");
        this.Main_Template_Model.STAFF_ID = checkData.STAFF_ID;
        this.Main_Template_Model.LOGIN_ID = checkData.EMAIL;
        this.Main_Template_Model.PASSWORD = checkData.PASSWORD;
        this.Main_Template_Model.EMAIL = checkData.EMAIL;
        this.Main_Template_Model.ACTIVATION_FLAG = checkData.ACTIVATION_FLAG;
        this.Main_Template_Model.IS_TENANT_ADMIN = checkData.IS_TENANT_ADMIN;

        this.Main_Template_Model.CREATION_TS = new Date().toISOString();
        this.Main_Template_Model.CREATION_USER_GUID = 'sva_test';
        this.Main_Template_Model.UPDATE_TS = new Date().toISOString();
        this.Main_Template_Model.UPDATE_USER_GUID = 'sva_test';


        if (checkDataFromDB.length == 0) {
          alert('main inserting record');

          this.Main_Template_Model.USER_GUID = UUID.UUID();
          //  localStorage.setItem('t_USER_GUID',  this.Main_Template_Model.USER_GUID);
          console.log(this.Main_Template_Model);
          console.table(this.Main_Template_Model);
          queryHeaders.append('Content-Type', 'application/json');
          queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
          let options = new RequestOptions({ headers: queryHeaders });
          return new Promise((resolve) => {
            this.http.post(this.user_main_template_Url, this.Main_Template_Model.toJson(true), options)
              .map((response) => {
                return response;
              }).subscribe((response) => {
                if (response.status == 200) {
                  this.duplicateCheck_user_info(checkData);
                }
                resolve(response.json());
              })
          })
        }
        else {

          this.Main_Template_Model.USER_GUID = checkDataFromDB[0]["USER_GUID"];
          alert('main updating record');
          queryHeaders.append('Content-Type', 'application/json');
          queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
          let options = new RequestOptions({ headers: queryHeaders });
          return new Promise((resolve) => {
            this.http.patch(this.user_main_template_Url, this.Main_Template_Model.toJson(true), options)
              .map((response) => {
                return response;
              }).subscribe((response) => {
                if (response.status == 200) {
                  this.duplicateCheck_user_info(checkData);
                }
                resolve(response.json());
              })
          })
          // return
        }
      })
  }


  //duplicate check for user_info_template
  duplicateCheck_user_info(checkData: any) {
    this.apiMng.getApiModel('user_info', 'filter=FULLNAME=' + checkData.FULLNAME)
      .subscribe(data => {
        var queryHeaders = new Headers();
        let checkDataFromDB = data["resource"];
        console.log(checkDataFromDB);
        this.Info_Template_Model.USER_GUID = this.Main_Template_Model.USER_GUID;
        this.Info_Template_Model.FULLNAME = checkData.FULLNAME;
        this.Info_Template_Model.NICKNAME = checkData.NICKNAME;
        this.Info_Template_Model.SALUTATION = checkData.SALUTATION;
        this.Info_Template_Model.MANAGER_USER_GUID = localStorage.getItem("g_USER_GUID");
        this.Info_Template_Model.PERSONAL_ID_TYPE = checkData.PERSONAL_ID_TYPE;
        this.Info_Template_Model.PERSONAL_ID = checkData.PERSONAL_ID;
        this.Info_Template_Model.DOB = checkData.DOB;
        this.Info_Template_Model.GENDER = (checkData.GENDER = "MALE" ? 1 : 0).toString();
        this.Info_Template_Model.JOIN_DATE = checkData.JOIN_DATE;

        this.Info_Template_Model.MARITAL_STATUS = (checkData.MARITAL_STATUS = "SINGLE" ? 0 : 1).toString();
        this.Info_Template_Model.BRANCH = localStorage.getItem("g_TENANT_COMPANY_SITE_GUID");
        this.Info_Template_Model.EMPLOYEE_TYPE = (checkData.EMPLOYEE_TYPE == "PERMANENT" ? 0 : (checkData.EMPLOYEE_TYPE == "CONTRACT" ? 1 : 2)).toString();
        this.Info_Template_Model.APPROVER1 = checkData.APPROVER1;
        this.Info_Template_Model.APPROVER2 = checkData.APPROVER2;
        this.Info_Template_Model.EMPLOYEE_STATUS = (checkData.EMPLOYEE_STATUS == "PROBATION" ? 0 : (checkData.EMPLOYEE_STATUS == "CONFIRMED" ? 1 : 2)).toString();
        this.Info_Template_Model.RESIGNATION_DATE = checkData.RESIGNATION_DATE;
        this.Info_Template_Model.TENANT_COMPANY_GUID = localStorage.getItem("g_USER_GUID");
        this.Info_Template_Model.CONFIRMATION_DATE = checkData.CONFIRMATION_DATE;
        this.Info_Template_Model.TENANT_COMPANY_SITE_GUID = localStorage.getItem("g_USER_GUID");
        this.Info_Template_Model.EMG_CONTACT_NAME_1 = checkData.EMG_CONTACT_NAME_1;
        this.Info_Template_Model.EMG_RELATIONSHIP_1 = checkData.EMG_RELATIONSHIP_1;
        this.Info_Template_Model.EMG_CONTACT_NUMBER_1 = checkData.EMG_CONTACT_NUMBER_1;
        this.Info_Template_Model.EMG_CONTACT_NAME_2 = checkData.EMG_CONTACT_NAME_2;
        this.Info_Template_Model.EMG_RELATIONSHIP_2 = checkData.EMG_RELATIONSHIP_2;
        this.Info_Template_Model.EMG_CONTACT_NUMBER_2 = checkData.EMG_CONTACT_NUMBER_2;
        this.Info_Template_Model.PR_EPF_NUMBER = checkData.PR_EPF_NUMBER;
        this.Info_Template_Model.PR_INCOMETAX_NUMBER = checkData.PR_INCOMETAX_NUMBER;
        this.Info_Template_Model.PR_ACCOUNT_NUMBER = checkData.PR_ACCOUNT_NUMBER;
        this.Info_Template_Model.ATTACHMENT_ID = checkData.ATTACHMENT_ID;

        this.Info_Template_Model.CREATION_TS = new Date().toISOString();
        this.Info_Template_Model.CREATION_USER_GUID = 'sva_test';
        this.Info_Template_Model.UPDATE_TS = new Date().toISOString();
        this.Info_Template_Model.UPDATE_USER_GUID = 'sva_test';

        let val = this.GetBank_Id(checkData.BANK_NAME);
        val.then((res) => {
          this.Info_Template_Model.BANK_GUID = res.toString();
          let val = this.GetDesignation_Id(checkData.DESIGNATION_NAME);
          val.then((res) => {
            this.Info_Template_Model.DESIGNATION_GUID = res.toString();
            let val = this.GetDepartment_Id(checkData.DEPT_NAME);
            val.then((res) => {
              this.Info_Template_Model.DEPT_GUID = res.toString();

              if (checkDataFromDB.length == 0) {
                alert('info inserting record');
                this.Info_Template_Model.USER_INFO_GUID = UUID.UUID();
                queryHeaders.append('Content-Type', 'application/json');
                queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
                let options = new RequestOptions({ headers: queryHeaders });
                return new Promise((resolve) => {
                  this.http.post(this.user_info_template_Url, this.Info_Template_Model.toJson(true), options)
                    .map((response) => {
                      return response;
                    }).subscribe((response) => {
                      if (response.status == 200) {
                        console.log(this.Info_Template_Model);
                        this.duplicateCheck_user_address(checkData);
                      }
                      resolve(response.json());
                    })
                })
              }
              else {
                this.Info_Template_Model.USER_INFO_GUID = checkDataFromDB[0]["USER_INFO_GUID"];
                alert('info updating record');
                queryHeaders.append('Content-Type', 'application/json');
                queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
                let options = new RequestOptions({ headers: queryHeaders });
                return new Promise((resolve) => {
                  this.http.patch(this.user_info_template_Url, this.Info_Template_Model.toJson(true), options)
                    .map((response) => {
                      return response;
                    }).subscribe((response) => {
                      if (response.status == 200) {
                        this.duplicateCheck_user_address(checkData);
                      }
                      resolve(response.json());
                    })
                })
                // return
              }
            })
          });
        });
      });
  }

  //duplicate check for user_address_template
  duplicateCheck_user_address(checkData: any) {
    this.apiMng.getApiModel('user_address', 'filter=USER_ADDRESS1=' + checkData.USER_ADDRESS1)
      .subscribe(data => {
        var queryHeaders = new Headers();
        let checkDataFromDB = data["resource"];
        console.log(checkDataFromDB);

        // this.Address_Template_Model.USER_ADDRESS_GUID = checkData.USER_ADDRESS_GUID;
        this.Address_Template_Model.USER_GUID = this.Main_Template_Model.USER_GUID;
        this.Address_Template_Model.ADDRESS_TYPE = checkData.ADDRESS_TYPE;
        this.Address_Template_Model.USER_ADDRESS1 = checkData.USER_ADDRESS1;
        this.Address_Template_Model.USER_ADDRESS2 = checkData.USER_ADDRESS2;
        this.Address_Template_Model.USER_ADDRESS3 = checkData.USER_ADDRESS3;
        this.Address_Template_Model.POST_CODE = checkData.POST_CODE;
        this.Address_Template_Model.COUNTRY_GUID = checkData.COUNTRY_GUID;
        this.Address_Template_Model.STATE_GUID = checkData.STATE_GUID;

        this.Address_Template_Model.CREATION_TS = new Date().toISOString();;
        this.Address_Template_Model.CREATION_USER_GUID = 'sva_test';
        this.Address_Template_Model.UPDATE_TS = new Date().toISOString();;
        this.Address_Template_Model.UPDATE_USER_GUID = 'sva_test';


        if (checkDataFromDB.length == 0) {
          alert('addtess inserting record');


          this.Address_Template_Model.USER_ADDRESS_GUID = UUID.UUID();
          console.log(this.Address_Template_Model);
          console.table(this.Address_Template_Model);
          queryHeaders.append('Content-Type', 'application/json');
          queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
          let options = new RequestOptions({ headers: queryHeaders });
          return new Promise((resolve) => {
            this.http.post(this.user_address_template_Url, this.Address_Template_Model.toJson(true), options)
              .map((response) => {
                return response;
              }).subscribe((response) => {
                if (response.status == 200) {
                  this.duplicateCheck_user_company(checkData);
                }
                resolve(response.json());
              })
          })
        }
        else {

          this.Address_Template_Model.USER_ADDRESS_GUID = checkDataFromDB[0]["USER_ADDRESS_GUID"];
          alert('address updating record');
          queryHeaders.append('Content-Type', 'application/json');
          queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
          let options = new RequestOptions({ headers: queryHeaders });
          return new Promise((resolve) => {
            this.http.patch(this.user_address_template_Url, this.Address_Template_Model.toJson(true), options)
              .map((response) => {
                return response;
              }).subscribe((response) => {
                if (response.status == 200) {
                  this.duplicateCheck_user_company(checkData);
                }
                resolve(response.json());
              })
          })
          // return
        }
      })
  }

  //duplicate check for user_company_template
  duplicateCheck_user_company(checkData: any) {
    this.apiMng.getApiModel('user_company', 'filter=COMPANY_CONTACT_NO=' + checkData.COMPANY_CONTACT_NO)
      .subscribe(data => {
        var queryHeaders = new Headers();
        let checkDataFromDB = data["resource"];
        console.log(checkDataFromDB);

        // this.Company_Template_Model.USER_COMPANY_GUID = checkData.USER_COMPANY_GUID;
        this.Company_Template_Model.USER_GUID = this.Main_Template_Model.USER_GUID;
        this.Company_Template_Model.TENANT_COMPANY_SITE_GUID = checkData.TENANT_COMPANY_SITE_GUID;
        this.Company_Template_Model.COMPANY_CONTACT_NO = checkData.COMPANY_CONTACT_NO;

        this.Company_Template_Model.CREATION_TS = new Date().toISOString();;
        this.Company_Template_Model.CREATION_USER_GUID = 'sva_test';
        this.Company_Template_Model.UPDATE_TS = new Date().toISOString();;
        this.Company_Template_Model.UPDATE_USER_GUID = 'sva_test';

        if (checkDataFromDB.length == 0) {
          alert('company inserting record');


          this.Company_Template_Model.USER_COMPANY_GUID = UUID.UUID();
          console.log(this.Company_Template_Model);
          console.table(this.Company_Template_Model);
          queryHeaders.append('Content-Type', 'application/json');
          queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
          let options = new RequestOptions({ headers: queryHeaders });
          return new Promise((resolve) => {
            this.http.post(this.user_company_template_Url, this.Company_Template_Model.toJson(true), options)
              .map((response) => {
                return response;
              }).subscribe((response) => {
                if (response.status == 200) {
                  this.duplicateCheck_user_contact(checkData);
                }
                resolve(response.json());
              })
          })
        }
        else {
          this.Company_Template_Model.USER_COMPANY_GUID = checkDataFromDB[0]["USER_COMPANY_GUID"];
          alert('company updating record');
          queryHeaders.append('Content-Type', 'application/json');
          queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
          let options = new RequestOptions({ headers: queryHeaders });
          return new Promise((resolve) => {
            this.http.patch(this.user_company_template_Url, this.Company_Template_Model.toJson(true), options)
              .map((response) => {
                return response;
              }).subscribe((response) => {
                if (response.status == 200) {
                  this.duplicateCheck_user_contact(checkData);
                }
                resolve(response.json());
              })
          })
          // return
        }
      })
  }

  //duplicate check for user_contact_template
  duplicateCheck_user_contact(checkData: any) {
    this.apiMng.getApiModel('user_contact', 'filter=CONTACT_NO=' + checkData.CONTACT_NO)
      .subscribe(data => {
        let checkDataFromDB = data["resource"];
        console.log(checkDataFromDB);

        // this.Contact_Template_Model.CONTACT_INFO_GUID = checkData.CONTACT_INFO_GUID;
        this.Contact_Template_Model.USER_GUID = this.Main_Template_Model.USER_GUID;
        this.Contact_Template_Model.TYPE = checkData.TYPE;
        this.Contact_Template_Model.CONTACT_NO = checkData.CONTACT_NO;
        this.Contact_Template_Model.DESCRIPTION = checkData.DESCRIPTION;
        this.Contact_Template_Model.REMARKS = checkData.REMARKS;

        this.Contact_Template_Model.CREATION_TS = new Date().toISOString();;
        this.Contact_Template_Model.CREATION_USER_GUID = 'sva_test';
        this.Contact_Template_Model.UPDATE_TS = new Date().toISOString();;
        this.Contact_Template_Model.UPDATE_USER_GUID = 'sva_test';

        if (checkDataFromDB.length == 0) {
          alert('contact inserting record');


          this.Contact_Template_Model.CONTACT_INFO_GUID = UUID.UUID();
          console.log(this.Contact_Template_Model);
          console.table(this.Contact_Template_Model);
          var queryHeaders = new Headers();
          queryHeaders.append('Content-Type', 'application/json');
          queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
          let options = new RequestOptions({ headers: queryHeaders });
          return new Promise((resolve) => {
            this.http.post(this.user_contact_template_Url, this.Contact_Template_Model.toJson(true), options)
              .map((response) => {
                return response;
              }).subscribe((response) => {
                if (response.status == 200) {
                  this.duplicateCheck_user_qualification(checkData);
                }
                resolve(response.json());
              })
          })
        }
        else {

          this.Contact_Template_Model.CONTACT_INFO_GUID = checkDataFromDB[0]["CONTACT_INFO_GUID"];
          alert('contact updating record');


          var queryHeaders = new Headers();
          queryHeaders.append('Content-Type', 'application/json');
          queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
          let options = new RequestOptions({ headers: queryHeaders });
          return new Promise((resolve) => {
            this.http.patch(this.user_contact_template_Url, this.Contact_Template_Model.toJson(true), options)
              .map((response) => {
                return response;
              }).subscribe((response) => {
                if (response.status == 200) {
                  this.duplicateCheck_user_qualification(checkData);
                }
                resolve(response.json());
              })
          })
          // return
        }
      })
  }

  //duplicate check for user_qualification_template

  duplicateCheck_user_qualification(checkData: any) {
    this.apiMng.getApiModel('user_qualification', 'filter=MAJOR=' + checkData.MAJOR)
      .subscribe(data => {
        let checkDataFromDB = data["resource"];
        console.log(checkDataFromDB);

        this.Qualification_Template_Model.QUALIFICATION_GUID = checkData.QUALIFICATION_GUID;
        this.Qualification_Template_Model.USER_GUID = this.Main_Template_Model.USER_GUID;
        this.Qualification_Template_Model.MAJOR = checkData.MAJOR;
        this.Qualification_Template_Model.UNIVERSITY = checkData.UNIVERSITY;
        this.Qualification_Template_Model.YEAR = checkData.YEAR;
        this.Qualification_Template_Model.ATTACHMENT = checkData.ATTACHMENT;

        this.Qualification_Template_Model.CREATION_TS = new Date().toISOString();;
        this.Qualification_Template_Model.CREATION_USER_GUID = 'sva_test';
        this.Qualification_Template_Model.UPDATE_TS = new Date().toISOString();;
        this.Qualification_Template_Model.UPDATE_USER_GUID = 'sva_test';

        let val = this.GetQualification_Id(checkData.HIGHEST_QUALIFICATION);
        val.then((res) => {
          this.Qualification_Template_Model.HIGHEST_QUALIFICATION = res.toString();
          console.log(this.t_qualification)
          console.log(this.Qualification_Template_Model.HIGHEST_QUALIFICATION);


          if (checkDataFromDB.length == 0) {
            alert('qualification inserting record');



            this.Qualification_Template_Model.USER_QUALIFICATION_GUID = UUID.UUID();
            console.log(this.Qualification_Template_Model);
            console.table(this.Qualification_Template_Model);
            var queryHeaders = new Headers();
            queryHeaders.append('Content-Type', 'application/json');
            queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
            let options = new RequestOptions({ headers: queryHeaders });
            return new Promise((resolve) => {
              this.http.post(this.user_qualification_template_Url, this.Qualification_Template_Model.toJson(true), options)
                .map((response) => {
                  return response;
                }).subscribe((response) => {
                  if (response.status == 200) {
                    this.duplicateCheck_user_role(checkData);
                  }
                  resolve(response.json());
                })
            })
          }
          else {


            this.Qualification_Template_Model.USER_QUALIFICATION_GUID = checkDataFromDB[0]["USER_QUALIFICATION_GUID"];
            alert('qualificationupdating  record');


            var queryHeaders = new Headers();
            queryHeaders.append('Content-Type', 'application/json');
            queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
            let options = new RequestOptions({ headers: queryHeaders });
            return new Promise((resolve) => {
              this.http.patch(this.user_qualification_template_Url, this.Qualification_Template_Model.toJson(true), options)
                .map((response) => {
                  return response;
                }).subscribe((response) => {
                  if (response.status == 200) {
                    this.duplicateCheck_user_role(checkData);
                  }
                  resolve(response.json());
                })
            })
            // return
          }
        })
      })
  }

  //duplicate check for user_role_template
  duplicateCheck_user_role(checkData: any) {
    this.apiMng.getApiModel('user_role', 'filter=USER_GUID=' + checkData.USER_GUID)
      .subscribe(data => {
        let checkDataFromDB = data["resource"];
        console.log(checkDataFromDB);

        // this.Role_Template_Model.USER_ROLE_GUID = checkData.USER_ROLE_GUID;
        this.Role_Template_Model.USER_GUID = this.Main_Template_Model.USER_GUID;
        this.Role_Template_Model.ROLE_GUID = checkData.ROLE_GUID;
        this.Role_Template_Model.ACTIVATION_FLAG = checkData.ACTIVATION_FLAG;

        this.Role_Template_Model.CREATION_TS = new Date().toISOString();
        this.Role_Template_Model.CREATION_USER_GUID = 'sva_test';
        this.Role_Template_Model.UPDATE_TS = new Date().toISOString();
        this.Role_Template_Model.UPDATE_USER_GUID = 'sva_test';

        let val = this.GetRole_Id(checkData.NAME);
        val.then((res) => {
          this.Role_Template_Model.ROLE_GUID = res.toString();
          console.log(this.t_role)
          console.log(this.Role_Template_Model.ROLE_GUID);


          if (checkDataFromDB.length == 0) {
            alert('role inserting record');



            this.Role_Template_Model.USER_ROLE_GUID = UUID.UUID();
            console.log(this.Role_Template_Model);
            console.table(this.Role_Template_Model);
            var queryHeaders = new Headers();
            queryHeaders.append('Content-Type', 'application/json');
            queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
            let options = new RequestOptions({ headers: queryHeaders });
            return new Promise((resolve) => {
              this.http.post(this.user_role_template_Url, this.Role_Template_Model.toJson(true), options)
                .map((response) => {
                  return response;
                }).subscribe((response) => {
                  resolve(response.json());
                })
            })
          }
          else {

            this.Role_Template_Model.USER_ROLE_GUID = checkDataFromDB[0]["USER_ROLE_GUID"];
            alert('role updating record');


            var queryHeaders = new Headers();
            queryHeaders.append('Content-Type', 'application/json');
            queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
            let options = new RequestOptions({ headers: queryHeaders });
            return new Promise((resolve) => {
              this.http.patch(this.user_role_template_Url, this.Role_Template_Model.toJson(true), options)
                .map((response) => {
                  return response;
                }).subscribe((response) => {
                  resolve(response.json());
                })
            })
            // return
          }
        })
      })
  }

  // For user_role
  chooseFile_user_template: boolean = false;
  arrayBuffer_user_template: any;
  file_user_template: File;
  user_main_template_Url: any;
  user_info_template_Url: any;
  user_address_template_Url: any;
  user_company_template_Url: any;
  user_contact_template_Url: any;
  user_qualification_template_Url: any;
  user_role_template_Url: any;

  Main_Template_Model: UserMain_Model = new UserMain_Model();
  Info_Template_Model: UserInfo_Model = new UserInfo_Model();
  Address_Template_Model: UserAddress_Model = new UserAddress_Model();
  Company_Template_Model: UserCompany_Model = new UserCompany_Model();
  Contact_Template_Model: UserContact_Model = new UserContact_Model();
  Qualification_Template_Model: UserQualification_Model = new UserQualification_Model();
  Role_Template_Model: UserRole_Model = new UserRole_Model();
  user_template_data: any[];

  user_templa(event: any) {
    this.chooseFile_user_template = true;
    this.file_user_template = event.target.files[0];
  }

  user_template_click() {
    this.user_main_template_Url = constants.DREAMFACTORY_TABLE_URL + '/user_main?&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.user_info_template_Url = constants.DREAMFACTORY_TABLE_URL + '/user_info?&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.user_address_template_Url = constants.DREAMFACTORY_TABLE_URL + '/user_address?&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.user_company_template_Url = constants.DREAMFACTORY_TABLE_URL + '/user_company?&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.user_contact_template_Url = constants.DREAMFACTORY_TABLE_URL + '/user_contact?&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.user_qualification_template_Url = constants.DREAMFACTORY_TABLE_URL + '/user_qualification?&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.user_role_template_Url = constants.DREAMFACTORY_TABLE_URL + '/user_role?&api_key=' + constants.DREAMFACTORY_API_KEY;

    let fileReader = new FileReader();
    fileReader.onload = () => {
      this.arrayBuffer_user_template = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer_user_template);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      // var workbook = XLSX.read(bstr, { type: "binary" });
      var workbook = XLSX.read(bstr, { type: "binary", cellDates: true, cellNF: false, cellText: false });
      // zero for first sheet
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      // console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));

      this.user_template_data = XLSX.utils.sheet_to_json(worksheet, { raw: true })
      console.log(this.user_template_data)
      console.log(this.user_template_data.length)

      this.user_template_data.forEach(element => {
        if (element.STAFF_ID != "*")
          this.duplicateCheck_user_main(element);
      });
    }
    fileReader.readAsArrayBuffer(this.file_user_template);
    // localStorage.removeItem("t_USER_GUID");
  }

  // User_template end
  // -------------------

  //Customer_template start

  chooseFile_customer_template: boolean = false;
  arrayBuffer_customer_template: any;
  file_customer_template: File;
  customer_template_Url: any;
  customer_location_template_Url: any;
  // project_template_Url: any;
  // soc_template_Url: any;

  Customer_Template_Model: SocCustomer_Model = new SocCustomer_Model();
  CustomerLocation_Template_Model: SocCustomerLocation_Model = new SocCustomerLocation_Model();
  customer_template_data: any[];

  customer_templa(event: any) {
    this.chooseFile_customer_template = true;
    this.file_customer_template = event.target.files[0];
  }

  customer_template_click() {
    this.customer_template_Url = constants.DREAMFACTORY_TABLE_URL + '/main_customer?&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.customer_location_template_Url = constants.DREAMFACTORY_TABLE_URL + '/main_customer_location?&api_key=' + constants.DREAMFACTORY_API_KEY;

    let fileReader = new FileReader();
    fileReader.onload = () => {
      this.arrayBuffer_customer_template = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer_customer_template);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      // zero for first sheet
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      // console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));

      this.customer_template_data = XLSX.utils.sheet_to_json(worksheet, { raw: true })
      console.log(this.customer_template_data)
      console.log(this.customer_template_data.length)

      this.customer_template_data.forEach(element => {
        if (element.CustomerName != "*")
          this.duplicateCheck_customer(element);
      });
    }
    fileReader.readAsArrayBuffer(this.file_customer_template);
  }

  // SOC end
  // -------------------

  //code for inserting data into customer start
  checkData: any
  duplicateCheck_customer(checkData: any) {
    this.apiMng.getApiModel('main_customer', 'filter=CUSTOMER_GUID=' + checkData.CUSTOMER_GUID)
      .subscribe(data => {
        let checkDataFromDB = data["resource"];
        this.Customer_Template_Model.TENANT_GUID = localStorage.getItem("g_TENANT_GUID");
        this.Customer_Template_Model.NAME = checkData.CustomerName;
        this.Customer_Template_Model.DESCRIPTION = checkData.DESCRIPTION;
        this.Customer_Template_Model.CREATION_TS = new Date().toISOString();;
        this.Customer_Template_Model.CREATION_USER_GUID = 'sva_test';
        this.Customer_Template_Model.UPDATE_TS = new Date().toISOString();;
        this.Customer_Template_Model.UPDATE_USER_GUID = 'sva_test';

        if (checkDataFromDB.length == 0) {

          this.Customer_Template_Model.CUSTOMER_GUID = UUID.UUID();
          var queryHeaders = new Headers();
          queryHeaders.append('Content-Type', 'application/json');
          queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
          let options = new RequestOptions({ headers: queryHeaders });
          return new Promise((resolve) => {
            this.http.post(this.customer_template_Url, this.Customer_Template_Model.toJson(true), options)
              .map((response) => {
                return response;
              }).subscribe((response) => {
                if (response.status == 200) {
                  this.duplicateCheck_customer_location(checkData);
                }
                resolve(response.json());
              })
          })
        }
        else {

          this.Customer_Template_Model.CUSTOMER_GUID = checkDataFromDB[0]["CUSTOMER_GUID"];

          var queryHeaders = new Headers();
          queryHeaders.append('Content-Type', 'application/json');
          queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
          let options = new RequestOptions({ headers: queryHeaders });
          return new Promise((resolve) => {
            this.http.patch(this.customer_template_Url, this.Customer_Template_Model.toJson(true), options)
              .map((response) => {
                return response;
              }).subscribe((response) => {
                resolve(response.json());
              })
          })
          // return
        }
      })
  }
  //code for inserting data into customer end

  //code for inserting data into customer location start

  duplicateCheck_customer_location(checkData: any) {
    this.apiMng.getApiModel('main_customer_location', 'filter=CUSTOMER_LOCATION_GUID=' + checkData.CUSTOMER_LOCATION_GUID)
      .subscribe(data => {
        let checkDataFromDB = data["resource"];
        this.CustomerLocation_Template_Model.CUSTOMER_GUID = this.Customer_Template_Model.CUSTOMER_GUID;
        this.CustomerLocation_Template_Model.NAME = 'NA';
        this.CustomerLocation_Template_Model.DESCRIPTION = checkData.DESCRIPTION;
        this.CustomerLocation_Template_Model.REGISTRATION_NO = checkData.REGISTRATION_NO;
        this.CustomerLocation_Template_Model.ADDRESS1 = checkData.ADDRESS1;
        this.CustomerLocation_Template_Model.ADDRESS2 = checkData.ADDRESS2;
        this.CustomerLocation_Template_Model.ADDRESS3 = checkData.ADDRESS3;
        this.CustomerLocation_Template_Model.CONTACT_PERSON = checkData.CONTACT_PERSON;
        this.CustomerLocation_Template_Model.CONTACT_PERSON_MOBILE_NO = checkData.CONTACT_PERSON_MOBILE_NO;
        this.CustomerLocation_Template_Model.CONTACT_NO1 = checkData.CONTACT_NO1;
        this.CustomerLocation_Template_Model.CONTACT_NO2 = checkData.CONTACT_NO2;
        this.CustomerLocation_Template_Model.EMAIL = checkData.EMAIL;
        this.CustomerLocation_Template_Model.DIVISION = checkData.DIVISION;
        this.CustomerLocation_Template_Model.CREATION_TS = new Date().toISOString();;
        this.CustomerLocation_Template_Model.CREATION_USER_GUID = 'sva_test';
        this.CustomerLocation_Template_Model.UPDATE_TS = new Date().toISOString();;
        this.CustomerLocation_Template_Model.UPDATE_USER_GUID = 'sva_test';

        if (checkDataFromDB.length == 0) {

          this.CustomerLocation_Template_Model.CUSTOMER_LOCATION_GUID = UUID.UUID();
          console.log(this.CustomerLocation_Template_Model);
          console.table(this.CustomerLocation_Template_Model);
          var queryHeaders = new Headers();
          queryHeaders.append('Content-Type', 'application/json');
          queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
          let options = new RequestOptions({ headers: queryHeaders });
          return new Promise((resolve) => {
            this.http.post(this.customer_location_template_Url, this.CustomerLocation_Template_Model.toJson(true), options)
              .map((response) => {
                return response;
              }).subscribe((response) => {
                resolve(response.json());
              })
          })
        }
        else {

          this.CustomerLocation_Template_Model.CUSTOMER_LOCATION_GUID = checkDataFromDB[0]["CUSTOMER_LOCATION_GUID"];

          var queryHeaders = new Headers();
          queryHeaders.append('Content-Type', 'application/json');
          queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
          let options = new RequestOptions({ headers: queryHeaders });
          return new Promise((resolve) => {
            this.http.patch(this.customer_location_template_Url, this.CustomerLocation_Template_Model.toJson(true), options)
              .map((response) => {
                return response;
              }).subscribe((response) => {
                resolve(response.json());
              })
          })
          // return
        }
      })
  }
  //code for inserting data into customer location end



  //Customer_template end


  // For SOC template start
  chooseFile_soc_template: boolean = false;
  arrayBuffer_soc_template: any;
  file_soc_template: File;
  project_template_Url: any;
  soc_template_Url: any;


  Project_Template_Model: SocProject_Model = new SocProject_Model();
  SOC_Template_Model: SocMain_Model = new SocMain_Model();
  soc_template_data: any[];

  soc_templa(event: any) {
    this.chooseFile_soc_template = true;
    this.file_soc_template = event.target.files[0];
  }

  soc_template_click() {
    this.project_template_Url = constants.DREAMFACTORY_TABLE_URL + '/main_project?&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.soc_template_Url = constants.DREAMFACTORY_TABLE_URL + '/soc_main?&api_key=' + constants.DREAMFACTORY_API_KEY;

    let fileReader = new FileReader();
    fileReader.onload = () => {
      this.arrayBuffer_soc_template = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer_soc_template);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      // zero for first sheet
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      this.soc_template_data = XLSX.utils.sheet_to_json(worksheet, { raw: true })
      console.log(this.soc_template_data)
      console.log(this.soc_template_data.length)

      this.soc_template_data.forEach(element => {
        if (element.SOC_NO != "*")
          this.duplicateCheck_project(element);

      });
    }
    fileReader.readAsArrayBuffer(this.file_soc_template);

  }

  duplicateCheck_project(checkData: any) {
    this.apiMng.getApiModel('main_project', 'filter=PROJECT_GUID=' + checkData.PROJECT_GUID)
      .subscribe(data => {
        let checkDataFromDB = data["resource"];
        console.log(checkDataFromDB);
        this.Project_Template_Model.NAME = checkData.ProjectName;
        this.Project_Template_Model.CUSTOMER_GUID = 'NA';
        this.Project_Template_Model.CUSTOMER_LOCATION_GUID = 'NA';
        this.Project_Template_Model.TENANT_GUID = localStorage.getItem("g_TENANT_GUID");
        this.Project_Template_Model.ACTIVATION_FLAG = '1';
        this.Project_Template_Model.CREATION_TS = new Date().toISOString();;
        this.Project_Template_Model.CREATION_USER_GUID = 'sva_test';
        this.Project_Template_Model.UPDATE_TS = new Date().toISOString();;
        this.Project_Template_Model.UPDATE_USER_GUID = 'sva_test';

        if (checkDataFromDB.length == 0) {

          this.Project_Template_Model.PROJECT_GUID = UUID.UUID();
          console.log(this.Project_Template_Model);
          console.table(this.Project_Template_Model);
          var queryHeaders = new Headers();
          queryHeaders.append('Content-Type', 'application/json');
          queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
          let options = new RequestOptions({ headers: queryHeaders });
          return new Promise((resolve) => {
            this.http.post(this.project_template_Url, this.Project_Template_Model.toJson(true), options)
              .map((response) => {
                return response;
              }).subscribe((response) => {
                if (response.status == 200) {
                  this.duplicateCheck_soc(checkData);
                }
                resolve(response.json());
              })
          })
        }
        else {

          this.Project_Template_Model.PROJECT_GUID = checkDataFromDB[0]["PROJECT_GUID"];

          var queryHeaders = new Headers();
          queryHeaders.append('Content-Type', 'application/json');
          queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
          let options = new RequestOptions({ headers: queryHeaders });
          return new Promise((resolve) => {
            this.http.patch(this.project_template_Url, this.Project_Template_Model.toJson(true), options)
              .map((response) => {
                return response;
              }).subscribe((response) => {
                resolve(response.json());
              })
          })
          // return
        }

      })
  }
  //code for inserting data into project end

  //code for inserting data into soc start

  duplicateCheck_soc(checkData: any) {
    console.table(checkData);
    console.log(checkData);
    this.apiMng.getApiModel('soc_main', 'filter=SOC_GUID=' + checkData.SOC_GUID)
      .subscribe(data => {
        let checkDataFromDB = data["resource"];
        console.log(checkDataFromDB);
        // this.SOC_Template_Model.SOC_GUID = checkData.SOC_GUID;
        this.SOC_Template_Model.SOC_NO = checkData.SOC_NO;
        // this.SOC_Template_Model.PROJECT_GUID =  localStorage.getItem("t_PROJECT_GUID");
        this.SOC_Template_Model.PROJECT_GUID = this.Project_Template_Model.PROJECT_GUID;
        this.SOC_Template_Model.TENANT_GUID = localStorage.getItem("g_TENANT_GUID");
        this.SOC_Template_Model.ACTIVATION_FLAG = checkData.ACTIVATION_FLAG;

        this.SOC_Template_Model.CREATION_TS = new Date().toISOString();;
        this.SOC_Template_Model.CREATION_USER_GUID = 'sva_test';
        this.SOC_Template_Model.UPDATE_TS = new Date().toISOString();;
        this.SOC_Template_Model.UPDATE_USER_GUID = 'sva_test';

        if (checkDataFromDB.length == 0) {

          this.SOC_Template_Model.SOC_GUID = UUID.UUID();
          console.log(this.SOC_Template_Model);
          console.table(this.SOC_Template_Model);
          var queryHeaders = new Headers();
          queryHeaders.append('Content-Type', 'application/json');
          queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
          let options = new RequestOptions({ headers: queryHeaders });
          return new Promise((resolve) => {
            this.http.post(this.soc_template_Url, this.SOC_Template_Model.toJson(true), options)
              .map((response) => {
                return response;
              }).subscribe((response) => {
                resolve(response.json());
              })
          })
        }
        else {

          this.SOC_Template_Model.SOC_GUID = checkDataFromDB[0]["SOC_GUID"];

          var queryHeaders = new Headers();
          queryHeaders.append('Content-Type', 'application/json');
          queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
          let options = new RequestOptions({ headers: queryHeaders });
          return new Promise((resolve) => {
            this.http.patch(this.soc_template_Url, this.SOC_Template_Model.toJson(true), options)
              .map((response) => {
                return response;
              }).subscribe((response) => {
                resolve(response.json());
              })
          })
          // return
        }
      })
  }
  //code for inserting data into soc end



  Templates_ngModel: any;
  download_file_name: string = "";

  /**
   * TO FIX
   *
   * @returns {Observable<Blob>}
   * @memberof ImportExcelDataPage
   */
  downloadFile_service_user(): Observable<Blob> {
    const url = 'http://api.zen.com.my/api/v2/azurefs/Templates/user_template.xlsx' + this.download_file_name + '?api_key=' + constants.DREAMFACTORY_API_KEY;
    let options = new RequestOptions({ responseType: ResponseContentType.Blob });
    console.log(url)
    return this.http.get(sanitizeURL(url), options)
      .map(res => res.blob())
  }

  download_user() {
    this.downloadFile_service_user().subscribe(blob => {
      importedSaveAs(blob, this.download_file_name);
    })
  }

  /**
   * TO FIX
   *
   * @returns {Observable<Blob>}
   * @memberof ImportExcelDataPage
   */
  downloadFile_service_soc(): Observable<Blob> {
    const url = 'http://api.zen.com.my/api/v2/azurefs/Templates/SOC.xlsx?api_key=' + constants.DREAMFACTORY_API_KEY;
    let options = new RequestOptions({ responseType: ResponseContentType.Blob });
    console.log(url)
    return this.http.get(sanitizeURL(url), options)
      .map(res => res.blob())
  }

  download_soc(soc: any) {
    this.downloadFile_service_soc().subscribe(blob => {
      importedSaveAs(blob, soc);
    })
  }

  /**
   * TO FIX
   *
   * @returns {Observable<Blob>}
   * @memberof ImportExcelDataPage
   */
  downloadFile_service_customer(): Observable<Blob> {
    const url = 'http://api.zen.com.my/api/v2/azurefs/Templates/Customer.xlsx' + this.download_file_name + '?api_key=' + constants.DREAMFACTORY_API_KEY;
    let options = new RequestOptions({ responseType: ResponseContentType.Blob });
    console.log(url)
    return this.http.get(sanitizeURL(url), options)
      .map(res => res.blob())
  }

  download_customer(customer: any) {
    this.downloadFile_service_customer().subscribe(blob => {
      importedSaveAs(blob, customer);
    })
  }

  devices: any;
  Get_Device_GUID() {
    let url = constants.DREAMFACTORY_TABLE_URL + "/main_device?filter=(TENANT_GUID=" + localStorage.getItem("g_TENANT_GUID") + ') AND (ACTIVATION_FLAG=0)' + '&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http
      .get(url)
      .map(res => res.json())
      .subscribe(data => {
        this.devices = data["resource"];
        for (var item in data["resource"]) {
          if (data["resource"][item]["ROLE"] == 1) { localStorage.setItem("Input_Device_GUID", data["resource"][item]["DEVICE_GUID"]); }
          if (data["resource"][item]["ROLE"] == 2) { localStorage.setItem("Output_Device_GUID", data["resource"][item]["DEVICE_GUID"]); }
        }
      });
  }

  TempArray: any[] = []; AttendanceArray: any[] = [];

  attendance_main_Url: string = constants.DREAMFACTORY_TABLE_URL + '/user_attendance_main?&api_key=' + constants.DREAMFACTORY_API_KEY;
  InsertAttRecord() {
    console.log(this.User_Attendance_Main_Model_List);
    this.apiMng.getApiModel('user_attendance_main', 'filter=(USER_GUID=' + this.User_Attendance_Main_Model.USER_GUID.trim() + ') AND (ATTENDANCE_DATE=' + this.User_Attendance_Main_Model.ATTENDANCE_DATE + ') AND (IN_TS=' + this.User_Attendance_Main_Model.IN_TS + ') AND (OUT_TS=' + this.User_Attendance_Main_Model.OUT_TS + ')')
      .subscribe(data => {
        let checkDataFromDB = data["resource"];
        if (checkDataFromDB.length == 0) {
          var queryHeaders = new Headers();
          queryHeaders.append('Content-Type', 'application/json');
          queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
          let options = new RequestOptions({ headers: queryHeaders });
          return new Promise((resolve) => {
            this.http.post(this.attendance_main_Url, this.User_Attendance_Main_Model.toJson(true), options)
              .map((response) => {
                return response;
              }).subscribe((response) => {
                resolve(response.json());
              });
          });
        }
        else {
          this.User_Attendance_Main_Model.USER_ATTENDANCE_GUID = checkDataFromDB[0]["USER_ATTENDANCE_GUID"];
          var queryHeaders = new Headers();
          queryHeaders.append('Content-Type', 'application/json');
          queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
          let options = new RequestOptions({ headers: queryHeaders });
          return new Promise((resolve) => {
            this.http.patch(this.attendance_main_Url, this.User_Attendance_Main_Model.toJson(true), options)
              .map((response) => {
                return response;
              }).subscribe((response) => {
                resolve(response.json());
              })
          })
        }

      });
  }

  //  For main_attendance
  chooseFile_main_leave: boolean = false;
  arrayBuffer_main_leave: any;
  file_main_leave: File;

  Leave_Raw_Data_Model: Leave_Raw_Data_Model = new Leave_Raw_Data_Model();
  main_leave_data: any[];

  main_leave(event: any) {
    this.chooseFile_main_leave = true;
    this.file_main_leave = event.target.files[0];
  }

  Final_leave_data: any[] = []; leave_Url: string = ""; ctr: any = 0;
  LeaveUpload_click() {
    this.ctr = 0;
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
    });
    this.loading.present();

    this.leave_Url = constants.DREAMFACTORY_TABLE_URL + '/user_leave_raw_data?&api_key=' + constants.DREAMFACTORY_API_KEY;
    let fileReader = new FileReader();

    fileReader.onload = () => {
      this.arrayBuffer_main_leave = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer_main_leave);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      // var workbook = XLSX.read(bstr, { type: "binary" });
      var workbook = XLSX.read(bstr, { type: "binary", cellDates: true, cellNF: false, cellText: false });
      // zero for first sheet
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      this.main_leave_data = XLSX.utils.sheet_to_json(worksheet, { raw: true });

      this.Final_leave_data = this.main_leave_data.filter((thing: any, index: any, self: any) =>
        index === self.findIndex((t: any) => (
          t.LEAVE_ID === thing.LEAVE_ID
        ))
      )
      this.Final_leave_data.forEach(element => {
        //Check duplicate & insert record to db---------------------------------
        this.duplicateCheck_leave_raw_data(element);
        //----------------------------------------------------------------------
      });
    }
    fileReader.readAsArrayBuffer(this.file_main_leave);
  }

  duplicateCheck_leave_raw_data(checkData: any) {
    this.ctr = this.ctr + 1;
    this.apiMng.getApiModel('user_leave_raw_data', 'filter=LEAVE_ID=' + checkData.LEAVE_ID)
      .subscribe(data => {
        let checkDataFromDB = data["resource"];
        if (checkDataFromDB.length == 0) {
          if (checkData.TITLE.substring(0, 14) != "PUBLIC HOLIDAY") {
            this.Leave_Raw_Data_Model.STAFF_ID = checkData.STAFF_ID;
            this.Leave_Raw_Data_Model.TITLE = checkData.TITLE;
            this.Leave_Raw_Data_Model.START_DATE = moment(checkData.START_DATE).format('YYYY-MM-DD');
            this.Leave_Raw_Data_Model.END_DATE = moment(checkData.END_DATE).format('YYYY-MM-DD');
            this.Leave_Raw_Data_Model.LEAVE_ID = checkData.LEAVE_ID;
            this.Leave_Raw_Data_Model.HALF_DAY_DATE = checkData.HALF_DAY_DATE;
            this.Leave_Raw_Data_Model.SESSION = checkData.SESSION;

            this.Leave_Raw_Data_Model.CREATION_TS = new Date().toISOString();
            this.Leave_Raw_Data_Model.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
            this.Leave_Raw_Data_Model.UPDATE_TS = new Date().toISOString();
            this.Leave_Raw_Data_Model.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");

            var queryHeaders = new Headers();
            queryHeaders.append('Content-Type', 'application/json');
            queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
            let options = new RequestOptions({ headers: queryHeaders });
            return new Promise((resolve) => {
              this.http.post(this.leave_Url, this.Leave_Raw_Data_Model.toJson(true), options)
                .map((response) => {
                  return response;
                }).subscribe((response) => {
                  resolve(response.json());

                  this.fileInputLeave.nativeElement.value = '';
                  this.chooseFile_main_leave = false;
                })
            })
          }
        }
        else {
          this.fileInputLeave.nativeElement.value = '';
          this.chooseFile_main_attendance = false;
          return;
        }
      })
    if (this.Final_leave_data.length == this.ctr) {
      this.fileInputLeave.nativeElement.value = '';
      this.chooseFile_main_attendance = false;
      this.loading.dismissAll();
      return;
    }
  }
}
