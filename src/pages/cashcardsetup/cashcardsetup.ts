import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { CashcardSetup_Model } from '../../models/cashcardsetup_model';
import { CashcardSetup_Service } from '../../services/cashcardsetup_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';
import { LoginPage } from '../login/login';
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
  public page:number = 1;
  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_cashcard' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  public cashcards: CashcardSetup_Model[] = [];

  public AddCashClicked: boolean = false;
  public EditCashClicked: boolean = false;
  public Exist_Record: boolean = false;

  public cashcard_details: any;
  public exist_record_details: any;

  //Set the Model Name for Add------------------------------------------
  public CASHCARD_SNO_ngModel_Add: any;
  public ACCOUNT_ID_ngModel_Add: any;
  public ACCOUNT_PASSWORD_ngModel_Add: any;
  public MANAGEMENT_URL_ngModel_Add: any;
  public DESCRIPTION_ngModel_Add: any;
  //---------------------------------------------------------------------

  Tenant_Add_ngModel: any;
  AdminLogin: boolean = false; Add_Form: boolean = false; Edit_Form: boolean = false;
  tenants: any;
  Key_Param: string = 'api_key=' + constants.DREAMFACTORY_API_KEY;

  public AddCashClick() {
    if (this.Edit_Form == false) {
      this.AddCashClicked = true; this.Add_Form = true; this.Edit_Form = false;
      this.ClearControls();
    }
    else {
      alert('Sorry, You are in edit mode.');
    }
  }

  public CloseCashClick() {
    if (this.AddCashClicked == true) {
      this.AddCashClicked = false;
      this.Add_Form = true; this.Edit_Form = false;
    }
  }

  public EditClick(CASHCARD_GUID: any) {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();

    this.ClearControls();
    this.AddCashClicked = true; this.Add_Form = false; this.Edit_Form = true;

    var self = this;
    this.cashcardsetupservice
      .get(CASHCARD_GUID)
      .subscribe((data) => {
        self.cashcard_details = data;
        this.Tenant_Add_ngModel = self.cashcard_details.TENANT_GUID; localStorage.setItem('Prev_TenantGuid', self.cashcard_details.TENANT_GUID);
        this.ACCOUNT_ID_ngModel_Add = self.cashcard_details.ACCOUNT_ID; localStorage.setItem('Prev_ACCOUNT_ID', self.cashcard_details.ACCOUNT_ID);
        this.CASHCARD_SNO_ngModel_Add = self.cashcard_details.CASHCARD_SNO; localStorage.setItem('Prev_CASHCARD_SNO', self.cashcard_details.CASHCARD_SNO);
        this.ACCOUNT_PASSWORD_ngModel_Add = self.cashcard_details.ACCOUNT_PASSWORD;
        this.MANAGEMENT_URL_ngModel_Add = self.cashcard_details.MANAGEMENT_URL; localStorage.setItem('Prev_MANAGEMENT_URL', self.cashcard_details.MANAGEMENT_URL);
        this.DESCRIPTION_ngModel_Add = self.cashcard_details.DESCRIPTION;

        this.loading.dismissAll();
      });
  }

  public DeleteClick(CASHCARD_GUID: any) {
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

  loading: Loading; button_Add_Disable:boolean = false; button_Edit_Disable: boolean = false; button_Delete_Disable: boolean = false; button_View_Disable: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private cashcardsetupservice: CashcardSetup_Service, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    if (localStorage.getItem("g_USER_GUID") == null) {
      alert('Sorry, Please login.');
      this.navCtrl.push(LoginPage);
    }
    else {
      this.button_Add_Disable = false; this.button_Edit_Disable = false; this.button_Delete_Disable = false; this.button_View_Disable = false;
      if (localStorage.getItem("g_USER_GUID") != "sva") {
        //Get the role for this page------------------------------        
        if(localStorage.getItem("g_KEY_ADD") == "0"){ this.button_Add_Disable = true; }
        if(localStorage.getItem("g_KEY_EDIT") == "0"){ this.button_Edit_Disable = true; }
        if(localStorage.getItem("g_KEY_DELETE") == "0"){ this.button_Delete_Disable = true; }
        if(localStorage.getItem("g_KEY_VIEW") == "0"){ this.button_View_Disable = true; }
        
        //Clear localStorage value--------------------------------      
        this.ClearLocalStorage();

        //fill all the tenant details----------------------------
        this.FillTenant();

        //Display Grid---------------------------------------------
        this.DisplayGrid();

        //-------------------------------------------------------
        if (localStorage.getItem("g_USER_GUID") != "sva") {
          this.Cashform = fb.group({
            CASHCARD_SNO: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
            ACCOUNT_ID: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
            ACCOUNT_PASSWORD: [null, Validators.compose([Validators.pattern('((?=.*\)(?=.*[a-zA-Z0-9]).{4,20})'), Validators.required])],
            //MANAGEMENT_URL: [null, Validators.compose([Validators.pattern('^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$'), Validators.required])],          
            MANAGEMENT_URL: [null, Validators.compose([Validators.pattern('^(http[s]?:\\/\\/){0,1}(www\\.){0,1}[a-zA-Z0-9\\.\\-]+\\.[a-zA-Z]{2,5}[\\.]{0,1}$'), Validators.required])],

            //For email validation
            //Validators.pattern('[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}')
            DESCRIPTION: [null],
          });
        }
        else {
          this.Cashform = fb.group({
            CASHCARD_SNO: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
            ACCOUNT_ID: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
            ACCOUNT_PASSWORD: [null, Validators.compose([Validators.pattern('((?=.*\)(?=.*[a-zA-Z0-9]).{6,20})'), Validators.required])],
            //MANAGEMENT_URL: [null, Validators.compose([Validators.pattern('^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$'), Validators.required])],
            MANAGEMENT_URL: [null, Validators.compose([Validators.pattern('^(http[s]?:\\/\\/){0,1}(www\\.){0,1}[a-zA-Z0-9\\.\\-]+\\.[a-zA-Z]{2,5}[\\.]{0,1}$'), Validators.required])],
            DESCRIPTION: [null],
            TENANT_NAME: [null, Validators.required],
          });
        }
      }
      else {
        alert('Sorry, you are not authorized for the action. authorized.');
        this.navCtrl.setRoot(this.navCtrl.getActive().component);
      }
    }
  }

  ClearLocalStorage() {
    if (localStorage.getItem('Prev_TenantGuid') == null) {
      localStorage.setItem('Prev_TenantGuid', null);
    }
    else {
      localStorage.removeItem("Prev_TenantGuid");
    }

    if (localStorage.getItem('Prev_ACCOUNT_ID') == null) {
      localStorage.setItem('Prev_ACCOUNT_ID', null);
    }
    else {
      localStorage.removeItem("Prev_ACCOUNT_ID");
    }

    if (localStorage.getItem('Prev_CASHCARD_SNO') == null) {
      localStorage.setItem('Prev_CASHCARD_SNO', null);
    }
    else {
      localStorage.removeItem("Prev_CASHCARD_SNO");
    }

    if (localStorage.getItem('Prev_MANAGEMENT_URL') == null) {
      localStorage.setItem('Prev_MANAGEMENT_URL', null);
    }
    else {
      localStorage.removeItem("Prev_MANAGEMENT_URL");
    }
  }

  FillTenant() {
    if (localStorage.getItem("g_USER_GUID") == "sva") {
      let tenantUrl: string = this.baseResource_Url + 'tenant_main?order=TENANT_ACCOUNT_NAME&' + this.Key_Param;
      this.http
        .get(tenantUrl)
        .map(res => res.json())
        .subscribe(data => {
          this.tenants = data.resource;
        });
      this.AdminLogin = true;
    }
    else {
      this.AdminLogin = false;
    }
  }

  DisplayGrid() {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();
    if (localStorage.getItem("g_USER_GUID") == "sva") {
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_cashcard_details' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
      this.AdminLogin = true;
    }
    else {
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_cashcard_details' + '?filter=(TENANT_GUID=' + localStorage.getItem('g_TENANT_GUID') + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      this.AdminLogin = false;
    }

    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.cashcards = data.resource;

        this.loading.dismissAll();
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CashcardsetupPage');
  }

  Save() {
    if (this.Cashform.valid) {
      //for Save Set Entities-------------------------------------------------------------
      if (this.Add_Form == true) {
        this.SetEntityForAdd();
      }
      //for Update Set Entities------------------------------------------------------------
      else {
        this.SetEntityForUpdate();
      }

      //Common Entry---------------------------------------
      this.SetCommonEntityForAddUpdate();

      //Load the Controller--------------------------------
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...',
      });
      this.loading.present();
      //--------------------------------------------------

      if (this.Tenant_Add_ngModel != localStorage.getItem('Prev_TenantGuid') || this.ACCOUNT_ID_ngModel_Add.trim().toUpperCase() != localStorage.getItem('Prev_ACCOUNT_ID').toUpperCase() || this.CASHCARD_SNO_ngModel_Add != localStorage.getItem('Prev_CASHCARD_SNO') || this.MANAGEMENT_URL_ngModel_Add != localStorage.getItem('Prev_MANAGEMENT_URL')) {
        let val = this.CheckDuplicate();
        val.then((res) => {
          if (res.toString() == "0") {
            //---Insert or Update-------------------------------------------------------
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
            alert("The Cashcard is already Exist.");
            this.loading.dismissAll();
          }
        });
        val.catch((err) => {
          console.log(err);
        });
      }
      else {
        //Simple update----------------------------------------------------------        
        this.Update();
      }
    }
  }

  SetEntityForAdd() {
    if (this.Add_Form == true) {
      this.cashcard_entry.CASHCARD_SNO = this.CASHCARD_SNO_ngModel_Add.trim();
      this.cashcard_entry.ACCOUNT_ID = this.ACCOUNT_ID_ngModel_Add.trim();
      this.cashcard_entry.ACCOUNT_PASSWORD = this.ACCOUNT_PASSWORD_ngModel_Add.trim();
      this.cashcard_entry.MANAGEMENT_URL = this.MANAGEMENT_URL_ngModel_Add;
      this.cashcard_entry.DESCRIPTION = this.DESCRIPTION_ngModel_Add;

      this.cashcard_entry.CASHCARD_GUID = UUID.UUID();
      this.cashcard_entry.CREATION_TS = new Date().toISOString();
      this.cashcard_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
      this.cashcard_entry.UPDATE_TS = new Date().toISOString();
      this.cashcard_entry.UPDATE_USER_GUID = "";
      this.cashcard_entry.TENANT_GUID = UUID.UUID();

      //=====================================================================================
      this.cashcard_entry.CASHCARD_GUID = UUID.UUID();
      this.cashcard_entry.CREATION_TS = new Date().toISOString();
      if (localStorage.getItem("g_USER_GUID") != "sva") {
        this.cashcard_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
      }
      else {
        this.cashcard_entry.CREATION_USER_GUID = 'sva';
      }
      this.cashcard_entry.UPDATE_TS = new Date().toISOString();
      this.cashcard_entry.UPDATE_USER_GUID = "";
    }
  }

  SetEntityForUpdate() {
    this.cashcard_entry.CASHCARD_GUID = this.cashcard_details.CASHCARD_GUID;
    this.cashcard_entry.CREATION_TS = this.cashcard_details.CREATION_TS;
    this.cashcard_entry.CREATION_USER_GUID = this.cashcard_details.CREATION_USER_GUID;
    this.cashcard_entry.UPDATE_TS = new Date().toISOString();
    if (localStorage.getItem("g_USER_GUID") != "sva") {
      this.cashcard_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");
    }
    else {
      this.cashcard_entry.UPDATE_USER_GUID = 'sva';
    }
  }

  SetCommonEntityForAddUpdate() {
    this.cashcard_entry.CASHCARD_SNO = this.CASHCARD_SNO_ngModel_Add.trim();
    this.cashcard_entry.ACCOUNT_ID = this.ACCOUNT_ID_ngModel_Add.trim();
    this.cashcard_entry.ACCOUNT_PASSWORD = this.ACCOUNT_PASSWORD_ngModel_Add.trim();
    this.cashcard_entry.MANAGEMENT_URL = this.MANAGEMENT_URL_ngModel_Add;
    this.cashcard_entry.DESCRIPTION = this.DESCRIPTION_ngModel_Add;
    this.cashcard_entry.ACTIVATION_FLAG = 1;

    if (localStorage.getItem("g_USER_GUID") != "sva") {
      this.cashcard_entry.TENANT_GUID = localStorage.getItem("g_TENANT_GUID");
    }
    else {
      this.cashcard_entry.TENANT_GUID = this.Tenant_Add_ngModel;
    }
  }

  RemoveStorageValues() {
    localStorage.removeItem("Prev_TenantGuid");
    localStorage.removeItem("Prev_ACCOUNT_ID");
    localStorage.removeItem("Prev_CASHCARD_SNO");
    localStorage.removeItem("Prev_MANAGEMENT_URL");
  }

  Insert() {
    this.cashcardsetupservice.save(this.cashcard_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          alert('Cashcard Registered successfully.');

          //Remove all storage values-----------------------------------------
          this.RemoveStorageValues();
          //------------------------------------------------------------------

          this.navCtrl.setRoot(this.navCtrl.getActive().component);
        }
      });
  }

  Update() {
    this.cashcardsetupservice.update(this.cashcard_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          alert('Cashcard updated successfully.');

          //Remove all storage values-----------------------------------------
          this.RemoveStorageValues();
          //------------------------------------------------------------------

          this.navCtrl.setRoot(this.navCtrl.getActive().component);
        }
      });
  }

  CheckDuplicate() {
    let url: string = "";
    if (localStorage.getItem("g_USER_GUID") != "sva") {
      url = this.baseResource_Url + "main_cashcard?filter=TENANT_GUID=" + localStorage.getItem("g_TENANT_GUID") + ' AND ACCOUNT_ID=' + this.ACCOUNT_ID_ngModel_Add.trim() + ' AND CASHCARD_SNO=' + this.CASHCARD_SNO_ngModel_Add.trim() + ' AND MANAGEMENT_URL=' + this.MANAGEMENT_URL_ngModel_Add.trim() + '&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    else {
      url = this.baseResource_Url + "main_cashcard?filter=TENANT_GUID=" + this.Tenant_Add_ngModel + ' AND ACCOUNT_ID=' + this.ACCOUNT_ID_ngModel_Add.trim() + ' AND CASHCARD_SNO=' + this.CASHCARD_SNO_ngModel_Add.trim() + ' AND MANAGEMENT_URL=' + this.MANAGEMENT_URL_ngModel_Add.trim() + '&api_key=' + constants.DREAMFACTORY_API_KEY;      
    }
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

  ClearControls() {
    this.CASHCARD_SNO_ngModel_Add = "";
    this.ACCOUNT_ID_ngModel_Add = "";
    this.ACCOUNT_PASSWORD_ngModel_Add = "";
    this.MANAGEMENT_URL_ngModel_Add = "";
    this.DESCRIPTION_ngModel_Add = "";
    this.Tenant_Add_ngModel = "";
  }
}
