import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { CashcardSetup_Model } from '../../models/cashcardsetup_model';
import { CashcardSetup_Service } from '../../services/cashcardsetup_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';

/**
 * Generated class for the CashcardsetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-cashcardsetup',
  templateUrl: 'cashcardsetup.html', providers: [CashcardSetup_Service, BaseHttpService]
})
export class CashcardsetupPage {
  cashcard_entry: CashcardSetup_Model = new CashcardSetup_Model();
  Cashform: FormGroup;
  //cashcard: CashcardSetup_Model = new CashcardSetup_Model();

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_cashcard' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  public cashcards: CashcardSetup_Model[] = [];

  public AddCashClicked: boolean = false;
  public EditCashClicked: boolean = false;
  public Exist_Record: boolean = false;

  public cashcard_details: any;
  public exist_record_details: any;
  //public AddCashcardsClicked: boolean = false; 

  //Set the Model Name for Add------------------------------------------
  public CASHCARD_SNO_ngModel_Add: any;
  public ACCOUNT_ID_ngModel_Add: any;
  public ACCOUNT_PASSWORD_ngModel_Add: any;
  public MANAGEMENT_URL_ngModel_Add: any;
  public DESCRIPTION_ngModel_Add: any;
  //---------------------------------------------------------------------

  //Set the Model Name for edit------------------------------------------
  public CASHCARD_SNO_ngModel_Edit: any;
  public ACCOUNT_ID_ngModel_Edit: any;
  public ACCOUNT_PASSWORD_ngModel_Edit: any;
  public MANAGEMENT_URL_ngModel_Edit: any;
  public DESCRIPTION_ngModel_Edit: any;
  //---------------------------------------------------------------------

  public AddCashClick() {
    this.AddCashClicked = true;
    this.ClearControls();
  }

  public CloseCashClick() {
    if (this.AddCashClicked == true) {
      this.AddCashClicked = false;
    }
    if (this.EditCashClicked == true) {
      this.EditCashClicked = false;
    }
  }

  public EditClick(CASHCARD_GUID: any) {
    this.ClearControls();
    this.EditCashClicked = true;
    var self = this;
    this.cashcardsetupservice
      .get(CASHCARD_GUID)
      .subscribe((data) => {

        self.cashcard_details = data;
        //alert(self.cashcard_details.ACCOUNT_ID);
        this.ACCOUNT_ID_ngModel_Edit = self.cashcard_details.ACCOUNT_ID; localStorage.setItem('Prev_ACCOUNT_ID', self.cashcard_details.ACCOUNT_ID);
        this.CASHCARD_SNO_ngModel_Edit = self.cashcard_details.CASHCARD_SNO; localStorage.setItem('Prev_CASHCARD_SNO', self.cashcard_details.CASHCARD_SNO);

        this.ACCOUNT_PASSWORD_ngModel_Edit = self.cashcard_details.ACCOUNT_PASSWORD;
        this.MANAGEMENT_URL_ngModel_Edit = self.cashcard_details.MANAGEMENT_URL;
        this.DESCRIPTION_ngModel_Edit = self.cashcard_details.DESCRIPTION;
      });
  }

  public DeleteClick(CASHCARD_GUID: any) {
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
            this.cashcardsetupservice.remove(CASHCARD_GUID)
              .subscribe(() => {
                self.cashcards = self.cashcards.filter((item) => {
                  return item.CASHCARD_GUID != CASHCARD_GUID
                });
              });
            //this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        }
      ]
    }); alert.present();
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private cashcardsetupservice: CashcardSetup_Service, private alertCtrl: AlertController) {
    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.cashcards = data.resource;
      });

    this.Cashform = fb.group({
      CASHCARD_SNO: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
      //CASHCARD_SNO: [null, Validators.compose([Validators.pattern('^(?!(0))[0-9]*'), Validators.required])],
      // CASHCARD_SNO: ["", Validators.required],
      ACCOUNT_ID: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
      //ACCOUNT_ID: [null, Validators.compose([Validators.pattern('^(?!(0))[0-9]*'), Validators.required])],
      ACCOUNT_PASSWORD: [null, Validators.compose([Validators.pattern('((?=.*\)(?=.*[a-zA-Z0-9]).{4,20})'), Validators.required])],
      //ACCOUNT_PASSWORD: ["", Validators.required],
      MANAGEMENT_URL: [null, Validators.compose([Validators.pattern('^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$'), Validators.required])],
      //MANAGEMENT_URL: ["", Validators.required],   ^(?!(0))[https://]*   /(\S+\.(com|net|org|edu|gov)(\/\S+)?)/
      //DESCRIPTION: ["", Validators.required],
      DESCRIPTION: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
      //DESCRIPTION: [null, Validators.compose([Validators.pattern('[a-zA-Z0-9][a-zA-Z0-9 ]+'), Validators.required])], 
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CashcardsetupPage');
  }

  Save() {
    if (this.Cashform.valid) {

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      let url: string;
      //let url1: string;
      // url = this.baseResource_Url + "main_cashcard?filter=(CASHCARD_SNO=" + this.CASHCARD_SNO_ngModel_Add + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      //url1 = this.baseResource_Url + "main_cashcard?filter=(ACCOUNT_ID=" + this.ACCOUNT_ID_ngModel_Add + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      url = this.baseResource_Url + "main_cashcard?filter=(ACCOUNT_ID=" + this.ACCOUNT_ID_ngModel_Add + ")OR(CASHCARD_SNO=" + this.CASHCARD_SNO_ngModel_Add + ")&api_key=" + constants.DREAMFACTORY_API_KEY;
      //url = "http://api.zen.com.my/api/v2/zcs/_table/main_cashcard?filter=(ACCOUNT_ID=" + this.cashcard_entry.ACCOUNT_ID + ")&api_key=cb82c1df0ba653578081b3b58179158594b3b8f29c4ee1050fda1b7bd91c3881";
      this.http.get(url, options)
        .map(res => res.json())
        .subscribe(
        data => {
          let res = data["resource"];
          if (res.length == 0) {
            console.log("No records Found");
            if (this.Exist_Record == false) {
              this.cashcard_entry.CASHCARD_SNO = this.CASHCARD_SNO_ngModel_Add.trim();
              this.cashcard_entry.ACCOUNT_ID = this.ACCOUNT_ID_ngModel_Add.trim();
              this.cashcard_entry.ACCOUNT_PASSWORD = this.ACCOUNT_PASSWORD_ngModel_Add.trim();
              this.cashcard_entry.MANAGEMENT_URL = this.MANAGEMENT_URL_ngModel_Add;
              this.cashcard_entry.DESCRIPTION = this.DESCRIPTION_ngModel_Add;

              this.cashcard_entry.CASHCARD_GUID = UUID.UUID();
              //this.cashcard_entry.ACTIVATION_FLAG = 1;
              this.cashcard_entry.CREATION_TS = new Date().toISOString();
              this.cashcard_entry.CREATION_USER_GUID = "1";
              this.cashcard_entry.UPDATE_TS = new Date().toISOString();
              this.cashcard_entry.UPDATE_USER_GUID = "";
              this.cashcard_entry.TENANT_GUID = UUID.UUID();

              this.cashcardsetupservice.save(this.cashcard_entry)
                .subscribe((response) => {
                  if (response.status == 200) {
                    alert('Cashcard Registered successfully');
                    //location.reload();
                    this.navCtrl.setRoot(this.navCtrl.getActive().component);
                  }
                });
            }
          }
          else {
            console.log("Records Found");
            alert("The Cashcard is already Exist.")
          }
        },
        err => {
          this.Exist_Record = false;
          console.log("ERROR!: ", err);
        });
    }
  }

  getCashcardList() {
    let self = this;
    let params: URLSearchParams = new URLSearchParams();
    self.cashcardsetupservice.get_cashcard(params)
      .subscribe((cashcards: CashcardSetup_Model[]) => {
        self.cashcards = cashcards;
      });
  }

  Update(CASHCARD_GUID: any) {
    // if (this.Cashform.valid) {
    if (this.Cashform.valid) {
      if (this.cashcard_entry.ACCOUNT_ID == null) { this.cashcard_entry.ACCOUNT_ID = this.ACCOUNT_ID_ngModel_Edit; }
      if (this.cashcard_entry.CASHCARD_SNO == null) { this.cashcard_entry.CASHCARD_SNO = this.CASHCARD_SNO_ngModel_Edit; }

      if (this.cashcard_entry.ACCOUNT_PASSWORD == null) { this.cashcard_entry.ACCOUNT_PASSWORD = this.ACCOUNT_PASSWORD_ngModel_Edit; }
      if (this.cashcard_entry.MANAGEMENT_URL == null) { this.cashcard_entry.MANAGEMENT_URL = this.MANAGEMENT_URL_ngModel_Edit; }
      if (this.cashcard_entry.DESCRIPTION == null) { this.cashcard_entry.DESCRIPTION = this.DESCRIPTION_ngModel_Edit; }

      this.cashcard_entry.CREATION_TS = this.cashcard_details.CREATION_TS;
      this.cashcard_entry.CREATION_USER_GUID = this.cashcard_details.CREATION_USER_GUID;
      this.cashcard_entry.ACTIVATION_FLAG = this.cashcard_details.ACTIVATION_FLAG;
      this.cashcard_entry.TENANT_GUID = this.cashcard_details.CREATION_USER_GUID;

      this.cashcard_entry.CASHCARD_GUID = CASHCARD_GUID;
      this.cashcard_entry.UPDATE_TS = new Date().toISOString();
      this.cashcard_entry.UPDATE_USER_GUID = '1';

      let url: string;
     
      if (this.ACCOUNT_ID_ngModel_Edit.trim() != localStorage.getItem('Prev_ACCOUNT_ID') || this.CASHCARD_SNO_ngModel_Edit.trim() != localStorage.getItem('Prev_CASHCARD_SNO')) {
        alert('nothing changed');
        url = this.baseResource_Url + "main_cashcard?filter=(ACCOUNT_ID=" + this.ACCOUNT_ID_ngModel_Edit + ")OR(CASHCARD_SNO=" + this.CASHCARD_SNO_ngModel_Edit + ")&api_key=" + constants.DREAMFACTORY_API_KEY;
       console.log(url);
        this.http.get(url)
          .map(res => res.json())
          .subscribe(
          data => {
            let res1 = data["resource"];
            console.log(res1);
            if (res1.length == 0) {
              console.log("No records Found");
              this.cashcard_entry.ACCOUNT_ID = this.ACCOUNT_ID_ngModel_Edit.trim();
              this.cashcard_entry.CASHCARD_SNO = this.CASHCARD_SNO_ngModel_Edit.trim();

              //**************Update service if it is new details*************************
              this.cashcardsetupservice.update(this.cashcard_entry)
                .subscribe((response) => {
                  if (response.status == 200) {
                    alert('Cashcard updated successfully');
                    //location.reload();
                    this.navCtrl.setRoot(this.navCtrl.getActive().component);
                  }
                });
              //**************************************************************************
            }
            else {
              if(this.ACCOUNT_ID_ngModel_Edit.trim() != localStorage.getItem('Prev_ACCOUNT_ID') && this.CASHCARD_SNO_ngModel_Edit.trim() == localStorage.getItem('Prev_CASHCARD_SNO')){
               // alert('Ac id change, cash card same'); 
               let j=0;
                for(let i of res1) {
                  //alert(res1[j++]["ACCOUNT_ID"]);
                  
                  // if(res1[j++]["ACCOUNT_ID"].trim()!=this.ACCOUNT_ID_ngModel_Edit.trim()){
                  //   alert('update required');
                  // }
                  // else{
                  //   alert('exist record');
                  // }
                
                }
                
                //alert('Record Value: ' + res1[0]["ACCOUNT_ID"].trim() + ', Entry Value:' + this.ACCOUNT_ID_ngModel_Edit.trim());   
                
                if(res1[0]["ACCOUNT_ID"].trim()!=this.ACCOUNT_ID_ngModel_Edit.trim()){
                  this.cashcard_entry.ACCOUNT_ID = this.ACCOUNT_ID_ngModel_Edit.trim();
                  this.cashcard_entry.CASHCARD_SNO = this.CASHCARD_SNO_ngModel_Edit.trim();
    
                  //**************Update service if it is new details*************************
                  this.cashcardsetupservice.update(this.cashcard_entry)
                    .subscribe((response) => {
                      if (response.status == 200) {
                        alert('Cashcard updated successfully');
                        //location.reload();
                        this.navCtrl.setRoot(this.navCtrl.getActive().component);
                      }
                    });
                  //**************************************************************************
                }
                else{
                  alert("The Cashcard is already Exist.");
                }                             
              }
              else if(this.ACCOUNT_ID_ngModel_Edit.trim() == localStorage.getItem('Prev_ACCOUNT_ID') && this.CASHCARD_SNO_ngModel_Edit.trim() != localStorage.getItem('Prev_CASHCARD_SNO')){
               // alert('Ac id same, cash card change');
                //alert('Record Value: ' + res1[0]["CASHCARD_SNO"].trim() + ', Entry Value:' + this.CASHCARD_SNO_ngModel_Edit.trim());  
                if(res1[0]["CASHCARD_SNO"].trim()!=this.CASHCARD_SNO_ngModel_Edit.trim()){
                  this.cashcard_entry.ACCOUNT_ID = this.ACCOUNT_ID_ngModel_Edit.trim();
                  this.cashcard_entry.CASHCARD_SNO = this.CASHCARD_SNO_ngModel_Edit.trim();
    
                  //**************Update service if it is new details*************************
                  this.cashcardsetupservice.update(this.cashcard_entry)
                    .subscribe((response) => {
                      if (response.status == 200) {
                        alert('Cashcard updated successfully');
                        //location.reload();
                        this.navCtrl.setRoot(this.navCtrl.getActive().component);
                      }
                    });
                  //**************************************************************************
                }
                else{
                  alert("The Cashcard is already Exist.");
                }            
              }
              else{
                alert("The Cashcard is already Exist.");
              }
              //console.log("Records Found");
            }
          },
          err => {
            //this.Exist_Record = false;
            console.log("ERROR!: ", err);
          });
      }
      else {
        this.cashcard_entry.CASHCARD_SNO = localStorage.getItem('Prev_CASHCARD_SNO');
        this.cashcard_entry.ACCOUNT_ID = localStorage.getItem('Prev_ACCOUNT_ID');
      
        //**************Update service if it is old details*************************
        this.cashcardsetupservice.update(this.cashcard_entry)
          .subscribe((response) => {
            if (response.status == 200) {
              alert('Cashcard updated successfully');
              //location.reload();
              this.navCtrl.setRoot(this.navCtrl.getActive().component);
              //*************************************************************************/
            }
          });
      }
    }
  }

  ClearControls() {
    this.CASHCARD_SNO_ngModel_Add = "";
    this.ACCOUNT_ID_ngModel_Add = "";
    this.ACCOUNT_PASSWORD_ngModel_Add = "";
    this.MANAGEMENT_URL_ngModel_Add = "";
    this.DESCRIPTION_ngModel_Add = "";

    this.CASHCARD_SNO_ngModel_Edit = "";
    this.ACCOUNT_ID_ngModel_Edit = "";
    this.ACCOUNT_PASSWORD_ngModel_Edit = "";
    this.MANAGEMENT_URL_ngModel_Edit = "";
    this.DESCRIPTION_ngModel_Edit = "";
  }
}
