import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { TitleCasePipe } from '@angular/common';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { CountrySetup_Model } from '../../models/countrysetup_model';
import { CountrySetup_Service } from '../../services/countrysetup_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';
import { LoginPage } from '../login/login';

/**
 * Generated class for the CountrysetupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-countrysetup',
  templateUrl: 'countrysetup.html', providers: [CountrySetup_Service, BaseHttpService, TitleCasePipe]
})
export class CountrysetupPage {
  country_entry: CountrySetup_Model = new CountrySetup_Model();
  Countryform: FormGroup;
  public page:number = 1;
  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_country' + '?order=NAME&api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
  public countries: CountrySetup_Model[] = [];

  public AddCountryClicked: boolean = false;
  public Exist_Record: boolean = false;

  public country_details: any;
  public exist_record_details: any;

  //Set the Model Name for Add------------------------------------------
  public NAME_ngModel_Add: any; 
  // public CODE_ngModel_Add: any;
  //---------------------------------------------------------------------

  Add_Form: boolean = false; Edit_Form: boolean = false; HeaderText: string = "";

  public AddCountryClick() {
    if (this.Edit_Form == false) {
      this.AddCountryClicked = true; this.Add_Form = true; this.Edit_Form = false; this.HeaderText = "REGISTER NEW COUNTRY";
      this.ClearControls();
    }
    else {
      alert('Sorry. You are in Edit Mode.');
    }
  }

  public EditClick(COUNTRY_GUID: any) {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();

    this.ClearControls();
    this.AddCountryClicked = true; this.Add_Form = false; this.Edit_Form = true; this.HeaderText = "UPDATE COUNTRY";

    var self = this;
    this.countrysetupservice
      .get(COUNTRY_GUID)
      .subscribe((data) => {
        self.country_details = data;

        this.NAME_ngModel_Add = self.country_details.NAME; localStorage.setItem('Prev_country', self.country_details.NAME);
        this.loading.dismissAll();
      });
  }

  public DeleteClick(COUNTRY_GUID: any) {
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
            this.countrysetupservice.remove(COUNTRY_GUID)
              .subscribe(() => {
                self.countries = self.countries.filter((item) => {
                  return item.COUNTRY_GUID != COUNTRY_GUID
                });
              });
            //this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        }
      ]
    }); alert.present();
  }

  public CloseCountryClick() {
    if (this.AddCountryClicked == true) {
      this.AddCountryClicked = false;
      this.Add_Form = true; this.Edit_Form = false;
    }
  }

  loading: Loading; button_Add_Disable: boolean = false; button_Edit_Disable: boolean = false; button_Delete_Disable: boolean = false; button_View_Disable: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private countrysetupservice: CountrySetup_Service, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private titlecasePipe: TitleCasePipe) {
    if (localStorage.getItem("g_USER_GUID") == null) {
      alert('Sorry, you are not logged in. Please login.');
      this.navCtrl.push(LoginPage);
    }
    else {
      this.button_Add_Disable = false; this.button_Edit_Disable = false; this.button_Delete_Disable = false; this.button_View_Disable = false;
      if (localStorage.getItem("g_USER_GUID") != "sva") {
        //Get the role for this page------------------------------        
        if (localStorage.getItem("g_KEY_ADD") == "0") { this.button_Add_Disable = true; }
        if (localStorage.getItem("g_KEY_EDIT") == "0") { this.button_Edit_Disable = true; }
        if (localStorage.getItem("g_KEY_DELETE") == "0") { this.button_Delete_Disable = true; }
        if (localStorage.getItem("g_KEY_VIEW") == "0") { this.button_View_Disable = true; }
      }
      
      //Clear localStorage value--------------------------------      
      this.ClearLocalStorage();

      //Display Grid---------------------------- 
      this.DisplayGrid();

      //----------------------------------------
      this.Countryform = fb.group({
        NAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        // CODE: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
      });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CountrysetupPage');
  }

  ClearLocalStorage() {
    if (localStorage.getItem('Prev_country') == null) {
      localStorage.setItem('Prev_country', null);
    }
    else {
      localStorage.removeItem("Prev_country");
    }
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
        this.countries = data.resource;

        this.loading.dismissAll();
      });
  }

  Save() {
    if (this.Countryform.valid) {
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

      let strPrev_country: string = "";
      if (localStorage.getItem('Prev_country') != null) { strPrev_country = localStorage.getItem('Prev_country').toUpperCase(); }

      if (this.NAME_ngModel_Add.trim().toUpperCase() != strPrev_country) {
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
            alert("The Country is already Exist.");
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
    this.country_entry.COUNTRY_GUID = UUID.UUID();
    this.country_entry.CREATION_TS = new Date().toISOString();
    this.country_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
    this.country_entry.UPDATE_TS = new Date().toISOString();
    this.country_entry.UPDATE_USER_GUID = "";
  }

  SetEntityForUpdate() {
    this.country_entry.COUNTRY_GUID = this.country_details.COUNTRY_GUID;
    this.country_entry.CREATION_TS = this.country_details.CREATION_TS;
    this.country_entry.CREATION_USER_GUID = this.country_details.CREATION_USER_GUID;
    this.country_entry.UPDATE_TS = new Date().toISOString();
    this.country_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");
  }

  SetCommonEntityForAddUpdate() {
    this.country_entry.NAME = this.titlecasePipe.transform(this.NAME_ngModel_Add.trim());
  }

  RemoveStorageValues() {
    localStorage.removeItem("Prev_country");
  }

  CheckDuplicate() {
    let url: string = "";
    url = this.baseResource_Url + "main_country?filter=NAME=" + this.NAME_ngModel_Add.trim() + '&api_key=' + constants.DREAMFACTORY_API_KEY;

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
    this.countrysetupservice.save(this.country_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          alert('Country Registered Successfully');

          //Remove all storage values-----------------------------------------          
          this.RemoveStorageValues();
          //------------------------------------------------------------------

          this.navCtrl.setRoot(this.navCtrl.getActive().component);
        }
      });
  }

  Update() {
    this.countrysetupservice.update(this.country_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          alert('Country Updated Successfully');

          //Remove all storage values-----------------------------------------          
          this.RemoveStorageValues();
          //------------------------------------------------------------------

          this.navCtrl.setRoot(this.navCtrl.getActive().component);
        }
      });
  }

  ClearControls() {
    this.NAME_ngModel_Add = "";
  }

}
