import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, ModalController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
//import { FormBuilder, FormGroup } from '@angular/forms';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../config/constants'
//import * as constants from '../../app/config/constants';        
//import * as constants_home from '../../app/config/constants_home';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ClaimRefMain_Model } from '../../models/ClaimRefMain_Model';
import { ClaimReqMain_Model } from '../../models/ClaimReqMain_Model';
//import { TravelClaim_Model } from '../../models/travelclaim_model';
//import { TravelClaim_Service } from '../../services/travelclaim_service';
import { Services } from '../Services';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';

import { Camera, CameraOptions } from '@ionic-native/camera';
//import {Camera} from 'ionic-native';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';

import { LoadingController, ActionSheetController, Platform, Loading, ToastController } from 'ionic-angular';
import {Router, Request, Response, NextFunction} from 'express';
import {AddTollPage} from '../../pages/add-toll/add-toll';
/**
 * Generated class for the TravelclaimPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-travelclaim',
  templateUrl: 'travelclaim.html', providers: [Services, BaseHttpService, FileTransfer]
})
export class TravelclaimPage {
  isReadyToSave: boolean;
  //travelclaim_entry: TravelClaim_Model = new TravelClaim_Model();
  //masterclaim_entry: MasterClaim_Model = new MasterClaim_Model();
 

 // baseResourceUrl1: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_claim_request?api_key=' + constants.DREAMFACTORY_API_KEY;
 // baseResource_Url1: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

 // baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/claim_request_detail' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  //baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  
  //baseResourceUrl_soc: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/soc_main' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
 // baseResource_Url_soc: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
  vehicles: any;
  storeProjects: any;

  public projects: any;
  Travelform: FormGroup;

  items: string[];  

  projects: any;
  Travelform: FormGroup;


  public Travel_SOC_No_ngModel: any;
  public Travel_ProjectName_ngModel: any;
  public Travel_From_ngModel: any;
  public Travel_Destination_ngModel: any;
  public Travel_Distance_ngModel: any;
  Travel_Amount_ngModel: any;
  public socGUID : any;
  public AddTravelClicked: boolean = false;
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
  validDate = new Date().toISOString();

  // public Travel_Date_ngModel: any;
  // public Travel_ClaimAmount_ngModel: any;
  // public Travel_Description_ngModel: any;
  // public Travel_TotalAmount_ngModel: any;
  // public socs:any;
  // public storeProjects: any;
  // public projects: any;
  // vehicles: any;
 

  // public AddTravelClick() {

  //   this.AddTravelClicked = true;
  // }

  // public CloseTravelClick() {

  //   this.AddTravelClicked = false;
  // }
  
  //   public AddLookupClick() 
  //   {
   
  //     this.AddLookupClicked = true;
  //   }
  
  
  //   public CloseLookupClick() {
  //     if (this.AddLookupClicked == true) {
  //       this.AddLookupClicked = false;
  //     }
   
  //   }
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private api: Services, private alertCtrl: AlertController, private camera: Camera, public actionSheetCtrl: ActionSheetController, private loadingCtrl: LoadingController, private file: File, private filePath: FilePath, private transfer: FileTransfer, public toastCtrl: ToastController) 
  {
    this.Travelform = fb.group({
      soc_no: '',
      distance: '',
      project_name: ['', Validators.required],
      travel_date:  ['', Validators.required],
      destination: ['', Validators.required],
      from: ['', Validators.required],
      start_DT: ['', Validators.required],
      end_DT: ['', Validators.required], 
      description: ['', Validators.required],
      origin: ['', Validators.required],
      vehicleType: ['', Validators.required],
     
      // distance: ['', Validators.required],
      // claim_amount: ['', Validators.required],
      //total_amount: ['', Validators.required],

    });
    // this.Travel_Date_ngModel = new Date().toISOString();
    //this.GetSocNo();
    //this.entertainment_entry.UPDATE_TS = new Date().toISOString();
    // this.Travelform.valueChanges.subscribe((v) => {
    //   this.isReadyToSave = this.Travelform.valid;
    // });
    this.LoadProjects();
    this.LoadVehicles();
  }

  GetSocNo(value:any){
    this.Travel_SOC_No_ngModel = value;
    console.log(this.Travel_SOC_No_ngModel);
  }

  LoadProjects() {
    this.http
      .get(Services.getUrl('soc_registration'))
      .map(res => res.json())
      .subscribe(data => {
      this.storeProjects=  this.projects = data["resource"];
        console.table(this.projects)
      }
      );
  }

  LoadVehicles() {
    this.http
      .get(Services.getUrl('main_mileage'))
      .map(res => res.json())
      .subscribe(data => {
        this.vehicles = data["resource"];
      }
      );
  }

  GetDistance() {
    var origin = this.Travel_From_ngModel;
    var destination = this.Travel_Destination_ngModel;
    var url = 'http://api.zen.com.my/api/v2/google/distancematrix/json?destinations=place_id:' + this.DestinationPlaceID + '&origins=place_id:' + this.OriginPlaceID + '&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http.get(url).map(res => res.json()).subscribe(data => {
      let temp = data["rows"][0]["elements"][0];
      // console.table(data)
      if (temp["distance"] != null) {
        let DistKm: string = data["rows"][0]["elements"][0]["distance"]["text"];
        // console.log(DistKm)
        DistKm = DistKm.replace(',', '')
        this.Travel_Distance_ngModel = DistKm.substring(0, DistKm.length - 2)
      }
      else
        alert('Please select Valid Origin & Destination Places');

    });
  }

  public CloseTravelClick() {
    this.AddToLookupClicked = false;
    this.AddTravelClicked = false;
  }

  public CloseLookupClick() {
    if (this.AddLookupClicked == true) {
      this.AddLookupClicked = false;
    }
    if (this.AddToLookupClicked == true) {
      this.AddToLookupClicked = false;
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

  openItem(item: any) {
    if (this.AddToLookupClicked) {
      this.Travel_Destination_ngModel = item.description;
      this.DestinationPlaceID = item.place_id
    }
    else {
      this.Travel_From_ngModel = item.description;
      this.OriginPlaceID = item.place_id;
    }
    this.CloseLookupClick();
  }

  searchLocation(searchLocationString: any) {
    let val = searchLocationString.target.value;
    if (!val || !val.trim()) {
      this.currentItems = [];
      return;
    }
    var url = 'http://api.zen.com.my/api/v2/google/place/autocomplete/json?json?radius=50000&input=' + val + '&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http.get(url).map(res => res.json()).subscribe(data => {
      this.currentItems = data["predictions"];
    });
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

  SetPrice(vehicle: any) {
    this.VehicleId = vehicle.MILEAGE_GUID;
    this.VehicleRate = vehicle.RATE_PER_UNIT;
    this.Travel_Amount_ngModel = this.Travel_Distance_ngModel * vehicle.RATE_PER_UNIT;
  }

  // filterProjects(params?: any) {
  //   if (!params) {

  //     //return this.storeProjects;
  //   }

  //     return this.projects.filter((item) =>{

  //     return this.storeProjects;
  //   }

  //   return this.projects.filter((item) => {

  //     for (let key in params) {
  //       let field = item[key];
  //       if (typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
  //         return item;
  //       } else if (field == params[key]) {
  //         return item;
  //       }
  //     }
  //     return null;
  //   });
  // }


  // filterProjects(ev: any) {
  //   alert('search');
  //   // Reset items back to all of the items
  //   this.storeProjects();

  //   // set val to the value of the searchbar
  //   let val = ev.target.value;

  //   // if the value is an empty string don't filter the items
  //   if (val && val.trim() != '') {
  //     this.items = this.items.filter((item) => {
  //       return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
  //     })
  //   }
  // }


  

  ionViewDidLoad() {
    console.log('ionViewDidLoad TravelclaimPage');
  }

  // GetSocNo(){
  //    this.http
  //   .get(this.baseResourceUrl_soc)
  //   .map(res => res.json())
  //   .subscribe(data => {
  //     this.socs = data["resource"];
      
      
  //     if (this.Travel_SOC_No_ngModel == undefined) { return; }
  //     if (this.Travel_SOC_No_ngModel != "" || this.Travel_SOC_No_ngModel != undefined) {
  //       let headers = new Headers();
  //       headers.append('Content-Type', 'application/json');
  //       let options = new RequestOptions({ headers: headers });
  //       let url: string;
  //       //let url1: string;
  //       url = this.baseResource_Url + "vw_socno?filter=(SOC_NO=" + this.Travel_SOC_No_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
  //      //url1 = this.baseResource_Url + "vw_socno?filter=(SOC_NO=" + this.Travel_SOC_No_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
  //       this.http.get(url, options)
  //         .map(res => res.json())
  //         .subscribe(
  //         data => {
  //           let res = data["resource"];
  
  //           if (res.length > 0) {
  //             this.Travel_ProjectName_ngModel = res[0].Project;
  //             // this.Entertainment_CustomerName_ngModel=res[0].customer;
  //           }
  //           else {
  //             alert('please enter valid soc no');
  //             //return;
  //             this.Travel_SOC_No_ngModel = "";
  //           }
  //         },
  //         err => {
  //           console.log("ERROR!: ", err);
  //         });
  //     }



      
  //   });
  // }

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


  save(value: any) {
    let userGUID = localStorage.getItem('g_USER_GUID');
    let tenantGUID = localStorage.getItem('g_TENANT_GUID');
    let month = new Date(value.travel_date).getMonth() + 1;
    let year = new Date(value.travel_date).getFullYear();
    let claimRefGUID;
    let url = Services.getUrl('main_claim_ref', 'filter=(USER_GUID=' + userGUID + ')AND(MONTH=' + month + ')AND(YEAR=' + year + ')');
    this.http
      .get(url)
      .map(res => res.json())
      .subscribe(claimRefdata => {
        if (claimRefdata["resource"][0] == null) {
          let claimReqRef: ClaimRefMain_Model = new ClaimRefMain_Model();
          claimReqRef.CLAIM_REF_GUID = UUID.UUID();
          claimReqRef.USER_GUID = userGUID;
          claimReqRef.TENANT_GUID = tenantGUID;
          claimReqRef.REF_NO = userGUID + '/' + month + '/' + year;
          claimReqRef.MONTH = month;
          claimReqRef.YEAR = year;
          claimReqRef.CREATION_TS = new Date().toISOString();
          claimReqRef.UPDATE_TS = new Date().toISOString();

          this.api.postData('main_claim_ref', claimReqRef.toJson(true)).subscribe((response) => {
            var postClaimRef = response.json();
            claimRefGUID = postClaimRef["resource"][0].CLAIM_REF_GUID;

            let claimReqMainRef: ClaimReqMain_Model = new ClaimReqMain_Model();
            claimReqMainRef.CLAIM_REQUEST_GUID = UUID.UUID();
            claimReqMainRef.TENANT_GUID = tenantGUID;
            claimReqMainRef.CLAIM_REF_GUID = claimRefGUID;
            claimReqMainRef.MILEAGE_GUID = this.VehicleId;
            claimReqMainRef.CLAIM_TYPE_GUID = '58c59b56-289e-31a2-f708-138e81a9c823';
            claimReqMainRef.TRAVEL_DATE = value.travel_date;
            claimReqMainRef.START_TS = value.start_DT;
            claimReqMainRef.END_TS = value.end_DT;
            claimReqMainRef.MILEAGE_AMOUNT = this.Travel_Amount_ngModel
            claimReqMainRef.CLAIM_AMOUNT = this.Travel_Amount_ngModel
            claimReqMainRef.CREATION_TS = new Date().toISOString();
            claimReqMainRef.UPDATE_TS = new Date().toISOString();
            claimReqMainRef.FROM = this.Travel_From_ngModel;
            claimReqMainRef.DESTINATION = this.Travel_Destination_ngModel;
            claimReqMainRef.DISTANCE_KM = this.Travel_Distance_ngModel;
            claimReqMainRef.SOC_GUID = this.Travel_SOC_No_ngModel;
            this.api.postData('main_claim_request', claimReqMainRef.toJson(true)).subscribe((response) => {
              var postClaimMain = response.json();
              this.ClaimRequestMain = postClaimMain["resource"][0].CLAIM_REQUEST_GUID;
              this.MainClaimSaved = true;
              alert('Claim Has Registered.')
            })
          })
        }
        else {
          claimRefGUID = claimRefdata["resource"][0].CLAIM_REF_GUID;

          let claimReqMainRef: ClaimReqMain_Model = new ClaimReqMain_Model();
          claimReqMainRef.CLAIM_REQUEST_GUID = UUID.UUID();
          claimReqMainRef.TENANT_GUID = tenantGUID;
          claimReqMainRef.CLAIM_REF_GUID = claimRefGUID;
          claimReqMainRef.MILEAGE_GUID = this.VehicleId;
          claimReqMainRef.CLAIM_TYPE_GUID = '58c59b56-289e-31a2-f708-138e81a9c823';
          claimReqMainRef.TRAVEL_DATE = value.travel_date;
          claimReqMainRef.START_TS = value.start_DT;
          claimReqMainRef.END_TS = value.end_DT;
          claimReqMainRef.MILEAGE_AMOUNT = this.Travel_Amount_ngModel;
          claimReqMainRef.CLAIM_AMOUNT = this.Travel_Amount_ngModel;
          claimReqMainRef.CREATION_TS = new Date().toISOString();
          claimReqMainRef.UPDATE_TS = new Date().toISOString();
          claimReqMainRef.FROM = this.Travel_From_ngModel;
          claimReqMainRef.DESTINATION = this.Travel_Destination_ngModel;
          claimReqMainRef.DISTANCE_KM = this.Travel_Distance_ngModel;
          claimReqMainRef.SOC_GUID = this.Travel_SOC_No_ngModel;
        this.api.postData('main_claim_request', claimReqMainRef.toJson(true)).subscribe((response) => {
            var postClaimMain = response.json();
            this.ClaimRequestMain = postClaimMain["resource"][0].CLAIM_REQUEST_GUID;  

            this.MainClaimSaved = true;
            alert('Claim Has Registered.')
          })
        }

      })
  }

  showAddToll() {
    //let AddTollModal = this.modalCtrl.create(AddTollPage);
    //AddTollModal.present;
    this.navCtrl.push(AddTollPage, {
      MainClaim: this.ClaimRequestMain,
      ClaimMethod: '03048acb-037a-11e8-a50c-00155de7e742'
    });
  }

  showAddParking() {
    this.navCtrl.push(AddTollPage, {
      MainClaim: this.ClaimRequestMain,
      ClaimMethod: '0ebb7e5f-037a-11e8-a50c-00155de7e742'
    });
  }
  ClaimRequestMain: any;

  // save(value: any) {

  //   if (this.Travelform.valid) {
  //     let headers = new Headers();
  //     headers.append('Content-Type', 'application/json');
  //     let options = new RequestOptions({ headers: headers });


  //     let url: string;
  //     let request_id = UUID.UUID();
  //     //url = this.baseResource_Url + "claim_request_detail?filter=(DESCRIPTION=" + this.Travel_Description_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
  //     url = this.baseResource_Url + "claim_request_detail?filter=(CLAIM_REQUEST_GUID=" + request_id + ')&api_key=' + constants.DREAMFACTORY_API_KEY;

  //     this.http.get(url, options)
  //       .map(res => res.json())
  //       .subscribe(
  //       data => {
  //         let res = data["resource"];
  //         if (res.length == 0) {
  //           console.log("No records Found");
  //           if (this.Exist_Record == false) {
  //             // this.entertainment_entry.SOC_GUID = this.Entertainment_SOC_No_ngModel.trim();
  //             this.travelclaim_entry.FROM = this.Travel_From_ngModel.trim();
  //             this.travelclaim_entry.DESTINATION = this.Travel_Destination_ngModel.trim();
  //             this.travelclaim_entry.DISTANCE_KM = this.Travel_Distance_ngModel.trim();
  //             this.travelclaim_entry.DESCRIPTION = this.Travel_Description_ngModel.trim();
  //             this.travelclaim_entry.CLAIM_AMOUNT = this.Travel_ClaimAmount_ngModel.trim();
  //             this.travelclaim_entry.CLAIM_TYPE_GUID = this.masterclaim_entry.CLAIM_TYPE_GUID = "58c59b56-289e-31a2-f708-138e81a9c823";
  //             //alert(this.Travel_From_ngModel.trim() + this.Travel_Destination_ngModel.trim() + this.Travel_Distance_ngModel.trim());
  //             //alert( this.travelclaim_entry.FROM + this.travelclaim_entry.DESTINATION +  this.travelclaim_entry.DISTANCE_KM);
  //             // this.travelclaim_entry.CLAIM_AMOUNT = this.Travel_TotalAmount_ngModel.trim();
  //             //this.entertainment2_entry.ATTACHMENT_ID = this.Entertainment_FileUpload_ngModel.trim();

  //             // this.masterclaim_entry.CLAIM_REQUEST_GUID = this.Travel_Description_ngModel.trim();
  //             // this.masterclaim_entry.DESCRIPTION = this.Travel_ClaimAmount_ngModel.trim();
  //             this.masterclaim_entry.FROM = this.Travel_From_ngModel.trim();
  //             this.masterclaim_entry.DESTINATION = this.Travel_Destination_ngModel.trim();
  //             this.masterclaim_entry.DISTANCE_KM = this.Travel_Distance_ngModel.trim();
  //             this.masterclaim_entry.CLAIM_AMOUNT = this.Travel_ClaimAmount_ngModel.trim();
  //             this.masterclaim_entry.CLAIM_REQUEST_GUID = UUID.UUID();
  //             this.masterclaim_entry.CREATION_TS = new Date().toISOString();
  //             this.masterclaim_entry.UPDATE_TS = new Date().toISOString();
  //             //alert(this.masterclaim_entry.CLAIM_AMOUNT);

  //             this.travelclaim_entry.CLAIM_REQUEST_DETAIL_GUID = UUID.UUID();
  //             this.travelclaim_entry.CREATION_TS = new Date().toISOString();
  //             this.travelclaim_entry.CREATION_USER_GUID = '1';
  //             this.travelclaim_entry.UPDATE_TS = new Date().toISOString();
  //             this.travelclaim_entry.UPDATE_USER_GUID = "";

  //             this.travelservice.save_main_claim_request(this.masterclaim_entry)
  //               .subscribe((response) => {
  //                 if (response.status == 200) {
  //                   //alert('Travelclaim Registered successfully');
  //                   //location.reload();
  //                   this.navCtrl.setRoot(this.navCtrl.getActive().component);
  //                 }
  //               });

  //             this.travelservice.save_claim_request_detail(this.travelclaim_entry)

  //               .subscribe((response) => {
  //                 if (response.status == 200) {
  //                   alert('Travelclaim Registered successfully');
  //                   //location.reload();
  //                   this.navCtrl.setRoot(this.navCtrl.getActive().component);
  //                 }
  //               });
  //           }
  //         }
  //         else {
  //           console.log("Records Found");
  //           alert("The Travelclaim is already Exist.")

  //         }
  //       },
  //       err => {
  //         this.Exist_Record = false;
  //         console.log("ERROR!: ", err);
  //       });
  //   }
  // }

}
