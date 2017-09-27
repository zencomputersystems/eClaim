import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { BankSetup_Model } from '../../models/banksetup_model';
import { BankSetup_Service } from '../../services/banksetup_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';
import { GlobalFunction } from '../../shared/GlobalFunction'; 

/**
 * Generated class for the BanksetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-banksetup',
  templateUrl: 'banksetup.html', providers: [BankSetup_Service, BaseHttpService, GlobalFunction]
})
export class BanksetupPage {  
  NAME:any;
  bank_entry: BankSetup_Model = new BankSetup_Model();
  Bankform: FormGroup;
  bank: BankSetup_Model = new BankSetup_Model();
  current_bankGUID: string = '';

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_bank' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  public banks: BankSetup_Model[] = [];

  public AddBanksClicked: boolean = false; 
  public EditBanksClicked: boolean = false; 
  public Exist_Record: boolean = false;

  public bank_details: any; 
  public exist_record_details: any;

  //Set the Model Name for Add------------------------------------------
  public NAME_ngModel_Add: any;
  //---------------------------------------------------------------------

  //Set the Model Name for edit------------------------------------------
  public  NAME_ngModel_Edit: any;
  //---------------------------------------------------------------------

  public AddBanksClick() {
    this.AddBanksClicked = true;
    this.ClearControls();
  }

  public CloseBanksClick() {
    if (this.AddBanksClicked == true) {
      this.AddBanksClicked = false;
    }
    if (this.EditBanksClicked == true) {
      this.EditBanksClicked = false;
    }
  }

  public EditClick(BANK_GUID: any) {
    this.ClearControls();
    this.EditBanksClicked = true;
    this.current_bankGUID = BANK_GUID;
    var self = this;
    this.banksetupservice
      .get(BANK_GUID)
      .subscribe((data) => {
      self.bank_details = data; 
      this.NAME_ngModel_Edit = self.bank_details.NAME; localStorage.setItem('Prev_Name', self.bank_details.NAME);
  });
  }
  public DeleteClick(BANK_GUID: any) {
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
            this.banksetupservice.remove(BANK_GUID)
              .subscribe(() => {
                self.banks = self.banks.filter((item) => {
                  return item.BANK_GUID != BANK_GUID
                });
              });
            //this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        }
      ]
    }); alert.present();
  }

  constructor(private fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams, public http: Http, private httpService: BaseHttpService, private banksetupservice: BankSetup_Service, private alertCtrl: AlertController, public GlobalFunction: GlobalFunction) {
    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.banks = data.resource;
      });
    //this.getBankList();

    this.Bankform = fb.group({
      NAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
      //NAME: [null, Validators.compose([Validators.pattern('[a-zA-Z][a-zA-Z ]+'), Validators.required])],
      
      //NAME: [null, Validators.compose([Validators.pattern('[a-zA-Z0-9][a-zA-Z0-9 ]+'), Validators.required])], 
      //NAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z][a-zA-Z0-9\\s]+$'), Validators.required])],


      //NAME: [null, Validators.compose([Validators.pattern('^[a-z]+[_+\+/+-+.+’][a-z]+$'), Validators.required])],
      //NAME: ["", Validators.required],

      
      //NAME: [null, Validators.compose([Validators.pattern('[a-zA-Z0-9a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])], 
      //NAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9!@#%$&()-`.+,/\"\\s]*$'), Validators.required])], 
      
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BanksetupPage');
  }

  Save_Bank() {
    if (this.Bankform.valid) {

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      let url: string;
      url =  this.baseResource_Url + "main_bank?filter=(NAME=" + this.NAME_ngModel_Add.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      this.http.get(url, options)
        .map(res => res.json())
        .subscribe(
        data => {
          let res = data["resource"];
          if (res.length == 0) {
            console.log("No records Found");
            if (this.Exist_Record == false) {
              this.bank_entry.NAME =  this.NAME_ngModel_Add.trim();

            this.bank_entry.BANK_GUID = UUID.UUID();
            this.bank_entry.TENANT_GUID = UUID.UUID();
            this.bank_entry.DESCRIPTION = 'Savings';
            this.bank_entry.CREATION_TS = new Date().toISOString();
            this.bank_entry.CREATION_USER_GUID = '1';

            this.bank_entry.UPDATE_TS = new Date().toISOString();
            this.bank_entry.UPDATE_USER_GUID = "";

            this.banksetupservice.save_bank(this.bank_entry)
              .subscribe((response) => {
                if (response.status == 200) {
                  alert('Bank Registered successfully');
                  //this.GlobalFunction.showAlert_New('Bank Registered successfully !!');
                  //location.reload();
                  this.navCtrl.setRoot(this.navCtrl.getActive().component);
                }
              });
            }
          }
          else {
            console.log("Records Found");
            alert("The Bank is already Exist.")
          }
        },
        err => {
          this.Exist_Record = false;
          console.log("ERROR!: ", err);
        }
        );
    }
  }
  getBankList() {
    let self = this;
    let params: URLSearchParams = new URLSearchParams();
    self.banksetupservice.get_bank(params)
      .subscribe((banks: BankSetup_Model[]) => {
        self.banks = banks;
      });
  }

  Update_Bank(BANK_GUID: any) {
    if (this.Bankform.valid){
      if (this.bank_entry.NAME == null) { this.bank_entry.NAME = this.NAME_ngModel_Edit.trim(); }
  
  this.bank_entry.DESCRIPTION = this.bank_details.DESCRIPTION.trim();
  this.bank_entry.TENANT_GUID = this.bank_details.TENANT_GUID;
  this.bank_entry.CREATION_TS = this.bank_details.CREATION_TS;
  this.bank_entry.CREATION_USER_GUID = this.bank_details.CREATION_USER_GUID;

  this.bank_entry.BANK_GUID = BANK_GUID;
  this.bank_entry.UPDATE_TS = new Date().toISOString();
  this.bank_entry.UPDATE_USER_GUID = '1';

  if (this.NAME_ngModel_Edit.trim() != localStorage.getItem('Prev_Name')) {
    let url: string;
    url = this.baseResource_Url + "main_bank?filter=(NAME=" + this.NAME_ngModel_Edit.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http.get(url)
      .map(res => res.json())
      .subscribe(
      data => {
        let res = data["resource"];
        //console.log('Current Name : ' + this.NAME_ngModel_Edit + ', Previous Name : ' + localStorage.getItem('Prev_Name'));
        if (res.length == 0) {
          console.log("No records Found");
          this.bank_entry.NAME = this.NAME_ngModel_Edit.trim();
          
          //**************Update service if it is new details*************************
          this.banksetupservice.update_bank(this.bank_entry)
            .subscribe((response) => {
              if (response.status == 200) {
                alert('Bank updated successfully');
                this.navCtrl.setRoot(this.navCtrl.getActive().component);
              }
            });
          //**************************************************************************
        }
        else {
          console.log("Records Found");
          alert("The bank is already Exist. ");
        }
      },
      err => {
        this.Exist_Record = false;
        console.log("ERROR!: ", err);
      });
  }
  else {
   // if (this.NAME_ngModel_Edit != localStorage.getItem('Prev_Name')){
    if (this.bank_entry.NAME == null) { this.bank_entry.NAME = localStorage.getItem('Prev_Name'); }
    this.bank_entry.NAME = this.NAME_ngModel_Edit.trim();
   
    //**************Update service if it is old details*************************

  // alert(JSON.stringify(this.bank_entry));     

  this.banksetupservice.update_bank(this.bank_entry)
    .subscribe((response) => {
      if (response.status == 200) {
        alert('hi');
        alert('Bank updated successfully');
        this.navCtrl.setRoot(this.navCtrl.getActive().component);
      }
    });
        //  }
        }
        }
      }
      ClearControls()
      {
        this.NAME_ngModel_Add = "";
    
        this.NAME_ngModel_Edit = "";
      }
    }

    //             let headers = new Headers();
  //             headers.append('Content-Type', 'application/json');
  //             let options = new RequestOptions({ headers: headers });
  //             let url: string;
  //             url = "http://api.zen.com.my/api/v2/zcs/_table/main_bank?filter=(NAME=" + this.bank_entry.NAME + ")&api_key=cb82c1df0ba653578081b3b58179158594b3b8f29c4ee1050fda1b7bd91c3881";
  //             this.http.get(url, options)
  //               .map(res => res.json())
  //               .subscribe(
  //               data => {
  //                 let res = data["resource"];
  //                 if (res.length == 0) {
  //                   console.log("No records Found");
  //                   if (this.Exist_Record == false) {

  //                     if (this.Bankform.valid) {
  // if(this.bank_entry.NAME == null){this.bank_entry.NAME = this.bank_entry.NAME;}

  
//       else {
//         console.log("Records Found");
//         alert("The Bank is already Added.")

//       }
//     },
//     err => {
//       this.Exist_Record = false;
//       console.log("ERROR!: ", err);
//     }
//     );
// }              
//   }
// }

