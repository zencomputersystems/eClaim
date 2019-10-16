import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { TitleCasePipe } from '@angular/common';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { SocMain_Model } from '../../models/socmain_model';
import { SocProject_Model } from '../../models/soc_project_model';
import { SocCustomer_Model } from '../../models/soc_customer_model';
import { SocCustomerLocation_Model } from '../../models/soc_customer_location_model';
import { SocMain_Service } from '../../services/socmain_service';

import { Tenant_Main_Model } from '../../models/tenant_main_model';
import { View_SOC_Model } from '../../models/view_soc_model';

import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';
import { LoginPage } from '../login/login';


/**
 * Generated class for the SocRegistrationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-soc-registration',
  templateUrl: 'soc-registration.html', providers: [SocMain_Service, BaseHttpService, TitleCasePipe]
})
export class SocRegistrationPage {
  soc_entry: SocMain_Model = new SocMain_Model();
  project_entry: SocProject_Model = new SocProject_Model();
  customer_entry: SocCustomer_Model = new SocCustomer_Model();
  customer_location_entry: SocCustomerLocation_Model = new SocCustomerLocation_Model();
  tenant_entry: Tenant_Main_Model = new Tenant_Main_Model();
  view_entry: View_SOC_Model = new View_SOC_Model();
  Socform: FormGroup;
  public page: number = 1;
  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/soc_main' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  public socs: View_SOC_Model[] = [];
  public soc_main: SocMain_Model[] = [];
  public soc_project: SocProject_Model[] = [];
  public soc_customer: SocCustomer_Model[] = [];

  public soc_details_main: any;
  public soc_details_project: any;
  public soc_details_customer: any;

  public AddSocClicked: boolean = false;
  public EditSocClicked: boolean = false;
  public Exist_Record: boolean = false;

  // public subscription_details: any; 
  public exist_record_details: any;

  public SOC_NO_ngModel_Add: any;
  public PROJECT_NAME_ngModel_Add: any;
  public CUSTOMER_NAME_ngModel_Add: any;

  public LOCATION_NAME_ngModel_Add: any;
  public REGISTRATION_NO_ngModel_Add: any;
  public ADDRESS1_ngModel_Add: any;
  public ADDRESS2_ngModel_Add: any;
  public ADDRESS3_ngModel_Add: any;
  public CONTACT_PERSON_ngModel_Add: any;
  public CONTACT_PERSON_MOBILE_NO_ngModel_Add: any;
  public CONTACT_NO1_ngModel_Add: any;
  public CONTACT_NO2_ngModel_Add: any;
  public EMAIL_ngModel_Add: any;
  public DIVISION_ngModel_Add: any;

  Tenant_Add_ngModel: any;
  AdminLogin: boolean = false; Add_Form: boolean = false; Edit_Form: boolean = false;
  tenants: any;
  Key_Param: string = 'api_key=' + constants.DREAMFACTORY_API_KEY;

  public AddSocClick() {
    if (this.Edit_Form == false) {
      this.AddSocClicked = true; this.Add_Form = true; this.Edit_Form = false;
      this.ClearControls();
    }
    else {
      alert('Sorry. You are in Edit Mode.');
    }
  }

  public CloseSocClick() {
    if (this.AddSocClicked == true) {
      this.AddSocClicked = false;
      this.Add_Form = true; this.Edit_Form = false;
    }
  }

  public EditClick(id: any) {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();
    this.ClearControls();
    this.AddSocClicked = true; this.Add_Form = false; this.Edit_Form = true;

    var self = this;
    let SocEditUrl = this.baseResource_Url + "view_soc_edit?filter=(SOC_GUID=" + id + ')&api_key=' + constants.DREAMFACTORY_API_KEY;

    this.http.get(SocEditUrl)
      .map(res => res.json())
      .subscribe(
        data => {
          this.soc_details_main = data["resource"];

          this.Tenant_Add_ngModel = self.soc_details_main[0]["TENANT_GUID"]; localStorage.setItem('PREV_TENANT_GUID', self.soc_details_main[0]["TENANT_GUID"]);
          this.SOC_NO_ngModel_Add = self.soc_details_main[0]["SOC_NO"]; localStorage.setItem('PREV_SOC_NO', self.soc_details_main[0]["SOC_NO"]);
          this.PROJECT_NAME_ngModel_Add = self.soc_details_main[0]["PROJECT_NAME"]; localStorage.setItem('PREV_PROJECT_NAME', self.soc_details_main[0]["PROJECT_NAME"]);
          this.CUSTOMER_NAME_ngModel_Add = self.soc_details_main[0]["CUSTOMER_NAME"]; localStorage.setItem('PREV_CUSTOMER_NAME', self.soc_details_main[0]["CUSTOMER_NAME"]);
          this.Customer_GUID = this.soc_details_main[0]["CUSTOMER_GUID"];

          // this.LOCATION_NAME_ngModel_Add = self.soc_details_main[0]["CUSTOMER_LOCATION_NAME"];
          // this.REGISTRATION_NO_ngModel_Add = self.soc_details_main[0]["REGISTRATION_NO"];
          // this.ADDRESS1_ngModel_Add = self.soc_details_main[0]["ADDRESS1"];
          // this.ADDRESS2_ngModel_Add = self.soc_details_main[0]["ADDRESS2"];
          // this.ADDRESS3_ngModel_Add = self.soc_details_main[0]["ADDRESS3"];
          // this.CONTACT_PERSON_ngModel_Add = self.soc_details_main[0]["CONTACT_PERSON"];
          // this.CONTACT_PERSON_MOBILE_NO_ngModel_Add = self.soc_details_main[0]["CONTACT_PERSON_MOBILE_NO"];
          // this.CONTACT_NO1_ngModel_Add = self.soc_details_main[0]["CONTACT_NO1"];
          // this.CONTACT_NO2_ngModel_Add = self.soc_details_main[0]["CONTACT_NO2"];
          // this.EMAIL_ngModel_Add = self.soc_details_main[0]["EMAIL"];
          // this.DIVISION_ngModel_Add = self.soc_details_main[0]["DIVISION"];

          this.loading.dismissAll();
        });
  }

  public DeleteClick(SOC_GUID: any) {
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

            //before delete get id of main_project table, according to that id delete the record
            let SocEditUrl = this.baseResource_Url + "view_soc_edit?filter=(SOC_GUID=" + SOC_GUID + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
            this.http.get(SocEditUrl)
              .map(res => res.json())
              .subscribe(
                data => {
                  this.soc_details_main = data["resource"];

                  //Remove from main_customer-----------------------
                  // this.socservice.remove_customer(self.soc_details_main[0]["CUSTOMER_GUID"])
                  //   .subscribe(() => {
                  //     self.socs = self.socs.filter((item) => {
                  //       return item.SOC_GUID != SOC_GUID;
                  //     });
                  //   });

                  //Remove from main_customer_location------------------------
                  // this.socservice.remove_customer_location(self.soc_details_main[0]["CUSTOMER_LOCATION_GUID"])
                  //   .subscribe(() => {
                  //     self.socs = self.socs.filter((item) => {
                  //       return item.SOC_GUID != SOC_GUID;
                  //     });
                  //   });

                  //Remove from main_project------------------------
                  this.socservice.remove_project(self.soc_details_main[0]["PROJECT_GUID"])
                    .subscribe(() => {
                      self.socs = self.socs.filter((item) => {
                        return item.SOC_GUID != SOC_GUID;
                      });
                    });

                  //Remove from soc_main----------------------------
                  this.socservice.remove_soc(SOC_GUID)
                    .subscribe(() => {
                      self.socs = self.socs.filter((item) => {
                        return item.SOC_GUID != SOC_GUID
                      });
                    });
                });
          }
        }
      ]
    }); alert.present();
  }

  CustomerLookupClicked: boolean = false;
  public CustomerLookup() {
    this.CustomerLookupClicked = true;
  }

  public CloseCustomerLookup() {
    if (this.CustomerLookupClicked == true) {
      this.CustomerLookupClicked = false;
    }
  }

  loading: Loading; button_Add_Disable: boolean = false; button_Edit_Disable: boolean = false; button_Delete_Disable: boolean = false; button_View_Disable: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private socservice: SocMain_Service, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private titlecasePipe: TitleCasePipe) {
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

        this.LoadCustomers();

        //-------------------------------------------------------
        if (localStorage.getItem("g_USER_GUID") != "sva") {
          this.Socform = fb.group({
            soc: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\'\"\|\\s]+$'), Validators.required])],
            project_name: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\'\"\|\\s]+$'), Validators.required])],
            customer_name: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\'\"\|\\s]+$'), Validators.required])],
            // location_name: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
            // registration_no: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
            // address1: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
            // address2: [null],
            // address3: [null],
            // contact_person: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
            // contact_person_mobile_no: [null, Validators.compose([Validators.pattern('^[0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
            // contact_no1: [null, Validators.compose([Validators.pattern('^[0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
            // contact_no2: [null],
            // email: [null, Validators.compose([Validators.pattern('[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}'), Validators.required])],            
            // division: [null],
          });
        }
        else {
          this.Socform = fb.group({
            soc: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\'\"\|\\s]+$'), Validators.required])],
            project_name: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\'\"\|\\s]+$'), Validators.required])],
            customer_name: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\'\"\|\\s]+$'), Validators.required])],
            location_name: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\'\"\|\\s]+$')])],
            // registration_no: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
            // address1: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
            // address2: [null],
            // address3: [null],
            // contact_person: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
            // contact_person_mobile_no: [null, Validators.compose([Validators.pattern('^[0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
            // contact_no1: [null, Validators.compose([Validators.pattern('^[0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
            // contact_no2: [null],
            // email: [null, Validators.compose([Validators.pattern('[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}'), Validators.required])],
            // division: [null],
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad SocRegistrationPage');
  }

  customers: any[];
  storeCustomers: any[];

  LoadCustomers() {
    let CustomerUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_customer' + '?filter=(TENANT_GUID=' + localStorage.getItem('g_TENANT_GUID') + ')AND(ACTIVE_FLAG=A)&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http
      .get(CustomerUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.storeCustomers = this.customers = data["resource"];

        //this.loading.dismissAll();
      });
  }

  searchCustomer(searchString: any) {
    let val = searchString.target.value;
    if (!val || !val.trim()) {
      this.customers = this.storeCustomers;
      return;
    }
    this.customers = this.filterCustomer({
      NAME: val
    });
  }

  filterCustomer(params?: any) {
    if (!params) {
      return this.storeCustomers;
    }

    return this.customers.filter((item) => {
      for (let key in params) {
        let field = item[key];
        if (typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
          return item;
        } else if (field == params[key]) {
          return item;
        }
      }
      return null;
    });
  }

  Customer_GUID: any;
  GetCustomer(guid: any, name: any) {
    this.CUSTOMER_NAME_ngModel_Add = name;
    this.Customer_GUID = guid;
    this.CloseCustomerLookup();
  }

  ClearLocalStorage() {
    if (localStorage.getItem('PREV_TENANT_GUID') == null) {
      localStorage.setItem('PREV_TENANT_GUID', null);
    }
    else {
      localStorage.removeItem("PREV_TENANT_GUID");
    }

    if (localStorage.getItem('PREV_SOC_NO') == null) {
      localStorage.setItem('PREV_SOC_NO', null);
    }
    else {
      localStorage.removeItem("PREV_SOC_NO");
    }

    if (localStorage.getItem('PREV_PROJECT_NAME') == null) {
      localStorage.setItem('PREV_PROJECT_NAME', null);
    }
    else {
      localStorage.removeItem("PREV_PROJECT_NAME");
    }

    if (localStorage.getItem('PREV_CUSTOMER_NAME') == null) {
      localStorage.setItem('PREV_CUSTOMER_NAME', null);
    }
    else {
      localStorage.removeItem("PREV_CUSTOMER_NAME");
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

  stores: any[];
  search(searchString: any) {
    let val = searchString.target.value;
    if (!val || !val.trim()) {
      this.socs = this.stores;
      return;
    }
    this.socs = this.filter({
      soc: val,
      project_name: val,
      customer_name: val
    });
  }

  filter(params?: any) {
    if (!params) {
      return this.stores;
    }

    return this.stores.filter((item) => {
      for (let key in params) {
        let field = item[key];
        if (typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
          return item;
        } else if (field == params[key]) {
          return item;
        }
      }
      return null;
    });
  }

  DisplayGrid() {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();

    if (localStorage.getItem("g_USER_GUID") == "sva") {
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_soc_details' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
      this.AdminLogin = true;
    }
    else {
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_soc_details' + '?filter=(TENANT_GUID=' + localStorage.getItem('g_TENANT_GUID') + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      this.AdminLogin = false;
    }

    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.socs = this.stores = data.resource;

        this.loading.dismissAll();
      });
  }

  Save() {
    //Save Customer----------------    
    //this.SaveCustomer();

    if (this.Customer_GUID != "") {
      this.SaveProject();
    }
    else {
      alert("Sorry.Please enter valid customer.");
    }
  }

  // SaveCustomer() {
  //   //for Save Set Entities-------------------------------------------------------------    
  //   if (this.Add_Form == true) {
  //     this.SetEntityForCustomerAdd();
  //   }
  //   //for Update Set Entities------------------------------------------------------------
  //   else {
  //     this.SetEntityForCustomerUpdate();
  //   }
  //   //Common Entities-------------------------------------------------------------------
  //   this.SetCommonEntityForCustomerAddUpdate();

  //   //Loader-------------------------------
  //   this.loading = this.loadingCtrl.create({
  //     content: 'Please Wait...',
  //   });
  //   this.loading.present();
  //   //-------------------------------------

  //   if (this.Tenant_Add_ngModel != localStorage.getItem('PREV_TENANT_GUID') || this.SOC_NO_ngModel_Add.trim().toUpperCase() != localStorage.getItem('PREV_SOC_NO').toUpperCase() || this.PROJECT_NAME_ngModel_Add.trim().toUpperCase() != localStorage.getItem('PREV_PROJECT_NAME').toUpperCase() || this.CUSTOMER_NAME_ngModel_Add.trim().toUpperCase() != localStorage.getItem('PREV_CUSTOMER_NAME').toUpperCase()) {
  //     let val = this.CheckDuplicate();
  //     val.then((res) => {
  //       if (res.toString() == "0") {
  //         //**************Save service if it is new details***************************
  //         if (this.Add_Form == true) {
  //           this.InsertCustomer();
  //         }
  //         //**************Update service if it is new details*************************
  //         else {
  //           this.UpdateCustomer();
  //         }
  //       }
  //       else {
  //         alert("The SOC is already Exist.");
  //         this.loading.dismissAll();
  //       }
  //     });
  //     val.catch((err) => {
  //       console.log(err);
  //     });
  //   }
  //   else {
  //     //Simple update----------------------------------------------------------
  //     this.UpdateCustomer();
  //   }
  // }

  // SetEntityForCustomerAdd() {
  //   //this.customer_entry.CUSTOMER_GUID = UUID.UUID();
  //   this.customer_entry.CUSTOMER_GUID = UUID.UUID();
  //   this.customer_entry.CREATION_TS = new Date().toISOString();
  //   this.customer_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
  //   this.customer_entry.UPDATE_TS = new Date().toISOString();
  //   this.customer_entry.UPDATE_USER_GUID = "";
  // }

  // SetEntityForCustomerUpdate() {
  //   this.customer_entry.CUSTOMER_GUID = this.soc_details_main[0]["CUSTOMER_GUID"];
  //   this.customer_entry.CREATION_TS = this.soc_details_main[0]["CREATION_TS"];
  //   this.customer_entry.CREATION_USER_GUID = this.soc_details_main[0]["CREATION_USER_GUID"];
  //   this.customer_entry.UPDATE_TS = new Date().toISOString();
  //   this.customer_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");
  // }

  // SetCommonEntityForCustomerAddUpdate() {
  //   if (localStorage.getItem("g_USER_GUID") == "sva") {
  //     this.customer_entry.TENANT_GUID = this.Tenant_Add_ngModel.trim();
  //   }
  //   else {
  //     this.customer_entry.TENANT_GUID = localStorage.getItem("g_TENANT_GUID");
  //   }
  //   this.customer_entry.NAME = this.titlecasePipe.transform(this.CUSTOMER_NAME_ngModel_Add.trim());
  // }

  // InsertCustomer() {
  //   this.socservice.save_customer(this.customer_entry)
  //     .subscribe((response) => {
  //       if (response.status == 200) {
  //         this.SaveCustomerLocation();
  //         //this.SaveProject();
  //       }
  //     });
  // }

  // UpdateCustomer() {
  //   this.socservice.update_customer(this.customer_entry)
  //     .subscribe((response) => {
  //       if (response.status == 200) {
  //         this.SaveProject();
  //       }
  //     });
  // }

  // SaveCustomerLocation() {
  //   //for Save Set Entities-------------------------------------------------------------
  //   if (this.Add_Form == true) {
  //     this.SetEntityForCustomerLocationAdd();
  //   }
  //   //for Update Set Entities------------------------------------------------------------
  //   else {
  //     this.SetEntityForCustomerLocationUpdate();
  //   }
  //   //Common Entities-------------------------------------------------------------------
  //   this.SetCommonEntityForCustomerLocationAddUpdate();

  //   //**************Save service if it is new details***************************
  //   if (this.Add_Form == true) {
  //     this.InsertCustomerLocation();
  //   }
  //   //**************Update service if it is new details*************************
  //   else {
  //     this.UpdateCustomerLocation();
  //   }
  // }

  // SetEntityForCustomerLocationAdd() {
  //   this.customer_location_entry.CUSTOMER_LOCATION_GUID = UUID.UUID();
  // }

  // SetEntityForCustomerLocationUpdate() {
  //   this.customer_location_entry.CUSTOMER_LOCATION_GUID = this.soc_details_main[0]["CUSTOMER_LOCATION_GUID"];
  // }

  // SetCommonEntityForCustomerLocationAddUpdate() {
  //   this.customer_location_entry.CUSTOMER_GUID = this.customer_entry.CUSTOMER_GUID;
  //   this.customer_location_entry.NAME = this.titlecasePipe.transform(this.LOCATION_NAME_ngModel_Add.trim());
  //   this.customer_location_entry.DESCRIPTION = "NA";
  //   this.customer_location_entry.REGISTRATION_NO = this.REGISTRATION_NO_ngModel_Add.trim();
  //   this.customer_location_entry.ADDRESS1 = this.titlecasePipe.transform(this.ADDRESS1_ngModel_Add.trim());
  //   this.customer_location_entry.ADDRESS2 = this.titlecasePipe.transform(this.ADDRESS2_ngModel_Add.trim());
  //   this.customer_location_entry.ADDRESS3 = this.titlecasePipe.transform(this.ADDRESS3_ngModel_Add.trim());
  //   this.customer_location_entry.CONTACT_PERSON = this.titlecasePipe.transform(this.CONTACT_PERSON_ngModel_Add.trim());
  //   this.customer_location_entry.CONTACT_PERSON_MOBILE_NO = this.CONTACT_PERSON_MOBILE_NO_ngModel_Add.trim();
  //   this.customer_location_entry.CONTACT_NO1 = this.CONTACT_NO1_ngModel_Add.trim();
  //   this.customer_location_entry.CONTACT_NO2 = this.CONTACT_NO2_ngModel_Add.trim();
  //   this.customer_location_entry.EMAIL = this.EMAIL_ngModel_Add.trim().toLowerCase();
  //   this.customer_location_entry.DIVISION = this.titlecasePipe.transform(this.DIVISION_ngModel_Add.trim());

  //   this.customer_location_entry.CREATION_TS = this.customer_entry.CREATION_TS;
  //   this.customer_location_entry.CREATION_USER_GUID = this.customer_entry.CREATION_USER_GUID;
  //   this.customer_location_entry.UPDATE_TS = this.customer_entry.UPDATE_TS;
  //   this.customer_location_entry.UPDATE_USER_GUID = this.customer_entry.UPDATE_USER_GUID
  // }

  // InsertCustomerLocation() {
  //   this.socservice.save_customer_location(this.customer_location_entry)
  //     .subscribe((response) => {
  //       if (response.status == 200) {

  //         this.SaveProject();
  //       }
  //     });
  // }

  // UpdateCustomerLocation() {
  //   this.socservice.update_customer_location(this.customer_location_entry)
  //     .subscribe((response) => {
  //       if (response.status == 200) {

  //         this.SaveProject();
  //       }
  //     });
  // }

  SaveProject() {
    //for Save Set Entities-------------------------------------------------------------
    if (this.Add_Form == true) {
      this.SetEntityForProjectAdd();
    }
    //for Update Set Entities------------------------------------------------------------
    else {
      this.SetEntityForProjectUpdate();
    }
    //Common Entities-------------------------------------------------------------------
    this.SetCommonEntityForProjectAddUpdate();

    //Loader-------------------------------
    this.loading = this.loadingCtrl.create({
      content: 'Please Wait...',
    });
    this.loading.present();
    //-------------------------------------

    let strPREV_SOC_NO: string = "";
    if (localStorage.getItem('PREV_SOC_NO') != null) { strPREV_SOC_NO = localStorage.getItem('PREV_SOC_NO').toUpperCase(); }

    let strPREV_PROJECT_NAME: string = "";
    if (localStorage.getItem('PREV_PROJECT_NAME') != null) { strPREV_PROJECT_NAME = localStorage.getItem('PREV_PROJECT_NAME').toUpperCase(); }

    let strPREV_CUSTOMER_NAME: string = "";
    if (localStorage.getItem('PREV_CUSTOMER_NAME') != null) { strPREV_CUSTOMER_NAME = localStorage.getItem('PREV_CUSTOMER_NAME').toUpperCase(); }

    if (this.Tenant_Add_ngModel != localStorage.getItem('PREV_TENANT_GUID') || this.SOC_NO_ngModel_Add.trim().toUpperCase() != strPREV_SOC_NO || this.PROJECT_NAME_ngModel_Add.trim().toUpperCase() != strPREV_PROJECT_NAME || this.CUSTOMER_NAME_ngModel_Add.trim().toUpperCase() != strPREV_CUSTOMER_NAME) {
      let val = this.CheckDuplicate();
      val.then((res) => {
        if (res.toString() == "0") {
          //**************Save service if it is new details***************************
          if (this.Add_Form == true) {
            this.InsertProject();
          }
          //**************Update service if it is new details*************************
          else {
            this.UpdateProject();
          }
        }
        else {
          alert("The SOC is already Exist.");
          this.loading.dismissAll();
        }
      });
      val.catch((err) => {
        console.log(err);
      });
    }
    else {
      //Simple update----------------------------------------------------------
      this.UpdateProject();
    }
  }

  SetEntityForProjectAdd() {
    this.project_entry.PROJECT_GUID = UUID.UUID();

    this.project_entry.CREATION_TS = new Date().toISOString();
    this.project_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
    this.project_entry.UPDATE_TS = new Date().toISOString();
    this.project_entry.UPDATE_USER_GUID = "";
    this.project_entry.ACTIVATION_FLAG = "1";
  }

  SetEntityForProjectUpdate() {
    this.project_entry.PROJECT_GUID = this.soc_details_main[0]["PROJECT_GUID"];

    this.project_entry.CREATION_TS = this.soc_details_main[0]["CREATION_TS"];
    this.project_entry.CREATION_USER_GUID = this.soc_details_main[0]["CREATION_USER_GUID"];
    this.project_entry.UPDATE_TS = new Date().toISOString();
    this.project_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");
    this.project_entry.ACTIVATION_FLAG = this.soc_details_main[0]["ACTIVATION_FLAG"];
  }

  SetCommonEntityForProjectAddUpdate() {
    this.project_entry.NAME = this.titlecasePipe.transform(this.PROJECT_NAME_ngModel_Add.trim());
    //this.project_entry.CUSTOMER_GUID = this.customer_entry.CUSTOMER_GUID;
    this.project_entry.CUSTOMER_GUID = this.Customer_GUID;
    this.project_entry.CUSTOMER_LOCATION_GUID = "NA";

    if (localStorage.getItem("g_USER_GUID") == "sva") {
      this.project_entry.TENANT_GUID = this.Tenant_Add_ngModel.trim();
    }
    else {
      this.project_entry.TENANT_GUID = localStorage.getItem("g_TENANT_GUID");
    }

    //this.project_entry.TENANT_GUID = this.customer_entry.TENANT_GUID;
    // this.project_entry.ACTIVATION_FLAG = "1";
    // this.project_entry.CREATION_TS = new Date().toISOString();
    // this.project_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
    // this.project_entry.UPDATE_TS = new Date().toISOString();
    // this.project_entry.UPDATE_USER_GUID = "";
  }

  InsertProject() {
    this.socservice.save_project(this.project_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          this.SaveSOC();
        }
      });
  }

  UpdateProject() {
    this.socservice.update_project(this.project_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          //alert('Project Updated successfully');
          this.SaveSOC();
        }
      });
  }

  SaveSOC() {
    //for Save Set Entities-------------------------------------------------------------
    if (this.Add_Form == true) {
      this.SetEntityForSOCAdd();
    }
    //for Update Set Entities------------------------------------------------------------
    else {
      this.SetEntityForSOCUpdate();
    }
    //Common Entities-------------------------------------------------------------------
    this.SetCommonEntityForSOCAddUpdate();

    //**************Save service if it is new details***************************
    if (this.Add_Form == true) {
      this.InsertSOC();
    }
    //**************Update service if it is new details*************************
    else {
      this.UpdateSOC();
    }
  }

  SetEntityForSOCAdd() {
    this.soc_entry.SOC_GUID = UUID.UUID();
  }

  SetEntityForSOCUpdate() {
    this.soc_entry.SOC_GUID = this.soc_details_main[0]["SOC_GUID"];
  }

  SetCommonEntityForSOCAddUpdate() {
    this.soc_entry.SOC_NO = this.SOC_NO_ngModel_Add.trim();
    this.soc_entry.PROJECT_GUID = this.project_entry.PROJECT_GUID;
    this.soc_entry.TENANT_GUID = this.project_entry.TENANT_GUID;
    this.soc_entry.CREATION_TS = this.project_entry.CREATION_TS;
    this.soc_entry.CREATION_USER_GUID = this.project_entry.CREATION_USER_GUID;
    this.soc_entry.UPDATE_TS = this.project_entry.UPDATE_TS;
    this.soc_entry.UPDATE_USER_GUID = this.project_entry.UPDATE_USER_GUID;
  }

  InsertSOC() {
    this.socservice.save_main(this.soc_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          alert('SOC Registered successfully');

          //Remove all storage values-----------------------------------------
          this.RemoveStorageSOCValues();
          //------------------------------------------------------------------

          this.navCtrl.setRoot(this.navCtrl.getActive().component);
        }
      });
  }

  UpdateSOC() {
    this.socservice.update_soc(this.soc_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          alert('SOC Updated successfully');
          //this.loading.dismissAll();

          //Remove all storage values-----------------------------------------            
          this.RemoveStorageSOCValues();
          //------------------------------------------------------------------

          this.navCtrl.setRoot(this.navCtrl.getActive().component);
        }
      });
  }

  RemoveStorageSOCValues() {
    localStorage.removeItem("PREV_TENANT_GUID");
    localStorage.removeItem("PREV_SOC_NO");
    localStorage.removeItem("PREV_PROJECT_NAME");
    localStorage.removeItem("PREV_CUSTOMER_NAME");
  }

  CheckDuplicate() {
    let url: string = "";
    if (localStorage.getItem("g_USER_GUID") != "sva") {
      // url = this.baseResource_Url + "view_soc_details?filter=TENANT_GUID=" + localStorage.getItem("g_TENANT_GUID") + ' AND soc=' + this.SOC_NO_ngModel_Add.trim() + ' AND project_name=' + this.PROJECT_NAME_ngModel_Add.trim() + ' AND customer_name=' + this.CUSTOMER_NAME_ngModel_Add.trim() + '&api_key=' + constants.DREAMFACTORY_API_KEY;
      url = this.baseResource_Url + "view_soc_details?filter=TENANT_GUID=" + localStorage.getItem("g_TENANT_GUID") + ' AND soc=' + this.SOC_NO_ngModel_Add.trim() + '&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    else {
      url = this.baseResource_Url + "view_soc_details?filter=TENANT_GUID=" + this.Tenant_Add_ngModel + ' AND soc=' + this.SOC_NO_ngModel_Add.trim() + ' AND project_name=' + this.PROJECT_NAME_ngModel_Add.trim() + ' AND customer_name=' + this.CUSTOMER_NAME_ngModel_Add.trim() + '&api_key=' + constants.DREAMFACTORY_API_KEY;
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

  isReadonly: boolean = false;
  Readonly() {
    return this.isReadonly = true;
  }

  ClearControls() {
    this.Tenant_Add_ngModel = "";
    this.SOC_NO_ngModel_Add = "";
    this.PROJECT_NAME_ngModel_Add = "";
    this.CUSTOMER_NAME_ngModel_Add = "";
    // this.LOCATION_NAME_ngModel_Add = "";
    // this.REGISTRATION_NO_ngModel_Add = "";
    // this.ADDRESS1_ngModel_Add = "";
    // this.ADDRESS2_ngModel_Add = "";
    // this.ADDRESS3_ngModel_Add = "";
    // this.CONTACT_PERSON_ngModel_Add = "";
    // this.CONTACT_PERSON_MOBILE_NO_ngModel_Add = "";
    // this.CONTACT_NO1_ngModel_Add = "";
    // this.CONTACT_NO2_ngModel_Add = "";
    // this.EMAIL_ngModel_Add = "";
    // this.DIVISION_ngModel_Add = "";

    this.Customer_GUID = "";
  }

  ProjectMainActivation(PROJECT_GUID: any, Activation_Flag: any) {
    //Here get all the customer details and update
    this.GetProjectDetails(PROJECT_GUID);

    let strTitle: string;
    if (Activation_Flag == true) {
      strTitle = "Do you want to deactivate ?";
    }
    else {
      strTitle = "Do you want to activate ?";
    }

    let alert = this.alertCtrl.create({
      title: 'Activation Confirmation',
      message: strTitle,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            // this.socs.ACTIVATION_FLAG = Activation_Flag;
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        },
        {
          text: 'OK',
          handler: () => {
            console.log('OK clicked');

            if (Activation_Flag == true) {
              this.project_entry.ACTIVATION_FLAG = "0";
            }
            else {
              this.project_entry.ACTIVATION_FLAG = "1";
            }

            this.socservice.update_project(this.project_entry)
              .subscribe((response) => {
                if (response.status == 200) {
                  this.navCtrl.setRoot(this.navCtrl.getActive().component);
                }
              });
          }
        }
      ]
    });
    alert.present();
  }

  GetProjectDetails(PROJECT_GUID: any) {
    let ProjectActivationUrl = this.baseResource_Url + "main_project?filter=(PROJECT_GUID=" + PROJECT_GUID + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http.get(ProjectActivationUrl)
      .map(res => res.json())
      .subscribe(
        data => {
          this.soc_details_main = data["resource"];
          this.SetEntityForProjectUpdate();
          this.project_entry.NAME = this.soc_details_main[0]["NAME"];
          this.project_entry.CUSTOMER_GUID = this.soc_details_main[0]["CUSTOMER_GUID"];
          this.project_entry.CUSTOMER_LOCATION_GUID = this.soc_details_main[0]["CUSTOMER_LOCATION_GUID"];
          this.project_entry.TENANT_GUID = localStorage.getItem("g_TENANT_GUID");
        });
  }
}