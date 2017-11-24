import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
//import { FormBuilder, FormGroup } from '@angular/forms';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { MedicalClaim_Model } from '../../models/medicalclaim_model';
import { MasterClaim_Model } from '../../models/masterclaim_model';
import { MedicalClaim_Service } from '../../services/medicalclaim_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';

 import { Camera, CameraOptions } from '@ionic-native/camera';
//import {Camera} from 'ionic-native';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';

import {  LoadingController, ActionSheetController,  Platform, Loading, ToastController } from 'ionic-angular';


/**
 * Generated class for the MedicalclaimPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-medicalclaim',
  templateUrl: 'medicalclaim.html', providers: [MedicalClaim_Service, BaseHttpService, FileTransfer]
})
export class MedicalclaimPage {
  isReadyToSave: boolean;
  medicalclaim_entry: MedicalClaim_Model = new MedicalClaim_Model();
  masterclaim_entry: MasterClaim_Model = new MasterClaim_Model();
  Mcform: FormGroup;
  private myData: any;

  baseResourceUrl1: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_claim_request' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url1: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/claim_request_detail' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
  public Exist_Record: boolean = false;

  public Medical_Date_ngModel:any;
  public Medical_Amount_ngModel:any;
  public Medical_Description_ngModel: any;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private medicalservice: MedicalClaim_Service, private alertCtrl: AlertController, private camera: Camera,  public actionSheetCtrl: ActionSheetController, private loadingCtrl: LoadingController, private file: File, private filePath: FilePath, private transfer: FileTransfer, public toastCtrl: ToastController ) {
    this.Mcform = fb.group({

      //mcname: '',
      date: ['', Validators.required],
      amount: ['', Validators.required],
      description: ['', Validators.required],

    });
    this.Medical_Date_ngModel = new Date().toISOString();
    //this.entertainment_entry.UPDATE_TS = new Date().toISOString();

    this.Mcform.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.Mcform.valid;
    });
   

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad MedicalclaimPage');
  }

  save(){
    
    //debugger;
    //this.getImage();
    //this.uploadFile();
      if (this.Mcform.valid) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        let url: string;
        let request_id = UUID.UUID();
        //url = this.baseResource_Url + "claim_request_detail?filter=(DESCRIPTION=" + this.Medical_Description_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
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
                this.medicalclaim_entry.DESCRIPTION = this.Medical_Description_ngModel.trim();
                this.medicalclaim_entry.CLAIM_AMOUNT = this.Medical_Amount_ngModel.trim();
                //this.medicalclaim_entry.CLAIM_AMOUNT = this.Medical_Date_ngModel.trim();
                //this.entertainment2_entry.ATTACHMENT_ID = this.Entertainment_FileUpload_ngModel.trim();

                this.masterclaim_entry.CLAIM_AMOUNT = this.Medical_Amount_ngModel.trim();
                this.masterclaim_entry.CLAIM_REQUEST_GUID = UUID.UUID();
                this.masterclaim_entry.CREATION_TS = new Date().toISOString();
                this.masterclaim_entry.UPDATE_TS = new Date().toISOString();
                
        this.medicalclaim_entry.CLAIM_REQUEST_DETAIL_GUID = UUID.UUID();
        this.medicalclaim_entry.CREATION_TS = new Date().toISOString();
        this.medicalclaim_entry.CREATION_USER_GUID = '1';
        this.medicalclaim_entry.UPDATE_TS = new Date().toISOString();
        this.medicalclaim_entry.UPDATE_USER_GUID = "";
      //this.uploadFile();

      this.medicalservice.save_main_claim_request(this.masterclaim_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          //alert('Medicalclaim Registered successfully');
          //location.reload();
          this.navCtrl.setRoot(this.navCtrl.getActive().component);
        }
      });

        this.medicalservice.save_claim_request_detail(this.medicalclaim_entry)
          .subscribe((response) => {
            if (response.status == 200) {
              alert('Medicalclaim Registered successfully');
              //location.reload();
              this.navCtrl.setRoot(this.navCtrl.getActive().component);
            }
          });
      }
    }
    else {
      console.log("Records Found");
      alert("The Medicalclaim is already Exist.")
      
    }
    
    },
    err => {
    this.Exist_Record = false;
    console.log("ERROR!: ", err);
    });
    }
    
    }

}
