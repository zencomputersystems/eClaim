import 'rxjs/add/operator/map';

import * as Settings from '../../../dbSettings/companySettings';

import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, Loading, NavController, NavParams } from 'ionic-angular';
import { maxDate, minDate } from '../../../shared/GlobalFunction';

import { ApiManagerProvider } from '../../../providers/api-manager.provider';
import { DecimalPipe } from '@angular/common';
import { Http } from '@angular/http';
import { ProfileManagerProvider } from '../../../providers/profile-manager.provider';
import { UploadImage } from '../../../providers/uploader/uploader';
import { UserclaimslistPage } from '../../userclaimslist/userclaimslist';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-miscellaneous-claim',
  templateUrl: 'miscellaneous-claim.html', providers: [DecimalPipe]
})
export class MiscellaneousClaimPage {
  uploadFileName: string;
  @ViewChild('fileInput') fileInput: ElementRef;
  loading: Loading; MiscellaneousForm: FormGroup;
  //claimFor: any;
  Customer_Lookup_ngModel: any;
  Project_Lookup_ngModel: any;
  Miscellaneous_Customer_ngModel: any;
  ProjectLookupClicked: boolean = false;
  CustomerLookupClicked: boolean = false;
  public Miscellaneous_SOC_No_ngModel: any;
  public Miscellaneous_ProjectName_ngModel: any;
  storeProjects: any[]; projects: any[]; customers: any[]; storeCustomers: any[];

  CloudFilePath: string;
  Miscellaneous_Amount_ngModel: any;
  travelAmount: any;
  isCustomer: boolean = false;
  Customer_GUID: any;
  Soc_GUID: any;
  ClaimRequestMain: any;
  public MainClaimSaved: boolean = false;
  TenantGUID: any;
  userGUID: any;
  Miscellaneous_Date_ngModel: any = this.api.CreateTimestamp();
  Miscellaneous_Description_ngModel: any;
  public assignedTo: any;
  public profileLevel: any;
  public stage: any;
  public profileJSON: any;
  claimFor: string = 'seg_project';
  currency = localStorage.getItem("cs_default_currency");
  rejectedLevel: any;
  minDateAllowed: string = minDate();
  minDateRejected: string = minDate(true);
  validDate: string = maxDate();

  
  ImageUploadValidation: boolean = false;
  chooseFile: boolean = false;
  min_claim_amount: any; min_claim: any;
  max_claim_amount: any; max_claim: any;
  /********FORM EDIT VARIABLES***********/
  isFormEdit: boolean = false;
  claimRequestGUID: any;
  claimRequestData: any;

  constructor(public numberPipe: DecimalPipe, public profileMng: ProfileManagerProvider, fb: FormBuilder, public navCtrl: NavController, public http: Http, public navParams: NavParams, public api: ApiManagerProvider) {
    // Lakshman
    this.min_claim_amount = localStorage.getItem('cs_min_claim_amt');
    this.min_claim = this.numberPipe.transform(this.min_claim_amount, '1.2-2');
    // this.min_claim_amount =null;
    if (this.min_claim_amount == null) {
      this.min_claim_amount = Settings.ClaimAmountConstants.MIN_CLAIM_AMOUNT
    }
    this.max_claim_amount = localStorage.getItem('cs_max_claim_amt');
    this.max_claim = this.numberPipe.transform(this.max_claim_amount, '1.2-2');
    // this.max_claim_amount =null;
    if (this.max_claim_amount == null) {
      this.max_claim_amount = Settings.ClaimAmountConstants.MAX_CLAIM_AMOUNT
    }
    // Lakshman
    this.profileMng.CheckSessionOut();
    this.userGUID = localStorage.getItem('g_USER_GUID');
    this.isFormEdit = this.navParams.get('isFormEdit');
    this.claimRequestGUID = this.navParams.get('cr_GUID'); //dynamic
    this.TenantGUID = localStorage.getItem('g_TENANT_GUID');
    if (this.isFormEdit) {
      this.api.getApiModel('view_work_flow_history', 'filter=(CLAIM_REQUEST_GUID=' + this.claimRequestGUID + ')AND(STATUS=Rejected)').subscribe(res => {
        this.claimRequestData = res['resource'];
        if (this.claimRequestData.length > 0) {
          this.rejectedLevel = this.claimRequestData[0]['PROFILE_LEVEL'];
          this.profileMng.initiateLevels(this.rejectedLevel);
        }
        else
          this.profileMng.initiateLevels('1');
        this.GetDataforEdit();
      })

    }

    else {
      this.LoadCustomers();
      this.LoadProjects();
    }
    this.MiscellaneousForm = fb.group({
      avatar1: null,
      avatar: null,
      travel_date: ['', Validators.required],
      claimAmount: ['', Validators.required],
      description: ['', Validators.required], claimTypeGUID: '', attachment_GUID: ''
    });
  }

  claimAmount: number = 0;
  getCurrency(amount: number) {
    amount = Number(amount);
    if (amount > 99999) {
      // alert('Amount should not exceed RM 9,9999.00.')
      // // this.Miscellaneous_Amount_ngModel = null
      // this.claimAmount = 0;
    }
    else {
      this.claimAmount = amount;
      this.Miscellaneous_Amount_ngModel = this.numberPipe.transform(amount, '1.2-2');
    }
  }
  // Lakshman
  // getCurrency(amount: number) {
  //   amount = Number(amount);
  //   let amount_test=this.numberPipe.transform(amount, '1.2-2');
  //   if (amount <this.min_claim_amount || amount>this.max_claim_amount) {
  //     this.Miscellaneous_Amount_ngModel = null
  //     this.claimAmount = 0;
  //   } 
  //   else {
  //     this.claimAmount = amount;
  //     this.Miscellaneous_Amount_ngModel = this.numberPipe.transform(amount, '1.2-2');
  //   }
  // } 
  // Lakshman

  // getCurrency(amount: number) {
  //   this.Miscellaneous_Amount_ngModel = this.numberPipe.transform(amount, '1.2-2');
  // }


  imageURLEdit: any = null
  GetDataforEdit() {
    this.api.getApiModel('view_customer', 'filter=TENANT_GUID=' + this.TenantGUID)
      .subscribe(data => {
        this.storeCustomers = this.customers = data["resource"];
        this.api.getApiModel('soc_registration', 'filter=TENANT_GUID=' + this.TenantGUID)
          .subscribe(data => {
            this.storeProjects = this.projects = data["resource"];

            this.api.getApiModel('main_claim_request', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID)
              .subscribe(data => {
                this.claimRequestData = data["resource"];


                // this.imageURLEdit = this.claimRequestData[0].ATTACHMENT_ID;
                if (this.claimRequestData[0].ATTACHMENT_ID !== null)
                  this.imageURLEdit = this.api.getImageUrl(this.claimRequestData[0].ATTACHMENT_ID);
                  console.log("Image URL Edit: ", this.imageURLEdit);
                this.ImageUploadValidation = true;
                //this.getCurrency(this.claimRequestData[0].MILEAGE_AMOUNT)

                if (this.claimRequestData[0].SOC_GUID === null) {
                  this.claimFor = 'seg_customer'
                  this.isCustomer = true;
                  if (this.storeCustomers != undefined)
                    this.storeCustomers.forEach(element => {
                      if (element.CUSTOMER_GUID === this.claimRequestData[0].CUSTOMER_GUID) {
                        this.Customer_Lookup_ngModel = element.NAME
                        this.Customer_GUID = element.CUSTOMER_GUID
                      }
                    });
                }
                else {
                  this.claimFor = 'seg_project'
                  this.isCustomer = false;
                  if (this.storeCustomers != undefined)
                    this.storeProjects.forEach(element => {
                      if (element.SOC_GUID === this.claimRequestData[0].SOC_GUID) {
                        this.Project_Lookup_ngModel = element.project_name
                        this.Miscellaneous_SOC_No_ngModel = element.soc
                        this.Soc_GUID = element.SOC_GUID
                      }
                    });
                }
                // this.Miscellaneous_Date_ngModel = new Date(this.claimRequestData[0].TRAVEL_DATE).toISOString();
                this.Miscellaneous_Date_ngModel = moment(this.claimRequestData[0].TRAVEL_DATE).format('YYYY-MM-DD');
                this.claimAmount = this.claimRequestData[0].MILEAGE_AMOUNT;
                this.Miscellaneous_Amount_ngModel = this.numberPipe.transform(this.claimRequestData[0].MILEAGE_AMOUNT, '1.2-2');
                // this.Miscellaneous_Amount_ngModel = this.claimRequestData[0].MILEAGE_AMOUNT;
                this.Miscellaneous_Description_ngModel = this.claimRequestData[0].DESCRIPTION;
              });
          });
      })
  }

  claimForChanged() {
    if (this.claimFor == 'seg_customer') this.isCustomer = true;
    else this.isCustomer = false;
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
  public ProjectLookup() {
    this.ProjectLookupClicked = true;
  }

  public CustomerLookup() {
    this.CustomerLookupClicked = true;
  }

  GetSocNo(item: any) {
    this.Miscellaneous_SOC_No_ngModel = item.soc;
    this.Project_Lookup_ngModel = item.project_name;
    this.Soc_GUID = item.SOC_GUID;
    this.CloseProjectLookup();
  }

  GetCustomer(guid: any, name: any) {
    this.Customer_Lookup_ngModel = name;
    this.Customer_GUID = guid;
    this.CloseCustomerLookup();
  }

  LoadProjects() {
    // this.api.getApiModel('soc_registration', 'filter=TENANT_GUID=' + this.TenantGUID)

    // Added by Bijay on 25/09/2018
    this.api.getApiModel('soc_registration', 'filter=(TENANT_GUID=' + this.TenantGUID + ')AND(ACTIVATION_FLAG=1)')
      .subscribe(data => {
        this.storeProjects = this.projects = data["resource"];
      });
  }

  LoadCustomers() {
    // this.api.getApiModel('view_customer', 'filter=TENANT_GUID=' + this.TenantGUID)

    // Added by Bijay on 25/09/2018
    this.api.getApiModel('view_customer', 'filter=(TENANT_GUID=' + this.TenantGUID + ')AND(ACTIVE_FLAG=A)')
      .subscribe(data => {
        this.storeCustomers = this.customers = data["resource"];
      })
  }

  searchProject(searchString: any) {
    let val = searchString.target.value;
    if (!val || !val.trim()) {
      this.projects = this.storeProjects;
      return;
    }
    this.projects = this.filterProjects({
      project_name: val, soc: val
    });
  }

  filterProjects(params?: any) {
    if (!params) {
      return this.storeProjects;
    }

    return this.projects.filter((item) => {
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

  isImage: boolean = false;
  onFileChange(event: any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if ((file.type === 'image/jpeg') || (file.type === 'image/png'))
        this.isImage = true;
      else
        this.isImage = false;
      this.MiscellaneousForm.get('avatar').setValue(file);
      this.uploadFileName = file.name;
      reader.onload = () => {
        this.MiscellaneousForm.get('avatar').setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result.split(',')[1]
        });
      };
    }
    // this.chooseFile = true;

  }

  uniqueName: any;
  fileName1: string;
  ProfileImage: any;
  newImage: boolean = true;

  private ProfileImageDisplay(e: any, fileChoose: string): void {
    let reader = new FileReader();
    if (e.target.files && e.target.files[0]) {

      const file = e.target.files[0];
      this.MiscellaneousForm.get(fileChoose).setValue(file);
      if (fileChoose === 'avatar1')
        this.fileName1 = file.name;

      reader.onload = (event: any) => {
        this.ProfileImage = event.target.result;
      }
      reader.readAsDataURL(e.target.files[0]);
    }
    this.imageGUID = this.uploadFileName;
    this.chooseFile = true;
    this.newImage = false;
    this.onFileChange(e);
    this.ImageUploadValidation = false;
    this.saveIm();
  }


  imageGUID: any;
  saveIm() {
/*     this.loading = this.loadingCtrl.create(
      { content: 'Please wait...'});
      this.loading.present(); */
    let uploadImage = UploadImage(this.http, this.uploadFileName,this.MiscellaneousForm.get('avatar'));
    console.log("UploadImage returned result: ", uploadImage);
    if (uploadImage) {
      //this.submitAction(this.uploadFileName, formValues);
      this.imageGUID = uploadImage;
      this.chooseFile = false;
      this.ImageUploadValidation = true;
    }
  }

  /* UploadImage() {
    this.CloudFilePath = 'eclaim/'
    this.uniqueName = new Date().getTime() + this.uploadFileName;
    const queryHeaders = new Headers();
    queryHeaders.append('filename', this.uploadFileName);
    queryHeaders.append('Content-Type', 'multipart/form-data');
    queryHeaders.append('fileKey', 'file');
    queryHeaders.append('chunkedMode', 'false');
    queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
    const options = new RequestOptions({ headers: queryHeaders });
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
    });
    this.loading.present();
    return new Promise((resolve, reject) => {
      this.http.post('http://api.zen.com.my/api/v2/azurefs/' + this.CloudFilePath + this.uniqueName, this.MiscellaneousForm.get('avatar').value, options)
        .map((response) => {
          this.loading.dismissAll()
          return response;
        }).subscribe((response) => {
          resolve(response.json());
        })
    })
  } */

  clearFile() {
    this.MiscellaneousForm.get('avatar').setValue(null);
    console.log(this.fileInput);
    this.fileInput.nativeElement.value = '';
  } 

  submitAction(formValues: any) {
    let x = this.Miscellaneous_Amount_ngModel.split(",").join("");
    let amount = Number(x);
    if (amount < this.min_claim_amount || amount > this.max_claim_amount) {
      this.Miscellaneous_Amount_ngModel = null;
      alert("Claim amount should be " + this.currency + " " + this.min_claim_amount + " - " + this.max_claim_amount + " ");
      return;
    }
    else {
      this.Miscellaneous_Amount_ngModel = this.Miscellaneous_Amount_ngModel;
    }

   
    if (this.Customer_GUID === undefined && this.Soc_GUID === undefined) {
      alert('Please select "project" or "customer" to continue.');
      return;
    }
    this.api.getApiModel('claim_work_flow_history', 'filter=(CLAIM_REQUEST_GUID=' + this.claimRequestGUID + ')AND(STATUS="Rejected")')
      .subscribe(data => {
        if (data["resource"].length <= 0)
          if (this.api.isClaimExpired(formValues.travel_date, true)) { return; }

        if (this.isFormEdit) {
          this.api.getApiModel('main_claim_request', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID)
            .subscribe(data => {
              this.claimRequestData = data;
              this.claimRequestData["resource"][0].ATTACHMENT_ID = this.imageGUID;
              this.claimRequestData["resource"][0].CLAIM_AMOUNT = this.claimAmount;
              this.claimRequestData["resource"][0].MILEAGE_AMOUNT = this.claimAmount;
              this.claimRequestData["resource"][0].TRAVEL_DATE = formValues.travel_date;
              this.claimRequestData["resource"][0].DESCRIPTION = formValues.description;
              if (this.claimRequestData["resource"][0].STATUS === 'Rejected') {
                this.claimRequestData["resource"][0].PROFILE_LEVEL = this.rejectedLevel;
                this.claimRequestData["resource"][0].STAGE = localStorage.getItem('edit_stage');
                this.claimRequestData["resource"][0].ASSIGNED_TO = localStorage.getItem('edit_superior');
                if (this.rejectedLevel === 3)
                  this.claimRequestData["resource"][0].STATUS = 'Approved';
                else
                  this.claimRequestData["resource"][0].STATUS = 'Pending';
              }

              if (this.isCustomer) {
                this.claimRequestData["resource"][0].CUSTOMER_GUID = this.Customer_GUID;
                this.claimRequestData["resource"][0].SOC_GUID = null;
              }
              else {
                this.claimRequestData["resource"][0].SOC_GUID = this.Soc_GUID;
                this.claimRequestData["resource"][0].CUSTOMER_GUID = null;
              }

              //Added by Bijay on 12/10/2018 for audit_trial-----------------------
              if (this.claimRequestData["resource"][0].AUDIT_TRAIL != null && this.claimRequestData["resource"][0].AUDIT_TRAIL != "") {
                this.claimRequestData["resource"][0].AUDIT_TRAIL = this.claimRequestData["resource"][0].AUDIT_TRAIL + " \n Edited by " + localStorage.getItem("g_FULLNAME") + " at " + this.api.CreateTimestamp() + "(USER_GUID: " + localStorage.getItem("g_USER_GUID") + ")" + " User From:W";
              }
              else {
                this.claimRequestData["resource"][0].AUDIT_TRAIL = "Edited by " + localStorage.getItem("g_FULLNAME") + " at " + this.api.CreateTimestamp() + "(USER_GUID: " + localStorage.getItem("g_USER_GUID") + ")" + " User From:W";
              }
              //-------------------------------------------------------------------
              let month = new Date(formValues.travel_date).getMonth() + 1;
              let year = new Date(formValues.travel_date).getFullYear();
              this.api.getApiModel('main_claim_ref', 'filter=(USER_GUID=' + this.userGUID + ')AND(MONTH=' + month + ')AND(YEAR=' + year + ')')
                .subscribe(claimRefdata => {
                  this.claimRequestData["resource"][0].CLAIM_REF_GUID = claimRefdata["resource"][0].CLAIM_REF_GUID;
                  this.api.updateApiModel('main_claim_request', this.claimRequestData, true).subscribe(() => {
                    alert('Claim details updated successfully.')
                    this.navCtrl.push(UserclaimslistPage);
                  });
                })
              // this.api.updateApiModel('main_claim_request', this.claimRequestData, true).subscribe(res => {
              //   //Send Email------------------------------------------------
              //   let start_DT: string = "";
              //   let end_DT: string = "";

              //   // this.api.sendEmail(this.claimRequestData["resource"][0].CLAIM_TYPE_GUID, start_DT, end_DT, this.claimRequestData["resource"][0].CREATION_TS, formValues.travel_date, this.claimRequestGUID);
              //   //Commented By bijay on 24/09/2018 as per scheduler implemented
              //   // this.api.sendEmail_New(this.claimRequestData["resource"][0].CLAIM_TYPE_GUID, "", "", moment(this.claimRequestData["resource"][0].CREATION_TS).format('YYYY-MM-DDTHH:mm'), formValues.travel_date, this.claimRequestGUID, "", "", formValues.description, this.Soc_GUID, this.Customer_GUID);
              //   //----------------------------------------------------------

              //   alert('Claim details updated successfully.')
              //   this.navCtrl.push(UserclaimslistPage);
              // });
            })
        }
        else {

          formValues.claimTypeGUID = '84b3cee2-9f9d-ccb9-89a1-1e70cef19f86';
          formValues.attachment_GUID = this.imageGUID;
          formValues.soc_no = this.isCustomer ? this.Customer_GUID : this.Soc_GUID;
          this.travelAmount = this.claimAmount;
          this.profileMng.save(formValues, this.travelAmount, this.isCustomer)
        }
      })
  }

  displayImage: any
  CloseDisplayImage() {
    this.displayImage = false;
  }
  imageURL: string;
  // DisplayImage(val: any) {
  //   this.displayImage = true;
  //   this.imageURL = val;
  //   if (val !== null) { 
  //     this.imageURL = this.api.getImageUrl(val); 
  //     this.displayImage = true; 
  //     this.isImage = this.api.isFileImage(val); 
  //   }
  // }

}
