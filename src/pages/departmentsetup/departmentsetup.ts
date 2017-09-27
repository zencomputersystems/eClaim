import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { DepartmentSetup_Model } from '../../models/departmentsetup_model';
import { DepartmentSetup_Service } from '../../services/departmentsetup_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';
/**
 * Generated class for the DepartmentsetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-departmentsetup',
  templateUrl: 'departmentsetup.html', providers: [DepartmentSetup_Service, BaseHttpService]
})
export class DepartmentsetupPage {
  department_entry: DepartmentSetup_Model = new DepartmentSetup_Model();
  //department: DepartmentSetup_Model = new DepartmentSetup_Model();
  Departmentform: FormGroup;

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_department' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  public departments: DepartmentSetup_Model[] = [];


  public AddDepartmentClicked: boolean = false;
  public EditDepartmentClicked: boolean = false;
  public Exist_Record: boolean = false;

  public department_details: any; 
  public exist_record_details: any;

  //Set the Model Name for Add------------------------------------------
  public NAME_ngModel_Add: any;
  public COMPANY_ngModel_Add: any;
  public DESCRIPTION_ngModel_Add: any;
  //---------------------------------------------------------------------

  //Set the Model Name for edit------------------------------------------
  public NAME_ngModel_Edit: any;
  public COMPANY_ngModel_Edit: any;
  public DESCRIPTION_ngModel_Edit: any;
  //---------------------------------------------------------------------


  public AddDepartmentClick() {
    this.AddDepartmentClicked = true;
    this.ClearControls();
  }

  public EditClick(DEPARTMENT_GUID: any) {
    this.ClearControls();
    this.EditDepartmentClicked = true;
    var self = this;
    this.departmentsetupservice
      .get(DEPARTMENT_GUID)
      .subscribe((data) => {
      self.department_details = data;
      this.NAME_ngModel_Edit = self.department_details.NAME; localStorage.setItem('Prev_dep_Name', self.department_details.NAME); 
      this.COMPANY_ngModel_Edit = self.department_details.COMPANY;
      this.DESCRIPTION_ngModel_Edit = self.department_details.DESCRIPTION;
   
  });
}

  public DeleteClick(DEPARTMENT_GUID: any) {
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
            this.departmentsetupservice.remove(DEPARTMENT_GUID)
              .subscribe(() => {
                self.departments = self.departments.filter((item) => {
                  return item.DEPARTMENT_GUID != DEPARTMENT_GUID
                });
              });
            //this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        }
      ]
    }); alert.present();
  }


  public CloseDepartmentClick() {

    if (this.AddDepartmentClicked == true) {
      this.AddDepartmentClicked = false;
    }
    if (this.EditDepartmentClicked == true) {
      this.EditDepartmentClicked = false;
    }
  }
  //constructor(public navCtrl: NavController, public navParams: NavParams, fb:FormBuilder) {
  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private departmentsetupservice: DepartmentSetup_Service, private alertCtrl: AlertController) {

    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.departments = data.resource;
      });

    this.Departmentform = fb.group({
      NAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
      //NAME: [null, Validators.compose([Validators.pattern('[a-zA-Z0-9][a-zA-Z0-9 ]+'), Validators.required])], 
      //NAME: ["", Validators.required],
      //COMPANY: ["", Validators.required],
      COMPANY: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
      //COMPANY: [null, Validators.compose([Validators.pattern('[a-zA-Z0-9][a-zA-Z0-9 ]+'), Validators.required])], 
      DESCRIPTION: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])], 
      //DESCRIPTION: ["", Validators.required],
      

    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DepartmentsetupPage');
  }
  Save() {
    if (this.Departmentform.valid) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      let url: string;
      url =  this.baseResource_Url + "main_department?filter=(NAME=" + this.NAME_ngModel_Add.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      this.http.get(url, options)
        .map(res => res.json())
        .subscribe( 
        data => {
          let res = data["resource"];
          if (res.length == 0) {
            console.log("No records Found");
            if (this.Exist_Record == false) {
              this.department_entry.NAME = this.NAME_ngModel_Add.trim();
              this.department_entry.COMPANY = this.COMPANY_ngModel_Add.trim();
              this.department_entry.DESCRIPTION = this.DESCRIPTION_ngModel_Add.trim();

      this.department_entry.DEPARTMENT_GUID = UUID.UUID();
      this.department_entry.CREATION_TS = new Date().toISOString();
      this.department_entry.CREATION_USER_GUID = "1";
      this.department_entry.UPDATE_TS = new Date().toISOString();
      this.department_entry.UPDATE_USER_GUID = "";
      
      this.departmentsetupservice.save(this.department_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            alert('Department Type Registered successfully');
            //location.reload();
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        })
    }
  }
  else {
    console.log("Records Found");
    alert("The Department is already Exist.")  
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
  self.departmentsetupservice.get_department(params)
    .subscribe((departments: DepartmentSetup_Model[]) => {
      self.departments = departments;
    });
}

Update(DEPARTMENT_GUID: any) {
  if (this.Departmentform.valid) {
  if(this.department_entry.NAME==null){this.department_entry.NAME = this.NAME_ngModel_Edit.trim();}
  if(this.department_entry.COMPANY==null){this.department_entry.COMPANY = this.COMPANY_ngModel_Edit.trim();}
  if(this.department_entry.DESCRIPTION==null){this.department_entry.DESCRIPTION = this.DESCRIPTION_ngModel_Edit.trim();}
  
 
      this.department_entry.CREATION_TS = this.department_details.CREATION_TS;
      this.department_entry.CREATION_USER_GUID = this.department_details.CREATION_USER_GUID;
      this.department_entry.UPDATE_TS = this.department_details.UPDATE_TS;
      this.department_entry.DEPARTMENT_GUID = DEPARTMENT_GUID;
      this.department_entry.UPDATE_TS = new Date().toISOString();
      this.department_entry.UPDATE_USER_GUID = '1';

      if (this.NAME_ngModel_Edit.trim() != localStorage.getItem('Prev_dep_Name')) {
        let url: string;
        url = this.baseResource_Url + "main_department?filter=(NAME=" + this.NAME_ngModel_Edit.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
        this.http.get(url)
          .map(res => res.json())
          .subscribe(
          data => {
            let res = data["resource"];
            console.log('Current Name : ' + this.NAME_ngModel_Edit + ', Previous Name : ' + localStorage.getItem('Prev_dep_Name'));

            if (res.length == 0) {
              console.log("No records Found");
              this.department_entry.NAME = this.NAME_ngModel_Edit.trim();
              
              //**************Update service if it is new details*************************
              this.departmentsetupservice.update(this.department_entry)
                .subscribe((response) => {
                  if (response.status == 200) {
                    alert('Department updated successfully');
                    this.navCtrl.setRoot(this.navCtrl.getActive().component);
                  }
                });
              //**************************************************************************
            }
            else {
              console.log("Records Found");
              alert("The Department is already Exist. ");
            }
          },
          err => {
            this.Exist_Record = false;
            console.log("ERROR!: ", err);
          });
      }
      else {
        if (this.department_entry.NAME == null) { this.department_entry.NAME = localStorage.getItem('Prev_dep_Name'); }
        this.department_entry.NAME = this.NAME_ngModel_Edit.trim();
        //**************Update service if it is old details*************************
      
      this.departmentsetupservice.update(this.department_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            alert('Department is updated successfully');
            //location.reload();
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        })
    }
  }
}
ClearControls()
{
  this.NAME_ngModel_Add = "";
  this.COMPANY_ngModel_Add = "";
  this.DESCRIPTION_ngModel_Add = "";
 
  this.NAME_ngModel_Edit = "";
  this.COMPANY_ngModel_Edit = "";
  this.DESCRIPTION_ngModel_Edit = "";
 
}
}
   // if (this.Departmentform.valid) {
    
  //         let headers = new Headers();
  //         headers.append('Content-Type', 'application/json');
  //         let options = new RequestOptions({ headers: headers });
  //         let url: string;
  //         url = "http://api.zen.com.my/api/v2/zcs/_table/main_department?filter=(NAME=" + this.department_entry.NAME + ")&api_key=cb82c1df0ba653578081b3b58179158594b3b8f29c4ee1050fda1b7bd91c3881";
  //         this.http.get(url, options)
  //           .map(res => res.json())
  //           .subscribe(
  //           data => {
  //             let res = data["resource"];
  //             if (res.length == 0) {
  //               console.log("No records Found");
  //               if (this.Exist_Record == false) {
    
  //   if (this.Departmentform.valid) {

//}
// else {
//   console.log("Records Found");
//   alert("The Department is already Added.")
  
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