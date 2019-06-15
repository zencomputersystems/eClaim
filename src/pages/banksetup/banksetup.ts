import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { TitleCasePipe } from '@angular/common';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { BankSetup_Model } from '../../models/banksetup_model';
import { BankSetup_Service } from '../../services/banksetup_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';
import { GlobalFunction } from '../../shared/GlobalFunction';
import { LoginPage } from '../login/login';

import { ExcelService } from '../../providers/excel.service';

/**
 * Generated class for the BanksetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-banksetup',
  templateUrl: 'banksetup.html', providers: [BankSetup_Service, BaseHttpService, GlobalFunction, TitleCasePipe, ExcelService]
})
export class BanksetupPage {
  NAME: any;
  bank_entry: BankSetup_Model = new BankSetup_Model();
  Bankform: FormGroup;
  bank: BankSetup_Model = new BankSetup_Model();
  current_bankGUID: string = '';

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_bank' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
  Key_Param: string = 'api_key=' + constants.DREAMFACTORY_API_KEY;
  public banks: BankSetup_Model[] = []; public BankDetails: any;

  public AddBanksClicked: boolean = false;
  public bank_details: any;

  Tenant_Add_ngModel: any;
  AdminLogin: boolean = false; Add_Form: boolean = false; Edit_Form: boolean = false;
  tenants: any;
  public page:number = 1;
  //Set the Model Name for Add------------------------------------------
  public NAME_ngModel_Add: any;
  //---------------------------------------------------------------------

  public AddBanksClick() {
    if (this.Edit_Form == false) {
      this.AddBanksClicked = true; this.Add_Form = true; this.Edit_Form = false;
      this.ClearControls();
    }
    else {
      alert('Sorry. You are in Edit Mode.');
    }
  }

  public CloseBanksClick() {
    if (this.AddBanksClicked == true) {
      this.AddBanksClicked = false;
      this.Add_Form = true; this.Edit_Form = false;
    }
  }

  public EditClick(BANK_GUID: any) {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();

    this.ClearControls();
    this.AddBanksClicked = true; this.Add_Form = false; this.Edit_Form = true;

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

  loading: Loading; button_Add_Disable: boolean = false; button_Edit_Disable: boolean = false; button_Delete_Disable: boolean = false; button_View_Disable: boolean = false;
  constructor(private excelService: ExcelService, private fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams, public http: Http, private httpService: BaseHttpService, private banksetupservice: BankSetup_Service, private alertCtrl: AlertController, public GlobalFunction: GlobalFunction, private loadingCtrl: LoadingController, private titlecasePipe: TitleCasePipe) {
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

        //Clear localStorage value--------------------------------      
        this.ClearLocalStorage();

        //fill all the tenant details----------------------------      
        this.FillTenant();

        //Display Grid---------------------------------------------      
        this.DisplayGrid();

        //----------------------------------------------------------
        if (localStorage.getItem("g_USER_GUID") != "sva") {
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
      }
      else {
        alert('Sorry, you are not authorized for the action. authorized.');
        this.navCtrl.setRoot(this.navCtrl.getActive().component);
      }
      this.excelService = excelService;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BanksetupPage');
  }

  ClearLocalStorage() {
    if (localStorage.getItem('Prev_Name') == null) {
      localStorage.setItem('Prev_Name', null);
    }
    else {
      localStorage.removeItem("Prev_Name");
    }
    if (localStorage.getItem('Prev_TenantGuid') == null) {
      localStorage.setItem('Prev_TenantGuid', null);
    }
    else {
      localStorage.removeItem("Prev_TenantGuid");
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

    let view_url: string = "";
    if (localStorage.getItem("g_USER_GUID") != "sva") {
      view_url = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_bank_details' + '?filter=(TENANT_GUID=' + localStorage.getItem("g_TENANT_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    else {
      view_url = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_bank_details' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
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
        let val = this.CheckDuplicate();
        val.then((res) => {
          if (res.toString() == "0") {
            //---Insert or Update-----------
            if (this.Add_Form == true) {
              //**************Save service if it is new details***************************              
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
            alert("The Bank is already exist.");
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
    if (this.Add_Form == true) {
      this.bank_entry.BANK_GUID = UUID.UUID();
      this.bank_entry.CREATION_TS = new Date().toISOString();
      if (localStorage.getItem("g_USER_GUID") != "sva") {
        this.bank_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
      }
      else {
        this.bank_entry.CREATION_USER_GUID = 'sva';
      }
      this.bank_entry.UPDATE_TS = new Date().toISOString();
      this.bank_entry.UPDATE_USER_GUID = "";
    }
  }

  SetEntityForUpdate() {
    this.bank_entry.BANK_GUID = this.bank_details.BANK_GUID;
    this.bank_entry.CREATION_TS = this.bank_details.CREATION_TS;
    this.bank_entry.CREATION_USER_GUID = this.bank_details.CREATION_USER_GUID;
    this.bank_entry.UPDATE_TS = new Date().toISOString();
    if (localStorage.getItem("g_USER_GUID") != "sva") {
      this.bank_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");
    }
    else {
      this.bank_entry.UPDATE_USER_GUID = 'sva';
    }
  }

  SetCommonEntityForAddUpdate() {
    this.bank_entry.NAME = this.titlecasePipe.transform(this.NAME_ngModel_Add.trim());
    if (localStorage.getItem("g_USER_GUID") != "sva") {
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

  CheckDuplicate() {
    let url: string = "";
    if (localStorage.getItem("g_USER_GUID") != "sva") {
      url = this.baseResource_Url + "main_bank?filter=NAME=" + this.NAME_ngModel_Add.trim() + ' AND TENANT_GUID=' + this.Tenant_Add_ngModel + '&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    else {
      url = this.baseResource_Url + "main_bank?filter=NAME=" + this.NAME_ngModel_Add.trim() + ' AND TENANT_GUID=' + this.Tenant_Add_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
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
    this.NAME_ngModel_Add = "";
    this.Tenant_Add_ngModel = "";
  }

  ExportToExcel(evt: any) {
    this.excelService.exportAsExcelFile(this.banks,'Data');
  }
  
  emailUrl: string = 'http://api.zen.com.my/api/v2/zenmail?api_key=' + constants.DREAMFACTORY_API_KEY;
  EmailTest(evt: any){
    var queryHeaders = new Headers();
    queryHeaders.append('Content-Type', 'application/json');
    queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
    let options = new RequestOptions({ headers: queryHeaders });

    let body = {
      "template": "",
      "template_id": 0,
      "to": [
        {
          "name": name,
          "email": "tarmimi@zen.com.my"
        }
      ],
      "cc": [
        {
          "name": name,
          "email": "stephen@zen.com.my"
        }
      ],
      "bcc": [
        {
          "name": name,
          "email": "bijay@zen.com.my"
        }
      ],
      "subject": "Test mail.",
      "body_text": "",
      "body_html": '<html>' +
      '<head>' +
          '<meta name="GENERATOR" content="MSHTML 10.00.9200.17606">'+
      '</head>'+
      '<body>'+
          '<div style="FONT-FAMILY: Century Gothic">'+
              '<div style="MIN-WIDTH: 500px">'+
                  '<br>'+
                  '<div style="PADDING-BOTTOM: 10px; text-align: left; PADDING-TOP: 10px; PADDING-LEFT: 10px; PADDING-RIGHT: 10px"><IMG style="WIDTH: 130px" alt=zen2.png src="http://api.zen.com.my/api/v2/azurefs/azurefs/2018-09-17T13:33:42.429Zzen2.png?api_key=' + constants.DREAMFACTORY_API_KEY+'"></div>'+
                  '<div style="MARGIN: 0 30px;">'+
                      '<div style="FONT-SIZE: 24px; COLOR: black; PADDING-BOTTOM: 10px; TEXT-ALIGN: left; PADDING-TOP: 10px; PADDING-RIGHT: 20px"><b>Test mail</b></div>'+
                  '</div>'+
                  '<div style="FONT-SIZE: 12px; TEXT-ALIGN: left; padding: 11px 30px">'+
                      '<hr>'+
                      '<div style="FONT-SIZE: 16px; TEXT-ALIGN: left;"><b>Mail Details :</b></div>'+
                      '<br />'+
                      '<table style="FONT-SIZE: 12px; FONT-FAMILY: Century Gothic; MARGIN: 0px auto;">'+
                          '<tbody>'+
                              '<tr>'+
                                  '<td style="TEXT-ALIGN: left">Employee</td>'+
                                  '<td>:</td>'+
                                  '<td colspan="2">&nbsp;</td>'+
                              '</tr>'+
                              '<tr>'+
                                  '<td style="TEXT-ALIGN: left">Applied Date</td>'+
                                  '<td>:</td>'+
                                  '<td style="TEXT-ALIGN: left" colspan="2">&nbsp;</td>'+
                              '</tr>'+
                              '<tr>'+
                                  '<td style="TEXT-ALIGN: left">Claim Date </td>'+
                                  '<td>:</td>'+
                                  '<td style="TEXT-ALIGN: left" colspan="2">&nbsp;</td>'+
                              '</tr>'+
                              '<tr>'+
                                  '<td style="TEXT-ALIGN: left">Claim Type</td>'+
                                  '<td>: </td>'+
                                  '<td style="TEXT-ALIGN: left" colspan="2">&nbsp;</td>'+
                              '</tr>'+
                              '<tr>'+
                                  '<td style="TEXT-ALIGN: left">Project / Customer / SOC</td>'+
                                  '<td>:</td>'+
                                  '<td style="TEXT-ALIGN: left" colspan="2">&nbsp;</td>'+
                              '</tr>'+
                              '<tr>'+
                                  '<td style="TEXT-ALIGN: left">Claim Amount</td>'+
                                  '<td>: </td>'+
                                  '<td style="TEXT-ALIGN: left" colspan="2">&nbsp;</td>'+
                              '</tr>'+
                              '<tr>'+
                                  '<td style="TEXT-ALIGN: left">Description</td>'+
                                  '<td>: </td>'+
                                  '<td style="TEXT-ALIGN: left" colspan="2">&nbsp;</td>'+
                              '</tr>'+
                              '<tr>'+
                                  '<td style="TEXT-ALIGN: left"></td>'+
                                  '<td></td>'+
                                  '<td style="TEXT-ALIGN: left" colspan="2"><a href="http://autobuild.zeontech.com.my/eclaim/#/ClaimapprovertasklistPage" style="background: #0492C2; padding: 10px; color: white; text-decoration: none; border-radius: 5px; display: inline-block;">Open eClaim</a></td>'+
                              '</tr>'+
                          '</tbody>'+
                      '</table>'+
                      '<hr>'+
                      '<div style="TEXT-ALIGN: left; PADDING-TOP: 20px">Thank you.</div>'+
                  '</div>'+
              '</div>'+
          '</div>'+
      '</body>'+
      '</html>',
      "from_name": "eClaim",
      "from_email": "balasingh73@gmail.com",
      "reply_to_name": "",
      "reply_to_email": ""
    };

    this.http.post(this.emailUrl, body, options)
      .map(res => res.json())
      .subscribe(data => {
        alert('Mail sent sucessfully.'); 
      });
  }
}