import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
//import { FormBuilder, FormGroup } from '@angular/forms';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { PrintingClaim_Model } from '../../models/printingclaim_model';
import { MasterClaim_Model } from '../../models/masterclaim_model';
import { PrintingClaim_Service } from '../../services/printingclaim_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';

import { Camera, CameraOptions } from '@ionic-native/camera';
//import {Camera} from 'ionic-native';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';

import { LoadingController, ActionSheetController, Platform, Loading, ToastController } from 'ionic-angular';
/**
 * Generated class for the PrintclaimPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-printclaim',
  templateUrl: 'printclaim.html',  providers: [PrintingClaim_Service, BaseHttpService, FileTransfer]
})
export class PrintclaimPage {
  isReadyToSave: boolean;
  printclaim_entry: PrintingClaim_Model = new PrintingClaim_Model();
  masterclaim_entry: MasterClaim_Model = new MasterClaim_Model();
    Printform: FormGroup;

    baseResourceUrl1: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_claim_request' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
    baseResource_Url1: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';


    baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/claim_request_detail' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
    baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

    baseResourceUrl_soc: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/soc_main' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
    baseResource_Url_soc: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
  
  
   
    public Exist_Record: boolean = false;

    public Printing_SOC_No_ngModel: any;
    public Printing_Date_ngModel: any;
    public Printing_ProjectName_ngModel: any;
    public Printing_CustomerName_ngModel: any;
    public Printing_Description_ngModel: any;
    public Printing_ClaimAmount_ngModel: any;
    public socs:any;
   

    constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private printingservice: PrintingClaim_Service, private alertCtrl: AlertController, private camera: Camera, public actionSheetCtrl: ActionSheetController, private loadingCtrl: LoadingController, private file: File, private filePath: FilePath, private transfer: FileTransfer, public toastCtrl: ToastController) {
       this.Printform = fb.group({
        soc_no: '',
        project_name: '',
        customer_name:'',
        print_date: '',
        claim_amount: ['', Validators.required],
        description: ['', Validators.required],
      printname: '',

    });
    this.Printing_Date_ngModel = new Date().toISOString();
    //this.entertainment_entry.UPDATE_TS = new Date().toISOString();
    this.GetSocNo();

    this.Printform.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.Printform.valid;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrintclaimPage');
  }

  GetSocNo(){
    this.http
   .get(this.baseResourceUrl_soc)
   .map(res => res.json())
   .subscribe(data => {
     this.socs = data["resource"];
     
     
     if (this.Printing_SOC_No_ngModel == undefined) { return; }
     if (this.Printing_SOC_No_ngModel != "" || this.Printing_SOC_No_ngModel != undefined) {
       let headers = new Headers();
       headers.append('Content-Type', 'application/json');
       let options = new RequestOptions({ headers: headers });
       let url: string;
       let url1: string;
       url = this.baseResource_Url + "vw_socno?filter=(SOC_NO=" + this.Printing_SOC_No_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
       url1 = this.baseResource_Url + "vw_socno?filter=(SOC_NO=" + this.Printing_SOC_No_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
       this.http.get(url, options)
         .map(res => res.json())
         .subscribe(
         data => {
           let res = data["resource"];
 
           if (res.length > 0) {
             this.Printing_ProjectName_ngModel = res[0].Project;
             this.Printing_CustomerName_ngModel=res[0].customer;
           }
           else {
             alert('please enter valid soc no');
             //return;
             this.Printing_SOC_No_ngModel = "";
           }
         },
         err => {
           console.log("ERROR!: ", err);
         });
     }



     
   });
 }

  // SOC_No_TextBox_Onchange(Entertainment_SOC_No_ngModel: string) {
  //   console.log(this.Printing_SOC_No_ngModel);
  //   if (this.Printing_SOC_No_ngModel == undefined) { return; }
  //   if (this.Printing_SOC_No_ngModel != "" || this.Printing_SOC_No_ngModel != undefined) {
  //     let headers = new Headers();
  //     headers.append('Content-Type', 'application/json');
  //     let options = new RequestOptions({ headers: headers });
  //     let url: string;
  //     let url1: string;
  //     url = this.baseResource_Url + "vw_socno?filter=(SOC_NO=" + this.Printing_SOC_No_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
  //     url1 = this.baseResource_Url + "vw_socno?filter=(SOC_NO=" + this.Printing_SOC_No_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
  //     this.http.get(url, options)
  //       .map(res => res.json())
  //       .subscribe(
  //       data => {
  //         let res = data["resource"];

  //         if (res.length > 0) {
  //           this.Printing_ProjectName_ngModel = res[0].Project;
  //           this.Printing_CustomerName_ngModel = res[0].Project;
  //         }
  //         else {
  //           alert('please enter valid soc no');
  //           //return;
  //           this.Printing_SOC_No_ngModel = "";
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
        if (this.Printform.valid) {
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
                 
                  this.printclaim_entry.DESCRIPTION = this.Printing_Description_ngModel.trim();
                  this.printclaim_entry.CLAIM_AMOUNT = this.Printing_ClaimAmount_ngModel.trim();
                 //this.printclaim_entry.CLAIM_TYPE_GUID = this.masterclaim_entry.CLAIM_TYPE_GUID = "58c59b56-289e-31a2-f708-138e81a9c823";
                 

                
                  this.masterclaim_entry.CLAIM_AMOUNT = this.Printing_ClaimAmount_ngModel.trim();
                  this.masterclaim_entry.CLAIM_REQUEST_GUID = UUID.UUID();
                  this.masterclaim_entry.CREATION_TS = new Date().toISOString();
                  this.masterclaim_entry.UPDATE_TS = new Date().toISOString();
                  //alert(this.masterclaim_entry.CLAIM_AMOUNT);
    
                  this.printclaim_entry.CLAIM_REQUEST_DETAIL_GUID = UUID.UUID();
                  this.printclaim_entry.CREATION_TS = new Date().toISOString();
                  this.printclaim_entry.CREATION_USER_GUID = '1';
                  this.printclaim_entry.UPDATE_TS = new Date().toISOString();
                  this.printclaim_entry.UPDATE_USER_GUID = "";
    
    
                  //this.uploadFile();
    
                  this.printingservice.save_main_claim_request(this.masterclaim_entry)
                    .subscribe((response) => {
                      if (response.status == 200) {
                        //alert('PrintClaim Registered successfully');
                        //location.reload();
                        this.navCtrl.setRoot(this.navCtrl.getActive().component);
                      }
                    });
    
                  this.printingservice.save_claim_request_detail(this.printclaim_entry)
    
                    .subscribe((response) => {
                      if (response.status == 200) {
                        alert('PrintClaim Registered successfully');
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
