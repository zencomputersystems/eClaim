import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import * as constants from '../../app/config/constants';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { BaseHttpService } from '../../services/base-http';
import { TranslateService } from '@ngx-translate/core';
import 'rxjs/add/operator/map';
import CryptoJS from 'crypto-js';

import { UserMain_Model } from '../../models/user_main_model';
import { UserSetup_Service } from '../../services/usersetup_service';
import { ApiManagerProvider } from '../../providers/api-manager.provider';
import { LoginPage } from '../login/login';
import moment from 'moment';

/**
 * Generated class for the ChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html', providers: [UserSetup_Service, BaseHttpService]
})
export class ChangePasswordPage {
  ChangePasswordForm: FormGroup;
  usermain_entry: UserMain_Model = new UserMain_Model();
  
  loading: Loading;
  constructor(public api: ApiManagerProvider,private fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams, public http: Http, private userservice: UserSetup_Service, private httpService: BaseHttpService, private loadingCtrl: LoadingController) {
    if (localStorage.getItem("g_USER_GUID") == null) {
      alert('Sorry, please login.');
      this.navCtrl.push(LoginPage);
    }
    else {
      if (localStorage.getItem("g_USER_GUID") == "sva") {
        alert('Sorry, you are not authorized.');
        this.navCtrl.setRoot(this.navCtrl.getActive().component);
      }
      else {
        //Get the details of user according to user_guid.
        //------------------------------------------------
        this.GetUser_Main_Details(localStorage.getItem("g_USER_GUID"));
        //------------------------------------------------
      }
    }
    this.ChangePasswordForm = fb.group({
      Current_Password: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],      
      New_Password: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]{5,7}'), Validators.required])],
      Confirm_Password: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]{5,7}'), Validators.required])],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');
  }

  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
  url = this.baseResource_Url + "user_main?filter=(USER_GUID=" + localStorage.getItem("g_USER_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
  user_details: any;

  GetUser_Main_Details(user_id: string) {
    this.http
      .get(this.url)
      .map(res => res.json())
      .subscribe(data => {
        this.user_details = data.resource; //console.log(this.user_details);
      });
  }

  Current_Password_ngModel: any = "";
  New_Password_ngModel: any = "";
  Confirm_Password_ngModel: any = "";

  ChangePassword() {
    if (this.ChangePasswordForm.valid) {      
      // let hash = CryptoJS.SHA256(this.Current_Password_ngModel.trim()).toString(CryptoJS.enc.Hex);
      // console.log(hash);

      //check current password is match with database      
      if (this.user_details[0]["PASSWORD"] == CryptoJS.SHA256(this.Current_Password_ngModel.trim()).toString(CryptoJS.enc.Hex)) {
        if (this.Current_Password_ngModel.trim().toUpperCase() != this.Confirm_Password_ngModel.trim().toUpperCase()) {
          if (this.New_Password_ngModel.trim().toUpperCase() == this.Confirm_Password_ngModel.trim().toUpperCase()) {            

            this.loading = this.loadingCtrl.create({
              content: 'Please wait...',
            });
            this.loading.present();

            this.usermain_entry.TENANT_GUID = this.user_details[0]["TENANT_GUID"];
            this.usermain_entry.USER_GUID = localStorage.getItem("g_USER_GUID");
            this.usermain_entry.STAFF_ID = this.user_details[0]["STAFF_ID"];
            this.usermain_entry.LOGIN_ID = this.user_details[0]["LOGIN_ID"];
            this.usermain_entry.PASSWORD = CryptoJS.SHA256(this.Confirm_Password_ngModel.trim()).toString(CryptoJS.enc.Hex);
            this.usermain_entry.EMAIL = this.user_details[0]["EMAIL"];
            this.usermain_entry.ACTIVATION_FLAG = this.user_details[0]["ACTIVATION_FLAG"];

            this.usermain_entry.CREATION_TS = this.user_details[0]["CREATION_TS"];
            this.usermain_entry.CREATION_USER_GUID = this.user_details[0]["CREATION_USER_GUID"];

            this.usermain_entry.UPDATE_TS = this.api.CreateTimestamp();
            this.usermain_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");

            this.usermain_entry.IS_TENANT_ADMIN = this.user_details[0]["IS_TENANT_ADMIN"];

            this.userservice.update_user_main(this.usermain_entry)
              .subscribe((response) => {
                if (response.status == 200) {
                  this.sendEmail();
                }
              });
          }
          else {
            alert('New password and confirm password is not same.');
          }
        }
        else {
          alert('Current password and confirm password is same.');
        }
      }
      else{
        alert('Current password is not correct.');
      }
    }
  }
  
  emailUrl: string = 'http://api.zen.com.my/api/v2/zenmail?api_key=' + constants.DREAMFACTORY_API_KEY;
  sendEmail() {
    let name: string; let email: string
    name = localStorage.getItem("g_FULLNAME"); email = this.user_details[0]["EMAIL"];
    var queryHeaders = new Headers();
    queryHeaders.append('Content-Type', 'application/json');
    queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
    let options = new RequestOptions({ headers: queryHeaders });
    //let ename = 'Shabbeer Hussain';
    // let startDate = '1-1-2018 11:12';
    // let endDate = '1-1-2018 11:12';
    // let CreatedDate = '1-1-2018 11:12';
    // let level = '1';
    // let assignedTo = 'Bala';
    // let dept = 'Research';
    // let claimType = 'Travel Claim';

    let body = {
      "template": "",
      "template_id": 0,
      "to": [
        {
          "name": name,
          "email": email
        }
      ],
      "cc": [
        {
          "name": name,
          "email": email
        }
      ],
      "bcc": [
        {
          "name": name,
          "email": email
        }
      ],
      "subject": "Password changed.",
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
                  '<I>Change Password</I>' +
                '</B>' +
              '</DIV>' +
            '</DIV>' +
            '<BR>' +
            '<DIV style="FONT-SIZE: 12px; TEXT-ALIGN: left; PADDING-BOTTOM: 10px; PADDING-TOP: 10px; PADDING-LEFT: 20px; PADDING-RIGHT: 20px">Dear <h4>' + name + '</h4>' +
              '<BR>Your password has now been changed. From now on you will use your new password.' +
              
              
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
        // this.result= data["resource"];
        // alert(JSON.stringify(data));
        this.loading.dismissAll();
        
        alert('Password sucessfully changed.');
        this.navCtrl.push(LoginPage);
      });
  }
}
