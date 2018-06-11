import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, ModalController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import * as constants from '../../config/constants';     
//import * as constants_home from '../../app/config/constants_home';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MainClaimReferanceModel } from '../../models/main-claim-ref.model';     
import { MainClaimRequestModel } from '../../models/main-claim-request.model';
import { ImageUpload_model } from '../../models/image-upload.model';
//import { TravelClaim_Model } from '../../models/travelclaim_model';
//import { TravelClaim_Service } from '../../services/travelclaim_service';
import { Services } from '../Services';
import { BaseHttpService } from '../../services/base-http';
import { UUID } from 'angular2-uuid';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { LoadingController, ActionSheetController, Platform, Loading, ToastController } from 'ionic-angular';
import {Router, Request, Response, NextFunction} from 'express';
import {AddTollPage} from '../../pages/add-toll/add-toll.component';
import {HttpClient, HttpParams, HttpRequest, HttpEvent} from '@angular/common/http'; 
import { ApiManagerProvider } from '../../providers/api-manager.provider';
import { ProfileManagerProvider } from '../../providers/profile-manager.provider';
import { DecimalPipe } from '@angular/common';
import { UserclaimslistPage } from '../../pages/userclaimslist/userclaimslist';
import { DashboardPage } from '../dashboard/dashboard';

@IonicPage()
@Component({
  selector: 'page-travelclaim',
  templateUrl: 'travel-claim.html', providers: [Services, BaseHttpService, FileTransfer, DecimalPipe]
})
export class TravelclaimPage {         
  isReadyToSave: boolean; 
 
  vehicles: any[];
  customers: any[]; 
  storeCustomers: any[]; 
  storeProjects: any[]; 
  public projects: any[];
  Travelform: FormGroup;
  TenantGUID: any;
  userGUID: any;
  items: string[];  
  public assignedTo: any;
  public profileLevel: any; 
  public stage: any;
  public profileJSON: any;

  public Travel_Date_ngModel: any;
  public Travel_Description_ngModel: any;
  public Travel_SOC_No_ngModel: any;
  public Travel_ProjectName_ngModel: any;
  public Start_DT_ngModel: any;
  public End_DT_ngModel: any;
  public Travel_From_ngModel: any;
  public Travel_Destination_ngModel: any;
  public Travel_Distance_ngModel: any;
  public Travel_Mode_ngModel: any;
  public Travel_Amount_ngModel: any;
  Project_Lookup_ngModel: any;
  Travel_Customer_ngModel: any;
  Customer_Lookup_ngModel: any;
  Customer_GUID: any; 
  Soc_GUID: any;
  isFormSubmitted = false;
  tollParkLookupClicked = false;

  //public socGUID : any;
  public AddTravelClicked: boolean = false;
  ProjectLookupClicked: boolean = false;
  CustomerLookupClicked: boolean = false; 
  public AddLookupClicked: boolean = false;
  public AddToLookupClicked: boolean = false;
  currentItems: any;
  public MainClaimSaved: boolean = false;
  claimFor: string = 'seg_customer';
  DestinationPlaceID: string;
  OriginPlaceID: string;
  CloudFilePath: string;
  uploadFileName: string;
  loading = false;
  Travel_Type_ngModel: any;
  VehicleId: any;
  VehicleRate: any;
  travelAmount: number;
  validDate = new Date().toISOString();
  ClaimRequestMain: any;
  isCustomer: boolean = true;
  claimDetailsData: any[];
  tollParkAmount: number = 0;
  travelAmountNgmodel: any;
  PublicTransValue: boolean = false;
  chooseFile: boolean = false;
  ImageUploadValidation:boolean=false;



   /********FORM EDIT VARIABLES***********/
   vehicleCategory: any;
   isPublicTransport: boolean = false;
   isFormEdit: boolean = false;
   claimRequestGUID: any;
   claimRequestData: any;

   ngOnInit() {
    if (this.isFormEdit)
      {this.GetDataforEdit();
    this.isFormSubmitted = true;
    this.MainClaimSaved=true;}
  }

   constructor(public numberPipe: DecimalPipe, public profileMng: ProfileManagerProvider, public api: ApiManagerProvider, platform: Platform, public navCtrl: NavController, public viewCtrl: ViewController, public modalCtrl: ModalController, public navParams: NavParams, public translate: TranslateService, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private api1: Services, private alertCtrl: AlertController, private camera: Camera, public actionSheetCtrl: ActionSheetController, private loadingCtrl: LoadingController, private file: File, private filePath: FilePath, private transfer: FileTransfer, public toastCtrl: ToastController) 
  {
    this.userGUID = localStorage.getItem('g_USER_GUID');
    this.isFormEdit = this.navParams.get('isFormEdit');
    this.claimRequestGUID = this.navParams.get('cr_GUID');
    this.TenantGUID = localStorage.getItem('g_TENANT_GUID'); 
    if (this.isFormEdit)
    this.GetDataforEdit();
  else {
    this.LoadCustomers();
    this.LoadProjects();
    this.LoadVehicles();
  }
    this.Travelform = fb.group({
      avatar: null,
      soc_no: '',
      distance: '', 
      uuid: '',
      travelType: '',
      //PublicTransValidation: ['', Validators.required],
      travel_date: '',
      destination: ['', Validators.required],
      start_DT: ['', Validators.required],
      end_DT: ['', Validators.required], 
      description: ['', Validators.required],
      origin: ['', Validators.required],
      vehicleType: ['', Validators.required],
      claimTypeGUID: '',
      meal_allowance: '',
      attachment_GUID: '',
      //travel_amount: ['', Validators.required],
      claim_amount: ['', Validators.required]
    });   
    if (this.isFormEdit)
    this.GetDataforEdit();   
  } 
  
  //  GetDataforEdit() {
  //   this.http
  //     .get(Services.getUrl('main_claim_request', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID))
  //     .map(res => res.json())
  //     .subscribe(data => {
  //       this.claimRequestData = data["resource"];
  //       console.log(this.claimRequestData)
  //       if (this.claimRequestData[0].SOC_GUID === null) {
  //         this.claimFor = 'customer'
  //         this.storeCustomers.forEach(element => {
  //           if (element.CUSTOMER_GUID === this.claimRequestData[0].CUSTOMER_GUID) {
  //             this.Customer_Lookup_ngModel = element.NAME
  //           }
  //         });
  //       }
  //       else {
  //         this.claimFor = 'project'
  //         this.storeProjects.forEach(element => {
  //           if (element.SOC_GUID === this.claimRequestData[0].SOC_GUID) {
  //             this.Project_Lookup_ngModel = element.project_name
  //             this.Travel_SOC_No_ngModel = element.soc
  //           }
  //         });
  //       }       
  //       this.Travel_Date_ngModel = new Date(this.claimRequestData[0].TRAVEL_DATE).toISOString();       
  //       this.Start_DT_ngModel = new Date(this.claimRequestData[0].START_TS).toISOString();   
  //       this.End_DT_ngModel = new Date(this.claimRequestData[0].END_TS).toISOString();              
  //       this.Travel_From_ngModel = this.claimRequestData[0].FROM;
  //       this.Travel_Destination_ngModel = this.claimRequestData[0].DESTINATION;
  //       this.Travel_Distance_ngModel = this.claimRequestData[0].DISTANCE_KM;
  //       this.travelAmount =this.travelAmount = this.numberPipe.transform(this.claimRequestData[0].CLAIM_AMOUNT, '1.2-2');
        
  //      // this.travelAmount = this.claimRequestData[0].CLAIM_AMOUNT
  //       //this.Travel_Amount_ngModel = this.claimRequestData[0].CLAIM_AMOUNT;
  //      // this.Travel_Amount_ngModel = '1015.00';
  //       //console.log(this.claimRequestData[0].CLAIM_AMOUNT);
  //       //this.Travel_Amount_ngModel = this.claimRequestData[0].MILEAGE_AMOUNT;
  //       this.Travel_Description_ngModel = this.claimRequestData[0].DESCRIPTION;
  //       this.Travel_Mode_ngModel = this.claimRequestData[0].MILEAGE_GUID;
  //       console.log(this.claimRequestData[0].MILEAGE_GUID);
  //      console.table(this.vehicles);
  //       this.vehicles.forEach(element => {
  //         if (element.MILEAGE_GUID === this.claimRequestData[0].MILEAGE_GUID) {
  //           this.Travel_Mode_ngModel = element.CATEGORY;
  //           console.log(element.CATEGORY);
  //         }
  //       });       
  //     }
  //     );
  // } 
  getCurrency(amount: number) {
    this.travelAmountNgmodel = this.numberPipe.transform(amount, '1.2-2');
    this.totalClaimAmount = amount;
  }

  totalClaimAmount: number;
  ionViewWillEnter() {
    if(!this.isFormEdit)
    this.LoadClaimDetails();

  }

  imageURLEdit: any = null
  GetDataforEdit() {
    //TODO: Take data by Effective Date
    this.api.getApiModel('main_mileage', 'filter=TENANT_GUID=' + this.TenantGUID)
      .subscribe(data => {
        this.vehicles = data["resource"];
        this.api.getApiModel('main_customer', 'filter=TENANT_GUID=' + this.TenantGUID)
          .subscribe(data => {
            this.storeCustomers = this.customers = data["resource"];
            this.api.getApiModel('soc_registration', 'filter=TENANT_GUID=' + this.TenantGUID)
              .subscribe(data => {
                this.storeProjects = this.projects = data["resource"];

                this.api.getApiModel('main_claim_request', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID)
                  .subscribe(data => {
                    this.claimRequestData = data["resource"];

                    if (this.claimRequestData[0].ATTACHMENT_ID !== null)
                    this.imageURLEdit = this.api.getImageUrl(this.claimRequestData[0].ATTACHMENT_ID);

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
                            this.Travel_SOC_No_ngModel = element.soc
                          }
                        });
                    }
                    this.Start_DT_ngModel = new Date(this.claimRequestData[0].START_TS).toISOString();
                    this.End_DT_ngModel = new Date(this.claimRequestData[0].END_TS).toISOString();
                    this.Travel_Mode_ngModel = this.claimRequestData[0].MILEAGE_GUID;

                    this.Travel_From_ngModel = this.claimRequestData[0].FROM;
                    this.Travel_Destination_ngModel = this.claimRequestData[0].DESTINATION;
                    this.Travel_Distance_ngModel = this.claimRequestData[0].DISTANCE_KM;
                    this.travelAmountNgmodel = this.travelAmount = this.claimRequestData[0].MILEAGE_AMOUNT
                    this.LoadClaimDetails();
                    this.Travel_Description_ngModel = this.claimRequestData[0].DESCRIPTION
                    this.vehicles.forEach(element => {
                      if(this.claimRequestData[0].MILEAGE_GUID==='427b1ef9-6474-297c-acac-a430199ab882')
                      this.isPublicTransport=true;
                      if (element.MILEAGE_GUID === this.claimRequestData[0].MILEAGE_GUID) {
                        this.Travel_Mode_ngModel = element.CATEGORY
                      }
                    });
                    if(this.claimRequestData[0].TRAVEL_TYPE==='1'){
                      this.Travel_Type_ngModel = 'Outstation'
                      this.isTravelLocal = false;
                    }
                    
                    else 
                    this.Travel_Type_ngModel = 'Local'
                    this.isTravelLocal = true;

                  }
                  );
              });
          })
      })

  }
 
  

  GetSocNo(item: any){
    this.Travel_SOC_No_ngModel = item.soc;
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
    this.api.getApiModel('soc_registration', 'filter=TENANT_GUID=' + this.TenantGUID)
      .subscribe(data => {
        this.storeProjects = this.projects = data["resource"];
      })
  }

  LoadCustomers() {
    this.api.getApiModel('main_customer', 'filter=TENANT_GUID=' + this.TenantGUID)
      .subscribe(data => {
        this.storeCustomers = this.customers = data["resource"];
      })
  }

  LoadVehicles() {
    this.api.getApiModel('main_mileage', 'filter=TENANT_GUID=' + this.TenantGUID)
      .subscribe(data => {
        this.vehicles = data["resource"];
      })
  }

  LoadClaimDetails() {
    return new Promise((resolve, reject) => {
      this.api.getApiModel('view_claim_details', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID).subscribe(res => {
        this.claimDetailsData = res['resource'];
        this.claimDetailsData.forEach(element => {
          if (element.ATTACHMENT_ID !== null)
            element.ATTACHMENT_ID = this.api.getImageUrl(element.ATTACHMENT_ID);
          this.tollParkAmount += element.AMOUNT;
        });
        if (this.isFormSubmitted) {
          this.totalClaimAmount = this.travelAmount + this.tollParkAmount
        }
        else
          this.totalClaimAmount = 0;
        resolve(this.tollParkAmount);
      })
    });
  }

  // allowanceList: any
  // LoadAllowanceDetails() {
  //   this.api.getApiModel('main_allowance').subscribe(res => {
  //     this.allowanceList = res['resource'];
  //   })
  // }

  GetDistance() {
    let url = 'http://api.zen.com.my/api/v2/google/distancematrix/json?destinations=place_id:' + this.DestinationPlaceID + '&origins=place_id:' + this.OriginPlaceID + '&api_key=' + constants.DREAMFACTORY_API_KEY;
    // let destination;
    // let DistKm: string = this.api.GetGoogleDistance(url);
    // if (DistKm != undefined) {
    //   this.Travel_Distance_ngModel = destination = DistKm.substring(0, DistKm.length - 2)
    //   this.Travel_Mode_ngModel = this.vehicleCategory;
    //   this.travelAmount = destination * this.VehicleRate, -2;
    // }
    var origin = this.Travel_From_ngModel;
    var destination:any;
    this.http.get(url).map(res => res.json()).subscribe(data => {
      let temp = data["rows"][0]["elements"][0];
      // console.table(data)
      if (temp["distance"] != null) {
        let DistKm: string = data["rows"][0]["elements"][0]["distance"]["text"];
        // console.log(DistKm)
        DistKm = DistKm.replace(',', '')
        this.Travel_Distance_ngModel = destination = DistKm.substring(0, DistKm.length - 2)
        this.Travel_Distance_ngModel = this.numberPipe.transform(this.Travel_Distance_ngModel, '1.2-2');
        this.Travel_Mode_ngModel = this.vehicleCategory;
        if (!this.isPublicTransport)
          this.travelAmount = destination * this.VehicleRate, -2;
        this.travelAmountNgmodel = this.numberPipe.transform(this.travelAmount, '1.2-2');
        this.totalClaimAmount = this.travelAmount ;
        // this.Travel_Amount_ngModel 
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
    if (this.Travel_From_ngModel != undefined && this.Travel_Destination_ngModel != undefined) {
      this.GetDistance();
    }   
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
    //this.AddLookupClicked = true;
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

  searchLocation(key: any) {
    let val = key.target.value;
    val = val.replace(/ /g, '');
    if (!val || !val.trim()) {
      this.currentItems = [];
      return;
    }
    var url = 'http://api.zen.com.my/api/v2/google/place/autocomplete/json?json?radius=50000&input=' + val + '&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http.get(url).map(res => res.json()).subscribe(data => {
      this.currentItems = data["predictions"];
      console.table(this.currentItems);
    });
  }

// Search project start:
    
  searchProject(searchString: any) {
    let val = searchString.target.value;
    if (!val || !val.trim()) {
      this.projects = this.storeProjects;
      return;
    }
   this.projects=  this.filterProjects({
    project_name: val, soc: val
    });
  }


  filterProjects(params?: any) {
    if (!params) {
      return this.storeProjects;
    }

    return this.projects.filter((item) => {
      for (let key in params) {
        let field = item[key];
        if (typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
          return item;
        } else if (field == params[key]) {
          return item;
        }
      }
      return null;
    });
  }
  
  searchCustomer(searchString: any) {
    let val = searchString.target.value;
    if (!val || !val.trim()) {
      this.customers = this.storeCustomers;
      return;
    }
    this.customers = this.filterCustomer({
      NAME: val
    });
  }

  filterCustomer(params?: any) {
    if (!params) {
      return this.storeCustomers;
    }

    return this.customers.filter((item) => {
      for (let key in params) {
        let field = item[key];
        if (typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
          return item;
        } else if (field == params[key]) {
          return item;
        }
      }
      return null;
    });
  }

  showAddToll(claimDetailGuid:string) {
    this.CloseTollParkLookup();
    this.navCtrl.push(AddTollPage, {
      // MainClaim: localStorage.getItem("g_CR_GUID"),
     ClaimReqDetailGuid:claimDetailGuid,
      ClaimMethod: '03048acb-037a-11e8-a50c-00155de7e742',
      ClaimMethodName: 'Toll'
    });
  }

  showAddParking(claimDetailGuid:string) {
    this.CloseTollParkLookup();
    this.navCtrl.push(AddTollPage, {
      // MainClaim: localStorage.getItem("g_CR_GUID"),
      ClaimReqDetailGuid:claimDetailGuid,
      ClaimMethod: '0ebb7e5f-037a-11e8-a50c-00155de7e742',
      ClaimMethodName: 'Parking'
    });
  }

  showAddAccommodation(claimDetailGuid:string) {
    this.CloseTollParkLookup();
    this.navCtrl.push(AddTollPage, {
      // MainClaim: localStorage.getItem("g_CR_GUID"),
      ClaimReqDetailGuid:claimDetailGuid,
      ClaimMethod: '0ebb7e5f-037a-11e8-a50c-ssh55de7e742',
      ClaimMethodName: 'Accommodation'
    });
  }



  showMealAllowance(claimDetailGuid:string) {
   this.CloseTollParkLookup();
    this.api.getApiModel('claim_request_detail', 'filter=(CLAIM_REQUEST_GUID=' + this.claimRequestGUID + ')AND(CLAIM_METHOD_GUID=0ebb7e5f-ssha-11e8-a50c-ssh55de7e742)').subscribe(data => {
      //if (data['resource'].length != 1) { alert('data available'); return; }
      this.navCtrl.push(AddTollPage, {
        // MainClaim: localStorage.getItem("g_CR_GUID"),
        ClaimReqDetailGuid:claimDetailGuid,
        ClaimMethod: '0ebb7e5f-ssha-11e8-a50c-ssh55de7e742',
        ClaimMethodName: 'Meal Allowance'
      });
    })
  }


  onVehicleSelect(vehicle: any) { 
    this.VehicleId = vehicle.MILEAGE_GUID;
    this.VehicleRate = vehicle.RATE_PER_UNIT;
    this.vehicleCategory = vehicle.CATEGORY;
    let origin = this.Travel_From_ngModel;
    let destination = this.Travel_Destination_ngModel;
    this.PublicTransValue = true;
    if (vehicle.CATEGORY === 'Public transport') {
      this.isPublicTransport = true;
      this.travelAmount = undefined;
      this.PublicTransValue = false;
    }
    else
      this.isPublicTransport = false;
    if (this.Travel_From_ngModel != undefined && this.Travel_Destination_ngModel != undefined) {
      this.GetDistance();
    }
  }

  allowanceGUID: any;
  onAllowanceSelect(allowance: any) {
    this.allowanceGUID = allowance.ALLOWANCE_GUID;
  }

   imageGUID: any;
  // onReceiveImageGUID(imageGUID: any) {
  //   this.PublicTransValue = true;
  //   this.imageGUID = imageGUID;
  // }
  displayImage: any
  CloseDisplayImage() {
    this.displayImage = false;
  }
  imageURL: string;
  DisplayImage(val: any) {
    this.displayImage = true;
    this.imageURL = val;
  }
  onFileChange(event: any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.Travelform.get('avatar').setValue(file);
      this.uploadFileName = file.name;
      reader.onload = () => {
        this.Travelform.get('avatar').setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result.split(',')[1]
        });
      };
    }
    //this.disableButton = false;
    //this.PublicTransValue = true;
    // this.PublicTransValue = false;

    this.ImageUploadValidation=true;


  }

 // imageGUID: any;
  // saveIm() {
  //   let uploadImage = this.UploadImage();
  //   uploadImage.then((resJson) => {
  //     console.table(resJson)
  //     let imageResult = this.SaveImageinDB();
  //     imageResult.then((objImage: ImageUpload_model) => {
       
  //       //let result = this.submitAction(objImage.Image_Guid, formValues);
  //       this.imageGUID = objImage.Image_Guid
  //     })
  //   })
  //   // setTimeout(() => {
  //   //   this.loading = false;
  //   // }, 1000);
  // }
  disableButton: any;
  saveIm() {
    let uploadImage = this.UploadImage();
    uploadImage.then((resJson) => {
      //this.imageGUID(this.uploadFileName, formvalues)
      // console.table(resJson)
      // let imageResult = this.SaveImageinDB();
      // imageResult.then((objImage: ImageUpload_model) => {      
        
        //  this.imageGUID = objImage.Image_Guid
        this.imageGUID = this.uploadFileName;
        // , formvalues
        //this.disableButton = true;
        //this.PublicTransValue = false;
         this.PublicTransValue = true;

        this.ImageUploadValidation=false;


       
      // })
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
      this.http.post('http://api.zen.com.my/api/v2/files/' + this.CloudFilePath + this.uploadFileName, this.Travelform.get('avatar').value, options)
        .map((response) => {
          return response;
        }).subscribe((response) => {
          resolve(response.json());
        })
    })
  }

  validateDate() {
    let today = Date.parse(new Date().toISOString())
    let start = Date.parse(this.Start_DT_ngModel)
    let end = Date.parse(this.End_DT_ngModel)
    if (start > end || today < start) {
      alert('The Date Range is not valid.')
      return false;
    }
    return true;
  }

  TollParkLookup() {
    this.tollParkLookupClicked = true;
    this.LoadClaimDetails();
    this.tollParkAmount = 0;
  }
  CloseTollParkLookup() {
    this.tollParkLookupClicked = false;
  }

  isTravelLocal: any;
  onTravelTypeSelect(value: any) {
    if (value === 'Local') this.isTravelLocal = true;
    else this.isTravelLocal = false;
  }


  // submitAction(formValues: any) {
  //   if (this.validateDate())
  //   formValues.travel_date = formValues.start_DT
  //   formValues.claimTypeGUID = '58c59b56-289e-31a2-f708-138e81a9c823';
  //   formValues.meal_allowance = this.allowanceGUID;
  //   formValues.distance = this.Travel_Distance_ngModel;
  //   formValues.vehicleType = this.VehicleId;
  //   formValues.attachment_GUID = this.imageGUID;
  //   formValues.soc_no = this.isCustomer ? this.Customer_GUID : this.Soc_GUID;
  //   this.profileMng.save(formValues, this.travelAmount, this.isCustomer)
  //   this.MainClaimSaved = true;
  // }

  // submitAction(formValues: any) {
  //   let status: string;
  //   if (this.validateDate()) {
  //     if (!this.isFormSubmitted) {
  //       this.isFormSubmitted = true;
  //       formValues.uuid = this.claimRequestGUID = UUID.UUID();
  //       formValues.travel_date = formValues.start_DT
  //       formValues.claimTypeGUID = '58c59b56-289e-31a2-f708-138e81a9c823';
  //       formValues.meal_allowance = this.allowanceGUID;
  //       formValues.distance = this.Travel_Distance_ngModel;
  //       formValues.vehicleType = this.VehicleId;
  //       formValues.attachment_GUID = this.imageGUID;
  //       formValues.soc_no = this.isCustomer ? this.Customer_GUID : this.Soc_GUID;

  //       this.profileMng.save(formValues, this.travelAmount, this.isCustomer)
  //       this.MainClaimSaved = true;
  //     }
  //     else {
  //       this.api.getApiModel('main_claim_request', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID)
  //       .subscribe(data => {
  //         this.claimRequestData = data;
  //         this.claimRequestData["resource"][0].STATUS = 'Pending';
  //         this.api.updateApiModel('main_claim_request',this.claimRequestData).subscribe(res => alert('Claim details are submitted successfully.'))

  //       })
  //       this.profileMng.save(formValues, this.travelAmount, this.isCustomer)
  //       this.MainClaimSaved = true;
  //     }
  //   }
  // }

  submitAction(formValues: any) {
    let status: string;
    if (this.validateDate()) {
      if (!this.isFormSubmitted) {
        this.isFormSubmitted = true;
        formValues.uuid = this.claimRequestGUID = UUID.UUID();
        formValues.travel_date = formValues.start_DT
        formValues.claimTypeGUID = '58c59b56-289e-31a2-f708-138e81a9c823';
        formValues.meal_allowance = this.allowanceGUID;
        formValues.distance = this.Travel_Distance_ngModel;
        formValues.vehicleType = this.VehicleId;
        formValues.attachment_GUID = this.imageGUID;
        formValues.soc_no = this.isCustomer ? this.Customer_GUID : this.Soc_GUID;

        this.profileMng.save(formValues, this.travelAmountNgmodel, this.isCustomer)
        this.MainClaimSaved = true;
      }
      else {
        this.api.getApiModel('main_claim_request', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID)
          .subscribe(data => {
            this.claimRequestData = data;
            this.claimRequestData["resource"][0].STATUS = 'Pending';

            this.claimRequestData["resource"][0].MILEAGE_GUID = this.VehicleId;
            this.claimRequestData["resource"][0].TRAVEL_DATE = formValues.start_DT;
            this.claimRequestData["resource"][0].START_TS = formValues.start_DT;
            this.claimRequestData["resource"][0].END_TS = formValues.end_DT;
            this.claimRequestData["resource"][0].MILEAGE_AMOUNT = this.travelAmountNgmodel;
            this.claimRequestData["resource"][0].CLAIM_AMOUNT = this.travelAmountNgmodel;
            this.claimRequestData["resource"][0].UPDATE_TS = new Date().toISOString();
            this.claimRequestData["resource"][0].FROM = formValues.origin;
            this.claimRequestData["resource"][0].DESTINATION = formValues.destination;
            this.claimRequestData["resource"][0].DISTANCE_KM = this.Travel_Distance_ngModel;
            this.claimRequestData["resource"][0].DESCRIPTION = formValues.description;
            this.claimRequestData["resource"][0].ATTACHMENT_ID = this.imageGUID;
            this.claimRequestData["resource"][0].TRAVEL_TYPE = formValues.travelType === 'Outstation' ? '1' : '0';

            if (this.isCustomer) {
              this.claimRequestData["resource"][0].CUSTOMER_GUID = this.Customer_GUID;
            }
            else {
              this.claimRequestData["resource"][0].SOC_GUID = this.Soc_GUID;
            }

            this.api.updateApiModel('main_claim_request', this.claimRequestData).subscribe(res => {
              alert('Claim details are submitted successfully.')
              this.navCtrl.push(UserclaimslistPage);
            })
          })
        // this.profileMng.save(formValues, this.travelAmount, this.isCustomer)
        // this.MainClaimSaved = true;
      }
    }
  }

  EditDetail(claimDetailId:string,claimMethodGuid:string)
  {
if(claimMethodGuid==='03048acb-037a-11e8-a50c-00155de7e742')
   {this.showAddToll(claimDetailId)  }
  else if(claimMethodGuid==='0ebb7e5f-037a-11e8-a50c-00155de7e742')
   {this.showAddParking(claimDetailId)  }
  else if(claimMethodGuid==='0ebb7e5f-ssha-11e8-a50c-ssh55de7e742')
   {this.showMealAllowance(claimDetailId)  }
 else  if(claimMethodGuid==='0ebb7e5f-037a-11e8-a50c-ssh55de7e742')
   {this.showAddAccommodation(claimDetailId)  }
   
  }
  DeleteDetail(claimDetailId:string){
    this.api.deleteApiModel('claim_request_detail',claimDetailId).subscribe(res =>{
      this.tollParkAmount = 0;
      this.LoadClaimDetails();
       alert('Claim detail has been deleted successfully.')});
  }
     
}
