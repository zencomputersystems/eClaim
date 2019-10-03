import { Component } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Loading, MenuController, NavController } from 'ionic-angular';
import 'rxjs/add/operator/map';
// import { SignupPage } from '../signup/signup';
import * as constants from '../../app/config/constants';
import { UserMain_Model } from '../../models/user_main_model';
import { sanitizeURL } from '../../providers/sanitizer/sanitizer';
import { UserData } from '../../providers/user-data';
import { BaseHttpService } from '../../services/base-http';
import { UserSetup_Service } from '../../services/usersetup_service';
import { EncryptPassword, Random } from '../../shared/GlobalFunction';
import { DashboardPage } from '../dashboard/dashboard';

@Component({
  selector: 'page-user',
  templateUrl: 'login.html', providers: [UserSetup_Service, BaseHttpService]
})
export class LoginPage {
  login: { username?: string, password?: string } = {};
  submitted = false;

  //baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_bank' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = sanitizeURL(constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/');

  constructor(
    public navCtrl: NavController,
    public menu: MenuController,
    public userData: UserData,
    public http: Http,
    public storage: Storage,
//    private Global_Function: GlobalFunction,
    fb: FormBuilder,
    private userservice: UserSetup_Service) {
    localStorage.clear(); //debugger;
    this.ForgotPasswordForm = fb.group({
      Email_ID: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}'), Validators.required])],
    });
  }

  ForgotPasswordForm: FormGroup;
  ForgotPasswordClicked: boolean;
  email_ngModel: any;
  usermain_entry: UserMain_Model = new UserMain_Model();

  Authenticate(form: NgForm) {
    let username = this.login.username.split("@")[0] || null;
    let domainname = this.login.username.trim().split("@")[1] || null;
    if (form.valid && username && domainname == "zen.com.my") {
      this.AuthenticateUserFromAdServer(username,this.login.password);

    } else if (form.valid && username && domainname) {
      this.onLogin(form)
    }
    else {
      alert("Sorry. That format is not supported. Please key in the username in valid format.");
    }
  }

  onLogin(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
        let url: string;
        url = this.baseResource_Url + "vw_login?filter=(LOGIN_ID=" + this.login.username + ')and(PASSWORD=' + EncryptPassword(this.login.password) + ')and(ACTIVATION_FLAG=1)&api_key=' + constants.DREAMFACTORY_API_KEY;
        this.http
          .get(url)
          .map(res => res.json())
          .subscribe(data => {
            let res = data["resource"];//console.log(data["resource"]);
            if (res.length > 0) {
              this.SetLSCommonUserVars(res)
              this.navCtrl.setRoot(DashboardPage);
/* 
              //Setup Guide for only Hq Users
              if (res[0]["ISHQ"] == "1" && res[0]["IS_TENANT_ADMIN"] == "1") {
                //this.navCtrl.push(SetupguidePage);
                this.navCtrl.setRoot(DashboardPage);
              }
              else {
                //this.navCtrl.push(SetupPage);
                this.navCtrl.setRoot(DashboardPage);
              }
 */
              //Get the role of that particular user----------------------------------------------
              let role_url: string = "";
              role_url = this.baseResource_Url + "view_role_display?filter=(USER_GUID=" + res[0]["USER_GUID"] + ')and(ROLE_PRIORITY_LEVEL=1)&api_key=' + constants.DREAMFACTORY_API_KEY;
              this.http
                .get(role_url)
                .map(res => res.json())
                .subscribe(data => {
                  let role_result = data["resource"];
                  this.SetLSUserRights(role_result);
                });

              //Get company settings details----------------------------------------------------------------------------------
              this.GetCompanySettings(localStorage.getItem("g_TENANT_GUID"));
              //--------------------------------------------------------------------------------------------------------------
              //navigate to app.component page
              this.userData.login(this.login.username);
            }
            else {
              this.RemoveLSCommonUserVars;
              localStorage.removeItem("Ad_Authenticaton");

              alert("Please enter valid login details.");
              this.login.username = "";
              this.login.password = "";
            }
          });
    }
  }

  /*
  onSignup() {
    this.navCtrl.push(SignupPage);
  }
*/
  
  ForgotPasswordClick() {
    this.ForgotPasswordClicked = true;
  }

  CloseForgotPasswordClick() {
    if (this.ForgotPasswordClicked == true) {
      this.ForgotPasswordClicked = false;
    }
  }

  SaveForgotPassword() {
    // through Email, check exist, temporary password generate and update to database, send mail notification to user.
    let url = this.baseResource_Url + "view_user_main_info?filter=(EMAIL=" + this.email_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http
      .get(url)
      .map(res => res.json())
      .subscribe(data => {
        let res = data["resource"];
        if (res.length > 0) {

          //Generate Password Encrypt-----------------
          var strPassword = Random();
          let strPasswordHex = EncryptPassword(strPassword);

          //Update to database------------------------          
          this.usermain_entry.TENANT_GUID = res[0]["TENANT_GUID"]
          this.usermain_entry.USER_GUID = res[0]["USER_GUID"];
          this.usermain_entry.STAFF_ID = res[0]["STAFF_ID"];

          this.usermain_entry.LOGIN_ID = this.email_ngModel;
          this.usermain_entry.PASSWORD = strPasswordHex;
          this.usermain_entry.EMAIL = this.email_ngModel;

          this.usermain_entry.ACTIVATION_FLAG = res[0]["ACTIVATION_FLAG"];
          this.usermain_entry.CREATION_TS = res[0]["CREATION_TS"];
          this.usermain_entry.CREATION_USER_GUID = res[0]["CREATION_USER_GUID"];
          this.usermain_entry.UPDATE_TS = new Date().toISOString();
          this.usermain_entry.UPDATE_USER_GUID = res[0]["UPDATE_USER_GUID"];
          this.usermain_entry.IS_TENANT_ADMIN = res[0]["IS_TENANT_ADMIN"];

          this.userservice.update_user_main(this.usermain_entry)
            .subscribe((response) => {
              if (response.status == 200) {
                //Send Mail---------------------------
                // debugger;
                this.sendEmail(res[0]["FULLNAME"], this.email_ngModel, strPassword);
              }
            });
        }
        else {
          alert('Invalid Email Id.');
        }
      });
  }

/*   Random(): string {
    let rand = Math.random().toString(10).substring(2, 8)
    return rand;
  }
 */

  emailUrl: string = 'http://api.zen.com.my/api/v2/zenmail?api_key=' + constants.DREAMFACTORY_API_KEY;
  sendEmail(strName: string, strEmail: string, strPassword: string) {
    let ImgageSrc: string = constants.DREAMFACTORY_IMAGE_URL + localStorage.getItem("cs_email_logo") + "?api_key=" + constants.DREAMFACTORY_API_KEY;
    let name: string; let email: string
    name = strName; email = strEmail;
    var queryHeaders = new Headers();
    queryHeaders.append('Content-Type', 'application/json');
    queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
    let options = new RequestOptions({ headers: queryHeaders });

    let body = {
      "template": "",
      "template_id": 0,
      "to": [
        {
          "name": name,
          "email": email
        }
      ],
      "subject": "Forgot Password.",
      "body_text": "",
      "body_html": '<HTML>' +
        '<HEAD>' +
        '<META name=GENERATOR content="MSHTML 10.00.9200.17606">' +
        '</HEAD>' +

        '<BODY>' +
        '<DIV style="FONT-FAMILY: Century Gothic">' +
        '<DIV style="MIN-WIDTH: 500px">' +
        '<BR>' +
        '<DIV style="PADDING-BOTTOM: 10px; TEXT-ALIGN: center; PADDING-TOP: 10px; PADDING-LEFT: 10px; PADDING-RIGHT: 10px">' +
        // '<IMG style="WIDTH: 130px" alt=zen2.png src="http://zentranet.zen.com.my/_catalogs/masterpage/Layout/images/zen2.png">' +
        '<IMG style="WIDTH: 130px" alt=zen2.png src=' + ImgageSrc + '>' +
        '</DIV>' +
        '<DIV style="MARGIN: 0px 100px; BACKGROUND-COLOR: #ec008c">' +
        '<DIV style="TEXT-ALIGN: center; FONT-SIZE: 30px; COLOR: white; PADDING-BOTTOM: 10px; PADDING-TOP: 10px; PADDING-LEFT: 20px; PADDING-RIGHT: 20px">' +
        '<B>' +
        '<I>Forgot Password</I>' +
        '</B>' +
        '</DIV>' +
        '</DIV>' +
        '<BR>' +
        '<DIV style="FONT-SIZE: 12px; TEXT-ALIGN: left; PADDING-BOTTOM: 10px; PADDING-TOP: 10px; PADDING-LEFT: 20px; PADDING-RIGHT: 20px">Dear <h4>' + name + '</h4>' +
        '<BR>Your temporary password is ' + strPassword + '. From now on you will use your new password.' +


        '</DIV>' +
        '<BR>' +
        '<DIV style="FONT-SIZE: 12px; TEXT-ALIGN: left; PADDING-BOTTOM: 10px; PADDING-TOP: 10px; PADDING-LEFT: 20px; PADDING-RIGHT: 20px">Thank you.</DIV>' +
        '</DIV>' +
        '</DIV>' +
        '</BODY>' +

        '</HTML>',
      "from_name": "eClaim",
      "from_email": "balasingh73@gmail.com",
      "reply_to_name": "",
      "reply_to_email": ""
    };
    this.http.post(this.emailUrl, body, options)
      .map(res => res.json())
      .subscribe(() => {
        alert('Password has sent to your eMail Id.');
        //          this.navCtrl.push(LoginPage);
      });
  }

  // stringToSplit: string = "";
  // tempUserSplit1: string = "";
  // tempUserSplit2: string = "";
  loading: Loading;

  AuthenticateUserFromAdServer(username: string, userpassword: string) {
      localStorage.removeItem("Ad_Authenticaton");
            let Adurl: string = constants.AD_URL + '/user/' + username + '/authenticate';
            console.log(Adurl);
            var headers = new Headers();
            headers.append("Accept", 'application/json');
            headers.append('Content-Type', 'application/json');
            let options = new RequestOptions({ headers: headers });
            let postParams = {
              password: userpassword
            }
            this.http.post(Adurl, postParams, options)
              .map(res => res.json())
              .subscribe(data => {
                if (data.data == true) {
                  // alert('Authenticate');
                  localStorage.setItem("Ad_Authenticaton", "true");
                  this.GetUserFromAdServer(username);
                }
                else {
                  this.RemoveLSCommonUserVars;
                  localStorage.removeItem("Ad_Authenticaton");
                  alert("please enter valid login details.");
                  this.login.username = "";
                  this.login.password = "";
                  // this.loading.dismissAll();
                }
              }, error => {
                console.log(error);// Error getting the data
              });
  }

  GetUserFromAdServer(username: string) {
      let Adurl: string = constants.AD_URL + '/user/' + username;

      var queryHeaders = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });

      queryHeaders.append('Access-Control-Allow-Origin', '*');
      queryHeaders.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
      queryHeaders.append('Accept', 'application/json');
      queryHeaders.append('Content-Type', 'application/json');

      this.http
        .get(Adurl)
        .map(res => res.json())
        .subscribe(data => {

          this.submitted = true;
              this.userData.login(username);
              // console.log(data.userPrincipalName);
              let url: string;
              url = this.baseResource_Url + "vw_login?filter=(EMAIL=" + data.userPrincipalName + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
              this.http
                .get(url)
                .map(res => res.json())
                .subscribe(data => {
                  let res = data["resource"];
                  if (res.length > 0) {
                    this.SetLSCommonUserVars(res);
                    this.navCtrl.setRoot(DashboardPage);
                    //Get the role of that particular user---------------------------------------------------------------------------
                    let role_url: string = "";
                    role_url = this.baseResource_Url + "view_role_display?filter=(USER_GUID=" + res[0]["USER_GUID"] + ')and(ROLE_PRIORITY_LEVEL=1)&api_key=' + constants.DREAMFACTORY_API_KEY;
                    this.http
                      .get(role_url)
                      .map(res => res.json())
                      .subscribe(data => {
                        let role_result = data["resource"];
                        this.SetLSUserRights(role_result);
                      });
                    //Get company settings details----------------------------------------------------------------------------------
                    this.GetCompanySettings(localStorage.getItem("g_TENANT_GUID"));
                    //--------------------------------------------------------------------------------------------------------------

                    //navigate to app.component page
                    this.userData.login(this.login.username);
                    // this.loading.dismissAll();
                  }
                  else {
                    this.RemoveLSCommonUserVars;
                    alert("Please enter valid login details.");
                    this.login.username = "";
                    this.login.password = "";
                  }
                });
        });
      // this.loading.dismissAll();
  }

  SetLSUserRights(role_result: any) {
    if (role_result.length > 0) {
      localStorage.setItem("g_KEY_ADD", "0");
      localStorage.setItem("g_KEY_EDIT", "0");
      localStorage.setItem("g_KEY_DELETE", "0");
      localStorage.setItem("g_KEY_VIEW", "0");
      for (var item in role_result) {
        if (role_result[item]["ROLE_NAME"] == "MAIN") {
          localStorage.setItem("g_ROLE_NAME", role_result[0]["ROLE_NAME"]);
        }
        else {
          localStorage.setItem("g_ROLE_NAME", "");
        }
        if (role_result[0]["KEY_ADD"] == "1") { localStorage.setItem("g_KEY_ADD", role_result[0]["KEY_ADD"]); }
        if (role_result[0]["KEY_EDIT"] == "1") { localStorage.setItem("g_KEY_EDIT", role_result[0]["KEY_EDIT"]); }
        if (role_result[0]["KEY_DELETE"] == "1") { localStorage.setItem("g_KEY_DELETE", role_result[0]["KEY_DELETE"]); }
        if (role_result[0]["KEY_VIEW"] == "1") { localStorage.setItem("g_KEY_VIEW", role_result[0]["KEY_VIEW"]); }
      }
    }
    else {
      localStorage.setItem("g_KEY_VIEW", "1");
      localStorage.removeItem("g_ROLE_NAME");
    }
  }
  SetLSCommonUserVars(res: any) {
    localStorage.setItem("g_USER_GUID", res[0]["USER_GUID"]);
    localStorage.setItem("g_TENANT_GUID", res[0]["TENANT_GUID"]);
    localStorage.setItem("g_EMAIL", res[0]["EMAIL"]);
    localStorage.setItem("g_FULLNAME", res[0]["FULLNAME"]);
    localStorage.setItem("g_TENANT_COMPANY_GUID", res[0]["TENANT_COMPANY_GUID"]);
    localStorage.setItem("g_TENANT_COMPANY_SITE_GUID", res[0]["TENANT_COMPANY_SITE_GUID"]);
    localStorage.setItem("g_ISHQ", res[0]["ISHQ"]);
    localStorage.setItem("g_IS_TENANT_ADMIN", res[0]["IS_TENANT_ADMIN"]);
    if (res[0]["IMAGE_URL"] == null || res[0]["IMAGE_URL"] == '') {
      localStorage.setItem("g_IMAGE_URL", "assets/img/profile_no_preview.png");
    }
    else {
      localStorage.setItem("g_IMAGE_URL", constants.IMAGE_VIEW_URL + res[0]["IMAGE_URL"]);
    }
  }

  RemoveLSCommonUserVars() {
    localStorage.removeItem("g_USER_GUID");
    localStorage.removeItem("g_TENANT_GUID");
    localStorage.removeItem("g_EMAIL");
    localStorage.removeItem("g_FULLNAME");
    localStorage.removeItem("g_TENANT_COMPANY_GUID");
    localStorage.removeItem("g_TENANT_COMPANY_SITE_GUID");
    localStorage.removeItem("g_ISHQ");
    localStorage.removeItem("g_IS_TENANT_ADMIN");
    localStorage.removeItem("g_IMAGE_URL");
  }

  KeyNameValue: any[] = []; KeyNameValueList: any;
  GetCompanySettings(STR_TENANT_GUID: string) {
    localStorage.removeItem("cs_date_format");
    localStorage.removeItem("cs_default_currency");
    localStorage.removeItem("cs_email_logo");
    localStorage.removeItem("cs_default_country");
    localStorage.removeItem("cs_max_claim_amt");
    localStorage.removeItem("cs_min_claim_amt");
    localStorage.removeItem("cs_claim_cutoff_date");
    localStorage.removeItem("cs_year_start_month");
    localStorage.removeItem("cs_year_end_month");
    localStorage.removeItem("cs_approval_cutoff_date");
    localStorage.removeItem("cs_default_payment_type");
    localStorage.removeItem("cs_default_language");
    localStorage.removeItem("cs_email_schedule");
    localStorage.removeItem("cs_email_time");

    localStorage.removeItem("draft_notification");
    localStorage.removeItem("profile_guid");
    localStorage.removeItem("cs_profile_guid");
    localStorage.removeItem("zone_wise_current_timestamp");
    this.KeyNameValue = [];
    let url: string = "";
    url = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/permission_keys' + '?filter=(TENANT_GUID=' + STR_TENANT_GUID + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http
      .get(url)
      .map(res => res.json())
      .subscribe(data => {
        this.KeyNameValueList = data.resource;
        for (var item in this.KeyNameValueList) {
          if (this.KeyNameValueList[item]["KEY_NAME"] == "date_format") { localStorage.setItem("cs_date_format", this.KeyNameValueList[item]["KEY_VALUE"]); }
          if (this.KeyNameValueList[item]["KEY_NAME"] == "default_currency") { localStorage.setItem("cs_default_currency", this.KeyNameValueList[item]["KEY_VALUE"]); }
          if (this.KeyNameValueList[item]["KEY_NAME"] == "email_logo") { localStorage.setItem("cs_email_logo", this.KeyNameValueList[item]["KEY_VALUE"]); }
          // if (this.KeyNameValueList[item]["KEY_NAME"] == "default_country") { localStorage.setItem("cs_default_country", this.KeyNameValueList[item]["KEY_VALUE"]); }

          if (this.KeyNameValueList[item]["KEY_NAME"] == "default_country") {
            var StartIndex = this.KeyNameValueList[item]["KEY_VALUE"].indexOf(",");
            var EndIndex = this.KeyNameValueList[item]["KEY_VALUE"].length - (StartIndex + 1);
            var KeyValue = this.KeyNameValueList[item]["KEY_VALUE"].substr(StartIndex + 1, EndIndex);

            localStorage.setItem("cs_default_country", KeyValue);
          }

          if (this.KeyNameValueList[item]["KEY_NAME"] == "max_claim_amt") { localStorage.setItem("cs_max_claim_amt", this.KeyNameValueList[item]["KEY_VALUE"]); }
          if (this.KeyNameValueList[item]["KEY_NAME"] == "min_claim_amt") { localStorage.setItem("cs_min_claim_amt", this.KeyNameValueList[item]["KEY_VALUE"]); }
          if (this.KeyNameValueList[item]["KEY_NAME"] == "claim_cutoff_date") { localStorage.setItem("cs_claim_cutoff_date", this.KeyNameValueList[item]["KEY_VALUE"]); }
          if (this.KeyNameValueList[item]["KEY_NAME"] == "month_start") { localStorage.setItem("cs_year_start_month", this.KeyNameValueList[item]["KEY_VALUE"]); }
          if (this.KeyNameValueList[item]["KEY_NAME"] == "month_end") { localStorage.setItem("cs_year_end_month", this.KeyNameValueList[item]["KEY_VALUE"]); }
          if (this.KeyNameValueList[item]["KEY_NAME"] == "approval_cutoff_date") { localStorage.setItem("cs_approval_cutoff_date", this.KeyNameValueList[item]["KEY_VALUE"]); }
          // if (this.KeyNameValueList[item]["KEY_NAME"] == "default_payment_type") { localStorage.setItem("cs_default_payment_type", this.KeyNameValueList[item]["KEY_VALUE"]); }

          if (this.KeyNameValueList[item]["KEY_NAME"] == "default_payment_type") {
            var StartIndex_1 = this.KeyNameValueList[item]["KEY_VALUE"].indexOf(",");
            var EndIndex_1 = this.KeyNameValueList[item]["KEY_VALUE"].length - (StartIndex_1 + 1);
            var KeyValue_1 = this.KeyNameValueList[item]["KEY_VALUE"].substr(StartIndex_1 + 1, EndIndex_1);

            localStorage.setItem("cs_default_payment_type", KeyValue_1);
          }

          if (this.KeyNameValueList[item]["KEY_NAME"] == "default_language") { localStorage.setItem("cs_default_language", this.KeyNameValueList[item]["KEY_VALUE"]); }
          if (this.KeyNameValueList[item]["KEY_NAME"] == "email_schedule") { localStorage.setItem("cs_email_schedule", this.KeyNameValueList[item]["KEY_VALUE"]); }
          if (this.KeyNameValueList[item]["KEY_NAME"] == "email_time") { localStorage.setItem("cs_email_time", this.KeyNameValueList[item]["KEY_VALUE"]); }

          if (this.KeyNameValueList[item]["KEY_NAME"] == "draft_notification") { localStorage.setItem("draft_notification", this.KeyNameValueList[item]["KEY_VALUE"]); }
          if (this.KeyNameValueList[item]["KEY_NAME"] == "profile_guid") { localStorage.setItem("cs_profile_guid", this.KeyNameValueList[item]["KEY_VALUE"]); }

          if (this.KeyNameValueList[item]["KEY_NAME"] == "default_time_zone") { localStorage.setItem("cs_timestamp", this.KeyNameValueList[item]["KEY_VALUE"]); }

        }
      });
  }

}