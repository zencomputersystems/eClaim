import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { DesignationSetup_Model } from '../../models/designationsetup_model';
import { DesignationSetup_Service } from '../../services/designationsetup_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';

/**
 * Generated class for the DesignationsetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-designationsetup',
  templateUrl: 'designationsetup.html', providers: [DesignationSetup_Service, BaseHttpService]
})
export class DesignationsetupPage {

  Designationform: FormGroup;
  designation_entry: DesignationSetup_Model = new DesignationSetup_Model();

  //designation: DesignationSetup_Model = new DesignationSetup_Model();

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_designation' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  public designations: DesignationSetup_Model[] = [];
  public AddDesignationClicked: boolean = false; 
  public EditDesignationClicked: boolean = false;
  public Exist_Record: boolean = false;

  public designation_details: any; 
  public exist_record_details: any;

  //Set the Model Name for Add------------------------------------------
  public NAME_ngModel_Add: any;
  public DESCRIPTION_ngModel_Add: any;
  //---------------------------------------------------------------------

  //Set the Model Name for edit------------------------------------------
  public NAME_ngModel_Edit: any;
  public DESCRIPTION_ngModel_Edit: any;
  //---------------------------------------------------------------------


  public AddDesignationClick() {
    this.AddDesignationClicked = true;
    this.ClearControls();
  }

  public CloseDesignationClick() {
    if (this.AddDesignationClicked == true) {
      this.AddDesignationClicked = false;
    }
    if (this.EditDesignationClicked == true) {
      this.EditDesignationClicked = false;
    }
  }

  public EditClick(DESIGNATION_GUID: any) {
    this.ClearControls();
    this.EditDesignationClicked = true;
    var self = this;
    this.designationsetupservice
      .get(DESIGNATION_GUID)
      .subscribe((data) => {
      self.designation_details = data;
      this.NAME_ngModel_Edit = self.designation_details.NAME; localStorage.setItem('Prev_de_Name', self.designation_details.NAME); 
      this.DESCRIPTION_ngModel_Edit = self.designation_details.DESCRIPTION;
  });
}

  public DeleteClick(DESIGNATION_GUID: any) {
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
            this.designationsetupservice.remove(DESIGNATION_GUID)
              .subscribe(() => {
                self.designations = self.designations.filter((item) => {
                  return item.DESIGNATION_GUID != DESIGNATION_GUID
                });
              });
            //this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        }
      ]
    }); alert.present();
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private designationsetupservice: DesignationSetup_Service, private alertCtrl: AlertController) {
    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.designations = data.resource;
      });


    this.Designationform = fb.group({
      //NAME: [null, Validators.compose([Validators.pattern('[a-zA-Z0-9][a-zA-Z0-9 ]+'), Validators.required])], 
      NAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
      //NAME: ["", Validators.required],
      //DESCRIPTION: [null, Validators.compose([Validators.pattern('[a-zA-Z][a-zA-Z ]+'), Validators.required])],
      //DESCRIPTION: ["", Validators.required],
      DESCRIPTION: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
      //DESCRIPTION: [null, Validators.compose([Validators.pattern('[a-zA-Z0-9][a-zA-Z0-9 ]+'), Validators.required])], 
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DesignationsetupPage');
  }

  Save() {
    if (this.Designationform.valid) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      let url: string;
      url = this.baseResource_Url + "main_designation?filter=(NAME=" + this.NAME_ngModel_Add + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      this.http.get(url, options)
        .map(res => res.json())
        .subscribe(
        data => {
          let res = data["resource"];
          if (res.length == 0) {
            console.log("No records Found");
            if (this.Exist_Record == false) {
              this.designation_entry.NAME = this.NAME_ngModel_Add.trim();
              this.designation_entry.DESCRIPTION = this.DESCRIPTION_ngModel_Add.trim();

      this.designation_entry.DESIGNATION_GUID = UUID.UUID();
      this.designation_entry.CREATION_TS = new Date().toISOString();
      this.designation_entry.CREATION_USER_GUID = '1';
      this.designation_entry.UPDATE_TS = new Date().toISOString();
      this.designation_entry.UPDATE_USER_GUID = "";

      this.designationsetupservice.save(this.designation_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            alert('Designation Registered successfully');
            //location.reload();
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        });
    }
  }
  else {
    console.log("Records Found");
    alert("The Designation is already Exist.")
    
  }
  
},
err => {
  this.Exist_Record = false;
  console.log("ERROR!: ", err);
});
}
}
getBankList() {
  let self = this;
  let params: URLSearchParams = new URLSearchParams();
  self.designationsetupservice.get_bank(params)
    .subscribe((designations: DesignationSetup_Model[]) => {
      self.designations = designations;
    });
}


  Update(DESIGNATION_GUID: any) { 
    if (this.Designationform.valid) {
    if(this.designation_entry.NAME==null){this.designation_entry.NAME = this.NAME_ngModel_Edit;}
    if(this.designation_entry.DESCRIPTION==null){this.designation_entry.DESCRIPTION = this.DESCRIPTION_ngModel_Edit;}

      this.designation_entry.CREATION_TS = this.designation_details.CREATION_TS;
      this.designation_entry.CREATION_USER_GUID = this.designation_details.CREATION_USER_GUID;
      this.designation_entry.DESIGNATION_GUID = DESIGNATION_GUID;
      this.designation_entry.UPDATE_TS = new Date().toISOString();
      this.designation_entry.UPDATE_USER_GUID = '1';

      if (this.NAME_ngModel_Edit.trim() != localStorage.getItem('Prev_de_Name')) {
        let url: string;
        url = this.baseResource_Url + "main_designation?filter=(NAME=" + this.NAME_ngModel_Edit.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
        this.http.get(url)
          .map(res => res.json())
          .subscribe(
          data => {
            let res = data["resource"];
            console.log('Current Name : ' + this.NAME_ngModel_Edit + ', Previous Name : ' + localStorage.getItem('Prev_de_Name'));

            if (res.length == 0) {
              console.log("No records Found");
              this.designation_entry.NAME = this.NAME_ngModel_Edit.trim();
              
              //**************Update service if it is new details*************************
              this.designationsetupservice.update(this.designation_entry)
                .subscribe((response) => {
                  if (response.status == 200) {
                    alert('Designation updated successfully');
                    this.navCtrl.setRoot(this.navCtrl.getActive().component);
                  }
                });
              //**************************************************************************
            }
            else {
              console.log("Records Found");
              alert("The Designation is already Exist. ");
            }
          },
          err => {
            this.Exist_Record = false;
            console.log("ERROR!: ", err);
          });
      }
      else {
        if (this.designation_entry.NAME == null) { this.designation_entry.NAME = localStorage.getItem('Prev_de_Name'); }
        this.designation_entry.NAME = this.NAME_ngModel_Edit.trim();
        //**************Update service if it is old details*************************
      this.designationsetupservice.update(this.designation_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            alert('Designation updated successfully');
            //location.reload();
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        });
      }
    }
  }
  ClearControls()
  {
    this.NAME_ngModel_Add = "";
    this.DESCRIPTION_ngModel_Add = "";
   
    this.NAME_ngModel_Edit = "";
    this.DESCRIPTION_ngModel_Edit = "";
   
  }
}
  //     if (this.Designationform.valid) {
//     let headers = new Headers();
//     headers.append('Content-Type', 'application/json');
//     let options = new RequestOptions({ headers: headers });
//     let url: string;
//     url = "http://api.zen.com.my/api/v2/zcs/_table/main_designation?filter=(NAME=" + this.designation_entry.NAME + ")&api_key=cb82c1df0ba653578081b3b58179158594b3b8f29c4ee1050fda1b7bd91c3881";
//     this.http.get(url, options)
//       .map(res => res.json())
//       .subscribe(
//       data => {
//         let res = data["resource"];
//         if (res.length == 0) {
//           console.log("No records Found");
//           if (this.Exist_Record == false) {
// if (this.Designationform.valid) {
//}
// else {
//   console.log("Records Found");
//   alert("The Designation is already Added.")
  
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

