import { Component } from '@angular/core';
import { NavParams, Tabs } from 'ionic-angular';

import { SetupPage } from '../setup/setup';
import { AdminsetupPage } from '../adminsetup/adminsetup';
import { ApproverTaskListPage } from '../approver-task-list/approver-task-list';
import { ClaimapprovertasklistPage } from '../claimapprovertasklist/claimapprovertasklist';
import { UserclaimslistPage } from '../userclaimslist/userclaimslist';
import { ClaimtasklistPage } from '../claimtasklist/claimtasklist';
import { DashboardPage } from '../dashboard/dashboard';
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // set the root pages for each tab
  // tab1Root: any = SpeakerListPage;
  // tab2Root: any = SetupPage;
  // tab3Root: any = AdminsetupPage;
  // //tab4Root: any = ApproverTaskListPage;
  // tab4Root: any = ClaimapprovertasklistPage;

  mySelectedIndex: number;
  tabs: any;
  constructor(navParams: NavParams) {
    // this.mySelectedIndex = navParams.data.tabIndex || 0;
    this.tabs = [
      // { title: "HOME", root: SpeakerListPage, icon: "apps" },
      // { title: "SETUP", root: SetupPage, icon: "settings" },
      // { title: "ADMIN SETUP", root: AdminsetupPage, icon: "settings" },
      // { title: "APPROVER TASK", root: ClaimapprovertasklistPage, icon: "checkbox-outline" },

      { title: "DASHBOARD", root: DashboardPage, icon: "apps" },
      { title: "MY CLAIM LIST", root: UserclaimslistPage, icon: "settings" },      
      { title: "APPROVER TASK", root: ClaimapprovertasklistPage, icon: "checkbox-outline" },
    ];

    // this.tabs = navParams.data;
    // this.tabs = navParams.get('Menu_Array');
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

}
