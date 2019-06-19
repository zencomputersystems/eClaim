import { Component, ViewChild } from '@angular/core';
import { Events, MenuController, Nav, Platform } from 'ionic-angular';
// import { SplashScreen } from '@ionic-native/splash-screen';
// import { StatusBar } from '@ionic-native/status-bar';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { SetupPage } from '../pages/setup/setup';
import { UserData } from '../providers/user-data';
import { AdminsetupPage } from '../pages/adminsetup/adminsetup';


import { TranslateService } from '@ngx-translate/core';


import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { getURL } from '../providers/sanitizer/sanitizer';

// import { MenuService } from '../providers/menu.service'

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
export class eClaimApp {
  //  blnLogin: boolean = false;
  //  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
  public Menu: Array<any>[] = [];

  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  // List of pages that can be navigated to from the left menu
  // the left menu only works after login
  // the login page disables the left menu
  loggedOutPages: PageInterface[] = [
    { title: 'Login', name: 'LoginPage', component: LoginPage, icon: 'log-in' },
    { title: 'Sign Up', name: 'SignupPage', component: SignupPage, icon: 'person-add' },
    { title: 'Forgot Password', name: 'LoginPage', component: LoginPage, icon: 'key' }
  ];

  pageName: any = 'DashboardPage';
  USER_NAME_LABEL: any;
  IMAGE_URL: any;
  rootPage: any = 'LoginPage';

  constructor(
    public events: Events,
    public userData: UserData,
    public menu: MenuController,
    public platform: Platform,
    public storage: Storage,
    public translate: TranslateService,
    public http: Http
  ) {
    this.TranslateLanguage();
    this.listenToLoginEvents();
    this.menu.enable(true, "sideMenu");
    this.enableMenu(this.isLoggedIn());
  }

  openPage(page: any) {
    this.pageName = page["CODE_PAGE_NAME"];
    this.nav.setRoot(this.pageName);
    if (this.pageName === 'LoginPage') {
      // Give the menu time to close before changing to logged out
      //      this.blnLogin = !this.userData.logout();
      this.enableMenu(false);
      this.clearMenu();
      this.menu.enable(false, "sideMenu");
      this.nav.setRoot('LoginPage');
      console.log("Logged out. Page: ", page);
    }
  }

  listenToLoginEvents() {
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

  TranslateLanguage() {
    if (localStorage.getItem("cs_default_language") == 'ms') {
      this.translateToMalay();
      this.translate.setDefaultLang('ms');
    }
    else {
      this.translateToEnglish();
      this.translate.setDefaultLang('en');
    }
  }

  isLoggedIn() {
    return (localStorage.getItem("g_USER_GUID") !== null) ? true : false;
  }

  enableSVAMenu() {
    //    this.blnLogin = true; 
    this.USER_NAME_LABEL = localStorage.getItem("g_FULLNAME");
    this.IMAGE_URL = localStorage.getItem("g_IMAGE_URL");
    this.TranslateLanguage();
    // SVA override
    if (localStorage.getItem("g_USER_GUID") == "sva") {
      //      this.blnAccount_loggedInMenu_User = true;
      //      this.blnSetup_loggedInMenu_User = true;
      //      this.loggedInPages = [
      //        { title: 'Sign Out', name: 'LoginPage', component: LoginPage, icon: 'log-out', logsOut: true }
      //      ];
      /* 
            this.setupsPages = [
              { title: 'Setup', name: 'SetupPage', component: SetupPage, icon: 'settings' },
              { title: 'Admin Setup', name: 'AdminsetupPage', component: AdminsetupPage, icon: 'cog' }
            ];
       */
      this.menu.enable(this.isLoggedIn(), 'sideMenu');
      this.menu.enable(!this.isLoggedIn, 'sideMenu');
    }
  };

  clearMenu() {
    this.Menu = [];
  }

  enableMenu(loggedIn: boolean) {
    if (loggedIn) {
      this.USER_NAME_LABEL = localStorage.getItem("g_FULLNAME");
      this.IMAGE_URL = localStorage.getItem("g_IMAGE_URL");
      this.TranslateLanguage();
      this.enableSVAMenu();
      this.http
        .get(getURL("table", "view_user_multi_role_menu", [`USER_GUID=${localStorage.getItem("g_USER_GUID")}`]))
        .map(res => res.json())
        .subscribe(data => {
          let res = data["resource"];
          if (res.length > 0) {
            this.Menu = this.getMenu(res, this.menuHeaders(res));
          }
        });
      this.menu.enable(true, "sideMenu");
    }
    else {
      this.menu.enable(false, "sideMenu");
    }
  }

  menuHeaders(data: any) {
    let menuHeadersArray: Array<any> = [];
    data.forEach((element: any) => {
      if (!menuHeadersArray.includes(element["MENU_HEADER"])) {
        menuHeadersArray.push(element["MENU_HEADER"])
      }
    });
    return menuHeadersArray;
  };

  getMenu(data: any, menuHeadersArray: any) {
    let menuArray = Array(menuHeadersArray);
    for (var i = 0; i < menuHeadersArray.length; i++) {
      menuArray[menuHeadersArray[i]] = data.filter((item: any) => item["MENU_HEADER"] === menuHeadersArray[i]);
    }
    return menuArray;
  };

  isActive(page: PageInterface) {
    if ((this.nav.getActive()
      && this.nav.getActive().name === page.name
      && this.pageName == page.name)
    ) {
      return 'primary';
    }
    return null
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
    let result = new Promise((resolve) => {
      this.http
        .get(getURL("table", "view_user_role_menu", [`USER_GUID=${user_guid}`]))
        .map(res => res.json())
        .subscribe(data => {
          let roles = data["resource"];
          resolve((data["resource"].length > 0) ? roles[0]["ROLE_NAME"] : "NA");
        });
    });
    return result;
  }
}