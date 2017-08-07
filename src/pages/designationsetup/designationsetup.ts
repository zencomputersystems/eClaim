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

  designation: DesignationSetup_Model = new DesignationSetup_Model();

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_designation' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  public designations: DesignationSetup_Model[] = [];
  public AddDesignationClicked: boolean = false; public EditDesignationClicked: boolean = false;

  public AddDesignationClick() {
    this.AddDesignationClicked = true;
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
    this.EditDesignationClicked = true;
    var self = this;
    this.designationsetupservice
      .get(DESIGNATION_GUID)
      .subscribe((designation) => self.designation = designation);
    return self.designation;
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
      NAME: ["", Validators.required],
      DESCRIPTION: ["", Validators.required]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DesignationsetupPage');
  }

  Save() {
    if (this.Designationform.valid) {
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
        })
    }
  }

  Update(DESIGNATION_GUID: any) { 
    if(this.designation_entry.NAME==null){this.designation_entry.NAME = this.designation.NAME;}
    if(this.designation_entry.DESCRIPTION==null){this.designation_entry.DESCRIPTION = this.designation.DESCRIPTION;}

    if (this.Designationform.valid) {
      this.designation_entry.CREATION_TS = this.designation.CREATION_TS;
      this.designation_entry.CREATION_USER_GUID = this.designation.CREATION_USER_GUID;

      this.designation_entry.DESIGNATION_GUID = DESIGNATION_GUID;
      this.designation_entry.UPDATE_TS = new Date().toISOString();
      this.designation_entry.UPDATE_USER_GUID = '1';

      this.designationsetupservice.update(this.designation_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            alert('Designation updated successfully');
            //location.reload();
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        })
    }
  }
}
