import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController  } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
//import { FormBuilder, FormGroup } from '@angular/forms';
import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { MileageSetup_Model } from '../../models/mileagesetup_model';
import { MileageSetup_Service } from '../../services/mileagesetup_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';

/**
 * Generated class for the MileagesetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-mileagesetup',
  templateUrl: 'mileagesetup.html', providers: [MileageSetup_Service, BaseHttpService]
})
export class MileagesetupPage {
  mileage_entry: MileageSetup_Model = new MileageSetup_Model();
  mileage: MileageSetup_Model = new MileageSetup_Model();
  Mileageform: FormGroup;

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_mileage' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  public mileages: MileageSetup_Model[] = [];

  //public AddMileagesClicked: boolean = false; public EditMileagesClicked: boolean = false; Exist_Record: boolean = false;

  //public AddMileagesClicked: boolean = false; public mileage_details: any;


//  Mileageform: FormGroup;
   public AddMileageClicked: boolean = false; 
   public EditMileageClicked: boolean = false; 
   
   
    public AddMileageClick() {

        this.AddMileageClicked = true; 
    }
      public EditClick(MILEAGE_GUID: any) {
    //alert(MILEAGE_GUID);
    this.EditMileageClicked = true;
    var self = this;
    this.mileagesetupservice
      .get(MILEAGE_GUID)
      .subscribe((mileage) => self.mileage = mileage);
    return self.mileage;
  }
  public DeleteClick(MILEAGE_GUID: any) {
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
            this.mileagesetupservice.remove(MILEAGE_GUID)
              .subscribe(() => {
                self.mileages = self.mileages.filter((item) => {
                  return item.MILEAGE_GUID != MILEAGE_GUID
                });
              });
            //this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        }
      ]
    }); alert.present();
  }


      public CloseMileageClick() {

        if (this.AddMileageClicked == true) {
      this.AddMileageClicked = false;
    }
    if (this.EditMileageClicked == true) {
      this.EditMileageClicked = false;
    }
    }
  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private mileagesetupservice: MileageSetup_Service, private alertCtrl: AlertController) {
    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.mileages = data.resource;
      });
 
    this.Mileageform = fb.group({
      CATEGORY: ["", Validators.required],
      RATE_PER_UNIT: ["", Validators.required],
      RATE_DATE: ["", Validators.required],
      ACTIVATION_FLAG: ["", Validators.required],

      
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MileagesetupPage');
  }


 Save() {
    if (this.Mileageform.valid) {
      this.mileage_entry.MILEAGE_GUID = UUID.UUID();
      this.mileage_entry.CREATION_TS = new Date().toISOString();
      this.mileage_entry.CREATION_USER_GUID = "1";
      this.mileage_entry.UPDATE_TS = new Date().toISOString();
      this.mileage_entry.TENANT_GUID = UUID.UUID();
      this.mileage_entry.UPDATE_USER_GUID = "";
      //this.mileage_entry.ACTIVATION_FLAG = boolean;
      
      this.mileagesetupservice.save(this.mileage_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            alert('Mileage Registered successfully');
            //location.reload();
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        })
    }
  }
Update(MILEAGE_GUID: any) {  
    if(this.mileage_entry.CATEGORY==null){this.mileage_entry.CATEGORY = this.mileage_entry.CATEGORY;}
    if(this.mileage_entry.RATE_PER_UNIT==null){this.mileage_entry.RATE_PER_UNIT = this.mileage_entry.RATE_PER_UNIT;}

    if (this.Mileageform.valid) {
      this.mileage_entry.CREATION_TS = this.mileage.CREATION_TS
      this.mileage_entry.CREATION_USER_GUID = this.mileage.CREATION_USER_GUID;
      this.mileage_entry.UPDATE_TS = this.mileage.UPDATE_TS;

      this.mileage_entry.MILEAGE_GUID = MILEAGE_GUID;
      this.mileage_entry.UPDATE_TS = new Date().toISOString();
      this.mileage_entry.UPDATE_USER_GUID = '1';
      
      this.mileagesetupservice.update(this.mileage_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            alert('Mileage updated successfully');
            //location.reload();
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        })
    }
  }
}
