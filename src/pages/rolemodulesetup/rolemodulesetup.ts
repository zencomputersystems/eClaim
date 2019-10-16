import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
//import { FormBuilder, FormGroup } from '@angular/forms';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { BaseHttpService } from '../../services/base-http';
import { UUID } from 'angular2-uuid';

import { LoginPage } from '../login/login';

import { RoleModuleSetup_Model } from '../../models/rolemodulesetup_model';
import { RoleModuleSetup_Service } from '../../services/rolemodulesetup_service';

/**
 * Generated class for the RolemodulesetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-rolemodulesetup',
  templateUrl: 'rolemodulesetup.html', providers: [RoleModuleSetup_Service, BaseHttpService]
})
export class RolemodulesetupPage {
  public page: number = 1;
  Rolemoduleform: FormGroup;
  //For Add Module----------------------------
  ROLENAME_ngModel_Add: any;
  ROLEMAINMODULE_ngModel_Add: any;

  //For Edit Module----------------------------
  ROLENAME_ngModel_Edit: any;

  //------------------------------------------
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
  // baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_rolemodule' + '?order=ROLE_NAME&api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_rolemodule' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  roles: any;
  modules: any;
  rolemodules: any;
  Module_Assign_Edit: any;

  public Module_Availble: any = [];
  public Module_Assign: any = [];
  public Module_Assign_Multiple: any = [];
  public Role_Module: any = [];
  public rolemodule: RoleModuleSetup_Model[] = [];

  RoleModule_Entry: RoleModuleSetup_Model = new RoleModuleSetup_Model();

  public strModuleName: string;

  public AddRoleModuleClicked: boolean = false;
  public EditRoleModuleClicked: boolean = false;

  public AddRoleModuleClick() {
    this.AddRoleModuleClicked = true;
  }

  public CloseRoleModuleClick() {
    if (this.AddRoleModuleClicked == true) {
      this.AddRoleModuleClicked = false;
    }
    if (this.EditRoleModuleClicked == true) {
      this.EditRoleModuleClicked = false;

      this.modules = [];
      this.Module_Assign = [];
      this.BindAvailbleModule();
    }
  }

  loading: Loading;

  SetupDisplay: boolean = false;
  // AdminSetupDisplay: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private rolemodulesetupservice: RoleModuleSetup_Service, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    // if (localStorage.getItem("g_USER_GUID") == "sva") {
    //Display Grid------------------------------------
    this.DisplayGrid();

    //Bind Role----------------------------------------
    this.BindRole();

    this.BindSubModule();

    //Bind Main Module---------------------------------
    this.BindAvailbleModule();

    this.Rolemoduleform = fb.group({
      ROLENAME: ["", Validators.required],
      SETUPSUBMODULE: null,
      ADMINSETUPSUBMODULE: null,
    });
    // }
    // else {
    //   alert("Sorry. This is for only Super Admin.");
    //   this.navCtrl.setRoot(LoginPage);
    // }
  }

  DisplayGrid() {
    var Previous_ROLE_GUID: string;
    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();

    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        //Get the value and push it to new array----------------------------
        for (var itemA in data.resource) {
          if (Previous_ROLE_GUID != data.resource[itemA]["ROLE_GUID"]) {

            let Main_Current_ROLE_Guid: string = data.resource[itemA]["ROLE_GUID"];
            this.strModuleName = "";

            for (var itemB in data.resource) {
              let Child_Current_ROLE_Guid: string = data.resource[itemB]["ROLE_GUID"];
              if (Main_Current_ROLE_Guid == Child_Current_ROLE_Guid) {

                if (this.strModuleName != "" && this.strModuleName != undefined) {
                  this.strModuleName = this.strModuleName + ', ' + data.resource[itemB]["MODULE_NAME"];
                }
                else {
                  this.strModuleName = data.resource[itemB]["MODULE_NAME"];
                }
              }
            }

            this.Role_Module.push({ ROLE_GUID: data.resource[itemA]["ROLE_GUID"], ROLE_NAME: data.resource[itemA]["ROLE_NAME"], MODULE_GUID: data.resource[itemA]["MODULE_GUID"], MODULE_NAME: this.strModuleName, SUB_MODULE_NAME: data.resource[itemA]["SUB_MODULE"] });
          }

          Previous_ROLE_GUID = data.resource[itemA]["ROLE_GUID"];
        }

        this.stores = this.Role_Module;
        this.loading.dismissAll();
      });
  }

  strSubModuleName: string = "";
  GetRoleSubModule(ROLE_GUID: string) {
    this.strSubModuleName = "";
    let url_sub_module: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_role_submodule' + '?filter=(ROLE_GUID=' + ROLE_GUID + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    let result: any;
    return new Promise((resolve) => {
      this.http
        .get(url_sub_module)
        .map(res => res.json())
        .subscribe(data1 => {
          result = data1["resource"];

          for (var item in data1.resource) {
            if (this.strSubModuleName != "" && this.strSubModuleName != undefined) {
              this.strSubModuleName = this.strSubModuleName + ', ' + data1.resource[item]["NAME"];
            }
            else {
              this.strSubModuleName = data1.resource[item]["NAME"];
            }
          }

          // resolve(result);
          resolve(this.strSubModuleName);
        });
    });
  }

  DeleteRoleModule(ROLE_GUID: any) {
    this.rolemodulesetupservice.remove(ROLE_GUID)
      .subscribe(() => {
        this.rolemodule = this.rolemodule.filter((item) => {
          return item.ROLE_GUID != ROLE_GUID;
        });
        // this.navCtrl.setRoot(this.navCtrl.getActive().component);

        this.Module_Assign_Multiple = [];
        if (this.EditRoleModuleClicked == true) {
          //Insert------------------------------------------------------------ 
          for (var item in this.Module_Assign) {
            this.RoleModule_Entry.ROLE_MODULE_GUID = UUID.UUID();
            this.RoleModule_Entry.ROLE_GUID = this.ROLENAME_ngModel_Edit;
            this.RoleModule_Entry.MODULE_GUID = this.Module_Assign[item]["MODULE_GUID"];
            // this.RoleModule_Entry.CREATION_TS = new Date().toISOString();
            // this.RoleModule_Entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
            this.RoleModule_Entry.UPDATE_TS = new Date().toISOString();
            this.RoleModule_Entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");
            this.RoleModule_Entry.MODULE_SLNO = (parseInt(item) + 1).toString();
            this.RoleModule_Entry.MODULE_FLAG = "M";

            this.Module_Assign_Multiple.push({ ROLE_MODULE_GUID: this.RoleModule_Entry.ROLE_MODULE_GUID, ROLE_GUID: this.RoleModule_Entry.ROLE_GUID, MODULE_GUID: this.RoleModule_Entry.MODULE_GUID, CREATION_TS: this.RoleModule_Entry.CREATION_TS, CREATION_USER_GUID: this.RoleModule_Entry.CREATION_USER_GUID, UPDATE_TS: this.RoleModule_Entry.UPDATE_TS, UPDATE_USER_GUID: this.RoleModule_Entry.UPDATE_USER_GUID, MODULE_SLNO: this.RoleModule_Entry.MODULE_SLNO, MODULE_FLAG: this.RoleModule_Entry.MODULE_FLAG });
          }

          for (var SUBMODULE_GUID of this.SETUPSUBMODULE_ngModel_Edit) {
            this.RoleModule_Entry.ROLE_MODULE_GUID = UUID.UUID();
            this.RoleModule_Entry.ROLE_GUID = this.ROLENAME_ngModel_Edit;
            this.RoleModule_Entry.MODULE_GUID = SUBMODULE_GUID;
            // this.RoleModule_Entry.CREATION_TS = new Date().toISOString();
            // this.RoleModule_Entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
            this.RoleModule_Entry.UPDATE_TS = new Date().toISOString();
            this.RoleModule_Entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");
            this.RoleModule_Entry.MODULE_SLNO = (parseInt(item) + 1).toString();
            this.RoleModule_Entry.MODULE_FLAG = "S";

            this.Module_Assign_Multiple.push({ ROLE_MODULE_GUID: this.RoleModule_Entry.ROLE_MODULE_GUID, ROLE_GUID: this.RoleModule_Entry.ROLE_GUID, MODULE_GUID: this.RoleModule_Entry.MODULE_GUID, CREATION_TS: this.RoleModule_Entry.CREATION_TS, CREATION_USER_GUID: this.RoleModule_Entry.CREATION_USER_GUID, UPDATE_TS: this.RoleModule_Entry.UPDATE_TS, UPDATE_USER_GUID: this.RoleModule_Entry.UPDATE_USER_GUID, MODULE_SLNO: this.RoleModule_Entry.MODULE_SLNO, MODULE_FLAG: this.RoleModule_Entry.MODULE_FLAG });
          }

          this.rolemodulesetupservice.save_multiple_recocrd(this.Module_Assign_Multiple)
            .subscribe((response) => {
              if (response.status == 200) {
                alert('Role Module Updated successfully'); //this.loading.dismissAll();
                this.navCtrl.setRoot(this.navCtrl.getActive().component);
              }
            });
        }
        else {
          this.navCtrl.setRoot(this.navCtrl.getActive().component);
        }
      });
  }

  BindRole() {
    let url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_role' + '?order=NAME&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http
      .get(url)
      .map(res => res.json())
      .subscribe(data => {
        this.roles = data.resource;
      });
  }

  setuppages: any;
  BindSubModule() {
    // let url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_rolepage' + '?order=NAME&api_key=' + constants.DREAMFACTORY_API_KEY;
    let url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_get_submodule' + '?order=NAME&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http
      .get(url)
      .map(res => res.json())
      .subscribe(data => {
        this.setuppages = data.resource;
      });
  }

  BindAvailbleModule() {
    let url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_module' + '?filter=(MODULE_GUID!=69750787-6fca-65a6-d943-5b1c075874a3)&order=NAME&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http
      .get(url)
      .map(res => res.json())
      .subscribe(data => {
        this.modules = data.resource;
      });
  }

  SelectFromAvailbleModule(e: any, SelectedModule: any) {
    if (e.checked == true) {
      this.Module_Assign.push({ MODULE_GUID: SelectedModule.MODULE_GUID, MODULE_NAME: SelectedModule.NAME });
      this.RemoveSelectionFromAvailbleModule(e, SelectedModule);

      //For display Submodule-----------
      if (SelectedModule.NAME == "Setup") {
        this.SetupDisplay = true;
      }
      // if(SelectedModule.NAME == "Admin Setup"){
      //   this.AdminSetupDisplay = true;
      // }

    }
  }

  SelectAllAvailableModule() {
    //All the module should insert to AssignedModuleCheckbox--------------- 
    for (var item in this.modules) {
      this.Module_Assign.push({ MODULE_GUID: this.modules[item]["MODULE_GUID"], MODULE_NAME: this.modules[item]["NAME"] });
    }

    //Clear All the module From AvailableModuleCheckbox---------------    
    this.modules = [];

    //For display Submodule-----------
    this.SetupDisplay = true;
    // this.AdminSetupDisplay = true;
  }

  RemoveSelectionFromAvailbleModule(e: any, SelectedModule: any) {
    if (e.checked == true) {
      let index = this.modules.indexOf(SelectedModule);
      if (index > -1) {
        this.modules.splice(index, 1);
      }
    }
  }

  RemoveSelectionFromAssignedModule(e: any, SelectedModule: any) {
    if (e.checked == true) {
      let index = this.Module_Assign.indexOf(SelectedModule);
      if (index > -1) {
        this.Module_Assign.splice(index, 1);
        this.modules.push({ MODULE_GUID: SelectedModule.MODULE_GUID, NAME: SelectedModule.MODULE_NAME });
      }

      //For display Submodule-----------
      if (SelectedModule.MODULE_NAME == "Setup") {
        this.SetupDisplay = false;
      }
      // if(SelectedModule.MODULE_NAME == "Admin Setup"){
      //   this.AdminSetupDisplay = false;
      // }
    }
  }

  SelectAllAssignedModule() {
    //All the module should insert to AvailbleModuleCheckbox--------------- 
    for (var item in this.Module_Assign) {
      this.modules.push({ MODULE_GUID: this.Module_Assign[item]["MODULE_GUID"], NAME: this.Module_Assign[item]["MODULE_NAME"] });
    }

    //Clear All the module From AvailableModuleCheckbox---------------    
    this.Module_Assign = [];

    //For display Submodule-----------
    this.SetupDisplay = false;
    // this.AdminSetupDisplay = false;
  }

  SETUPSUBMODULE_ngModel_Add: any;
  Save_RoleModule() {
    if (this.Rolemoduleform.valid) {
      //Load the Controller--------------------------------
      // this.loading = this.loadingCtrl.create({
      //   content: 'Please wait...',
      // });
      // this.loading.present();
      //--------------------------------------------------

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      let url: string;
      url = this.baseResource_Url + "role_module?filter=(ROLE_GUID=" + this.ROLENAME_ngModel_Add.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      this.http.get(url, options)
        .map(res => res.json())
        .subscribe(
          data => {
            let res = data["resource"];
            if (res.length == 0) {
              //Insert------------------------------------------------------------               
              for (var item in this.Module_Assign) {
                this.RoleModule_Entry.ROLE_MODULE_GUID = UUID.UUID();
                this.RoleModule_Entry.ROLE_GUID = this.ROLENAME_ngModel_Add;
                this.RoleModule_Entry.MODULE_GUID = this.Module_Assign[item]["MODULE_GUID"];
                this.RoleModule_Entry.CREATION_TS = new Date().toISOString();
                this.RoleModule_Entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
                this.RoleModule_Entry.UPDATE_TS = new Date().toISOString();
                this.RoleModule_Entry.UPDATE_USER_GUID = "";
                this.RoleModule_Entry.MODULE_SLNO = (parseInt(item) + 1).toString();
                this.RoleModule_Entry.MODULE_FLAG = "M";

                this.Module_Assign_Multiple.push({ ROLE_MODULE_GUID: this.RoleModule_Entry.ROLE_MODULE_GUID, ROLE_GUID: this.RoleModule_Entry.ROLE_GUID, MODULE_GUID: this.RoleModule_Entry.MODULE_GUID, CREATION_TS: this.RoleModule_Entry.CREATION_TS, CREATION_USER_GUID: this.RoleModule_Entry.CREATION_USER_GUID, UPDATE_TS: this.RoleModule_Entry.UPDATE_TS, UPDATE_USER_GUID: this.RoleModule_Entry.UPDATE_USER_GUID, MODULE_SLNO: this.RoleModule_Entry.MODULE_SLNO, MODULE_FLAG: this.RoleModule_Entry.MODULE_FLAG });
              }

              for (var SUBMODULE_GUID of this.SETUPSUBMODULE_ngModel_Add) {
                this.RoleModule_Entry.ROLE_MODULE_GUID = UUID.UUID();
                this.RoleModule_Entry.ROLE_GUID = this.ROLENAME_ngModel_Add;
                this.RoleModule_Entry.MODULE_GUID = SUBMODULE_GUID;
                this.RoleModule_Entry.CREATION_TS = new Date().toISOString();
                this.RoleModule_Entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
                this.RoleModule_Entry.UPDATE_TS = new Date().toISOString();
                this.RoleModule_Entry.UPDATE_USER_GUID = "";
                this.RoleModule_Entry.MODULE_SLNO = (parseInt(item) + 1).toString();
                this.RoleModule_Entry.MODULE_FLAG = "S";

                this.Module_Assign_Multiple.push({ ROLE_MODULE_GUID: this.RoleModule_Entry.ROLE_MODULE_GUID, ROLE_GUID: this.RoleModule_Entry.ROLE_GUID, MODULE_GUID: this.RoleModule_Entry.MODULE_GUID, CREATION_TS: this.RoleModule_Entry.CREATION_TS, CREATION_USER_GUID: this.RoleModule_Entry.CREATION_USER_GUID, UPDATE_TS: this.RoleModule_Entry.UPDATE_TS, UPDATE_USER_GUID: this.RoleModule_Entry.UPDATE_USER_GUID, MODULE_SLNO: this.RoleModule_Entry.MODULE_SLNO, MODULE_FLAG: this.RoleModule_Entry.MODULE_FLAG });
              }

              this.rolemodulesetupservice.save_multiple_recocrd(this.Module_Assign_Multiple)
                .subscribe((response) => {
                  if (response.status == 200) {
                    alert('Role Module Saved successfully');
                    // this.loading.dismissAll();
                    this.navCtrl.setRoot(this.navCtrl.getActive().component);
                  }
                });
            }
            else {
              console.log("Records found");
              alert("The role already exist.");
              // this.loading.dismissAll();
            }
          },
          err => {
            console.log("ERROR!: ", err);
          });
    }
  }

  SETUPSUBMODULE_ngModel_Edit: any;
  Update_RoleModule() {
    if (this.Rolemoduleform.valid) {
      // //Load the Controller--------------------------------
      // this.loading = this.loadingCtrl.create({
      //   content: 'Please wait...',
      // });
      // this.loading.present();
      // //--------------------------------------------------
      //insert record--------------------------------------
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });

      if (this.ROLENAME_ngModel_Edit.trim() != localStorage.getItem('Prev_role_module_guid')) {
        let url: string;
        url = this.baseResource_Url + "role_module?filter=(ROLE_GUID=" + this.ROLENAME_ngModel_Edit.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
        this.http.get(url, options)
          .map(res => res.json())
          .subscribe(
            data => {
              let res = data["resource"];
              if (res.length == 0) {
                //Delete all the records through role_guid--------------------------
                this.DeleteRoleModule(localStorage.getItem('Prev_role_module_guid'));
                // this.Module_Assign_Multiple = [];

                // //Insert------------------------------------------------------------ 
                // for (var item in this.Module_Assign) {
                //   this.RoleModule_Entry.ROLE_MODULE_GUID = UUID.UUID();
                //   this.RoleModule_Entry.ROLE_GUID = this.ROLENAME_ngModel_Edit;
                //   this.RoleModule_Entry.MODULE_GUID = this.Module_Assign[item]["MODULE_GUID"];
                //   // this.RoleModule_Entry.CREATION_TS = new Date().toISOString();
                //   // this.RoleModule_Entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
                //   this.RoleModule_Entry.UPDATE_TS = new Date().toISOString();
                //   this.RoleModule_Entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");

                //   this.Module_Assign_Multiple.push({ ROLE_MODULE_GUID: this.RoleModule_Entry.ROLE_MODULE_GUID, ROLE_GUID: this.RoleModule_Entry.ROLE_GUID, MODULE_GUID: this.RoleModule_Entry.MODULE_GUID, CREATION_TS: this.RoleModule_Entry.CREATION_TS, CREATION_USER_GUID: this.RoleModule_Entry.CREATION_USER_GUID, UPDATE_TS: this.RoleModule_Entry.UPDATE_TS, UPDATE_USER_GUID: this.RoleModule_Entry.UPDATE_USER_GUID });
                // }
                // this.rolemodulesetupservice.save_multiple_recocrd(this.Module_Assign_Multiple)
                //   .subscribe((response) => {
                //     if (response.status == 200) {
                //       alert('Role Module Updated successfully'); //this.loading.dismissAll();
                //       this.navCtrl.setRoot(this.navCtrl.getActive().component);
                //     }
                //   });
              }
              else {
                console.log("Records Found");
                // this.loading.dismissAll();
                alert("This role already exist.");
              }
            },
            err => {
              console.log("ERROR!: ", err);
              // this.loading.dismissAll();
            });
      }
      else {
        //Delete all the records through role_guid-----------
        this.DeleteRoleModule(localStorage.getItem('Prev_role_module_guid'));
        // this.Module_Assign_Multiple = [];

        //Insert------------------------------------------------------------
        // for (var itemA in this.Module_Assign) {
        //   this.RoleModule_Entry.ROLE_MODULE_GUID = UUID.UUID();
        //   this.RoleModule_Entry.ROLE_GUID = localStorage.getItem('Prev_role_module_guid');
        //   this.RoleModule_Entry.MODULE_GUID = this.Module_Assign[itemA]["MODULE_GUID"];
        //   this.RoleModule_Entry.CREATION_TS = new Date().toISOString();
        //   this.RoleModule_Entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
        //   this.RoleModule_Entry.UPDATE_TS = new Date().toISOString();
        //   this.RoleModule_Entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");

        //   this.Module_Assign_Multiple.push({ ROLE_MODULE_GUID: this.RoleModule_Entry.ROLE_MODULE_GUID, ROLE_GUID: this.RoleModule_Entry.ROLE_GUID, MODULE_GUID: this.RoleModule_Entry.MODULE_GUID, CREATION_TS: this.RoleModule_Entry.CREATION_TS, CREATION_USER_GUID: this.RoleModule_Entry.CREATION_USER_GUID, UPDATE_TS: this.RoleModule_Entry.UPDATE_TS, UPDATE_USER_GUID: this.RoleModule_Entry.UPDATE_USER_GUID });
        // }
        // this.rolemodulesetupservice.save_multiple_recocrd(this.Module_Assign_Multiple)
        //   .subscribe((response) => {
        //     if (response.status == 200) {
        //       alert('Role Module Updated successfully');
        //       //this.loading.dismissAll();
        //       this.navCtrl.setRoot(this.navCtrl.getActive().component);
        //     }
        //   });
      }
    }
  }

  SubModule_Edit: any;
  EditClick(ROLE_GUID: any) {
    this.SetupDisplay = false;
    this.EditRoleModuleClicked = true;
    this.ROLENAME_ngModel_Edit = ROLE_GUID; localStorage.setItem('Prev_role_module_guid', ROLE_GUID);

    //Bind the Availble Checbox controls------------------------- 
    this.Module_Assign = [];

    //Bind the Assigned Check Box Controls----------------------- 
    this.Module_Assign = [];
    let role_assign_url = this.baseResource_Url + "vw_rolemodule?filter=(ROLE_GUID=" + ROLE_GUID + ')&api_key=' + constants.DREAMFACTORY_API_KEY;

    //Load the Controller--------------------------------
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
    });
    this.loading.present();
    //--------------------------------------------------
    this.http
      .get(role_assign_url)
      .map(res => res.json())
      .subscribe(data => {
        this.Module_Assign_Edit = data.resource;
        for (var item in this.Module_Assign_Edit) {
          this.Module_Assign.push({ MODULE_GUID: this.Module_Assign_Edit[item]["MODULE_GUID"], MODULE_NAME: this.Module_Assign_Edit[item]["MODULE_NAME"] });

          //Bind the Availble Checbox controls--------------------
          for (var itemA in this.modules) {
            if (this.modules[itemA]["MODULE_GUID"] == this.Module_Assign_Edit[item]["MODULE_GUID"]) {
              this.modules.splice(itemA, 1);
            }
          }

          //Bind all the data to model--------------------
          this.RoleModule_Entry.CREATION_TS = this.Module_Assign_Edit[item]["CREATION_TS"];
          this.RoleModule_Entry.CREATION_USER_GUID = this.Module_Assign_Edit[item]["CREATION_USER_GUID"];

          //Display submenu control------------------------
          if (this.Module_Assign_Edit[item]["MODULE_NAME"] == "Setup") {
            this.SetupDisplay = true;
          }
        }
        this.loading.dismissAll();
      });

    //Bind sub module controls--------------------
    let role_submodule_url: string = this.baseResource_Url + "view_role_submodule?filter=(ROLE_GUID=" + ROLE_GUID + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    let CheckSubModule: any = [];

    this.http
      .get(role_submodule_url)
      .map(res => res.json())
      .subscribe(data => {
        this.SubModule_Edit = data.resource;
        for (var item in this.SubModule_Edit) {
          CheckSubModule.push(this.SubModule_Edit[item]["MODULE_GUID"]);
        }
        this.SETUPSUBMODULE_ngModel_Edit = CheckSubModule;
        if (CheckSubModule.length > 0) {
          this.SetupDisplay = true;
        }
      });
  }

  DeleteClick(ROLE_GUID: any) {
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

            this.rolemodulesetupservice.remove(ROLE_GUID)
              .subscribe(() => {
                self.rolemodule = self.rolemodule.filter((item) => {
                  return item.ROLE_GUID != ROLE_GUID;
                });
                this.navCtrl.setRoot(this.navCtrl.getActive().component);
              });
          }
        }
      ]
    }); alert.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RolemodulesetupPage');
  }

  stores: any[];
  search(searchString: any) {
    let val = searchString.target.value;
    if (!val || !val.trim()) {
      this.Role_Module = this.stores;
      return;
    }
    this.Role_Module = this.filter({
      ROLE_NAME: val,
      MODULE_NAME: val
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
}
