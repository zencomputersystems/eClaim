import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { Main_Profile_Model } from '../../models/main_profile_model';
import { ProfileSetup_Service } from '../../services/profilesetup_services';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';
import { GlobalFunction } from '../../shared/GlobalFunction';
import { LoginPage } from '../login/login';
/**
 * Generated class for the ProfileSetupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile-setup',
  templateUrl: 'profile-setup.html', providers: [ProfileSetup_Service, BaseHttpService, GlobalFunction]
})
export class ProfileSetupPage {
  NAME: any;
  profile_entry: Main_Profile_Model = new Main_Profile_Model();
  Profileform: FormGroup;
  current_profileGUID: string = '';
  public page:number = 1;
  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_profile' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  public profile_details: Main_Profile_Model[] = [];

  public AddProfileClicked: boolean = false;
  public EditProfileClicked: boolean = false;
  public Exist_Record: boolean = false;

  public profiles: any;
  public exist_record_details: any;

  //Set the Model Name for Add------------------------------------------
  public PROFILENAME_ngModel_Add: any;
  public XML_ngModel_Add: any;
  //---------------------------------------------------------------------

  //Set the Model Name for edit------------------------------------------
  public PROFILENAME_ngModel_Edit: any;
  public XML_ngModel_Edit: any;
  //---------------------------------------------------------------------

  constructor(private fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams, public http: Http, private httpService: BaseHttpService, private profilesetupservice: ProfileSetup_Service, private alertCtrl: AlertController, public GlobalFunction: GlobalFunction) {

    if (localStorage.getItem("g_USER_GUID") != null) {
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + "/api/v2/zcs/_table/main_profile?order=PROFILE_NAME&api_key=" + constants.DREAMFACTORY_API_KEY;
      this.http
        .get(this.baseResourceUrl)
        .map(res => res.json())
        .subscribe(data => {
          this.profiles = data.resource;
        });

      this.Profileform = fb.group({
        PROFILE_NAME: [null, Validators.required],
        PROFILE_XML: [null, Validators.required]
      });
    }
    else {
      this.navCtrl.push(LoginPage);
    }

  }

  public AddProfileClick() {
    this.AddProfileClicked = true;
    this.ClearControls();
  }

  public CloseProfilesClick() {
    if (this.AddProfileClicked == true) {
      this.AddProfileClicked = false;
    }
    if (this.EditProfileClicked == true) {
      this.EditProfileClicked = false;
    }
  }

  public EditClick(MAIN_PROFILE_GUID: any) {
    this.ClearControls();
    this.EditProfileClicked = true;
    this.current_profileGUID = MAIN_PROFILE_GUID;
    var self = this;
    this.profilesetupservice
      .get(MAIN_PROFILE_GUID)
      .subscribe((data) => {
        self.profile_entry = data;
        this.PROFILENAME_ngModel_Edit = self.profile_entry.PROFILE_NAME;
        this.XML_ngModel_Edit = self.profile_entry.PROFILE_XML;
        localStorage.setItem('Prev_Name', self.profile_entry.PROFILE_NAME);
      });
  }

  public DeleteClick(MAIN_PROFILE_GUID: any) {
    console.log(MAIN_PROFILE_GUID);
    let alert = this.alertCtrl.create({
      title: 'Remove Confirmation',
      message: 'Are you sure to remove?',
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
            this.profilesetupservice.remove(MAIN_PROFILE_GUID)
              .subscribe(() => {
                self.profile_details = self.profile_details.filter((item) => {
                  return item.MAIN_PROFILE_GUID != MAIN_PROFILE_GUID

                });
                this.navCtrl.setRoot(this.navCtrl.getActive().component);
              });
          }
        }
      ]
    }); alert.present();
  }

  Save_Profile() {
    if (this.Profileform.valid) {

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      let url: string;
      url = this.baseResource_Url + "main_profile?filter=(PROFILE_NAME=" + this.PROFILENAME_ngModel_Add.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;

      this.http.get(url, options)
        .map(res => res.json())
        .subscribe(
          data => {
            let res = data["resource"];
            if (res.length == 0) {
              console.log("No records Found");
              if (this.Exist_Record == false) {
                this.profile_entry.PROFILE_NAME = this.PROFILENAME_ngModel_Add.trim();
                this.profile_entry.PROFILE_XML = this.XML_ngModel_Add.trim();
                this.profile_entry.MAIN_PROFILE_GUID = UUID.UUID();
                this.profile_entry.TENANT_GUID = localStorage.getItem("g_TENANT_GUID");
                this.profile_entry.TENANT_SITE_GUID = localStorage.getItem("g_TENANT_COMPANY_GUID");
                this.profile_entry.CREATION_TS = new Date().toISOString();
                this.profile_entry.CREATION_USER_GUID = '1';
                this.profile_entry.UPDATE_TS = new Date().toISOString();
                this.profile_entry.UPDATE_USER_GUID = "";
                this.profilesetupservice.save(this.profile_entry)
                  .subscribe((response) => {
                    console.log('hi');
                    if (response.status == 200) {
                      alert('Profile Registered successfully');
                      this.navCtrl.setRoot(this.navCtrl.getActive().component);
                    }
                  });
              }
            }
            else {
              console.log("Records Found");
              alert("The Profile is already Exist.")
            }
          },
          err => {
            this.Exist_Record = false;
            console.log("ERROR!: ", err);
          }
        );
    }
  }


  getProfilesList() {
    let self = this;
    let params: URLSearchParams = new URLSearchParams();
    self.profilesetupservice.get_profile(params)
      .subscribe((profile: Main_Profile_Model[]) => {
        self.profiles = profile;
      });
  }

  Update_Profile() {
    if (this.Profileform.valid) {
      if (this.profile_entry.PROFILE_NAME == null) { this.profile_entry.PROFILE_NAME = this.PROFILENAME_ngModel_Edit.trim(); }
      this.profile_entry.PROFILE_XML = this.profile_entry.PROFILE_XML.trim();
      this.profile_entry.TENANT_SITE_GUID = this.profile_entry.TENANT_SITE_GUID.trim();
      this.profile_entry.TENANT_GUID = this.profile_entry.TENANT_GUID;
      this.profile_entry.CREATION_TS = this.profile_entry.CREATION_TS;
      this.profile_entry.CREATION_USER_GUID = this.profile_entry.CREATION_USER_GUID;

      this.profile_entry.MAIN_PROFILE_GUID = this.profile_entry.MAIN_PROFILE_GUID;
      this.profile_entry.UPDATE_TS = new Date().toISOString();
      this.profile_entry.UPDATE_USER_GUID = '1';

      if (this.PROFILENAME_ngModel_Edit.trim() != localStorage.getItem('Prev_Name')) {
        let url: string;
        url = this.baseResource_Url + "main_profile?filter=(PROFILE_NAME=" + this.PROFILENAME_ngModel_Edit.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
        this.http.get(url)
          .map(res => res.json())
          .subscribe(
            data => {
              let res = data["resource"];
              if (res.length == 0) {
                console.log("No records Found");
                this.profile_entry.PROFILE_NAME = this.PROFILENAME_ngModel_Edit.trim();
                this.profile_entry.PROFILE_XML = this.XML_ngModel_Edit.trim();

                this.profile_entry.MAIN_PROFILE_GUID = this.profile_entry.MAIN_PROFILE_GUID;;

                //**************Update service if it is new details*************************
                this.profilesetupservice.update_profile(this.profile_entry)
                  .subscribe((response) => {
                    if (response.status == 200) {
                      alert('Profile updated successfully');
                      this.navCtrl.setRoot(this.navCtrl.getActive().component);
                    }
                  });
                //**************************************************************************
              }
              else {
                console.log("Records Found");
                alert("The profile is already Exist. ");
              }
            },
            err => {
              this.Exist_Record = false;
              console.log("ERROR!: ", err);
            });
      }
      else {
        if (this.profile_entry.PROFILE_NAME == null) { this.profile_entry.PROFILE_NAME = localStorage.getItem('Prev_Name'); }
        this.profile_entry.PROFILE_NAME = this.PROFILENAME_ngModel_Edit.trim();
        this.profile_entry.PROFILE_XML = this.XML_ngModel_Edit.trim();
        //**************Update service if it is old details*************************
        this.profilesetupservice.update_profile(this.profile_entry)
          .subscribe((response) => {
            if (response.status == 200) {
              alert('Profile updated successfully');
              this.navCtrl.setRoot(this.navCtrl.getActive().component);
            }
          });
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileSetupPage');
  }
  ClearControls() {
    this.PROFILENAME_ngModel_Add = "";
    this.XML_ngModel_Add = "";
    this.PROFILENAME_ngModel_Edit = "";
    this.XML_ngModel_Edit = "";
  }
}
