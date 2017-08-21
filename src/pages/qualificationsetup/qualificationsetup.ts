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
  qualificationsetup: QualificationSetup_Model = new QualificationSetup_Model();

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_qualification_type' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  public qualificationsetups: QualificationSetup_Model[] = [];

  public AddQualifyClicked: boolean = false; public EditQualifyClicked: boolean = false;



//Qualifyform: FormGroup;
  // public AddQualifyClicked: boolean = false; 
   
    public AddQualifyClick() {

        this.AddQualifyClicked = true; 
    }

    public EditClick(QUALIFICATION_TYPE_GUID: any) {    
     this.EditQualifyClicked = true;
     var self = this;
      this.qualificationsetupservice
      .get(QUALIFICATION_TYPE_GUID)
      .subscribe((qualificationsetup) => self.qualificationsetup = qualificationsetup);
      return self.qualificationsetup;
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
      TYPE_NAME: ["", Validators.required],
      TYPE_DESC: ["", Validators.required]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QualificationsetupPage');
  }

  Save() {
    if (this.Qualifyform.valid) {
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
        })
    }
  }

      Update(QUALIFICATION_TYPE_GUID: any) {    
    if(this.Qualify_entry.TYPE_NAME==null){this.Qualify_entry.TYPE_NAME = this.qualificationsetup.TYPE_NAME;}
    if(this.Qualify_entry.TYPE_DESC==null){this.Qualify_entry.TYPE_DESC = this.qualificationsetup.TYPE_DESC;}

    if (this.Qualifyform.valid) {
      this.Qualify_entry.TENANT_GUID = this.qualificationsetup.TENANT_GUID
      this.Qualify_entry.CREATION_TS = this.qualificationsetup.CREATION_TS;
      this.Qualify_entry.CREATION_USER_GUID = this.qualificationsetup.CREATION_USER_GUID;

      this.Qualify_entry.QUALIFICATION_TYPE_GUID = QUALIFICATION_TYPE_GUID;
      this.Qualify_entry.UPDATE_TS = new Date().toISOString();
      this.Qualify_entry.UPDATE_USER_GUID = '1';
      
      this.qualificationsetupservice.update(this.Qualify_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            alert('Qualification Type updated successfully');
            //location.reload();
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        })
    }
  }

}
