import 'rxjs/add/operator/map';

import { AlertController, IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { DREAMFACTORY_API_KEY, DREAMFACTORY_INSTANCE_URL } from '../../../app/config/constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BankSetup_Model } from '../../../models/banksetup_model';
import { BankSetup_Service } from '../../../services/banksetup_service';
import { BaseHttpService } from '../../../services/base-http';
import { ClearControls } from '../../../services/controls_service';
import { Component } from '@angular/core';
import { ExcelService } from '../../../providers/excel.service';
import { Http } from '@angular/http';
import { TitleCasePipe } from '@angular/common';
import { UUID } from 'angular2-uuid';
import { authCheck } from '../../../shared/authcheck';
import { dbServices } from '../../../services/db_checking_service';

/**
 * Generated class for the BanksetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-banksetup',
  templateUrl: 'banksetup.html', providers: [BankSetup_Service, BaseHttpService, TitleCasePipe, ExcelService]
})
export class BanksetupPage extends authCheck {
  dbservices = new dbServices(this.http);
  NAME: any;
  bank_entry: BankSetup_Model = new BankSetup_Model();
  Bankform: FormGroup;
  bank: BankSetup_Model = new BankSetup_Model();
  current_bankGUID: string = '';

  baseResourceUrl: string = DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_bank' + '?api_key=' + DREAMFACTORY_API_KEY;
  baseResource_Url: string = DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
  Key_Param: string = 'api_key=' + DREAMFACTORY_API_KEY;
  public banks: BankSetup_Model[] = [];
  public BankDetails: any;

  public AddBanksClicked: boolean = false;
  public bank_details: any;

  Tenant_Add_ngModel: any;
  AdminLogin: boolean = false;
  Add_Form: boolean = false;
  Edit_Form: boolean = false;
  tenants: any;
  public page: number = 1;
  //Set the Model Name for Add------------------------------------------
  public NAME_ngModel_Add: any;
  //---------------------------------------------------------------------

  public AddBanksClick() {
    if (this.Edit_Form == false) {
      this.AddBanksClicked = true;
      this.Add_Form = true;
      this.Edit_Form = false;
      ClearControls(this);
    }
    else {
      alert('Sorry. You are in Edit Mode.');
    }
  }

  public CloseBanksClick() {
    if (this.AddBanksClicked == true) {
      this.AddBanksClicked = false;
      this.Add_Form = true;
      this.Edit_Form = false;
    }
  }

  public EditClick(BANK_GUID: any) {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();

    ClearControls(this);
    this.AddBanksClicked = true;
    this.Add_Form = false;
    this.Edit_Form = true;

    //this.current_bankGUID = BANK_GUID;
    var self = this;
    this.banksetupservice
      .get(BANK_GUID)
      .subscribe((data) => {
        self.bank_details = data;
        this.Tenant_Add_ngModel = self.bank_details.TENANT_GUID;
        this.NAME_ngModel_Add = self.bank_details.NAME;
        localStorage.setItem('Prev_Name', self.bank_details.NAME); localStorage.setItem('Prev_TenantGuid', self.bank_details.TENANT_GUID);

        this.loading.dismissAll();
      });
  }

  public DeleteClick(BANK_GUID: any) {
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

  loading: Loading;
  constructor(
    private excelService: ExcelService,
    fb: FormBuilder,
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    private banksetupservice: BankSetup_Service,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private titlecasePipe: TitleCasePipe) {
    super(navCtrl, true);

    //Display Grid---------------------------------------------      
    this.DisplayGrid();

    //----------------------------------------------------------
    if (localStorage.getItem("g_IS_TENANT_ADMIN") == "1") {
      this.Bankform = fb.group({
        NAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
      });
    }
    else {
      this.Bankform = fb.group({
        NAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        TENANT_NAME: [null, Validators.required],
      });
    }
    this.excelService = excelService;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BanksetupPage');
  }

  DisplayGrid() {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();

    let view_url: string = "";
    if (localStorage.getItem("g_IS_SUPER") != "1") {
      view_url = DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_bank_details' + '?filter=(TENANT_GUID=' + localStorage.getItem("g_TENANT_GUID") + ')&api_key=' + DREAMFACTORY_API_KEY;
    }
    else {
      view_url = DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_bank_details' + '?api_key=' + DREAMFACTORY_API_KEY;
    }
    this.http
      .get(view_url)
      .map(res => res.json())
      .subscribe(data => {
        this.banks = this.BankDetails = data.resource;

        this.loading.dismissAll();
      });
  }

  Save_Bank() {
    if (this.Bankform.valid) {
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

      let strPrev_Name: string = "";
      if (localStorage.getItem('Prev_Name') != null) {
        strPrev_Name = localStorage.getItem('Prev_Name').toUpperCase();
      }

      if (this.NAME_ngModel_Add.trim().toUpperCase() != strPrev_Name || this.Tenant_Add_ngModel != localStorage.getItem('Prev_TenantGuid')) {
        let exists = this.CheckDuplicate();
            if (!exists) {
              //---Insert or Update-----------
              if (this.Add_Form == true) {
                //**************Save service if it is new details***************************              
                this.Insert();
                //**************************************************************************
              }
              else {
                //**************Update service if it is existing details*************************              
                this.Update();
                //**************************************************************************
              }
            }
            else {
              alert("The Bank is already exist.");
              this.loading.dismissAll();
            }
      }
      else {
        //Simple update----------        
        this.Update();
      }
    }
  }

  SetEntityForAdd() {
    if (this.Add_Form == true) {
      this.bank_entry.BANK_GUID = UUID.UUID();
      this.bank_entry.CREATION_TS = new Date().toISOString();
      this.bank_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
      this.bank_entry.UPDATE_TS = new Date().toISOString();
      this.bank_entry.UPDATE_USER_GUID = "";
    }
  }

  SetEntityForUpdate() {
    this.bank_entry.BANK_GUID = this.bank_details.BANK_GUID;
    this.bank_entry.CREATION_TS = this.bank_details.CREATION_TS;
    this.bank_entry.CREATION_USER_GUID = this.bank_details.CREATION_USER_GUID;
    this.bank_entry.UPDATE_TS = new Date().toISOString();
    this.bank_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");
  }

  SetCommonEntityForAddUpdate() {
    this.bank_entry.NAME = this.titlecasePipe.transform(this.NAME_ngModel_Add.trim());
    if (localStorage.getItem("g_IS_SUPER") != "1") {
      this.bank_entry.TENANT_GUID = localStorage.getItem("g_TENANT_GUID");
    }
    else {
      this.bank_entry.TENANT_GUID = this.Tenant_Add_ngModel;
    }
    this.bank_entry.DESCRIPTION = 'Savings';
  }

  RemoveStorageValues() {
    localStorage.removeItem("Prev_Name");
    localStorage.removeItem("Prev_TenantGuid");
  }

  Insert() {
    this.banksetupservice.save_bank(this.bank_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          alert('Bank registered successfully');

          //Remove all storage values-----------------------------------------          
          this.RemoveStorageValues();
          //------------------------------------------------------------------

          this.navCtrl.setRoot(this.navCtrl.getActive().component);
        }
      });
  }

  Update() {
    this.banksetupservice.update_bank(this.bank_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          alert('Bank updated successfully');

          //Remove all storage values-----------------------------------------          
          this.RemoveStorageValues();
          //------------------------------------------------------------------

          this.navCtrl.setRoot(this.navCtrl.getActive().component);
        }
      });
  }

  CheckDuplicate(): any {
    if ((localStorage.getItem("g_IS_SUPER") != "1") && (this.Tenant_Add_ngModel != undefined)) {
      return this.dbservices.CheckExistence("main_bank", "NAME='" + this.NAME_ngModel_Add.trim() + "' AND TENANT_GUID=" + this.Tenant_Add_ngModel)
    }
    else {
      return this.dbservices.CheckExistence("main_bank", "NAME='" + this.NAME_ngModel_Add.trim() + "'");
    }
  }

  ExportToExcel() {
    this.excelService.exportAsExcelFile(this.banks, 'Data');
  }
}