import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
//import { FormBuilder, FormGroup } from '@angular/forms';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { GiftClaim_Model } from '../../models/giftclaim_model';
import { MasterClaim_Model } from '../../models/masterclaim_model';
import { GiftClaim_Service } from '../../services/giftclaim_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';

import { Camera, CameraOptions } from '@ionic-native/camera';
//import {Camera} from 'ionic-native';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';

import { LoadingController, ActionSheetController, Platform, Loading, ToastController } from 'ionic-angular';
/**
 * Generated class for the GiftclaimPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-giftclaim',
  templateUrl: 'giftclaim.html', providers: [GiftClaim_Service, BaseHttpService, FileTransfer]
})
export class GiftclaimPage {
  isReadyToSave: boolean;
  giftclaim_entry: GiftClaim_Model = new GiftClaim_Model();
  masterclaim_entry: MasterClaim_Model = new MasterClaim_Model();
    Giftform: FormGroup;

    baseResourceUrl1: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_claim_request' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
    //baseResource_Url1: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

    baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/claim_request_detail' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
   baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

    baseResourceUrl_soc: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/soc_main' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
   // baseResource_Url_soc: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
  
    public Exist_Record: boolean = false;
    public Gift_SOC_No_ngModel: any;
    public Gift_Date_ngModel: any;
    public Gift_ProjectName_ngModel: any;
    public Gift_CustomerName_ngModel: any;
    public Gift_Description_ngModel: any;
    public Gift_ClaimAmount_ngModel: any;
    public socs:any;
  
    constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private giftservice: GiftClaim_Service, private alertCtrl: AlertController, private camera: Camera, public actionSheetCtrl: ActionSheetController, private loadingCtrl: LoadingController, private file: File, private filePath: FilePath, private transfer: FileTransfer, public toastCtrl: ToastController) 
    {
           this.Giftform = fb.group({

     // giftname: '',
     soc_no: '',
     project_name: '',
     customer_name:'',
     print_date: '',
     claim_amount: ['', Validators.required],
     description: ['', Validators.required],

    });
    this.Gift_Date_ngModel = new Date().toISOString();
    //this.entertainment_entry.UPDATE_TS = new Date().toISOString();
    this.GetSocNo();

    this.Giftform.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.Giftform.valid;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GiftclaimPage');
  }

  GetSocNo(){
    this.http
   .get(this.baseResourceUrl_soc)
   .map(res => res.json())
   .subscribe(data => {
     this.socs = data["resource"];
     
     
     if (this.Gift_SOC_No_ngModel == undefined) { return; }
     if (this.Gift_SOC_No_ngModel != "" || this.Gift_SOC_No_ngModel != undefined) {
       let headers = new Headers();
       headers.append('Content-Type', 'application/json');
       let options = new RequestOptions({ headers: headers });
       let url: string;
       //let url1: string;
       url = this.baseResource_Url + "vw_socno?filter=(SOC_NO=" + this.Gift_SOC_No_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      // url1 = this.baseResource_Url + "vw_socno?filter=(SOC_NO=" + this.Gift_SOC_No_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
       this.http.get(url, options)
         .map(res => res.json())
         .subscribe(
         data => {
           let res = data["resource"];
 
           if (res.length > 0) {
             this.Gift_ProjectName_ngModel = res[0].Project;
             this.Gift_CustomerName_ngModel=res[0].customer;
           }
           else {
             alert('please enter valid soc no');
             //return;
             this.Gift_SOC_No_ngModel = "";
           }
         },
         err => {
           console.log("ERROR!: ", err);
         });
     }



     
   });
 }

  // SOC_No_TextBox_Onchange(Gift_SOC_No_ngModel: string) {
  //   console.log(this.Gift_SOC_No_ngModel);
  //   if (this.Gift_SOC_No_ngModel == undefined) { return; }
  //   if (this.Gift_SOC_No_ngModel != "" || this.Gift_SOC_No_ngModel != undefined) {
  //     let headers = new Headers();
  //     headers.append('Content-Type', 'application/json');
  //     let options = new RequestOptions({ headers: headers });
  //     let url: string;
  //     let url1: string;
  //     url = this.baseResource_Url + "vw_socno?filter=(SOC_NO=" + this.Gift_SOC_No_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
  //     url1 = this.baseResource_Url + "vw_socno?filter=(SOC_NO=" + this.Gift_SOC_No_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
  //     this.http.get(url, options)
  //       .map(res => res.json())
  //       .subscribe(
  //       data => {
  //         let res = data["resource"];

  //         if (res.length > 0) {
  //           this.Gift_ProjectName_ngModel = res[0].Project;
  //           this.Gift_CustomerName_ngModel = res[0].Project;
  //         }
  //         else {
  //           alert('please enter valid soc no');
  //           //return;
  //           this.Gift_SOC_No_ngModel = "";
  //         }
  //       },
  //       err => {
  //         console.log("ERROR!: ", err);
  //       });
  //   }
  // }

  save() {
    
        //debugger;
        //this.getImage();
        //this.uploadFile();
        if (this.Giftform.valid) {
          let headers = new Headers();
          headers.append('Content-Type', 'application/json');
          let options = new RequestOptions({ headers: headers });
    
    
          let url: string;
          let request_id = UUID.UUID();
          //url = this.baseResource_Url + "claim_request_detail?filter=(DESCRIPTION=" + this.Travel_Description_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
          url = this.baseResource_Url + "claim_request_detail?filter=(CLAIM_REQUEST_GUID=" + request_id + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    
          this.http.get(url, options)
            .map(res => res.json())
            .subscribe(
            data => {
              let res = data["resource"];
              if (res.length == 0) {
                console.log("No records Found");
                if (this.Exist_Record == false) {
                  // this.entertainment_entry.SOC_GUID = this.Entertainment_SOC_No_ngModel.trim();
                 
                  this.giftclaim_entry.DESCRIPTION = this.Gift_Description_ngModel.trim();
                  this.giftclaim_entry.CLAIM_AMOUNT = this.Gift_ClaimAmount_ngModel.trim();
                 //this.printclaim_entry.CLAIM_TYPE_GUID = this.masterclaim_entry.CLAIM_TYPE_GUID = "58c59b56-289e-31a2-f708-138e81a9c823";
                 

                
                  this.masterclaim_entry.CLAIM_AMOUNT = this.Gift_ClaimAmount_ngModel.trim();
                  this.masterclaim_entry.CLAIM_REQUEST_GUID = UUID.UUID();
                  this.masterclaim_entry.CREATION_TS = new Date().toISOString();
                  this.masterclaim_entry.UPDATE_TS = new Date().toISOString();
                  //alert(this.masterclaim_entry.CLAIM_AMOUNT);
    
                  this.giftclaim_entry.CLAIM_REQUEST_DETAIL_GUID = UUID.UUID();
                  this.giftclaim_entry.CREATION_TS = new Date().toISOString();
                  this.giftclaim_entry.CREATION_USER_GUID = '1';
                  this.giftclaim_entry.UPDATE_TS = new Date().toISOString();
                  this.giftclaim_entry.UPDATE_USER_GUID = "";
    
    
                  //this.uploadFile();
    
                  this.giftservice.save_main_claim_request(this.masterclaim_entry)
                    .subscribe((response) => {
                      if (response.status == 200) {
                       // alert('Giftclaim Registered successfully');
                        //location.reload();
                        this.navCtrl.setRoot(this.navCtrl.getActive().component);
                      }
                    });
    
                  this.giftservice.save_claim_request_detail(this.giftclaim_entry)
    
                    .subscribe((response) => {
                      if (response.status == 200) {
                        alert('Giftclaim Registered successfully');
                        //location.reload();
                        this.navCtrl.setRoot(this.navCtrl.getActive().component);
                      }
                    });
    
                }
              }
              else {
                console.log("Records Found");
                alert("The Travelclaim is already Exist.")
    
              }
    
            },
            err => {
              this.Exist_Record = false;
              console.log("ERROR!: ", err);
            });
        }
    
      }

}
