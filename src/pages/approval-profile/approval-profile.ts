import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UUID } from 'angular2-uuid';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { approval_profile_model } from '../../models/approval_profile_model';
import { Main_Profile_Model } from '../../models/main_profile_model';
import { ApiManagerProvider } from '../../providers/api-manager.provider';
import { OptimizeProvider } from '../../providers/optimize.provider';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-approval-profile',
  templateUrl: 'approval-profile.html',
})
export class ApprovalProfilePage {
  ProfileForm: FormGroup;
  public approvedClicked: boolean = true;
  public rejectedClicked: boolean = true;
  public AddProfileClicked: boolean = false;
  public AddLevelClicked: boolean = false;
  public AddLevel_1_Clicked: boolean = false;
  public addPlusClicked: boolean = true;
  public addMinusClicked: boolean = false;
  public SaveButton: boolean;
  Level_Id_ngModel: any;
  Approver_name_ngModel: string = "directManager";
  Approver_Value_ngModel: any;
  Approved_Condition_ngModel: string = "false";
  Approved_Level_ngModel: any;
  Rejected_Condition_ngModel: string = "false";
  Rejected_Level_ngModel: any;
  approver_selected: any; TenantGUID: string;
  users_list: any[] = [];
  Temp_Data: any[] = []; profile_name_ngmodel: any;
  public Info: any[];
  approvalRef: approval_profile_model = new approval_profile_model();
  profileRef: Main_Profile_Model = new Main_Profile_Model();
  constructor(public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams, public api: ApiManagerProvider) {
    // this.optimizeProvider.CheckSessionOut();
    this.TenantGUID = localStorage.getItem('g_TENANT_GUID');
    this.ProfileForm = fb.group({
      'Level_Id': [null, Validators.compose([Validators.required])],
      'Approver': [null, Validators.compose([Validators.required])],
      'Approver_Value': [],
      'Approved_Condition': [],
      'Approved_Level': [],
      'Rejected_Condition': [],
      'Rejected_Level': [],
      'profile_name': [null, Validators.compose([Validators.required])],
    })
    this.LoadUsers();
  }


  LoadUsers() {
    this.api.getApiModel('view_get_tenant_admin', 'filter=(TENANT_GUID=' + this.TenantGUID + ')')
      .subscribe(data => {
        this.users_list = data["resource"];
      });
  }
  isDirectManager: boolean = true;
  Approver_Changed(value: any) {
    if (value === 'keytype')
      this.isDirectManager = false;
    else
      this.isDirectManager = true;
    this.approver_selected = value;
  }

  Approved_Level_Change(value: any) {
    if (value = "false") {
      this.approvedClicked = !this.approvedClicked;
    }
    this.Buttons_SetVisible();
  }

  Rejected_Level_Change(value: any) {
    if (value = "false") {
      this.rejectedClicked = !this.rejectedClicked;
    }
    this.Buttons_SetVisible();
  }

  public Buttons_SetVisible() {
    if (this.Approved_Condition_ngModel == "false" && this.Rejected_Condition_ngModel == "false") {
      this.addPlusClicked = true;
    }
    else {
      this.addPlusClicked = true;
    }

    if (this.Level_Id_ngModel == 3) {
      this.SaveButton = true;
      this.addPlusClicked = false;
    }
  }

  public CreateProfile() {
    this.AddProfileClicked = true;
    this.Buttons_SetVisible();
    this.ClearControls();
    this.Level_Id_ngModel = "";
    this.Temp_Data = [];
  }

  public ClearControls() {
    this.Approver_Value_ngModel = "";
    this.Rejected_Level_ngModel = "";
    this.Approved_Level_ngModel = "";
    this.Approver_name_ngModel = "directManager";
    this.Approved_Condition_ngModel = "false";
    this.Rejected_Condition_ngModel = "false";
    this.AddLevelClicked = true;
  }

  save() {

    var json_Finaldata = '"-id": "' + this.Level_Id_ngModel.toString() +
      '", "approver": {"-' + this.Approver_name_ngModel.toString() + '" :  "userGUID", "#text": "' + this.Approver_Value_ngModel.toString() +
      '" }, "conditions": { "condition": [ { "-status": "rejected", "nextlevel": { "-final": "' + this.Rejected_Condition_ngModel + '",' +
      ' "#text": "' + this.Rejected_Level_ngModel +
      '" } }, { "-status": "approved", "nextlevel": { "-final": "' + this.Approved_Condition_ngModel +
      '", "#text": " " } } ] }';
    var final_data = JSON.stringify('{' + json_Finaldata + '}')

    let re = /\\/gi;
    final_data = final_data.replace(re, '')
    let re1 = /""/gi;
    final_data = final_data.replace(re1, '"')
    let re2 = /}"/gi;
    final_data = final_data.replace(re2, '}')

    let re3 = /"{/gi;
    final_data = final_data.replace(re3, '{')

    this.Temp_Data.push(final_data + '] } } }');
    console.log(final_data)
    console.log(this.Temp_Data)

    this.profileRef.MAIN_PROFILE_GUID = UUID.UUID();
    this.profileRef.PROFILE_NAME = this.profile_name_ngmodel.toString();
    this.profileRef.PROFILE_JSON = this.Temp_Data.toString();
    this.profileRef.TENANT_GUID = UUID.UUID();
    this.profileRef.TENANT_SITE_GUID = UUID.UUID();
    this.profileRef.CREATION_TS = this.api.CreateTimestamp();
    this.profileRef.UPDATE_TS = this.api.CreateTimestamp();
    this.profileRef.CREATION_USER_GUID = "1";
    this.profileRef.UPDATE_USER_GUID = "1";

    this.api.postData('main_profile', this.profileRef.toJson(true)).subscribe((response) => {
      //var postClaimRef = response.json();
      // console.log(
      //   postClaimRef["resource"][0].CLAIM_REQUEST_DETAIL_GUID);

    })
    alert('Profile successfully created')
  }
  AddLevel() {
    let firstLevel = '"1';
    if (this.Level_Id_ngModel.toString() != '1')
      firstLevel = ' "userGUID", "#text": "';
    var jsondata = '"-id": "' + this.Level_Id_ngModel.toString() +
      '", "approver": {"-' + this.Approver_name_ngModel.toString() + '" : ' + firstLevel + this.Approver_Value_ngModel.toString() +
      '" }, "conditions": { "condition": [ { "-status": "rejected", "nextlevel": { "-final": "' + this.Rejected_Condition_ngModel + '",' +
      ' "#text": "' + this.Rejected_Level_ngModel +
      '" } }, { "-status": "approved", "nextlevel": { "-final": "' + this.Approved_Condition_ngModel +
      '", "#text": "' + this.Approved_Level_ngModel + '" } } ] }';
    var data = JSON.stringify(jsondata)
    let re = /\\/gi;
    data = data.replace(re, '')
    let re1 = /""/gi;
    data = data.replace(re1, '"')
    let re2 = /}"/gi;
    data = data.replace(re2, '}')
    if (this.Level_Id_ngModel == 1) {
      this.Temp_Data.push('{ "profile": { "levels": { "level": [ {' + data + '}');
    }
    else {
      this.Temp_Data = this.Temp_Data.concat('{' + data + '}');
    }
    console.log(this.Temp_Data)
    this.ClearControls();
    this.Level_Id_ngModel = (parseInt(this.Level_Id_ngModel) + 1).toString();
    this.Buttons_SetVisible();
  }

}
