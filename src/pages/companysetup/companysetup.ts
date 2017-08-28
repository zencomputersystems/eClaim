import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
//import { FormBuilder, FormGroup } from '@angular/forms';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { CompanySetup_Model } from '../../models/companysetup_model';
import { CompanySetup_Service } from '../../services/companysetup_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';

/**
 * Generated class for the CompanysetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-companysetup',
  templateUrl: 'companysetup.html', providers: [CompanySetup_Service, BaseHttpService]
})
export class CompanysetupPage {
  company_entry: CompanySetup_Model = new CompanySetup_Model();
  company: CompanySetup_Model = new CompanySetup_Model();
   Companyform: FormGroup;

   baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_company' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
   baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
 
   public companys: CompanySetup_Model[] = [];
 
   public AddCompanyClicked: boolean = false; 
   public EditCompanyClicked: boolean = false;
   
    public AddCompanyClick() {

        this.AddCompanyClicked = true; 
    }

    public EditClick(COMPANY_GUID: any) {
      //alert(DEPARTMENT_GUID)    ;
      this.EditCompanyClicked = true;
      var self = this;
      this.companysetupservice
        .get(COMPANY_GUID)
        .subscribe((company) => self.company = company);
      return self.company;
    }

    public DeleteClick(COMPANY_GUID: any) {
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
              this.companysetupservice.remove(COMPANY_GUID)
                .subscribe(() => {
                  self.companys = self.companys.filter((item) => {
                    return item.COMPANY_GUID != COMPANY_GUID
                  });
                });
              //this.navCtrl.setRoot(this.navCtrl.getActive().component);
            }
          }
        ]
      }); alert.present();
    }
  

      public CloseCompanyClick() {

        if (this.AddCompanyClicked == true) {
          this.AddCompanyClicked = false;
        }
        if (this.EditCompanyClicked == true) {
          this.EditCompanyClicked = false;
        }
    }


  constructor(public navCtrl: NavController, public navParams: NavParams, fb:FormBuilder, public http: Http, private httpService: BaseHttpService, private companysetupservice: CompanySetup_Service, private alertCtrl: AlertController) {

    this.http
    .get(this.baseResourceUrl)
    .map(res => res.json())
    .subscribe(data => {
      this.companys = data.resource;
    });

  this.Companyform = fb.group({

    NAME: ["", Validators.required],
    REGISTRATION_NO: ["", Validators.required],
    ADDRESS: ["", Validators.required],
    FAX: ["", Validators.required],
    PHONE: ["", Validators.required],
    EMAIL: ["", Validators.required],
    

    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CompanysetupPage');
  }

  Save() {
    if (this.Companyform.valid) {
      this.company_entry.COMPANY_GUID = UUID.UUID();
      //this.department_entry.NAME = UUID.UUID();
      //this.department_entry.COMPANY = new Date().toISOString();
      //this.department_entry.DESCRIPTION = '1';
      this.company_entry.CREATION_TS = new Date().toISOString();
      this.company_entry.CREATION_USER_GUID = "1";
      this.company_entry.UPDATE_TS = new Date().toISOString();
      this.company_entry.UPDATE_USER_GUID = "";
      
      this.companysetupservice.save(this.company_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            alert('Company Type Registered successfully');
            //location.reload();
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        })
    }
  }

  Update(COMPANY_GUID: any) {  
    if(this.company_entry.NAME==null){this.company_entry.NAME = this.company_entry.NAME;}
    if(this.company_entry.REGISTRATION_NO==null){this.company_entry.REGISTRATION_NO = this.company_entry.REGISTRATION_NO;}

    if (this.Companyform.valid) {
      this.company_entry.CREATION_TS = this.company.CREATION_TS
      this.company_entry.CREATION_USER_GUID = this.company.CREATION_USER_GUID;
      this.company_entry.UPDATE_TS = this.company.UPDATE_TS;

      this.company_entry.COMPANY_GUID = COMPANY_GUID;
      this.company_entry.UPDATE_TS = new Date().toISOString();
      this.company_entry.UPDATE_USER_GUID = '1';
      
      this.companysetupservice.update(this.company_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            alert('Company Type updated successfully');
            //location.reload();
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        })
    }
  }

}
