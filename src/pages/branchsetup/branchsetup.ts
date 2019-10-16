import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
// import { BranchSetup_Model } from '../../models/branchsetup_model';
// import { BranchSetup_Service } from '../../services/branchsetup_service';

import { TenantCompanySetup_Model } from '../../models/tenantcompanysetup_model';
import { TenantCompanySiteSetup_Model } from '../../models/tenantcompanysitesetup_model';
import { TenantCompanySetup_Service } from '../../services/tenantcompanysetup_service';
import { TenantCompanySiteSetup_Service } from '../../services/tenantcompanysitesetup_service';

import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';

import { LoginPage } from '../login/login';

/**
 * Generated class for the BranchsetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-branchsetup',
  templateUrl: 'branchsetup.html', providers: [TenantCompanySetup_Service, TenantCompanySiteSetup_Service, BaseHttpService]
})
export class BranchsetupPage {
  tenant_company_entry: TenantCompanySetup_Model = new TenantCompanySetup_Model();
  tenant_company_site_entry: TenantCompanySiteSetup_Model = new TenantCompanySiteSetup_Model();

  Branchform: FormGroup;

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_branch' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  //public branchs: BranchSetup_Model[] = [];
  public branchs: any; public hqDetails: any;
  //public branchs: TenantCompanySetup_Model[] = [];

  public AddBranchsClicked: boolean = false;
  public EditBranchsClicked: boolean = false;
  public Exist_Record: boolean = false;

  public AddBranchesClicked: boolean = false;
  public branch_details: any;
  public exist_record_details: any;

  //Set the Model Name for Add------------------------------------------
  public BRANCHNAME_ngModel_Add: any;
  public COMPANYNAME_ngModel_Add: any;
  public ISHQ_FLAG_ngModel_Add: any;
  //---------------------------------------------------------------------

  //Set the Model Name for edit------------------------------------------
  public NAME_ngModel_Edit: any;
  //---------------------------------------------------------------------

  public AddBranchsClick() {
    this.AddBranchsClicked = true;
    this.ClearControls();
    this.COMPANYNAME_ngModel_Add = this.branchs[0]["NAME"];
  }

  public CloseBranchsClick() {
    if (this.AddBranchsClicked == true) {
      this.AddBranchsClicked = false;
    }
    if (this.EditBranchsClicked == true) {
      this.EditBranchsClicked = false;
    }
  }

  public EditClick() {
    // this.ClearControls();
    // this.EditBranchsClicked = true;
    // var self = this;
    // this.branchsetupservice
    //   .get(BRANCH_GUID)
    //   .subscribe((data) => {
    //     self.branch_details = data;
    //     this.NAME_ngModel_Edit = self.branch_details.NAME; localStorage.setItem('Prev_br_Name', self.branch_details.NAME);
    //   });
  }

  public DeleteClick() {
    // let alert = this.alertCtrl.create({
    //   title: 'Remove Confirmation',
    //   message: 'Are you sure to remove?',
    //   buttons: [
    //     {
    //       text: 'Cancel',
    //       role: 'cancel',
    //       handler: () => {
    //         console.log('Cancel clicked');
    //       }
    //     },
    //     {
    //       text: 'OK',
    //       handler: () => {
    //         console.log('OK clicked');
    //         var self = this;
    //         this.branchsetupservice.remove(BRANCH_GUID)
    //           .subscribe(() => {
    //             self.branchs = self.branchs.filter((item) => {
    //               return item.BRANCH_GUID != BRANCH_GUID
    //             });
    //           });
    //       }
    //     }
    //   ]
    // }); alert.present();
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private TenantCompanySetupService: TenantCompanySetup_Service, private tenantcompanysitesetupservice: TenantCompanySiteSetup_Service) {
    if (localStorage.getItem("g_USER_GUID") != null) {
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + "/api/v2/zcs/_table/vw_tenantcompanysitedetails?filter=(TENANT_GUID=" + localStorage.getItem("g_TENANT_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      this.http
        .get(this.baseResourceUrl)
        .map(res => res.json())
        .subscribe(data => {
          this.branchs = data.resource;
        });

      this.Branchform = fb.group({
        COMPANYNAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        BRANCHNAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        ISHQ_FLAG: ["", Validators.required],
      });
    }
    else {
      this.navCtrl.push(LoginPage);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BranchsetupPage');
  }

  Save() {
    if (this.Branchform.valid) {
      // let headers = new Headers();
      // headers.append('Content-Type', 'application/json');
      // let options = new RequestOptions({ headers: headers });
      // let url: string;
      // url = this.baseResource_Url + "main_branch?filter=(NAME=" + this.BRANCHNAME_ngModel_Add.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      // this.http.get(url, options)
      //   .map(res => res.json())
      //   .subscribe(
      //   data => {
      //     let res = data["resource"];
      //     if (res.length == 0) {
      //       console.log("No records Found");
      //       if (this.Exist_Record == false) {
      //         this.branch_entry.NAME = this.BRANCHNAME_ngModel_Add.trim();

      //         this.branch_entry.BRANCH_GUID = UUID.UUID();
      //         this.branch_entry.CREATION_TS = new Date().toISOString();
      //         this.branch_entry.CREATION_USER_GUID = '1';
      //         this.branch_entry.UPDATE_TS = new Date().toISOString();
      //         this.branch_entry.UPDATE_USER_GUID = "";

      //         this.branchsetupservice.save(this.branch_entry)
      //           .subscribe((response) => {
      //             if (response.status == 200) {
      //               alert('Branch Registered successfully');
      //               //location.reload();
      //               this.navCtrl.setRoot(this.navCtrl.getActive().component);
      //             }
      //           })
      //       }
      //     }

      //     else {
      //       console.log("Records Found");
      //       alert("The Branch is already Exist.")
      //     }
      //   },
      //   err => {
      //     this.Exist_Record = false;
      //     console.log("ERROR!: ", err);
      //   });

      this.Save_Tenant_Company();
    }
  }

  Save_Tenant_Company() {
    //----------Check if the new tenant_company entered then take new guid else take the previous-------------
    this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + "/api/v2/zcs/_table/tenant_company?filter=(NAME=" + this.COMPANYNAME_ngModel_Add.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        //this.tenant_company = data.resource; 
        //console.log(data.resource[0]);
        if (data.resource[0] != undefined) {
          this.tenant_company_entry.TENANT_COMPANY_GUID = data.resource[0]["TENANT_COMPANY_GUID"];
          this.Save_Tenant_Company_Site();
        }
        else {
          this.tenant_company_entry.TENANT_COMPANY_GUID = UUID.UUID();
          this.tenant_company_entry.TENANT_GUID = localStorage.getItem("g_TENANT_GUID");
          this.tenant_company_entry.NAME = this.COMPANYNAME_ngModel_Add.trim();
          this.tenant_company_entry.REGISTRATION_NO = null;
          this.tenant_company_entry.ACTIVATION_FLAG = "1";

          this.tenant_company_entry.CREATION_TS = new Date().toISOString();
          this.tenant_company_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
          this.tenant_company_entry.UPDATE_TS = new Date().toISOString();
          this.tenant_company_entry.UPDATE_USER_GUID = "";

          this.TenantCompanySetupService.save(this.tenant_company_entry)
            .subscribe((response) => {
              if (response.status == 200) {
                this.Save_Tenant_Company_Site();
              }
            })
        }
      });
  }

  Save_Tenant_Company_Site() {
    this.tenant_company_site_entry.TENANT_COMPANY_SITE_GUID = UUID.UUID();
    this.tenant_company_site_entry.TENANT_COMPANY_GUID = this.tenant_company_entry.TENANT_COMPANY_GUID;
    this.tenant_company_site_entry.SITE_NAME = this.BRANCHNAME_ngModel_Add.trim();
    this.tenant_company_site_entry.ACTIVATION_FLAG = "1";
    this.tenant_company_site_entry.CREATION_TS = new Date().toISOString();
    this.tenant_company_site_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
    this.tenant_company_site_entry.UPDATE_TS = new Date().toISOString();
    this.tenant_company_site_entry.UPDATE_USER_GUID = "";
    if (this.ISHQ_FLAG_ngModel_Add == true) {
      this.tenant_company_site_entry.ISHQ = "1";
    }
    else {
      this.tenant_company_site_entry.ISHQ = "0";
    }

    this.tenantcompanysitesetupservice.save(this.tenant_company_site_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          //Check if previous tenant_company_site is hq active but current tenant_company_site is updating to hq active then previous tenant_company_site will inactive.      
          if (this.ISHQ_FLAG_ngModel_Add == true) {
            this.UpdateHQ();
          }
          else {
            alert('Company & Site registered successfully');
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        }
      })
  }

  UpdateHQ() {
    if (this.ISHQ_FLAG_ngModel_Add == true) {
      //-------------Get all the details of previous tenant_company_site------------------------------
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + "/api/v2/zcs/_table/tenant_company_site?filter=(TENANT_COMPANY_SITE_GUID=" + localStorage.getItem("g_TENANT_COMPANY_SITE_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      this.http
        .get(this.baseResourceUrl)
        .map(res => res.json())
        .subscribe(data => {
          this.hqDetails = data.resource;
        });
      //----------------------------------------------------------------------------------------------
      this.tenant_company_site_entry.TENANT_COMPANY_SITE_GUID = localStorage.getItem("g_TENANT_COMPANY_SITE_GUID");
      this.tenant_company_site_entry.TENANT_COMPANY_GUID = this.tenant_company_entry.TENANT_COMPANY_GUID;
      this.tenant_company_site_entry.SITE_NAME = this.BRANCHNAME_ngModel_Add.trim();
      this.tenant_company_site_entry.REGISTRATION_NUM = this.hqDetails[0]["REGISTRATION_NUM"];
      this.tenant_company_site_entry.ADDRESS = this.hqDetails[0]["ADDRESS"];
      this.tenant_company_site_entry.ADDRESS2 = this.hqDetails[0]["ADDRESS2"];
      this.tenant_company_site_entry.ADDRESS3 = this.hqDetails[0]["ADDRESS3"];
      this.tenant_company_site_entry.CONTACT_NO = this.hqDetails[0]["CONTACT_NO"];
      this.tenant_company_site_entry.EMAIL = this.hqDetails[0]["EMAIL"];
      this.tenant_company_site_entry.ACTIVATION_FLAG = this.hqDetails[0]["ACTIVATION_FLAG"];

      this.tenant_company_site_entry.CONTACT_PERSON = this.hqDetails[0]["CONTACT_PERSON"];
      this.tenant_company_site_entry.CONTACT_PERSON_CONTACT_NO = this.hqDetails[0]["CONTACT_PERSON_CONTACT_NO"];
      this.tenant_company_site_entry.CONTACT_PERSON_EMAIL = this.hqDetails[0]["CONTACT_PERSON_EMAIL"];
      this.tenant_company_site_entry.WEBSITE = this.hqDetails[0]["WEBSITE"];

      this.tenant_company_site_entry.CREATION_TS = this.hqDetails[0]["CREATION_TS"];
      this.tenant_company_site_entry.CREATION_USER_GUID = this.hqDetails[0]["CREATION_USER_GUID"];
      this.tenant_company_site_entry.UPDATE_TS = new Date().toISOString();
      this.tenant_company_site_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");

      this.tenantcompanysitesetupservice.update(this.tenant_company_site_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            alert('Company & Site Registered successfully');
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        })
    }
  }

  getBranchList() {
    // let self = this;
    // let params: URLSearchParams = new URLSearchParams();
    // self.branchsetupservice.get_branch(params)
    //   .subscribe((branchs: BranchSetup_Model[]) => {
    //     self.branchs = branchs;
    //   });
  }

  Update() {
    // if (this.Branchform.valid) {
    //   if (this.branch_entry.NAME = null) { this.branch_entry.NAME = this.NAME_ngModel_Edit.trim(); }

    //   this.branch_entry.CREATION_TS = this.branch_details.CREATION_TS;
    //   this.branch_entry.CREATION_USER_GUID = this.branch_details.CREATION_USER_GUID;
    //   this.branch_entry.BRANCH_GUID = BRANCH_GUID;
    //   this.branch_entry.UPDATE_TS = new Date().toISOString();
    //   this.branch_entry.UPDATE_USER_GUID = '1';

    //   if (this.NAME_ngModel_Edit.trim() != localStorage.getItem('Prev_br_Name')) {
    //     let url: string;
    //     url = this.baseResource_Url + "main_branch?filter=(NAME=" + this.NAME_ngModel_Edit.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    //     this.http.get(url)
    //       .map(res => res.json())
    //       .subscribe(
    //       data => {
    //         let res = data["resource"];
    //         console.log('Current Name : ' + this.NAME_ngModel_Edit + ', Previous Name : ' + localStorage.getItem('Prev_br_Name'));

    //         if (res.length == 0) {
    //           console.log("No records Found");
    //           this.branch_entry.NAME = this.NAME_ngModel_Edit.trim();

    //           //**************Update service if it is new details*************************
    //           this.branchsetupservice.update(this.branch_entry)
    //             .subscribe((response) => {
    //               if (response.status == 200) {
    //                 alert('Mileage updated successfully');
    //                 this.navCtrl.setRoot(this.navCtrl.getActive().component);
    //               }
    //             });
    //           //**************************************************************************
    //         }
    //         else {
    //           console.log("Records Found");
    //           alert("The Branch is already Exist. ");
    //         }
    //       },
    //       err => {
    //         this.Exist_Record = false;
    //         console.log("ERROR!: ", err);
    //       });
    //   }
    //   else {
    //     if (this.branch_entry.NAME == null) { this.branch_entry.NAME = localStorage.getItem('Prev_br_Name'); }
    //     this.branch_entry.NAME = this.NAME_ngModel_Edit.trim();

    //     //**************Update service if it is old details*************************

    //     this.branchsetupservice.update(this.branch_entry)
    //       .subscribe((response) => {
    //         if (response.status == 200) {
    //           alert('Branch updated successfully');
    //           //location.reload();
    //           this.navCtrl.setRoot(this.navCtrl.getActive().component);
    //         }
    //       });
    //   }
    // }
  }

  ClearControls() {
    this.BRANCHNAME_ngModel_Add = "";
    this.COMPANYNAME_ngModel_Add = "";

    this.NAME_ngModel_Edit = "";
  }
}
