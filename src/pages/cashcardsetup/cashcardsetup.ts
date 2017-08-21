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
  cashcard: CashcardSetup_Model = new CashcardSetup_Model();

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_cashcard' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
  
  public cashcards: CashcardSetup_Model[] = [];

  public AddCashClicked: boolean = false; public EditCashClicked: boolean = false; Exist_Record: boolean = false;

  public AddCashcardsClicked: boolean = false; public cashcard_details: any;

  public AddCashClick() {

    this.AddCashClicked = true;
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
    this.EditCashClicked = true;
    var self = this;
    this.cashcardsetupservice
      .get(CASHCARD_GUID)
      .subscribe((cashcard) => self.cashcard = cashcard);
    return self.cashcard;
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
      CASHCARD_SNO: ["", Validators.required],
      ACCOUNT_ID: ["", Validators.required],
      ACCOUNT_PASSWORD: ["", Validators.required],
      MANAGEMENT_URL: ["", Validators.required],
      DESCRIPTION: ["", Validators.required]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CashcardsetupPage');
  }

  Save() {
    if (this.Cashform.valid) {
      this.cashcard_entry.CASHCARD_GUID = UUID.UUID();
      this.cashcard.ACTIVATION_FLAG = 1;
      this.cashcard_entry.CREATION_TS = new Date().toISOString();
      this.cashcard_entry.CREATION_USER_GUID = '1';
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
        })
    }
  }

  Update(CASHCARD_GUID: any) {
    if(this.cashcard_entry.CASHCARD_SNO==null){this.cashcard_entry.CASHCARD_SNO = this.cashcard.CASHCARD_SNO;}
    if(this.cashcard_entry.ACCOUNT_ID==null){this.cashcard_entry.ACCOUNT_ID = this.cashcard.ACCOUNT_ID;}
    if(this.cashcard_entry.ACCOUNT_PASSWORD==null){this.cashcard_entry.ACCOUNT_PASSWORD = this.cashcard.ACCOUNT_PASSWORD;}
    if(this.cashcard_entry.MANAGEMENT_URL==null){this.cashcard_entry.MANAGEMENT_URL = this.cashcard.MANAGEMENT_URL;}
    if(this.cashcard_entry.DESCRIPTION==null){this.cashcard_entry.DESCRIPTION = this.cashcard.DESCRIPTION;}

    if (this.Cashform.valid) {
      this.cashcard_entry.CREATION_TS = this.cashcard.CREATION_TS;
      this.cashcard_entry.CREATION_USER_GUID = this.cashcard.CREATION_USER_GUID;
      this.cashcard_entry.ACTIVATION_FLAG = this.cashcard.ACTIVATION_FLAG;
      this.cashcard_entry.TENANT_GUID = this.cashcard.CREATION_USER_GUID;

      this.cashcard_entry.CASHCARD_GUID = CASHCARD_GUID;
      this.cashcard_entry.UPDATE_TS = new Date().toISOString();
      this.cashcard_entry.UPDATE_USER_GUID = '1';     

      this.cashcardsetupservice.update(this.cashcard_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            alert('Cashcard updated successfully');
            //location.reload();
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        })
    }
  }
}
