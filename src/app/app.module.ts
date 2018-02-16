import { BrowserModule } from '@angular/platform-browser';
import { HttpModule,Http } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { TranslateModule,TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ConferenceApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { PopoverPage } from '../pages/about-popover/about-popover';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { BanksetupPage } from '../pages/banksetup/banksetup';
import { BranchsetupPage } from '../pages/branchsetup/branchsetup';
import { CashcardsetupPage } from '../pages/cashcardsetup/cashcardsetup';
import { ClaimtypePage } from '../pages/claimtype/claimtype';
import { CompanysetupPage } from '../pages/companysetup/companysetup';
import { DesignationsetupPage } from '../pages/designationsetup/designationsetup';
import { DepartmentsetupPage } from '../pages/departmentsetup/departmentsetup';
import { MileagesetupPage } from '../pages/mileagesetup/mileagesetup';
import { RolesetupPage } from '../pages/rolesetup/rolesetup';
import { PaymenttypesetupPage } from '../pages/paymenttypesetup/paymenttypesetup';
import { QualificationsetupPage } from '../pages/qualificationsetup/qualificationsetup';
import { SubsciptionsetupPage } from '../pages/subsciptionsetup/subsciptionsetup';
import { SchedulePage } from '../pages/schedule/schedule';
import { ScheduleFilterPage } from '../pages/schedule-filter/schedule-filter';
import { SessionDetailPage } from '../pages/session-detail/session-detail';
import { SignupPage } from '../pages/signup/signup';
import { SpeakerListPage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { TenantsetupPage } from '../pages/tenantsetup/tenantsetup';
import { SetupPage } from '../pages/setup/setup';
import { ConferenceData } from '../providers/conference-data';
import { UserData } from '../providers/user-data';
import { MedicalclaimPage } from '../pages/medicalclaim/medicalclaim';
import { PrintclaimPage } from '../pages/printclaim/printclaim';
import { GiftclaimPage } from '../pages/giftclaim/giftclaim';
import { OvertimeclaimPage } from '../pages/overtimeclaim/overtimeclaim';
import { EntertainmentclaimPage } from '../pages/entertainmentclaim/entertainmentclaim';
import { TravelclaimPage } from '../pages/travelclaim/travelclaim';
import { UserPage } from '../pages/user/user';
import { SocRegistrationPage } from '../pages/soc-registration/soc-registration';
import { AdminsetupPage } from '../pages/adminsetup/adminsetup';
import { PeermissionPage } from'../pages/peermission/peermission';
import { RolemodulesetupPage } from'../pages/rolemodulesetup/rolemodulesetup';
import { PagesetupPage } from'../pages/pagesetup/pagesetup';
import { SubmodulesetupPage } from'../pages/submodulesetup/submodulesetup';  
import { ModulesetupPage } from'../pages/modulesetup/modulesetup';
import { TranslatePage } from '../pages/translate/translate';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer,  FileTransferObject } from '@ionic-native/file-transfer';
import {  FileUploadOptions  } from '@ionic-native/file-transfer';

import { HttpClientModule, HttpClient } from '@angular/common/http';

import {AddTollPage} from '../pages/add-toll/add-toll';
import { Services } from '../pages/Services';


//import { TravelClaim_Service } from '../services/travelclaim_service';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http,'./assets/i18n/','.json');
}



import { ProfileSetupPage } from'../pages/Profile-Setup/Profile-Setup';

import {AddTollPage} from '../pages/add-toll/add-toll';
import { Services } from '../pages/Services';
//import { TravelClaim_Service } from '../services/travelclaim_service';
import { ClaimhistoryPage } from'../pages/claimhistory/claimhistory';




@NgModule({
  declarations: [
    ConferenceApp,
    AboutPage,
    AccountPage,
    LoginPage,
    PopoverPage,
    SchedulePage,
    MedicalclaimPage,
    PrintclaimPage,
    GiftclaimPage,
    OvertimeclaimPage,
    EntertainmentclaimPage,
    PeermissionPage,
    RolemodulesetupPage,
    PagesetupPage,
    TravelclaimPage,
    ScheduleFilterPage,
    SessionDetailPage,
    SignupPage,
    SpeakerListPage,
    SubmodulesetupPage,
    SetupPage,
    BanksetupPage,
    BranchsetupPage,
    CompanysetupPage,
    DepartmentsetupPage,
    ClaimtypePage,
    CashcardsetupPage,
    DesignationsetupPage,
    TranslatePage,
    MileagesetupPage,
    RolesetupPage,
    ModulesetupPage,
    PaymenttypesetupPage,
    QualificationsetupPage,
    SubsciptionsetupPage,
    TenantsetupPage,
    TabsPage,
    UserPage,
    SocRegistrationPage,
    AdminsetupPage,

   


    ProfileSetupPage,

    AddTollPage,
    ClaimhistoryPage


  ],


  imports: [
    BrowserModule,
    HttpModule, HttpClientModule,
    TranslateModule.forRoot
    ({
      loader:{
        provide:TranslateLoader,
        useFactory:(createTranslateLoader),
        deps:[HttpClient]
      }
    }),
    IonicModule.forRoot(ConferenceApp, {}, {
      links: [
        { component: TabsPage, name: 'TabsPage', segment: 'tabs' },
        { component: SchedulePage, name: 'Schedule', segment: 'schedule' },
        { component: SessionDetailPage, name: 'SessionDetail', segment: 'sessionDetail/:name' },
        { component: ScheduleFilterPage, name: 'ScheduleFilter', segment: 'scheduleFilter' },
        { component: SpeakerListPage, name: 'Home', segment: 'Home' },
        { component: SetupPage, name: 'Setup', segment: 'Setup' },
        { component: AboutPage, name: 'About', segment: 'about' },
        { component: LoginPage, name: 'LoginPage', segment: 'login' },
        { component: AccountPage, name: 'AccountPage', segment: 'account' },
        { component: SignupPage, name: 'SignupPage', segment: 'signup' }
      ]
    }),
    IonicStorageModule.forRoot()
  ],

  bootstrap: [IonicApp],
  entryComponents: [
    ConferenceApp,
    AboutPage,
    AccountPage,
    LoginPage,
    PopoverPage,
    SchedulePage,
    ScheduleFilterPage,
    SessionDetailPage,
    SignupPage,
    SetupPage,
    ModulesetupPage,
    MedicalclaimPage,
    TravelclaimPage,
     PrintclaimPage,
    GiftclaimPage,
    OvertimeclaimPage,
    EntertainmentclaimPage,
    BanksetupPage,
    BranchsetupPage,
    CompanysetupPage,
    ClaimtypePage,
    CashcardsetupPage,
    PeermissionPage,
    DesignationsetupPage,
    DepartmentsetupPage,
    MileagesetupPage,
    RolesetupPage,
    AdminsetupPage,
    PaymenttypesetupPage,
    PagesetupPage,
    SubmodulesetupPage,
    TranslatePage,
    QualificationsetupPage,
    SubsciptionsetupPage,
    TenantsetupPage,
    RolemodulesetupPage,
    SpeakerListPage,
    TabsPage,
    UserPage,
    SocRegistrationPage,


    ProfileSetupPage,

    AddTollPage,
    ClaimhistoryPage


  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ConferenceData, HttpClientModule,
    UserData,
    InAppBrowser,
    SplashScreen,StatusBar, Services,

    Camera,
    File,
    FilePath,
    FileTransfer,
    //FileUploadOptions,
    FileTransferObject
  ]
})
export class AppModule { }
