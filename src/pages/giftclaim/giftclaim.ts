import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import * as constants from '../../app/config/constants';
import { GiftClaim_Model } from '../../models/giftclaim_model';
//import { MasterClaim_Model } from '../../models/masterclaim_model';
import { GiftClaim_Service } from '../../services/giftclaim_service';
import { BaseHttpService } from '../../services/base-http';
import { UUID } from 'angular2-uuid';
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
  selector: 'page-giftclaim',
  templateUrl: 'giftclaim.html', providers: [GiftClaim_Service, BaseHttpService, FileTransfer]
})
export class GiftclaimPage {  
    Giftform: FormGroup; 
    uploadFileName: string;
    loading = false;
    CloudFilePath: string;
    @ViewChild('fileInput') fileInput: ElementRef;
    customers: any;
    storeProjects: any[];
    storeCustomers: any[];  
    public projects: any;     
    items: string[];  
  
    public Gift_SOC_No_ngModel: any;
    public Gift_ProjectName_ngModel: any;  
    Gift_Date_ngModel: any;
    Gift_Description_ngModel: any;    
    Gift_Amount_ngModel: any;
    Project_Lookup_ngModel: any;
    Gift_Customer_ngModel: any;
    Customer_Lookup_ngModel: any;
    Customer_GUID: any;
    Soc_GUID: any;
    TenantGUID: any;
    
    userGUID: any;
    public assignedTo: any;
    public profileLevel: any; 
    public stage: any;
    public profileJSON: any;   
  
    public socGUID : any;
    public AddTravelClicked: boolean = false;
    ProjectLookupClicked: boolean = false;
    CustomerLookupClicked: boolean = false;    
    public AddLookupClicked: boolean = false;
    public AddToLookupClicked: boolean = false;
    currentItems: any;
    public MainClaimSaved: boolean = false;   
    claimFor: string = 'seg_customer';
    VehicleId: any;
    travelAmount: any;
    validDate = new Date().toISOString();
    ClaimRequestMain: any;
    isCustomer: boolean = true;

     /********FORM EDIT VARIABLES***********/
   isFormEdit: boolean = false;
   claimRequestGUID: any;
   claimRequestData: any;
   ngOnInit(): void {
     this.userGUID = localStorage.getItem('g_USER_GUID');
 
     this.isFormEdit = this.navParams.get('isFormEdit');
      this.claimRequestGUID = this.navParams.get('cr_GUID'); //dynamic
     //this.claimRequestGUID = 'aa124ed8-5c2d-4c39-d3bd-066857c45617';
     if (this.isFormEdit)
       this.GetDataforEdit();
   }

   GetDataforEdit() {
    this.http
      .get(Services.getUrl('main_claim_request', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID))
      .map(res => res.json())
      .subscribe(data => {
        this.claimRequestData = data["resource"];
        console.log(this.claimRequestData)
        if (this.claimRequestData[0].SOC_GUID === null) {
          this.claimFor = 'customer'
          this.storeCustomers.forEach(element => {
            if (element.CUSTOMER_GUID === this.claimRequestData[0].CUSTOMER_GUID) {
              this.Customer_Lookup_ngModel = element.NAME
            }
          });
        }
        else {
          this.claimFor = 'project'
          this.storeProjects.forEach(element => {
            if (element.SOC_GUID === this.claimRequestData[0].SOC_GUID) {
              this.Project_Lookup_ngModel = element.project_name
              this.Gift_SOC_No_ngModel = element.soc
            }
          });
        }       
        this.Gift_Date_ngModel = new Date(this.claimRequestData[0].TRAVEL_DATE).toISOString();  
        // this.travelAmount = this.claimRequestData[0].MILEAGE_AMOUNT;
        this.Gift_Amount_ngModel = this.claimRequestData[0].MILEAGE_AMOUNT;
        this.Gift_Description_ngModel = this.claimRequestData[0].DESCRIPTION;
        // this.vehicles.forEach(element => {
        //   if (element.MILEAGE_GUID === this.claimRequestData[0].MILEAGE_GUID) {
        //     this.Travel_Mode_ngModel = element.CATEGORY
        //   }
        // });       
      }
      );
  }

    constructor(private apiMng: ApiManagerProvider,public profileMng: ProfileManagerProvider, platform: Platform, public navCtrl: NavController, public viewCtrl: ViewController, public translate: TranslateService, public navParams: NavParams, private api: Services, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private giftservice: GiftClaim_Service, private alertCtrl: AlertController, private camera: Camera, public actionSheetCtrl: ActionSheetController, private loadingCtrl: LoadingController, private file: File, private filePath: FilePath, private transfer: FileTransfer, public toastCtrl: ToastController) 
    { 
      this.TenantGUID = localStorage.getItem('g_TENANT_GUID'); 
  this.translateToEnglish();
  this.translate.setDefaultLang('en'); //Fallback language
  platform.ready().then(() => {
  });

  this.Giftform = fb.group({ 
    avatar: null,
    soc_no: '',
    //distance: '', 
    //customer: '',
    //project_name: ['', Validators.required],     
    travel_date:  ['', Validators.required],
    description: ['', Validators.required],
    claim_amount: ['', Validators.required],
    attachment_GUID : ''
   
    // distance: ['', Validators.required],
     //claim_amount: ['', Validators.required],
    //total_amount: ['', Validators.required],

  });
  // this.Travel_Date_ngModel = new Date().toISOString();
  //this.GetSocNo();
  //this.entertainment_entry.UPDATE_TS = new Date().toISOString();
  // this.Travelform.valueChanges.subscribe((v) => {
  //   this.isReadyToSave = this.Travelform.valid;
  // });
  this.LoadProjects();
  this.LoadCustomers();
  //this.readProfile();
}

onFileChange(event: any) {
  const reader = new FileReader();
  if (event.target.files && event.target.files.length > 0) {
    const file = event.target.files[0];
    this.Giftform.get('avatar').setValue(file);
    this.uploadFileName = file.name;
    reader.onload = () => {
      this.Giftform.get('avatar').setValue({
        filename: file.name,
        filetype: file.type,
        value: reader.result.split(',')[1]
      });
    };
  }
}

GetSocNo(item: any){
  this.Gift_SOC_No_ngModel = item.soc;
  this.Project_Lookup_ngModel = item.project_name;
  this.Soc_GUID = item.SOC_GUID;
  this.CloseProjectLookup();
}

GetCustomer(guid: any, name: any) {
  this.Customer_Lookup_ngModel = name;
  this.Customer_GUID = guid;
  this.CloseCustomerLookup();
}

 //---------------------Language module start---------------------//
 public translateToMalayClicked: boolean = false;
 public translateToEnglishClicked: boolean = true;

 public translateToEnglish() {
   this.translate.use('en');
   this.translateToMalayClicked = !this.translateToMalayClicked;
   this.translateToEnglishClicked = !this.translateToEnglishClicked;
 }

 public translateToMalay() {
   this.translate.use('ms');
   this.translateToEnglishClicked = !this.translateToEnglishClicked;
   this.translateToMalayClicked = !this.translateToMalayClicked;
 }
 //---------------------Language module end---------------------//

 onSubmit() {
  this.loading = true;
  const queryHeaders = new Headers();
  queryHeaders.append('filename', this.uploadFileName);
  queryHeaders.append('Content-Type', 'multipart/form-data');
  queryHeaders.append('fileKey', 'file');
  queryHeaders.append('chunkedMode', 'false');
  queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
  const options = new RequestOptions({ headers: queryHeaders });
  this.http.post('http://api.zen.com.my/api/v2/files/' + this.uploadFileName, this.Giftform.get('avatar').value, options)
    .map((response) => {
      return response;
    }).subscribe((response) => {
      alert(response.status);
    });
  setTimeout(() => {
    alert('done');
    this.loading = false;
  }, 1000);
}

saveIm(formValues: any) {
  let uploadImage = this.UploadImage();
  uploadImage.then((resJson) => {
    console.table(resJson)
    let imageResult = this.SaveImageinDB();
    imageResult.then((objImage: ImageUpload_model) => {
      // console.table(objImage)
      let result = this.submitAction(objImage.Image_Guid, formValues);
      // result.then((res) => {
      //   // console.log(res);
       
      // })
    })
  })
  // setTimeout(() => {
  //   this.loading = false;
  // }, 1000);
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
  this.http.post('http://api.zen.com.my/api/v2/files/' + this.CloudFilePath + this.uploadFileName, this.Giftform.get('avatar').value, options)
    .map((response) => {
      return response;
    }).subscribe((response) => {
      resolve(response.json());
    })
})
}

 claimForChanged() {
  // console.log(this.claimFor)
  if (this.claimFor == 'customer') this.isCustomer = true;
  else this.isCustomer = false;
}


LoadProjects() {
  this.http
    .get(Services.getUrl('soc_registration', 'filter=TENANT_GUID=' + this.TenantGUID))
    .map(res => res.json())
    .subscribe(data => {
    this.storeProjects=  this.projects = data["resource"];
      console.table(this.projects)
    }
    );
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
  this.Giftform.get('avatar').setValue(null);
  this.fileInput.nativeElement.value = '';
}

allowanceGUID: any;
onAllowanceSelect(allowance: any) {
  this.allowanceGUID = allowance.ALLOWANCE_GUID;
}

submitAction(imageGUID: any,formValues: any) {
  debugger;
  // alert(JSON.parse(formValues) )     
  if (this.isFormEdit) {
    this.apiMng.getApiModel('main_claim_request', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID)
      .subscribe(data => {
        this.claimRequestData = data;
        this.claimRequestData["resource"][0].ATTACHMENT_ID = imageGUID;
        this.claimRequestData["resource"][0].CLAIM_AMOUNT = formValues.claim_amount;
        this.claimRequestData["resource"][0].MILEAGE_AMOUNT = formValues.claim_amount;
        this.claimRequestData["resource"][0].TRAVEL_DATE = formValues.travel_date;
        this.claimRequestData["resource"][0].DESCRIPTION = formValues.description;

        //this.claimRequestData[0].claim_amount= formValues.claim_amount;
        if (this.isCustomer) {
          this.claimRequestData["resource"][0].CUSTOMER_GUID = this.Customer_GUID ;
          this.claimRequestData["resource"][0].SOC_GUID = null;
        }
        else {
          this.claimRequestData["resource"][0].SOC_GUID = this.Soc_GUID;
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
  formValues.claimTypeGUID = '2d8d7c80-c9ae-9736-b256-4d592e7b7887';
  formValues.meal_allowance = this.allowanceGUID;
  formValues.attachment_GUID = imageGUID;       
  this.travelAmount = formValues.claim_amount;
  formValues.soc_no = this.isCustomer ? this.Customer_GUID : this.Soc_GUID;
  this.profileMng.save(formValues, this.travelAmount, this.isCustomer)
  }
}


  // save(imageGUID: string) {
  //   let claimReqMainRef: ClaimReqMain_Model = new ClaimReqMain_Model();
  //   let userGUID = localStorage.getItem('g_USER_GUID');
  //   let tenantGUID = localStorage.getItem('g_TENANT_GUID');
  //   let month = new Date(this.Gift_Date_ngModel).getMonth() + 1;
  //   let year = new Date(this.Gift_Date_ngModel).getFullYear();
  //   let claimRefGUID;
  //   let url = Services.getUrl('main_claim_ref', 'filter=(USER_GUID=' + userGUID + ')AND(MONTH=' + month + ')AND(YEAR=' + year + ')');
  //   this.http
  //     .get(url)
  //     .map(res => res.json())
  //     .subscribe(claimRefdata => {
  //       if (claimRefdata["resource"][0] == null) {
  //         let claimReqRef: ClaimRefMain_Model = new ClaimRefMain_Model();
  //         claimReqRef.CLAIM_REF_GUID = UUID.UUID();
  //         claimReqRef.USER_GUID = userGUID;
  //         claimReqRef.TENANT_GUID = tenantGUID;
  //         claimReqRef.REF_NO = userGUID + '/' + month + '/' + year;
  //         claimReqRef.MONTH = month;
  //         claimReqRef.YEAR = year;
  //         claimReqRef.CREATION_TS = new Date().toISOString();
  //         claimReqRef.UPDATE_TS = new Date().toISOString();

  //         this.api.postData('main_claim_ref', claimReqRef.toJson(true)).subscribe((response) => {
  //           var postClaimRef = response.json();
  //           claimRefGUID = postClaimRef["resource"][0].CLAIM_REF_GUID;

  //           // let claimReqMainRef: ClaimReqMain_Model = new ClaimReqMain_Model();
  //           claimReqMainRef.CLAIM_REQUEST_GUID = UUID.UUID();
  //           claimReqMainRef.TENANT_GUID = tenantGUID;
  //           claimReqMainRef.CLAIM_REF_GUID = claimRefGUID;
  //           claimReqMainRef.MILEAGE_GUID = this.VehicleId;
  //           claimReqMainRef.CLAIM_TYPE_GUID = '2d8d7c80-c9ae-9736-b256-4d592e7b7887';
  //           claimReqMainRef.TRAVEL_DATE = this.Gift_Date_ngModel;
  //           // claimReqMainRef.START_TS = value.start_DT;
  //           // claimReqMainRef.END_TS = value.end_DT;
  //           claimReqMainRef.DESCRIPTION =this.Gift_Description_ngModel;
  //           claimReqMainRef.ASSIGNED_TO = this.assignedTo;         
  //           claimReqMainRef.PROFILE_LEVEL = this.profileLevel;
  //           claimReqMainRef.PROFILE_JSON = this.profileJSON;
  //           claimReqMainRef.STATUS = 'Pending';
  //           claimReqMainRef.STAGE = this.stage;
  //           claimReqMainRef.ATTACHMENT_ID = imageGUID;
  //           // claimReqMainRef.MILEAGE_AMOUNT = this.Travel_Amount_ngModel
  //           claimReqMainRef.CLAIM_AMOUNT = this.Gift_Amount_ngModel;
  //           claimReqMainRef.CREATION_TS = new Date().toISOString();
  //           claimReqMainRef.UPDATE_TS = new Date().toISOString();
  //           // claimReqMainRef.FROM = this.Travel_From_ngModel;
  //           // claimReqMainRef.DESTINATION = this.Travel_Destination_ngModel;
  //           // claimReqMainRef.DISTANCE_KM = this.Travel_Distance_ngModel;
  //          // claimReqMainRef.SOC_GUID = this.Travel_SOC_No_ngModel;
  //          if(this.isCustomer){
  //           claimReqMainRef.CUSTOMER_GUID = this.Customer_GUID ;
  //         }
  //         else{
  //           claimReqMainRef.SOC_GUID = this.Soc_GUID;
  //         }
  //         // claimReqMainRef.CUSTOMER_GUID = this.isCustomer ? this.Customer_GUID : this.Soc_GUID;
  //         // claimReqMainRef.SOC_GUID = this.isCustomer ? this.Customer_GUID : this.Soc_GUID;

  //           // this.api.postData('main_claim_request', claimReqMainRef.toJson(true)).subscribe((response) => {
  //           //   var postClaimMain = response.json();
  //           //   this.ClaimRequestMain = postClaimMain["resource"][0].CLAIM_REQUEST_GUID;
  //           //   this.MainClaimSaved = true;
  //           //   alert('Claim Has Registered.')
  //           // })
  //         })
  //         return new Promise((resolve, reject) => {
  //           this.api.postData('main_claim_request', claimReqMainRef.toJson(true)).subscribe((data) => {
             
  //             let res = data.json();
  //             console.log(res)
  //             let ClaimRequestMainId = res["resource"][0].CLAIM_REQUEST_GUID;
  //             resolve(ClaimRequestMainId);
  //           })
  //         });
  //       }
  //       else {
  //         claimRefGUID = claimRefdata["resource"][0].CLAIM_REF_GUID;

  //         let claimReqMainRef: ClaimReqMain_Model = new ClaimReqMain_Model();
  //         claimReqMainRef.CLAIM_REQUEST_GUID = UUID.UUID();
  //         claimReqMainRef.TENANT_GUID = tenantGUID;
  //         claimReqMainRef.CLAIM_REF_GUID = claimRefGUID;
  //         claimReqMainRef.MILEAGE_GUID = this.VehicleId;
  //         claimReqMainRef.CLAIM_TYPE_GUID = '2d8d7c80-c9ae-9736-b256-4d592e7b7887';
  //         claimReqMainRef.TRAVEL_DATE = this.Gift_Date_ngModel;
  //         // claimReqMainRef.START_TS = value.start_DT;
  //         // claimReqMainRef.END_TS = value.end_DT;
  //         claimReqMainRef.DESCRIPTION = this.Gift_Description_ngModel;
  //         claimReqMainRef.ASSIGNED_TO = this.assignedTo;         
  //         claimReqMainRef.PROFILE_LEVEL = this.profileLevel;
  //         claimReqMainRef.PROFILE_JSON = this.profileJSON;
  //         claimReqMainRef.STATUS = 'Pending';
  //         claimReqMainRef.STAGE = this.stage;
  //         claimReqMainRef.ATTACHMENT_ID = imageGUID;
  //         // claimReqMainRef.MILEAGE_AMOUNT = this.Travel_Amount_ngModel;
  //         claimReqMainRef.CLAIM_AMOUNT = this.Gift_Amount_ngModel;
  //         claimReqMainRef.CREATION_TS = new Date().toISOString();
  //         claimReqMainRef.UPDATE_TS = new Date().toISOString();
  //         // claimReqMainRef.FROM = this.Travel_From_ngModel;
  //         // claimReqMainRef.DESTINATION = this.Travel_Destination_ngModel;
  //         // claimReqMainRef.DISTANCE_KM = this.Travel_Distance_ngModel;
  //         //claimReqMainRef.SOC_GUID = this.Travel_SOC_No_ngModel;
  //         if(this.isCustomer){
  //           claimReqMainRef.CUSTOMER_GUID = this.Customer_GUID ;
  //         }
  //         else{
  //           claimReqMainRef.SOC_GUID = this.Soc_GUID;
  //         }
  //         // this.api.postData('main_claim_request', claimReqMainRef.toJson(true)).subscribe((response) => {
  //         //   var postClaimMain = response.json();
  //         //   this.ClaimRequestMain = postClaimMain["resource"][0].CLAIM_REQUEST_GUID;  

  //         //   this.MainClaimSaved = true;
  //         //   alert('Claim Has Registered.')
  //         // })
  //         return new Promise((resolve, reject) => {
  //           this.api.postData('main_claim_request', claimReqMainRef.toJson(true)).subscribe((data) => {
             
  //             let res = data.json();
  //             console.log(res)
  //             let ClaimRequestMainId = res["resource"][0].CLAIM_REQUEST_GUID;
  //             resolve(ClaimRequestMainId);
  //           })
  //         });
  //       }

  //     })
  // } 

  // emailUrl: string = 'http://api.zen.com.my/api/v2/emailnotificationtest?api_key=' + constants.DREAMFACTORY_API_KEY;
  // sendEmail() {
  //   let name: string; let email: string
  //   name = 'shabbeer'; email = 'shabbeer@zen.com.my'
  //   var queryHeaders = new Headers();
  //   queryHeaders.append('Content-Type', 'application/json');
  //   queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
  //   queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
  //   let options = new RequestOptions({ headers: queryHeaders });

  //   let body = {
  //     "template": "",
  //     "template_id": 0,
  //     "to": [
  //       {
  //         "name": name,
  //         "email": email
  //       }
  //     ],
  //     "cc": [
  //       {
  //         "name": name,
  //         "email": email
  //       }
  //     ],
  //     "bcc": [
  //       {
  //         "name": name,
  //         "email": email
  //       }
  //     ],
  //     "subject": "Test",
  //     "body_text": "",
  //     "body_html": '<HTML><HEAD> <META name=GENERATOR content="MSHTML 10.00.9200.17606"></HEAD> <BODY> <DIV style="FONT-FAMILY: Century Gothic"> <DIV style="MIN-WIDTH: 500px"><BR> <DIV style="PADDING-BOTTOM: 10px; TEXT-ALIGN: center; PADDING-TOP: 10px; PADDING-LEFT: 10px; PADDING-RIGHT: 10px"><IMG style="WIDTH: 130px" alt=zen2.png src="http://zentranet.zen.com.my/_catalogs/masterpage/Layout/images/zen2.png"></DIV> <DIV style="MARGIN: 0px 100px; BACKGROUND-COLOR: #ec008c"> <DIV style="FONT-SIZE: 30px; COLOR: white; PADDING-BOTTOM: 10px; TEXT-ALIGN: center; PADDING-TOP: 10px; PADDING-LEFT: 20px; PADDING-RIGHT: 20px"><B><I>Notification</I></B></DIV></DIV><BR> <DIV style="FONT-SIZE: 12px; TEXT-ALIGN: center; PADDING-TOP: 20px">Dear [%Variable: @Employee%]<BR><BR>Your&nbsp;[%Variable: @LeaveType%] application has been forwarded to your superior for approval.  <H1 style="FONT-SIZE: 14px; TEXT-ALIGN: center; PADDING-TOP: 10px"><BR><B>Leave Details :</B><BR></H1> <TABLE style="FONT-SIZE: 12px; FONT-FAMILY: Century Gothic; MARGIN: 0px auto"> <TBODY> <TR> <TD style="TEXT-ALIGN: left">EMPLOYEE</TD> <TD style="PADDING-BOTTOM: 6px; PADDING-TOP: 6px; PADDING-LEFT: 6px; PADDING-RIGHT: 6px">:</TD> <TD colSpan=2>[%Variable: @Employee%]</TD></TR> <TR> <TD>START DATE</TD> <TD>:</TD> <TD style="TEXT-ALIGN: left" colSpan=2>[%Variable: @StartDate%]</TD></TR> <TR> <TD style="TEXT-ALIGN: left">END DATE </TD> <TD>:</TD> <TD style="TEXT-ALIGN: left" colSpan=2>[%Variable: @EndDate%]</TD></TR> <TR> <TD style="TEXT-ALIGN: left">APPLIED DATE</TD> <TD style="PADDING-BOTTOM: 6px; PADDING-TOP: 6px; PADDING-LEFT: 6px; PADDING-RIGHT: 6px">:</TD> <TD colSpan=2>[%Variable: @AppliedDate%]</TD></TR> <TR> <TD style="TEXT-ALIGN: left">DAYS</TD> <TD>:</TD> <TD style="TEXT-ALIGN: left">[%Variable: @NoOfDays%] </TD> <TD style="TEXT-ALIGN: left">[%Variable: @HalfDay%]</TD></TR></TR> <TR> <TD>LEAVE TYPE</TD> <TD>:</TD> <TD style="TEXT-ALIGN: left" colSpan=2>[%Variable: @LeaveType%]</TD></TR> <TR> <TD style="TEXT-ALIG: left">REASON</TD> <TD>: </TD> <TD style="TEXT-ALIGN: left" colSpan=2>[%Current Item:Reason%]</TD></TR></TBODY></TABLE><BR> <DIV style="TEXT-ALIGN: center; PADDING-TOP: 20px">Thank you.</DIV></DIV></DIV></DIV></BODY></HTML>',
  //     "from_name": "Ajay DAV",
  //     "from_email": "ajay1591ani@gmail.com",
  //     "reply_to_name": "",
  //     "reply_to_email": ""
  //   };
  //   this.http.post(this.emailUrl, body, options)
  //     .map(res => res.json())
  //     .subscribe(data => {
  //       // this.result= data["resource"];
  //       alert(JSON.stringify(data));
  //     });
  // }

  // readProfile() {
  //   return this.http.get('assets/profile.json').map((response) => response.json()).subscribe(data => {
  //     this.profileJSON = JSON.stringify(data);
  //     //levels: any[];
  //      let levels: any[] = data.profile.levels.level
  //     console.table(levels)
  //     levels.forEach(element => {
  //       if (element['-id'] == '1') {
  //         this.profileLevel = '1';
  //         if (element['approver']['-directManager'] === '1') {
  //           this.http
  //             .get(Services.getUrl('user_info', 'filter=USER_GUID=' + this.userGUID))
  //             .map(res => res.json())
  //             .subscribe(data => {
  //               let userInfo: any[] = data["resource"]
  //               userInfo.forEach(userElm => {
  //                 this.assignedTo = userElm.MANAGER_USER_GUID
  //                 this.http
  //                   .get(Services.getUrl('user_info', 'filter=USER_GUID=' + userElm.MANAGER_USER_GUID))
  //                   .map(res => res.json())
  //                   .subscribe(data => {
  //                     let userInfo: any[] = data["resource"]
  //                     userInfo.forEach(approverElm => {
  //                       this.stage = approverElm.DEPT_GUID
  //                     });
  //                   });
  //               });
  //               // console.log('Direct Manager Exists')
  //             });
  //           // console.log('Direct Manager ' + element['approver']['-directManager'])
  //           let varf: any[]= element['conditions']['condition']
  //           varf.forEach(condElement => {
  //             if (condElement['-status'] === 'approved') {
  //               console.log('Next Level ' + condElement['nextlevel']['#text'])
  //             }
  //             console.log('Status ' + condElement['-status'])
  //           });
  //         }
  //         else {
  //           this.assignedTo = element['approver']['#text']
  //           this.http
  //             .get(Services.getUrl('user_info', 'filter=USER_GUID=' + this.assignedTo))
  //             .map(res => res.json())
  //             .subscribe(data => {
  //               let userInfo: any[] = data["resource"]
  //               userInfo.forEach(approverElm => {
  //                 this.stage = approverElm.DEPT_GUID
  //               });
  //             });
              
  //         }
  //       }
  //     });
  //   });
  // }
}
