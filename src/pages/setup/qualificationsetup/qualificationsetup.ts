import 'rxjs/add/operator/map';

import * as constants from '../../../app/config/constants';

import { AlertController, IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BaseHttpService } from '../../../services/base-http';
import { ClearControls } from '../../../services/controls_service';
import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { QualificationSetup_Model } from '../../../models/qualificationsetup_model';
import { QualificationSetup_Service } from '../../../services/qualificationsetup_service';
import { TitleCasePipe } from '@angular/common';
import { UUID } from 'angular2-uuid';
import { authCheck } from '../../../shared/authcheck';

/**
 * Generated class for the QualificationsetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-qualificationsetup',
  templateUrl: 'qualificationsetup.html', providers: [QualificationSetup_Service, BaseHttpService, TitleCasePipe]

})
export class QualificationsetupPage extends authCheck {
  Qualify_entry: QualificationSetup_Model = new QualificationSetup_Model();
  Qualifyform: FormGroup;
  //qualificationsetup: QualificationSetup_Model = new QualificationSetup_Model();
  public page: number = 1;
  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_qualification_type' + '?order=TYPE_NAME&api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  public qualificationsetups: QualificationSetup_Model[] = [];

  public AddQualifyClicked: boolean = false;
  public EditQualifyClicked: boolean = false;
  public Exist_Record: boolean = false;

  public qualification_details: any;
  public exist_record_details: any;

  //Set the Model Name for Add------------------------------------------
  public TYPE_NAME_ngModel_Add: any;
  public TYPE_DESC_ngModel_Add: any;
  //---------------------------------------------------------------------

  //Set the Model Name for edit------------------------------------------
  public TYPE_NAME_ngModel_Edit: any;
  public TYPE_DESC_ngModel_Edit: any;
  //---------------------------------------------------------------------
  HeaderText: string; Add_Form: boolean = false; Edit_Form: boolean = false;

  public AddQualifyClick() {
    if (this.Edit_Form == false) {
      this.AddQualifyClicked = true; this.Add_Form = true; this.Edit_Form = false; this.HeaderText = "REGISTER NEW QUALIFICATION";
      ClearControls(this);
    }
    else {
      alert('Sorry. You are in Edit Mode.');
    }
  }

  public EditClick(QUALIFICATION_TYPE_GUID: any) {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();
    ClearControls(this);
    this.AddQualifyClicked = true; this.Add_Form = false; this.Edit_Form = true; this.HeaderText = "UPDATE NEW QUALIFICATION";

    var self = this;
    this.qualificationsetupservice
      .get(QUALIFICATION_TYPE_GUID)
      .subscribe((data) => {
        self.qualification_details = data;
        this.TYPE_NAME_ngModel_Add = self.qualification_details.TYPE_NAME; localStorage.setItem('Prev_qu_Name', self.qualification_details.TYPE_NAME);
        this.TYPE_DESC_ngModel_Add = self.qualification_details.TYPE_DESC;
        this.loading.dismissAll();
      });
  }

  public DeleteClick(QUALIFICATION_TYPE_GUID: any) {
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
            this.qualificationsetupservice.remove(QUALIFICATION_TYPE_GUID)
              .subscribe(() => {
                self.qualificationsetups = self.qualificationsetups.filter((item) => {
                  return item.QUALIFICATION_TYPE_GUID != QUALIFICATION_TYPE_GUID
                });
              });
            //this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        }
      ]
    }); alert.present();
  }

  public CloseQualifyClick() {

    if (this.AddQualifyClicked == true) {
      this.AddQualifyClicked = false;
      this.Add_Form = true; this.Edit_Form = false;
    }
  }

  loading: Loading;
  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private qualificationsetupservice: QualificationSetup_Service, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private titlecasePipe: TitleCasePipe) {
    super(navCtrl, true);
    //Display Grid---------------------------- 
    this.DisplayGrid();

    //Load the Form control---------------------------      
    this.Qualifyform = fb.group({
      TYPE_NAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
      TYPE_DESC: [null],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QualificationsetupPage');
  }


  stores: any[];
  search(searchString: any) {
    let val = searchString.target.value;
    if (!val || !val.trim()) {
      this.qualificationsetups = this.stores;
      return;
    }
    this.qualificationsetups = this.filter({
      TYPE_NAME: val
    });
  }

  filter(params?: any) {
    if (!params) {
      return this.stores;
    }

    return this.stores.filter((item) => {
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

  DisplayGrid() {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();

    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.qualificationsetups = this.stores = data.resource;
        this.loading.dismissAll();
      });
  }

  Save() {
    if (this.Qualifyform.valid) {
      //for Save Set Entities------------------------------------------------------------------------
      if (this.Add_Form == true) {
        this.SetEntityForAdd();
      }
      //for Update Set Entities----------------------------------------------------------------------
      else {
        this.SetEntityForUpdate();
      }
      //Common Entitity For Insert/Update-----------------    
      this.SetCommonEntityForAddUpdate();

      //Load the Controller--------------------------------
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...',
      });
      this.loading.present();
      //--------------------------------------------------

      let strPrev_qu_Name: string = "";
      if (localStorage.getItem('Prev_qu_Name') != null) { strPrev_qu_Name = localStorage.getItem('Prev_qu_Name').toUpperCase(); }

      if (this.TYPE_NAME_ngModel_Add.trim().toUpperCase() != strPrev_qu_Name) {
        let val = this.CheckDuplicate();
        val.then((res) => {
          if (res.toString() == "0") {
            //---Insert or Update-----------
            if (this.Add_Form == true) {
              //**************Save service if it is new details*************************              
              this.Insert();
              //**************************************************************************
            }
            else {
              //**************Update service if it is new details*************************              
              this.Update();
              //**************************************************************************
            }
          }
          else {
            alert("The Qualification is already Exist.");
            this.loading.dismissAll();
          }
        });
        val.catch((err) => {
          console.log(err);
        });
      }
      else {
        //Simple update---------- 
        this.Update();
      }
    }
  }

  SetEntityForAdd() {
    this.Qualify_entry.QUALIFICATION_TYPE_GUID = UUID.UUID();
    if (localStorage.getItem("g_USER_GUID") == "sva") {
      this.Qualify_entry.TENANT_GUID = UUID.UUID();
    }
    else {
      this.Qualify_entry.TENANT_GUID = localStorage.getItem("g_TENANT_GUID");
    }
    this.Qualify_entry.CREATION_TS = new Date().toISOString();
    this.Qualify_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
    this.Qualify_entry.UPDATE_TS = new Date().toISOString();
    this.Qualify_entry.UPDATE_USER_GUID = "";
  }

  SetEntityForUpdate() {
    this.Qualify_entry.QUALIFICATION_TYPE_GUID = this.qualification_details.QUALIFICATION_TYPE_GUID;
    this.Qualify_entry.TENANT_GUID = this.qualification_details.TENANT_GUID
    this.Qualify_entry.CREATION_TS = this.qualification_details.CREATION_TS;
    this.Qualify_entry.CREATION_USER_GUID = this.qualification_details.CREATION_USER_GUID;
    this.Qualify_entry.UPDATE_TS = new Date().toISOString();
    this.Qualify_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");
  }

  SetCommonEntityForAddUpdate() {
    this.Qualify_entry.TYPE_NAME = this.titlecasePipe.transform(this.TYPE_NAME_ngModel_Add.trim());
    this.Qualify_entry.TYPE_DESC = this.titlecasePipe.transform(this.TYPE_DESC_ngModel_Add ? this.TYPE_DESC_ngModel_Add.trim() : "");
  }

  RemoveStorageValues() {
    localStorage.removeItem("Prev_qu_Name");
  }

  CheckDuplicate() {
    let url: string = "";
    url = this.baseResource_Url + "main_qualification_type?filter=TYPE_NAME=" + this.TYPE_NAME_ngModel_Add.trim() + '&api_key=' + constants.DREAMFACTORY_API_KEY;

    let result: any;
    return new Promise((resolve) => {
      this.http
        .get(url)
        .map(res => res.json())
        .subscribe(data => {
          result = data["resource"];
          resolve(result.length);
        });
    });
  }

  Insert() {
    this.qualificationsetupservice.save(this.Qualify_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          alert('Qualification Registered successfully');

          //Remove all storage values-----------------------------------------          
          this.RemoveStorageValues();
          //------------------------------------------------------------------

          this.navCtrl.setRoot(this.navCtrl.getActive().component);
        }
      });
  }

  Update() {
    this.qualificationsetupservice.update(this.Qualify_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          alert('Qualification Updated Successfully');

          //Remove all storage values-----------------------------------------          
          this.RemoveStorageValues();
          //------------------------------------------------------------------

          this.navCtrl.setRoot(this.navCtrl.getActive().component);
        }
      });
  }
}
