import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import * as constants from '../../app/config/constants';
import { BaseHttpService } from '../../services/base-http';

import { LoginPage } from '../login/login';
import { ExcelService } from '../../providers/excel.service';


/**
 * Generated class for the DbmaintenancePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dbmaintenance',
  templateUrl: 'dbmaintenance.html', providers: [ExcelService]
})
export class DbmaintenancePage {
  DBMaintenanceform: FormGroup; TENANTNAME_ngModel: any; Table_ngModel:any;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
  constructor(private excelService: ExcelService, public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    //Load Tenant
    this.LoadTenant(); this.LoadTables();

    //Load Tables from db
    this.DBMaintenanceform = fb.group({      
      TENANTNAME: ["", Validators.required],
      TABLENAME: [""],
    });
  }

  tenants: any; AdminLogin: boolean = false;
  LoadTenant() {
    let tenantUrl: string = "";
    if (localStorage.getItem("g_USER_GUID") == "sva") {
      tenantUrl = this.baseResource_Url + 'tenant_main?order=TENANT_ACCOUNT_NAME&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    else {
      tenantUrl = this.baseResource_Url + 'tenant_main?filter=(TENANT_GUID=' + localStorage.getItem("g_TENANT_GUID") + ')&order=TENANT_ACCOUNT_NAME&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    // if (localStorage.getItem("g_USER_GUID") == "sva") {      
    this.http
      .get(tenantUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.tenants = data.resource;
      });

    this.AdminLogin = true;
    // }
    // else {
    //   this.AdminLogin = false;
    // }
  }

  tables: any; FilterTables: any[] = [];
  LoadTables() {
    let TableUrl: string = "";
    TableUrl = "http://api.zen.com.my/api/v2/zcs/_table?api_key=" + constants.DREAMFACTORY_API_KEY;

    this.http
      .get(TableUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.tables = data.resource;
        for (var item in this.tables) {
          var charNo = this.tables[item]["name"].indexOf(".");
          var curName = this.tables[item]["name"].substring(0, charNo);
          if (curName != "bitnami_dreamfactory" && curName != "cloud_services_db_dev" && curName != "esawitdb") {
            // this.FilterTables.push({ name: this.tables[item]["name"].substr(charNo + 1, (this.tables[item]["name"].length) - charNo) });
            this.FilterTables.push({ name: this.tables[item]["name"] });
          }
        }
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DbmaintenancePage');
  }

  selectedAll: any; selectAll: boolean 
  checkAllCheckBoxes(event: any) {
    // alert(event);
    if (event.checked == true) { 
      this.selectAll = true; 
      this.SelectTable = [];
      for (var item in this.tables) {
        this.SelectTable.push({ Table_Name: this.tables[item]["name"] });
      }
    }
    else {
      this.selectAll = false;
    }
  }

  public SelectTable: any[] = [];
  SelectTableItem(e: any, SelectedTable: any) {
    if (e.checked == true) {
      let index = this.FilterTables.indexOf(SelectedTable);
      if (index > -1) {
        this.SelectTable.push({ Table_Name: SelectedTable.name });
      }
    }
    else {
      for (var item in this.SelectTable) {
        if (this.SelectTable[item]["Table_Name"] == SelectedTable.name) {
          this.SelectTable.splice(Number(item), 1);
        }
      }
    }
  }

  public SelectTenant: any[] = [];
  SelectTenantItem(e: any, SelectTenant: any) {
    if (e.checked == true) {
      let index = this.tenants.indexOf(SelectTenant);
      if (index > -1) {
        this.SelectTenant.push({ TENANT_ACCOUNT_NAME: this.tenants.TENANT_ACCOUNT_NAME });
      }
    }
    else {
      for (var item in this.SelectTenant) {
        if (this.SelectTenant[item]["TENANT_ACCOUNT_NAME"] == SelectTenant.TENANT_ACCOUNT_NAME) {
          this.SelectTenant.splice(Number(item), 1);
        }
      }
    }
  }

  ExportToExcel(evt: any) {
    for (var item in this.SelectTable) {
      let TableName: any = this.SelectTable[item]["Table_Name"];
      let TableUrl: string = ""; let TempTableData: any;
      TableUrl = "http://api.zen.com.my/api/v2/zcs/_table/" + TableName + "?filter=(TENANT_GUID=" + this.TENANTNAME_ngModel + ")&api_key=" + constants.DREAMFACTORY_API_KEY;

      this.http
        .get(TableUrl)
        .map(res => res.json())
        .subscribe(data => {
          TempTableData = data.resource; this.excelService.exportAsExcelFile(TempTableData, TableName);          
        });
    }
  }
}
