import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
//import { FormBuilder, FormGroup } from '@angular/forms';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { TenantSetup_Model } from '../../models/tenantsetup_model';
import { TenantSetup_Service } from '../../services/tenantsetup_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';



/**
 * Generated class for the TenantsetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-tenantsetup',
  templateUrl: 'tenantsetup.html', providers: [TenantSetup_Service, BaseHttpService]
})
export class TenantsetupPage {
  tenant_entry: TenantSetup_Model = new TenantSetup_Model();
  tenant: TenantSetup_Model = new TenantSetup_Model();
  Tenantform: FormGroup;

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/tenant_company_site' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  public tenants: TenantSetup_Model[] = [];

   public AddTenantClicked: boolean = false;
   public EditTenantClicked: boolean = false; 
   Exist_Record: boolean = false;
   public tenant_details: any; public exist_record_details: any;
 
    public AddTenantClick() {

        this.AddTenantClicked = true; 
    }

    public EditClick(TENANT_COMPANY_SITE_GUID: any) {
      console.log(TENANT_COMPANY_SITE_GUID);
      this.EditTenantClicked = true;
      var self = this;
      this.tenantsetupservice
        .get(TENANT_COMPANY_SITE_GUID)
        .subscribe((tenant) => self.tenant = tenant);
      return self.tenant;
    }
   
    public DeleteClick(TENANT_COMPANY_SITE_GUID: any) {
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
              this.tenantsetupservice.remove(TENANT_COMPANY_SITE_GUID)
                .subscribe(() => {
                  self.tenants = self.tenants.filter((item) => {
              this.tenantsetupservice.remove(TENANT_COMPANY_SITE_GUID)
                    return item.TENANT_COMPANY_SITE_GUID != TENANT_COMPANY_SITE_GUID
                  });
                });
              //this.navCtrl.setRoot(this.navCtrl.getActive().component);
            }
          }
        ]
      }); alert.present();
    }
  
    

      public CloseTenantClick() {

        if (this.AddTenantClicked == true) {
          this.AddTenantClicked = false;
        }
        if (this.EditTenantClicked == true) {
          this.EditTenantClicked = false;
        }
    }

  constructor(public navCtrl: NavController, public navParams: NavParams, fb:FormBuilder, public http: Http, private httpService: BaseHttpService, private tenantsetupservice: TenantSetup_Service, private alertCtrl: AlertController) {
    this.http
    .get(this.baseResourceUrl)
    .map(res => res.json())
    .subscribe(data => {
      this.tenants = data.resource;
    });

  this.Tenantform = fb.group({

    SITE_NAME: ["", Validators.required],
    REGISTRATION_NUM: ["", Validators.required],
    EMAIL: [null, Validators.compose([Validators.pattern('\\b[\\w.%-]+@[-.\\w]+\\.[A-Za-z]{2,4}\\b'), Validators.required])],
    //EMAIL: ["", Validators.required],
    
    // ADDRESS1: ["", Validators.required],
    // EMAIL: ["", Validators.required],
    // CONTACT_NO: ["", Validators.required],
    // WEBSITE: ["", Validators.required],
    // CONTACT_PERSON: ["", Validators.required],
    // CONTACT_PERSON_CONTACT_NO: ["", Validators.required],
    // CONTACT_PERSON_EMAIL: ["", Validators.required],    

    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TenantsetupPage');
  }
  Save() {
    if (this.Tenantform.valid) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      let url: string;
      url = "http://api.zen.com.my/api/v2/zcs/_table/tenant_company_site?filter=(REGISTRATION_NUM=" + this.tenant_entry.REGISTRATION_NUM + ")&api_key=cb82c1df0ba653578081b3b58179158594b3b8f29c4ee1050fda1b7bd91c3881";
      this.http.get(url, options)
        .map(res => res.json())
        .subscribe(
        data => {
          let res = data["resource"];
          if (res.length == 0) {
            console.log("No records Found");
            if (this.Exist_Record == false) {
      this.tenant_entry.TENANT_COMPANY_SITE_GUID = UUID.UUID();
      this.tenant_entry.TENANT_COMPANY_GUID = "298204b8-8c85-11e7-91cd-00155de7e742";
      this.tenant_entry.CREATION_TS = new Date().toISOString();
      this.tenant_entry.CREATION_USER_GUID = "1";
      this.tenant_entry.UPDATE_TS = new Date().toISOString();
      this.tenant_entry.UPDATE_USER_GUID = "";
     // this.role_entry.ACTIVATION_FLAG = 1;
      //this.role_entry.NAME=value.NAME;
      
      this.tenantsetupservice.save(this.tenant_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            alert('Tenant Registered successfully');
            //location.reload();
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        })
    }
  }
  else {
    console.log("Records Found");
    alert("The Tenant is already Added.")
    
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
  self.tenantsetupservice.get_tenant(params)
    .subscribe((tenants: TenantSetup_Model[]) => {
      self.tenants = tenants;
    });
}

  Update(TENANT_COMPANY_SITE_GUID: any) {  
    // if(this.tenant_entry.SITE_NAME==null){this.tenant_entry.SITE_NAME = this.tenant_entry.SITE_NAME;}
    // if(this.tenant_entry.REGISTRATION_NUM==null){this.tenant_entry.REGISTRATION_NUM = this.tenant_entry.REGISTRATION_NUM;}
    if (this.Tenantform.valid) {
      
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            let options = new RequestOptions({ headers: headers });
            let url: string;
            url = "http://api.zen.com.my/api/v2/zcs/_table/tenant_company_site?filter=(REGISTRATION_NUM=" + this.tenant_entry.REGISTRATION_NUM + ")&api_key=cb82c1df0ba653578081b3b58179158594b3b8f29c4ee1050fda1b7bd91c3881";
            this.http.get(url, options)
              .map(res => res.json())
              .subscribe(
              data => {
                let res = data["resource"];
                if (res.length == 0) {
                  console.log("No records Found");
                  if (this.Exist_Record == false) {
    if (this.Tenantform.valid) {
      this.tenant_entry.CREATION_TS = this.tenant.CREATION_TS;
      this.tenant_entry.CREATION_USER_GUID = this.tenant.CREATION_USER_GUID;
      this.tenant_entry.UPDATE_TS = this.tenant.UPDATE_TS;
      this.tenant_entry.TENANT_COMPANY_GUID = this.tenant.TENANT_COMPANY_GUID;

      this.tenant_entry.TENANT_COMPANY_SITE_GUID = TENANT_COMPANY_SITE_GUID;
      this.tenant_entry.UPDATE_TS = new Date().toISOString();
      this.tenant_entry.UPDATE_USER_GUID = "";
      
      this.tenantsetupservice.update(this.tenant_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            alert('Tenant Type updated successfully');
            //location.reload();
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        })
    }
  }
 }
 else {
  console.log("Records Found");
  alert("The Tenant is already Added.")
  
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
