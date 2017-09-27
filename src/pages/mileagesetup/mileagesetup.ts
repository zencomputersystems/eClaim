import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
//import { FormBuilder, FormGroup } from '@angular/forms';
import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { MileageSetup_Model } from '../../models/mileagesetup_model';
import { MileageSetup_Service } from '../../services/mileagesetup_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';

/**
 * Generated class for the MileagesetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-mileagesetup',
  templateUrl: 'mileagesetup.html', providers: [MileageSetup_Service, BaseHttpService]
})
export class MileagesetupPage {
  mileage_entry: MileageSetup_Model = new MileageSetup_Model();
  Mileageform: FormGroup;

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_mileage' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  public mileages: MileageSetup_Model[] = [];

  public AddMileageClicked: boolean = false;
  public EditMileageClicked: boolean = false;
  public Exist_Record: boolean = false;

  public mileage_details: any;
  public exist_record_details: any;

  //Set the Model Name for Add------------------------------------------
  public CATEGORY_ngModel_Add: any;
  public RATE_PER_UNIT_ngModel_Add: any;
  public RATE_DATE_ngModel_Add: any;
  public ACTIVATION_FLAG_ngModel_Add: any;
  //---------------------------------------------------------------------

  //Set the Model Name for edit------------------------------------------
  public CATEGORY_ngModel_Edit: any;
  public RATE_PER_UNIT_ngModel_Edit: any;
  public RATE_DATE_ngModel_Edit: any;
  public ACTIVATION_FLAG_ngModel_Edit: any;
  //---------------------------------------------------------------------
  public AddMileageClick() {
    this.ClearControls();
    this.AddMileageClicked = true;
    this.ACTIVATION_FLAG_ngModel_Add = false;
    this.RATE_DATE_ngModel_Add = "";
  }

  public EditClick(MILEAGE_GUID: any) {
    this.ClearControls();
    this.EditMileageClicked = true;
    var self = this;
    this.mileagesetupservice
      .get(MILEAGE_GUID)
      .subscribe((data) => {
        self.mileage_details = data;
        this.CATEGORY_ngModel_Edit = self.mileage_details.CATEGORY; localStorage.setItem('Prev_mi_Category', self.mileage_details.CATEGORY); //console.log(self.mileage_details.CATEGORY);
        this.RATE_PER_UNIT_ngModel_Edit = self.mileage_details.RATE_PER_UNIT;
        this.RATE_DATE_ngModel_Edit = new Date(self.mileage_details.RATE_DATE).toISOString();
        if (self.mileage_details.ACTIVATION_FLAG == "1") {
          this.ACTIVATION_FLAG_ngModel_Edit = true;
        }
        else {
          this.ACTIVATION_FLAG_ngModel_Edit = false;
        }
      });
  }

  public DeleteClick(MILEAGE_GUID: any) {
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
            this.mileagesetupservice.remove(MILEAGE_GUID)
              .subscribe(() => {
                self.mileages = self.mileages.filter((item) => {
                  return item.MILEAGE_GUID != MILEAGE_GUID
                });
              });
          }
        }
      ]
    }); alert.present();
  }

  public CloseMileageClick() {

    if (this.AddMileageClicked == true) {
      this.AddMileageClicked = false;
    }
    if (this.EditMileageClicked == true) {
      this.EditMileageClicked = false;
    }
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private mileagesetupservice: MileageSetup_Service, private alertCtrl: AlertController) {
    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.mileages = data.resource;
      });
    this.Mileageform = fb.group({
      //CATEGORY: [null, Validators.compose([Validators.pattern('[a-zA-Z0-9][a-zA-Z0-9 ]+'), Validators.required])],
      CATEGORY: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
      
      //CATEGORY: [null, Validators.compose([Validators.pattern('^[a-zA-Z][a-zA-Z0-9\\s]+$'), Validators.required])],
      //RATE_PER_UNIT: [null, Validators.compose([Validators.pattern('^[a-zA-Z][a-zA-Z0-9\\s]+$'), Validators.required])],
      //RATE_PER_UNIT: [null, Validators.compose([Validators.pattern('[a-zA-Z0-9][a-zA-Z0-9 ]+'), Validators.required])], 
      RATE_PER_UNIT: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],  
      //RATE_PER_UNIT: ["", Validators.required],
      RATE_DATE: ["", Validators.required],
      ACTIVATION_FLAG: ["", Validators.required],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MileagesetupPage');
  }

  Save() {
    if (this.Mileageform.valid) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      let url: string;
      url = this.baseResource_Url + "main_mileage?filter=(CATEGORY=" + this.CATEGORY_ngModel_Add.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      this.http.get(url, options)
        .map(res => res.json())
        .subscribe(
        data => {
          let res = data["resource"];
          if (res.length == 0) {
            console.log("No records Found");
            if (this.Exist_Record == false) {
              this.mileage_entry.CATEGORY = this.CATEGORY_ngModel_Add.trim();

              this.mileage_entry.RATE_PER_UNIT = this.RATE_PER_UNIT_ngModel_Add.trim();
              this.mileage_entry.RATE_DATE = this.RATE_DATE_ngModel_Add.trim();
              this.mileage_entry.ACTIVATION_FLAG = this.ACTIVATION_FLAG_ngModel_Add;

              this.mileage_entry.MILEAGE_GUID = UUID.UUID();
              this.mileage_entry.CREATION_TS = new Date().toISOString();
              this.mileage_entry.CREATION_USER_GUID = "1";
              this.mileage_entry.UPDATE_TS = new Date().toISOString();
              this.mileage_entry.TENANT_GUID = UUID.UUID();
              this.mileage_entry.UPDATE_USER_GUID = "";

              this.mileagesetupservice.save(this.mileage_entry)
                .subscribe((response) => {
                  if (response.status == 200) {
                    alert('Mileage Registered successfully');
                    this.navCtrl.setRoot(this.navCtrl.getActive().component);
                  }
                });
            }
          }
          else {
            console.log("Records Found");
            alert("The Mileage is already Exist.")
          }
        },
        err => {
          this.Exist_Record = false;
          console.log("ERROR!: ", err);
        });
    }
  }

  getMileageList() {
    let self = this;
    let params: URLSearchParams = new URLSearchParams();
    self.mileagesetupservice.get_mileage(params)
      .subscribe((mileages: MileageSetup_Model[]) => {
        self.mileages = mileages;
      });
  }

  Update(MILEAGE_GUID: any) {
    if (this.Mileageform.valid) {
      if (this.mileage_entry.CATEGORY == null) { this.mileage_entry.CATEGORY = this.CATEGORY_ngModel_Edit.trim(); }
      if (this.mileage_entry.RATE_PER_UNIT == null) { this.mileage_entry.RATE_PER_UNIT = this.RATE_PER_UNIT_ngModel_Edit; }
      if (this.mileage_entry.RATE_DATE == null) { this.mileage_entry.RATE_DATE = this.RATE_DATE_ngModel_Edit.trim(); }
      if (this.mileage_entry.ACTIVATION_FLAG == null) { this.mileage_entry.ACTIVATION_FLAG = this.ACTIVATION_FLAG_ngModel_Edit; }

      this.mileage_entry.CREATION_TS = this.mileage_details.CREATION_TS;
      this.mileage_entry.CREATION_USER_GUID = this.mileage_details.CREATION_USER_GUID;
      this.mileage_entry.UPDATE_TS = this.mileage_details.UPDATE_TS;

      this.mileage_entry.MILEAGE_GUID = MILEAGE_GUID;
      this.mileage_entry.UPDATE_TS = new Date().toISOString();
      this.mileage_entry.UPDATE_USER_GUID = '1';
      //debugger;
      if (this.CATEGORY_ngModel_Edit.trim() != localStorage.getItem('Prev_mi_Category')) {
        // let headers = new Headers();
        // headers.append('Content-Type', 'application/json');
        // let options = new RequestOptions({ headers: headers });
        let url: string;
        url = this.baseResource_Url + "main_mileage?filter=(CATEGORY=" + this.CATEGORY_ngModel_Edit.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
        this.http.get(url)
          .map(res => res.json())
          .subscribe(
          data => {
            let res = data["resource"];
            console.log('Current Category : ' + this.CATEGORY_ngModel_Edit + ', Previous Category : ' + localStorage.getItem('Prev_mi_Category'));

            if (res.length == 0) {
              console.log("No records Found");
              this.mileage_entry.CATEGORY = this.CATEGORY_ngModel_Edit.trim();
              
              //**************Update service if it is new details*************************
              this.mileagesetupservice.update(this.mileage_entry)
                .subscribe((response) => {
                  if (response.status == 200) {
                    alert('Mileage updated successfully');
                    this.navCtrl.setRoot(this.navCtrl.getActive().component);
                  }
                });
              //**************************************************************************
            }
            else {
              console.log("Records Found");
              alert("The Mileage is already Exist. ");
            }
          },
          err => {
            this.Exist_Record = false;
            console.log("ERROR!: ", err);
          });
      }
      else {
        if (this.mileage_entry.CATEGORY == null) { this.mileage_entry.CATEGORY = localStorage.getItem('Prev_mi_Category'); }
        //this.mileage_entry.CATEGORY = this.CATEGORY_ngModel_Edit;
        //**************Update service if it is old details*************************
        this.mileagesetupservice.update(this.mileage_entry)
          .subscribe((response) => {
            if (response.status == 200) {
              alert('Mileage updated successfully');
              this.navCtrl.setRoot(this.navCtrl.getActive().component);
            }
          });
        //**************************************************************************
      }
    }
  }
  ClearControls()
  {
    this.CATEGORY_ngModel_Add = "";
    this.RATE_PER_UNIT_ngModel_Add = "";
    this.RATE_DATE_ngModel_Add = "";
    this.ACTIVATION_FLAG_ngModel_Add = false;

    this.CATEGORY_ngModel_Edit = "";
    this.RATE_PER_UNIT_ngModel_Edit = "";
    this.RATE_DATE_ngModel_Edit = "";
    this.ACTIVATION_FLAG_ngModel_Edit = false;
  }
}