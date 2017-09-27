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
  //branch: BranchSetup_Model = new BranchSetup_Model();

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_branch' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  public branchs: BranchSetup_Model[] = [];

  public AddBranchsClicked: boolean = false;
  public EditBranchsClicked: boolean = false;
  public Exist_Record: boolean = false;

  public AddBranchesClicked: boolean = false;
  public branch_details: any;
  public exist_record_details: any;

  //Set the Model Name for Add------------------------------------------
  public NAME_ngModel_Add: any;
  //---------------------------------------------------------------------

  //Set the Model Name for edit------------------------------------------
  public NAME_ngModel_Edit: any;
  //---------------------------------------------------------------------

  public AddBranchsClick() {
    this.AddBranchsClicked = true;
    this.ClearControls();
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
    this.ClearControls();
    this.EditBranchsClicked = true;
    var self = this;
    this.branchsetupservice
      .get(BRANCH_GUID)
      .subscribe((data) => {
      self.branch_details = data;
      this.NAME_ngModel_Edit = self.branch_details.NAME; localStorage.setItem('Prev_br_Name', self.branch_details.NAME); 
  });
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
      NAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
      //NAME: [null, Validators.compose([Validators.pattern('[a-zA-Z0-9][a-zA-Z0-9 ]+'), Validators.required])], 


      //NAME: [null, Validators.compose([Validators.pattern('[a-zA-Z][a-zA-Z ]+'), Validators.required])],
      //NAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z][a-zA-Z0-9\\s]+$'), Validators.required])],
      //NAME: ["", Validators.required],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BranchsetupPage');
  }

  Save() {
    if (this.Branchform.valid) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      let url: string;
      url = this.baseResource_Url + "main_branch?filter=(NAME=" + this.NAME_ngModel_Add.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      this.http.get(url, options)
        .map(res => res.json())
        .subscribe(
        data => {
          let res = data["resource"];
          if (res.length == 0) {
            console.log("No records Found");
            if (this.Exist_Record == false) {
              this.branch_entry.NAME = this.NAME_ngModel_Add.trim();

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

          else {
            console.log("Records Found");
            alert("The Branch is already Exist.")

          }

        },
        err => {
          this.Exist_Record = false;
          console.log("ERROR!: ", err);
        });
    }
  }
  getBranchList() {
    let self = this;
    let params: URLSearchParams = new URLSearchParams();
    self.branchsetupservice.get_branch(params)
      .subscribe((branchs: BranchSetup_Model[]) => {
        self.branchs = branchs;
      });
  }

  Update(BRANCH_GUID: any) {
    if (this.Branchform.valid) {
      if(this.branch_entry.NAME = null){this.branch_entry.NAME = this.NAME_ngModel_Edit.trim();}

                this.branch_entry.CREATION_TS = this.branch_details.CREATION_TS;
                this.branch_entry.CREATION_USER_GUID = this.branch_details.CREATION_USER_GUID;
                this.branch_entry.BRANCH_GUID = BRANCH_GUID;
                this.branch_entry.UPDATE_TS = new Date().toISOString();
                this.branch_entry.UPDATE_USER_GUID = '1';

                if (this.NAME_ngModel_Edit.trim() != localStorage.getItem('Prev_br_Name')) {
                  let url: string;
                  url = this.baseResource_Url + "main_branch?filter=(NAME=" + this.NAME_ngModel_Edit.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
                  this.http.get(url)
                    .map(res => res.json())
                    .subscribe(
                    data => {
                      let res = data["resource"];
                      console.log('Current Name : ' + this.NAME_ngModel_Edit + ', Previous Name : ' + localStorage.getItem('Prev_br_Name'));
          
                      if (res.length == 0) {
                        console.log("No records Found");
                        this.branch_entry.NAME = this.NAME_ngModel_Edit.trim();
                        
                        //**************Update service if it is new details*************************
                        this.branchsetupservice.update(this.branch_entry)
                          .subscribe((response) => {
                            if (response.status == 200) {
                              alert('Mileage updated successfully');
                              this.navCtrl.setRoot(this.navCtrl.getActive().component);
                            }
                          });
                        //**************************************************************************
                      }
                      else {
                        console.log("Records Found");
                        alert("The Branch is already Exist. ");
                      }
                    },
                    err => {
                      this.Exist_Record = false;
                      console.log("ERROR!: ", err);
                    });
                }
                else {
                  if (this.branch_entry.NAME == null) { this.branch_entry.NAME = localStorage.getItem('Prev_br_Name'); }
                  this.branch_entry.NAME = this.NAME_ngModel_Edit.trim();
                  
                  //**************Update service if it is old details*************************

                this.branchsetupservice.update(this.branch_entry)
                  .subscribe((response) => {
                    if (response.status == 200) {
                      alert('Branch updated successfully');
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
        
            this.NAME_ngModel_Edit = "";
          }
        }
//           else {
//             console.log("Records Found");
//             alert("The Branch is already Added.")

//           }
//         },
//         err => {
//           this.Exist_Record = false;
//           console.log("ERROR!: ", err);
//         }
//         );
//     }
//   }
// }



 // if (this.mileage_entry.CATEGORY == null) { this.mileage_entry.CATEGORY = this.CATEGORY_ngModel_Edit; }
      // let headers = new Headers();
      // headers.append('Content-Type', 'application/json');
      // let options = new RequestOptions({ headers: headers });
      // let url: string;
      // url = this.baseResource_Url + "main_branch?filter=(NAME=" + this.NAME_ngModel_Edit + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      // this.http.get(url, options)
      //   .map(res => res.json())
      //   .subscribe(
      //   data => {
      //     let res = data["resource"];
      //     if (res.length == 0) {
      //       console.log("No records Found");
      //       if (this.Exist_Record == false) {
      //         if (this.Branchform.valid) {
