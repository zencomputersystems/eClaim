import 'rxjs/add/operator/map';

import * as Settings from '../../../dbSettings/companySettings';

import { ActionSheetController, IonicPage, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ApiManagerProvider } from '../../../providers/api-manager.provider';
import { BaseHttpService } from '../../../services/base-http';
import { DecimalPipe } from '@angular/common';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Http } from '@angular/http';
import { OvertimeClaim_Service } from '../../../services/overtimeclaim_service';
import { ProfileManagerProvider } from '../../../providers/profile-manager.provider';
import { TranslateService } from '@ngx-translate/core';
import { UserclaimslistPage } from '../../userclaimslist/userclaimslist';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-overtimeclaim',
  templateUrl: 'overtimeclaim.html',
  providers: [OvertimeClaim_Service, BaseHttpService, FileTransfer, DecimalPipe]
})
export class OvertimeclaimPage {
  OTform: FormGroup;
  uploadFileName: string;
  loading = false;
  CloudFilePath: string;
  @ViewChild('fileInput') fileInput: ElementRef;
  vehicles: any;
  customers: any[];
  storeProjects: any[];
  storeCustomers: any[];
  public projects: any[];
  Travelform: FormGroup;

  items: string[];
  OT_Date_ngModel: any;
  OT_Description_ngModel: any;
  public assignedTo: any;
  public profileLevel: any;
  public stage: any;
  public profileJSON: any;

  public OT_SOC_No_ngModel: any;
  public OT_ProjectName_ngModel: any;
  public OT_From_ngModel: any;
  public OT_Destination_ngModel: any;
  public OT_Distance_ngModel: any;
  public OT_Mode_ngModel: any;
  OT_Amount_ngModel: any;
  Project_Lookup_ngModel: any;
  Travel_Customer_ngModel: any;
  Customer_Lookup_ngModel: any;
  Customer_GUID: any;
  Soc_GUID: any;
  TenantGUID: any;
  claimFor: string = 'seg_project';
  currency = localStorage.getItem('cs_default_currency');

  userGUID: any;
  public socGUID: any;
  public AddTravelClicked: boolean = false;
  ProjectLookupClicked: boolean = false;
  CustomerLookupClicked: boolean = false;
  DestinationPlaceID: string;
  OriginPlaceID: string;
  public AddLookupClicked: boolean = false;
  public AddToLookupClicked: boolean = false;
  currentItems: any;
  public MainClaimSaved: boolean = false;
  Start_DT_ngModel: any = this.apiMng.CreateTimestamp();
  End_DT_ngModel: any = this.apiMng.CreateTimestamp();
  VehicleId: any;
  VehicleRate: any;
  travelAmount: any;
  validDate = new Date().toISOString();
  ClaimRequestMain: any;
  isCustomer: boolean = false;
  ImageUploadValidation: boolean = false;
  chooseFile: boolean = false;
  min_claim_amount: any;
  min_claim: any;
  max_claim_amount: any;
  max_claim: any;
  /********FORM EDIT VARIABLES***********/
  isFormEdit: boolean = false;
  claimRequestGUID: any;
  claimRequestData: any;
  rejectedLevel: any;

  claimAmount: number = 0;
  rate_blocks: any[];

  imageURLEdit: any = null;

  dirty = false;

  Dirty() { return true; }
  GetDataforEdit() {
    this.apiMng
      .getApiModel('view_customer', 'filter=TENANT_GUID=' + this.TenantGUID)
      .subscribe(data => {
        this.storeCustomers = this.customers = data['resource'];
        this.apiMng
          .getApiModel(
            'soc_registration',
            'filter=TENANT_GUID=' + this.TenantGUID
          )
          .subscribe(data => {
            this.storeProjects = this.projects = data['resource'];

            this.apiMng
              .getApiModel(
                'main_claim_request',
                'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID
              )
              .subscribe(data => {
                this.claimRequestData = data['resource'];

                if (this.claimRequestData[0].SOC_GUID === null) {
                  this.claimFor = 'seg_customer';
                  this.isCustomer = true;
                  if (this.storeCustomers != undefined)
                    this.storeCustomers.forEach(element => {
                      if (
                        element.CUSTOMER_GUID ===
                        this.claimRequestData[0].CUSTOMER_GUID
                      ) {
                        this.Customer_Lookup_ngModel = element.NAME;
                        this.Customer_GUID = element.CUSTOMER_GUID;
                      }
                    });
                } else {
                  this.claimFor = 'seg_project';
                  this.isCustomer = false;
                  if (this.storeCustomers != undefined)
                    this.storeProjects.forEach(element => {
                      if (
                        element.SOC_GUID === this.claimRequestData[0].SOC_GUID
                      ) {
                        this.Project_Lookup_ngModel = element.project_name;
                        this.OT_SOC_No_ngModel = element.soc;
                        this.Soc_GUID = element.SOC_GUID;
                      }
                    });
                }
                // this.Start_DT_ngModel = new Date(this.claimRequestData[0].START_TS).toISOString();
                // this.End_DT_ngModel = new Date(this.claimRequestData[0].END_TS).toISOString();
                this.Start_DT_ngModel = moment(
                  this.claimRequestData[0].START_TS
                ).format('YYYY-MM-DDTHH:mm');
                this.End_DT_ngModel = moment(
                  this.claimRequestData[0].END_TS
                ).format('YYYY-MM-DDTHH:mm');
                this.claimAmount = this.claimRequestData[0].MILEAGE_AMOUNT;
                this.OT_Amount_ngModel = this.numberPipe.transform(
                  this.claimRequestData[0].MILEAGE_AMOUNT,
                  '1.2-2'
                );
                // this.OT_Amount_ngModel = this.claimRequestData[0].MILEAGE_AMOUNT;
                this.OT_Description_ngModel = this.claimRequestData[0].DESCRIPTION;
              });
          });
      });
  }

  constructor(
    public numberPipe: DecimalPipe,
    private apiMng: ApiManagerProvider,
    public profileMng: ProfileManagerProvider,
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public translate: TranslateService,
    fb: FormBuilder,
    public http: Http,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController
  ) {
    // Lakshman
    this.min_claim_amount = localStorage.getItem('cs_min_claim_amt');
    this.min_claim = this.numberPipe.transform(this.min_claim_amount, '1.2-2');
    //  this.min_claim_amount =null;
    if (this.min_claim_amount == null) {
      this.min_claim_amount = Settings.ClaimAmountConstants.MIN_CLAIM_AMOUNT;
    }
    this.max_claim_amount = localStorage.getItem('cs_max_claim_amt');
    this.max_claim = this.numberPipe.transform(this.max_claim_amount, '1.2-2');
    //  this.max_claim_amount =null;
    if (this.max_claim_amount == null) {
      this.max_claim_amount = Settings.ClaimAmountConstants.MAX_CLAIM_AMOUNT;
    }
    let currency = localStorage.getItem('cs_default_currency');
    // Lakshman

    this.profileMng.CheckSessionOut();
    this.TenantGUID = localStorage.getItem('g_TENANT_GUID');
    this.userGUID = localStorage.getItem('g_USER_GUID');
    this.isFormEdit = this.navParams.get('isFormEdit');
    this.claimRequestGUID = this.navParams.get('cr_GUID'); //dynamic
    this.getOTRate();

    if (this.isFormEdit) {
      this.apiMng
        .getApiModel(
          'view_work_flow_history',
          'filter=(CLAIM_REQUEST_GUID=' +
            this.claimRequestGUID +
            ')AND(STATUS=Rejected)'
        )
        .subscribe(res => {
          this.claimRequestData = res['resource'];
          if (this.claimRequestData.length > 0) {
            this.rejectedLevel = this.claimRequestData[0]['PROFILE_LEVEL'];
            this.profileMng.initiateLevels(this.rejectedLevel);
          } else this.profileMng.initiateLevels('1');
          this.GetDataforEdit();
        });
    } else {
      this.LoadCustomers();
      this.LoadProjects();
    }

    this.OTform = fb.group({
      avatar: null,
      soc_no: '',
      // travel_date:  ['', Validators.required],
      start_DT: ['', Validators.required],
      end_DT: ['', Validators.required],
      description: ['', Validators.required],
      claim_amount: ['', Validators.required],
      attachment_GUID: '',
      claimTypeGUID: ''
    });
  }

  imageGUID: any;

  GetSocNo(item: any) {
    this.OT_SOC_No_ngModel = item.soc;
    this.Project_Lookup_ngModel = item.project_name;
    this.Soc_GUID = item.SOC_GUID;
    this.CloseProjectLookup();
  }

  GetCustomer(guid: any, name: any) {
    this.Customer_Lookup_ngModel = name;
    this.Customer_GUID = guid;
    this.CloseCustomerLookup();
  }

  claimForChanged() {
    // console.log(this.claimFor)
    if (this.claimFor == 'seg_customer') this.isCustomer = true;
    else this.isCustomer = false;
  }

  LoadProjects() {
    // this.apiMng.getApiModel('soc_registration', 'filter=TENANT_GUID=' + this.TenantGUID)

    // Added by Bijay on 25/09/2018
    this.apiMng
      .getApiModel(
        'soc_registration',
        'filter=(TENANT_GUID=' + this.TenantGUID + ')AND(ACTIVATION_FLAG=1)'
      )
      .subscribe(data => {
        this.storeProjects = this.projects = data['resource'];
      });
  }

  getOTRate() {
    this.apiMng
      .getApiModel('ot_rate', 'filter=TENANT_GUID=' + this.TenantGUID)
      .subscribe(data => {
        this.rate_blocks = data['resource'];
      });
  }

  getOT() {
    if (this.dirty) {
    let from = moment(
      moment
        .utc(this.Start_DT_ngModel)
        .utcOffset(-localStorage.getItem('cs_timestamp'))
        .format('YYYY-MM-DDTHH:mm')
    );
    let to = moment(
      moment
        .utc(this.End_DT_ngModel)
        .utcOffset(-localStorage.getItem('cs_timestamp'))
        .format('YYYY-MM-DDTHH:mm')
    );
    let day = moment
      .utc(this.Start_DT_ngModel)
      .utcOffset(-localStorage.getItem('cs_timestamp'))
      .format('dddd');
    let hours = to.diff(from, 'hours');
    if (hours % 2 != 0) {
      hours -= 1;
    }
    this.rate_blocks.forEach(element => {
      if (Number(element.hours) === hours) {
        if (day === 'Saturday' || day === 'Sunday') {
          this.OT_Amount_ngModel = Number(element.week_end_rate);
        } else {
          this.OT_Amount_ngModel = Number(element.week_day_rate);
        }
      }
    });
    this.claimAmount = this.OT_Amount_ngModel;
    return hours;
  } else return false;
  } // GetOT()

  LoadCustomers() {
    // this.apiMng.getApiModel('view_customer', 'filter=TENANT_GUID=' + this.TenantGUID)

    // Added by Bijay on 25/09/2018
    this.apiMng
      .getApiModel(
        'view_customer',
        'filter=(TENANT_GUID=' + this.TenantGUID + ')AND(ACTIVE_FLAG=A)'
      )
      .subscribe(data => {
        this.storeCustomers = this.customers = data['resource'];
      });
  }

  public CloseTravelClick() {
    this.AddToLookupClicked = false;
    this.AddTravelClicked = false;
  }

  public CloseProjectLookup() {
    if (this.ProjectLookupClicked == true) {
      this.ProjectLookupClicked = false;
    }
  }

  public CloseCustomerLookup() {
    if (this.CustomerLookupClicked == true) {
      this.CustomerLookupClicked = false;
    }
  }

  public AddLookupClick() {
    this.AddLookupClicked = true;
    this.currentItems = null;
  }

  public AddToLookupClick() {
    this.AddLookupClicked = true;
    this.AddToLookupClicked = true;
    this.currentItems = null;
  }

  public ProjectLookup() {
    this.ProjectLookupClicked = true;
  }

  public CustomerLookup() {
    this.CustomerLookupClicked = true;
  }

  searchProject(searchString: any) {
    let val = searchString.target.value;
    if (!val || !val.trim()) {
      this.projects = this.storeProjects;
      return;
    }
    this.projects = this.filterProjects({
      project_name: val
    });
  }

  filterProjects(params?: any) {
    if (!params) {
      return this.storeProjects;
    }

    return this.projects.filter(item => {
      for (let key in params) {
        let field = item[key];
        if (
          typeof field == 'string' &&
          field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0
        ) {
          return item;
        } else if (field == params[key]) {
          return item;
        }
      }
      return null;
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

    return this.customers.filter(item => {
      for (let key in params) {
        let field = item[key];
        if (
          typeof field == 'string' &&
          field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0
        ) {
          return item;
        } else if (field == params[key]) {
          return item;
        }
      }
      return null;
    });
  }

  validateDate(startDate: any, endDate: any) {
    let today = this.apiMng.CreateTimestamp();
    let start = startDate;
    let end = endDate;
    // let today = Date.parse(new Date().toISOString())
    // let start = Date.parse(this.Start_DT_ngModel)
    // let end = Date.parse(this.End_DT_ngModel)
    if (start > end || today < start) {
      alert('The date range is not valid.');
      return false;
    }
    return true;
  }

  allowanceGUID: any;
  onAllowanceSelect(allowance: any) {
    this.allowanceGUID = allowance.ALLOWANCE_GUID;
  }

  submitAction(formValues: any) {
    let x = this.OT_Amount_ngModel;
    let amount = Number(x);
    if (amount < this.min_claim_amount || amount > this.max_claim_amount) {
      this.OT_Amount_ngModel = null;
      alert(
        'Claim amount should be ' +
          this.currency +
          ' ' +
          this.min_claim_amount +
          ' - ' +
          this.max_claim_amount +
          ' '
      );
      return;
    } else {
      this.OT_Amount_ngModel = this.OT_Amount_ngModel;
    }
    formValues.travel_date = formValues.start_DT;

    if (this.Customer_GUID === undefined && this.Soc_GUID === undefined) {
      alert('Please select "project" or "customer" to continue.');
      return;
    }
    if (this.validateDate(this.Start_DT_ngModel, this.End_DT_ngModel)) {
      this.apiMng
        .getApiModel(
          'claim_work_flow_history',
          'filter=(CLAIM_REQUEST_GUID=' +
            this.claimRequestGUID +
            ')AND(STATUS="Rejected")'
        )
        .subscribe(data => {
          if (data['resource'].length <= 0)
            if (this.apiMng.isClaimExpired(formValues.travel_date, true)) {
              return;
            }

          if (this.isFormEdit) {
            this.apiMng
              .getApiModel(
                'main_claim_request',
                'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID
              )
              .subscribe(data => {
                this.claimRequestData = data;
                this.claimRequestData[
                  'resource'
                ][0].ATTACHMENT_ID = this.imageGUID;
                this.claimRequestData[
                  'resource'
                ][0].CLAIM_AMOUNT = this.claimAmount;
                this.claimRequestData[
                  'resource'
                ][0].MILEAGE_AMOUNT = this.claimAmount;
                this.claimRequestData['resource'][0].TRAVEL_DATE =
                  formValues.travel_date;
                this.claimRequestData['resource'][0].DESCRIPTION =
                  formValues.description;
                this.claimRequestData['resource'][0].START_TS =
                  formValues.start_DT;
                this.claimRequestData['resource'][0].END_TS = formValues.end_DT;
                if (
                  this.claimRequestData['resource'][0].STATUS === 'Rejected'
                ) {
                  this.claimRequestData[
                    'resource'
                  ][0].PROFILE_LEVEL = this.rejectedLevel;
                  this.claimRequestData[
                    'resource'
                  ][0].STAGE = localStorage.getItem('edit_stage');
                  this.claimRequestData[
                    'resource'
                  ][0].ASSIGNED_TO = localStorage.getItem('edit_superior');
                  if (this.rejectedLevel === 3)
                    this.claimRequestData['resource'][0].STATUS = 'Approved';
                  else this.claimRequestData['resource'][0].STATUS = 'Pending';
                }
                //this.claimRequestData[0].claim_amount= formValues.claim_amount;
                if (this.isCustomer) {
                  this.claimRequestData[
                    'resource'
                  ][0].CUSTOMER_GUID = this.Customer_GUID;
                  this.claimRequestData['resource'][0].SOC_GUID = null;
                } else {
                  this.claimRequestData['resource'][0].SOC_GUID = this.Soc_GUID;
                  this.claimRequestData['resource'][0].CUSTOMER_GUID = null;
                }

                //Added by Bijay on 12/10/2018 for audit_trial-----------------------
                if (
                  this.claimRequestData['resource'][0].AUDIT_TRAIL != null &&
                  this.claimRequestData['resource'][0].AUDIT_TRAIL != ''
                ) {
                  this.claimRequestData['resource'][0].AUDIT_TRAIL =
                    this.claimRequestData['resource'][0].AUDIT_TRAIL +
                    ' \n Edited by ' +
                    localStorage.getItem('g_FULLNAME') +
                    ' at ' +
                    this.apiMng.CreateTimestamp() +
                    ')' +
                    ' User From:W';
                } else {
                  this.claimRequestData['resource'][0].AUDIT_TRAIL =
                    'Edited by ' +
                    localStorage.getItem('g_FULLNAME') +
                    ' at ' +
                    this.apiMng.CreateTimestamp() +
                    ')' +
                    ' User From:W';
                }
                //-------------------------------------------------------------------

                //this.claimRequestData[0].STATUS = 'Pending';
                // this.apiMng.updateMyClaimRequest(this.claimRequestData[0]).subscribe(res => alert('Claim details are submitted successfully.'))
                let month = new Date(formValues.travel_date).getMonth() + 1;
                let year = new Date(formValues.travel_date).getFullYear();
                this.apiMng
                  .getApiModel(
                    'main_claim_ref',
                    'filter=(USER_GUID=' +
                      this.userGUID +
                      ')AND(MONTH=' +
                      month +
                      ')AND(YEAR=' +
                      year +
                      ')'
                  )
                  .subscribe(claimRefdata => {
                    this.claimRequestData['resource'][0].CLAIM_REF_GUID =
                      claimRefdata['resource'][0].CLAIM_REF_GUID;
                    this.apiMng
                      .updateApiModel(
                        'main_claim_request',
                        this.claimRequestData,
                        true
                      )
                      .subscribe(res => {
                        alert('Claim details updated successfully.');
                        this.navCtrl.push(UserclaimslistPage);
                      });
                  });
                // this.apiMng.updateApiModel('main_claim_request', this.claimRequestData, true).subscribe(() => {
                //   //Send Email------------------------------------------------
                //   // this.apiMng.sendEmail(this.claimRequestData["resource"][0].CLAIM_TYPE_GUID, formValues.start_DT, formValues.end_DT, moment(this.claimRequestData["resource"][0].CREATION_TS).format('YYYY-MM-DDTHH:mm'), formValues.start_DT, this.claimRequestGUID);
                //   //Commented By bijay on 24/09/2018 as per scheduler implemented
                //   // this.apiMng.sendEmail_New(this.claimRequestData["resource"][0].CLAIM_TYPE_GUID, formValues.start_DT, formValues.end_DT, moment(this.claimRequestData["resource"][0].CREATION_TS).format('YYYY-MM-DDTHH:mm'), formValues.travel_date, this.claimRequestGUID, "", "", formValues.description, this.Soc_GUID, this.Customer_GUID);
                //   //----------------------------------------------------------
                //   alert('Claim details updated successfully.');
                //   this.navCtrl.push(UserclaimslistPage);
                // });
              });
          } else {
            formValues.claimTypeGUID = '37067b3d-1bf4-33a3-2b60-3ca40baf589a';

            formValues.attachment_GUID = this.imageGUID;
            this.travelAmount = this.claimAmount;
            formValues.soc_no = this.isCustomer
              ? this.Customer_GUID
              : this.Soc_GUID;
            this.profileMng.save(
              formValues,
              this.travelAmount,
              this.isCustomer
            );
          }
        });
    }
  }
}
