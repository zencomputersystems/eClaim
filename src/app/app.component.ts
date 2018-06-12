import { BrowserModule } from '@angular/platform-browser';
import { Component, ViewChild } from '@angular/core';
import { Events, MenuController, Nav, Platform, NavController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Storage } from '@ionic/storage';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';
import { SetupPage } from '../pages/setup/setup';
import { MedicalclaimPage } from '../pages/medicalclaim/medicalclaim';
import { PrintclaimPage } from '../pages/printclaim/printclaim';
import { GiftclaimPage } from '../pages/giftclaim/giftclaim';
import { OvertimeclaimPage } from '../pages/overtimeclaim/overtimeclaim';
import { EntertainmentclaimPage } from '../pages/entertainmentclaim/entertainmentclaim';
import { TravelclaimPage } from '../pages/travel-claim/travel-claim.component';
import { MiscellaneousClaimPage } from '../pages/miscellaneous-claim/miscellaneous-claim';
import { ConferenceData } from '../providers/conference-data';
import { UserData } from '../providers/user-data';
import { UserPage } from '../pages/user/user';
import { SocRegistrationPage } from '../pages/soc-registration/soc-registration';
import { AdminsetupPage } from '../pages/adminsetup/adminsetup';

import { PeermissionPage } from '../pages/peermission/peermission';
import { RolemodulesetupPage } from '../pages/rolemodulesetup/rolemodulesetup';
import { PagesetupPage } from '../pages/pagesetup/pagesetup';
import { ModulesetupPage } from '../pages/modulesetup/modulesetup';
import { SubmodulesetupPage } from '../pages/submodulesetup/submodulesetup';

import { ClaimhistoryPage } from '../pages/claimhistory/claimhistory';
import { ClaimhistorydetailPage } from '../pages/claimhistorydetail/claimhistorydetail';
import { ClaimapprovertasklistPage } from '../pages/claimapprovertasklist/claimapprovertasklist';
import { ClaimtasklistPage } from '../pages/claimtasklist/claimtasklist'
import { UserclaimslistPage } from '../pages/userclaimslist/userclaimslist';
import { ClaimReportPage } from '../pages/claim-report/claim-report';

import { UploadPage } from '../pages/upload/upload';
import { CountrysetupPage } from '../pages/countrysetup/countrysetup';
import { StatesetupPage } from '../pages/statesetup/statesetup';

import { ApproverTaskListPage } from '../pages/approver-task-list/approver-task-list';
//import { TravelClaimViewPage } from '../pages/travel-claim-view/travel-claim-view';
import { SetupguidePage } from '../pages/setupguide/setupguide';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ProfileSetupPage } from '../pages/profile-setup/profile-setup.component';

import { CustomerSetupPage } from '../pages/customer-setup/customer-setup';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { DashboardPage } from '../pages/dashboard/dashboard';

import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import * as constants from '../app/config/constants';

export interface PageInterface {
  title: string;
  name: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabName?: string;
  tabComponent?: any;
}

@Component({
  templateUrl: 'app.template.html'
})
export class ConferenceApp {
  blnLogin: boolean = false;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
  public Menu_Array: any[] = [];
  //public setupPageClicked: boolean = false;
  //public setupPageClick() {
  //  this.setupPageClicked = !this.setupPageClicked;
  //}

  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  // List of pages that can be navigated to from the left menu
  // the left menu only works after login
  // the login page disables the left menu
  appPages: PageInterface[] = [
    // // { title: 'DASHBOARD', name: 'DashboardPage', component: DashboardPage, tabComponent: DashboardPage, index: 4, icon: 'apps' },
    // { title: 'HOME', name: 'TabsPage', component: TabsPage, tabComponent: SpeakerListPage, index: 0, icon: 'apps' },
    // { title: 'SETUP', name: 'TabsPage', component: TabsPage, tabComponent: SetupPage, index: 1, icon: 'settings' },
    // { title: 'ADMIN SETUP', name: 'TabsPage', component: TabsPage, tabComponent: AdminsetupPage, index: 2, icon: 'settings' },
    // // { title: 'APPROVER TASK', name: 'ApproverTaskListPage', component: TabsPage, tabComponent: ApproverTaskListPage, index: 3, icon: 'checkbox-outline' },

    { title: 'DASHBOARD', name: 'DashboardPage', component: DashboardPage, icon: 'apps' },
    { title: 'SETUP', name: 'SetupPage', component: SetupPage, icon: 'settings' },
    { title: 'ADMIN SETUP', name: 'AdminsetupPage', component: AdminsetupPage, icon: 'settings' },

    // { title: 'MY CLAIM LIST', name: 'TabsPage', component: TabsPage, tabComponent: UserclaimslistPage, index: 1, icon: 'ios-clipboard-outline' },
    // { title: 'APPROVER TASK LIST', name: 'TabsPage', component: TabsPage, tabComponent: ClaimapprovertasklistPage, index: 2, icon: 'checkbox-outline' },
    { title: 'MY CLAIM LIST', name: 'UserclaimslistPage', component: UserclaimslistPage, icon: 'ios-clipboard-outline' },
    { title: 'APPROVER TASK LIST', name: 'ClaimapprovertasklistPage', component: ClaimapprovertasklistPage, icon: 'checkbox-outline' },
    { title: 'FINANCE TASK LIST', name: 'ClaimtasklistPage', component: ClaimtasklistPage, icon: 'md-clipboard' },
    { title: 'CLAIM HISTORY', name: 'ClaimhistoryPage', component: ClaimhistoryPage, icon: 'ios-list-box-outline' },
    
  ];
  claimPages: PageInterface[] = [
    { title: 'TRAVEL CLAIM', name: 'TravelclaimPage', component: TravelclaimPage, icon: 'car' },
    { title: 'ENTERTAINMENT CLAIM', name: 'EntertainmentclaimPage', component: EntertainmentclaimPage, icon: 'cafe' },
    { title: 'GIFT CLAIM', name: 'GiftclaimPage', component: GiftclaimPage, icon: 'basket' },
    { title: 'OVERTIME CLAIM', name: 'OvertimeclaimPage', component: OvertimeclaimPage, icon: 'stopwatch' },
    { title: 'PRINTING CLAIM', name: 'PrintclaimPage', component: PrintclaimPage, icon: 'print' },
    { title: 'MISCLLANEOUS CLAIM', name: 'MiscellaneousClaimPage', component: MiscellaneousClaimPage, icon: 'albums' },
  ];
  loggedInPages: PageInterface[] = [
    // { title: 'ACCOUNT', name: 'AccountPage', component: AccountPage, icon: 'person' },
    { title: 'CHANGE PASSWORD', name: 'ChangePasswordPage', component: ChangePasswordPage, icon: 'unlock' },
    // { title: 'LOGOUT', name: 'TabsPage', component: TabsPage, icon: 'log-out', logsOut: true }
    { title: 'SIGN OUT', name: 'LoginPage', component: LoginPage, icon: 'log-out', logsOut: true }
  ];
  loggedOutPages: PageInterface[] = [
    { title: 'LOGIN', name: 'LoginPage', component: LoginPage, icon: 'log-in' },
    { title: 'SIGNUP', name: 'SignupPage', component: SignupPage, icon: 'person-add' },
    { title: 'FORGOT PASSWORD', name: 'LoginPage', component: LoginPage, icon: 'key' }
  ];


  // appPages_User: PageInterface[] = [    
  //   // { title: 'DASHBOARD', name: 'DashboardPage', component: DashboardPage, tabComponent: DashboardPage, index: 4, icon: 'apps' },
  //   { title: 'HOME', name: 'TabsPage', component: TabsPage, tabComponent: SpeakerListPage, index: 0, icon: 'apps' },
  //   { title: 'APPROVER TASK', name: 'ApproverTaskListPage', component: TabsPage, tabComponent: ApproverTaskListPage, index: 3, icon: 'checkbox-outline' },
  // ];

  // rootPage: any = LoginPage;
  //public events: Events,   

  rootPage = 'LoginPage';
  appPages_User: PageInterface[];

  constructor(
    public events: Events,
    public userData: UserData,
    public menu: MenuController,
    public platform: Platform,
    public confData: ConferenceData,
    public storage: Storage,
    statusbar: StatusBar,
    splashScreen: SplashScreen, public translate: TranslateService, public http: Http
  ) {
    //debugger;
    // this.appPages_User = [
    //   { title: 'HOME', name: 'TabsPage', component: TabsPage, tabComponent: SpeakerListPage, index: 0, icon: 'apps' },
    //   { title: 'APPROVER TASK', name: 'ApproverTaskListPage', component: TabsPage, tabComponent: ApproverTaskListPage, index: 3, icon: 'checkbox-outline' },
    // ];
    this.blnLogin = false;
    this.translateToEnglish();
    this.translate.setDefaultLang('en'); //Fallback language

    platform.ready().then(() => {
    });

    translate.setDefaultLang('en');
    platform.ready().then(() => { statusbar.styleDefault(); splashScreen.hide(); });

    // Check if the user has already seen the tutorial
    // load the conference data
    confData.load();

    // decide which menu items should be hidden by current login status stored in local storage    
    this.userData.hasLoggedIn().then((hasLoggedIn) => {
      this.enableMenu(hasLoggedIn === true);
    });

    //this.enableMenu(true);
    this.listenToLoginEvents();

    this.userData.logout();
    this.enableMenu(false);

    this.menu.enable(false, 'loggedInMenu');
  }

  openPage(page: PageInterface) {
    // debugger;    
    let params = {};

    // the nav component was found using @ViewChild(Nav)
    // setRoot on the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    if (page.index) {
      params = { tabIndex: page.index };
    }

    // If we are already on tabs just change the selected tab
    // don't setRoot again, this maintains the history stack of the
    // tabs even if changing them from the menu
    if (this.nav.getActiveChildNav() && page.index != undefined) {
      this.nav.getActiveChildNav().select(page.index);
      // Set the root of the nav with params if it's a tab index
    } else {
      this.nav.setRoot(page.name, params).catch((err: any) => {
        console.log(`Didn't set nav root: ${err}`);
      });
    }

    if (page.logsOut === true) {
      // Give the menu time to close before changing to logged out
      this.userData.logout(); this.blnLogin = false;
    }
  }

  listenToLoginEvents() {
    //debugger;    
    this.events.subscribe('user:login', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:signup', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:logout', () => {
      this.enableMenu(false);
    });
  }

  enableMenu(loggedIn: boolean) {
    // debugger;
    //Get all the roles and menus for that particular user.-------------------------------------------------------   
    // let url: string; this.Menu_Array = []; let Role_Name: string = "";
    // url = this.baseResource_Url + "view_user_role_menu?filter=USER_GUID=" + localStorage.getItem("g_USER_GUID") + '&api_key=' + constants.DREAMFACTORY_API_KEY;
    // this.http
    //   .get(url)
    //   .map(res => res.json())
    //   .subscribe(data => {
    //     let res = data["resource"];
    //     if (res.length > 0) {
    //       for (var item in data["resource"]) {
    //         if (data["resource"][item]["NAME"].toUpperCase() == "HOME") {
    //           this.Menu_Array.push({ title: data["resource"][item]["NAME"], name: 'TabsPage', component: TabsPage, tabComponent: SpeakerListPage, index: 0, icon: 'apps' });
    //         }
    //         else if (data["resource"][item]["NAME"].toUpperCase() == "APPROVER TASK") {
    //           this.Menu_Array.push({ title: data["resource"][item]["NAME"], name: 'ApproverTaskListPage', component: TabsPage, tabComponent: ApproverTaskListPage, index: 3, icon: 'checkbox-outline' });
    //         }
    //         else if (data["resource"][item]["NAME"].toUpperCase() == "CHANGE PASSWORD") {
    //           this.Menu_Array.push({ title: data["resource"][item]["NAME"], name: 'ChangePasswordPage', component: ChangePasswordPage, icon: 'unlock' });
    //         }
    //         else {
    //           this.Menu_Array.push({ title: data["resource"][item]["NAME"], name: 'ChangePasswordPage', component: ChangePasswordPage, icon: 'unlock' });
    //         }            
    //       }
    //     }
    //   });
    // ---------------------------------------------------------------------------------------------------------------------------------   

    // this.menu.enable(loggedIn, 'loggedInMenu');
    // this.menu.enable(!loggedIn, 'loggedOutMenu');

    if (localStorage.length > 0) {
      this.blnLogin = true;
      let val = this.GetUser_Role(localStorage.getItem("g_USER_GUID"));
      val.then((res) => {
        if (localStorage.getItem("g_USER_GUID") == "sva") {
          this.menu.enable(loggedIn, 'loggedInMenu');
          this.menu.enable(!loggedIn, 'loggedOutMenu');
        }
        //For Tenant Admin, Remove Admin Setup
        else if (localStorage.getItem("g_IS_TENANT_AMDIN") == "1") {
          this.appPages_User = [
            // { title: 'DASHBOARD', name: 'TabsPage', component: TabsPage, tabComponent: DashboardPage, index: 0, icon: 'apps' },
            { title: 'DASHBOARD', name: 'DashboardPage', component: DashboardPage, icon: 'apps' },
            { title: 'SETUP', name: 'SetupPage', component: SetupPage, icon: 'settings' },
            // { title: 'MY CLAIM LIST', name: 'TabsPage', component: TabsPage, tabComponent: UserclaimslistPage, index: 1, icon: 'ios-clipboard-outline' },
            { title: 'MY CLAIM LIST', name: 'UserclaimslistPage', component: UserclaimslistPage, icon: 'ios-clipboard-outline' },
            // { title: 'APPROVER TASK LIST', name: 'TabsPage', component: TabsPage, tabComponent: ClaimapprovertasklistPage, index: 2, icon: 'checkbox-outline' },
            { title: 'APPROVER TASK LIST', name: 'ClaimapprovertasklistPage', component: ClaimapprovertasklistPage, icon: 'checkbox-outline' },
            { title: 'FINANCE TASK LIST', name: 'ClaimtasklistPage', component: ClaimtasklistPage, icon: 'md-clipboard' },
            { title: 'CLAIM HISTORY', name: 'ClaimhistoryPage', component: ClaimhistoryPage, icon: 'ios-list-box-outline' },
          ];
          this.claimPages = [
            { title: 'TRAVEL CLAIM', name: 'TravelclaimPage', component: TravelclaimPage, icon: 'car' },
            { title: 'ENTERTAINMENT CLAIM', name: 'EntertainmentclaimPage', component: EntertainmentclaimPage, icon: 'cafe' },
            { title: 'GIFT CLAIM', name: 'GiftclaimPage', component: GiftclaimPage, icon: 'basket' },
            { title: 'OVERTIME CLAIM', name: 'OvertimeclaimPage', component: OvertimeclaimPage, icon: 'stopwatch' },
            { title: 'PRINTING CLAIM', name: 'PrintclaimPage', component: PrintclaimPage, icon: 'print' },
            { title: 'MISCLLANEOUS CLAIM', name: 'MiscellaneousClaimPage', component: MiscellaneousClaimPage, icon: 'albums' },
          ];

          this.menu.enable(loggedIn, 'loggedInMenu_User');
          this.menu.enable(!loggedIn, 'loggedOutMenu');
        }
        //For Team Member, Home, Change Password, Sign Out
        else if (res.toString() == "Team Member") {
          this.appPages_User = [
            // { title: 'DASHBOARD', name: 'TabsPage', component: TabsPage, tabComponent: DashboardPage, index: 0, icon: 'apps' },
            // { title: 'MY CLAIM LIST', name: 'TabsPage', component: TabsPage, tabComponent: UserclaimslistPage, index: 1, icon: 'ios-clipboard-outline' },
            // { title: 'APPROVER TASK LIST', name: 'TabsPage', component: TabsPage, tabComponent: ClaimapprovertasklistPage, index: 2, icon: 'checkbox-outline' },
            
            { title: 'DASHBOARD', name: 'DashboardPage', component: DashboardPage, icon: 'apps' },
            { title: 'MY CLAIM LIST', name: 'UserclaimslistPage', component: UserclaimslistPage, icon: 'ios-clipboard-outline' },
            { title: 'APPROVER TASK LIST', name: 'ClaimapprovertasklistPage', component: ClaimapprovertasklistPage, icon: 'checkbox-outline' },
            { title: 'CLAIM HISTORY', name: 'ClaimhistoryPage', component: ClaimhistoryPage, icon: 'ios-list-box-outline' },
          ];
          this.claimPages = [
            { title: 'TRAVEL CLAIM', name: 'TravelclaimPage', component: TravelclaimPage, icon: 'car' },
            { title: 'ENTERTAINMENT CLAIM', name: 'EntertainmentclaimPage', component: EntertainmentclaimPage, icon: 'cafe' },
            { title: 'GIFT CLAIM', name: 'GiftclaimPage', component: GiftclaimPage, icon: 'basket' },
            { title: 'OVERTIME CLAIM', name: 'OvertimeclaimPage', component: OvertimeclaimPage, icon: 'stopwatch' },
            { title: 'PRINTING CLAIM', name: 'PrintclaimPage', component: PrintclaimPage, icon: 'print' },
            { title: 'MISCLLANEOUS CLAIM', name: 'MiscellaneousClaimPage', component: MiscellaneousClaimPage, icon: 'albums' },
          ];

          this.menu.enable(loggedIn, 'loggedInMenu_User');
          this.menu.enable(!loggedIn, 'loggedOutMenu');
        }

        //For Team Member, Home, Change Password, Sign Out
        else if (res.toString() == "Finance Executive" || res.toString() == "Finance Admin" || res.toString() == "Finance Manager") {
          this.appPages_User = [
            // { title: 'DASHBOARD', name: 'TabsPage', component: TabsPage, tabComponent: DashboardPage, index: 0, icon: 'apps' },
            // { title: 'MY CLAIM LIST', name: 'TabsPage', component: TabsPage, tabComponent: UserclaimslistPage, index: 1, icon: 'ios-clipboard-outline' },
            // { title: 'APPROVER TASK LIST', name: 'TabsPage', component: TabsPage, tabComponent: ClaimapprovertasklistPage, index: 2, icon: 'checkbox-outline' },
            
            { title: 'DASHBOARD', name: 'DashboardPage', component: DashboardPage, icon: 'apps' },
            { title: 'MY CLAIM LIST', name: 'UserclaimslistPage', component: UserclaimslistPage, icon: 'ios-clipboard-outline' },
            { title: 'APPROVER TASK LIST', name: 'ClaimapprovertasklistPage', component: ClaimapprovertasklistPage, icon: 'checkbox-outline' },
            { title: 'FINANCE TASK LIST', name: 'ClaimtasklistPage', component: ClaimtasklistPage, icon: 'md-clipboard' },
            { title: 'CLAIM HISTORY', name: 'ClaimhistoryPage', component: ClaimhistoryPage, icon: 'ios-list-box-outline' },
            { title: 'CLAIM REPORT', name: 'ClaimReportPage', component: ClaimReportPage, icon: 'ios-list-box-outline' },
          ];
          this.claimPages = [
            { title: 'TRAVEL CLAIM', name: 'TravelclaimPage', component: TravelclaimPage, icon: 'car' },
            { title: 'ENTERTAINMENT CLAIM', name: 'EntertainmentclaimPage', component: EntertainmentclaimPage, icon: 'cafe' },
            { title: 'GIFT CLAIM', name: 'GiftclaimPage', component: GiftclaimPage, icon: 'basket' },
            { title: 'OVERTIME CLAIM', name: 'OvertimeclaimPage', component: OvertimeclaimPage, icon: 'stopwatch' },
            { title: 'PRINTING CLAIM', name: 'PrintclaimPage', component: PrintclaimPage, icon: 'print' },
            { title: 'MISCLLANEOUS CLAIM', name: 'MiscellaneousClaimPage', component: MiscellaneousClaimPage, icon: 'albums' },
          ];

          // this.Menu_Array = [];
          // this.Menu_Array.push({ title: 'HOME', root: SpeakerListPage, icon: "apps", index: 0 });
          // this.Menu_Array.push({ title: 'MY CLAIM LIST', root: UserclaimslistPage, icon: "ios-clipboard-outline", index: 1 });          
          // this.Menu_Array.push({ title: 'APPROVER TASK LIST', root: ClaimapprovertasklistPage, icon: "checkbox-outline", index: 2 });          
          // this.Menu_Array.push({ title: 'FINANCE TASK LIST', root: ClaimtasklistPage, icon: "md-clipboard", index: 3 });          
          // this.nav.push(TabsPage, this.Menu_Array);

          this.menu.enable(loggedIn, 'loggedInMenu_User');
          this.menu.enable(!loggedIn, 'loggedOutMenu');
        }
        //For Team Lead and others
        else {
          this.appPages_User = [
            // { title: 'DASHBOARD', name: 'TabsPage', component: TabsPage, tabComponent: DashboardPage, index: 0, icon: 'apps' },
            // { title: 'MY CLAIM LIST', name: 'TabsPage', component: TabsPage, tabComponent: UserclaimslistPage, index: 1, icon: 'ios-clipboard-outline' },
            // { title: 'APPROVER TASK LIST', name: 'TabsPage', component: TabsPage, tabComponent: ClaimapprovertasklistPage, index: 2, icon: 'checkbox-outline' },
            
            { title: 'DASHBOARD', name: 'DashboardPage', component: DashboardPage, icon: 'apps' },
            { title: 'MY CLAIM LIST', name: 'UserclaimslistPage', component: UserclaimslistPage, icon: 'ios-clipboard-outline' },
            { title: 'APPROVER TASK LIST', name: 'ClaimapprovertasklistPage', component: ClaimapprovertasklistPage, icon: 'checkbox-outline' },
            { title: 'CLAIM HISTORY', name: 'ClaimhistoryPage', component: ClaimhistoryPage, icon: 'ios-list-box-outline' },
          ];
          this.claimPages = [
            { title: 'TRAVEL CLAIM', name: 'TravelclaimPage', component: TravelclaimPage, icon: 'car' },
            { title: 'ENTERTAINMENT CLAIM', name: 'EntertainmentclaimPage', component: EntertainmentclaimPage, icon: 'cafe' },
            { title: 'GIFT CLAIM', name: 'GiftclaimPage', component: GiftclaimPage, icon: 'basket' },
            { title: 'OVERTIME CLAIM', name: 'OvertimeclaimPage', component: OvertimeclaimPage, icon: 'stopwatch' },
            { title: 'PRINTING CLAIM', name: 'PrintclaimPage', component: PrintclaimPage, icon: 'print' },
            { title: 'MISCLLANEOUS CLAIM', name: 'MiscellaneousClaimPage', component: MiscellaneousClaimPage, icon: 'albums' },
          ];

          // this.Menu_Array = [];
          // this.Menu_Array.push({ title: 'HOME', root: SpeakerListPage, icon: "apps", index: 0 });
          // this.Menu_Array.push({ title: 'MY CLAIM LIST', root: UserclaimslistPage, icon: "ios-clipboard-outline", index: 1 });          
          // this.Menu_Array.push({ title: 'APPROVER TASK LIST', root: ClaimapprovertasklistPage, icon: "checkbox-outline", index: 2 }); 
          // this.nav.push(TabsPage, this.Menu_Array);

          this.menu.enable(loggedIn, 'loggedInMenu_User');
          this.menu.enable(!loggedIn, 'loggedOutMenu');
        }
      });
      val.catch((err) => {
        // This is never called
        console.log(err);
      });
    }
    else {
      this.blnLogin = false;
      // alert(this.blnLogin);
      // alert(localStorage.length);
      // if (this.blnLogin == true) {
      // this.menu.enable(loggedIn, 'loggedInMenu');
      // this.menu.enable(!loggedIn, 'loggedOutMenu');        
      // }      
    }





    //For Super admin, All menu should display
    // if (localStorage.length > 0) {
    //   if (localStorage.getItem("g_USER_GUID") == "sva") {
    //     this.menu.enable(loggedIn, 'loggedInMenu');
    //     this.menu.enable(!loggedIn, 'loggedOutMenu');
    //   }
    //   //For user, distinct menu should display
    //   else if (localStorage.getItem("g_IS_TENANT_AMDIN") != "1") {
    //     // this.appPages_User = [
    //     //   { title: 'HOME', name: 'TabsPage', component: TabsPage, tabComponent: SpeakerListPage, index: 0, icon: 'apps' },
    //     //   { title: 'APPROVER TASK', name: 'ApproverTaskListPage', component: TabsPage, tabComponent: ApproverTaskListPage, index: 3, icon: 'checkbox-outline' },
    //     // ];
    //     this.appPages_User = this.Menu_Array;

    //     this.menu.enable(loggedIn, 'loggedInMenu_User');
    //     this.menu.enable(!loggedIn, 'loggedOutMenu');
    //   }
    //   else {
    //     this.menu.enable(loggedIn, 'loggedInMenu');
    //     this.menu.enable(!loggedIn, 'loggedOutMenu');
    //   }
    // }
    // else {
    //   this.menu.enable(loggedIn, 'loggedInMenu');
    //   this.menu.enable(!loggedIn, 'loggedOutMenu');
    // }
  }

  isActive(page: PageInterface) {
    // debugger;    
    let childNav = this.nav.getActiveChildNav();

    // Tabs are a special case because they have their own navigation
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }

    if (this.nav.getActive() && this.nav.getActive().name === page.name) {
      return 'primary';
    }
    return;
  }

  public translateToMalayClicked: boolean = false;
  public translateToEnglishClicked: boolean = true;

  public translateToEnglish() {
    this.translate.use('en');
    this.translateToMalayClicked = !this.translateToMalayClicked;
    this.translateToEnglishClicked = !this.translateToEnglishClicked;
  }

  public translateToMalay() {
    this.translate.use('ms');
    this.translateToEnglishClicked = !this.translateToEnglishClicked;
    this.translateToMalayClicked = !this.translateToMalayClicked;
  }

  GetUser_Role(user_guid: string) {
    // debugger;
    let TableURL = this.baseResource_Url + "view_user_role_menu?filter=USER_GUID=" + user_guid + '&api_key=' + constants.DREAMFACTORY_API_KEY;
    return new Promise((resolve, reject) => {
      this.http
        .get(TableURL)
        .map(res => res.json())
        .subscribe(data => {
          let roles = data["resource"];
          if (data["resource"].length > 0) {
            resolve(roles[0]["ROLE_NAME"]);
          }
          else {
            resolve("NA");
          }
        });
    });
  }
}