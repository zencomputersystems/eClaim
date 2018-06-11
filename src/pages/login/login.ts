import { Component } from '@angular/core';
import { NgForm, FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import CryptoJS from 'crypto-js';

import { UserData } from '../../providers/user-data';
import { TabsPage } from '../tabs/tabs';
import { SignupPage } from '../signup/signup';
import * as constants from '../../app/config/constants';
import { Conditional } from '@angular/compiler';
import { Cordova } from '@ionic-native/core';
import { SetupPage } from '../setup/setup';
import { AdminsetupPage } from '../adminsetup/adminsetup';
import { SetupguidePage } from '../setupguide/setupguide';

import { DashboardPage } from '../dashboard/dashboard';

import { UserMain_Model } from '../../models/user_main_model';
import { UserSetup_Service } from '../../services/usersetup_service';

// import { SpeakerListPage } from '../home/home';
// import { ApproverTaskListPage } from '../approver-task-list/approver-task-list';
import { Storage } from '@ionic/storage';
import { BaseHttpService } from '../../services/base-http';

@Component({
  selector: 'page-user',
  templateUrl: 'login.html', providers: [UserSetup_Service, BaseHttpService]
})
export class LoginPage {
  login: { username?: string, password?: string } = {};
  submitted = false;

  //baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_bank' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  constructor(public navCtrl: NavController, public userData: UserData, public http: Http, public storage: Storage, fb: FormBuilder, private userservice: UserSetup_Service) {
    localStorage.clear(); //debugger;

    this.ForgotPasswordForm = fb.group({
      Email_ID: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}'), Validators.required])],
    });
  }

  onLogin(form: NgForm) {
    // this.navCtrl.push(DashboardPage);
    this.submitted = true;
    if (form.valid) {
      //-----------Check if the login as super vendor-----------------------
      if (this.login.username.trim() == "sva" && this.login.password.trim() == "sva") {
        localStorage.setItem("g_USER_GUID", "sva");

        //navigate to app.component page
        this.userData.login(this.login.username);

        //this.navCtrl.push(AdminsetupPage);
        this.navCtrl.push(SetupguidePage);
      }
      else {
        let url: string;

        //CryptoJS.SHA256(this.login.password.trim()).toString(CryptoJS.enc.Hex)
        url = this.baseResource_Url + "vw_login?filter=(LOGIN_ID=" + this.login.username + ')and(PASSWORD=' + CryptoJS.SHA256(this.login.password.trim()).toString(CryptoJS.enc.Hex) + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
        //url = this.baseResource_Url + "vw_login?filter=(LOGIN_ID=" + this.login.username + ')and(PASSWORD=' + this.login.password + ')&api_key=' + constants.DREAMFACTORY_API_KEY;

        this.http
          .get(url)
          .map(res => res.json())
          .subscribe(data => {
            let res = data["resource"];//console.log(data["resource"]);
            if (res.length > 0) {
              localStorage.setItem("g_USER_GUID", res[0]["USER_GUID"]);
              localStorage.setItem("g_TENANT_GUID", res[0]["TENANT_GUID"]);
              localStorage.setItem("g_EMAIL", res[0]["EMAIL"]);
              localStorage.setItem("g_FULLNAME", res[0]["FULLNAME"]);
              localStorage.setItem("g_TENANT_COMPANY_GUID", res[0]["TENANT_COMPANY_GUID"]);
              localStorage.setItem("g_TENANT_COMPANY_SITE_GUID", res[0]["TENANT_COMPANY_SITE_GUID"]);
              localStorage.setItem("g_ISHQ", res[0]["ISHQ"]);
              localStorage.setItem("g_IS_TENANT_AMDIN", res[0]["IS_TENANT_ADMIN"]);

              // //Keep all the module to an array.-------------------------------------------
              // let MenuDetails: any[] = [];
              // this.storage.get('MenuDetails').then((val) => {                
              //   MenuDetails.push(
              //     { title: 'HOME', name: 'TabsPage', component: TabsPage, tabComponent: SpeakerListPage, index: 0, icon: 'apps' },
              //     { title: 'APPROVER TASK', name: 'ApproverTaskListPage', component: TabsPage, tabComponent: ApproverTaskListPage, index: 3, icon: 'checkbox-outline' },
              //   );
              // });
              // //MenuDetails.push(this.navParams.get('id'));
              // this.storage.set('MenuDetails', MenuDetails);
              // //------------------------------------------------------------------------------

              //Setup Guide for only Hq Users
              if (res[0]["ISHQ"] == "1" && res[0]["IS_TENANT_ADMIN"] == "1") {
                this.navCtrl.push(SetupguidePage);
              }
              else {
                //this.navCtrl.push(SetupPage);
                this.navCtrl.push(DashboardPage);
              }

              //navigate to app.component page
              this.userData.login(this.login.username);
            }
            else {
              localStorage.removeItem("g_USER_GUID");
              localStorage.removeItem("g_TENANT_GUID");
              localStorage.removeItem("g_EMAIL");
              localStorage.removeItem("g_FULLNAME");
              localStorage.removeItem("g_TENANT_COMPANY_GUID");
              localStorage.removeItem("g_TENANT_COMPANY_SITE_GUID");
              localStorage.removeItem("g_ISHQ");
              localStorage.removeItem("g_IS_TENANT_ADMIN");

              alert("please enter valid login details.");
              this.login.username = "";
              this.login.password = "";
            }
          });
        // .catch((err) =>{ 
        //   alert('Sorry.'); 
        // });
      }

      // this.userData.login(this.login.username);
      // this.navCtrl.push(TabsPage);
    }
  }

  onSignup() {
    this.navCtrl.push(SignupPage);
  }

  ForgotPasswordForm: FormGroup;
  ForgotPasswordClicked: boolean;
  email_ngModel: any;
  usermain_entry: UserMain_Model = new UserMain_Model();


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
          let strPassword: string = this.Random().toString();
          let strPasswordHex: string = CryptoJS.SHA256(strPassword).toString(CryptoJS.enc.Hex);

          //Update to database------------------------          
          
          this.usermain_entry.TENANT_GUID = res[0]["TENANT_GUID"]
          this.usermain_entry.USER_GUID = res[0]["USER_GUID"];
          this.usermain_entry.STAFF_ID = res[0]["STAFF_ID"];

          this.usermain_entry.LOGIN_ID = this.email_ngModel;
          this.usermain_entry.PASSWORD = strPasswordHex;
          this.usermain_entry.EMAIL = this.email_ngModel ;

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
              debugger;
              this.sendEmail(res[0]["FULLNAME"], this.email_ngModel, strPassword);
            }
          });
        }
        else {
          alert('Invalid Email Id.');
        }
      });
  }

  Random(): string {
    let rand = Math.random().toString(10).substring(2, 8)
    return rand;
  }

  emailUrl: string = 'http://api.zen.com.my/api/v2/zenmail?api_key=' + constants.DREAMFACTORY_API_KEY;
  sendEmail(strName:string, strEmail: string, strPassword: string) {
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
              '<IMG style="WIDTH: 130px" alt=zen2.png src="http://zentranet.zen.com.my/_catalogs/masterpage/Layout/images/zen2.png">' +
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
      .subscribe(data => {
        
        alert('Password has sent to your eMail Id.');
        this.navCtrl.push(LoginPage);
      });
  }
}
