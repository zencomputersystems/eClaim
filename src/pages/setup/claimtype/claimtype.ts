import 'rxjs/add/operator/map';

import * as constants from '../../../app/config/constants';

import { AlertController, IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ApiManagerProvider } from '../../../providers/api-manager.provider';
import { BaseHttpService } from '../../../services/base-http';
import { ClaimTypeSetup_Model } from '../../../models/claimtypesetup_model';
import { ClaimTypeSetup_Service } from '../../../services/claimtypesetup_service';
import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { TitleCasePipe } from '@angular/common';
import { UUID } from 'angular2-uuid';
import { authCheck } from '../../../shared/authcheck';

/**
 * Generated class for the ClaimtypePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-claimtype',
  templateUrl: 'claimtype.html', providers: [ClaimTypeSetup_Service, BaseHttpService, TitleCasePipe]
})
export class ClaimtypePage extends authCheck {
  claimtype_entry: ClaimTypeSetup_Model = new ClaimTypeSetup_Model();
  Claimtypeform: FormGroup;
  //claimtype: ClaimTypeSetup_Model = new ClaimTypeSetup_Model();
  public page: number = 1;
  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_claim_type' + '?order=NAME&api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  public claimtypes: ClaimTypeSetup_Model[] = [];

  public AddClaimtypeClicked: boolean = false;
  public Exist_Record: boolean = false;

  public exist_record_details: any;
  public claimtype_details: any;

  //Set the Model Name for Add------------------------------------------
  public NAME_ngModel_Add: any;
  public DESCRIPTION_ngModel_Add: any;
  //---------------------------------------------------------------------

  Add_Form: boolean = false; Edit_Form: boolean = false; HeaderText = "";
  public AddClaimtypeClick() {
    if (this.Edit_Form == false) {
      this.AddClaimtypeClicked = true; this.Add_Form = true; this.Edit_Form = false; this.HeaderText = "REGISTER NEW CLAIM TYPE";
      this.ClearControls();
    }
    else {
      alert('Sorry. You are in Edit Mode.');
    }
  }

  public EditClick(CLAIM_TYPE_GUID: any) {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();

    this.ClearControls();
    this.AddClaimtypeClicked = true; this.Add_Form = false; this.Edit_Form = true; this.HeaderText = "UPDATE NEW CLAIM TYPE";

    var self = this;
    this.claimtypesetupservice
      .get(CLAIM_TYPE_GUID)
      .subscribe((data) => {
        self.claimtype_details = data;

        this.NAME_ngModel_Add = self.claimtype_details.NAME; localStorage.setItem('Prev_cl_Name', self.claimtype_details.NAME);
        this.DESCRIPTION_ngModel_Add = self.claimtype_details.DESCRIPTION;

        this.loading.dismissAll();
      });
  }

  public DeleteClick(CLAIM_TYPE_GUID: any) {
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
            this.claimtypesetupservice.remove(CLAIM_TYPE_GUID)
              .subscribe(() => {
                self.claimtypes = self.claimtypes.filter((item) => {
                  return item.CLAIM_TYPE_GUID != CLAIM_TYPE_GUID
                });
              });
            //this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        }
      ]
    }); alert.present();
  }

  public CloseClaimtypeClick() {
    if (this.AddClaimtypeClicked == true) {
      this.AddClaimtypeClicked = false;
      this.Add_Form = true; this.Edit_Form = false;
    }
  }

  loading: Loading;
  constructor(public api: ApiManagerProvider, public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private claimtypesetupservice: ClaimTypeSetup_Service, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private titlecasePipe: TitleCasePipe) {
    super(navCtrl, true);
    //Display Grid---------------------------- 
    this.DisplayGrid();

    //----------------------------------------
    this.Claimtypeform = fb.group({
      NAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
      DESCRIPTION: [null],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClaimtypePage');
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
        this.claimtypes = data.resource;

        this.loading.dismissAll();
      });
  }

  Save() {
    if (this.Claimtypeform.valid) {
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

      if (this.NAME_ngModel_Add.trim().toUpperCase() != localStorage.getItem('Prev_cl_Name').toUpperCase()) {
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
            alert("The Claim Type is already Exist.");
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
    this.claimtype_entry.CLAIM_TYPE_GUID = UUID.UUID();
    if (localStorage.getItem("g_IS_SUPER") == "1") {
      this.claimtype_entry.TENANT_GUID = UUID.UUID();
    }
    else {
      this.claimtype_entry.TENANT_GUID = localStorage.getItem("g_TENANT_GUID");
    }
    this.claimtype_entry.CREATION_TS = this.api.CreateTimestamp();
    this.claimtype_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
    this.claimtype_entry.UPDATE_TS = this.api.CreateTimestamp();
    this.claimtype_entry.UPDATE_USER_GUID = "";
  }

  SetEntityForUpdate() {
    this.claimtype_entry.CLAIM_TYPE_GUID = this.claimtype_details.CLAIM_TYPE_GUID;
    this.claimtype_entry.TENANT_GUID = this.claimtype_details.TENANT_GUID;
    this.claimtype_entry.CREATION_TS = this.claimtype_details.CREATION_TS;
    this.claimtype_entry.CREATION_USER_GUID = this.claimtype_details.CREATION_USER_GUID;
    this.claimtype_entry.UPDATE_TS = this.api.CreateTimestamp();
    this.claimtype_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");
  }

  SetCommonEntityForAddUpdate() {
    this.claimtype_entry.NAME = this.titlecasePipe.transform(this.NAME_ngModel_Add.trim());
    this.claimtype_entry.DESCRIPTION = this.titlecasePipe.transform(this.DESCRIPTION_ngModel_Add.trim());
  }

  RemoveStorageValues() {
    localStorage.removeItem("Prev_cl_Name");
  }

  CheckDuplicate() {
    let url: string = "";
    url = this.baseResource_Url + "main_claim_type?filter=NAME=" + this.NAME_ngModel_Add.trim() + '&api_key=' + constants.DREAMFACTORY_API_KEY;

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
    this.claimtypesetupservice.save(this.claimtype_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          alert('Claim Type Registered Successfully');

          //Remove all storage values-----------------------------------------          
          this.RemoveStorageValues();
          //------------------------------------------------------------------

          this.navCtrl.setRoot(this.navCtrl.getActive().component);
        }
      });
  }

  Update() {
    this.claimtypesetupservice.update(this.claimtype_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          alert('Claim Type Updated Successfully');

          //Remove all storage values-----------------------------------------          
          this.RemoveStorageValues();
          //------------------------------------------------------------------

          this.navCtrl.setRoot(this.navCtrl.getActive().component);
        }
      });
  }

  ClearControls() {
    this.NAME_ngModel_Add = "";
    this.DESCRIPTION_ngModel_Add = "";
  }
}