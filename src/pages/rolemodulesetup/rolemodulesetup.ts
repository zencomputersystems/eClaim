import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
//import { FormBuilder, FormGroup } from '@angular/forms';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
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
  Rolemoduleform: FormGroup;
  //For Add Module----------------------------
  ROLENAME_ngModel_Add: any;
  ROLEMAINMODULE_ngModel_Add: any;

  //For Edit Module----------------------------
  ROLENAME_ngModel_Edit: any;

  //------------------------------------------
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_rolemodule' + '?order=ROLE_NAME&api_key=' + constants.DREAMFACTORY_API_KEY;
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

  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private rolemodulesetupservice: RoleModuleSetup_Service, private alertCtrl: AlertController) {
    if (localStorage.getItem("g_USER_GUID") == "sva") {
      //Display Grid------------------------------------
      this.DisplayGrid();

      //Bind Role----------------------------------------
      this.BindRole();

      //Bind Main Module---------------------------------
      this.BindAvailbleModule();

      this.Rolemoduleform = fb.group({
        ROLENAME: ["", Validators.required],
        //ROLEMAINMODULE: ["", Validators.required],        
      });
    }
    else {
      alert("Sorry !! This is for only Super Admin.");
      this.navCtrl.push(LoginPage);
    }
  }

  DisplayGrid() {
    var Previous_ROLE_GUID: string;

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
            this.Role_Module.push({ ROLE_GUID: data.resource[itemA]["ROLE_GUID"], ROLE_NAME: data.resource[itemA]["ROLE_NAME"], MODULE_GUID: data.resource[itemA]["MODULE_GUID"], MODULE_NAME: this.strModuleName });
          }

          Previous_ROLE_GUID = data.resource[itemA]["ROLE_GUID"];
        }
      });
  }

  DeleteRoleModule(ROLE_GUID: any) {
    this.rolemodulesetupservice.remove(ROLE_GUID)
      .subscribe(() => {
        this.rolemodule = this.rolemodule.filter((item) => {
          return item.ROLE_GUID != ROLE_GUID;
        });
        this.navCtrl.setRoot(this.navCtrl.getActive().component);
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

  BindAvailbleModule() {
    let url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_module' + '?order=NAME&api_key=' + constants.DREAMFACTORY_API_KEY;
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
    }
  }

  SelectAllAvailableModule() {
    //All the module should insert to AssignedModuleCheckbox--------------- 
    for (var item in this.modules) {
      this.Module_Assign.push({ MODULE_GUID: this.modules[item]["MODULE_GUID"], MODULE_NAME: this.modules[item]["NAME"] });
    }

    //Clear All the module From AvailableModuleCheckbox---------------    
    this.modules = [];
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
    }
  }

  SelectAllAssignedModule() {
    //All the module should insert to AvailbleModuleCheckbox--------------- 
    for (var item in this.Module_Assign) {
      this.modules.push({ MODULE_GUID: this.Module_Assign[item]["MODULE_GUID"], NAME: this.Module_Assign[item]["MODULE_NAME"] });
    }

    //Clear All the module From AvailableModuleCheckbox---------------    
    this.Module_Assign = [];
  }

  Save_RoleModule() {
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

              this.Module_Assign_Multiple.push({ ROLE_MODULE_GUID: this.RoleModule_Entry.ROLE_MODULE_GUID, ROLE_GUID: this.RoleModule_Entry.ROLE_GUID, MODULE_GUID: this.RoleModule_Entry.MODULE_GUID, CREATION_TS: this.RoleModule_Entry.CREATION_TS, CREATION_USER_GUID: this.RoleModule_Entry.CREATION_USER_GUID, UPDATE_TS: this.RoleModule_Entry.UPDATE_TS, UPDATE_USER_GUID: this.RoleModule_Entry.UPDATE_USER_GUID });
            }
            this.rolemodulesetupservice.save_multiple_recocrd(this.Module_Assign_Multiple)
              .subscribe((response) => {
                if (response.status == 200) {
                  alert('Role Module Saved successfully');
                  this.navCtrl.setRoot(this.navCtrl.getActive().component);
                }
              });
          }
          else {
            console.log("Records Found");
            alert("This Role Already Exist !!");
          }
        },
        err => {
          console.log("ERROR!: ", err);
        });
  }

  Update_RoleModule() {
    //insert record--------------------------------------
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });

    if(this.ROLENAME_ngModel_Edit.trim() != localStorage.getItem('Prev_role_module_guid')){ 
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
              this.Module_Assign_Multiple=[];

              //Insert------------------------------------------------------------ 
              for (var item in this.Module_Assign) {
                this.RoleModule_Entry.ROLE_MODULE_GUID = UUID.UUID();
                this.RoleModule_Entry.ROLE_GUID = this.ROLENAME_ngModel_Edit;
                this.RoleModule_Entry.MODULE_GUID = this.Module_Assign[item]["MODULE_GUID"];
                // this.RoleModule_Entry.CREATION_TS = new Date().toISOString();
                // this.RoleModule_Entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
                this.RoleModule_Entry.UPDATE_TS = new Date().toISOString();
                this.RoleModule_Entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");
  
                this.Module_Assign_Multiple.push({ ROLE_MODULE_GUID: this.RoleModule_Entry.ROLE_MODULE_GUID, ROLE_GUID: this.RoleModule_Entry.ROLE_GUID, MODULE_GUID: this.RoleModule_Entry.MODULE_GUID, CREATION_TS: this.RoleModule_Entry.CREATION_TS, CREATION_USER_GUID: this.RoleModule_Entry.CREATION_USER_GUID, UPDATE_TS: this.RoleModule_Entry.UPDATE_TS, UPDATE_USER_GUID: this.RoleModule_Entry.UPDATE_USER_GUID });
              }
              this.rolemodulesetupservice.save_multiple_recocrd(this.Module_Assign_Multiple)
                .subscribe((response) => {
                  if (response.status == 200) {
                    alert('Role Module Updated successfully');
                    this.navCtrl.setRoot(this.navCtrl.getActive().component);
                  }
                });
            }
            else {
              console.log("Records Found");
              alert("This Role Already Exist !!");
            }
          },
          err => {
            console.log("ERROR!: ", err);
          });
    }
    else
    {
      //Delete all the records through role_guid-----------
      this.DeleteRoleModule(localStorage.getItem('Prev_role_module_guid'));
      this.Module_Assign_Multiple=[];

      //Insert------------------------------------------------------------
      for (var itemA in this.Module_Assign) {
        this.RoleModule_Entry.ROLE_MODULE_GUID = UUID.UUID();
        this.RoleModule_Entry.ROLE_GUID = localStorage.getItem('Prev_role_module_guid');
        this.RoleModule_Entry.MODULE_GUID = this.Module_Assign[itemA]["MODULE_GUID"];
        this.RoleModule_Entry.CREATION_TS = new Date().toISOString();
        this.RoleModule_Entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
        this.RoleModule_Entry.UPDATE_TS = new Date().toISOString();
        this.RoleModule_Entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");

        this.Module_Assign_Multiple.push({ ROLE_MODULE_GUID: this.RoleModule_Entry.ROLE_MODULE_GUID, ROLE_GUID: this.RoleModule_Entry.ROLE_GUID, MODULE_GUID: this.RoleModule_Entry.MODULE_GUID, CREATION_TS: this.RoleModule_Entry.CREATION_TS, CREATION_USER_GUID: this.RoleModule_Entry.CREATION_USER_GUID, UPDATE_TS: this.RoleModule_Entry.UPDATE_TS, UPDATE_USER_GUID: this.RoleModule_Entry.UPDATE_USER_GUID });
      }
      this.rolemodulesetupservice.save_multiple_recocrd(this.Module_Assign_Multiple)
        .subscribe((response) => {
          if (response.status == 200) {            
            alert('Role Module Updated successfully');
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        });
    }
  }

  EditClick(ROLE_GUID: any) {
    this.EditRoleModuleClicked = true;
    this.ROLENAME_ngModel_Edit = ROLE_GUID; localStorage.setItem('Prev_role_module_guid', ROLE_GUID);

    //Bind the Availble Checbox controls------------------------- 
    this.Module_Assign = [];

    //Bind the Assigned Check Box Controls----------------------- 
    this.Module_Assign = [];
    let role_assign_url = this.baseResource_Url + "vw_rolemodule?filter=(ROLE_GUID=" + ROLE_GUID + ')&api_key=' + constants.DREAMFACTORY_API_KEY;

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
        }
      });
  }

  DeleteClick(ROLE_GUID: any) {
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
}
