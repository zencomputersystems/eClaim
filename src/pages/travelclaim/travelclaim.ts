import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
//import { FormBuilder, FormGroup } from '@angular/forms';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { TravelClaim_Model } from '../../models/travelclaim_model';
import { MasterClaim_Model } from '../../models/masterclaim_model';
import { TravelClaim_Service } from '../../services/travelclaim_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';

import { Camera, CameraOptions } from '@ionic-native/camera';
//import {Camera} from 'ionic-native';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';

import { LoadingController, ActionSheetController, Platform, Loading, ToastController } from 'ionic-angular';
/**
 * Generated class for the TravelclaimPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-travelclaim',
  templateUrl: 'travelclaim.html', providers: [TravelClaim_Service, BaseHttpService, FileTransfer]
})
export class TravelclaimPage {
  isReadyToSave: boolean;
  travelclaim_entry: TravelClaim_Model = new TravelClaim_Model();
  masterclaim_entry: MasterClaim_Model = new MasterClaim_Model();
  Travelform: FormGroup;

  baseResourceUrl1: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_claim_request?api_key=' + constants.DREAMFACTORY_API_KEY;
 // baseResource_Url1: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/claim_request_detail' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  
  baseResourceUrl_soc: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/soc_main' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
 // baseResource_Url_soc: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  public Exist_Record: boolean = false;
  public AddTravelClicked: boolean = false;

  public Travel_SOC_No_ngModel: any;
  public Travel_ProjectName_ngModel: any;
  public Travel_Date_ngModel: any;
  public Travel_From_ngModel: any;
  public Travel_Destination_ngModel: any;
  public Travel_Distance_ngModel: any;
  public Travel_ClaimAmount_ngModel: any;
  public Travel_Description_ngModel: any;
  //public Travel_Image_ngModel:any;
  public Travel_TotalAmount_ngModel: any;
  //public Entertainment_FileUpload_ngModel:any;
  //public myDate:any;
  public socs:any;
  public AddTravelClick() {

    this.AddTravelClicked = true;
  }

  public CloseTravelClick() {

    this.AddTravelClicked = false;
  }
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private travelservice: TravelClaim_Service, private alertCtrl: AlertController, private camera: Camera, public actionSheetCtrl: ActionSheetController, private loadingCtrl: LoadingController, private file: File, private filePath: FilePath, private transfer: FileTransfer, public toastCtrl: ToastController) 
  {
    this.Travelform = fb.group({

      //travelname: '',
      soc_no: '',
      project_name: '',
      travel_date: '',
      from: ['', Validators.required],
      destination: ['', Validators.required],
      distance: ['', Validators.required],
      claim_amount: ['', Validators.required],
      description: ['', Validators.required],
      //total_amount: ['', Validators.required],

    });
    this.Travel_Date_ngModel = new Date().toISOString();
    this.GetSocNo();
    
    //this.entertainment_entry.UPDATE_TS = new Date().toISOString();

    this.Travelform.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.Travelform.valid;
    });
  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad TravelclaimPage');
  }

  GetSocNo(){
     this.http
    .get(this.baseResourceUrl_soc)
    .map(res => res.json())
    .subscribe(data => {
      this.socs = data["resource"];
      
      
      if (this.Travel_SOC_No_ngModel == undefined) { return; }
      if (this.Travel_SOC_No_ngModel != "" || this.Travel_SOC_No_ngModel != undefined) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        let url: string;
        //let url1: string;
        url = this.baseResource_Url + "vw_socno?filter=(SOC_NO=" + this.Travel_SOC_No_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
       //url1 = this.baseResource_Url + "vw_socno?filter=(SOC_NO=" + this.Travel_SOC_No_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
        this.http.get(url, options)
          .map(res => res.json())
          .subscribe(
          data => {
            let res = data["resource"];
  
            if (res.length > 0) {
              this.Travel_ProjectName_ngModel = res[0].Project;
              // this.Entertainment_CustomerName_ngModel=res[0].customer;
            }
            else {
              alert('please enter valid soc no');
              //return;
              this.Travel_SOC_No_ngModel = "";
            }
          },
          err => {
            console.log("ERROR!: ", err);
          });
      }



      
    });
  }

  // SOC_No_TextBox_Onchange(Travel_SOC_No_ngModel: string) {
  //   console.log(this.Travel_SOC_No_ngModel);
  //   if (this.Travel_SOC_No_ngModel == undefined) { return; }
  //   if (this.Travel_SOC_No_ngModel != "" || this.Travel_SOC_No_ngModel != undefined) {
  //     let headers = new Headers();
  //     headers.append('Content-Type', 'application/json');
  //     let options = new RequestOptions({ headers: headers });
  //     let url: string;
  //     let url1: string;
  //     url = this.baseResource_Url + "vw_socno?filter=(SOC_NO=" + this.Travel_SOC_No_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
  //     url1 = this.baseResource_Url + "vw_socno?filter=(SOC_NO=" + this.Travel_SOC_No_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
  //     this.http.get(url, options)
  //       .map(res => res.json())
  //       .subscribe(
  //       data => {
  //         let res = data["resource"];

  //         if (res.length > 0) {
  //           this.Travel_ProjectName_ngModel = res[0].Project;
  //           // this.Entertainment_CustomerName_ngModel=res[0].customer;
  //         }
  //         else {
  //           alert('please enter valid soc no');
  //           //return;
  //           this.Travel_SOC_No_ngModel = "";
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
    if (this.Travelform.valid) {
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
              this.travelclaim_entry.FROM = this.Travel_From_ngModel.trim();
              this.travelclaim_entry.DESTINATION = this.Travel_Destination_ngModel.trim();
              this.travelclaim_entry.DISTANCE_KM = this.Travel_Distance_ngModel.trim();
              this.travelclaim_entry.DESCRIPTION = this.Travel_Description_ngModel.trim();
              this.travelclaim_entry.CLAIM_AMOUNT = this.Travel_ClaimAmount_ngModel.trim();
              this.travelclaim_entry.CLAIM_TYPE_GUID = this.masterclaim_entry.CLAIM_TYPE_GUID = "58c59b56-289e-31a2-f708-138e81a9c823";
              //alert(this.Travel_From_ngModel.trim() + this.Travel_Destination_ngModel.trim() + this.Travel_Distance_ngModel.trim());
              //alert( this.travelclaim_entry.FROM + this.travelclaim_entry.DESTINATION +  this.travelclaim_entry.DISTANCE_KM);
              // this.travelclaim_entry.CLAIM_AMOUNT = this.Travel_TotalAmount_ngModel.trim();
              //this.entertainment2_entry.ATTACHMENT_ID = this.Entertainment_FileUpload_ngModel.trim();

              // this.masterclaim_entry.CLAIM_REQUEST_GUID = this.Travel_Description_ngModel.trim();
              // this.masterclaim_entry.DESCRIPTION = this.Travel_ClaimAmount_ngModel.trim();
              this.masterclaim_entry.FROM = this.Travel_From_ngModel.trim();
              this.masterclaim_entry.DESTINATION = this.Travel_Destination_ngModel.trim();
              this.masterclaim_entry.DISTANCE_KM = this.Travel_Distance_ngModel.trim();
              this.masterclaim_entry.CLAIM_AMOUNT = this.Travel_ClaimAmount_ngModel.trim();
              this.masterclaim_entry.CLAIM_REQUEST_GUID = UUID.UUID();
              this.masterclaim_entry.CREATION_TS = new Date().toISOString();
              this.masterclaim_entry.UPDATE_TS = new Date().toISOString();
              //alert(this.masterclaim_entry.CLAIM_AMOUNT);

              this.travelclaim_entry.CLAIM_REQUEST_DETAIL_GUID = UUID.UUID();
              this.travelclaim_entry.CREATION_TS = new Date().toISOString();
              this.travelclaim_entry.CREATION_USER_GUID = '1';
              this.travelclaim_entry.UPDATE_TS = new Date().toISOString();
              this.travelclaim_entry.UPDATE_USER_GUID = "";


              //this.uploadFile();

              this.travelservice.save_main_claim_request(this.masterclaim_entry)
                .subscribe((response) => {
                  if (response.status == 200) {
                    //alert('Travelclaim Registered successfully');
                    //location.reload();
                    this.navCtrl.setRoot(this.navCtrl.getActive().component);
                  }
                });

              this.travelservice.save_claim_request_detail(this.travelclaim_entry)

                .subscribe((response) => {
                  if (response.status == 200) {
                    alert('Travelclaim Registered successfully');
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
