import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import * as constants from '../../config/constants';
import { TranslateService } from '@ngx-translate/core';

import { Http, Headers, RequestOptions } from '@angular/http';
import { UUID } from 'angular2-uuid';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Services } from '../Services';

import { ImageUpload_model } from '../../models/image-upload.model';
import { ClaimRequestDetailModel } from '../../models/claim-request-detail.model';
import { ApiManagerProvider } from '../../providers/api-manager.provider';



@IonicPage()
@Component({
  selector: 'page-add-toll',
  templateUrl: 'add-toll.html', providers: [Services, DecimalPipe]
})
export class AddTollPage {
  @ViewChild('fileInput') fileInput: ElementRef;

  lastImage: string = null;
  MA_SELECT: any;
  // loading: Loading;
  TenantGUID: any;
  paymentTypes: any; DetailsForm: FormGroup; ClaimMainGUID: any; 
  ClaimMethodGUID: any; ClaimMethodName: any;
  ClaimDetailGuid:any;claimDetailsData:any;
  ImageUploadValidation:boolean=false;
  chooseFile: boolean = false;

  constructor(public numberPipe: DecimalPipe, fb: FormBuilder, public api: ApiManagerProvider, public translate: TranslateService, public http: Http, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.TenantGUID = localStorage.getItem('g_TENANT_GUID');
    this.LoadPayments();
    this.LoadAllowanceDetails();
    this.DetailsForm = fb.group({
      avatar1: null,
      avatar: null
    });
    
    // this.LoadPayments();
    // this.LoadAllowanceDetails();
  }

  claimAmount: number;
  getCurrency(amount: number) {
    //amount=amount.split(",").join("");
    amount = Number(amount);
    if (amount > 99999) {
      alert('Amount should not exceed RM 99,999.00.')
      this.Amount = null
      this.claimAmount = 0;
    }
    else {
      this.claimAmount = amount;
      this.Amount = this.numberPipe.transform(amount, '1.2-2');
    }
  } 

  // getCurrency(amount: number) {
  //   this.Amount = this.numberPipe.transform(amount, '1.2-2');
  // }

  onAllowanceSelect(allowance: any) {
    this.Amount = allowance.ALLOWANCE_AMOUNT;
    this.claimAmount = allowance.ALLOWANCE_AMOUNT;

  }
  CloseAddTollPage() {
    this.viewCtrl.dismiss();
  }
  LoadPayments() {
    this.api.getApiModel('main_payment_type', 'filter=TENANT_GUID=' + this.TenantGUID)
      .subscribe(data => {
        this.paymentTypes = data["resource"];
      }
      );
  }

  Save(isMA:boolean) {
    if(isMA){
      if(this.MA_SELECT==='NA' || this.MA_SELECT===undefined){
        alert('Please select meal allowance.')
        return;
      }
      if(this.Description===undefined){
        alert('Please enter valid description.')
        return;
      }
    }
    else {
      if (this.claimAmount === undefined || this.claimAmount <= 0 || this.claimAmount === null) {
        alert('Please enter valid Amount.')
        return;
      }
    }
    if(this.ClaimDetailGuid===undefined || this.ClaimDetailGuid===null)
    {
    // alert(imageID)
    let claimReqRef: ClaimRequestDetailModel = new ClaimRequestDetailModel();
    claimReqRef.CLAIM_REQUEST_DETAIL_GUID = UUID.UUID();
    claimReqRef.CLAIM_REQUEST_GUID = this.ClaimMainGUID;
    claimReqRef.CLAIM_METHOD_GUID = this.ClaimMethodGUID;
    claimReqRef.PAYMENT_TYPE_GUID = this.PayType === undefined ? 'f74c3366-0437-51ec-91cc-d3fad23b061c' : this.PayType;
    // 2a543cd5-0177-a1d0-5482-48b52ec2100f
    claimReqRef.AMOUNT = this.claimAmount+'';
    claimReqRef.DESCRIPTION = this.Description;
    claimReqRef.CREATION_TS = new Date().toISOString();
    claimReqRef.UPDATE_TS = new Date().toISOString();
    claimReqRef.ATTACHMENT_ID = this.imageGUID;

    this.api.postData('claim_request_detail', claimReqRef.toJson(true)).subscribe((response) => {
      alert('Your ' + this.ClaimMethodName + ' details submitted successfully.')
      this.navCtrl.pop();
    })
  }
  else
  {
    this.api.getApiModel('claim_request_detail', 'filter=CLAIM_REQUEST_DETAIL_GUID=' + this.ClaimDetailGuid)
        .subscribe(data => {
          this.claimDetailsData = data;
          this.claimDetailsData["resource"][0].PAYMENT_TYPE_GUID = this.PayType === undefined ? 'f74c3366-0437-51ec-91cc-d3fad23b061c' : this.PayType;
          this.claimDetailsData["resource"][0].AMOUNT = this.claimAmount;
          this.claimDetailsData["resource"][0].DESCRIPTION = this.Description;
          this.claimDetailsData["resource"][0].UPDATE_TS = new Date().toISOString();
          this.claimDetailsData["resource"][0].ATTACHMENT_ID = (this.imageGUID!==undefined || this.imageGUID!==null)?this.imageGUID:this.claimDetailsData["resource"][0].ATTACHMENT_ID;
         this.api.updateApiModel('claim_request_detail',this.claimDetailsData).subscribe(() => alert('Your ' + this.ClaimMethodName + ' details are updated successfully.'))
         this.navCtrl.pop();
        })
  }
  }

  // SaveClaimDetails(formValues: any, isMA:boolean, imageGUID: any) {
  //   if(isMA){
  //     if(this.MA_SELECT==='NA' || this.MA_SELECT===undefined){
  //       alert('Please select meal allowance.')
  //       return;
  //     }
  //     if(this.Description===undefined){
  //       alert('Please enter valid description.')
  //       return;
  //     }
  //   }
  //   if(this.ClaimDetailGuid===undefined || this.ClaimDetailGuid===null)
  //   {
  //   // alert(imageID)
  //   let claimReqRef: ClaimRequestDetailModel = new ClaimRequestDetailModel();
  //   claimReqRef.CLAIM_REQUEST_DETAIL_GUID = UUID.UUID();
  //   claimReqRef.CLAIM_REQUEST_GUID = this.ClaimMainGUID;
  //   claimReqRef.CLAIM_METHOD_GUID = this.ClaimMethodGUID;
  //   claimReqRef.PAYMENT_TYPE_GUID = this.PayType === undefined ? 'f74c3366-0437-51ec-91cc-d3fad23b061c' : this.PayType;
  //   // 2a543cd5-0177-a1d0-5482-48b52ec2100f
  //   claimReqRef.AMOUNT = this.Amount;
  //   claimReqRef.DESCRIPTION = this.Description;
  //   claimReqRef.CREATION_TS = new Date().toISOString();
  //   claimReqRef.UPDATE_TS = new Date().toISOString();
  //   claimReqRef.ATTACHMENT_ID = this.imageGUID;

  //   this.api.postData('claim_request_detail', claimReqRef.toJson(true)).subscribe((response) => {
  //     var postClaimRef = response.json();
  //     alert('Your ' + this.ClaimMethodName + ' details are submitted successfully.')
  //     this.navCtrl.pop();
  //   })
  // }
  // else
  // {
  //   this.api.getApiModel('claim_request_detail', 'filter=CLAIM_REQUEST_DETAIL_GUID=' + this.ClaimDetailGuid)
  //       .subscribe(data => {
  //         this.claimDetailsData = data;
  //         this.claimDetailsData["resource"][0].PAYMENT_TYPE_GUID = this.PayType === undefined ? 'f74c3366-0437-51ec-91cc-d3fad23b061c' : this.PayType;
  //         this.claimDetailsData["resource"][0].AMOUNT = this.Amount;
  //         this.claimDetailsData["resource"][0].DESCRIPTION = this.Description;
  //         this.claimDetailsData["resource"][0].UPDATE_TS = new Date().toISOString();
  //         this.claimDetailsData["resource"][0].ATTACHMENT_ID = (imageGUID!==undefined || imageGUID!==null)?imageGUID:this.claimDetailsData["resource"][0].ATTACHMENT_ID;
  //        this.api.updateApiModel('claim_request_detail',this.claimDetailsData).subscribe(res => alert('Your ' + this.ClaimMethodName + ' details are updated successfully.'))
  //        this.navCtrl.pop();
  //       })
  // }
  // }


  allowanceList: any[];
  LoadAllowanceDetails() {
    this.api.getApiModel('main_allowance').subscribe(res => {
      this.allowanceList = res['resource'];
    })
  }

  isFormEdit:boolean=false;
  ngOnInit(): void {
    // this.ClaimMainGUID = this.navParams.get('MainClaim');
    this.ClaimMainGUID = localStorage.getItem("g_CR_GUID");
    this.ClaimMethodGUID = this.navParams.get('ClaimMethod');
    this.ClaimMethodName = this.navParams.get('ClaimMethodName');
    this.ClaimDetailGuid = this.navParams.get('ClaimReqDetailGuid');
    if(this.ClaimDetailGuid!==null  && this.ClaimDetailGuid!==undefined)
    // && this.ClaimDetailGuid!==undefined
    {this.GetClaimDetailsByGuid();this.isFormEdit=true}
  }

  imageURLEdit: any =null;
  GetClaimDetailsByGuid()
  {
    this.api.getApiModel('view_claim_details', 'filter=CLAIM_REQUEST_DETAIL_GUID=' + this.ClaimDetailGuid).subscribe(res => {
      this.claimDetailsData = res['resource'];
      this.PayType=this.claimDetailsData[0].PAYMENT_TYPE_GUID;
      if(this.claimDetailsData[0].CLAIM_METHOD==='MealAllowance')
      {
        this.LoadAllowanceDetails();
      this.allowanceList.forEach(element => {
        if(element.ALLOWANCE_AMOUNT===this.claimDetailsData[0].AMOUNT)
        {this.MA_SELECT=element.ALLOWANCE_NAME+ ' - ' + element.ALLOWANCE_AMOUNT
        console.log(this.MA_SELECT);
      }
      });
    }
    this.Amount = this.numberPipe.transform(this.claimDetailsData[0].AMOUNT, '1.2-2');
    this.claimAmount = this.claimDetailsData[0].AMOUNT;
    this.imageURLEdit = this.api.getImageUrl(this.claimDetailsData[0].ATTACHMENT_ID);
    //this.ImageUploadValidation=false;
    this.ImageUploadValidation=true;
    //this.chooseFile = false;
      this.Description=this.claimDetailsData[0].DESCRIPTION;
  });
}


  Amount: any; PayType: any; Description: any; 
   loading = false;
   uploadFileName: string;
   DetailsType: string;
   CloudFilePath: string;  

  onFileChange(event: any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.DetailsForm.get('avatar').setValue(file);
      this.uploadFileName = file.name;
      reader.onload = () => {
        this.DetailsForm.get('avatar').setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result.split(',')[1]
        });
      };
    }
    this.chooseFile = true;
  } 
  
  fileName1: string;
  ProfileImage: any; 
  newImage:boolean=true;

  imageGUID: any;
  saveIm() {
    let uploadImage = this.UploadImage();
    uploadImage.then(() => {
      this.imageGUID = this.uploadFileName;
      this.chooseFile = false;
      this.ImageUploadValidation = true;
    })   
  }

  // saveIm(imageGUID: any) {
  //   let uploadImage = this.UploadImage();
  //   uploadImage.then((resJson) => {
     
  //     this.imageGUID = this.uploadFileName;
  //     this.chooseFile = false;
  //     // this.ImageUploadValidation=true;
  //     this.ImageUploadValidation=false;

  //     if(imageGUID==='capture' && this.isFormEdit) {this.imageURLEdit=null;
  //       this.ImageUploadValidation = false;}
  //     else{
  //     this.imageGUID = imageGUID; this.ImageUploadValidation = true;}     
  //   })   
  // }

 
  clearFile() {
    this.DetailsForm.get('avatar').setValue(null);
    this.fileInput.nativeElement.value = '';
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
    if (this.DetailsType === 'Toll') {
      this.CloudFilePath = 'eclaim/toll/'
    }
    else if (this.DetailsType === 'Parking') {
      this.CloudFilePath = 'eclaim/parking/'
    }
    this.loading = true;
    const queryHeaders = new Headers();
    queryHeaders.append('filename', this.uploadFileName);
    queryHeaders.append('Content-Type', 'multipart/form-data');
    queryHeaders.append('fileKey', 'file');
    queryHeaders.append('chunkedMode', 'false');
    queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
    const options = new RequestOptions({ headers: queryHeaders });
    return new Promise((resolve) => {
      this.http.post('http://api.zen.com.my/api/v2/files/' + this.CloudFilePath + this.uploadFileName, this.DetailsForm.get('avatar').value, options)
        .map((response) => {
          return response;
        }).subscribe((response) => {
          resolve(response.json());
        })
    })
  }



  
  // Amount: any; PayType: any; Description: any;
}
