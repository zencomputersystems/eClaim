import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { BranchSetup_Model } from '../../models/branchsetup_model';
import { BranchSetup_Service } from '../../services/branchsetup_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';

/**
 * Generated class for the BranchsetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-branchsetup',
  templateUrl: 'branchsetup.html', providers: [BranchSetup_Service, BaseHttpService]
})
export class BranchsetupPage {
  branch_entry: BranchSetup_Model = new BranchSetup_Model();
  Branchform: FormGroup;
  branch: BranchSetup_Model = new BranchSetup_Model();

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_branch' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  public branchs: BranchSetup_Model[] = [];

  public AddBranchsClicked: boolean = false; public EditBranchsClicked: boolean = false; Exist_Record: boolean = false;

  public AddBranchesClicked: boolean = false; public branch_details: any;

  public AddBranchsClick() {

    this.AddBranchsClicked = true;
  }

  public CloseBranchsClick() {
    if (this.AddBranchsClicked == true) {
      this.AddBranchsClicked = false;
    }
    if (this.EditBranchsClicked == true) {
      this.EditBranchsClicked = false;
    }
  }

  public EditClick(BRANCH_GUID: any) {
    this.EditBranchsClicked = true;
    var self = this;
    this.branchsetupservice
      .get(BRANCH_GUID)
      .subscribe((branch) => self.branch = branch);
    return self.branch;
  }

  public DeleteClick(BRANCH_GUID: any) {
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
            this.branchsetupservice.remove(BRANCH_GUID)
              .subscribe(() => {
                self.branchs = self.branchs.filter((item) => {
                  return item.BRANCH_GUID != BRANCH_GUID
                });
              });
            //this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        }
      ]
    }); alert.present();
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private branchsetupservice: BranchSetup_Service, private alertCtrl: AlertController) {
    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.branchs = data.resource;
      });

    this.Branchform = fb.group({
      NAME: ["", Validators.required]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BranchsetupPage');
  }

  Save() {
    if (this.Branchform.valid) {
      this.branch_entry.BRANCH_GUID = UUID.UUID();
      this.branch_entry.CREATION_TS = new Date().toISOString();
      this.branch_entry.CREATION_USER_GUID = '1';
      this.branch_entry.UPDATE_TS = new Date().toISOString();
      this.branch_entry.UPDATE_USER_GUID = "";

      this.branchsetupservice.save(this.branch_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            alert('Branch Registered successfully');
            //location.reload();
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        })
    }
  }

  Update(BRANCH_GUID: any) {
    if (this.Branchform.valid) {
      this.branch_entry.CREATION_TS = this.branch.CREATION_TS;
      this.branch_entry.CREATION_USER_GUID = this.branch.CREATION_USER_GUID;

      this.branch_entry.BRANCH_GUID = BRANCH_GUID;
      this.branch_entry.UPDATE_TS = new Date().toISOString();
      this.branch_entry.UPDATE_USER_GUID = '1';    

      this.branchsetupservice.update(this.branch_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            alert('Branch updated successfully');
            //location.reload();
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        })
    }
  }
}