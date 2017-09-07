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
  department: DepartmentSetup_Model = new DepartmentSetup_Model();
  Departmentform: FormGroup;

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_department' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  public departments: DepartmentSetup_Model[] = [];


  public AddDepartmentClicked: boolean = false;
  public EditDepartmentClicked: boolean = false;
  Exist_Record: boolean = false;
  public designation_details: any; public exist_record_details: any;


  public AddDepartmentClick() {

    this.AddDepartmentClicked = true;
  }
  public EditClick(DEPARTMENT_GUID: any) {
    //alert(DEPARTMENT_GUID)    ;
    this.EditDepartmentClicked = true;
    var self = this;
    this.departmentsetupservice
      .get(DEPARTMENT_GUID)
      .subscribe((department) => self.department = department);
    return self.department;
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

      NAME: ["", Validators.required],
      COMPANY: ["", Validators.required],
      DESCRIPTION: ["", Validators.required],
      

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
      url = "http://api.zen.com.my/api/v2/zcs/_table/main_department?filter=(NAME=" + this.department_entry.NAME + ")&api_key=cb82c1df0ba653578081b3b58179158594b3b8f29c4ee1050fda1b7bd91c3881";
      this.http.get(url, options)
        .map(res => res.json())
        .subscribe(
        data => {
          let res = data["resource"];
          if (res.length == 0) {
            console.log("No records Found");
            if (this.Exist_Record == false) {
      this.department_entry.DEPARTMENT_GUID = UUID.UUID();
      //this.department_entry.NAME = UUID.UUID();
      //this.department_entry.COMPANY = new Date().toISOString();
      //this.department_entry.DESCRIPTION = '1';
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
    alert("The Department is already Added.")
    
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
  self.departmentsetupservice.get_department(params)
    .subscribe((departments: DepartmentSetup_Model[]) => {
      self.departments = departments;
    });
}
Update(DEPARTMENT_GUID: any) {  
  if (this.Departmentform.valid) {
    
          let headers = new Headers();
          headers.append('Content-Type', 'application/json');
          let options = new RequestOptions({ headers: headers });
          let url: string;
          url = "http://api.zen.com.my/api/v2/zcs/_table/main_department?filter=(NAME=" + this.department_entry.NAME + ")&api_key=cb82c1df0ba653578081b3b58179158594b3b8f29c4ee1050fda1b7bd91c3881";
          this.http.get(url, options)
            .map(res => res.json())
            .subscribe(
            data => {
              let res = data["resource"];
              if (res.length == 0) {
                console.log("No records Found");
                if (this.Exist_Record == false) {
    // if(this.department_entry.NAME==null){this.department_entry.NAME = this.department_entry.NAME;}
    // if(this.department_entry.DESCRIPTION==null){this.department_entry.DESCRIPTION = this.department_entry.DESCRIPTION;}

    if (this.Departmentform.valid) {
      this.department_entry.CREATION_TS = this.department.CREATION_TS
      this.department_entry.CREATION_USER_GUID = this.department.CREATION_USER_GUID;
      this.department_entry.UPDATE_TS = this.department.UPDATE_TS;

      this.department_entry.DEPARTMENT_GUID = DEPARTMENT_GUID;
      this.department_entry.UPDATE_TS = new Date().toISOString();
      this.department_entry.UPDATE_USER_GUID = '1';
      
      this.departmentsetupservice.update(this.department_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            alert('Claim Type updated successfully');
            //location.reload();
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        })
    }
  }
}
else {
  console.log("Records Found");
  alert("The Department is already Added.")
  
}
},
err => {
  this.Exist_Record = false;
  console.log("ERROR!: ", err);
}
);
}
}
}