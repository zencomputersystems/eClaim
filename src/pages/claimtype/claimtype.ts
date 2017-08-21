import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { ClaimTypeSetup_Model } from '../../models/claimtypesetup_model';
import { ClaimTypeSetup_Service } from '../../services/claimtypesetup_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';


/**
 * Generated class for the ClaimtypePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-claimtype',
  templateUrl: 'claimtype.html', providers: [ClaimTypeSetup_Service, BaseHttpService]
})
export class ClaimtypePage {
  claimtype_entry: ClaimTypeSetup_Model = new ClaimTypeSetup_Model();
  Claimtypeform: FormGroup;
  claimtype: ClaimTypeSetup_Model = new ClaimTypeSetup_Model();

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_claim_type' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  public claimtypes: ClaimTypeSetup_Model[] = [];

  public AddClaimtypeClicked: boolean = false; public EditClaimTypeClicked: boolean = false;

  public AddClaimtypeClick() {

    this.AddClaimtypeClicked = true;
  }

  public EditClick(CLAIM_TYPE_GUID: any) {    
    this.EditClaimTypeClicked = true;
    var self = this;
    this.claimtypesetupservice
      .get(CLAIM_TYPE_GUID)
      .subscribe((claimtype) => self.claimtype = claimtype);
    return self.claimtype;
  }

  public DeleteClick(CLAIM_TYPE_GUID: any) {
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
            this.claimtypesetupservice.remove(CLAIM_TYPE_GUID)
              .subscribe(() => {
                self.claimtypes = self.claimtypes.filter((item) => {
                  return item.CLAIM_TYPE_GUID != CLAIM_TYPE_GUID
                });
              });
            //this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        }
      ]
    }); alert.present();
  }

  public CloseClaimtypeClick() {

    if (this.AddClaimtypeClicked == true) {
      this.AddClaimtypeClicked = false;
    }
    if (this.EditClaimTypeClicked == true) {
      this.EditClaimTypeClicked = false;
    }
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private claimtypesetupservice: ClaimTypeSetup_Service, private alertCtrl: AlertController) {
    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.claimtypes = data.resource;
      });

    this.Claimtypeform = fb.group({
      NAME: ["", Validators.required],
      DESCRIPTION: ["", Validators.required]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClaimtypePage');
  }

  Save() {
    if (this.Claimtypeform.valid) {
      this.claimtype_entry.CLAIM_TYPE_GUID = UUID.UUID();
      this.claimtype_entry.TENANT_GUID = UUID.UUID();
      this.claimtype_entry.CREATION_TS = new Date().toISOString();
      this.claimtype_entry.CREATION_USER_GUID = '1';
      this.claimtype_entry.UPDATE_TS = new Date().toISOString();
      this.claimtype_entry.UPDATE_USER_GUID = "";

      this.claimtypesetupservice.save(this.claimtype_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            alert('Claim Type Registered successfully');
            //location.reload();
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        })
    }
  }

  Update(CLAIM_TYPE_GUID: any) {    
    if(this.claimtype_entry.NAME==null){this.claimtype_entry.NAME = this.claimtype.NAME;}
    if(this.claimtype_entry.DESCRIPTION==null){this.claimtype_entry.DESCRIPTION = this.claimtype.DESCRIPTION;}

    if (this.Claimtypeform.valid) {
      this.claimtype_entry.TENANT_GUID = this.claimtype.TENANT_GUID
      this.claimtype_entry.CREATION_TS = this.claimtype.CREATION_TS;
      this.claimtype_entry.CREATION_USER_GUID = this.claimtype.CREATION_USER_GUID;

      this.claimtype_entry.CLAIM_TYPE_GUID = CLAIM_TYPE_GUID;
      this.claimtype_entry.UPDATE_TS = new Date().toISOString();
      this.claimtype_entry.UPDATE_USER_GUID = '1';
      
      this.claimtypesetupservice.update(this.claimtype_entry)
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
