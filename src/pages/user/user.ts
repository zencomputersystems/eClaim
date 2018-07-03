import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, Item } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import CryptoJS from 'crypto-js';
import { TitleCasePipe } from '@angular/common';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { LoadingController, ActionSheetController, Platform, Loading, ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';

import { GlobalFunction } from '../../shared/GlobalFunction';
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
import { ViewUser_Model } from '../../models/viewuser_model';
import { View_Dropdown_Model } from '../../models/view_dropdown';
import { UserSetup_Service } from '../../services/usersetup_service';
import { BaseHttpService } from '../../services/base-http';
import { Services } from '../Services';

import { UserRole_Model } from '../../models/user_role_model'

import { UUID } from 'angular2-uuid';

import { elementDef } from '@angular/core/src/view/element';

declare var cordova: any;

import { LoginPage } from '../login/login';
import { Conditional } from '@angular/compiler';
import { ImageUpload_model } from '../../models/image-upload.model';
declare var cordova: any;
/**
 * Generated class for the UserPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html', providers: [UserSetup_Service, BaseHttpService, FileTransfer, Transfer, TitleCasePipe]
})
export class UserPage {
  //selectedValue: number;

  fileName1: string;
  fileName2: string;
  fileName3: string;

  uploadFileName: string;
  load = false;
  CloudFilePath: string;
  //@ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('fileInput1') fileInput1: ElementRef;
  @ViewChild('fileInput2') fileInput2: ElementRef;
  @ViewChild('fileInput3') fileInput3: ElementRef;

  travel_date: any;

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
  userqualification_entry: UserQualification_Model = new UserQualification_Model();
  UserCertification_Entry: UserCertification_Model = new UserCertification_Model();
  UserSpouse_Entry: UserSpouse_Model = new UserSpouse_Model();
  UserChildren_Entry: UserChildren_Model = new UserChildren_Model();
  userrole_entry: UserRole_Model = new UserRole_Model();

  viewuser_entry: ViewUser_Model = new ViewUser_Model();
  viewdropdown_entry: View_Dropdown_Model = new View_Dropdown_Model();
  view_user_details: any;
  user_details: any;
  Userform: FormGroup;

  BaseTableURL: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
  Key_Param: string = 'api_key=' + constants.DREAMFACTORY_API_KEY;
  banks: any; qualifications: any; tenants: any; countries: any; states: any; userview: any[];
  varTenant_Guid: string;

  //baseResourceUrl1: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/user_info' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  //baseResource_Url1: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
  //baseResourceUrl2: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/user_main' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResourceUrl2_URL: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
  //baseResourceUrl3: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/user_contact' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  //baseResourceUrl4: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/user_company' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + "/api/v2/zcs/_table/user_address?filter=(USER_GUID=" + localStorage.getItem("g_USER_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
  //baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
  //baseResourceUrl_designation: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_designation' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  //baseResourceUrl_company: string = constants.DREAMFACTORY_INSTANCE_URL + "/api/v2/zcs/_table/tenant_company?filter=(TENANT_GUID=" + localStorage.getItem("g_TENANT_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
  //baseResourceUrl_department: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_department' + '?api_key=' + constants.DREAMFACTORY_API_KEY;


  //baseResourceUrl_branch: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_tenantcompanysitedetails' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  //baseResourceView: string = constants.DREAMFACTORY_INSTANCE_URL + "/api/v2/zcs/_table/view_user_display?filter=(USER_GUID=" + localStorage.getItem("g_USER_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
  //baseResourceView1: string = constants.DREAMFACTORY_INSTANCE_URL + "/api/v2/zcs/_table/view_dropdown?filter=(USER_GUID=" + localStorage.getItem("g_USER_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;


  //public users: UserMain_Model[] = [];
  public multipleid: any;
  public users: ViewUser_Model[] = [];
  public users_local: ViewUser_Model[] = [];

  //public employees: UserInfo_Model[] =[];
  public employees: View_Dropdown_Model[] = [];
  public employees_local: View_Dropdown_Model[] = [];
  // public employees_local: UserInfo_Model[] =[];

  public Exist_Record: boolean = false;
  public AddUserClicked: boolean = false;
  public EditUserClicked: boolean = false;

  public ProfessionalCertification: any[] = [];
  public FamilyDetails: any[] = [];
  public ChildrenDetails: any[] = [];

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

  public User_EMG_CONTACT_NAME1_ngModel: any;
  public User_EMG_RELATIONSHIP_ngModel: any;
  public User_EMG_CONTACT_NO1_ngModel: any;
  public User_EMG_CONTACT_NAME2_ngModel: any;
  public User_EMG_RELATIONSHIP2_ngModel: any;
  public User_EMG_CONTACT_NO2_ngModel: any;
  public User_EPF_NUMBER_ngModel: any;
  public User_INCOMETAX_NO_ngModel: any;
  public User_BANK_NAME_ngModel: any;
  public User_ACCOUNT_NUMBER_ngModel: any;

  public User_Address1_ngModel: any;
  public User_Address2_ngModel: any;
  public User_Address3_ngModel: any;

  public User_PostCode_ngModel: any;
  public User_Country_ngModel: any;
  public User_State_ngModel: any;
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

  public User_HighestQualification_Edit_ngModel: any;
  public User_University_Edit_ngModel: any;
  public User_Major_Edit_ngModel: any;
  public User_EduYear_Edit_ngModel: any;

  public User_Certification_Edit_ngModel: any;
  public User_CertificationYear_Edit_ngModel: any;
  public User_CertificationGrade_Edit_ngModel: any;
  public User_CertificationAttachment_Edit_ngModel: any;

  public User_Address1_Edit_ngModel: any;
  public User_Address2_Edit_ngModel: any;
  public User_Address3_Edit_ngModel: any;
  public User_PostCode_Edit_ngModel: any;
  public User_Country_Edit_ngModel: any;
  public User_State_Edit_ngModel: any;

  public User_EMG_CONTACT_NAME1_Edit_ngModel: any;
  public User_EMG_RELATIONSHIP_Edit_ngModel: any;
  public User_EMG_CONTACT_NO1_Edit_ngModel: any;
  public User_EMG_CONTACT_NAME2_Edit_ngModel: any;
  public User_EMG_RELATIONSHIP2_Edit_ngModel: any;
  public User_EMG_CONTACT_NO2_Edit_ngModel: any;

  public User_HighestQualification_ngModel: any;
  public User_Major_ngModel: any;
  public User_University_ngModel: any;
  public User_EduYear_ngModel: any;

  public User_EPF_NUMBER_Edit_ngModel: any;
  public User_INCOMETAX_NO_Edit_ngModel: any;
  public User_BANK_NAME_Edit_ngModel: any;
  public User_ACCOUNT_NUMBER_Edit_ngModel: any;

  public MaritalStatusMarried: boolean = false;
  // private _users: any[];

  Global_Function: GlobalFunction = new GlobalFunction(this.alertCtrl);

  public AddUserClick() {
    this.AddUserClicked = true;
    this.ClearControls();

    //Generate Password Encrypt-----------------
    var strPassword = this.Global_Function.Random();
    //this.User_Password_ngModel = Global_Function.Random().toString();
    this.User_Password_ngModel = CryptoJS.SHA256(strPassword).toString(CryptoJS.enc.Hex);
    //console.log(this.User_Password_ngModel);
    alert(strPassword);
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
  public USER_GUID_FOR_UPDATE: any;
  public USER_INFO_GUID_FOR_UPDATE: any;
  public USER_GUID_FOR_CONTACT: any;
  public USER_GUID_FOR_ADDRESS: any;
  public USER_GUID_FOR_COMPANY_CONTACT: any;
  public USER_QUALIFICATION_GUID_FOR_UPDATE: any;

  public EmployeeTypeAdjuster: any;

  public Profile_Image_Display: any;

  public EditClick_Personaldetails(id: any) {
    this.ClearControls();

    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();

    this.USER_GUID_FOR_UPDATE = id;
    this.EditUserClicked = true;

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    let url_user_edit = this.baseResourceUrl2_URL + "view_user_edit?filter=(USER_GUID=" + id + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    let url_user_Professional_Certification = this.baseResourceUrl2_URL + "user_certification?filter=(USER_GUID=" + id + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    let url_user_Spouse = this.baseResourceUrl2_URL + "user_spouse?filter=(USER_GUID=" + id + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    let url_user_Children = this.baseResourceUrl2_URL + "user_children?filter=(USER_GUID=" + id + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    let url_user_Image = this.baseResourceUrl2_URL + "view_image_retrieve?filter=(USER_GUID=" + id + ')&api_key=' + constants.DREAMFACTORY_API_KEY;

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
            this.Profile_Image_Display = constants.DREAMFACTORY_INSTANCE_URL + "/api/v2/files/eclaim/" + this.view_user_details[0]["ATTACHMENT_ID"] + "?api_key=" + constants.DREAMFACTORY_API_KEY;
          }

          //------------------------EMPLOYMENT DETAILS----------------------------------
          this.USER_INFO_GUID_FOR_UPDATE = this.view_user_details[0]["USER_INFO_GUID"];

          this.USER_GUID_FOR_COMPANY_CONTACT = this.view_user_details[0]["USER_COMPANY_GUID"];
          this.USER_GUID_FOR_CONTACT = this.view_user_details[0]["CONTACT_INFO_GUID"];

          this.User_Company_Edit_ngModel = this.view_user_details[0]["COMPANY_GUID"]; this.GetBranch("tenant_company_site", this.User_Company_Edit_ngModel, "SITE_NAME");

          this.GetDesignation('main_designation', 'NAME');
          this.GetDepartment('main_department', 'NAME');
          this.BindBank('main_bank', 'NAME');
          this.BindApprover1("view_get_tenant_admin"); -
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

          //this.EmployeeTypeAdjuster=  this.User_EmployeeType_Edit_ngModel = this.view_user_details[0]["EMPLOYEE_TYPE"]; 
          this.User_EmployeeType_Edit_ngModel = this.view_user_details[0]["EMPLOYEE_TYPE"];

          if (this.view_user_details[0]["MANAGER_USER_GUID"] != null) {
            this.User_Approver1_Edit_ngModel = this.view_user_details[0]["MANAGER_USER_GUID"];
          }

          // this.User_Approver2_Edit_ngModel = this.view_user_details[0]["APPROVER2"];
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

          if (this.view_user_details[0]["BANK_GUID"] != null) {
            this.User_BANK_NAME_Edit_ngModel = this.view_user_details[0]["BANK_GUID"];
          }

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
    //         this.Profile_Image_Display = "assets/img/noPreview.png";
    //       }
    //       else {
    //         this.Profile_Image_Display = constants.DREAMFACTORY_INSTANCE_URL + "/api/v2/files/" + data["resource"][0]["IMAGE_URL"] + "?api_key=" + constants.DREAMFACTORY_API_KEY;
    //       }
    //     });

    //------------------------Role-------------------------------
    let CheckRole: any = [];
    let User_Role_url = this.baseResourceUrl2_URL + "user_role?filter=(USER_GUID=" + id + ')&api_key=' + constants.DREAMFACTORY_API_KEY;

    this.http
      .get(User_Role_url)
      .map(res => res.json())
      .subscribe(data => {
        this.roles = data.resource;
        for (var itemA in this.roles) {
          CheckRole.push(this.roles[itemA]["ROLE_GUID"]);
        }
        this.ROLE_ngModel_Edit = CheckRole;
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
                  return item.USER_GUID != USER_GUID;
                });
                this.navCtrl.setRoot(this.navCtrl.getActive().component);
              });
          }
        }
      ]
    }); alert.present();
  }

  button_Add_Disable: boolean = false; button_Edit_Disable: boolean = false; button_Delete_Disable: boolean = false; button_View_Disable: boolean = false;
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private api: Services, private userservice: UserSetup_Service, private alertCtrl: AlertController, private camera: Camera, public actionSheetCtrl: ActionSheetController, private loadingCtrl: LoadingController, private file: File, private filePath: FilePath, private transfer: Transfer, public toastCtrl: ToastController, public platform: Platform, private fileTransfer_new: FileTransfer, private titlecasePipe: TitleCasePipe) {
    this.button_Add_Disable = false; this.button_Edit_Disable = false; this.button_Delete_Disable = false; this.button_View_Disable = false;
    localStorage.removeItem("Unique_File_Name");

    if (localStorage.getItem("g_USER_GUID") != "sva") {
      //Get the role for this page------------------------------        
      if (localStorage.getItem("g_KEY_ADD") == "0") { this.button_Add_Disable = true; }
      if (localStorage.getItem("g_KEY_EDIT") == "0") { this.button_Edit_Disable = true; }
      if (localStorage.getItem("g_KEY_DELETE") == "0") { this.button_Delete_Disable = true; }
      if (localStorage.getItem("g_KEY_VIEW") == "0") { this.button_View_Disable = true; }
    }

    //this.ProfileImageGet();
    if (localStorage.getItem("g_USER_GUID") != null) {
      //---------Bind Designation-----------------      
      //this.GetDesignation("main_designation", "NAME");

      //---------Bind Company---------------------
      this.GetCompany("tenant_company", "NAME");

      //---------Bind Department------------------
      // this.GetDepartment("main_department", "NAME");

      //---------Bind Branch----------------------
      //this.GetBranch("tenant_company_site", "SITE_NAME");

      //---------Bind Country---------------------
      this.BindCountry("main_country", "NAME");

      //---------Bind State-----------------------
      //this.BindState("main_state", "NAME");

      //--------Bind Qualification----------------
      this.BindQualification("main_qualification_type", "TYPE_NAME");

      //---------Bind Bank------------------------
      //this.BindBank("main_bank", "NAME");

      //---------Bind Approver-------------------
      //this.BindApprover1("view_get_tenant_admin");

      //---------Bind Grid------------------------
      this.BindGrid("view_user_display_new");

      //--------Bind Role--------------------------
      this.BindRole();

      this.Userform = fb.group({
        // -------------------PERSONAL DETAILS--------------------
        avatar: null,
        avatar1: null,
        avatar2: null,
        avatar3: null,

        NAME: [null, Validators.required],
        EMAIL: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}'), Validators.required])],
        LOGIN_ID: [null],
        PASSWORD: [null],
        CONTACT_NO: [null, Validators.compose([Validators.pattern('^[0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        COMPANY_CONTACT_NO: [null],
        MARITAL_STATUS: ['', Validators.required],
        PERSONAL_ID_TYPE: [null],
        PERSONAL_ID: [null],
        DOB: [null],
        GENDER: [null, Validators.required],

        // -------------------EMPLOYMENT DETAILS--------------------
        DESIGNATION_GUID: [null, Validators.required],
        TENANT_COMPANY_GUID: [null, Validators.required],
        DEPT_GUID: [null, Validators.required],
        JOIN_DATE: [null, Validators.required],
        CONFIRMATION_DATE: [null],
        RESIGNATION_DATE: [],
        BRANCH: [null, Validators.required],
        EMPLOYEE_TYPE: [null, Validators.required],
        APPROVER1: [null, Validators.required],
        // APPROVER2: ['', Validators.required],
        EMPLOYEE_STATUS: [null, Validators.required],

        // -------------------EDUCATIONAL QUALIFICATION--------------------
        HIGHEST_QUALIFICATION: [null, Validators.required],
        UNIVERSITY: [null],
        MAJOR: [null],
        EDU_YEAR: [null],

        // -------------------PROFESSIONAL CERTIFICATIONS--------------------
        CERTIFICATION: [null],
        CERTIFICATION_YEAR: [null],
        CERTIFICATION_GRADE: [null],
        ATTACHMENT_PROFESSIONAL: [null],

        // -------------------RESIDENTIAL ADDRESS----------------------------
        USER_ADDRESS1: [null, Validators.required],
        USER_ADDRESS2: [null],
        USER_ADDRESS3: [null],
        USER_POSTCODE: ['', Validators.required],
        USER_COUNTRY: ['', Validators.required],
        USER_STATE: ['', Validators.required],

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
        EMG_CONTACT_NAME1: [null, Validators.required],
        EMG_RELATIONSHIP: [null, Validators.required],
        EMG_CONTACT_NO1: [null, Validators.compose([Validators.pattern('^[0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        EMG_CONTACT_NAME2: [null],
        EMG_RELATIONSHIP2: [null],
        EMG_CONTACT_NO2: [null],

        // -------------------PAYROLL DETAILS------------------------
        EPF_NUMBER: [null],
        INCOMETAX_NO: [null],
        BANK_NAME: ['', Validators.required],
        ACCOUNT_NUMBER: [null, Validators.required],

        //-------------------ROLE DETAILS---------------------------
        ROLE_NAME: [null],
      });
    }
    else {
      this.navCtrl.push(LoginPage);
    }
  }

  public attachment_ref: any;

  // onFileChange(event: any, fileChoose: string) {
  //   const reader = new FileReader();
  //   if (event.target.files && event.target.files.length > 0) {
  //     const file = event.target.files[0];
  //     this.Userform.get(fileChoose).setValue(file);
  //     if (fileChoose === 'avatar1')
  //       this.fileName1 = file.name;
  //     if (fileChoose === 'avatar2')
  //       this.fileName2 = file.name;
  //     if (fileChoose === 'avatar3')
  //       this.fileName3 = file.name;
  //     //alert(file.name); 
  //     this.attachment_ref = file.name;
  //     //alert(this.attachment_ref);
  //     // this.uploadFileName = file.name;
  //     reader.onload = () => {
  //       this.Userform.get(fileChoose).setValue({
  //         filename: file.name,
  //         filetype: file.type,
  //         value: reader.result.split(',')[1]
  //       });
  //     };
  //   }
  // }

  // onSubmit() {
  //   this.load = true;
  //   const queryHeaders = new Headers();
  //   queryHeaders.append('filename', this.uploadFileName);
  //   queryHeaders.append('Content-Type', 'multipart/form-data');
  //   queryHeaders.append('fileKey', 'file');
  //   queryHeaders.append('chunkedMode', 'false');
  //   queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
  //   const options = new RequestOptions({ headers: queryHeaders });
  //   this.http.post('http://api.zen.com.my/api/v2/files/' + this.uploadFileName, this.Userform.get('avatar').value, options)
  //     .map((response) => {
  //       return response;
  //     }).subscribe((response) => {
  //       //alert(response.status);
  //     });
  //   setTimeout(() => {
  //     //alert('done');
  //     this.load = false;
  //   }, 1000);
  // }

  SaveImageinDB(fileName: string) {
    let objImage: ImageUpload_model = new ImageUpload_model();
    objImage.Image_Guid = UUID.UUID();
    objImage.IMAGE_URL = this.CloudFilePath + fileName;
    objImage.CREATION_TS = new Date().toISOString();
    objImage.Update_Ts = new Date().toISOString();
    return new Promise((resolve, reject) => {
      this.api.postData('main_images', objImage.toJson(true)).subscribe((response) => {
        // let res = response.json();
        // let imageGUID = res["resource"][0].Image_Guid;
        resolve(objImage.toJson());
      })
    })
  }

  UploadImage_Old(fileChoose: string, fileName: string) {
    this.CloudFilePath = 'eclaim/'

    this.load = true;
    const queryHeaders = new Headers();
    queryHeaders.append('filename', fileName);
    queryHeaders.append('Content-Type', 'multipart/form-data');
    queryHeaders.append('fileKey', 'file');
    queryHeaders.append('chunkedMode', 'false');
    queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
    const options = new RequestOptions({ headers: queryHeaders });
    return new Promise((resolve, reject) => {
      this.http.post('http://api.zen.com.my/api/v2/files/' + this.CloudFilePath + fileName, this.Userform.get(fileChoose).value, options)
        .map((response) => {
          return response;
        }).subscribe((response) => {
          resolve(response.json());
        })
    })
  }

  // clearFile(fileChoose: any) {
  //   console.log(fileChoose);
  //   this.Userform.get(fileChoose).setValue(null);
  //   //console.log(this.fileInput);
  //   // this.fileInput1.nativeElement.value = '';
  //   this.fileInput2.nativeElement.value = '';
  //   this.fileInput3.nativeElement.value = '';

  // }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserPage');
  }

  storeUsers: any[];
  searchUser(searchString: any) {
    let val = searchString.target.value;
    if (!val || !val.trim()) {
      this.userview = this.storeUsers;
      return;
    }
    this.userview = this.filterUser({
      FULLNAME: val,
      STAFF_ID: val,
      tenant_company_name: val,
      department_name: val,
      designation_name: val,
      EMAIL: val,
      EMPLOYEE_STATUS: val
    });
  }

  filterUser(params?: any) {
    if (!params) {
      return this.storeUsers;
    }

    return this.storeUsers.filter((item) => {
      for (let key in params) {
        let field = item[key];
        if (typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
          return item;
        } else if (field == params[key]) {
          return item;
        }
      }
      return null;
    });
  }

  BindGrid(ViewName: string) {
    this.loading = this.loadingCtrl.create({
      //content: 'Loading...',
    });
    this.loading.present();

    let TableURL_User: string;
    if (localStorage.getItem("g_USER_GUID") == "sva") {
      TableURL_User = this.BaseTableURL + ViewName + '?' + this.Key_Param;
    }
    else if (localStorage.getItem("g_ISHQ") == "1" && localStorage.getItem("g_IS_TENANT_ADMIN") == "1") {
      TableURL_User = this.BaseTableURL + ViewName + '?filter=(TENANT_GUID=' + localStorage.getItem("g_TENANT_GUID") + ')&' + this.Key_Param;
    }
    else {
      TableURL_User = this.BaseTableURL + ViewName + '?filter=(USER_GUID=' + localStorage.getItem("g_USER_GUID") + ')&' + this.Key_Param;
    }
    console.log(TableURL_User);
    this.http
      .get(TableURL_User)
      .map(res => res.json())
      .subscribe(data => {
        this.userview = data["resource"]; this.storeUsers = data["resource"];
        this.loading.dismissAll();
      });
  }

  GetDesignation(TableName: string, SortField: string) {
    let TableURL: string; let TempUser_Company_ngModel: any;
    if (this.AddUserClicked == true) {
      TempUser_Company_ngModel = this.User_Company_ngModel.trim();
    }
    else {
      TempUser_Company_ngModel = this.view_user_details[0]["COMPANY_GUID"];
    }

    let val = this.GetTenant_GUID(TempUser_Company_ngModel);
    val.then((res) => {
      TableURL = this.BaseTableURL + TableName + '?filter=(TENANT_GUID=' + res.toString() + ')&order=' + SortField + '&' + this.Key_Param;

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

  GetCompany(TableName: string, SortField: string) {
    let TableURL: string;
    if (localStorage.getItem("g_USER_GUID") == "sva") {
      //TableURL = this.BaseTableURL + TableName + '?filter=(TENANT_GUID=' + this.User_Company_ngModel +')&' + 'order='+ SortField + '&' + this.Key_Param;
      TableURL = this.BaseTableURL + TableName + '?order=' + SortField + '&' + this.Key_Param;
    }
    else {
      TableURL = this.BaseTableURL + TableName + '?filter=(TENANT_GUID=' + localStorage.getItem("g_TENANT_GUID") + ')&' + 'order=' + SortField + '&' + this.Key_Param;
    }
    this.http
      .get(TableURL)
      .map(res => res.json())
      .subscribe(data => {
        this.companies = data["resource"];
      });
  }

  GetDepartment(TableName: string, SortField: string) {
    let TableURL: string;
    let TempUser_Company_ngModel: any;
    if (this.AddUserClicked == true) {
      TempUser_Company_ngModel = this.User_Company_ngModel.trim();
    }
    else {
      TempUser_Company_ngModel = this.view_user_details[0]["COMPANY_GUID"];
    }

    let val = this.GetTenant_GUID(TempUser_Company_ngModel);
    val.then((res) => {
      TableURL = this.BaseTableURL + TableName + '?filter=(TENANT_GUID=' + res.toString() + ')&order=' + SortField + '&' + this.Key_Param;

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

  GetBranch(TableName: string, FilterField: String, SortField: string) {
    let TableURL: string;
    if (this.User_Company_ngModel != undefined) {
      TableURL = this.BaseTableURL + TableName + '?filter=(TENANT_COMPANY_GUID=' + FilterField + ')&' + 'order=' + SortField + '&' + this.Key_Param;
    }
    else {
      if (localStorage.getItem("g_USER_GUID") == "sva") {
        TableURL = this.BaseTableURL + TableName + '?' + 'order=' + SortField + '&' + this.Key_Param;
      }
      else {
        TableURL = this.BaseTableURL + TableName + '?filter=(TENANT_COMPANY_GUID=' + localStorage.getItem("g_TENANT_GUID") + ')&' + 'order=' + SortField + '&' + this.Key_Param;
      }
    }

    this.http
      .get(TableURL)
      .map(res => res.json())
      .subscribe(data => {
        this.branches = data["resource"];
      });
  }

  BindCountry(TableName: string, SortField: string) {
    let TableURL: string;
    TableURL = this.BaseTableURL + TableName + '?order=' + SortField + '&' + this.Key_Param;

    this.http
      .get(TableURL)
      .map(res => res.json())
      .subscribe(data => {
        this.countries = data["resource"];
      });
  }

  BindState(TableName: string, FilterField: string, SortField: string) {
    let TableURL: string;
    TableURL = this.BaseTableURL + TableName + '?filter=(COUNTRY_GUID=' + FilterField + ')&' + 'order=' + SortField + '&' + this.Key_Param;

    this.http
      .get(TableURL)
      .map(res => res.json())
      .subscribe(data => {
        this.states = data["resource"];
      });
  }

  BindBank(TableName: string, SortField: string) {
    let TableURL: string;
    let TempUser_Company_ngModel: any;
    if (this.AddUserClicked == true) {
      TempUser_Company_ngModel = this.User_Company_ngModel.trim();
    }
    else {
      TempUser_Company_ngModel = this.view_user_details[0]["COMPANY_GUID"];
    }

    let val = this.GetTenant_GUID(TempUser_Company_ngModel);
    val.then((res) => {
      TableURL = this.BaseTableURL + TableName + '?filter=(TENANT_GUID=' + res.toString() + ')&order=' + SortField + '&' + this.Key_Param;

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

  BindQualification(TableName: string, SortField: string) {
    let TableURL: string;
    // if (localStorage.getItem("g_USER_GUID") == "sva") {
    //   //TableURL = this.BaseTableURL + TableName + '?filter=(TENANT_GUID=' + this.User_Company_ngModel +')&' + 'order='+ SortField + '&' + this.Key_Param;
    //   TableURL = this.BaseTableURL + TableName + '?order=' + SortField + '&' + this.Key_Param;
    // }
    // else {
    //   TableURL = this.BaseTableURL + TableName + '?filter=(TENANT_GUID=' + localStorage.getItem("g_TENANT_GUID") + ')&' + 'order=' + SortField + '&' + this.Key_Param;
    // }
    TableURL = this.BaseTableURL + TableName + '?order=' + SortField + '&' + this.Key_Param;
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
    if (this.AddUserClicked == true) {
      TempUser_Company_ngModel = this.User_Company_ngModel.trim();
    }
    else {
      TempUser_Company_ngModel = this.view_user_details[0]["COMPANY_GUID"];
    }

    let val = this.GetTenant_GUID(TempUser_Company_ngModel);
    val.then((res) => {
      if (this.AddUserClicked == true) {
        TableURL_Approver = this.BaseTableURL + ViewName + '?filter=(TENANT_GUID=' + res.toString() + ')&' + this.Key_Param;
      }
      else {
        if (localStorage.getItem("g_USER_GUID") == "sva" || localStorage.getItem("g_IS_TENANT_ADMIN") == "1") {
          TableURL_Approver = this.BaseTableURL + ViewName + '?filter=(TENANT_GUID=' + res.toString() + ')&' + this.Key_Param;
        }
        else {
          TableURL_Approver = this.BaseTableURL + ViewName + '?filter=(TENANT_GUID=' + res.toString() + ')AND(USER_GUID!=' + this.view_user_details[0]["USER_GUID"] + ')&' + this.Key_Param;
        }
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

  User_Certification_ngModel: any;
  User_CertificationGrade_ngModel: any;
  User_CertificationYear_ngModel: any;
  User_CertificationAttachment_ngModel: any;
  CertificateSaveFlag: boolean = false;

  AddProfessionalCertification() {
    if (this.User_Certification_ngModel != undefined && this.User_Certification_ngModel.trim() != "") {
      if (this.User_CertificationGrade_ngModel != undefined && this.User_CertificationGrade_ngModel.trim() != "") {
        if (this.User_CertificationYear_ngModel != undefined && this.User_CertificationYear_ngModel.trim() != "") {
          if (this.CertificateSaveFlag == false) {
            this.ProfessionalCertification.push({ CERTIFICATE_GUID: UUID.UUID(), NAME: this.titlecasePipe.transform(this.User_Certification_ngModel.trim()), GRADE: this.User_CertificationGrade_ngModel.trim(), YEAR: this.User_CertificationYear_ngModel.trim(), ATTACHMENT: this.attachment_ref });
          }
          else {
            this.ProfessionalCertification = this.ProfessionalCertification.filter(item => item.CERTIFICATE_GUID != localStorage.getItem("CERTIFICATE_GUID"));
            this.ProfessionalCertification.push({ CERTIFICATE_GUID: localStorage.getItem("CERTIFICATE_GUID"), NAME: this.titlecasePipe.transform(this.User_Certification_ngModel.trim()), GRADE: this.User_CertificationGrade_ngModel.trim(), YEAR: this.User_CertificationYear_ngModel.trim(), ATTACHMENT: this.attachment_ref });

            this.CertificateSaveFlag = false;
            localStorage.removeItem("SPOUSE_GUID");
          }

          //Clear the Controls------------------------
          this.User_Certification_ngModel = "";
          this.User_CertificationGrade_ngModel = "";
          this.User_CertificationYear_ngModel = "";
          this.User_CertificationAttachment_ngModel = "";
        }
        else {
          alert("Fill Year !!");
        }
      }
      else {
        alert("Fill Grade !!");
      }
    }
    else {
      alert("Fill Certificate Name !!");
    }
  }

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
          alert("Fill Year !!");
        }
      }
      else {
        alert("Fill Grade !!");
      }
    }
    else {
      alert("Fill Certificate Name !!");
    }
  }

  EditProfessionalCertification(CERTIFICATE_GUID: string) {
    for (var item in this.ProfessionalCertification) {
      if (this.ProfessionalCertification[item]["CERTIFICATE_GUID"] == CERTIFICATE_GUID) {
        this.User_Certification_ngModel = this.ProfessionalCertification[item]["NAME"];
        this.User_CertificationGrade_ngModel = this.ProfessionalCertification[item]["GRADE"];
        this.User_CertificationYear_ngModel = this.ProfessionalCertification[item]["YEAR"];

        localStorage.setItem("CERTIFICATE_GUID", this.ProfessionalCertification[item]["CERTIFICATE_GUID"]);

        this.CertificateSaveFlag = true;
        return;
      }
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
      alert('Sorry!! You are in Edit Mode.');
    }
  }

  User_Spouse_Name_ngModel: any;
  User_Spouse_IcNumber_ngModel: any;
  SpouseSaveFlag: boolean = false;

  AddFamilyDetails() {
    if (this.User_Spouse_Name_ngModel != undefined && this.User_Spouse_Name_ngModel.trim() != "") {
      if (this.User_Spouse_IcNumber_ngModel != undefined && this.User_Spouse_IcNumber_ngModel.trim() != "") {
        if (this.SpouseSaveFlag == false) {
          this.FamilyDetails.push({ SPOUSE_GUID: UUID.UUID(), NAME: this.titlecasePipe.transform(this.User_Spouse_Name_ngModel.trim()), ICNO: this.User_Spouse_IcNumber_ngModel.trim() });
        }
        else {
          this.FamilyDetails = this.FamilyDetails.filter(item => item.SPOUSE_GUID != localStorage.getItem("SPOUSE_GUID"));
          this.FamilyDetails.push({ SPOUSE_GUID: localStorage.getItem("SPOUSE_GUID"), NAME: this.titlecasePipe.transform(this.User_Spouse_Name_ngModel.trim()), ICNO: this.User_Spouse_IcNumber_ngModel.trim() });
          this.SpouseSaveFlag = false;
          localStorage.removeItem("SPOUSE_GUID");
        }
        this.User_Spouse_Name_ngModel = "";
        this.User_Spouse_IcNumber_ngModel = "";
      }
      else {
        alert("Fill IC Number !!");
      }
    }
    else {
      alert("Fill Spouse Name !!");
    }
  }

  User_Spouse_Name_Edit_ngModel: any;
  User_Spouse_IcNumber_Edit_ngModel: any;

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
        alert("Fill IC Number !!");
      }
    }
    else {
      alert("Fill Spouse Name !!");
    }
  }

  EditFamilyDetails(SPOUSE_GUID: string) {
    for (var item in this.FamilyDetails) {
      if (this.FamilyDetails[item]["SPOUSE_GUID"] == SPOUSE_GUID) {
        this.User_Spouse_Name_ngModel = this.FamilyDetails[item]["NAME"];
        this.User_Spouse_IcNumber_ngModel = this.FamilyDetails[item]["ICNO"];
        localStorage.setItem("SPOUSE_GUID", this.FamilyDetails[item]["SPOUSE_GUID"]);

        this.SpouseSaveFlag = true;
        return;
      }
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
      alert("Sorry !! You are in Edit Mode.");
    }

  }

  public User_Child_Name_ngModel: any;
  public User_Child_IcNumber_ngModel: any;
  public User_Child_Gender_ngModel: any;
  public User_SpouseChild_ngModel: any;
  public ChildSaveFlag: boolean = false;

  AddChildren() {
    if (this.User_Child_Name_ngModel != undefined && this.User_Child_Name_ngModel.trim() != "") {
      if (this.User_Child_IcNumber_ngModel != undefined && this.User_Child_IcNumber_ngModel.trim() != "") {
        if (this.User_Child_Gender_ngModel != undefined && this.User_Child_Gender_ngModel != "") {
          if (this.User_SpouseChild_ngModel != undefined && this.User_SpouseChild_ngModel != "") {
            if (this.ChildSaveFlag == false) {
              this.ChildrenDetails.push({ CHILD_GUID: UUID.UUID(), NAME: this.titlecasePipe.transform(this.User_Child_Name_ngModel.trim()), ICNO: this.User_Child_IcNumber_ngModel.trim(), GENDER: this.User_Child_Gender_ngModel.trim(), SPOUSE: this.User_SpouseChild_ngModel.trim() });
            }
            else {
              this.ChildrenDetails = this.ChildrenDetails.filter(item => item.CHILD_GUID != localStorage.getItem("CHILD_GUID"));
              this.ChildrenDetails.push({ CHILD_GUID: localStorage.getItem("CHILD_GUID"), NAME: this.titlecasePipe.transform(this.User_Child_Name_ngModel.trim()), ICNO: this.User_Child_IcNumber_ngModel.trim(), GENDER: this.User_Child_Gender_ngModel.trim(), SPOUSE: this.User_SpouseChild_ngModel.trim() });

              this.ChildSaveFlag = false;
              localStorage.removeItem("CHILD_GUID");
            }
            //------Clear Controls ----------------
            this.User_Child_Name_ngModel = "";
            this.User_Child_IcNumber_ngModel = "";
            this.User_Child_Gender_ngModel = "";
            this.User_SpouseChild_ngModel = "";
          }
          else {
            alert("Select Spouse !!");
          }
        }
        else {
          alert("Select Gender !!");
        }
      }
      else {
        alert("Fill Child IC Number !!")
      }
    }
    else {
      alert("Fill Child Name !!");
    }
  }

  public User_Child_Name_Edit_ngModel: any;
  public User_Child_IcNumber_Edit_ngModel: any;
  public User_Child_Gender_Edit_ngModel: any;
  public User_SpouseChild_Edit_ngModel: any;

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
            alert("Select Spouse !!");
          }
        }
        else {
          alert("Select Gender !!");
        }
      }
      else {
        alert("Fill Child IC Number !!")
      }
    }
    else {
      alert("Fill Child Name !!");
    }
  }

  EditChildren(CHILD_GUID: string) {
    for (var item in this.ChildrenDetails) {
      if (this.ChildrenDetails[item]["CHILD_GUID"] == CHILD_GUID) {
        this.User_Child_Name_ngModel = this.ChildrenDetails[item]["NAME"];
        this.User_Child_IcNumber_ngModel = this.ChildrenDetails[item]["ICNO"];
        this.User_Child_Gender_ngModel = this.ChildrenDetails[item]["GENDER"];
        this.User_SpouseChild_ngModel = this.ChildrenDetails[item]["SPOUSE"];

        localStorage.setItem("CHILD_GUID", this.ChildrenDetails[item]["CHILD_GUID"]);

        this.ChildSaveFlag = true;
        return;
      }
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
      alert('Sorry!! You are in Edit Mode.');
    }
  }

  GetTenant_GUID(Tenant_company_guid: string) {
    let TableURL = this.BaseTableURL + "tenant_company" + '?filter=(TENANT_COMPANY_GUID=' + Tenant_company_guid + ')&' + this.Key_Param;
    return new Promise((resolve, reject) => {
      this.http
        .get(TableURL)
        .map(res => res.json())
        .subscribe(data => {
          this.tenants = data["resource"];
          //this.varTenant_Guid = this.tenants
          resolve(this.tenants[0].TENANT_GUID);
        });
    });
  }

  Save_User_Main() {
    // imageGUID: string
    ///Bind the Tenant Guid through Tenant company Guid.----------------------
    let val = this.GetTenant_GUID(this.User_Company_ngModel.trim());
    val.then((res) => {
      this.usermain_entry.TENANT_GUID = res.toString();
      this.usermain_entry.USER_GUID = UUID.UUID();
      //this.usermain_entry.TENANT_GUID = this.BindTenant_GUID(this.User_Company_ngModel.trim());
      this.usermain_entry.STAFF_ID = this.User_StaffID_ngModel.trim();
      //this.usermain_entry.LOGIN_ID = this.User_LoginId_ngModel.trim();
      this.usermain_entry.LOGIN_ID = this.User_Email_ngModel.trim();
      this.usermain_entry.PASSWORD = this.User_Password_ngModel.trim();
      this.usermain_entry.EMAIL = this.User_Email_ngModel.trim();

      this.usermain_entry.ACTIVATION_FLAG = 1;
      this.usermain_entry.CREATION_TS = new Date().toISOString();
      this.usermain_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
      this.usermain_entry.UPDATE_TS = new Date().toISOString();
      this.usermain_entry.UPDATE_USER_GUID = "";

      this.userservice.save_user_main(this.usermain_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            //alert('1');
            // let uploadImage = this.UploadImage('avatar1', this.fileName1);
            // uploadImage.then((resJson) => {
            //   //console.table(resJson)
            //   let imageResult = this.SaveImageinDB(this.fileName1);
            //   imageResult.then((objImage: ImageUpload_model) => {
            //     let result = this.Save_User_Info(objImage.Image_Guid);
            //     //alert("User Main inserted");
            //   })
            // })
            this.Save_User_Info();
          }
        });
    });
    val.catch((err) => {
      // This is never called
      console.log(err);
    });
  }

  Update_User_Main(USER_GUID: any) {
    ///Bind the Tenant Guid through Tenant company Guid.----------------------
    let val = this.GetTenant_GUID(this.User_Company_Edit_ngModel.trim());
    val.then((res) => {
      this.usermain_entry.TENANT_GUID = res.toString();
      this.usermain_entry.USER_GUID = USER_GUID;
      this.usermain_entry.STAFF_ID = this.User_StaffID_Edit_ngModel.trim();
      //this.usermain_entry.LOGIN_ID = this.User_LoginId_Edit_ngModel.trim();
      this.usermain_entry.LOGIN_ID = this.User_Email_Edit_ngModel.trim();
      if (this.User_Password_Edit_ngModel != undefined) {
        this.usermain_entry.PASSWORD = this.User_Password_Edit_ngModel.trim();
      }
      this.usermain_entry.EMAIL = this.User_Email_Edit_ngModel.trim();
      this.usermain_entry.ACTIVATION_FLAG = 1;

      this.usermain_entry.CREATION_TS = this.view_user_details[0]["CREATION_TS"];
      this.usermain_entry.CREATION_USER_GUID = this.view_user_details[0]["CREATION_USER_GUID"];

      this.usermain_entry.UPDATE_TS = new Date().toISOString();
      this.usermain_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");
      // alert(this.usermain_entry.EMAIL);
      // alert(this.User_Email_ngModel);

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

  // Save_User_Info(imageGUID: string) {
  Save_User_Info() {
    //debugger;
    let userinfo_entry: UserInfo_Model = new UserInfo_Model();
    this.userinfo_entry.USER_INFO_GUID = UUID.UUID();
    this.userinfo_entry.USER_GUID = this.usermain_entry.USER_GUID;
    this.userinfo_entry.FULLNAME = this.titlecasePipe.transform(this.User_Name_ngModel.trim());
    //NICKNAME
    //SALUTATION
    this.userinfo_entry.MANAGER_USER_GUID = this.User_Approver1_ngModel.trim();
    this.userinfo_entry.PERSONAL_ID_TYPE = this.User_StaffID_ngModel.trim();
    this.userinfo_entry.PERSONAL_ID = this.User_ICNo_ngModel.trim();
    this.userinfo_entry.DOB = this.User_DOB_ngModel.trim();
    this.userinfo_entry.GENDER = this.User_Gender_ngModel;
    this.userinfo_entry.JOIN_DATE = this.User_JoinDate_ngModel.trim();
    this.userinfo_entry.MARITAL_STATUS = this.User_Marital_ngModel;
    this.userinfo_entry.BRANCH = this.User_Branch_ngModel.trim();
    this.userinfo_entry.EMPLOYEE_TYPE = this.User_EmployeeType_ngModel.trim();
    // this.userinfo_entry.ATTACHMENT_ID = imageGUID;

    if (localStorage.getItem("Unique_File_Name") != undefined) {
      this.userinfo_entry.ATTACHMENT_ID = localStorage.getItem("Unique_File_Name");
    }
    else {
      this.userinfo_entry.ATTACHMENT_ID = null;
    }

    // this.userinfo_entry.APPROVER1 = this.User_Approver1_ngModel.trim();
    // this.userinfo_entry.APPROVER2 = this.User_Approver2_ngModel.trim();
    this.userinfo_entry.EMPLOYEE_STATUS = this.User_Employment_ngModel.trim();
    this.userinfo_entry.DEPT_GUID = this.User_Department_ngModel.trim();
    this.userinfo_entry.DESIGNATION_GUID = this.User_Designation_ngModel.trim();
    this.userinfo_entry.RESIGNATION_DATE = this.User_ResignationDate_ngModel.trim();
    this.userinfo_entry.TENANT_COMPANY_GUID = this.User_Company_ngModel.trim();
    this.userinfo_entry.CONFIRMATION_DATE = this.User_ConfirmationDate_ngModel.trim();
    this.userinfo_entry.TENANT_COMPANY_SITE_GUID = this.User_Branch_ngModel.trim();
    this.userinfo_entry.CREATION_TS = new Date().toISOString();
    this.userinfo_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
    this.userinfo_entry.UPDATE_TS = new Date().toISOString();
    this.userinfo_entry.UPDATE_USER_GUID = "";

    // this.userinfo_entry.POST_CODE
    // this.userinfo_entry.COUNTRY_GUID
    // this.userinfo_entry.STATE_GUID
    this.userinfo_entry.EMG_CONTACT_NAME_1 = this.titlecasePipe.transform(this.User_EMG_CONTACT_NAME1_ngModel.trim());
    this.userinfo_entry.EMG_RELATIONSHIP_1 = this.titlecasePipe.transform(this.User_EMG_RELATIONSHIP_ngModel.trim());
    this.userinfo_entry.EMG_CONTACT_NUMBER_1 = this.User_EMG_CONTACT_NO1_ngModel.trim();
    this.userinfo_entry.EMG_CONTACT_NAME_2 = this.titlecasePipe.transform(this.User_EMG_CONTACT_NAME2_ngModel.trim());
    this.userinfo_entry.EMG_RELATIONSHIP_2 = this.titlecasePipe.transform(this.User_EMG_RELATIONSHIP2_ngModel.trim());
    this.userinfo_entry.EMG_CONTACT_NUMBER_2 = this.User_EMG_CONTACT_NO2_ngModel;
    // .trim()
    this.userinfo_entry.PR_EPF_NUMBER = this.User_EPF_NUMBER_ngModel.trim();
    this.userinfo_entry.PR_INCOMETAX_NUMBER = this.User_INCOMETAX_NO_ngModel.trim();
    this.userinfo_entry.BANK_GUID = this.User_BANK_NAME_ngModel;
    // .trim()
    this.userinfo_entry.PR_ACCOUNT_NUMBER = this.User_ACCOUNT_NUMBER_ngModel;
    // .trim()

    this.userservice.save_user_info(this.userinfo_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          this.Save_User_Address();
          //alert("User Info inserted");
        }
      });
    // return new Promise((resolve, reject) => {
    //   this.api.postData('user_info', userinfo_entry.toJson(true)).subscribe((data) => {

    //     let res = data.json();
    //     console.log(res)
    //     let ClaimRequestMainIdType = res["resource"][0].USER_INFO_GUID;
    //     resolve(ClaimRequestMainIdType);
    //   })
    // });
  }

  Update_User_Info() {
    this.userinfo_entry.USER_INFO_GUID = this.USER_INFO_GUID_FOR_UPDATE;
    this.userinfo_entry.USER_GUID = this.usermain_entry.USER_GUID;
    this.userinfo_entry.FULLNAME = this.titlecasePipe.transform(this.User_Name_Edit_ngModel.trim());
    //NICKNAME
    //SALUTATION
    this.userinfo_entry.MANAGER_USER_GUID = this.User_Approver1_Edit_ngModel.trim();
    this.userinfo_entry.PERSONAL_ID_TYPE = this.User_StaffID_Edit_ngModel.trim();
    this.userinfo_entry.PERSONAL_ID = this.User_ICNo_Edit_ngModel.trim();
    this.userinfo_entry.DOB = this.User_DOB_Edit_ngModel.trim();
    this.userinfo_entry.GENDER = this.User_Gender_Edit_ngModel;
    this.userinfo_entry.JOIN_DATE = this.User_JoinDate_Edit_ngModel.trim();
    this.userinfo_entry.MARITAL_STATUS = this.User_Marital_Edit_ngModel;
    this.userinfo_entry.BRANCH = this.User_Branch_Edit_ngModel.trim();
    //this.userinfo_entry.EMPLOYEE_TYPE = this.User_EmployeeType_Edit_ngModel.trim()===undefined?this.EmployeeTypeAdjuster:this.User_EmployeeType_Edit_ngModel.trim();
    this.userinfo_entry.EMPLOYEE_TYPE = this.User_EmployeeType_Edit_ngModel;

    if (localStorage.getItem("Unique_File_Name") != undefined) {
      this.userinfo_entry.ATTACHMENT_ID = localStorage.getItem("Unique_File_Name");
    }
    else {
      this.userinfo_entry.ATTACHMENT_ID = null;
    }

    // this.userinfo_entry.APPROVER1 = this.User_Approver1_ngModel.trim();
    // this.userinfo_entry.APPROVER2 = this.User_Approver2_ngModel.trim();
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

    // this.userinfo_entry.POST_CODE
    // this.userinfo_entry.COUNTRY_GUID
    // this.userinfo_entry.STATE_GUID
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

    this.userservice.update_user_info(this.userinfo_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          this.Update_User_Address();
        }
      });
  }

  Save_User_Address() {
    this.useraddress_entry.USER_ADDRESS_GUID = UUID.UUID();
    this.useraddress_entry.USER_GUID = this.usermain_entry.USER_GUID;
    //ADDRESS_TYPE
    this.useraddress_entry.USER_ADDRESS1 = this.titlecasePipe.transform(this.User_Address1_ngModel);
    this.useraddress_entry.USER_ADDRESS2 = this.titlecasePipe.transform(this.User_Address2_ngModel);
    this.useraddress_entry.USER_ADDRESS3 = this.titlecasePipe.transform(this.User_Address3_ngModel);
    this.useraddress_entry.CREATION_TS = new Date().toISOString();
    this.useraddress_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
    this.useraddress_entry.UPDATE_TS = new Date().toISOString();
    this.useraddress_entry.UPDATE_USER_GUID = "";
    this.useraddress_entry.POST_CODE = this.User_PostCode_ngModel;
    this.useraddress_entry.COUNTRY_GUID = this.User_Country_ngModel;
    this.useraddress_entry.STATE_GUID = this.User_State_ngModel;
    this.userservice.save_user_address(this.useraddress_entry)

      .subscribe((response) => {
        if (response.status == 200) {
          this.Save_User_Company();
          //alert("User Address inserted");
        }
      });
  }

  Update_User_Address() {
    this.useraddress_entry.USER_ADDRESS_GUID = this.USER_GUID_FOR_ADDRESS;
    this.useraddress_entry.USER_GUID = this.usermain_entry.USER_GUID;
    //ADDRESS_TYPE
    this.useraddress_entry.USER_ADDRESS1 = this.titlecasePipe.transform(this.User_Address1_Edit_ngModel);
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
          //alert('3');
          this.Update_User_Company();
          //alert(this.useraddress_entry.USER_ADDRESS2);
        }
      });
  }

  Save_User_Company() {
    this.usercompany_entry.USER_COMPANY_GUID = UUID.UUID();
    this.usercompany_entry.USER_GUID = this.usermain_entry.USER_GUID;
    this.usercompany_entry.TENANT_COMPANY_SITE_GUID = this.User_Branch_ngModel;
    this.usercompany_entry.COMPANY_CONTACT_NO = this.User_CompanyNo_ngModel;
    this.usercompany_entry.CREATION_TS = new Date().toISOString();
    this.usercompany_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
    this.usercompany_entry.UPDATE_TS = new Date().toISOString();
    this.usercompany_entry.UPDATE_USER_GUID = "";

    this.userservice.save_user_company(this.usercompany_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          this.Save_User_Contact();
          //alert("User Company inserted");
        }
      });
  }

  Update_User_Company() {
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

  Save_User_Contact() {
    this.usercontact_entry.CONTACT_NO = this.User_PersonalNo_ngModel.trim();
    this.usercontact_entry.CONTACT_INFO_GUID = UUID.UUID();
    this.usercontact_entry.USER_GUID = this.usermain_entry.USER_GUID;
    this.usercontact_entry.CREATION_TS = new Date().toISOString();
    this.usercontact_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
    this.usercontact_entry.UPDATE_TS = new Date().toISOString();
    this.usercontact_entry.UPDATE_USER_GUID = "";

    this.userservice.save_user_contact(this.usercontact_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          //alert('5');
          let uploadImage = this.UploadImage_Old('avatar2', this.fileName2);
          uploadImage.then((resJson) => {
            console.table(resJson)
            let imageResult = this.SaveImageinDB(this.fileName2);
            imageResult.then((objImage: ImageUpload_model) => {
              let result = this.Save_User_Qualification(objImage.Image_Guid);


              //alert("User Contact inserted");
            })
          })
          //this.Save_User_Qualification()
        }
      });
  }

  Update_User_Contact() {
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
          let uploadImage = this.UploadImage_Old('avatar2', this.fileName2);
          uploadImage.then((resJson) => {
            console.table(resJson)
            let imageResult = this.SaveImageinDB(this.fileName2);
            imageResult.then((objImage: ImageUpload_model) => {
              let result = this.Update_User_Qualification(objImage.Image_Guid);

              // if (this.view_user_details[0]["QUALIFICATION_GUID"] != "") {
              //   let result = this.Update_User_Qualification(objImage.Image_Guid);
              // }
              // else {
              //   let result = this.Save_User_Qualification(objImage.Image_Guid);
              // }
            })
          })
          //this.Update_User_Qualification()
        }
      });
  }

  Save_User_Qualification(imageGUID: string) {
    let userqualification_entry: UserQualification_Model = new UserQualification_Model();
    this.userqualification_entry.USER_QUALIFICATION_GUID = UUID.UUID();
    this.userqualification_entry.QUALIFICATION_GUID = this.User_HighestQualification_ngModel;
    //this.userqualification_entry.QUALIFICATION_GUID = "";
    this.userqualification_entry.USER_GUID = this.usermain_entry.USER_GUID;
    this.userqualification_entry.CREATION_TS = new Date().toISOString();
    this.userqualification_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
    this.userqualification_entry.UPDATE_TS = new Date().toISOString();
    this.userqualification_entry.UPDATE_USER_GUID = "";
    this.userqualification_entry.HIGHEST_QUALIFICATION = this.User_HighestQualification_ngModel;

    //this.userqualification_entry.HIGHEST_QUALIFICATION = "";
    this.userqualification_entry.MAJOR = this.User_Major_ngModel;
    this.userqualification_entry.UNIVERSITY = this.User_University_ngModel;
    this.userqualification_entry.YEAR = this.User_EduYear_ngModel;
    this.userqualification_entry.ATTACHMENT = imageGUID;
    console.log(imageGUID);

    this.userservice.save_user_qualification(this.userqualification_entry)
      .subscribe(
        (response) => {
          if (response.status == 200) {

            let uploadImage = this.UploadImage_Old('avatar3', this.fileName3);
            uploadImage.then((resJson) => {
              console.table(resJson)
              let imageResult = this.SaveImageinDB(this.fileName3);
              imageResult.then((objImage: ImageUpload_model) => {
                let result = this.Save_User_Certification(objImage.Image_Guid);
                //alert("User Qualification inserted");
              })
            })

            //this.Save_User_Certification();
            this.Save_User_Spouse();
            this.Save_User_Children();
            this.Save_Role();

            alert('User inserted successfully.');
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        });

    return new Promise((resolve, reject) => {
      this.api.postData('user_qualification', userqualification_entry.toJson(true)).subscribe((data) => {

        let res = data.json();
        console.log(res)
        let ClaimRequestMainIdType2 = res["resource"][0].USER_QUALIFICATION_GUID;
        resolve(ClaimRequestMainIdType2);
      })
    });
  }

  Update_User_Qualification(imageGUID: string) {
    let userqualification_entry: UserQualification_Model = new UserQualification_Model();
    this.userqualification_entry.USER_QUALIFICATION_GUID = this.USER_QUALIFICATION_GUID_FOR_UPDATE;
    this.userqualification_entry.QUALIFICATION_GUID = this.User_HighestQualification_Edit_ngModel;
    //this.userqualification_entry.QUALIFICATION_GUID = "";
    this.userqualification_entry.USER_GUID = this.usermain_entry.USER_GUID;

    this.userqualification_entry.CREATION_TS = this.usermain_entry.CREATION_TS;
    this.userqualification_entry.CREATION_USER_GUID = this.usermain_entry.CREATION_USER_GUID;

    this.userqualification_entry.UPDATE_TS = new Date().toISOString();
    this.userqualification_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");

    this.userqualification_entry.HIGHEST_QUALIFICATION = this.User_HighestQualification_Edit_ngModel;
    this.userqualification_entry.MAJOR = this.User_Major_Edit_ngModel;
    this.userqualification_entry.UNIVERSITY = this.User_University_Edit_ngModel;
    this.userqualification_entry.YEAR = this.User_EduYear_Edit_ngModel;
    this.userqualification_entry.ATTACHMENT = imageGUID;

    this.userservice.update_user_qualification(this.userqualification_entry)
      .subscribe(
        (response) => {
          if (response.status == 200) {

            let uploadImage = this.UploadImage_Old('avatar3', this.fileName3);
            uploadImage.then((resJson) => {
              console.table(resJson)
              let imageResult = this.SaveImageinDB(this.fileName3);
              imageResult.then((objImage: ImageUpload_model) => {
                let result = this.Update_User_Certification(objImage.Image_Guid);
              })
            })

            // this.Update_User_Certification();
            this.Update_User_Spouse();
            this.Update_User_Children();
            this.Update_Role();

            alert('User updated successfully.');
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        });

    return new Promise((resolve, reject) => {
      this.api.postData('user_qualification', userqualification_entry.toJson(true)).subscribe((data) => {

        let res = data.json();
        console.log(res)
        let ClaimRequestMainIdType2 = res["resource"][0].USER_QUALIFICATION_GUID;
        resolve(ClaimRequestMainIdType2);
      })
    });
  }

  //----Multiple Entry-------------------- 
  Save_User_Certification(imageGUID: string) {
    let UserCertification_Entry: UserCertification_Model = new UserCertification_Model();
    for (var item in this.ProfessionalCertification) {
      this.UserCertification_Entry.certificate_guid = this.ProfessionalCertification[item]["CERTIFICATE_GUID"];
      this.UserCertification_Entry.name = this.ProfessionalCertification[item]["NAME"];
      this.UserCertification_Entry.grade = this.ProfessionalCertification[item]["GRADE"];
      this.UserCertification_Entry.passing_year = this.ProfessionalCertification[item]["YEAR"];
      this.UserCertification_Entry.user_guid = this.usermain_entry.USER_GUID;
      this.UserCertification_Entry.attachment = imageGUID;
      console.log(imageGUID);

      this.UserCertification_Entry.creation_ts = new Date().toISOString();
      this.UserCertification_Entry.creation_user_guid = localStorage.getItem("g_USER_GUID");
      this.UserCertification_Entry.update_ts = "";
      this.UserCertification_Entry.update_user_guid = "";

      this.userservice.save_user_certification(this.UserCertification_Entry)
        .subscribe(
          (response) => {
            if (response.status == 200) {

              // alert('User Inserted Successfully!!');
              // this.navCtrl.setRoot(this.navCtrl.getActive().component);
              //alert("User Certification inserted");
            }
          });

      return new Promise((resolve, reject) => {
        this.api.postData('user_certification', UserCertification_Entry.toJson(true)).subscribe((data) => {

          let res = data.json();
          console.log(res)
          let ClaimRequestMainIdType3 = res["resource"][0].certificate_guid;
          resolve(ClaimRequestMainIdType3);
        })
      });
    }
  }

  Update_User_Certification(imageGUID: string) {
    //first Delete all the records------------------------------------------------------------    
    this.userservice.remove_multiple(this.usermain_entry.USER_GUID, "user_certification")
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
              this.UserCertification_Entry.attachment = imageGUID;

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

  Save_User_Spouse() {
    for (var item in this.FamilyDetails) {
      this.UserSpouse_Entry.SPOUSE_GUID = this.FamilyDetails[item]["SPOUSE_GUID"];
      this.UserSpouse_Entry.NAME = this.FamilyDetails[item]["NAME"];
      this.UserSpouse_Entry.ICNO = this.FamilyDetails[item]["ICNO"];
      this.UserSpouse_Entry.CREATION_TS = new Date().toISOString();
      this.UserSpouse_Entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
      this.UserSpouse_Entry.UPDATE_TS = "";
      this.UserSpouse_Entry.UPDATE_USER_GUID = "";
      this.UserSpouse_Entry.USER_GUID = this.usermain_entry.USER_GUID;
      this.userservice.save_user_spouse(this.UserSpouse_Entry)
        .subscribe(
          (response) => {
            if (response.status == 200) {

              // alert('User Inserted Successfully!!');
              // this.navCtrl.setRoot(this.navCtrl.getActive().component);
              //alert("User Spouse inserted");
            }
          });
    }
  }

  Update_User_Spouse() {
    //first Delete all the records------------------------------------------------------------    
    this.userservice.remove_multiple(this.usermain_entry.USER_GUID, "user_spouse")
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

  Save_User_Children() {
    for (var item in this.ChildrenDetails) {
      this.UserChildren_Entry.CHILD_GUID = this.ChildrenDetails[item]["CHILD_GUID"];
      this.UserChildren_Entry.NAME = this.ChildrenDetails[item]["NAME"];
      this.UserChildren_Entry.ICNO = this.ChildrenDetails[item]["ICNO"];
      this.UserChildren_Entry.GENDER = this.ChildrenDetails[item]["GENDER"];
      this.UserChildren_Entry.SPOUSE = this.ChildrenDetails[item]["SPOUSE"];
      this.UserChildren_Entry.CREATION_TS = new Date().toISOString();
      this.UserChildren_Entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
      this.UserChildren_Entry.UPDATE_TS = "";
      this.UserChildren_Entry.UPDATE_USER_GUID = "";
      this.UserChildren_Entry.USER_GUID = this.usermain_entry.USER_GUID;
      this.userservice.save_user_children(this.UserChildren_Entry)
        .subscribe(
          (response) => {
            if (response.status == 200) {
              // alert('User Inserted Successfully!!');
              // this.navCtrl.setRoot(this.navCtrl.getActive().component);
              //alert("User Child inserted");
            }
          });
    }
  }

  Update_User_Children() {
    //first Delete all the records------------------------------------------------------------    
    this.userservice.remove_multiple(this.usermain_entry.USER_GUID, "user_children")
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

  Save() {
    if (this.Userform) {
      //----------Check duplicate for email---------------
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      let url: string;
      url = this.baseResourceUrl2_URL + "user_main?filter=(EMAIL=" + this.User_Email_ngModel.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;

      this.http.get(url, options)
        .map(res => res.json())
        .subscribe(
          data => {
            let res = data["resource"];
            if (res.length == 0) {
              console.log("No records Found");
              if (this.Exist_Record == false) {
                this.loading = this.loadingCtrl.create({
                  content: 'Please wait...',
                });

                this.loading.present();

                // if (this.User_HighestQualification_ngModel != "") {

                // }
                this.Save_User_Main();

                this.loading.dismissAll();
              }
            }
            else {
              alert("The User is already Exist.")
            }
          },
          err => {
            this.Exist_Record = false;
            console.log("ERROR!: ", err);
          });
    }
  }

  Update(USER_GUID: any) {
    if (this.Userform) {
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...',
      });
      this.loading.present();
      this.Update_User_Main(USER_GUID);
      this.loading.dismissAll();


      // // let headers = new Headers();
      // // headers.append('Content-Type', 'application/json');
      // // let options = new RequestOptions({ headers: headers });

      // let url: string;
      // //let request_id = UUID.UUID();
      // //url = this.baseResource_Url + "claim_request_detail?filter=(DESCRIPTION=" + this.Travel_Description_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      // //url = this.baseResourceUrl2 + "user_main?filter=(USER_GUID=" + request_id + ')&api_key=' + constants.DREAMFACTORY_API_KEY;

      // // url = this.baseResourceUrl2_URL + "user_main?filter=(EMAIL=" + this.User_Email_Edit_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY;          
      // // this.http.get(url)
      // //   .map(res => res.json())
      // //   .subscribe(
      // //   data => {
      // //     let res = data["resource"];

      // //     if (res.length == 0) {
      // if (this.Exist_Record == false) {

      //   this.usermain_entry.EMAIL = this.User_Email_Edit_ngModel;
      //   this.usermain_entry.USER_GUID = this.USER_GUID_FOR_UPDATE;
      //   //this.usermain_entry.TENANT_GUID = "x";
      //   //this.usermain_entry.STAFF_ID	 = "y";
      //   //this.usermain_entry.PASSWORD = "z";
      //   //this.usermain_entry.LOGIN_ID = "925f21cf-7994-0716-b23c-ac8bff3167a4";
      //   this.usermain_entry.LOGIN_ID = this.User_LoginId_Edit_ngModel;
      //   this.usermain_entry.PASSWORD = this.User_Password_Edit_ngModel;
      //   //this.usermain_entry.ACTIVATION_FLAG = 1;
      //   this.usermain_entry.CREATION_TS = new Date().toISOString();
      //   this.usermain_entry.CREATION_USER_GUID = "1";
      //   this.usermain_entry.UPDATE_TS = new Date().toISOString();
      //   this.usermain_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");

      //   this.userservice.update_user_main(this.usermain_entry)
      //     .subscribe((response) => {
      //       if (response.status == 200) {
      //         alert('user_main updated successfully');
      //         //location.reload();


      //         this.userinfo_entry.FULLNAME = this.User_Name_Edit_ngModel;
      //         // this.viewuser_entry.NAME = this.User_Name_Edit_ngModel;                    
      //         this.userinfo_entry.MARITAL_STATUS = this.User_Marital_Edit_ngModel;
      //         this.userinfo_entry.PERSONAL_ID_TYPE = this.User_StaffID_Edit_ngModel;
      //         this.userinfo_entry.PERSONAL_ID = this.User_ICNo_Edit_ngModel;
      //         this.userinfo_entry.DOB = this.User_DOB_Edit_ngModel;
      //         this.userinfo_entry.GENDER = this.User_Gender_Edit_ngModel;
      //         this.userinfo_entry.USER_INFO_GUID = this.USER_INFO_GUID_FOR_UPDATE;
      //         this.userinfo_entry.USER_GUID = this.USER_GUID_FOR_UPDATE;
      //         this.userinfo_entry.CREATION_TS = new Date().toISOString();
      //         this.userinfo_entry.CREATION_USER_GUID = "1";
      //         this.userinfo_entry.UPDATE_TS = new Date().toISOString();
      //         this.userinfo_entry.UPDATE_USER_GUID = "";
      //         this.userinfo_entry.DESIGNATION_GUID = this.User_Designation_Edit_ngModel;
      //         this.userinfo_entry.TENANT_COMPANY_GUID = this.User_Company_Edit_ngModel;

      //         this.userinfo_entry.DEPT_GUID = this.User_Department_Edit_ngModel;
      //         this.userinfo_entry.JOIN_DATE = this.User_JoinDate_Edit_ngModel;
      //         this.userinfo_entry.CONFIRMATION_DATE = this.User_ConfirmationDate_Edit_ngModel;
      //         this.userinfo_entry.RESIGNATION_DATE = this.User_ResignationDate_Edit_ngModel;
      //         this.userinfo_entry.BRANCH = this.User_Branch_Edit_ngModel;
      //         this.userinfo_entry.EMPLOYEE_TYPE = this.User_EmployeeType_Edit_ngModel;
      //         this.userinfo_entry.APPROVER1 = this.User_Approver1_Edit_ngModel;
      //         this.userinfo_entry.APPROVER2 = this.User_Approver2_Edit_ngModel;
      //         this.userinfo_entry.EMPLOYEE_STATUS = this.User_Employment_Edit_ngModel;

      //         this.userservice.update_user_info(this.userinfo_entry)
      //           .subscribe((response) => {
      //             if (response.status == 200) {
      //               alert('user_info Updated successfully');
      //               this.navCtrl.setRoot(this.navCtrl.getActive().component);
      //             }
      //           });

      //         this.navCtrl.setRoot(this.navCtrl.getActive().component);
      //       }
      //     });

      //   this.usercontact_entry.CONTACT_NO = this.User_PersonalNo_Edit_ngModel.trim();
      //   //this.usercontact_entry.CONTACT_INFO_GUID = this.USER_GUID_FOR_CONTACT;
      //   this.usercontact_entry.CONTACT_INFO_GUID = this.USER_GUID_FOR_CONTACT;
      //   this.usercontact_entry.USER_GUID = this.USER_GUID_FOR_UPDATE;
      //   this.usercontact_entry.CREATION_TS = new Date().toISOString();
      //   this.usercontact_entry.CREATION_USER_GUID = "1";
      //   this.usercontact_entry.UPDATE_TS = new Date().toISOString();
      //   this.usercontact_entry.UPDATE_USER_GUID = "";

      //   this.userservice.update_user_contact(this.usercontact_entry)
      //     .subscribe((response) => {
      //       if (response.status == 200) {
      //         alert('user_contact Registered successfully');

      //         this.navCtrl.setRoot(this.navCtrl.getActive().component);
      //       }
      //     });

      //   this.usercompany_entry.COMPANY_CONTACT_NO = this.User_CompanyNo_Edit_ngModel.trim();
      //   this.usercompany_entry.USER_COMPANY_GUID = this.USER_GUID_FOR_COMPANY_CONTACT;
      //   this.usercompany_entry.USER_GUID = this.USER_GUID_FOR_UPDATE;
      //   this.usercompany_entry.CREATION_TS = new Date().toISOString();
      //   this.usercompany_entry.CREATION_USER_GUID = "1";
      //   this.usercompany_entry.UPDATE_TS = new Date().toISOString();
      //   this.usercompany_entry.UPDATE_USER_GUID = "";

      //   this.userservice.update_user_company(this.usercompany_entry)
      //     .subscribe((response) => {
      //       if (response.status == 200) {
      //         alert('user_company Registered successfully');
      //         //location.reload();
      //         this.navCtrl.setRoot(this.navCtrl.getActive().component);
      //       }
      //     });

      //   this.useraddress_entry.USER_ADDRESS1 = this.User_Address1_Edit_ngModel.trim();
      //   this.useraddress_entry.USER_ADDRESS2 = this.User_Address2_Edit_ngModel.trim();
      //   this.useraddress_entry.USER_ADDRESS3 = this.User_Address3_Edit_ngModel.trim();
      //   this.useraddress_entry.USER_ADDRESS_GUID = this.USER_GUID_FOR_ADDRESS;
      //   this.useraddress_entry.USER_GUID = this.USER_GUID_FOR_UPDATE;
      //   this.useraddress_entry.CREATION_TS = new Date().toISOString();
      //   this.useraddress_entry.CREATION_USER_GUID = "1";
      //   this.useraddress_entry.UPDATE_TS = new Date().toISOString();
      //   this.useraddress_entry.UPDATE_USER_GUID = "";

      //   this.userservice.update_user_address(this.useraddress_entry)

      //     .subscribe((response) => {
      //       if (response.status == 200) {
      //         alert('user_address Registered successfully');
      //         //location.reload();
      //         this.navCtrl.setRoot(this.navCtrl.getActive().component);
      //       }
      //     });
      // }
    }
  }

  Save_Role() {
    for (var ROLE_GUID of this.ROLE_ngModel_Add) {
      this.userrole_entry.USER_ROLE_GUID = UUID.UUID();
      this.userrole_entry.USER_GUID = this.usermain_entry.USER_GUID;
      this.userrole_entry.ROLE_GUID = ROLE_GUID;
      this.userrole_entry.ACTIVATION_FLAG = "1";
      this.userrole_entry.CREATION_TS = new Date().toISOString();
      this.userrole_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
      this.userrole_entry.UPDATE_TS = new Date().toISOString();
      this.userrole_entry.UPDATE_USER_GUID = "";

      this.userservice.save_user_role(this.userrole_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            // alert('Tenant User Registered successfully');
            // this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        });
    }
  }

  Update_Role() {
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

  ROLE_ngModel_Add: any;
  ROLE_ngModel_Edit: any;

  ClearControls() {
    this.User_Name_ngModel = "";
    this.User_Email_ngModel = "";
    this.User_LoginId_ngModel = "";
    this.User_Password_ngModel = "";
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
    // this.User_Approver2_ngModel = "";
    this.User_EmployeeType_ngModel = "";
    this.User_Employment_ngModel = "";

    this.User_HighestQualification_ngModel = "";
    this.User_University_ngModel = "";
    this.User_Major_ngModel = "";
    this.User_EduYear_ngModel = "";

    this.User_Certification_ngModel = "";
    this.User_CertificationYear_ngModel = "";
    this.User_CertificationGrade_ngModel = "";
    this.ProfessionalCertification = [];

    this.User_Address1_ngModel = "";
    this.User_Address2_ngModel = "";
    this.User_Address3_ngModel = "";
    this.User_PostCode_ngModel = "";
    this.User_Country_ngModel = "";
    this.User_State_ngModel = "";

    this.User_Spouse_Name_ngModel = "";
    this.User_Spouse_IcNumber_ngModel = "";
    this.FamilyDetails = [];

    this.User_Child_Name_ngModel = "";
    this.User_Child_IcNumber_ngModel = "";
    this.User_Child_Gender_ngModel = "";
    this.User_SpouseChild_ngModel = "";
    this.ChildrenDetails = [];

    this.User_EMG_CONTACT_NAME1_ngModel = "";
    this.User_EMG_RELATIONSHIP_ngModel = "";
    this.User_EMG_CONTACT_NO1_ngModel = "";
    this.User_EMG_CONTACT_NAME2_ngModel = "";
    this.User_EMG_RELATIONSHIP2_ngModel = "";
    this.User_EMG_CONTACT_NO2_ngModel = "";

    this.User_EPF_NUMBER_ngModel = "";
    this.User_INCOMETAX_NO_ngModel = "";
    this.User_BANK_NAME_ngModel = "";

    //-----------------------------------------------

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
    // this.User_Approver1_ngModel = "";
    // this.User_Approver2_ngModel = "";
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

    this.ROLE_ngModel_Add = "";
    this.ROLE_ngModel_Edit = "";
  }

  lastImage: string = null;
  loading: Loading;

  public pathForImage(img: any) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  private presentToast(text: any) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  public takePicture(sourceType: any) {
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
    this.camera.getPicture(options).then((imagePath) => {
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }

  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  private copyFileToLocalDir(namePath: any, currentName: any, newFileName: any) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  ProfileImage: any;
  fileList: FileList;

  private ProfileImageDisplay_old(e: any, fileChoose: string): void {
    let reader = new FileReader();
    if (e.target.files && e.target.files[0]) {

      const file = e.target.files[0];
      this.Userform.get(fileChoose).setValue(file);
      if (fileChoose === 'avatar1')
        this.fileName1 = file.name;

      reader.onload = (event: any) => {
        this.ProfileImage = event.target.result;
      }
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  public ImageField: any;
  baseUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/files/eclaim/car1.jpg' + '?api_key=' + constants.DREAMFACTORY_API_KEY;

  DisplayFamily() {
    if (this.User_Marital_ngModel == "1") {
      this.MaritalStatusMarried = true;
    }
    else {
      this.MaritalStatusMarried = false;
    }
  }

  DisplayFamily_Edit() {
    if (this.User_Marital_Edit_ngModel == "1") {
      this.MaritalStatusMarried = true;
    }
    else {
      this.MaritalStatusMarried = false;
    }
  }

  GetQualificationID() {
    alert(this.User_HighestQualification_ngModel);
  }











  // fileName1: string; 
  // ProfileImage: any; 
  imageGUID: any;
  // uploadFileName: string; 
  chooseFile: boolean = false;
  newImage: boolean = true;
  ImageUploadValidation: boolean = false;

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
    uploadImage.then((resJson) => {
      this.imageGUID = this.uploadFileName;
      this.chooseFile = false;
      this.ImageUploadValidation = true;
    })
  }

  // CloudFilePath: string;
  UploadImage() {
    this.CloudFilePath = 'eclaim/'
    // this.loading = true;
    let uniqueName = new Date().toISOString() + this.uploadFileName; console.log(uniqueName); localStorage.setItem("Unique_File_Name", uniqueName);
    const queryHeaders = new Headers();
    queryHeaders.append('filename', this.uploadFileName);
    queryHeaders.append('Content-Type', 'multipart/form-data');
    queryHeaders.append('fileKey', 'file');
    queryHeaders.append('chunkedMode', 'false');
    queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
    const options = new RequestOptions({ headers: queryHeaders });
    return new Promise((resolve, reject) => {
      this.http.post('http://api.zen.com.my/api/v2/files/' + this.CloudFilePath + uniqueName, this.Userform.get('avatar').value, options)
        .map((response) => {
          return response;
        }).subscribe((response) => {
          resolve(response.json());
        })
    })
  }
}