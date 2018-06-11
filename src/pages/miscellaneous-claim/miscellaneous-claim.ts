import { Component,ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UUID } from 'angular2-uuid';
import { DecimalPipe } from '@angular/common';
import 'rxjs/add/operator/map';
import { TravelclaimPage } from '../../pages/travel-claim/travel-claim.component';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import * as constants from '../../app/config/constants';
import { Services } from '../Services';
import { ImageUpload_model } from '../../models/image-upload.model';
import { ApiManagerProvider } from '../../providers/api-manager.provider';
import { ProfileManagerProvider } from '../../providers/profile-manager.provider';
import { UserclaimslistPage } from '../../pages/userclaimslist/userclaimslist';


@IonicPage()
@Component({
  selector: 'page-miscellaneous-claim',
  templateUrl: 'miscellaneous-claim.html', providers: [DecimalPipe]
})
export class MiscellaneousClaimPage {
  uploadFileName: string;
  @ViewChild('fileInput') fileInput: ElementRef;
  loading = false; MiscellaneousForm: FormGroup;
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
  validDate = new Date().toISOString();
  isCustomer: boolean = true;
  Customer_GUID: any;
  Soc_GUID: any;
  ClaimRequestMain: any;
  public MainClaimSaved: boolean = false;
  TenantGUID: any;
  userGUID: any;
  Miscellaneous_Date_ngModel: any;
  Miscellaneous_Description_ngModel: any;
  public assignedTo: any;
  public profileLevel: any;
  public stage: any;
  public profileJSON: any;
  claimFor: string = 'seg_customer';
  ImageUploadValidation:boolean=false;
  chooseFile: boolean = false;

  /********FORM EDIT VARIABLES***********/
  isFormEdit: boolean = false;
  claimRequestGUID: any;
  claimRequestData: any;

  constructor(public numberPipe: DecimalPipe, public profileMng: ProfileManagerProvider, fb: FormBuilder, private service: Services, public navCtrl: NavController,  public http: Http, public navParams: NavParams, public api: ApiManagerProvider) {
    this.userGUID = localStorage.getItem('g_USER_GUID');
    this.isFormEdit = this.navParams.get('isFormEdit');
    this.claimRequestGUID = this.navParams.get('cr_GUID'); //dynamic
    this.TenantGUID = localStorage.getItem('g_TENANT_GUID');
    if (this.isFormEdit)
      this.GetDataforEdit();
    else {
      this.LoadCustomers();
      this.LoadProjects();
    }
    this.MiscellaneousForm = fb.group({
      avatar: null,
      travel_date: ['', Validators.required],
      claimAmount: ['', Validators.required],
      description: ['', Validators.required], claimTypeGUID:'', attachment_GUID:''
    });   
  }  

  getCurrency(amount: number) {
    this.Miscellaneous_Amount_ngModel = this.numberPipe.transform(amount, '1.2-2');
  }

  imageURLEdit: any = null
  GetDataforEdit() {
    this.api.getApiModel('main_customer', 'filter=TENANT_GUID=' + this.TenantGUID)
      .subscribe(data => {
        this.storeCustomers = this.customers = data["resource"];
        this.api.getApiModel('soc_registration', 'filter=TENANT_GUID=' + this.TenantGUID)
          .subscribe(data => {
            this.storeProjects = this.projects = data["resource"];

            this.api.getApiModel('main_claim_request', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID)
              .subscribe(data => {
                this.claimRequestData = data["resource"];

                if (this.claimRequestData[0].ATTACHMENT_ID !== null)
                this.imageURLEdit = this.api.getImageUrl(this.claimRequestData[0].ATTACHMENT_ID);
                this.ImageUploadValidation = true;
                this.getCurrency(this.claimRequestData[0].MILEAGE_AMOUNT)

                if (this.claimRequestData[0].SOC_GUID === null) {
                  this.claimFor = 'seg_customer'
                  if (this.storeCustomers != undefined)
                    this.storeCustomers.forEach(element => {
                      if (element.CUSTOMER_GUID === this.claimRequestData[0].CUSTOMER_GUID) {
                        this.Customer_Lookup_ngModel = element.NAME
                      }
                    });
                }
                else {
                  this.claimFor = 'seg_project'
                  if (this.storeCustomers != undefined)
                    this.storeProjects.forEach(element => {
                      if (element.SOC_GUID === this.claimRequestData[0].SOC_GUID) {
                        this.Project_Lookup_ngModel = element.project_name
                        this.Miscellaneous_SOC_No_ngModel = element.soc
                      }
                    });
                }
                this.Miscellaneous_Date_ngModel = new Date(this.claimRequestData[0].TRAVEL_DATE).toISOString();
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
    // this.projects = null;
  }

  public CustomerLookup() {
    this.CustomerLookupClicked = true;
    // this.projects = null;
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
    this.http
      .get(Services.getUrl('soc_registration', 'filter=TENANT_GUID=' + this.TenantGUID))
      .map(res => res.json())
      .subscribe(data => {
      this.storeProjects=  this.projects = data["resource"];
        console.table(this.projects)
       console.table(this.storeProjects);
      });
  }

  LoadCustomers() {
    this.http
      .get(Services.getUrl('main_customer', 'filter=TENANT_GUID=' + this.TenantGUID))
      .map(res => res.json())
      .subscribe(data => {
        this.storeCustomers = this.customers = data["resource"];
        // console.table(this.projects)
      });
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

  onFileChange(event: any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
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
    this.chooseFile = true;

  }

  imageGUID: any;
  saveIm(formValues: any) {
    let uploadImage = this.UploadImage();
    uploadImage.then((resJson) => {
      //this.submitAction(this.uploadFileName, formValues);
      this.imageGUID = this.uploadFileName;
      this.chooseFile = false;
      this.ImageUploadValidation=true;      
    })    
  } 

  SaveImageinDB() {
    let objImage: ImageUpload_model = new ImageUpload_model();
    objImage.Image_Guid = UUID.UUID();
    objImage.IMAGE_URL = this.CloudFilePath + this.uploadFileName;
    objImage.CREATION_TS = new Date().toISOString();
    objImage.Update_Ts = new Date().toISOString();
    return new Promise((resolve, reject) => {
      this.api.postData('main_images', objImage.toJson(true)).subscribe((response) => {
        // let res = response.json();
        // let imageGUID = res["resource"][0].Image_Guid;
        resolve(objImage.toJson());
      })
    })
  }

  UploadImage() {   
      this.CloudFilePath = 'eclaim/'   
   
    this.loading = true;
    const queryHeaders = new Headers();
    queryHeaders.append('filename', this.uploadFileName);
    queryHeaders.append('Content-Type', 'multipart/form-data');
    queryHeaders.append('fileKey', 'file');
    queryHeaders.append('chunkedMode', 'false');
    queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
    const options = new RequestOptions({ headers: queryHeaders });
    return new Promise((resolve, reject) => {
      this.http.post('http://api.zen.com.my/api/v2/files/' + this.CloudFilePath + this.uploadFileName, this.MiscellaneousForm.get('avatar').value, options)
        .map((response) => {
          return response;
        }).subscribe((response) => {
          resolve(response.json());
        })
    })
  }
 
  clearFile() {
    this.MiscellaneousForm.get('avatar').setValue(null);
    console.log(this.fileInput);
    this.fileInput.nativeElement.value = '';
  }

  NavigateTravelClaim() {
    this.navCtrl.setRoot(TravelclaimPage);
  }

  submitAction(formValues: any) {
    if (this.isFormEdit) {
      this.api.getApiModel('main_claim_request', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID)
        .subscribe(data => {
          this.claimRequestData = data;
          this.claimRequestData["resource"][0].ATTACHMENT_ID =  this.imageGUID;
          this.claimRequestData["resource"][0].CLAIM_AMOUNT = formValues.claimAmount;
          this.claimRequestData["resource"][0].MILEAGE_AMOUNT = formValues.claimAmount;
          this.claimRequestData["resource"][0].TRAVEL_DATE = formValues.travel_date;
          this.claimRequestData["resource"][0].DESCRIPTION = formValues.description;
  
          if (this.isCustomer) {
            this.claimRequestData["resource"][0].CUSTOMER_GUID = this.Customer_GUID;
            this.claimRequestData["resource"][0].SOC_GUID = null;
          }
          else {
            this.claimRequestData["resource"][0].SOC_GUID =  this.Soc_GUID;
            this.claimRequestData["resource"][0].CUSTOMER_GUID = null;
          }
         this.api.updateApiModel('main_claim_request',this.claimRequestData).subscribe(res => 
          {
            alert('Claim details are submitted successfully.')
            this.navCtrl.push(UserclaimslistPage);
         });
        })
    }
    else {
   
    formValues.claimTypeGUID = '84b3cee2-9f9d-ccb9-89a1-1e70cef19f86';
    formValues.attachment_GUID =  this.imageGUID;
    formValues.soc_no = this.isCustomer ? this.Customer_GUID : this.Soc_GUID;
    this.travelAmount = formValues.claimAmount;
    this.profileMng.save(formValues, this.travelAmount, this.isCustomer)
    }
  }

}
