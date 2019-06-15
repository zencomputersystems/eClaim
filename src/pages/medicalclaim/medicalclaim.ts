import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map'; 
import * as constants from '../../app/config/constants';
//import { MasterClaim_Model } from '../../models/masterclaim_model';
import { MedicalClaim_Service } from '../../services/medicalclaim_service';
import { BaseHttpService } from '../../services/base-http';
import { UUID } from 'angular2-uuid';
import { FileTransfer } from '@ionic-native/file-transfer';

import {  ActionSheetController,  ToastController } from 'ionic-angular';
import { Services } from '../Services';
import { ImageUpload_model } from '../../models/image-upload.model';
import { ProfileManagerProvider } from '../../providers/profile-manager.provider';


@IonicPage()
@Component({
  selector: 'page-medicalclaim',
  templateUrl: 'medicalclaim.html', providers: [MedicalClaim_Service, BaseHttpService, FileTransfer]
})
export class MedicalclaimPage {

  Medicalform: FormGroup;
  uploadFileName: string;
  loading = false;
  CloudFilePath: string;
  @ViewChild('fileInput') fileInput: ElementRef;
  Medical_Amount_ngModel: any;
  travelAmount: any;
  validDate = new Date().toISOString();
  isCustomer: boolean = false;
  Customer_GUID: any;
  Soc_GUID: any;
  ClaimRequestMainId: any;
  public MainClaimSaved: boolean = false;
  travel_date: any;
 
  
  userGUID: any;
  Medical_Date_ngModel: any;
  Medical_Description_ngModel: any;
  public assignedTo: any;
  public profileLevel: any; 
  public stage: any;
  public profileJSON: any;

   /********FORM EDIT VARIABLES***********/
   isFormEdit: boolean = false;
   claimRequestGUID: any;
   claimRequestData: any[];
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
        // if (this.claimRequestData[0].SOC_GUID === null) {
        //   this.claimFor = 'customer'
        //   this.storeCustomers.forEach(element => {
        //     if (element.CUSTOMER_GUID === this.claimRequestData[0].CUSTOMER_GUID) {
        //       this.Customer_Lookup_ngModel = element.NAME
        //     }
        //   });
        // }
        // else {
        //   this.claimFor = 'project'
        //   this.storeProjects.forEach(element => {
        //     if (element.SOC_GUID === this.claimRequestData[0].SOC_GUID) {
        //       this.Project_Lookup_ngModel = element.project_name
        //       this.Travel_SOC_No_ngModel = element.soc
        //     }
        //   });
        // }
        //this.Medical_Date_ngModel = this.claimRequestData[0].TRAVEL_DATE;
        this.Medical_Date_ngModel = new Date(this.claimRequestData[0].TRAVEL_DATE).toISOString();         
        // this.travelAmount = this.claimRequestData[0].MILEAGE_AMOUNT;
        this.Medical_Amount_ngModel = this.claimRequestData[0].MILEAGE_AMOUNT;
        this.Medical_Description_ngModel = this.claimRequestData[0].DESCRIPTION;
        // this.vehicles.forEach(element => {
        //   if (element.MILEAGE_GUID === this.claimRequestData[0].MILEAGE_GUID) {
        //     this.Travel_Mode_ngModel = element.CATEGORY
        //   }
        // });        
      }
      );
  }

  constructor(public profileMng: ProfileManagerProvider, public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, private api: Services, public translate: TranslateService, fb: FormBuilder, public http: Http, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController ) {
  
    this.Medicalform = fb.group({
      avatar: null,
      travel_date:  ['', Validators.required],      
      description: ['', Validators.required],      
    //  vehicleType: ['', Validators.required],
     claim_amount: ['', Validators.required],
     attachment_GUID : ''
        });
        //this.readProfile();   
  }

  onFileChange(event: any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.Medicalform.get('avatar').setValue(file);
      this.uploadFileName = file.name;
      reader.onload = () => {
        this.Medicalform.get('avatar').setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result.split(',')[1]
        });
      };
    }
  }

  onSubmit() {
    this.loading = true;
    const queryHeaders = new Headers();
    queryHeaders.append('filename', this.uploadFileName);
    queryHeaders.append('Content-Type', 'multipart/form-data');
    queryHeaders.append('fileKey', 'file');
    queryHeaders.append('chunkedMode', 'false');
    queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
    const options = new RequestOptions({ headers: queryHeaders });
    this.http.post('http://api.zen.com.my/api/v2/azurefs/' + this.uploadFileName, this.Medicalform.get('avatar').value, options)
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

  saveIm() {
    let uploadImage = this.UploadImage();
    uploadImage.then((resJson) => {
      console.table(resJson)
      let imageResult = this.SaveImageinDB();
      imageResult.then(() => {
        // result.then((res) => {
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
    return new Promise((resolve) => {
      this.api.postData('main_images', objImage.toJson(true)).subscribe(() => {
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
  console.log(this.CloudFilePath);
  return new Promise((resolve) => {
    this.http.post('http://api.zen.com.my/api/v2/azurefs/' + this.CloudFilePath + this.uploadFileName, this.Medicalform.get('avatar').value, options)
      .map((response) => {
        return response;        
      }).subscribe((response) => {
        resolve(response.json());
      })
  })
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

   clearFile() {
    this.Medicalform.get('avatar').setValue(null);
    this.fileInput.nativeElement.value = '';
  }

  allowanceGUID: any;
  onAllowanceSelect(allowance: any) {
    this.allowanceGUID = allowance.ALLOWANCE_GUID;
  }

  submitAction(imageGUID: any,formValues: any) {   
    formValues.claimTypeGUID = '40dbaf56-98e4-77b9-df95-85ec232ff714';
    formValues.meal_allowance = this.allowanceGUID;
    formValues.attachment_GUID = imageGUID;   
    this.travelAmount = formValues.claim_amount;
    // formValues.soc_no = this.isCustomer ? this.Customer_GUID : this.Soc_GUID;
    this.profileMng.save(formValues, this.travelAmount, this.isCustomer)
  }

  //  save(imageGUID: string) {
  //   let claimReqMainRef: ClaimReqMain_Model = new ClaimReqMain_Model();
  //   let userGUID = localStorage.getItem('g_USER_GUID');
  //   let tenantGUID = localStorage.getItem('g_TENANT_GUID');
  //   let month = new Date(this.Medical_Date_ngModel).getMonth() + 1;
  //   let year = new Date(this.Medical_Date_ngModel).getFullYear();
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

  //           //let claimReqMainRef: ClaimReqMain_Model = new ClaimReqMain_Model();
  //           claimReqMainRef.CLAIM_REQUEST_GUID = UUID.UUID();
  //           claimReqMainRef.TENANT_GUID = tenantGUID;
  //           claimReqMainRef.CLAIM_REF_GUID = claimRefGUID;
  //           //claimReqMainRef.MILEAGE_GUID = this.VehicleId;
  //           // claimReqMainRef.CLAIM_TYPE_GUID = '58c59b56-289e-31a2-f708-138e81a9c823';
  //           claimReqMainRef.CLAIM_TYPE_GUID = '40dbaf56-98e4-77b9-df95-85ec232ff714';
  //           claimReqMainRef.TRAVEL_DATE = this.Medical_Date_ngModel;           
  //           claimReqMainRef.DESCRIPTION = this.Medical_Description_ngModel;
  //           //claimReqMainRef.MILEAGE_AMOUNT = this.Travel_Amount_ngModel
  //           claimReqMainRef.CLAIM_AMOUNT = this.Medical_Amount_ngModel;
  //           claimReqMainRef.ASSIGNED_TO = this.assignedTo;         
  //           claimReqMainRef.PROFILE_LEVEL = this.profileLevel;
  //           claimReqMainRef.PROFILE_JSON = this.profileJSON;
  //           claimReqMainRef.STATUS = 'Pending';
  //           claimReqMainRef.STAGE = this.stage;
  //           claimReqMainRef.ATTACHMENT_ID = imageGUID;
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
  //           //  this.api.postData('main_claim_request', claimReqMainRef.toJson(true)).subscribe((response) => {
  //           //   var postClaimMain = response.json();
  //           //   this.ClaimRequestMainId = postClaimMain["resource"][0].CLAIM_REQUEST_GUID;
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
  //         //claimReqMainRef.MILEAGE_GUID = this.VehicleId;
  //         //claimReqMainRef.CLAIM_TYPE_GUID = '58c59b56-289e-31a2-f708-138e81a9c823';
  //         claimReqMainRef.CLAIM_TYPE_GUID = '40dbaf56-98e4-77b9-df95-85ec232ff714';
  //         claimReqMainRef.TRAVEL_DATE =this.Medical_Date_ngModel; 
  //         // claimReqMainRef.START_TS = value.start_DT;
  //         // claimReqMainRef.END_TS = value.end_DT;
  //         claimReqMainRef.DESCRIPTION = this.Medical_Description_ngModel;
  //         //claimReqMainRef.MILEAGE_AMOUNT = this.Travel_Amount_ngModel;
  //         claimReqMainRef.CLAIM_AMOUNT = this.Medical_Amount_ngModel;
  //         claimReqMainRef.ASSIGNED_TO = this.assignedTo;         
  //         claimReqMainRef.PROFILE_LEVEL = this.profileLevel;
  //         claimReqMainRef.PROFILE_JSON = this.profileJSON;
  //         claimReqMainRef.STATUS = 'Pending';
  //         claimReqMainRef.STAGE = this.stage;
  //         claimReqMainRef.ATTACHMENT_ID = imageGUID;
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
