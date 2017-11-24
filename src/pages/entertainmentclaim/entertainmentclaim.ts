import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
//import { FormBuilder, FormGroup } from '@angular/forms';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { EntertainmentClaim_Model } from '../../models/entertainmentclaim_model';
import { MasterClaim_Model } from '../../models/masterclaim_model';
import { EntertainmentClaim_Service } from '../../services/entertainmentclaim_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';

 import { Camera, CameraOptions } from '@ionic-native/camera';
//import {Camera} from 'ionic-native';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';

import {  LoadingController, ActionSheetController,  Platform, Loading, ToastController } from 'ionic-angular';

/**
 * Generated class for the EntertainmentclaimPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-entertainmentclaim',
  templateUrl: 'entertainmentclaim.html', providers: [EntertainmentClaim_Service, BaseHttpService, FileTransfer]
})
export class EntertainmentclaimPage {
  //apiURL = 'http://localhost:8100';
  //@ViewChild('fileInput') fileInput: any;
  isReadyToSave: boolean;
  entertainment_entry: EntertainmentClaim_Model = new EntertainmentClaim_Model();
  masterclaim_entry: MasterClaim_Model = new MasterClaim_Model();
  Entertainmentform: FormGroup;
  private myData: any;

  baseResourceUrl1: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_claim_request' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url1: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/claim_request_detail' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  baseResourceUrl_soc: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/soc_main' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url_soc: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

 
  public Exist_Record: boolean = false;

  public base64Image: string;
  postTitle: any;
  desc: any;
  imageChosen: any = 0;
  imagePath: any;
  imageNewPath: any;
  public imageData: any;

  imageURI:any;
  imageFileName:any;
  public socs:any;
  public Entertainment_SOC_No_ngModel: any;
  public Entertainment_Date_ngModel:any;
  public Entertainment_ProjectName_ngModel:any;
  public Entertainment_CustomerName_ngModel:any;
  public Entertainment_ClaimAmount_ngModel:any;
  public Entertainment_Description_ngModel:any;
  //public Entertainment_Image_ngModel:any;
  //public Entertainment_FileUpload_ngModel:any;
  public myDate:any;
  
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private entertainmentservice: EntertainmentClaim_Service, private alertCtrl: AlertController, private camera: Camera,  public actionSheetCtrl: ActionSheetController, private loadingCtrl: LoadingController, private file: File, private filePath: FilePath, private transfer: FileTransfer, public toastCtrl: ToastController ) {
    
    

    this.Entertainmentform = fb.group({
      // 'Entertainmentform':['',  Validators.required],
      // profilePic: [''],
      // name: ['', Validators.required],
      // about: [''],
    

      entertainment_date: '',
      soc_no: '',
      project_name: '',
      customer_name: '',
      //description: '',
      description: ['', Validators.required],
      //claim_amount: '',
      claim_amount: ['', Validators.required],
      //image_file: ['', Validators.required]
      //claim_attachment:'',
     // upload_file: ['', Validators.required]

      

    });
   
    this.Entertainment_Date_ngModel = new Date().toISOString();
    this.GetSocNo();
    //this.entertainment_entry.UPDATE_TS = new Date().toISOString();

    this.Entertainmentform.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.Entertainmentform.valid;
    });
   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EntertainmentclaimPage');
  }

  GetSocNo(){
    this.http
    .get(this.baseResourceUrl_soc)
    .map(res => res.json())
    .subscribe(data => {
      this.socs = data["resource"];
      
      
      if (this.Entertainment_SOC_No_ngModel == undefined) { return; }
      if (this.Entertainment_SOC_No_ngModel != "" || this.Entertainment_SOC_No_ngModel != undefined) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        let url: string;
        let url1: string;
        url = this.baseResource_Url + "vw_socno?filter=(SOC_NO=" + this.Entertainment_SOC_No_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
        url1 = this.baseResource_Url + "vw_socno?filter=(SOC_NO=" + this.Entertainment_SOC_No_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
        this.http.get(url, options)
          .map(res => res.json())
          .subscribe(
          data => {
            let res = data["resource"];
  
            if (res.length > 0) {
              this.Entertainment_ProjectName_ngModel = res[0].Project;
               this.Entertainment_CustomerName_ngModel=res[0].customer;
            }
            else {
              alert('please enter valid soc no');
              //return;
              this.Entertainment_SOC_No_ngModel = "";
            }
          },
          err => {
            console.log("ERROR!: ", err);
          });
      }



      
    });
  }

//   SOC_No_TextBox_Onchange(Entertainment_SOC_No_ngModel: string){
//     console.log(this.Entertainment_SOC_No_ngModel);
//     if(this.Entertainment_SOC_No_ngModel == undefined){ return;}
//     if(this.Entertainment_SOC_No_ngModel != "" || this.Entertainment_SOC_No_ngModel != undefined){
//     let headers = new Headers();
//     headers.append('Content-Type', 'application/json');
//     let options = new RequestOptions({ headers: headers });
//     let url: string;
//     let url1: string;
//     url = this.baseResource_Url + "vw_socno?filter=(SOC_NO=" + this.Entertainment_SOC_No_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
//     url1 = this.baseResource_Url + "vw_socno?filter=(SOC_NO=" + this.Entertainment_SOC_No_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
//     this.http.get(url, options)
//       .map(res => res.json())
//       .subscribe(
//       data => {
//         let res = data["resource"];
        
//          if (res.length > 0) {
//           this.Entertainment_ProjectName_ngModel=res[0].Project;
//           this.Entertainment_CustomerName_ngModel=res[0].customer;
//          }
//          else{
//            alert('please enter valid soc no');
//            //return;
//            this.Entertainment_SOC_No_ngModel = "";
//          }
//       },
//       err => {          
//         console.log("ERROR!: ", err);
//       });
//   } 
// } 


save(){
  
  //debugger;
  //this.getImage();
  //this.uploadFile();
    if (this.Entertainmentform.valid) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      let url: string;
      let request_id = UUID.UUID();

     // url = this.baseResource_Url + "claim_request_detail?filter=(DESCRIPTION=" + this.Entertainment_Description_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
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
              this.entertainment_entry.DESCRIPTION = this.Entertainment_Description_ngModel.trim();
              this.entertainment_entry.CLAIM_AMOUNT = this.Entertainment_ClaimAmount_ngModel.trim();
              //this.entertainment_entry.CLAIM_TYPE_GUID = this.masterclaim_entry.CLAIM_TYPE_GUID = "6a1343a6-9c94-500b-7446-b150a31d753d";
              //this.entertainment2_entry.ATTACHMENT_ID = this.Entertainment_FileUpload_ngModel.trim();

              
              this.masterclaim_entry.CLAIM_AMOUNT = this.Entertainment_ClaimAmount_ngModel.trim();
              this.masterclaim_entry.CLAIM_REQUEST_GUID = UUID.UUID();
              this.masterclaim_entry.CREATION_TS = new Date().toISOString();
              this.masterclaim_entry.UPDATE_TS = new Date().toISOString();
             // this.masterclaim_entry.CREATION_USER_GUID = '1';
             // this.masterclaim_entry.UPDATE_USER_GUID = "";
            //  this.masterclaim_entry.TENANT_GUID = "";

     // this.entertainment2_entry.CLAIM_REQUEST_GUID = UUID.UUID();
      this.entertainment_entry.CLAIM_REQUEST_DETAIL_GUID = UUID.UUID();
      this.entertainment_entry.CREATION_TS = new Date().toISOString();
      this.entertainment_entry.CREATION_USER_GUID = '1';
      this.entertainment_entry.UPDATE_TS = new Date().toISOString();
      this.entertainment_entry.UPDATE_USER_GUID = "";
     // alert( this.entertainment2_entry.DESCRIPTION+this.entertainment2_entry.CLAIM_TYPE_GUID+this.masterclaim_entry.CLAIM_AMOUNT);
    //this.uploadFile();
      

        this.entertainmentservice.save_main_claim_request(this.masterclaim_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            //alert('Entertainment Registered successfully');
            //location.reload();
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        });

        this.entertainmentservice.save_claim_request_detail(this.entertainment_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            alert('Entertainment Registered successfully');
            //location.reload();
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        });
    }
  }
  else {
    console.log("Records Found");
    alert("The Entertainment is already Exist.")
    
  }
  
  },
  err => {
  this.Exist_Record = false;
  console.log("ERROR!: ", err);
  });
  }
  
  }

  // getImage() {
  //   const options: CameraOptions = {
  //     quality: 100,
  //     destinationType: this.camera.DestinationType.FILE_URI,
  //     sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
  //   }
  
  //   this.camera.getPicture(options).then((imageData) => {
  //     this.imageURI = imageData;
  //   }, (err) => {
  //     console.log(err);
  //     this.presentToast(err);
  //   });
  // }


  // uploadFile() {
  //   let loader = this.loadingCtrl.create({
  //     content: "Uploading..."
  //   });
  //   //loader.present();
  //   const fileTransfer: FileTransferObject = this.transfer.create();
  
  //   let options: FileUploadOptions = {
  //     fileKey: 'ionicfile',
  //     //fileName: 'ionicfile.jpg',
  //     fileName: 'pic',
  //     chunkedMode: true,
  //     mimeType: "image/jpeg",
  //     headers: {}
  //   }
  
  //   // fileTransfer.upload('C:/Users/pratap/Desktop/images/pic.jpg', this.baseResource_Url + "claim_request_detail?filter=(ATTACHMENT_ID=" + this.Entertainment_FileUpload_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY, options)
  //   fileTransfer.upload('this.imageURI', 'http://localhost:8100/assets/img/', options)
  //   .then((data) => {
  //     console.log(data+" Uploaded Successfully");
  //    // this.imageFileName = "http://192.168.0.7:8080/static/images/ionicfile.jpg"
  //     //this.imageFileName = "C:/Users/pratap/Desktop/images"
  //     this.imageFileName = "D:/pic.jpg";
  //     //loader.dismiss();
  //     //this.presentToast("Image uploaded successfully");
  //   }, (err) => {
  //     console.log(err);
  //     //loader.dismiss();
  //     //this.presentToast(err);
  //   });
  // }


  // presentToast(msg:any) {
  //   let toast = this.toastCtrl.create({
  //     message: msg,
  //     duration: 300,
  //     position: 'bottom'
  //   });
  
  //   toast.onDidDismiss(() => {
  //     console.log('Dismissed toast');
  //   });
  
  //   toast.present();
  // }




  
// getPicture() {
//   if (Camera['installed']()) {
//     this.camera.getPicture({
//       destinationType: this.camera.DestinationType.DATA_URL,
//       targetWidth: 96,
//       targetHeight: 96
//     }).then((data) => {
//       this.Entertainmentform.patchValue({ 'profilePic': 'data:image/jpg;base64,' + data });
//     }, (err) => {
//       alert('Unable to take photo');
//     })
//   } else {
//     this.fileInput.nativeElement.click();
//   }
// }

// processWebImage(event: any) {
//   let reader = new FileReader();
//   reader.onload = (readerEvent) => {

//     let imageData = (readerEvent.target as any).result;
//     this.Entertainmentform.patchValue({ 'profilePic': imageData });
//   };

//   reader.readAsDataURL(event.target.files[0]);
// }

// getProfileImageStyle() {
//   return 'url(' + this.Entertainmentform.controls['profilePic'].value + ')'
// }

// /**
//  * The user cancelled, so we dismiss without sending data back.
//  */
// cancel() {
//   this.viewCtrl.dismiss();
// }

// /**
//  * The user is done and wants to create the item, so return it
//  * back to the presenter.
//  */
// done() {
//   if (!this.Entertainmentform.valid) { return; }
//   this.viewCtrl.dismiss(this.Entertainmentform.value);
// }

// save(formData: any) {
//   console.log('Form data is ', formData);
//   }


// uploadFile() {
//     let loader = this.loadingCtrl.create({
//       content: "Uploading..."
//     });
//     loader.present();
//     const fileTransfer: FileTransferObject = this.transfer.create();
  
//     let options: FileUploadOptions = {
//       fileKey: 'ionicfile',
//       fileName: 'ionicfile',
//       chunkedMode: false,
//       mimeType: "image/jpeg",
//       headers: {}
//     }
  
//     fileTransfer.upload(this.imageURI, 'assets/img/aa.png', options)
//       .then((data) => {
//       console.log(data+" Uploaded Successfully");
//      // this.imageFileName = "assets/img/aa.png";
//      // loader.dismiss();
//      // this.presentToast("Image uploaded successfully");
//     }, (err) => {
//       console.log(err);
//      // loader.dismiss();
//      // this.presentToast(err);
//      alert("error"+JSON.stringify(err));
//     });
//   }
  
  
//   presentToast(msg: any) {
//     let toast = this.toastCtrl.create({
//       message: msg,
//       duration: 3000,
//       position: 'bottom'
//     });
  
//     toast.onDidDismiss(() => {
//       console.log('Dismissed toast');
//     });
  
//     toast.present();
//   }



// uploadPhoto() {
//   let loader = this.loadingCtrl.create({
//     content: "Please wait..."
//   });
//   loader.present();

//   let filename = this.imagePath.split('/').pop();
//   let options = {
//     fileKey: "file",
//     fileName: filename,
//     chunkedMode: false,
//     mimeType: "image/jpg",
//     params: { 'title': this.postTitle, 'description': this.desc }
//   };


//   const fileTransfer = new Transfer();

//   fileTransfer.upload(this.imageNewPath, 'https://photocloudapp.herokuapp.com/api/v1/post/upload',
//     options).then((entry) => {
//       this.imagePath = '';
//       this.imageChosen = 0;
//       loader.dismiss();
//       this.navCtrl.setRoot(HomePage);
//     }, (err) => {
//       alert(JSON.stringify(err));
//     });
// }

// chooseImage() {

//   let actionSheet = this.actionSheet.create({
//     title: 'Choose Picture Source',
//     buttons: [
//       {
//         text: 'Gallery',
//         icon: 'albums',
//         handler: () => {
//           this.actionHandler(1);
//         }
//       },
//       {
//         text: 'Camera',
//         icon: 'camera',
//         handler: () => {
//           this.actionHandler(2);
//         }
//       },
//       {
//         text: 'Cancel',
//         role: 'cancel',
//         handler: () => {
//           console.log('Cancel clicked');
//         }
//       }
//     ]
//   });

//   actionSheet.present();
// }



// public presentActionSheet() {
//   let actionSheet = this.actionSheetCtrl.create({
//     title: 'Select Image Source',
//     buttons: [
//       {
//         text: 'Load from Library',
//         handler: () => {
//           this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
//         }
//       },
//       {
//         text: 'Use Camera',
//         handler: () => {
//           this.takePicture(this.camera.PictureSourceType.CAMERA);
//         }
//       },
//       {
//         text: 'Cancel',
//         role: 'cancel'
//       }
//     ]
//   });
//   actionSheet.present();
// }



// public takePicture(sourceType) {
//   // Create options for the Camera Dialog
//   var options = {
//     quality: 100,
//     sourceType: sourceType,
//     saveToPhotoAlbum: false,
//     correctOrientation: true
//   };
 
//   // Get the data of an image
//   this.camera.getPicture(options).then((imagePath) => {
//     // Special handling for Android library
//     if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
//       this.filePath.resolveNativePath(imagePath)
//         .then(filePath => {
//           let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
//           let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
//           this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
//         });
//     } else {
//       var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
//       var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
//       this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
//     }
//   }, (err) => {
//     this.presentToast('Error while selecting image.');
//   });
// }


// callMyAction() {
//   // options = {sourceType: 0}
//  Camera.getPicture(options).then((imageData) => {
//    // imageData is either a base64 encoded string or a file URI
//    // If it's base64:
//    let base64Image = 'data:image/jpeg;base64,' + imageData;
//  }, (err) => {
//    // Handle error
//  });
// }


// getImages() {
//   return this.http.get(this.apiURL + 'images').map(res => res.json());
// }

// deleteImage(img) {
//   return this.http.delete(this.apiURL + 'images/' + img._id);
// }

// uploadImage(img, desc) {

//   // Destination URL
//   let url = this.apiURL + 'images';

//   // File for Upload
//   var targetPath = img;

//   var options: FileUploadOptions = {
//     fileKey: 'image',
//     chunkedMode: false,
//     mimeType: 'multipart/form-data',
//     params: { 'desc': desc }
//   };

//   const fileTransfer: FileTransferObject = this.transfer.create();

//   // Use the FileTransfer to upload the image
//   return fileTransfer.upload(targetPath, url, options);
// }

}
