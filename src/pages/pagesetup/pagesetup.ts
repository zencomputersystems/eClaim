import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { PageSetup_Model } from '../../models/pagesetup_model';
import { PageSetup_Service } from '../../services/pagesetup_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';
import { LoginPage } from '../login/login';

/**
 * Generated class for the PagesetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-pagesetup',
  templateUrl: 'pagesetup.html', providers: [PageSetup_Service, BaseHttpService]
})
export class PagesetupPage {
  page_entry: PageSetup_Model = new PageSetup_Model();
  Pageform: FormGroup;
  public p: number = 1;
  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_rolepage' + '?order=NAME&api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  public pages: PageSetup_Model[] = [];

  public AddPageClicked: boolean = false;
  public EditPageClicked: boolean = false;
  public Exist_Record: boolean = false;

  public page_details: any;
  public exist_record_details: any;

  //Set the Model Name for Add------------------------------------------
  public NAME_ngModel_Add: any;
  public DESCRIPTION_ngModel_Add: any;
  public URL_ngModel_Add: any;
  public APPLICATION_PAGE_ngModel_Add: any;
  //---------------------------------------------------------------------

  //Set the Model Name for edit------------------------------------------
  public NAME_ngModel_Edit: any;
  public DESCRIPTION_ngModel_Edit: any;
  public URL_ngModel_Edit: any;
  public APPLICATION_PAGE_ngModel_Edit: any;
  //---------------------------------------------------------------------

  public AddPageClick() {
    this.ClearControls();
    this.AddPageClicked = true;
  }

  public ClosePageClick() {

    if (this.AddPageClicked == true) {
      this.AddPageClicked = false;
    }
    if (this.EditPageClicked == true) {
      this.EditPageClicked = false;
    }
  }

  public EditClick(PAGE_GUID: any) {

    //this.ClearControls();
    this.EditPageClicked = true;
    var self = this;
    this.pagesetupservice

      .get(PAGE_GUID)
      .subscribe((data) => {
        self.page_details = data;
        this.NAME_ngModel_Edit = self.page_details.NAME; localStorage.setItem('Prev_set_NAME', self.page_details.NAME);

        this.DESCRIPTION_ngModel_Edit = self.page_details.DESCRIPTION;
        this.URL_ngModel_Edit = self.page_details.URL;
        this.APPLICATION_PAGE_ngModel_Edit = self.page_details.CODE_PAGE_NAME;
      });
  }

  public DeleteClick(PAGE_GUID: any) {
    let alert = this.alertCtrl.create({
      title: 'Remove Confirmation',
      message: 'Are you sure to remove?',
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
            this.pagesetupservice.remove(PAGE_GUID)
              .subscribe(() => {
                self.pages = self.pages.filter((item) => {
                  return item.PAGE_GUID != PAGE_GUID
                });
              });
            //this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        }
      ]
    }); alert.present();
  }

  loading: Loading;
  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private pagesetupservice: PageSetup_Service, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    if (localStorage.getItem("g_USER_GUID") == null) {
      alert('Sorry, please login.');
      this.navCtrl.push(LoginPage);
    }
    else {
      this.loading = this.loadingCtrl.create({
        content: 'Loading...',
      });
      this.loading.present();

      this.http
        .get(this.baseResourceUrl)
        .map(res => res.json())
        .subscribe(data => {
          this.pages = this.stores = data.resource;
          this.loading.dismissAll();
        });

      this.Pageform = fb.group({
        NAME: ["", Validators.required],
        DESCRIPTION: [null],
        //URL: [null, Validators.compose([Validators.pattern('^(http[s]?:\\/\\/){0,1}(www\\.){0,1}[a-zA-Z0-9\\.\\-]+\\.[a-zA-Z]{2,5}[\\.]{0,1}$'), Validators.required])],          
        URL: [null, Validators.compose([Validators.pattern('^(..\\/){0,1}[a-zA-Z0-9\\/\\-]+\\/[a-zA-Z]{2,50}[\\/]{0,1}$'), Validators.required])],
        APPLICATION_PAGE: ["", Validators.required],
      });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PagesetupPage');
  }

  Save() {
    if (this.Pageform.valid) {
      //Load the Controller--------------------------------
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...',
      });
      this.loading.present();
      //--------------------------------------------------
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      let url: string;
      url = this.baseResource_Url + "main_rolepage?filter=NAME=" + this.NAME_ngModel_Add.trim() + '&api_key=' + constants.DREAMFACTORY_API_KEY;
      this.http.get(url, options)
        .map(res => res.json())
        .subscribe(
          data => {
            let res = data["resource"];
            if (res.length == 0) {
              console.log("No records Found");
              if (this.Exist_Record == false) {
                this.page_entry.NAME = this.NAME_ngModel_Add.trim();
                this.page_entry.DESCRIPTION = this.DESCRIPTION_ngModel_Add.trim();
                this.page_entry.URL = this.URL_ngModel_Add.trim();
                this.page_entry.CODE_PAGE_NAME = this.APPLICATION_PAGE_ngModel_Add.trim();

                this.page_entry.PAGE_GUID = UUID.UUID();
                this.page_entry.CREATION_TS = new Date().toISOString();
                this.page_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
                this.page_entry.UPDATE_TS = new Date().toISOString();
                this.page_entry.UPDATE_USER_GUID = "";

                this.pagesetupservice.save(this.page_entry)
                  .subscribe((response) => {
                    if (response.status == 200) {
                      alert('Pagesetup registered successfully.');
                      //location.reload();
                      this.navCtrl.setRoot(this.navCtrl.getActive().component);
                    }
                  });
              }
            }
            else {
              console.log("Records Found");
              alert("The pagesetup is already exist.");
              this.loading.dismissAll();
            }
          },
          err => {
            this.Exist_Record = false;
            console.log("ERROR!: ", err);
          });
    }
  }

  Update(PAGE_GUID: any) {
    if (this.Pageform.valid) {
      if (this.page_entry.NAME == null) { this.page_entry.NAME = this.NAME_ngModel_Edit; }
      if (this.page_entry.DESCRIPTION == null) { this.page_entry.DESCRIPTION = this.DESCRIPTION_ngModel_Edit; }
      if (this.page_entry.URL == null) { this.page_entry.URL = this.URL_ngModel_Edit; }
      if (this.page_entry.CODE_PAGE_NAME == null) { this.page_entry.CODE_PAGE_NAME = this.APPLICATION_PAGE_ngModel_Edit; }

      this.page_entry.CREATION_TS = this.page_details.CREATION_TS;
      this.page_entry.CREATION_USER_GUID = this.page_details.CREATION_USER_GUID;
      this.page_entry.PAGE_GUID = PAGE_GUID;
      this.page_entry.UPDATE_TS = new Date().toISOString();
      this.page_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");
      //Load the Controller--------------------------------
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...',
      });
      this.loading.present();
      //--------------------------------------------------
      if (this.NAME_ngModel_Edit.trim().toUpperCase() != localStorage.getItem('Prev_set_NAME').toUpperCase()) {
        let url: string;
        url = this.baseResource_Url + "main_rolepage?filter=(NAME=" + this.NAME_ngModel_Edit.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
        this.http.get(url)
          .map(res => res.json())
          .subscribe(
            data => {
              let res = data["resource"];
              // console.log('Current Name : ' + this.NAME_ngModel_Edit + ', Previous Name : ' + localStorage.getItem('Prev_set_NAME'));
              if (res.length == 0) {
                console.log("No records Found");
                this.page_entry.NAME = this.NAME_ngModel_Edit.trim();

                //**************Update service if it is new details*************************
                this.pagesetupservice.update(this.page_entry)
                  .subscribe((response) => {
                    if (response.status == 200) {
                      alert('Pagesetup updated successfully');
                      this.navCtrl.setRoot(this.navCtrl.getActive().component);
                    }
                  });
                //**************************************************************************
              }
              else {
                console.log("Records Found");
                alert("The pagesetup is already Exist.");
                this.loading.dismissAll();
              }
            },
            err => {
              this.Exist_Record = false;
              console.log("ERROR!: ", err);
            });
      }
      else {
        if (this.page_entry.NAME == null) { this.page_entry.NAME = localStorage.getItem('Prev_set_NAME'); }
        this.page_entry.NAME = this.NAME_ngModel_Edit.trim();

        //**************Update service if it is old details*************************

        this.pagesetupservice.update(this.page_entry)
          .subscribe((response) => {
            if (response.status == 200) {
              alert('Page updated successfully');
              this.navCtrl.setRoot(this.navCtrl.getActive().component);
            }
          });
        //  }
      }
    }
  }

  stores: any[];
  search(searchString: any) {
    let val = searchString.target.value;
    if (!val || !val.trim()) {
      this.pages = this.stores;
      return;
    }
    this.pages = this.filter({
      NAME: val,
      DESCRIPTION: val,
      URL: val,
      CODE_PAGE_NAME: val
    });
  }

  filter(params?: any) {
    if (!params) {
      return this.stores;
    }

    return this.stores.filter((item) => {
      for (let key in params) {
        let field = item[key];
        if (typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
          return item;
        } else if (field == params[key]) {
          return item;
        }
      }
      return null;
    });
  }

  ClearControls() {
    this.NAME_ngModel_Add = "";
    this.DESCRIPTION_ngModel_Add = "";
    this.URL_ngModel_Add = "";
  }

}
