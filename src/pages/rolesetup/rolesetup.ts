import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
//import { FormBuilder, FormGroup } from '@angular/forms';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { RoleSetup_Model } from '../../models/rolesetup_model';
import { RoleSetup_Service } from '../../services/rolesetup_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';

/**
 * Generated class for the RolesetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-rolesetup',
  templateUrl: 'rolesetup.html', providers: [RoleSetup_Service, BaseHttpService]
})
export class RolesetupPage {
  role_entry: RoleSetup_Model = new RoleSetup_Model();
  //role: RoleSetup_Model = new RoleSetup_Model();
  Roleform: FormGroup;

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_role' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  public roles: RoleSetup_Model[] = [];

  public AddRoleClicked: boolean = false;
  public EditRoleClicked: boolean = false;
  public Exist_Record: boolean = false;

  public role_details: any;
  public exist_record_details: any;

  //Set the Model Name for Add------------------------------------------
  public NAME_ngModel_Add: any;
  public DESCRIPTION_ngModel_Add: any;
  public ACTIVATION_FLAG_ngModel_Add: any;
  //---------------------------------------------------------------------

  //Set the Model Name for edit------------------------------------------
  public NAME_ngModel_Edit: any;
  public DESCRIPTION_ngModel_Edit: any;
  public ACTIVATION_FLAG_ngModel_Edit: any;
  //---------------------------------------------------------------------
  public AddRoleClick() {
    this.AddRoleClicked = true;
    this.ACTIVATION_FLAG_ngModel_Add = false;
    this.ClearControls();
  }

  public EditClick(ROLE_GUID: any) {
    this.ClearControls();
    this.EditRoleClicked = true;
    var self = this;
    this.rolesetupservice
      .get(ROLE_GUID)
      .subscribe((data) => {
        self.role_details = data;
        this.NAME_ngModel_Edit = self.role_details.NAME; localStorage.setItem('Prev_Role_Name', self.role_details.NAME);
        this.DESCRIPTION_ngModel_Edit = self.role_details.DESCRIPTION;
        if (self.role_details.ACTIVATION_FLAG == "1") {
          this.ACTIVATION_FLAG_ngModel_Edit = true;
        }
        else {
          this.ACTIVATION_FLAG_ngModel_Edit = false;
        }
      });
  }

  public DeleteClick(ROLE_GUID: any) {
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
            this.rolesetupservice.remove(ROLE_GUID)
              .subscribe(() => {
                self.roles = self.roles.filter((item) => {
                  return item.ROLE_GUID != ROLE_GUID
                });
              });
          }
        }
      ]
    }); alert.present();
  }

  public CloseRoleClick() {

    if (this.AddRoleClicked == true) {
      this.AddRoleClicked = false;
    }
    if (this.EditRoleClicked == true) {
      this.EditRoleClicked = false;
    }
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private rolesetupservice: RoleSetup_Service, private alertCtrl: AlertController) {
    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.roles = data.resource;
      });

    this.Roleform = fb.group({
      NAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
      DESCRIPTION: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
      ACTIVATION_FLAG: ["", Validators.required],
      ADD_PERMISSON:[null],
      EDIT_PERMISSON:[null],
      DELETE_PERMISSON:[null],
      VIEW_PERMISSON:[null],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RolesetupPage');
  }

  Save() {
    if (this.Roleform.valid) {

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      let url: string;
      url = this.baseResource_Url + "main_role?filter=(NAME=" + this.NAME_ngModel_Add.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      this.http.get(url, options)
        .map(res => res.json())
        .subscribe(
        data => { 
          let res = data["resource"];
          if (res.length == 0) {
            console.log("No records Found");
            if (this.Exist_Record == false) {
              this.role_entry.NAME = this.NAME_ngModel_Add.trim();
              this.role_entry.DESCRIPTION = this.DESCRIPTION_ngModel_Add.trim();
              this.role_entry.ACTIVATION_FLAG = this.ACTIVATION_FLAG_ngModel_Add;

              this.role_entry.ROLE_GUID = UUID.UUID();
              this.role_entry.TENANT_GUID = UUID.UUID();
              this.role_entry.CREATION_TS = new Date().toISOString();
              this.role_entry.CREATION_USER_GUID = "1";
              this.role_entry.UPDATE_TS = new Date().toISOString();
              this.role_entry.UPDATE_USER_GUID = "";
              // this.role_entry.ACTIVATION_FLAG = 1;
              //this.role_entry.NAME=value.NAME;

              this.rolesetupservice.save(this.role_entry)
                .subscribe((response) => {
                  if (response.status == 200) {
                    alert('Role Registered successfully');
                    //location.reload();
                    this.navCtrl.setRoot(this.navCtrl.getActive().component);
                  }
                });
            }
          }
          else {
            console.log("Records Found");
            alert("The Role is already Exist.")
          }
        },
        err => {
          this.Exist_Record = false;
          console.log("ERROR!: ", err);
        });
    }
  }
  getBankList() {
    let self = this;
    let params: URLSearchParams = new URLSearchParams();
    self.rolesetupservice.get_role(params)
      .subscribe((roles: RoleSetup_Model[]) => {
        self.roles = roles;
      });
  }

  Update(ROLE_GUID: any) {
    if (this.Roleform.valid) {
      if (this.role_entry.NAME == null) { this.role_entry.NAME = this.NAME_ngModel_Edit.trim(); }
      if (this.role_entry.DESCRIPTION == null) { this.role_entry.DESCRIPTION = this.DESCRIPTION_ngModel_Edit.trim(); }
      if (this.role_entry.ACTIVATION_FLAG == null) { this.role_entry.ACTIVATION_FLAG = this.ACTIVATION_FLAG_ngModel_Edit; }

      this.role_entry.CREATION_TS = this.role_details.CREATION_TS
      this.role_entry.CREATION_USER_GUID = this.role_details.CREATION_USER_GUID;
      this.role_entry.UPDATE_TS = this.role_details.UPDATE_TS;

      this.role_entry.ROLE_GUID = ROLE_GUID;
      this.role_entry.UPDATE_TS = new Date().toISOString();
      this.role_entry.UPDATE_USER_GUID = '1';
      //this.role_entry.ACTIVATION_FLAG = 1;

      if (this.NAME_ngModel_Edit.trim() != localStorage.getItem('Prev_Role_Name')) {
        let url: string;
        url = this.baseResource_Url + "main_role?filter=(NAME=" + this.NAME_ngModel_Edit.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
        this.http.get(url)
          .map(res => res.json())
          .subscribe(
          data => {
            let res = data["resource"];
            console.log('Current Name : ' + this.NAME_ngModel_Edit.trim() + ', Previous Name : ' + localStorage.getItem('Prev_Role_Name'));

            if (res.length == 0) {
              console.log("No records Found");
              this.role_entry.NAME = this.NAME_ngModel_Edit.trim();

              //**************Update service if it is new details*************************
              this.rolesetupservice.update(this.role_entry)
                .subscribe((response) => {
                  if (response.status == 200) {
                    alert('Role is updated successfully');
                    this.navCtrl.setRoot(this.navCtrl.getActive().component);
                  }
                });
              //**************************************************************************
            }
            else {
              console.log("Records Found");
              alert("The Role is already Exist. ");
            }
          },
          err => {
            this.Exist_Record = false;
            console.log("ERROR!: ", err);
          });
      }
      else {
        if (this.role_entry.NAME == null) { this.role_entry.NAME = localStorage.getItem('Prev_Role_Name'); }
        this.role_entry.NAME = this.NAME_ngModel_Edit.trim();

        //**************Update service if it is old details*************************
        this.rolesetupservice.update(this.role_entry)
          .subscribe((response) => {
            if (response.status == 200) {
              alert('Role setup updated successfully');
              //location.reload();
              this.navCtrl.setRoot(this.navCtrl.getActive().component);
            }
          });
      }
    }
  }

  ClearControls() {
    this.NAME_ngModel_Add = "";
    this.DESCRIPTION_ngModel_Add = "";
    this.ACTIVATION_FLAG_ngModel_Add = false;

    this.NAME_ngModel_Edit = "";
    this.DESCRIPTION_ngModel_Edit = "";
    this.ACTIVATION_FLAG_ngModel_Edit = false;
  }
}