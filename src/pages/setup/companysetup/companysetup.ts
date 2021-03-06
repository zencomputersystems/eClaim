import 'rxjs/add/operator/map';

import * as constants from '../../../app/config/constants';

import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Headers, Http, RequestOptions, URLSearchParams } from '@angular/http';

import { BaseHttpService } from '../../../services/base-http';
import { ClearControls } from '../../../services/controls_service';
import { CompanySetup_Model } from '../../../models/companysetup_model';
import { CompanySetup_Service } from '../../../services/companysetup_service';
import { Component } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { authCheck } from '../../../shared/authcheck';
import { sanitizeURL } from '../../../providers/sanitizer/sanitizer';

//import { FormBuilder, FormGroup } from '@angular/forms';




/**
 * Generated class for the CompanysetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-companysetup',
  templateUrl: 'companysetup.html', providers: [CompanySetup_Service, BaseHttpService]
})
export class CompanysetupPage extends authCheck {
  company_entry: CompanySetup_Model = new CompanySetup_Model();
  //company: CompanySetup_Model = new CompanySetup_Model();
  Companyform: FormGroup;

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_company' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  public companys: CompanySetup_Model[] = [];

  public AddCompanyClicked: boolean = false;
  public EditCompanyClicked: boolean = false;
  public Exist_Record: boolean = false;

  public company_details: any;
  public exist_record_details: any;

  //Set the Model Name for Add------------------------------------------
  public NAME_ngModel_Add: any;
  public REGISTRATION_NO_ngModel_Add: any;
  public ADDRESS_ngModel_Add: any;
  public FAX_ngModel_Add: any;
  public PHONE_ngModel_Add: any;
  public EMAIL_ngModel_Add: any;
  //---------------------------------------------------------------------

  //Set the Model Name for edit------------------------------------------
  public NAME_ngModel_Edit: any;
  public REGISTRATION_NO_ngModel_Edit: any;
  public ADDRESS_ngModel_Edit: any;
  public FAX_ngModel_Edit: any;
  public PHONE_ngModel_Edit: any;
  public EMAIL_ngModel_Edit: any;
  //---------------------------------------------------------------------

  public AddCompanyClick() {
    this.AddCompanyClicked = true;
    ClearControls(this);
  }

  public EditClick(COMPANY_GUID: any) {
    ClearControls(this);
    this.EditCompanyClicked = true;
    var self = this;
    this.companysetupservice
      .get(COMPANY_GUID)
      .subscribe((data) => {
        self.company_details = data;
        this.NAME_ngModel_Edit = self.company_details.NAME;
        this.REGISTRATION_NO_ngModel_Edit = self.company_details.REGISTRATION_NO; 
        localStorage.setItem('Prev_co_Reg', self.company_details.REGISTRATION_NO);
        this.ADDRESS_ngModel_Edit = self.company_details.ADDRESS;
        this.FAX_ngModel_Edit = self.company_details.FAX; localStorage.setItem('Prev_co_Fax', self.company_details.FAX);
        this.PHONE_ngModel_Edit = self.company_details.PHONE; 
        localStorage.setItem('Prev_co_Phone', self.company_details.PHONE);
        this.EMAIL_ngModel_Edit = self.company_details.EMAIL; 
        localStorage.setItem('Prev_co_Email', self.company_details.EMAIL);
      });
  }

  public DeleteClick(COMPANY_GUID: any) {
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
            this.companysetupservice.remove(COMPANY_GUID)
              .subscribe(() => {
                self.companys = self.companys.filter((item) => {
                  return item.COMPANY_GUID != COMPANY_GUID
                });
              });
            //this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        }
      ]
    }); alert.present();
  }


  public CloseCompanyClick() {

    if (this.AddCompanyClicked == true) {
      this.AddCompanyClicked = false;
    }
    if (this.EditCompanyClicked == true) {
      this.EditCompanyClicked = false;
    }
  }


  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private companysetupservice: CompanySetup_Service, private alertCtrl: AlertController) {
    super(navCtrl, true);
    
    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.companys = data.resource;
      });

    this.Companyform = fb.group({
      //NAME: [null, Validators.compose([Validators.pattern('[a-zA-Z0-9][a-zA-Z0-9 ]+'), Validators.required])],
      NAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],

      //NAME: ["", Validators.required],
      REGISTRATION_NO: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
      //REGISTRATION_NO: ["", Validators.required],
      ADDRESS: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
      //ADDRESS: ["", Validators.required],
      FAX: [null, Validators.compose([Validators.pattern('^[0-9]*'), Validators.required])],
      //FAX: ["", Validators.required],
      //PHONE: [null, Validators.compose([Validators.pattern('^(?!(0))[0-9]*'), Validators.required])],

      PHONE: [null, Validators.compose([Validators.pattern('^[0-9]*'), Validators.required])],
      //PHONE: ["", Validators.required],
      EMAIL: [null, Validators.compose([Validators.pattern('\\b[\\w.%-]+@[-.\\w]+\\.[A-Za-z]{2,4}\\b'), Validators.required])],
      //EMAIL: ["", Validators.required],
    }); 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CompanysetupPage');
  }

  Save() {
    if (this.Companyform.valid) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      let url: string;
      url = this.baseResource_Url + "main_company?filter=(REGISTRATION_NO=" + this.REGISTRATION_NO_ngModel_Add + ")OR(FAX=" + this.FAX_ngModel_Add + ")OR(PHONE=" + this.PHONE_ngModel_Add + ")OR(EMAIL=" + this.EMAIL_ngModel_Add + ")&api_key=" + constants.DREAMFACTORY_API_KEY;
      this.http.get(sanitizeURL(url), options)
        .map(res => res.json())
        .subscribe(
        data => {
          let res = data["resource"];
          if (res.length == 0) {
            console.log("No records Found");
            if (this.Exist_Record == false) {
              this.company_entry.NAME = this.NAME_ngModel_Add;
              this.company_entry.REGISTRATION_NO = this.REGISTRATION_NO_ngModel_Add;
              this.company_entry.ADDRESS = this.ADDRESS_ngModel_Add;
              this.company_entry.FAX = this.FAX_ngModel_Add;
              this.company_entry.PHONE = this.PHONE_ngModel_Add;
              this.company_entry.EMAIL = this.EMAIL_ngModel_Add;

              this.company_entry.COMPANY_GUID = UUID.UUID();
              this.company_entry.CREATION_TS = new Date().toISOString();
              this.company_entry.CREATION_USER_GUID = "1";
              this.company_entry.UPDATE_TS = new Date().toISOString();
              this.company_entry.UPDATE_USER_GUID = "";

              this.companysetupservice.save(this.company_entry)
                .subscribe((response) => {
                  if (response.status == 200) {
                    alert('Company Type Registered successfully');
                    //location.reload();
                    this.navCtrl.setRoot(this.navCtrl.getActive().component);
                  }
                });
            }
          }
          else {
            console.log("Records Found");
            alert("The Company is already Exist.")
          }
        },
        err => {
          this.Exist_Record = false;
          console.log("ERROR!: ", err);
        });
    }
  }
  getCompanyList() {
    let self = this;
    let params: URLSearchParams = new URLSearchParams();
    self.companysetupservice.get_company(params)
      .subscribe((companys: CompanySetup_Model[]) => {
        self.companys = companys;
      });
  }

  Update(COMPANY_GUID: any) {
    if (this.Companyform.valid) {
      if (this.company_entry.NAME == null) { this.company_entry.NAME = this.NAME_ngModel_Edit.trim(); }
      if (this.company_entry.REGISTRATION_NO == null) { this.company_entry.REGISTRATION_NO = this.REGISTRATION_NO_ngModel_Edit.trim(); }
      if (this.company_entry.ADDRESS == null) { this.company_entry.ADDRESS = this.ADDRESS_ngModel_Edit.trim(); }
      if (this.company_entry.FAX == null) { this.company_entry.FAX = this.FAX_ngModel_Edit.trim(); }
      if (this.company_entry.PHONE == null) { this.company_entry.PHONE = this.PHONE_ngModel_Edit.trim(); }
      if (this.company_entry.EMAIL == null) { this.company_entry.EMAIL = this.EMAIL_ngModel_Edit.trim(); }

      this.company_entry.CREATION_TS = this.company_details.CREATION_TS;
      this.company_entry.CREATION_USER_GUID = this.company_details.CREATION_USER_GUID;
      this.company_entry.UPDATE_TS = this.company_details.UPDATE_TS;
      this.company_entry.COMPANY_GUID = COMPANY_GUID;
      this.company_entry.UPDATE_TS = new Date().toISOString();
      this.company_entry.UPDATE_USER_GUID = '1';

      let url: string;
      if (this.REGISTRATION_NO_ngModel_Edit.trim() != localStorage.getItem('Prev_co_Reg') || this.FAX_ngModel_Edit.trim() != localStorage.getItem('Prev_co_Fax') || this.PHONE_ngModel_Edit.trim() != localStorage.getItem('Prev_co_Phone') || this.EMAIL_ngModel_Edit.trim() != localStorage.getItem('Prev_co_Email')) {


        url = this.baseResource_Url + "main_company?filter=(REGISTRATION_NO=" + this.REGISTRATION_NO_ngModel_Edit.trim() + ")OR(FAX=" + this.FAX_ngModel_Edit.trim() + ")OR(PHONE=" + this.PHONE_ngModel_Edit.trim() + ")OR(EMAIL=" + this.EMAIL_ngModel_Edit.trim() + ")&api_key=" + constants.DREAMFACTORY_API_KEY;
        //url = this.baseResource_Url + "main_company?filter=(NAME=" + this.NAME_ngModel_Edit + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
        console.log(url);
        this.http.get(sanitizeURL(url))
          .map(res => res.json())
          .subscribe(
          data => {
            let res1 = data["resource"];
            console.log(' Current Registration No : ' + this.REGISTRATION_NO_ngModel_Edit + ', Previous Reg : ' + localStorage.getItem('Prev_co_Reg'));

            if (res1.length == 0) {
              console.log("No records Found");
              this.company_entry.REGISTRATION_NO = this.REGISTRATION_NO_ngModel_Edit.trim();
              this.company_entry.FAX = this.FAX_ngModel_Edit.trim();
              this.company_entry.PHONE = this.PHONE_ngModel_Edit.trim();
              this.company_entry.EMAIL = this.EMAIL_ngModel_Edit.trim();

              //**************Update service if it is new details*************************
              this.companysetupservice.update(this.company_entry)
                .subscribe((response) => {
                  if (response.status == 200) {
                    alert('hi');
                    alert('company updated successfully');
                    this.navCtrl.setRoot(this.navCtrl.getActive().component);
                  }
                });
              //**************************************************************************
            }
            //start
            else {
              if (this.REGISTRATION_NO_ngModel_Edit.trim() != localStorage.getItem('Prev_co_Reg') && this.FAX_ngModel_Edit.trim() == localStorage.getItem('Prev_co_Fax') && this.PHONE_ngModel_Edit.trim() == localStorage.getItem('Prev_co_Phone') && this.EMAIL_ngModel_Edit.trim() == localStorage.getItem('Prev_co_Email')) {
                for (let {} of res1) {
                  //alert(res1[j++]["ACCOUNT_ID"]);

                  // if(res1[j++]["ACCOUNT_ID"].trim()!=this.ACCOUNT_ID_ngModel_Edit.trim()){
                  //   alert('update required');
                  // }
                  // else{
                  //   alert('exist record');
                  // }

                }

                //alert('Record Value: ' + res1[0]["ACCOUNT_ID"].trim() + ', Entry Value:' + this.ACCOUNT_ID_ngModel_Edit.trim());   

                if (res1[0]["REGISTRATION_NO"].trim() != this.REGISTRATION_NO_ngModel_Edit.trim()) {
                  this.company_entry.REGISTRATION_NO = this.REGISTRATION_NO_ngModel_Edit.trim();
                  this.company_entry.FAX = this.FAX_ngModel_Edit.trim();
                  this.company_entry.PHONE = this.PHONE_ngModel_Edit.trim();
                  this.company_entry.EMAIL = this.EMAIL_ngModel_Edit.trim();

                  //**************Update service if it is new details*************************
                  this.companysetupservice.update(this.company_entry)
                    .subscribe((response) => {
                      if (response.status == 200) {
                        alert('Company updated successfully');
                        //location.reload();
                        this.navCtrl.setRoot(this.navCtrl.getActive().component);
                      }
                    });
                  //**************************************************************************
                }
                else {
                  alert("The Company is already Exist.");
                }
              }

              else if (this.FAX_ngModel_Edit.trim() != localStorage.getItem('Prev_co_Fax') && this.PHONE_ngModel_Edit.trim() == localStorage.getItem('Prev_co_Phone') && this.EMAIL_ngModel_Edit.trim() == localStorage.getItem('Prev_co_Email') && this.REGISTRATION_NO_ngModel_Edit.trim() == localStorage.getItem('Prev_co_Reg')) {
                // alert('Ac id same, cash card change');
                //alert('Record Value: ' + res1[0]["CASHCARD_SNO"].trim() + ', Entry Value:' + this.CASHCARD_SNO_ngModel_Edit.trim());  
                if (res1[0]["FAX"].trim() != this.FAX_ngModel_Edit.trim()) {
                  this.company_entry.REGISTRATION_NO = this.REGISTRATION_NO_ngModel_Edit.trim();
                  this.company_entry.FAX = this.FAX_ngModel_Edit.trim();
                  this.company_entry.PHONE = this.PHONE_ngModel_Edit.trim();
                  this.company_entry.EMAIL = this.EMAIL_ngModel_Edit.trim();

                  //**************Update service if it is new details*************************
                  this.companysetupservice.update(this.company_entry)
                    .subscribe((response) => {
                      if (response.status == 200) {
                        alert('Company updated successfully');
                        //location.reload();
                        this.navCtrl.setRoot(this.navCtrl.getActive().component);
                      }
                    });
                  //**************************************************************************
                }
                else {
                  alert("The Company is already Exist.");
                }
              }

              else if (this.PHONE_ngModel_Edit.trim() != localStorage.getItem('Prev_co_Phone') && this.FAX_ngModel_Edit.trim() == localStorage.getItem('Prev_co_Fax') && this.EMAIL_ngModel_Edit.trim() == localStorage.getItem('Prev_co_Email') && this.REGISTRATION_NO_ngModel_Edit.trim() == localStorage.getItem('Prev_co_Reg')) {
                // alert('Ac id same, cash card change');
                //alert('Record Value: ' + res1[0]["CASHCARD_SNO"].trim() + ', Entry Value:' + this.CASHCARD_SNO_ngModel_Edit.trim());  
                if (res1[0]["PHONE"].trim() != this.PHONE_ngModel_Edit.trim()) {
                  this.company_entry.REGISTRATION_NO = this.REGISTRATION_NO_ngModel_Edit.trim();
                  this.company_entry.FAX = this.FAX_ngModel_Edit.trim();
                  this.company_entry.PHONE = this.PHONE_ngModel_Edit.trim();
                  this.company_entry.EMAIL = this.EMAIL_ngModel_Edit.trim();

                  //**************Update service if it is new details*************************
                  this.companysetupservice.update(this.company_entry)
                    .subscribe((response) => {
                      if (response.status == 200) {
                        alert('Company updated successfully');
                        //location.reload();
                        this.navCtrl.setRoot(this.navCtrl.getActive().component);
                      }
                    });
                  //**************************************************************************
                }
                else {
                  alert("The Company is already Exist.");
                }
              }

              else if (this.EMAIL_ngModel_Edit.trim() != localStorage.getItem('Prev_co_Email') && this.FAX_ngModel_Edit.trim() == localStorage.getItem('Prev_co_Fax') && this.PHONE_ngModel_Edit.trim() == localStorage.getItem('Prev_co_Phone') && this.REGISTRATION_NO_ngModel_Edit.trim() == localStorage.getItem('Prev_co_Reg')) {
                // alert('Ac id same, cash card change');
                //alert('Record Value: ' + res1[0]["CASHCARD_SNO"].trim() + ', Entry Value:' + this.CASHCARD_SNO_ngModel_Edit.trim());  
                if (res1[0]["EMAIL"].trim() != this.EMAIL_ngModel_Edit.trim()) {
                  this.company_entry.REGISTRATION_NO = this.REGISTRATION_NO_ngModel_Edit.trim();
                  this.company_entry.FAX = this.FAX_ngModel_Edit.trim();
                  this.company_entry.PHONE = this.PHONE_ngModel_Edit.trim();
                  this.company_entry.EMAIL = this.EMAIL_ngModel_Edit.trim();

                  //**************Update service if it is new details*************************
                  this.companysetupservice.update(this.company_entry)
                    .subscribe((response) => {
                      if (response.status == 200) {
                        alert('Company updated successfully');
                        //location.reload();
                        this.navCtrl.setRoot(this.navCtrl.getActive().component);
                      }
                    });
                  //**************************************************************************
                }
                else {
                  alert("The Company is already Exist.");
                }
              }
              //end
              else {
                console.log("Records Found");
                alert('hello');
                alert("The company is already Exist. ");
              }
            }
          },
          err => {
            this.Exist_Record = false;
            console.log("ERROR!: ", err);
          });
      }
      else {
        // if (this.company_entry.NAME == null) { this.company_entry.NAME = localStorage.getItem('Prev_Name'); }


        this.company_entry.REGISTRATION_NO = localStorage.getItem('Prev_co_Reg');
        this.company_entry.FAX = localStorage.getItem('Prev_co_Fax');
        this.company_entry.PHONE = localStorage.getItem('Prev_co_Phone');
        this.company_entry.EMAIL = localStorage.getItem('Prev_co_Email');

        //**************Update service if it is old details*************************

        this.companysetupservice.update(this.company_entry)
          .subscribe((response) => {
            if (response.status == 200) {
              alert('Company Type updated successfully');
              //location.reload();
              this.navCtrl.setRoot(this.navCtrl.getActive().component);
            }
          });
      }
    }
  }
}

