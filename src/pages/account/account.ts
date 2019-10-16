import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { UserData } from '../../providers/user-data';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { TitleCasePipe } from '@angular/common';
import { Transfer } from '@ionic-native/transfer';
import { LoadingController, ActionSheetController, Platform, Loading, ToastController } from 'ionic-angular';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Http, Headers, RequestOptions } from '@angular/http';
import * as constants from '../../app/config/constants';
import { UserInfo_Model } from '../../models/usersetup_info_model';
import { UserMain_Model } from '../../models/user_main_model';
import { UserContact_Model } from '../../models/user_contact_model';
import { UserCompany_Model } from '../../models/user_company_model';
import { UserAddress_Model } from '../../models/usersetup_address_model';
import { UserQualification_Model } from '../../models/user_qualification_model';
import { UserCertification_Model } from '../../models/user_certification_model';
import { UserSpouse_Model } from '../../models/user_spouse_model';
import { UserChildren_Model } from '../../models/user_children_model';
import { UserSetup_Service } from '../../services/usersetup_service';
import { BaseHttpService } from '../../services/base-http';

import { UserRole_Model } from '../../models/user_role_model'
import { UUID } from 'angular2-uuid';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html', providers: [UserSetup_Service, BaseHttpService, FileTransfer, Transfer, TitleCasePipe]
})
export class AccountPage {
  username: string; username_display: string;
  Userform: FormGroup;

  //--------------PERSONAL_DETAILS-----------------------
  public User_Name_Edit_ngModel: any;
  public User_StaffID_Edit_ngModel: any;
  public User_Email_Edit_ngModel: any;
  public User_ICNo_Edit_ngModel: any;
  public User_LoginId_Edit_ngModel: any;
  public User_Password_Edit_ngModel: any;
  public User_PersonalNo_Edit_ngModel: any;
  public User_DOB_Edit_ngModel: any;
  public User_CompanyNo_Edit_ngModel: any;
  public User_Gender_Edit_ngModel: any;
  public User_Marital_Edit_ngModel: any;

  //------------EMPLOYMENT_DETAILS---------------------------
  public User_Company_Edit_ngModel: any;
  public User_Branch_Edit_ngModel: any;
  public User_Designation_Edit_ngModel: any;
  public User_Department_Edit_ngModel: any;
  public User_JoinDate_Edit_ngModel: any;
  public User_ConfirmationDate_Edit_ngModel: any;
  public User_ResignationDate_Edit_ngModel: any;
  public User_EmployeeType_Edit_ngModel: any;
  public User_Employment_Edit_ngModel: any;
  public User_Approver1_Edit_ngModel: any;

  //-------------EDUCATIONAL_QUALIFICATION--------------------
  public User_HighestQualification_Edit_ngModel: any;
  public User_University_Edit_ngModel: any;
  public User_Major_Edit_ngModel: any;
  public User_EduYear_Edit_ngModel: any;

  //--------------PROFESSIONAL_CERTIFICATIONS-------------------
  public User_Certification_Edit_ngModel: any;
  public User_CertificationGrade_Edit_ngModel: any;
  public User_CertificationYear_Edit_ngModel: any;
  public User_CertificationAttachment_Edit_ngModel: any;
  public attachment_ref: any;

  //-------------RESIDENTIAL_ADDRESS----------------------------
  public User_Address1_Edit_ngModel: any;
  public User_PostCode_Edit_ngModel: any;
  public User_Address2_Edit_ngModel: any;
  public User_Country_Edit_ngModel: any;
  public User_Address3_Edit_ngModel: any;
  public User_State_Edit_ngModel: any;

  //-------------FAMILY_DETAILS---------------------------------
  public User_Spouse_Name_Edit_ngModel: any;
  public User_Spouse_IcNumber_Edit_ngModel: any;

  public User_Child_Name_Edit_ngModel: any;
  public User_Child_IcNumber_Edit_ngModel: any;
  public User_Child_Gender_Edit_ngModel: any;
  public User_SpouseChild_Edit_ngModel: any;

  //-------------EMERGENCY_CONTACT_DETAILS-------------------------
  public User_EMG_CONTACT_NAME1_Edit_ngModel: any;
  public User_EMG_CONTACT_NAME2_Edit_ngModel: any;
  public User_EMG_RELATIONSHIP_Edit_ngModel: any;
  public User_EMG_RELATIONSHIP2_Edit_ngModel: any;
  public User_EMG_CONTACT_NO1_Edit_ngModel: any;
  public User_EMG_CONTACT_NO2_Edit_ngModel: any;

  //---------------PAYROLL_DETAILS----------------------------------
  public User_EPF_NUMBER_Edit_ngModel: any;
  public User_BANK_NAME_Edit_ngModel: any;
  public User_INCOMETAX_NO_Edit_ngModel: any;
  public User_ACCOUNT_NUMBER_Edit_ngModel: any;

  //----------------ROLE DETAILS-------------------------------------
  public ROLE_ngModel_Edit: any; ADDITIONAL_ROLE_ngModel_Edit: any;

  // constructor(public alertCtrl: AlertController, public nav: NavController, public userData: UserData, fb: FormBuilder) {
  constructor(private alertCtrl: AlertController, public nav: NavController, public userData: UserData, fb: FormBuilder, public viewCtrl: ViewController, public navParams: NavParams, public http: Http, private userservice: UserSetup_Service, public actionSheetCtrl: ActionSheetController, private loadingCtrl: LoadingController, public toastCtrl: ToastController, public platform: Platform, private titlecasePipe: TitleCasePipe) {
    if (localStorage.getItem("g_USER_GUID") != null) {
      //---------Bind Company---------------------
      this.GetCompany("tenant_company", "NAME");

      //---------Bind Country---------------------
      this.BindCountry("main_country", "NAME");

      //--------Bind Qualification----------------
      this.BindQualification("main_qualification_type", "TYPE_NAME");

      //--------Bind Role--------------------------
      this.BindRole();

      //Display Controls----------------------------
      this.Edit_Personaldetails(localStorage.getItem("g_USER_GUID"));

      this.Userform = fb.group({
        // -------------------PERSONAL DETAILS--------------------
        avatar: null,
        avatar1: null,
        avatar2: null,
        avatar3: null,

        NAME: [null],
        EMAIL: [null],
        LOGIN_ID: [null],
        PASSWORD: [null],
        CONTACT_NO: [null],
        COMPANY_CONTACT_NO: [null],
        MARITAL_STATUS: ['', Validators.required],
        PERSONAL_ID_TYPE: [null],
        PERSONAL_ID: [null],
        DOB: [null],
        GENDER: [null],

        // -------------------EMPLOYMENT DETAILS--------------------
        DESIGNATION_GUID: [null],
        TENANT_COMPANY_GUID: [null],
        DEPT_GUID: [null],
        JOIN_DATE: [null],
        CONFIRMATION_DATE: [null],
        RESIGNATION_DATE: [],
        BRANCH: [null],
        EMPLOYEE_TYPE: [null],
        APPROVER1: [null],
        EMPLOYEE_STATUS: [null],

        // -------------------EDUCATIONAL QUALIFICATION--------------------
        HIGHEST_QUALIFICATION: [null],
        UNIVERSITY: [null],
        MAJOR: [null],
        EDU_YEAR: [null],

        // -------------------PROFESSIONAL CERTIFICATIONS--------------------
        CERTIFICATION: [null],
        CERTIFICATION_YEAR: [null],
        CERTIFICATION_GRADE: [null],
        ATTACHMENT_PROFESSIONAL: [null],

        // -------------------RESIDENTIAL ADDRESS----------------------------
        USER_ADDRESS1: [null],
        USER_ADDRESS2: [null],
        USER_ADDRESS3: [null],
        USER_POSTCODE: [null],
        USER_COUNTRY: [null],
        USER_STATE: [null],

        // -------------------FAMILY DETAILS----------------------------------
        //--------For Spouse----------
        SPOUSENAME: [null],
        SPOUSE_ICNUMBER: [null],
        //--------For Child----------
        CHILDNAME: [null],
        CHILD_ICNUMBER: [null],
        CHILD_GENDER: [null],
        SPOUSE_CHILD: [null],

        // -------------------EMERGENCY CONTACT DETAILS------------------------
        EMG_CONTACT_NAME1: [null],
        EMG_RELATIONSHIP: [null],
        EMG_CONTACT_NO1: [null, Validators.compose([Validators.pattern('^[0-9!@#%$&()-`.+,/\"\\s]+$')])],
        EMG_CONTACT_NAME2: [null],
        EMG_RELATIONSHIP2: [null],
        EMG_CONTACT_NO2: [null],

        // -------------------PAYROLL DETAILS------------------------
        EPF_NUMBER: [null],
        INCOMETAX_NO: [null],
        BANK_NAME: [null],
        ACCOUNT_NUMBER: [null],

        //-------------------ROLE DETAILS---------------------------
        ROLE_NAME: [null],
        ADDITIONAL_ROLE_NAME: [null],
      });

      this.username_display = localStorage.getItem("g_FULLNAME");
    }
    else {
      this.nav.push(LoginPage);
    }
  }

  // ngAfterViewInit() {
  //   this.getUsername();
  // }

  // updatePicture() {
  //   console.log('Clicked to update picture');
  // }

  // Present an alert with the current username populated
  // clicking OK will update the username and display it
  // clicking Cancel will close the alert and do nothing
  // changeUsername() {
  //   let alert = this.alertCtrl.create({
  //     title: 'Change Username',
  //     buttons: [
  //       'Cancel'
  //     ]
  //   });
  //   alert.addInput({
  //     name: 'username',
  //     value: this.username,
  //     placeholder: 'username'
  //   });
  //   alert.addButton({
  //     text: 'Ok',
  //     handler: (data: any) => {
  //       this.userData.setUsername(data.username);
  //       this.getUsername();
  //     }
  //   });

  //   alert.present();
  // }

  // getUsername() {
  //   this.userData.getUsername().then((username) => {
  //     this.username = username;
  //   });
  // }

  // changePassword() {
  //   console.log('Clicked to change password');
  // }

  // logout() {
  //   this.userData.logout();
  //   this.nav.setRoot('LoginPage');
  // }

  loading: Loading;
  USER_GUID_FOR_UPDATE: any; view_user_details: any;

  baseResourceUrl2_URL: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + "/api/v2/zcs/_table/user_address?filter=(USER_GUID=" + localStorage.getItem("g_USER_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;

  MaritalStatusMarried: boolean = false;

  USER_INFO_GUID_FOR_UPDATE: any;
  USER_GUID_FOR_COMPANY_CONTACT: any;
  USER_GUID_FOR_CONTACT: any;
  USER_QUALIFICATION_GUID_FOR_UPDATE: any;
  USER_GUID_FOR_ADDRESS: any;

  public ProfessionalCertification: any[] = [];
  public FamilyDetails: any[] = [];
  public ChildrenDetails: any[] = [];

  public Profile_Image_Display: any;

  public Edit_Personaldetails(id: any) {
    this.ClearControls();

    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();

    this.USER_GUID_FOR_UPDATE = id;

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    let url_user_edit = this.baseResourceUrl2_URL + "view_user_edit?filter=(USER_GUID=" + id + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    let url_user_Professional_Certification = this.baseResourceUrl2_URL + "user_certification?filter=(USER_GUID=" + id + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    let url_user_Spouse = this.baseResourceUrl2_URL + "user_spouse?filter=(USER_GUID=" + id + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    let url_user_Children = this.baseResourceUrl2_URL + "user_children?filter=(USER_GUID=" + id + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    // debugger;
    //----------------Get the Details from Db and bind Controls---------------------------------
    this.http.get(url_user_edit, options)
      .map(res => res.json())
      .subscribe(
        data => {
          this.view_user_details = data["resource"];

          //------------------------PERSONAL DETAILS----------------------------------
          this.User_Name_Edit_ngModel = this.titlecasePipe.transform(this.view_user_details[0]["FULLNAME"]);
          this.User_Email_Edit_ngModel = this.view_user_details[0]["EMAIL"];
          this.User_LoginId_Edit_ngModel = this.view_user_details[0]["LOGIN_ID"];
          this.User_Password_Edit_ngModel = this.view_user_details[0]["PASSWORD"];
          this.User_PersonalNo_Edit_ngModel = this.view_user_details[0]["CONTACT_NO"];
          this.User_CompanyNo_Edit_ngModel = this.view_user_details[0]["COMPANY_CONTACT_NO"];
          this.User_Marital_Edit_ngModel = this.view_user_details[0]["MARITAL_STATUS"];
          if (this.view_user_details[0]["MARITAL_STATUS"] == "1") {
            this.MaritalStatusMarried = true;
          }
          else {
            this.MaritalStatusMarried = false;
          }
          this.User_StaffID_Edit_ngModel = this.view_user_details[0]["PERSONAL_ID_TYPE"];
          this.User_ICNo_Edit_ngModel = this.view_user_details[0]["PERSONAL_ID"];
          this.User_DOB_Edit_ngModel = this.view_user_details[0]["DOB"];
          this.User_Gender_Edit_ngModel = this.view_user_details[0]["GENDER"];

          if (this.view_user_details[0]["ATTACHMENT_ID"] == null || this.view_user_details[0]["ATTACHMENT_ID"] == '') {
            this.Profile_Image_Display = "assets/img/profile_no_preview.png";
          }
          else {
            this.Profile_Image_Display = constants.DREAMFACTORY_IMAGE_URL + this.view_user_details[0]["ATTACHMENT_ID"] + "?api_key=" + constants.DREAMFACTORY_API_KEY;
          }

          //------------------------EMPLOYMENT DETAILS----------------------------------
          this.USER_INFO_GUID_FOR_UPDATE = this.view_user_details[0]["USER_INFO_GUID"];

          this.USER_GUID_FOR_COMPANY_CONTACT = this.view_user_details[0]["USER_COMPANY_GUID"];
          this.USER_GUID_FOR_CONTACT = this.view_user_details[0]["CONTACT_INFO_GUID"];

          this.User_Company_Edit_ngModel = this.view_user_details[0]["COMPANY_GUID"]; this.GetBranch("tenant_company_site", this.User_Company_Edit_ngModel, "SITE_NAME");

          this.GetDesignation('main_designation', 'NAME');
          this.GetDepartment('main_department', 'NAME');
          this.BindBank('main_bank', 'NAME');
          this.BindApprover1("view_get_tenant_admin");
          this.BindRole();

          if (this.view_user_details[0]["DESIGNATION_GUID"] != null) {
            this.User_Designation_Edit_ngModel = this.view_user_details[0]["DESIGNATION_GUID"];
          }
          if (this.view_user_details[0]["DEPT_GUID"] != null) {
            this.User_Department_Edit_ngModel = this.view_user_details[0]["DEPT_GUID"];
          }

          this.User_JoinDate_Edit_ngModel = this.view_user_details[0]["JOIN_DATE"];
          this.User_ConfirmationDate_Edit_ngModel = this.view_user_details[0]["CONFIRMATION_DATE"];
          this.User_ResignationDate_Edit_ngModel = this.view_user_details[0]["RESIGNATION_DATE"];
          this.User_Branch_Edit_ngModel = this.view_user_details[0]["BRANCH"];
          this.User_EmployeeType_Edit_ngModel = this.view_user_details[0]["EMPLOYEE_TYPE"];

          if (this.view_user_details[0]["MANAGER_USER_GUID"] != null) {
            this.User_Approver1_Edit_ngModel = this.view_user_details[0]["MANAGER_USER_GUID"];
          }

          this.User_Employment_Edit_ngModel = this.view_user_details[0]["EMPLOYEE_STATUS"];

          //------------------------EDUCATIONAL QUALIFICATION----------------------------
          this.USER_QUALIFICATION_GUID_FOR_UPDATE = this.view_user_details[0]["USER_QUALIFICATION_GUID"];
          this.User_HighestQualification_Edit_ngModel = this.view_user_details[0]["QUALIFICATION_GUID"];
          this.User_University_Edit_ngModel = this.titlecasePipe.transform(this.view_user_details[0]["UNIVERSITY"]);
          this.User_Major_Edit_ngModel = this.titlecasePipe.transform(this.view_user_details[0]["MAJOR"]);
          this.User_EduYear_Edit_ngModel = this.view_user_details[0]["YEAR"];

          //------------------------RESIDENTIAL ADDRESS----------------------------------
          this.USER_GUID_FOR_ADDRESS = this.view_user_details[0]["USER_ADDRESS_GUID"];
          this.User_Address1_Edit_ngModel = this.titlecasePipe.transform(this.view_user_details[0]["USER_ADDRESS1"]);
          this.User_Address2_Edit_ngModel = this.titlecasePipe.transform(this.view_user_details[0]["USER_ADDRESS2"]);
          this.User_Address3_Edit_ngModel = this.titlecasePipe.transform(this.view_user_details[0]["USER_ADDRESS3"]);
          this.User_PostCode_Edit_ngModel = this.view_user_details[0]["POST_CODE"];
          this.User_Country_Edit_ngModel = this.view_user_details[0]["COUNTRY_GUID"]; this.BindState('main_state', this.User_Country_Edit_ngModel, 'NAME');
          this.User_State_Edit_ngModel = this.view_user_details[0]["STATE_GUID"];

          //------------------------EMERGENCY CONTACT DETAILS---------------------------
          this.User_EMG_CONTACT_NAME1_Edit_ngModel = this.titlecasePipe.transform(this.view_user_details[0]["EMG_CONTACT_NAME_1"]);
          this.User_EMG_RELATIONSHIP_Edit_ngModel = this.titlecasePipe.transform(this.view_user_details[0]["EMG_RELATIONSHIP_1"]);
          this.User_EMG_CONTACT_NO1_Edit_ngModel = this.view_user_details[0]["EMG_CONTACT_NUMBER_1"];
          this.User_EMG_CONTACT_NAME2_Edit_ngModel = this.titlecasePipe.transform(this.view_user_details[0]["EMG_CONTACT_NAME_2"]);
          this.User_EMG_RELATIONSHIP2_Edit_ngModel = this.titlecasePipe.transform(this.view_user_details[0]["EMG_RELATIONSHIP_2"]);
          this.User_EMG_CONTACT_NO2_Edit_ngModel = this.view_user_details[0]["EMG_CONTACT_NUMBER_2"];

          //------------------------PAYROLL CONTACT DETAILS-----------------------------
          this.User_EPF_NUMBER_Edit_ngModel = this.view_user_details[0]["PR_EPF_NUMBER"];
          this.User_INCOMETAX_NO_Edit_ngModel = this.view_user_details[0]["PR_INCOMETAX_NUMBER"];

          // if (this.view_user_details[0]["BANK_GUID"] != null) {
          this.User_BANK_NAME_Edit_ngModel = this.view_user_details[0]["BANK_GUID"];
          // }

          this.User_ACCOUNT_NUMBER_Edit_ngModel = this.view_user_details[0]["PR_ACCOUNT_NUMBER"];

          this.loading.dismissAll();
        });

    //------------------------PROFESSIONAL CERTIFICATIONS--------------------------
    this.http.get(url_user_Professional_Certification, options)
      .map(res => res.json())
      .subscribe(
        data => {
          for (var item in data["resource"]) {
            this.ProfessionalCertification.push({ CERTIFICATE_GUID: data["resource"][item]["certificate_guid"], NAME: data["resource"][item]["name"], GRADE: data["resource"][item]["grade"], YEAR: data["resource"][item]["passing_year"], ATTACHMENT: data["resource"][item]["attachment"] });
          }
        });

    //------------------------FAMILY DETAILS---------------------------------------
    //------------------------SPOUSE--------------------------        
    this.http.get(url_user_Spouse, options)
      .map(res => res.json())
      .subscribe(
        data => {
          for (var item in data["resource"]) {
            this.FamilyDetails.push({ SPOUSE_GUID: data["resource"][item]["SPOUSE_GUID"], NAME: data["resource"][item]["NAME"], ICNO: data["resource"][item]["ICNO"] });
          }
        });

    //------------------------CHILDREN------------------------        
    this.http.get(url_user_Children, options)
      .map(res => res.json())
      .subscribe(
        data => {
          for (var item in data["resource"]) {
            this.ChildrenDetails.push({ CHILD_GUID: data["resource"][item]["CHILD_GUID"], NAME: data["resource"][item]["NAME"], ICNO: data["resource"][item]["ICNO"], GENDER: data["resource"][item]["GENDER"], SPOUSE: data["resource"][item]["SPOUSE"] });
          }
        });

    //------------------------Profile Image------------------------
    // this.http.get(url_user_Image, options)
    //   .map(res => res.json())
    //   .subscribe(
    //     data => {
    //       if (data["resource"].length <= 0) {
    //         this.Profile_Image_Display = "assets/img/profile_no_preview.png";
    //       }
    //       else {
    //         this.Profile_Image_Display = constants.DREAMFACTORY_INSTANCE_URL + "/api/v2/azurefs/" + data["resource"][0]["IMAGE_URL"] + "?api_key=" + constants.DREAMFACTORY_API_KEY;
    //       }
    //     });

    //------------------------Role-------------------------------
    let CheckRole: any = []; let CheckAdditionalRole: any = [];
    let User_Role_url = this.baseResourceUrl2_URL + "user_role?filter=(USER_GUID=" + id + ')&api_key=' + constants.DREAMFACTORY_API_KEY;

    this.http
      .get(User_Role_url)
      .map(res => res.json())
      .subscribe(data => {
        this.roles = data.resource;
        for (var itemA in this.roles) {
          if (this.roles[itemA]["ROLE_FLAG"] == "MAIN") {
            CheckRole.push(this.roles[itemA]["ROLE_GUID"]); localStorage.setItem("Main_Role_Guid_Temp", this.roles[itemA]["ROLE_GUID"]);
          }
          else {
            CheckAdditionalRole.push(this.roles[itemA]["ROLE_GUID"]);
          }
        }
        this.ROLE_ngModel_Edit = CheckRole;
        this.ADDITIONAL_ROLE_ngModel_Edit = CheckAdditionalRole;
      });
  }
  Key_Param: string = 'api_key=' + constants.DREAMFACTORY_API_KEY;
  tenants: any;

  GetTenant_GUID(Tenant_company_guid: string) {
    // debugger;
    let TableURL = constants.DREAMFACTORY_TABLE_URL + "tenant_company" + '?filter=(TENANT_COMPANY_GUID=' + Tenant_company_guid + ')&' + this.Key_Param;
    return new Promise((resolve) => {
      this.http
        .get(TableURL)
        .map(res => res.json())
        .subscribe(data => {
          this.tenants = data["resource"];
          resolve(this.tenants[0].TENANT_GUID);
        });
    });
  }

  designations: any;
  GetDesignation(TableName: string, SortField: string) {
    let TableURL: string; let TempUser_Company_ngModel: any;
    TempUser_Company_ngModel = this.view_user_details[0]["COMPANY_GUID"];

    let val = this.GetTenant_GUID(TempUser_Company_ngModel);
    val.then((res) => {
      TableURL = constants.DREAMFACTORY_TABLE_URL + TableName + '?filter=(TENANT_GUID=' + res.toString() + ')&order=' + SortField + '&' + this.Key_Param;

      this.http
        .get(TableURL)
        .map(res => res.json())
        .subscribe(data => {
          this.designations = data["resource"];
        });
    });
    val.catch((err) => {
      // This is never called
      console.log(err);
    });
  }

  companies: any;
  GetCompany(TableName: string, SortField: string) {
    let TableURL: string;
    if (localStorage.getItem("g_USER_GUID") == "sva") {
      TableURL = constants.DREAMFACTORY_TABLE_URL + TableName + '?order=' + SortField + '&' + this.Key_Param;
    }
    else {
      TableURL = constants.DREAMFACTORY_TABLE_URL + TableName + '?filter=(TENANT_GUID=' + localStorage.getItem("g_TENANT_GUID") + ')&' + 'order=' + SortField + '&' + this.Key_Param;
    }
    this.http
      .get(TableURL)
      .map(res => res.json())
      .subscribe(data => {
        this.companies = data["resource"];
      });
  }

  departments: any
  GetDepartment(TableName: string, SortField: string) {
    let TableURL: string;
    let TempUser_Company_ngModel: any;
    TempUser_Company_ngModel = this.view_user_details[0]["COMPANY_GUID"];

    let val = this.GetTenant_GUID(TempUser_Company_ngModel);
    val.then((res) => {
      TableURL = constants.DREAMFACTORY_TABLE_URL + TableName + '?filter=(TENANT_GUID=' + res.toString() + ')&order=' + SortField + '&' + this.Key_Param;

      this.http
        .get(TableURL)
        .map(res => res.json())
        .subscribe(data => {
          this.departments = data["resource"];
        });
    });
    val.catch((err) => {
      // This is never called
      console.log(err);
    });
  }

  branches: any;
  GetBranch(TableName: string, FilterField: String, SortField: string) {
    // debugger;
    let TableURL: string;
    if (this.User_Company_Edit_ngModel != undefined) {
      TableURL = constants.DREAMFACTORY_TABLE_URL + TableName + '?filter=(TENANT_COMPANY_GUID=' + FilterField + ')&' + 'order=' + SortField + '&' + this.Key_Param;
    }

    this.http
      .get(TableURL)
      .map(res => res.json())
      .subscribe(data => {
        this.branches = data["resource"];
      });
  }

  countries: any;
  BindCountry(TableName: string, SortField: string) {
    let TableURL: string;
    TableURL = constants.DREAMFACTORY_TABLE_URL + TableName + '?order=' + SortField + '&' + this.Key_Param;

    this.http
      .get(TableURL)
      .map(res => res.json())
      .subscribe(data => {
        this.countries = data["resource"];
      });
  }

  states: any;
  BindState(TableName: string, FilterField: string, SortField: string) {
    let TableURL: string;
    TableURL = constants.DREAMFACTORY_TABLE_URL + TableName + '?filter=(COUNTRY_GUID=' + FilterField + ')&' + 'order=' + SortField + '&' + this.Key_Param;

    this.http
      .get(TableURL)
      .map(res => res.json())
      .subscribe(data => {
        this.states = data["resource"];
      });
  }

  banks: any;
  BindBank(TableName: string, SortField: string) {
    let TableURL: string;
    let TempUser_Company_ngModel: any;
    TempUser_Company_ngModel = this.view_user_details[0]["COMPANY_GUID"];

    let val = this.GetTenant_GUID(TempUser_Company_ngModel);
    val.then((res) => {
      TableURL = constants.DREAMFACTORY_TABLE_URL + TableName + '?filter=(TENANT_GUID=' + res.toString() + ')&order=' + SortField + '&' + this.Key_Param;

      this.http
        .get(TableURL)
        .map(res => res.json())
        .subscribe(data => {
          this.banks = data["resource"];
        });
    });
    val.catch((err) => {
      // This is never called
      console.log(err);
    });
  }

  qualifications: any;
  BindQualification(TableName: string, SortField: string) {
    let TableURL: string;
    TableURL = constants.DREAMFACTORY_TABLE_URL + TableName + '?order=' + SortField + '&' + this.Key_Param;
    this.http
      .get(TableURL)
      .map(res => res.json())
      .subscribe(data => {
        this.qualifications = data["resource"];
      });
  }

  approvers: any;
  BindApprover1(ViewName: string) {
    let TableURL_Approver: string; let TempUser_Company_ngModel: any;
    TempUser_Company_ngModel = this.view_user_details[0]["COMPANY_GUID"];

    let val = this.GetTenant_GUID(TempUser_Company_ngModel);
    val.then((res) => {
      if (localStorage.getItem("g_USER_GUID") == "sva" || localStorage.getItem("g_IS_TENANT_ADMIN") == "1") {
        TableURL_Approver = constants.DREAMFACTORY_TABLE_URL + ViewName + '?filter=(TENANT_GUID=' + res.toString() + ')&' + this.Key_Param;
      }
      else {
        TableURL_Approver = constants.DREAMFACTORY_TABLE_URL + ViewName + '?filter=(TENANT_GUID=' + res.toString() + ')AND(USER_GUID!=' + this.view_user_details[0]["USER_GUID"] + ')&' + this.Key_Param;
      }

      this.http
        .get(TableURL_Approver)
        .map(res => res.json())
        .subscribe(data => {
          this.approvers = data["resource"];
        });
    });
    val.catch((err) => {
      // This is never called
      console.log(err);
    });
  }

  roles: any
  BindRole() {
    let roleUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_role' + '?order=NAME&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http
      .get(roleUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.roles = data["resource"];
      });
  }

  DisplayFamily_Edit() {
    if (this.User_Marital_Edit_ngModel == "1" || this.User_Marital_Edit_ngModel == "2") {
      this.MaritalStatusMarried = true;
    }
    else {
      this.MaritalStatusMarried = false;
    }
  }

  CertificateSaveFlag: boolean = false;
  AddProfessionalCertificationForEdit() {
    if (this.User_Certification_Edit_ngModel != undefined && this.User_Certification_Edit_ngModel.trim() != "") {
      if (this.User_CertificationGrade_Edit_ngModel != undefined && this.User_CertificationGrade_Edit_ngModel.trim() != "") {
        if (this.User_CertificationYear_Edit_ngModel.toString() != undefined && this.User_CertificationYear_Edit_ngModel.toString().trim() != "") {

          if (this.CertificateSaveFlag == false) {
            this.ProfessionalCertification.push({ CERTIFICATE_GUID: UUID.UUID(), NAME: this.titlecasePipe.transform(this.User_Certification_Edit_ngModel.trim()), GRADE: this.User_CertificationGrade_Edit_ngModel.trim(), YEAR: this.User_CertificationYear_Edit_ngModel.trim(), ATTACHMENT_EDIT: this.attachment_ref });
          }
          else {
            this.ProfessionalCertification = this.ProfessionalCertification.filter(item => item.CERTIFICATE_GUID != localStorage.getItem("CERTIFICATE_GUID"));
            this.ProfessionalCertification.push({ CERTIFICATE_GUID: localStorage.getItem("CERTIFICATE_GUID"), NAME: this.titlecasePipe.transform(this.User_Certification_Edit_ngModel.trim()), GRADE: this.User_CertificationGrade_Edit_ngModel.trim(), YEAR: this.User_CertificationYear_Edit_ngModel.toString().trim(), ATTACHMENT_EDIT: this.attachment_ref });

            this.CertificateSaveFlag = false;
            localStorage.removeItem("SPOUSE_GUID");
          }

          //Clear the Controls------------------------
          this.User_Certification_Edit_ngModel = "";
          this.User_CertificationGrade_Edit_ngModel = "";
          this.User_CertificationYear_Edit_ngModel = "";
          this.User_CertificationAttachment_Edit_ngModel = "";
        }
        else {
          alert("Fill in Year.");
        }
      }
      else {
        alert("Fill in Grade.");
      }
    }
    else {
      alert("Fill in Certificate Name.");
    }
  }

  EditProfessionalCertificationForEdit(CERTIFICATE_GUID: string) {
    for (var item in this.ProfessionalCertification) {
      if (this.ProfessionalCertification[item]["CERTIFICATE_GUID"] == CERTIFICATE_GUID) {
        this.User_Certification_Edit_ngModel = this.ProfessionalCertification[item]["NAME"];
        this.User_CertificationGrade_Edit_ngModel = this.ProfessionalCertification[item]["GRADE"];
        this.User_CertificationYear_Edit_ngModel = this.ProfessionalCertification[item]["YEAR"];

        localStorage.setItem("CERTIFICATE_GUID", this.ProfessionalCertification[item]["CERTIFICATE_GUID"]);

        this.CertificateSaveFlag = true;
        return;
      }
    }
  }

  RemoveProfessionalCertification(CERTIFICATE_GUID: string) {
    if (this.CertificateSaveFlag == false) {
      this.ProfessionalCertification = this.ProfessionalCertification.filter(item => item.CERTIFICATE_GUID != CERTIFICATE_GUID);
    }
    else {
      alert('Sorry.You are in Edit Mode.');
    }
  }

  SpouseSaveFlag: boolean = false;
  AddFamilyDetailsForEdit() {
    if (this.User_Spouse_Name_Edit_ngModel != undefined && this.User_Spouse_Name_Edit_ngModel.trim() != "") {
      if (this.User_Spouse_IcNumber_Edit_ngModel != undefined && this.User_Spouse_IcNumber_Edit_ngModel.trim() != "") {
        if (this.SpouseSaveFlag == false) {
          this.FamilyDetails.push({ SPOUSE_GUID: UUID.UUID(), NAME: this.titlecasePipe.transform(this.User_Spouse_Name_Edit_ngModel.trim()), ICNO: this.User_Spouse_IcNumber_Edit_ngModel.trim() });
        }
        else {
          this.FamilyDetails = this.FamilyDetails.filter(item => item.SPOUSE_GUID != localStorage.getItem("SPOUSE_GUID"));
          this.FamilyDetails.push({ SPOUSE_GUID: localStorage.getItem("SPOUSE_GUID"), NAME: this.titlecasePipe.transform(this.User_Spouse_Name_Edit_ngModel.trim()), ICNO: this.User_Spouse_IcNumber_Edit_ngModel.trim() });
          this.SpouseSaveFlag = false;
          localStorage.removeItem("SPOUSE_GUID");
        }
        this.User_Spouse_Name_Edit_ngModel = "";
        this.User_Spouse_IcNumber_Edit_ngModel = "";
      }
      else {
        alert("Fill in IC Number.");
      }
    }
    else {
      alert("Fill in Spouse Name.");
    }
  }

  EditFamilyDetailsForEdit(SPOUSE_GUID: string) {
    for (var item in this.FamilyDetails) {
      if (this.FamilyDetails[item]["SPOUSE_GUID"] == SPOUSE_GUID) {
        this.User_Spouse_Name_Edit_ngModel = this.FamilyDetails[item]["NAME"];
        this.User_Spouse_IcNumber_Edit_ngModel = this.FamilyDetails[item]["ICNO"];
        localStorage.setItem("SPOUSE_GUID", this.FamilyDetails[item]["SPOUSE_GUID"]);

        this.SpouseSaveFlag = true;
        return;
      }
    }
  }

  RemoveFamilyDetails(SPOUSE_GUID: string) {
    if (this.SpouseSaveFlag == false) {
      this.FamilyDetails = this.FamilyDetails.filter(item => item.SPOUSE_GUID != SPOUSE_GUID);
      this.SpouseSaveFlag = false;
    }
    else {
      alert("Sorry. You are in Edit Mode.");
    }

  }

  public ChildSaveFlag: boolean = false;
  AddChildrenForEdit() {
    if (this.User_Child_Name_Edit_ngModel != undefined && this.User_Child_Name_Edit_ngModel.trim() != "") {
      if (this.User_Child_IcNumber_Edit_ngModel != undefined && this.User_Child_IcNumber_Edit_ngModel.trim() != "") {
        if (this.User_Child_Gender_Edit_ngModel != undefined && this.User_Child_Gender_Edit_ngModel != "") {
          if (this.User_SpouseChild_Edit_ngModel != undefined && this.User_SpouseChild_Edit_ngModel != "") {
            if (this.ChildSaveFlag == false) {
              this.ChildrenDetails.push({ CHILD_GUID: UUID.UUID(), NAME: this.titlecasePipe.transform(this.User_Child_Name_Edit_ngModel.trim()), ICNO: this.User_Child_IcNumber_Edit_ngModel.trim(), GENDER: this.User_Child_Gender_Edit_ngModel.trim(), SPOUSE: this.User_SpouseChild_Edit_ngModel.trim() });
            }
            else {
              this.ChildrenDetails = this.ChildrenDetails.filter(item => item.CHILD_GUID != localStorage.getItem("CHILD_GUID"));
              this.ChildrenDetails.push({ CHILD_GUID: localStorage.getItem("CHILD_GUID"), NAME: this.titlecasePipe.transform(this.User_Child_Name_Edit_ngModel.trim()), ICNO: this.User_Child_IcNumber_Edit_ngModel.trim(), GENDER: this.User_Child_Gender_Edit_ngModel.trim(), SPOUSE: this.User_SpouseChild_Edit_ngModel.trim() });

              this.ChildSaveFlag = false;
              localStorage.removeItem("CHILD_GUID");
            }
            //------Clear Controls ----------------
            this.User_Child_Name_Edit_ngModel = "";
            this.User_Child_IcNumber_Edit_ngModel = "";
            this.User_Child_Gender_Edit_ngModel = "";
            this.User_SpouseChild_Edit_ngModel = "";
          }
          else {
            alert("Select Spouse.");
          }
        }
        else {
          alert("Select Gender.");
        }
      }
      else {
        alert("Fill in Child IC Number.")
      }
    }
    else {
      alert("Fill in Child Name.");
    }
  }

  EditChildrenForEdit(CHILD_GUID: string) {
    for (var item in this.ChildrenDetails) {
      if (this.ChildrenDetails[item]["CHILD_GUID"] == CHILD_GUID) {
        this.User_Child_Name_Edit_ngModel = this.ChildrenDetails[item]["NAME"];
        this.User_Child_IcNumber_Edit_ngModel = this.ChildrenDetails[item]["ICNO"];
        this.User_Child_Gender_Edit_ngModel = this.ChildrenDetails[item]["GENDER"];
        this.User_SpouseChild_Edit_ngModel = this.ChildrenDetails[item]["SPOUSE"];

        localStorage.setItem("CHILD_GUID", this.ChildrenDetails[item]["CHILD_GUID"]);

        this.ChildSaveFlag = true;
        return;
      }
    }
  }

  RemoveChildren(CHILD_GUID: string) {
    if (this.ChildSaveFlag == false) {
      this.ChildrenDetails = this.ChildrenDetails.filter(item => item.CHILD_GUID != CHILD_GUID);
      this.ChildSaveFlag = false;
    }
    else {
      alert('Sorry.You are in Edit Mode.');
    }
  }

  ClearControls() {
    this.User_Name_Edit_ngModel = "";
    this.User_Email_Edit_ngModel = "";
    this.User_LoginId_Edit_ngModel = "";
    this.User_Password_Edit_ngModel = "";
    this.User_PersonalNo_Edit_ngModel = "";
    this.User_CompanyNo_Edit_ngModel = "";
    this.User_Marital_Edit_ngModel = "";
    this.User_StaffID_Edit_ngModel = "";
    this.User_ICNo_Edit_ngModel = "";
    this.User_DOB_Edit_ngModel = "";
    this.User_Gender_Edit_ngModel = "";

    this.User_Designation_Edit_ngModel = "";
    this.User_Company_Edit_ngModel = "";
    this.User_Department_Edit_ngModel = "";
    this.User_JoinDate_Edit_ngModel = "";
    this.User_ConfirmationDate_Edit_ngModel = "";
    this.User_ResignationDate_Edit_ngModel = "";
    this.User_Branch_Edit_ngModel = "";

    this.User_EmployeeType_Edit_ngModel = "";
    this.User_Employment_Edit_ngModel = "";

    this.User_HighestQualification_Edit_ngModel = "";
    this.User_University_Edit_ngModel = "";
    this.User_Major_Edit_ngModel = "";
    this.User_EduYear_Edit_ngModel = "";

    this.User_Certification_Edit_ngModel = "";
    this.User_CertificationYear_Edit_ngModel = "";
    this.User_CertificationGrade_Edit_ngModel = "";

    this.User_Address1_Edit_ngModel = "";
    this.User_Address2_Edit_ngModel = "";
    this.User_Address3_Edit_ngModel = "";
    this.User_PostCode_Edit_ngModel = "";
    this.User_Country_Edit_ngModel = "";
    this.User_State_Edit_ngModel = "";

    this.User_Spouse_Name_Edit_ngModel = "";
    this.User_Spouse_IcNumber_Edit_ngModel = "";

    this.User_Child_Name_Edit_ngModel = "";
    this.User_Child_IcNumber_Edit_ngModel = "";
    this.User_Child_Gender_Edit_ngModel = "";
    this.User_SpouseChild_Edit_ngModel = "";

    this.User_EMG_CONTACT_NAME1_Edit_ngModel = "";
    this.User_EMG_RELATIONSHIP_Edit_ngModel = "";
    this.User_EMG_CONTACT_NO1_Edit_ngModel = "";
    this.User_EMG_CONTACT_NAME2_Edit_ngModel = "";
    this.User_EMG_RELATIONSHIP2_Edit_ngModel = "";
    this.User_EMG_CONTACT_NO2_Edit_ngModel = "";

    this.User_EPF_NUMBER_Edit_ngModel = "";
    this.User_INCOMETAX_NO_Edit_ngModel = "";
    this.User_BANK_NAME_Edit_ngModel = "";

    this.MaritalStatusMarried = false;

    this.ROLE_ngModel_Edit = "";
    localStorage.removeItem("Unique_File_Name");
  }

  EditProfileClicked: boolean = false; isReadonly: boolean = false; isDisabled: boolean = true;

  Readonly() {
    this.isReadonly = true;
    return this.isReadonly;
  }

  EditProfile() {
    this.EditProfileClicked = true;
  }

  usermain_entry: UserMain_Model = new UserMain_Model();
  userinfo_entry: UserInfo_Model = new UserInfo_Model();
  useraddress_entry: UserAddress_Model = new UserAddress_Model();
  usercompany_entry: UserCompany_Model = new UserCompany_Model();
  usercontact_entry: UserContact_Model = new UserContact_Model();
  userqualification_entry: UserQualification_Model = new UserQualification_Model();
  UserCertification_Entry: UserCertification_Model = new UserCertification_Model();
  UserSpouse_Entry: UserSpouse_Model = new UserSpouse_Model();
  UserChildren_Entry: UserChildren_Model = new UserChildren_Model();
  userrole_entry: UserRole_Model = new UserRole_Model();

  Update(USER_GUID: any) {
    // alert('Development in progress.');
    if (this.Userform) {
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...',
      });
      this.loading.present();
      this.Update_User_Main(USER_GUID);
      this.loading.dismissAll();
    }
  }

  Update_User_Main(USER_GUID: any) {
    // debugger;
    ///Bind the Tenant Guid through Tenant company Guid.----------------------
    let val = this.GetTenant_GUID(this.User_Company_Edit_ngModel.trim());
    val.then((res) => {
      this.usermain_entry.TENANT_GUID = res.toString();
      this.usermain_entry.USER_GUID = USER_GUID;
      this.usermain_entry.STAFF_ID = this.User_StaffID_Edit_ngModel;
      this.usermain_entry.LOGIN_ID = this.User_Email_Edit_ngModel;
      this.usermain_entry.PASSWORD = this.User_Password_Edit_ngModel;
      this.usermain_entry.EMAIL = this.User_Email_Edit_ngModel;
      this.usermain_entry.ACTIVATION_FLAG = 1;

      this.usermain_entry.CREATION_TS = this.view_user_details[0]["CREATION_TS"];
      this.usermain_entry.CREATION_USER_GUID = this.view_user_details[0]["CREATION_USER_GUID"];

      this.usermain_entry.UPDATE_TS = new Date().toISOString();
      this.usermain_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");
      this.usermain_entry.IS_TENANT_ADMIN = this.view_user_details[0]["IS_TENANT_ADMIN"];

      this.userservice.update_user_main(this.usermain_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            //alert('1');
            this.Update_User_Info();
          }
        });
    });
    val.catch((err) => {
      // This is never called
      console.log(err);
    });
  }

  Update_User_Info() {
    // debugger;
    this.userinfo_entry.USER_INFO_GUID = this.USER_INFO_GUID_FOR_UPDATE;
    this.userinfo_entry.USER_GUID = this.usermain_entry.USER_GUID;
    this.userinfo_entry.FULLNAME = this.titlecasePipe.transform(this.User_Name_Edit_ngModel);
    this.userinfo_entry.MANAGER_USER_GUID = this.User_Approver1_Edit_ngModel;
    this.userinfo_entry.PERSONAL_ID_TYPE = this.User_StaffID_Edit_ngModel;
    this.userinfo_entry.PERSONAL_ID = this.User_ICNo_Edit_ngModel;
    this.userinfo_entry.DOB = this.User_DOB_Edit_ngModel;
    this.userinfo_entry.GENDER = this.User_Gender_Edit_ngModel;
    this.userinfo_entry.JOIN_DATE = this.User_JoinDate_Edit_ngModel;
    this.userinfo_entry.MARITAL_STATUS = this.User_Marital_Edit_ngModel;
    this.userinfo_entry.BRANCH = this.User_Branch_Edit_ngModel;
    this.userinfo_entry.EMPLOYEE_TYPE = this.User_EmployeeType_Edit_ngModel;
    this.userinfo_entry.EMPLOYEE_STATUS = this.User_Employment_Edit_ngModel;
    this.userinfo_entry.DEPT_GUID = this.User_Department_Edit_ngModel;
    this.userinfo_entry.DESIGNATION_GUID = this.User_Designation_Edit_ngModel;
    this.userinfo_entry.RESIGNATION_DATE = this.User_ResignationDate_Edit_ngModel;
    this.userinfo_entry.TENANT_COMPANY_GUID = this.User_Company_Edit_ngModel;
    this.userinfo_entry.CONFIRMATION_DATE = this.User_ConfirmationDate_Edit_ngModel;
    this.userinfo_entry.TENANT_COMPANY_SITE_GUID = this.User_Branch_Edit_ngModel;

    this.userinfo_entry.CREATION_TS = this.usermain_entry.CREATION_TS;
    this.userinfo_entry.CREATION_USER_GUID = this.usermain_entry.CREATION_USER_GUID;
    this.userinfo_entry.UPDATE_TS = new Date().toISOString();
    this.userinfo_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");

    this.userinfo_entry.EMG_CONTACT_NAME_1 = this.titlecasePipe.transform(this.User_EMG_CONTACT_NAME1_Edit_ngModel);
    this.userinfo_entry.EMG_RELATIONSHIP_1 = this.titlecasePipe.transform(this.User_EMG_RELATIONSHIP_Edit_ngModel);
    this.userinfo_entry.EMG_CONTACT_NUMBER_1 = this.User_EMG_CONTACT_NO1_Edit_ngModel;
    this.userinfo_entry.EMG_CONTACT_NAME_2 = this.titlecasePipe.transform(this.User_EMG_CONTACT_NAME2_Edit_ngModel);
    this.userinfo_entry.EMG_RELATIONSHIP_2 = this.titlecasePipe.transform(this.User_EMG_RELATIONSHIP2_Edit_ngModel);
    this.userinfo_entry.EMG_CONTACT_NUMBER_2 = this.User_EMG_CONTACT_NO2_Edit_ngModel;
    this.userinfo_entry.PR_EPF_NUMBER = this.User_EPF_NUMBER_Edit_ngModel;
    this.userinfo_entry.PR_INCOMETAX_NUMBER = this.User_INCOMETAX_NO_Edit_ngModel;
    this.userinfo_entry.BANK_GUID = this.User_BANK_NAME_Edit_ngModel;
    this.userinfo_entry.PR_ACCOUNT_NUMBER = this.User_ACCOUNT_NUMBER_Edit_ngModel;

    //Added by bijay on 27/06/2018
    // this.userinfo_entry.ATTACHMENT_ID = this.view_user_details[0]["ATTACHMENT_ID"];

    if (localStorage.getItem("Unique_File_Name") != undefined && localStorage.getItem("Unique_File_Name") != "") {
      this.userinfo_entry.ATTACHMENT_ID = localStorage.getItem("Unique_File_Name");
    }
    else {
      if (this.view_user_details[0]["ATTACHMENT_ID"] == null || this.view_user_details[0]["ATTACHMENT_ID"] == '') {
        this.userinfo_entry.ATTACHMENT_ID = null;
      }
      else {
        this.userinfo_entry.ATTACHMENT_ID = this.view_user_details[0]["ATTACHMENT_ID"];
      }
    }

    this.userservice.update_user_info(this.userinfo_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          this.Update_User_Address();
        }
      });
  }

  Update_User_Address() {
    // debugger;
    this.useraddress_entry.USER_ADDRESS_GUID = this.USER_GUID_FOR_ADDRESS;
    this.useraddress_entry.USER_GUID = this.usermain_entry.USER_GUID;

    this.useraddress_entry.USER_ADDRESS1 = this.titlecasePipe.transform(this.User_Address1_Edit_ngModel.trim());
    this.useraddress_entry.USER_ADDRESS2 = this.titlecasePipe.transform(this.User_Address2_Edit_ngModel);
    this.useraddress_entry.USER_ADDRESS3 = this.titlecasePipe.transform(this.User_Address3_Edit_ngModel);

    this.useraddress_entry.CREATION_TS = this.usermain_entry.CREATION_TS;
    this.useraddress_entry.CREATION_USER_GUID = this.usermain_entry.CREATION_USER_GUID;

    this.useraddress_entry.UPDATE_TS = new Date().toISOString();
    this.useraddress_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");

    this.useraddress_entry.POST_CODE = this.User_PostCode_Edit_ngModel;
    this.useraddress_entry.COUNTRY_GUID = this.User_Country_Edit_ngModel;
    this.useraddress_entry.STATE_GUID = this.User_State_Edit_ngModel;
    //alert(this.User_Address3_Edit_ngModel);

    this.userservice.update_user_address(this.useraddress_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          this.Update_User_Company();
        }
      });
  }

  Update_User_Company() {
    // debugger;
    this.usercompany_entry.USER_COMPANY_GUID = this.USER_GUID_FOR_COMPANY_CONTACT;
    this.usercompany_entry.USER_GUID = this.usermain_entry.USER_GUID;
    this.usercompany_entry.TENANT_COMPANY_SITE_GUID = this.User_Branch_Edit_ngModel;
    this.usercompany_entry.COMPANY_CONTACT_NO = this.User_CompanyNo_Edit_ngModel;

    this.usercompany_entry.CREATION_TS = this.usermain_entry.CREATION_TS;
    this.usercompany_entry.CREATION_USER_GUID = this.usermain_entry.CREATION_USER_GUID;

    this.usercompany_entry.UPDATE_TS = new Date().toISOString();
    this.usercompany_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");

    this.userservice.update_user_company(this.usercompany_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          this.Update_User_Contact();
        }
      });
  }

  Update_User_Contact() {
    // debugger;
    this.usercontact_entry.CONTACT_NO = this.User_PersonalNo_Edit_ngModel;
    this.usercontact_entry.CONTACT_INFO_GUID = this.USER_GUID_FOR_CONTACT;
    this.usercontact_entry.USER_GUID = this.usermain_entry.USER_GUID;

    this.usercontact_entry.CREATION_TS = this.usermain_entry.CREATION_TS;
    this.usercontact_entry.CREATION_USER_GUID = this.usermain_entry.CREATION_USER_GUID;

    this.usercontact_entry.UPDATE_TS = new Date().toISOString();
    this.usercontact_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");

    this.userservice.update_user_contact(this.usercontact_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          // let uploadImage = this.UploadImage('avatar2', this.fileName2);
          // uploadImage.then((resJson) => {            
          //   let imageResult = this.SaveImageinDB(this.fileName2);
          //   imageResult.then((objImage: ImageUpload_model) => {
          //     let result = this.Update_User_Qualification(objImage.Image_Guid);

          // if (this.view_user_details[0]["QUALIFICATION_GUID"] != "") {
          //   let result = this.Update_User_Qualification(objImage.Image_Guid);
          // }
          // else {
          //   let result = this.Save_User_Qualification(objImage.Image_Guid);
          // }
          // })
          // })
          this.Update_User_Qualification();
        }
      });
  }

  Update_User_Qualification() {
    // debugger;
    this.userqualification_entry.USER_QUALIFICATION_GUID = this.USER_QUALIFICATION_GUID_FOR_UPDATE;
    this.userqualification_entry.QUALIFICATION_GUID = this.User_HighestQualification_Edit_ngModel;
    this.userqualification_entry.USER_GUID = this.usermain_entry.USER_GUID;

    this.userqualification_entry.CREATION_TS = this.usermain_entry.CREATION_TS;
    this.userqualification_entry.CREATION_USER_GUID = this.usermain_entry.CREATION_USER_GUID;
    this.userqualification_entry.UPDATE_TS = new Date().toISOString();
    this.userqualification_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");

    this.userqualification_entry.HIGHEST_QUALIFICATION = this.User_HighestQualification_Edit_ngModel;
    this.userqualification_entry.MAJOR = this.User_Major_Edit_ngModel;
    this.userqualification_entry.UNIVERSITY = this.User_University_Edit_ngModel;
    this.userqualification_entry.YEAR = this.User_EduYear_Edit_ngModel;
    // this.userqualification_entry.ATTACHMENT = imageGUID;
    this.userqualification_entry.ATTACHMENT = "";

    this.userservice.update_user_qualification(this.userqualification_entry)
      .subscribe(
        (response) => {
          if (response.status == 200) {
            this.Update_User_Certification();
            this.Update_User_Spouse();
            this.Update_User_Children();
            // this.Update_Role();

            alert('User updated successfully.');
            this.nav.setRoot(this.nav.getActive().component);
          }
        });
  }

  Update_User_Certification() {
    // debugger;
    //first Delete all the records------------------------------------------------------------    
    this.userservice.remove_multiple_records(this.usermain_entry.USER_GUID, "user_certification")
      .subscribe(
        (response) => {
          if (response.status == 200) {

            //Insert Record again---------------------------------------------------------------------
            for (var item in this.ProfessionalCertification) {
              this.UserCertification_Entry.certificate_guid = this.ProfessionalCertification[item]["CERTIFICATE_GUID"];
              this.UserCertification_Entry.name = this.ProfessionalCertification[item]["NAME"];
              this.UserCertification_Entry.grade = this.ProfessionalCertification[item]["GRADE"];
              this.UserCertification_Entry.passing_year = this.ProfessionalCertification[item]["YEAR"];
              this.UserCertification_Entry.user_guid = this.usermain_entry.USER_GUID;
              this.UserCertification_Entry.attachment = "";

              this.UserCertification_Entry.creation_ts = this.usermain_entry.CREATION_TS;
              this.UserCertification_Entry.creation_user_guid = this.usermain_entry.CREATION_USER_GUID;

              this.UserCertification_Entry.update_ts = new Date().toISOString();
              this.UserCertification_Entry.update_user_guid = localStorage.getItem("g_USER_GUID");

              this.userservice.save_user_certification(this.UserCertification_Entry)
                .subscribe(
                  (response) => {
                    if (response.status == 200) {

                      // alert('User Inserted Successfully!!');
                      // this.navCtrl.setRoot(this.navCtrl.getActive().component);
                    }
                  });
            }
            //-----------------------------------------------------------------------------------------
          }
        });
  }

  Update_User_Spouse() {
    // debugger;
    //first Delete all the records------------------------------------------------------------    
    this.userservice.remove_multiple_records(this.usermain_entry.USER_GUID, "user_spouse")
      .subscribe(
        (response) => {
          if (response.status == 200) {

            //---------Insert record-----------------------------
            for (var item in this.FamilyDetails) {
              this.UserSpouse_Entry.SPOUSE_GUID = this.FamilyDetails[item]["SPOUSE_GUID"];
              this.UserSpouse_Entry.NAME = this.FamilyDetails[item]["NAME"];
              this.UserSpouse_Entry.ICNO = this.FamilyDetails[item]["ICNO"];

              this.UserSpouse_Entry.CREATION_TS = this.usermain_entry.CREATION_TS;
              this.UserSpouse_Entry.CREATION_USER_GUID = this.usermain_entry.CREATION_USER_GUID;
              this.UserSpouse_Entry.UPDATE_TS = new Date().toISOString();
              this.UserSpouse_Entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");

              this.UserSpouse_Entry.USER_GUID = this.usermain_entry.USER_GUID;
              this.userservice.save_user_spouse(this.UserSpouse_Entry)
                .subscribe(
                  (response) => {
                    if (response.status == 200) {

                      // alert('User Inserted Successfully!!');
                      // this.navCtrl.setRoot(this.navCtrl.getActive().component);
                    }
                  });
            }
            //----------------------------------------------------------

          }
        });
  }

  Update_User_Children() {
    // debugger;
    //first Delete all the records------------------------------------------------------------    
    this.userservice.remove_multiple_records(this.usermain_entry.USER_GUID, "user_children")
      .subscribe(
        (response) => {
          if (response.status == 200) {

            //---------Insert record----------------------------------------------------------
            for (var item in this.ChildrenDetails) {
              this.UserChildren_Entry.CHILD_GUID = this.ChildrenDetails[item]["CHILD_GUID"];
              this.UserChildren_Entry.NAME = this.ChildrenDetails[item]["NAME"];
              this.UserChildren_Entry.ICNO = this.ChildrenDetails[item]["ICNO"];
              this.UserChildren_Entry.GENDER = this.ChildrenDetails[item]["GENDER"];
              this.UserChildren_Entry.SPOUSE = this.ChildrenDetails[item]["SPOUSE"];

              this.UserChildren_Entry.CREATION_TS = this.usermain_entry.CREATION_TS;
              this.UserChildren_Entry.CREATION_USER_GUID = this.usermain_entry.CREATION_USER_GUID;
              this.UserChildren_Entry.UPDATE_TS = new Date().toISOString();
              this.UserChildren_Entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");

              this.UserChildren_Entry.USER_GUID = this.usermain_entry.USER_GUID;
              this.userservice.save_user_children(this.UserChildren_Entry)
                .subscribe(
                  (response) => {
                    if (response.status == 200) {
                      // alert('User Inserted Successfully!!');
                      // this.navCtrl.setRoot(this.navCtrl.getActive().component);
                    }
                  });
            }
            //-----------------------------------------------------------------------------------------

          }
        });
  }

  Update_Role() {
    // debugger;
    //first Delete all the records------------------------------------------------------------    
    this.userservice.remove_multiple(this.usermain_entry.USER_GUID, "user_role")
      .subscribe(
        (response) => {
          if (response.status == 200) {
            //Insert Record again---------------------------------------------------------------------
            for (var ROLE_GUID of this.ROLE_ngModel_Edit) {
              this.userrole_entry.USER_ROLE_GUID = UUID.UUID();
              this.userrole_entry.USER_GUID = this.usermain_entry.USER_GUID;
              this.userrole_entry.ROLE_GUID = ROLE_GUID;
              this.userrole_entry.ACTIVATION_FLAG = "1";
              this.userrole_entry.CREATION_TS = this.usermain_entry.CREATION_TS;
              this.userrole_entry.CREATION_USER_GUID = this.usermain_entry.CREATION_USER_GUID;
              this.userrole_entry.UPDATE_TS = new Date().toISOString();
              this.userrole_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");

              this.userservice.save_user_role(this.userrole_entry)
                .subscribe((response) => {
                  if (response.status == 200) {
                    // alert('Tenant User Registered successfully');
                    // this.navCtrl.setRoot(this.navCtrl.getActive().component);
                  }
                });
            }
            //-----------------------------------------------------------------------------------------
          }
        });
  }

  fileName1: string; ProfileImage: any; imageGUID: any; uploadFileName: string; chooseFile: boolean = false; newImage: boolean = true; ImageUploadValidation: boolean = false;
  private ProfileImageDisplay(e: any, fileChoose: string): void {
    let reader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      this.Userform.get(fileChoose).setValue(file);
      if (fileChoose === 'avatar1')
        this.fileName1 = file.name;

      reader.onload = (event: any) => {
        this.ProfileImage = event.target.result;
        this.Profile_Image_Display = event.target.result
      }
      reader.readAsDataURL(e.target.files[0]);
    }
    this.imageGUID = this.uploadFileName;
    this.chooseFile = true;
    this.newImage = false;
    this.onFileChange(e);
    this.ImageUploadValidation = false;
  }

  onFileChange(event: any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.Userform.get('avatar').setValue(file);
      this.uploadFileName = file.name;
      reader.onload = () => {
        this.Userform.get('avatar').setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result.split(',')[1]
        });
      };
    }
  }

  saveIm() {
    let uploadImage = this.UploadImage();
    uploadImage.then(() => {
      this.imageGUID = this.uploadFileName;
      this.chooseFile = false;
      this.ImageUploadValidation = true;
    })
  }

  CloudFilePath: string;
  UploadImage() {
    this.CloudFilePath = 'eclaim/'
    // this.loading = true;
    let uniqueName = new Date().toISOString() + this.uploadFileName; localStorage.setItem("Unique_File_Name", uniqueName);
    const queryHeaders = new Headers();
    queryHeaders.append('filename', this.uploadFileName);
    queryHeaders.append('Content-Type', 'multipart/form-data');
    queryHeaders.append('fileKey', 'file');
    queryHeaders.append('chunkedMode', 'false');
    queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
    const options = new RequestOptions({ headers: queryHeaders });
    return new Promise((resolve) => {
      this.http.post('http://api.zen.com.my/api/v2/azurefs/' + this.CloudFilePath + uniqueName, this.Userform.get('avatar').value, options)
        .map((response) => {
          return response;
        }).subscribe((response) => {
          resolve(response.json());
        })
    })
  }

}
