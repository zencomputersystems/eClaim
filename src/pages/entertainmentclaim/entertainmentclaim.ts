import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import * as constants from '../../app/config/constants';
import { EntertainmentClaim_Model } from '../../models/entertainmentclaim_model';
//import { MasterClaim_Model } from '../../models/masterclaim_model';
import { EntertainmentClaim_Service } from '../../services/entertainmentclaim_service';
import { BaseHttpService } from '../../services/base-http';
import { UUID } from 'angular2-uuid';
import { DecimalPipe } from '@angular/common';

import { View_SOC_Model } from '../../models/view_soc_model';

//import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';

import { LoadingController, ActionSheetController, Platform, Loading, ToastController } from 'ionic-angular';
import { Services } from '../Services';
import { MainClaimReferanceModel } from '../../models/main-claim-ref.model';
import { MainClaimRequestModel } from '../../models/main-claim-request.model';
//import { ClaimReqMain_Model } from '../../models/ClaimReqMain_Model';
import { ImageUpload_model } from '../../models/image-upload.model';
import { ProfileManagerProvider } from '../../providers/profile-manager.provider';
import { ApiManagerProvider } from '../../providers/api-manager.provider';
import { UserclaimslistPage } from '../../pages/userclaimslist/userclaimslist';
import { TravelclaimPage } from '../../pages/travel-claim/travel-claim.component';

@IonicPage()
@Component({
  selector: 'page-entertainmentclaim',
  templateUrl: 'entertainmentclaim.html', providers: [EntertainmentClaim_Service, BaseHttpService, FileTransfer, DecimalPipe]
})
export class EntertainmentclaimPage {

  Entertainmentform: FormGroup;
  uploadFileName: string;
  loading = false;
  CloudFilePath: string;
  @ViewChild('fileInput') fileInput: ElementRef;
  travel_date: any;
  TenantGUID: any;
  mainClaimReq: MainClaimRequestModel = new MainClaimRequestModel();

  storeProjects: any[];
  public projects: any[];
  customers: any;
  storeCustomers: any[];
  vehicles: any[];
  userGUID: any;

  public assignedTo: any;
  public profileLevel: any;
  public stage: any;
  public profileJSON: any;

  public Entertainment_SOC_No_ngModel: any;
  public Entertainment_ProjectName_ngModel: any;
  public Entertainment_Mode_ngModel: any;
  Entertainment_Amount_ngModel: any;
  Project_Lookup_ngModel: any;
  Travel_Customer_ngModel: any;
  Customer_Lookup_ngModel: any;
  Customer_GUID: any;
  Soc_GUID: any;
  Entertainment_Date_ngModel: any;
  Entertainment_Description_ngModel: any;
  claimFor: string = 'seg_customer';

  public socGUID: any;
  public AddTravelClicked: boolean = false;
  ProjectLookupClicked: boolean = false;
  CustomerLookupClicked: boolean = false;
  public AddLookupClicked: boolean = false;
  public AddToLookupClicked: boolean = false;
  currentItems: any;
  public MainClaimSaved: boolean = false;
  travelAmount: any;
  validDate = new Date().toISOString();
  isCustomer: boolean = true;  
  ClaimRequestMainId: any;
  ImageUploadValidation:boolean=false;
  chooseFile: boolean = false;


  /********FORM EDIT VARIABLES***********/
  isFormEdit: boolean = false;
  claimRequestGUID: any;
  claimRequestData:any; 

  constructor(public numberPipe: DecimalPipe, public apiMng: ApiManagerProvider, public profileMng: ProfileManagerProvider, platform: Platform, public navCtrl: NavController, public viewCtrl: ViewController, private api: Services, public navParams: NavParams, public translate: TranslateService, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private entertainmentservice: EntertainmentClaim_Service, private alertCtrl: AlertController,  public actionSheetCtrl: ActionSheetController, private loadingCtrl: LoadingController, private file: File, private filePath: FilePath, private transfer: FileTransfer, public toastCtrl: ToastController) {
    this.userGUID = localStorage.getItem('g_USER_GUID');
    this.isFormEdit = this.navParams.get('isFormEdit');
    this.claimRequestGUID = this.navParams.get('cr_GUID'); //dynamic
    this.TenantGUID = localStorage.getItem('g_TENANT_GUID');
    if (this.isFormEdit)
      this.GetDataforEdit();
      //this.modifiedImage();
    else {
      this.LoadCustomers();
      this.LoadProjects();
    }
    // if (this.isFormEdit)
    //   this.modifiedImage();
    //   //this.modifiedImage();
    // else {
    //   this.LoadCustomers();
    //   this.LoadProjects();
    // }
    //this.modifiedImage();
    this.Entertainmentform = fb.group({
      avatar: null,
      soc_no: '',
      travel_date: ['', Validators.required],
      description: ['', Validators.required],
      claim_amount: ['', Validators.required],
      claimTypeGUID: '',
      attachment_GUID : ''  
    });   
  }

  getCurrency(amount: number) {
    this.Entertainment_Amount_ngModel = this.numberPipe.transform(amount, '1.2-2');
  }
 
  imageURLEdit: any = null
  GetDataforEdit() {
    this.apiMng.getApiModel('main_customer', 'filter=TENANT_GUID=' + this.TenantGUID)
      .subscribe(data => {
        this.storeCustomers = this.customers = data["resource"];
        this.apiMng.getApiModel('soc_registration', 'filter=TENANT_GUID=' + this.TenantGUID)
          .subscribe(data => {
            this.storeProjects = this.projects = data["resource"];

            this.apiMng.getApiModel('main_claim_request', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID)
              .subscribe(data => {
                this.claimRequestData = data["resource"];

                if (this.claimRequestData[0].ATTACHMENT_ID !== null)
                this.imageURLEdit = this.apiMng.getImageUrl(this.claimRequestData[0].ATTACHMENT_ID);
                this.ImageUploadValidation = true;
                this.getCurrency(this.claimRequestData[0].MILEAGE_AMOUNT)

                // if (this.claimRequestData[0].ATTACHMENT_ID !== null)
                // this.editImage = this.apiMng.getImageUrl(this.claimRequestData[0].ATTACHMENT_ID);
                //  this.ImageUploadValidation = true;

                // if (this.claimRequestData[0].ATTACHMENT_ID !== null)
                // this.imageURLEdit = this.apiMng.getImageUrl(this.claimRequestData[0].ATTACHMENT_ID);
                // this.ImageUploadValidation = true;

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
                        this.Entertainment_SOC_No_ngModel = element.soc
                      }
                    });
                }
                this.Entertainment_Date_ngModel = new Date(this.claimRequestData[0].TRAVEL_DATE).toISOString();
                // this.Entertainment_Amount_ngModel = this.claimRequestData[0].MILEAGE_AMOUNT;
                this.Entertainment_Description_ngModel = this.claimRequestData[0].DESCRIPTION;
              });
          });
      })
  }  

  GetSocNo(item: any) {
    this.Entertainment_SOC_No_ngModel = item.soc;
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
    this.http
      .get(Services.getUrl('soc_registration', 'filter=TENANT_GUID=' + this.TenantGUID))
      .map(res => res.json())
      .subscribe(data => {
        this.storeProjects = this.projects = data["resource"];
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
    // this.projects = this.filterProjects({
    //   project_name: val
    // });
  }

  searchCustomer(searchString: any) {
    let val = searchString.target.value;
    if (!val || !val.trim()) {
      this.customers = this.storeCustomers;
      return;
    }
    // this.customers = this.filterCustomer({
    //   NAME: val
    // });
  } 

  // editImage: any =null
  // modifiedImage(){
  //   this.apiMng.getApiModel('main_claim_request', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID)
  //   .subscribe(data => {
  //     this.claimRequestData = data["resource"];
  //     if (this.claimRequestData[0].ATTACHMENT_ID !== null)
  //     this.editImage = this.apiMng.getImageUrl(this.claimRequestData[0].ATTACHMENT_ID);
  //   });
  // }

  //selectedImage: any =null
  onFileChange(event: any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.Entertainmentform.get('avatar').setValue(file);
      this.uploadFileName = file.name;
      reader.onload = () => {
        this.Entertainmentform.get('avatar').setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result.split(',')[1]
        });
      };
    }
    // this.ImageUploadValidation=true;
    this.chooseFile = true;
  }

  imageGUID: any;
  saveIm() {
    let uploadImage = this.UploadImage();
    uploadImage.then((resJson) => {

      // this.submitAction(this.uploadFileName, formValues);
      this.imageGUID = this.uploadFileName;
      this.chooseFile = false;
      this.ImageUploadValidation=true;
    })   
  }

  // SaveImageinDB() {
  //   let objImage: ImageUpload_model = new ImageUpload_model();
  //   objImage.Image_Guid = UUID.UUID();
  //   objImage.IMAGE_URL = this.CloudFilePath + this.uploadFileName;
  //   objImage.CREATION_TS = new Date().toISOString();
  //   objImage.Update_Ts = new Date().toISOString();
  //   return new Promise((resolve, reject) => {
  //     this.api.postData('main_images', objImage.toJson(true)).subscribe((response) => {
  //       // let res = response.json();
  //       // let imageGUID = res["resource"][0].Image_Guid;
  //       resolve(objImage.toJson());
  //     })
  //   })
  // }

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
      this.http.post('http://api.zen.com.my/api/v2/files/' + this.CloudFilePath + this.uploadFileName, this.Entertainmentform.get('avatar').value, options)
        .map((response) => {
          return response;
        }).subscribe((response) => {
          resolve(response.json());
        })
    })
  }

  clearFile() {
    this.Entertainmentform.get('avatar').setValue(null);
    console.log(this.fileInput);
    this.fileInput.nativeElement.value = '';
  }  

  // submitAction(imageGUID: any,formValues: any) {
  //   //let claimReqMainRef: ClaimReqMain_Model = new ClaimReqMain_Model();
  //   formValues.claimTypeGUID = 'f3217ecc-19d7-903a-6c56-78fdbd7bbcf1';    
  //   formValues.attachment_GUID = imageGUID;   
  //   this.travelAmount = formValues.claim_amount;
  //   formValues.soc_no = this.isCustomer ? this.Customer_GUID : this.Soc_GUID;
  //   this.profileMng.save(formValues, this.travelAmount, this.isCustomer)
  // }

  submitAction(formValues: any) {
    //let claimReqMainRef: ClaimReqMain_Model = new ClaimReqMain_Model();
    // let claimRequestDataModel: MainClaimRequestModel = new MainClaimRequestModel();    
    if (this.isFormEdit) {
      this.apiMng.getApiModel('main_claim_request', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID)
        .subscribe(data => {
          this.claimRequestData = data;
          this.claimRequestData["resource"][0].ATTACHMENT_ID =  this.imageGUID ;
          this.claimRequestData["resource"][0].CLAIM_AMOUNT = formValues.claim_amount;
          this.claimRequestData["resource"][0].MILEAGE_AMOUNT = formValues.claim_amount;
          this.claimRequestData["resource"][0].TRAVEL_DATE = formValues.travel_date;
          this.claimRequestData["resource"][0].DESCRIPTION = formValues.description;

          //this.claimRequestData[0].claim_amount= formValues.claim_amount;
          if (this.isCustomer) {
            this.claimRequestData["resource"][0].CUSTOMER_GUID =this.Customer_GUID;
            this.claimRequestData["resource"][0].SOC_GUID = null;
          }
          else {
            this.claimRequestData["resource"][0].SOC_GUID =  this.Soc_GUID;
            this.claimRequestData["resource"][0].CUSTOMER_GUID = null;
          }
          //this.claimRequestData[0].STATUS = 'Pending';
         // this.apiMng.updateMyClaimRequest(this.claimRequestData[0]).subscribe(res => alert('Claim details are submitted successfully.'))
         this.apiMng.updateApiModel('main_claim_request',this.claimRequestData).subscribe(res => 
          {
            alert('Claim details are submitted successfully.')
            this.navCtrl.push(UserclaimslistPage);
         });
        })
    }
    else {
      formValues.claimTypeGUID = 'f3217ecc-19d7-903a-6c56-78fdbd7bbcf1';
<<<<<<< HEAD
      formValues.attachment_GUID = imageGUID;
=======
      //formValues.meal_allowance = this.allowanceGUID;
      formValues.attachment_GUID =  this.imageGUID ;
>>>>>>> master
      this.travelAmount = formValues.claim_amount;
      formValues.soc_no = this.isCustomer ? this.Customer_GUID : this.Soc_GUID;
      this.profileMng.save(formValues, this.travelAmount, this.isCustomer)
    }
  }
  NavigateTravelClaim() {
    this.navCtrl.setRoot(TravelclaimPage); 
  } 
} 
