import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
//import { FormBuilder, FormGroup } from '@angular/forms';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { OvertimeClaim_Model } from '../../models/overtimeclaim_model';
import { MasterClaim_Model } from '../../models/masterclaim_model';
import { OvertimeClaim_Service } from '../../services/overtimeclaim_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';

import { Camera, CameraOptions } from '@ionic-native/camera';
//import {Camera} from 'ionic-native';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';

import { LoadingController, ActionSheetController, Platform, Loading, ToastController } from 'ionic-angular';
/**
 * Generated class for the OvertimeclaimPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-overtimeclaim',
  templateUrl: 'overtimeclaim.html',  providers: [OvertimeClaim_Service, BaseHttpService, FileTransfer]
})
export class OvertimeclaimPage {
  isReadyToSave: boolean;
  overtimeclaim_entry: OvertimeClaim_Model = new OvertimeClaim_Model();
  masterclaim_entry: MasterClaim_Model = new MasterClaim_Model();
  OTform: FormGroup;

  baseResourceUrl1: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_claim_request' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url1: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/claim_request_detail' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  baseResourceUrl_soc: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/soc_main' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url_soc: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  public Exist_Record: boolean = false;
  public OT_Date_ngModel: any;
  public OT_SOC_No_ngModel: any;
  public OT_ProjectName_ngModel: any;
  public OT_CustomerName_ngModel: any;
  public OT_StartTime_ngModel: any;
  public OT_EndTime_ngModel: any;
  public OT_ClaimAmount_ngModel: any;
  public socs:any;
 

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private overtimeservice: OvertimeClaim_Service, private alertCtrl: AlertController, private camera: Camera, public actionSheetCtrl: ActionSheetController, private loadingCtrl: LoadingController, private file: File, private filePath: FilePath, private transfer: FileTransfer, public toastCtrl: ToastController) {

    this.OTform = fb.group({

     // otname: '',
      ot_date: '',
      soc_no: '',
      project_name: '',
     customer_name: '',
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
      claim_amount: ['', Validators.required],

    });
    this.OT_Date_ngModel = new Date().toISOString();
    this.GetSocNo();
    //this.entertainment_entry.UPDATE_TS = new Date().toISOString();

    this.OTform.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.OTform.valid;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OvertimeclaimPage');
  }

  GetSocNo(){
    this.http
   .get(this.baseResourceUrl_soc)
   .map(res => res.json())
   .subscribe(data => {
     this.socs = data["resource"];
     
     
     if (this.OT_SOC_No_ngModel == undefined) { return; }
     if (this.OT_SOC_No_ngModel != "" || this.OT_SOC_No_ngModel != undefined) {
       let headers = new Headers();
       headers.append('Content-Type', 'application/json');
       let options = new RequestOptions({ headers: headers });
       let url: string;
       let url1: string;
       url = this.baseResource_Url + "vw_socno?filter=(SOC_NO=" + this.OT_SOC_No_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
       url1 = this.baseResource_Url + "vw_socno?filter=(SOC_NO=" + this.OT_SOC_No_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
       this.http.get(url, options)
         .map(res => res.json())
         .subscribe(
         data => {
           let res = data["resource"];
 
           if (res.length > 0) {
             this.OT_ProjectName_ngModel = res[0].Project;
             this.OT_CustomerName_ngModel=res[0].customer;
           }
           else {
             alert('please enter valid soc no');
             //return;
             this.OT_SOC_No_ngModel = "";
           }
         },
         err => {
           console.log("ERROR!: ", err);
         });
     }



     
   });
 }

  // SOC_No_TextBox_Onchange(OT_SOC_No_ngModel: string) {
  //   alert('soc no');
  //   console.log(this.OT_SOC_No_ngModel);
  //   if (this.OT_SOC_No_ngModel == undefined) { return; }
  //   if (this.OT_SOC_No_ngModel != "" || this.OT_SOC_No_ngModel != undefined) {
  //     let headers = new Headers();
  //     headers.append('Content-Type', 'application/json');
  //     let options = new RequestOptions({ headers: headers });
  //     let url: string;
  //     let url1: string;
  //     url1 = this.baseResource_Url + "vw_socno?filter=(SOC_NO=" + this.OT_SOC_No_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
  //     url = this.baseResource_Url + "vw_socno?filter=(SOC_NO=" + this.OT_SOC_No_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
  //     this.http.get(url, options)
  //       .map(res => res.json())
  //       .subscribe(
  //       data => {
  //         let res = data["resource"];

  //         if (res.length > 0) {
  //           this.OT_ProjectName_ngModel = res[0].Project;
  //           this.OT_CustomerName_ngModel=res[0].customer;
  //         }
  //         else {
  //           alert('please enter valid soc no');
  //           //return;
  //           this.OT_SOC_No_ngModel = "";
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
        if (this.OTform.valid) {
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
                  this.overtimeclaim_entry.START_TS = this.OT_StartTime_ngModel.trim();
                  this.overtimeclaim_entry.END_TS = this.OT_EndTime_ngModel.trim();
                  this.overtimeclaim_entry.CLAIM_AMOUNT = this.OT_ClaimAmount_ngModel.trim();
                 // this.overtimeclaim_entry.CLAIM_TYPE_GUID = this.masterclaim_entry.CLAIM_TYPE_GUID = "Overtime claim";
                 

                  //this.masterclaim_entry.SOC_GUID = this.OT_SOC_No_ngModel.trim();
                  this.masterclaim_entry.START_TS = this.OT_StartTime_ngModel.trim();
                  this.masterclaim_entry.END_TS = this.OT_EndTime_ngModel.trim();
                  this.masterclaim_entry.CLAIM_AMOUNT = this.OT_ClaimAmount_ngModel.trim();
                  this.masterclaim_entry.CLAIM_REQUEST_GUID = UUID.UUID();
                  this.masterclaim_entry.CREATION_TS = new Date().toISOString();
                  this.masterclaim_entry.UPDATE_TS = new Date().toISOString();
                  //alert(this.masterclaim_entry.CLAIM_AMOUNT);
    
                  this.overtimeclaim_entry.CLAIM_REQUEST_DETAIL_GUID = UUID.UUID();
                  this.overtimeclaim_entry.CREATION_TS = new Date().toISOString();
                  this.overtimeclaim_entry.CREATION_USER_GUID = '1';
                  this.overtimeclaim_entry.UPDATE_TS = new Date().toISOString();
                  this.overtimeclaim_entry.UPDATE_USER_GUID = "";
    
    
                  //this.uploadFile();
    
                  this.overtimeservice.save_main_claim_request(this.masterclaim_entry)
                    .subscribe((response) => {
                      if (response.status == 200) {
                        //alert('Overtimeclaim Registered successfully');
                        //location.reload();
                        this.navCtrl.setRoot(this.navCtrl.getActive().component);
                      }
                    });
    
                  this.overtimeservice.save_claim_request_detail(this.overtimeclaim_entry)
    
                    .subscribe((response) => {
                      if (response.status == 200) {
                        alert('Overtimeclaim Registered successfully');
                        //location.reload();
                        this.navCtrl.setRoot(this.navCtrl.getActive().component);
                      }
                    });
    
                }
              }
              else {
                console.log("Records Found");
                alert("The Overtimeclaim is already Exist.")
    
              }
    
            },
            err => {
              this.Exist_Record = false;
              console.log("ERROR!: ", err);
            });
        }
    
      }

}
