import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController  } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
//import { FormBuilder, FormGroup } from '@angular/forms';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { QualificationSetup_Model } from '../../models/qualificationsetup_model';
import { QualificationSetup_Service } from '../../services/qualificationsetup_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';


/**
 * Generated class for the QualificationsetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-qualificationsetup',
  templateUrl: 'qualificationsetup.html', providers: [QualificationSetup_Service, BaseHttpService]

})
export class QualificationsetupPage {
  Qualify_entry: QualificationSetup_Model = new QualificationSetup_Model();
  Qualifyform: FormGroup;
  //qualificationsetup: QualificationSetup_Model = new QualificationSetup_Model();

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_qualification_type' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  public qualificationsetups: QualificationSetup_Model[] = [];

  public AddQualifyClicked: boolean = false; 
  public EditQualifyClicked: boolean = false;
  public Exist_Record: boolean = false;

  public qualification_details: any; 
  public exist_record_details: any;

//Set the Model Name for Add------------------------------------------
public TYPE_NAME_ngModel_Add: any;
public TYPE_DESC_ngModel_Add: any;
//---------------------------------------------------------------------

//Set the Model Name for edit------------------------------------------
public TYPE_NAME_ngModel_Edit: any;
public TYPE_DESC_ngModel_Edit: any;
//---------------------------------------------------------------------

    public AddQualifyClick() {
        this.AddQualifyClicked = true;
        this.ClearControls(); 
    }

    public EditClick(QUALIFICATION_TYPE_GUID: any) {
      this.ClearControls();    
     this.EditQualifyClicked = true;
     var self = this;
      this.qualificationsetupservice
      .get(QUALIFICATION_TYPE_GUID)
      .subscribe((data) => {
      self.qualification_details = data;
      this.TYPE_NAME_ngModel_Edit = self.qualification_details.TYPE_NAME; localStorage.setItem('Prev_qu_Name', self.qualification_details.TYPE_NAME);
      this.TYPE_DESC_ngModel_Edit = self.qualification_details.TYPE_DESC;
   });
  }

  public DeleteClick(QUALIFICATION_TYPE_GUID: any) {
    let alert = this.alertCtrl.create({
      title: 'Remove Confirmation',
      message: 'Do you want to remove ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: () => {
            console.log('OK clicked');
            var self = this;
            this.qualificationsetupservice.remove(QUALIFICATION_TYPE_GUID)
              .subscribe(() => {
                self.qualificationsetups = self.qualificationsetups.filter((item) => {
                  return item.QUALIFICATION_TYPE_GUID != QUALIFICATION_TYPE_GUID
                });
              });
            //this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        }
      ]
    }); alert.present();
  }

      public CloseQualifyClick() {

 if (this.AddQualifyClicked == true) {
      this.AddQualifyClicked = false;
    }
    if (this.EditQualifyClicked == true) {
      this.EditQualifyClicked = false;
    }
    }

  constructor(public navCtrl: NavController, public navParams: NavParams,fb:FormBuilder, public http: Http, private httpService: BaseHttpService, private qualificationsetupservice: QualificationSetup_Service, private alertCtrl: AlertController) {
    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.qualificationsetups = data.resource;
      });


this.Qualifyform = fb.group({
      //TYPE_NAME: [null, Validators.compose([Validators.pattern('[a-zA-Z0-9][a-zA-Z0-9 ]+'), Validators.required])],
      TYPE_NAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
      
      //TYPE_NAME: ["", Validators.required],
      //TYPE_DESC: ["", Validators.required],
      //TYPE_DESC: [null, Validators.compose([Validators.pattern('[a-zA-Z0-9][a-zA-Z0-9 ]+'), Validators.required])], 
      TYPE_DESC: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
      
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QualificationsetupPage');
  }

  Save() {
    if (this.Qualifyform.valid) {

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      let url: string;
      url = this.baseResource_Url + "main_qualification_type?filter=(TYPE_NAME=" + this.TYPE_NAME_ngModel_Add + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      this.http.get(url, options)
        .map(res => res.json())
        .subscribe(
        data => {
          let res = data["resource"];
          if (res.length == 0) {
            console.log("No records Found");
            if (this.Exist_Record == false) {
              this.Qualify_entry.TYPE_NAME = this.TYPE_NAME_ngModel_Add.trim();
              this.Qualify_entry.TYPE_DESC = this.TYPE_DESC_ngModel_Add.trim();

      this.Qualify_entry.QUALIFICATION_TYPE_GUID = UUID.UUID();
      this.Qualify_entry.TENANT_GUID = UUID.UUID();
      this.Qualify_entry.CREATION_TS = new Date().toISOString();
      this.Qualify_entry.CREATION_USER_GUID = '1';
      this.Qualify_entry.UPDATE_TS = new Date().toISOString();
      this.Qualify_entry.UPDATE_USER_GUID = "";

      this.qualificationsetupservice.save(this.Qualify_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            alert('Qualification Type Registered successfully');
            //location.reload();
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        });
    }
  }
  else {
    console.log("Records Found");
    alert("The Qualification is already Exist.")  
  } 
},
err => {
  this.Exist_Record = false;
  console.log("ERROR!: ", err);
}
);
}
}
getBankList() {
  let self = this;
  let params: URLSearchParams = new URLSearchParams();
  self.qualificationsetupservice.get_qualification(params)
    .subscribe((qualificationsetups: QualificationSetup_Model[]) => {
      self.qualificationsetups = qualificationsetups;
    });
}

      Update(QUALIFICATION_TYPE_GUID: any) {  
        if (this.Qualifyform.valid) {  
     if(this.Qualify_entry.TYPE_NAME==null){this.Qualify_entry.TYPE_NAME = this.TYPE_NAME_ngModel_Edit.trim();}
     if(this.Qualify_entry.TYPE_DESC==null){this.Qualify_entry.TYPE_DESC = this.TYPE_DESC_ngModel_Edit.trim();}
   
      this.Qualify_entry.TENANT_GUID = this.qualification_details.TENANT_GUID
      this.Qualify_entry.CREATION_TS = this.qualification_details.CREATION_TS;
      this.Qualify_entry.CREATION_USER_GUID = this.qualification_details.CREATION_USER_GUID;

      this.Qualify_entry.QUALIFICATION_TYPE_GUID = QUALIFICATION_TYPE_GUID;
      this.Qualify_entry.UPDATE_TS = new Date().toISOString();
      this.Qualify_entry.UPDATE_USER_GUID = '1';

      if (this.TYPE_NAME_ngModel_Edit.trim() != localStorage.getItem('Prev_qu_Name')) {
        let url: string;
        url = this.baseResource_Url + "main_qualification_type?filter=(TYPE_NAME=" + this.TYPE_NAME_ngModel_Edit.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
        this.http.get(url)
          .map(res => res.json())
          .subscribe(
          data => {
            let res = data["resource"];
            console.log('Current Name : ' + this.TYPE_NAME_ngModel_Edit.trim() + ', Previous Name : ' + localStorage.getItem('Prev_qu_Name'));

            if (res.length == 0) {
              console.log("No records Found");
              this.Qualify_entry.TYPE_NAME = this.TYPE_NAME_ngModel_Edit.trim();
              
              //**************Update service if it is new details*************************
              this.qualificationsetupservice.update(this.Qualify_entry)
                .subscribe((response) => {
                  if (response.status == 200) {
                    alert('Qualification updated successfully');
                    this.navCtrl.setRoot(this.navCtrl.getActive().component);
                  }
                });
              //**************************************************************************
            }
            else {
              console.log("Records Found");
              alert("The Qualification is already Exist. ");
            }
          },
          err => {
            this.Exist_Record = false;
            console.log("ERROR!: ", err);
          });
      }
      else {
        if (this.Qualify_entry.TYPE_NAME == null) { this.Qualify_entry.TYPE_NAME = localStorage.getItem('Prev_qu_Name'); }
        
        //**************Update service if it is old details*************************
     
      
      this.qualificationsetupservice.update(this.Qualify_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            alert('Qualification Type updated successfully');
            //location.reload();
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        });
    }
  }
      }
      ClearControls()
      {
        this.TYPE_NAME_ngModel_Add = "";
        this.TYPE_DESC_ngModel_Add = "";
    
        this.TYPE_NAME_ngModel_Edit = "";
        this.TYPE_DESC_ngModel_Edit = "";
      }
}
 // if (this.Qualifyform.valid) {
      
    //         let headers = new Headers();
    //         headers.append('Content-Type', 'application/json');
    //         let options = new RequestOptions({ headers: headers });
    //         let url: string;
    //         url = "http://api.zen.com.my/api/v2/zcs/_table/main_qualification_type?filter=(TYPE_NAME=" + this.Qualify_entry.TYPE_NAME + ")&api_key=cb82c1df0ba653578081b3b58179158594b3b8f29c4ee1050fda1b7bd91c3881";
    //         this.http.get(url, options)
    //           .map(res => res.json())
    //           .subscribe(
    //           data => {
    //             let res = data["resource"];
    //             if (res.length == 0) {
    //               console.log("No records Found");
    //               if (this.Exist_Record == false) {

// else {
//   console.log("Records Found");
//   alert("The Qualification is already Added.")
  
// }
// },
// err => {
//   this.Exist_Record = false;
//   console.log("ERROR!: ", err);
// }
// );
// }
// }
// }

