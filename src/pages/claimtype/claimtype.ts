import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { ClaimTypeSetup_Model } from '../../models/claimtypesetup_model';
import { ClaimTypeSetup_Service } from '../../services/claimtypesetup_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';


/**
 * Generated class for the ClaimtypePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-claimtype',
  templateUrl: 'claimtype.html', providers: [ClaimTypeSetup_Service, BaseHttpService]
})
export class ClaimtypePage {
  claimtype_entry: ClaimTypeSetup_Model = new ClaimTypeSetup_Model();
  Claimtypeform: FormGroup;
  //claimtype: ClaimTypeSetup_Model = new ClaimTypeSetup_Model();

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_claim_type' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  public claimtypes: ClaimTypeSetup_Model[] = [];

  public AddClaimtypeClicked: boolean = false;
  public EditClaimTypeClicked: boolean = false;
  public Exist_Record: boolean = false;

  public exist_record_details: any;
  public claimtype_details: any;

  //Set the Model Name for Add------------------------------------------
  public NAME_ngModel_Add: any;
  public DESCRIPTION_ngModel_Add: any;
  //---------------------------------------------------------------------

  //Set the Model Name for edit------------------------------------------
  public NAME_ngModel_Edit: any;
  public DESCRIPTION_ngModel_Edit: any;
  //---------------------------------------------------------------------

  public AddClaimtypeClick() {
    this.AddClaimtypeClicked = true;
    this.ClearControls();
  }

  public EditClick(CLAIM_TYPE_GUID: any) {
    this.ClearControls();
    this.EditClaimTypeClicked = true;
    var self = this;
    this.claimtypesetupservice
      .get(CLAIM_TYPE_GUID)
      .subscribe((data) => {
        self.claimtype_details = data;
        this.NAME_ngModel_Edit = self.claimtype_details.NAME; localStorage.setItem('Prev_cl_Name', self.claimtype_details.NAME);
        this.DESCRIPTION_ngModel_Edit = self.claimtype_details.DESCRIPTION;
      });
  }

  public DeleteClick(CLAIM_TYPE_GUID: any) {
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
    }
    if (this.EditClaimTypeClicked == true) {
      this.EditClaimTypeClicked = false;
    }
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private claimtypesetupservice: ClaimTypeSetup_Service, private alertCtrl: AlertController) {
    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.claimtypes = data.resource;
      });

    this.Claimtypeform = fb.group({
      //NAME: [null, Validators.compose([Validators.pattern('[a-zA-Z0-9][0-9a-zA-Z ]+'), Validators.required])],
      NAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
      //DESCRIPTION: [null, Validators.compose([Validators.pattern('[a-zA-Z][a-zA-Z ]+'), Validators.required])],
      //NAME: ["", Validators.required],
      DESCRIPTION: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
      //DESCRIPTION: [null, Validators.compose([Validators.pattern('[a-zA-Z0-9][0-9a-zA-Z ]+'), Validators.required])],
      //DESCRIPTION: ["", Validators.required],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClaimtypePage');
  }

  Save() {
    if (this.Claimtypeform.valid) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      let url: string;
      url = this.baseResource_Url + "main_claim_type?filter=(NAME=" + this.NAME_ngModel_Add.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      this.http.get(url, options)
        .map(res => res.json())
        .subscribe(
        data => {
          let res = data["resource"];
          if (res.length == 0) {
            console.log("No records Found");
            if (this.Exist_Record == false) {
              this.claimtype_entry.NAME = this.NAME_ngModel_Add.trim();
              this.claimtype_entry.DESCRIPTION = this.DESCRIPTION_ngModel_Add.trim();

              this.claimtype_entry.CLAIM_TYPE_GUID = UUID.UUID();
              this.claimtype_entry.TENANT_GUID = UUID.UUID();
              this.claimtype_entry.CREATION_TS = new Date().toISOString();
              this.claimtype_entry.CREATION_USER_GUID = '1';
              this.claimtype_entry.UPDATE_TS = new Date().toISOString();
              this.claimtype_entry.UPDATE_USER_GUID = "";

              this.claimtypesetupservice.save(this.claimtype_entry)
                .subscribe((response) => {
                  if (response.status == 200) {
                    alert('Claim Type Registered successfully');
                    //location.reload();
                    this.navCtrl.setRoot(this.navCtrl.getActive().component);
                  }
                });
            }
          }
          else {
            console.log("Records Found");
            alert("The Claimtype is already Exist.")

          }

        },
        err => {
          this.Exist_Record = false;
          console.log("ERROR!: ", err);
        }
        );

    }
  }
  getClaimtypeList() {
    let self = this;
    let params: URLSearchParams = new URLSearchParams();
    self.claimtypesetupservice.get_claim(params)
      .subscribe((claimtypes: ClaimTypeSetup_Model[]) => {
        self.claimtypes = claimtypes;
      });
  }

  Update(CLAIM_TYPE_GUID: any) {
    if (this.Claimtypeform.valid) {
    if (this.claimtype_entry.NAME == null) { this.claimtype_entry.NAME = this.NAME_ngModel_Edit.trim(); }
    if (this.claimtype_entry.DESCRIPTION == null) { this.claimtype_entry.DESCRIPTION = this.DESCRIPTION_ngModel_Edit.trim(); }
    
   
    this.claimtype_entry.TENANT_GUID = this.claimtype_details.TENANT_GUID;
    this.claimtype_entry.CREATION_TS = this.claimtype_details.CREATION_TS;
    this.claimtype_entry.CREATION_USER_GUID = this.claimtype_details.CREATION_USER_GUID;

    this.claimtype_entry.CLAIM_TYPE_GUID = CLAIM_TYPE_GUID;
    this.claimtype_entry.UPDATE_TS = new Date().toISOString();
    this.claimtype_entry.UPDATE_USER_GUID = '1';

    if (this.NAME_ngModel_Edit.trim() != localStorage.getItem('Prev_cl_Name')) {
      // let headers = new Headers();
      // headers.append('Content-Type', 'application/json');
      // let options = new RequestOptions({ headers: headers });
      let url: string;
      url = this.baseResource_Url + "main_claim_type?filter=(NAME=" + this.NAME_ngModel_Edit.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      this.http.get(url)
        .map(res => res.json())
        .subscribe(
        data => {
          let res = data["resource"];
          console.log('Current Name : ' + this.NAME_ngModel_Edit + ', Previous Name : ' + localStorage.getItem('Prev_cl_Name'));

          if (res.length == 0) {
            console.log("No records Found");
            this.claimtype_entry.NAME = this.NAME_ngModel_Edit.trim();
            
            //**************Update service if it is new details*************************
            this.claimtypesetupservice.update(this.claimtype_entry)
              .subscribe((response) => {
                if (response.status == 200) {
                  alert('hii');
                  alert('Claimtype updated successfully');
                  this.navCtrl.setRoot(this.navCtrl.getActive().component);
                }
              });
            //**************************************************************************
          }
          else {
            console.log("Records Found");
            alert("The Claimtype is already Exist. ");
          }
        },
        err => {
          this.Exist_Record = false;
          console.log("ERROR!: ", err);
        });
    }
    else {
      if (this.claimtype_entry.NAME == null) { this.claimtype_entry.NAME = localStorage.getItem('Prev_cl_Name'); }
      this.claimtype_entry.NAME = this.NAME_ngModel_Edit.trim();
      
      //**************Update service if it is old details*************************
    this.claimtypesetupservice.update(this.claimtype_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          alert('Claim Type updated successfully');
          //location.reload();
          this.navCtrl.setRoot(this.navCtrl.getActive().component);
        }
      });
  }
}
}
ClearControls()
{
  this.NAME_ngModel_Add = "";
  this.DESCRIPTION_ngModel_Add = "";

  this.NAME_ngModel_Edit = "";
  this.DESCRIPTION_ngModel_Edit = "";
}
}

 // if (this.Claimtypeform.valid) {
    //   let headers = new Headers();
    //   headers.append('Content-Type', 'application/json');
    //   let options = new RequestOptions({ headers: headers });
    //   let url: string;
    //   url = "http://api.zen.com.my/api/v2/zcs/_table/main_claim_type?filter=(NAME=" + this.claimtype_entry.NAME + ")&api_key=cb82c1df0ba653578081b3b58179158594b3b8f29c4ee1050fda1b7bd91c3881";
    //   this.http.get(url, options)
    //     .map(res => res.json())
    //     .subscribe(
    //     data => {
    //       let res = data["resource"];
    //       if (res.length == 0) {
    //         console.log("No records Found");
    //         if (this.Exist_Record == false) {
    // if (this.Claimtypeform.valid) {

//}
// else {
//   console.log("Records Found");
//   alert("The Claimtype is already Added.")

// }
// },
// err => {
//   this.Exist_Record = false;
//   console.log("ERROR!: ", err);
// }
// );
// }
// }
// }
