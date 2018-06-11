import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import * as constants from '../../app/config/constants';
import { OvertimeClaim_Model } from '../../models/overtimeclaim_model';
//import { MasterClaim_Model } from '../../models/masterclaim_model';
import { TravelclaimPage } from '../../pages/travel-claim/travel-claim.component';
import { View_SOC_Model } from '../../models/view_soc_model';
import { OvertimeClaim_Service } from '../../services/overtimeclaim_service';
import { BaseHttpService } from '../../services/base-http';
import { UUID } from 'angular2-uuid';
import { DecimalPipe } from '@angular/common';
import { Camera, CameraOptions } from '@ionic-native/camera';
//import {Camera} from 'ionic-native';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';

import { LoadingController, ActionSheetController, Platform, Loading, ToastController } from 'ionic-angular';
import { Services } from '../Services';
import { MainClaimReferanceModel } from '../../models/main-claim-ref.model';
import { MainClaimRequestModel } from '../../models/main-claim-request.model';
import { ImageUpload_model } from '../../models/image-upload.model';
import { ProfileManagerProvider } from '../../providers/profile-manager.provider';
import { ApiManagerProvider } from '../../providers/api-manager.provider';
import { UserclaimslistPage } from '../../pages/userclaimslist/userclaimslist';

@IonicPage()
@Component({
  selector: 'page-overtimeclaim',
  templateUrl: 'overtimeclaim.html', providers: [OvertimeClaim_Service, BaseHttpService, FileTransfer, DecimalPipe]
})
export class OvertimeclaimPage { 
  
   OTform: FormGroup;
   uploadFileName: string;
   loading = false;
   CloudFilePath: string;
   @ViewChild('fileInput') fileInput: ElementRef;
  vehicles: any;
  customers: any;
  storeProjects: any[];
  storeCustomers: any[];  
  public projects: any;
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
  claimFor: string = 'seg_customer';

  userGUID: any;
  public socGUID : any;
  public AddTravelClicked: boolean = false;
  ProjectLookupClicked: boolean = false;
  CustomerLookupClicked: boolean = false;
  DestinationPlaceID: string;
  OriginPlaceID: string;
  public AddLookupClicked: boolean = false;
  public AddToLookupClicked: boolean = false;
  currentItems: any;
  public MainClaimSaved: boolean = false;
  Start_DT_ngModel: any;
  End_DT_ngModel: any;  
  VehicleId: any;
  VehicleRate: any;
  travelAmount: any;
  validDate = new Date().toISOString();
  ClaimRequestMain: any;
  isCustomer: boolean = true;
  ImageUploadValidation:boolean=false;
  chooseFile: boolean = false;

   /********FORM EDIT VARIABLES***********/
   isFormEdit: boolean = false;
   claimRequestGUID: any;
   claimRequestData: any;

  //  ngOnInit(): void {
  //    this.userGUID = localStorage.getItem('g_USER_GUID'); 
  //    this.isFormEdit = this.navParams.get('isFormEdit');
  //     this.claimRequestGUID = this.navParams.get('cr_GUID'); //dynamic
  //    //this.claimRequestGUID = 'aa124ed8-5c2d-4c39-d3bd-066857c45617';
  //    if (this.isFormEdit)
  //      this.GetDataforEdit();
  //  }

  getCurrency(amount: number) {
    this.OT_Amount_ngModel = this.numberPipe.transform(amount, '1.2-2');
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
                        this.OT_SOC_No_ngModel = element.soc
                      }
                    });
                }
                this.Start_DT_ngModel = new Date(this.claimRequestData[0].START_TS).toISOString();
                this.End_DT_ngModel = new Date(this.claimRequestData[0].END_TS).toISOString();
                // this.OT_Amount_ngModel = this.claimRequestData[0].MILEAGE_AMOUNT;
                this.OT_Description_ngModel = this.claimRequestData[0].DESCRIPTION;
              }
              );
          });
      })
  }

  constructor(public numberPipe: DecimalPipe, private apiMng: ApiManagerProvider,public profileMng: ProfileManagerProvider, platform: Platform, public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, private api: Services, public translate: TranslateService, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private overtimeservice: OvertimeClaim_Service, private alertCtrl: AlertController, private camera: Camera, public actionSheetCtrl: ActionSheetController, private loadingCtrl: LoadingController, private file: File, private filePath: FilePath, private transfer: FileTransfer, public toastCtrl: ToastController) {
    this.TenantGUID = localStorage.getItem('g_TENANT_GUID');   
    this.isFormEdit = this.navParams.get('isFormEdit');
    this.claimRequestGUID = this.navParams.get('cr_GUID'); //dynamic
    if (this.isFormEdit)
      this.GetDataforEdit();
    else {
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
      attachment_GUID : '',  claimTypeGUID: '',
    });   
  }

  onFileChange(event: any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.OTform.get('avatar').setValue(file);
      this.uploadFileName = file.name;
      reader.onload = () => {
        this.OTform.get('avatar').setValue({
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
      // this.submitAction(this.uploadFileName, formValues);
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
    this.http.post('http://api.zen.com.my/api/v2/files/' + this.CloudFilePath + this.uploadFileName, this.OTform.get('avatar').value, options)
      .map((response) => {
        return response;
      }).subscribe((response) => {
        resolve(response.json());
      })
  })
}

  GetSocNo(item: any){
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
    this.http
      .get(Services.getUrl('soc_registration', 'filter=TENANT_GUID=' + this.TenantGUID))
      .map(res => res.json())
      .subscribe(data => {
      this.storeProjects=  this.projects = data["resource"];
        console.table(this.projects)
      });
  }

  LoadCustomers() {
    this.http
      .get(Services.getUrl('main_customer', 'filter=TENANT_GUID=' + this.TenantGUID))
      .map(res => res.json())
      .subscribe(data => {
        this.storeCustomers = this.customers = data["resource"];
        // console.table(this.projects)
      }
      );
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
   
    // this.projects = null;
  }

  public CustomerLookup() {
    this.CustomerLookupClicked = true;
    // this.projects = null;
  }

  searchProject(searchString: any) {
    let val = searchString.target.value;
    if (!val || !val.trim()) {
      this.projects = this.storeProjects;
      return;
    }
  //  this.projects=  this.filterProjects({
  //   project_name: val
  //   });
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

  clearFile() {
    this.OTform.get('avatar').setValue(null);
    this.fileInput.nativeElement.value = '';
  }

  allowanceGUID: any;
  onAllowanceSelect(allowance: any) {
    this.allowanceGUID = allowance.ALLOWANCE_GUID;
  }

  submitAction(formValues: any) {
    if (this.isFormEdit) {
      this.apiMng.getApiModel('main_claim_request', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID)
        .subscribe(data => {
          this.claimRequestData = data;
          this.claimRequestData["resource"][0].ATTACHMENT_ID = this.imageGUID;
          this.claimRequestData["resource"][0].CLAIM_AMOUNT = formValues.claim_amount;
          this.claimRequestData["resource"][0].MILEAGE_AMOUNT = formValues.claim_amount;
          this.claimRequestData["resource"][0].TRAVEL_DATE = formValues.travel_date;
          this.claimRequestData["resource"][0].DESCRIPTION = formValues.description;
          this.claimRequestData["resource"][0].START_TS = formValues.start_DT;
          this.claimRequestData["resource"][0].END_TS = formValues.end_DT;
          //this.claimRequestData[0].claim_amount= formValues.claim_amount;
          if (this.isCustomer) {
            this.claimRequestData["resource"][0].CUSTOMER_GUID = this.Customer_GUID;
            this.claimRequestData["resource"][0].SOC_GUID = null;
          }
          else {
            this.claimRequestData["resource"][0].SOC_GUID =  this.Soc_GUID;
            this.claimRequestData["resource"][0].CUSTOMER_GUID = null;
          }
          //this.claimRequestData[0].STATUS = 'Pending';
         // this.apiMng.updateMyClaimRequest(this.claimRequestData[0]).subscribe(res => alert('Claim details are submitted successfully.'))
         this.apiMng.updateApiModel('main_claim_request',this.claimRequestData).subscribe(res =>{
            alert('Claim details are submitted successfully.')
            this.navCtrl.push(UserclaimslistPage);
         });
        })
    }
    else {
   
    formValues.claimTypeGUID = '37067b3d-1bf4-33a3-2b60-3ca40baf589a';
    formValues.travel_date = formValues.start_DT;
    formValues.attachment_GUID =  this.imageGUID;
    this.travelAmount = formValues.claim_amount;
    formValues.soc_no = this.isCustomer ? this.Customer_GUID : this.Soc_GUID;
    this.profileMng.save(formValues, this.travelAmount, this.isCustomer)
    }
  }

  NavigateTravelClaim() {
    this.navCtrl.setRoot(TravelclaimPage); 
  } 
}
