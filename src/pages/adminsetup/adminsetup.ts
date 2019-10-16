import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SubsciptionsetupPage } from '../subsciptionsetup/subsciptionsetup';
import { TenantsetupPage } from '../tenantsetup/tenantsetup';
import { TranslatePage } from '../translate/translate';
import { PermissionPage } from '../permission/permission';
import { RolesetupPage } from '../rolesetup/rolesetup';
import { RolemodulesetupPage } from '../rolemodulesetup/rolemodulesetup';
import { PagesetupPage } from '../pagesetup/pagesetup';
import { ModulesetupPage } from '../modulesetup/modulesetup';
import { SubmodulesetupPage } from '../submodulesetup/submodulesetup';
import { ClaimhistoryPage } from '../claimhistory/claimhistory';
import { ProfileSetupPage } from '../profile-setup/profile-setup.component';
import { ApproverTaskListPage } from '../approver-task-list/approver-task-list';

import { ClaimapprovertasklistPage } from '../claimapprovertasklist/claimapprovertasklist';
import { ClaimtasklistPage } from '../claimtasklist/claimtasklist'
import { UserclaimslistPage } from '../userclaimslist/userclaimslist'
import { ClaimReportPage } from '../claim-report/claim-report';

// import { SettingsPage } from '../settings/settings';
import { UserPage } from '../user/user';


/**
 * Generated class for the AdminsetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-adminsetup',
  templateUrl: 'adminsetup.html',
})
export class AdminsetupPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  goToSubscriptionsetup() {
    this.navCtrl.push(SubsciptionsetupPage)
  }

  goToTenantsetup() {
    this.navCtrl.push(TenantsetupPage)
  }

  goToTranslate() {
    this.navCtrl.push(TranslatePage)
  }

  goToPermission() {
    this.navCtrl.push(PermissionPage)
  }

  // goToRolesetup() {
  //   this.navCtrl.push(RolesetupPage)
  // }

  // goToRoleModulesetup() {
  //   this.navCtrl.push(RolemodulesetupPage)
  // }

  goToPagesetup() {
    this.navCtrl.push(PagesetupPage)
  }

  goToModulesetup() {
    this.navCtrl.push(ModulesetupPage)
  }

  goToUser() {
    this.navCtrl.push(UserPage)
  }

  goToSubModulesetup() {
    this.navCtrl.push(SubmodulesetupPage)
  }
  goToClaimHistory() {
    this.navCtrl.push(ClaimhistoryPage)
  }

  goApproverTaskList() {
    this.navCtrl.push(ApproverTaskListPage)
  }

  goToClaimRequetList() {
    this.navCtrl.push(ClaimapprovertasklistPage, {
      claimRefGuid: 'null'
    })
  }

  goToClaimTaskList() {
    this.navCtrl.push(ClaimtasklistPage)
  }
  goToUserClaimList() {
    this.navCtrl.push(UserclaimslistPage)
  }

  goToProfile() {
    this.navCtrl.push(ProfileSetupPage)
  }

  goToClaimReport() {
    this.navCtrl.push(ClaimReportPage)
  }

  // goToSettings() {
  //   this.navCtrl.push(SettingsPage);
  // }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminsetupPage');
  }

}
