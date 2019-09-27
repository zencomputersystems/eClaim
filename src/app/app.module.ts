import { DatePipe, DecimalPipe } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

// import { PopoverPage } from '../pages/about-popover/about-popover';
import { AccountPage } from '../pages/account/account';
import { AddTollPage } from '../pages/travel-claim/add-toll/add-toll.component';
import { AdminsetupPage } from '../pages/setup/adminsetup/adminsetup';
import { AllClaimListPage } from '../pages/all-claim-list/all-claim-list';
import { AllClaimhistoryPage } from '../pages/allclaimhistory/claimhistory';
import { ApiManagerProvider } from '../providers/api-manager.provider';
import { ApprovalProfilePage } from '../pages/approval-profile/approval-profile';
import { ApproverTaskListPage } from '../pages/approver-task-list/approver-task-list';
import { AttendanceReportPage } from '../pages/attendance-report/attendance-report';
import { BanksetupPage } from '../pages/setup/banksetup/banksetup';
import { BranchsetupPage } from '../pages/setup/branchsetup/branchsetup';
import { BrowserModule } from '@angular/platform-browser';
import { Camera } from '@ionic-native/camera';
import { CashcardsetupPage } from '../pages/setup/cashcardsetup/cashcardsetup';
import { ChangePasswordPage } from '../pages/change-password/change-password';
// import { Chart } from 'chart.js';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { ClaimReportPage } from '../pages/claim-report/claim-report';
import { ClaimReportPrintPage } from '../pages/claim-report-print/claim-report-print';
import { ClaimReportUserPage } from '../pages/claim-report-user/claim-report-user';
import { ClaimSummaryPage } from '../pages/claim-summary/claim-summary';
import { ClaimapprovertasklistPage } from '../pages/claimapprovertasklist/claimapprovertasklist';
//import { TravelClaim_Service } from '../services/travelclaim_service';
import { ClaimhistoryPage } from '../pages/claimhistory/claimhistory';
import { ClaimhistorydetailPage } from '../pages/claimhistorydetail/claimhistorydetail';
import { ClaimtasklistPage } from '../pages/claimtasklist/claimtasklist';
import { ClaimtypePage } from '../pages/setup/claimtype/claimtype';
import { CommonHistorylistPage } from '../pages/common-historylist/common-historylist';
import { CommonTasklistPage } from '../pages/common-tasklist/common-tasklist';
import { CompanysettingsPage } from '../pages/setup/companysettings/companysettings';
import { CompanysetupPage } from '../pages/setup/companysetup/companysetup';
import { ConferenceData } from '../providers/conference-data';
import { CountrysetupPage } from '../pages/setup/countrysetup/countrysetup';
import { CurrencyProvider } from '../providers/currency/currency';
import { CustomerSetupPage } from '../pages/setup/customer-setup/customer-setup';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { DbmaintenancePage } from '../pages/setup/dbmaintenance/dbmaintenance';
import { DepartmentsetupPage } from '../pages/setup/departmentsetup/departmentsetup';
import { DesignationsetupPage } from '../pages/setup/designationsetup/designationsetup';
import { DeviceSetupPage } from '../pages/setup/device-setup/device-setup';
import { EntertainmentClaimViewPage } from '../pages/entertainment-claim-view/entertainment-claim-view';
import { EntertainmentclaimPage } from '../pages/entertainmentclaim/entertainmentclaim';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FinancePaymentTasklistPage } from '../pages/finance-payment-tasklist/finance-payment-tasklist';
import { GiftClaimViewPage } from '../pages/gift-claim-view/gift-claim-view';
import { GiftclaimPage } from '../pages/giftclaim/giftclaim';
import { HttpModule } from '@angular/http';
import { ImportExcelDataPage } from '../pages/import-excel-data/import-excel-data';
// import { InAppBrowser } from '@ionic-native/in-app-browser';
// import { SplashScreen } from '@ionic-native/splash-screen';
// import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { LeaveReportPage } from '../pages/leave-report/leave-report';
import { LoginPage } from '../pages/login/login';
import { MileagesetupPage } from '../pages/setup/mileagesetup/mileagesetup';
import { MiscellaneousClaimPage } from '../pages/miscellaneous-claim/miscellaneous-claim';
import { MiscellaneousClaimViewPage } from '../pages/miscellaneous-claim-view/miscellaneous-claim-view';
import { ModulesetupPage } from '../pages/setup/modulesetup/modulesetup';
import { MonthlyClaimReportPage } from '../pages/monthly-claim-report/monthly-claim-report';
// import { Ng2PaginationModule } from 'ng2-pagination';
import { NgxPaginationModule } from 'ngx-pagination';
import { OtRateSetupPage } from '../pages/setup/ot-rate-setup/ot-rate-setup';
import { OvertimeClaimViewPage } from '../pages/overtime-claim-view/overtime-claim-view';
import { OvertimeclaimPage } from '../pages/overtimeclaim/overtimeclaim';
import { PagesetupPage } from '../pages/setup/pagesetup/pagesetup';
import { PaymentHistoryPage } from '../pages/payment-history/payment-history';
import { PaymenttypesetupPage } from '../pages/setup/paymenttypesetup/paymenttypesetup';
import { PermissionPage } from '../pages/setup/permission/permission';
// import { MedicalClaimViewPage } from '../pages/medical-claim-view/medical-claim-view';
import { PrintClaimViewPage } from '../pages/print-claim-view/print-claim-view';
// import { MedicalclaimPage } from '../pages/medicalclaim/medicalclaim';
import { PrintclaimPage } from '../pages/printclaim/printclaim';
import { ProfileManagerProvider } from '../providers/profile-manager.provider';
import { ProfileSetupPage } from '../pages/setup/profile-setup/profile-setup.component';
import { QualificationsetupPage } from '../pages/setup/qualificationsetup/qualificationsetup';
import { RolemodulesetupPage } from '../pages/setup/rolemodulesetup/rolemodulesetup';
import { RolesetupPage } from '../pages/setup/rolesetup/rolesetup';
import { SanitizerProvider } from '../providers/sanitizer/sanitizer';
import { Services } from '../pages/Services';
import { SettingsPage } from '../pages/setup/settings/settings';
import { SetupPage } from '../pages/setup/setup';
import { SetupguidePage } from '../pages/setup/setupguide/setupguide';
import { SignupPage } from '../pages/signup/signup';
import { SocRegistrationPage } from '../pages/setup/soc-registration/soc-registration';
import { StatesetupPage } from '../pages/setup/statesetup/statesetup';
import { SubmodulesetupPage } from '../pages/setup/submodulesetup/submodulesetup';
import { SubsciptionsetupPage } from '../pages/setup/subsciptionsetup/subsciptionsetup';
import { TabsPage } from '../pages/tabs/tabs';
import { TenantsetupPage } from '../pages/setup/tenantsetup/tenantsetup';
import { ToastProvider } from '../providers/toast/toast';
import { Transfer } from '@ionic-native/transfer';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslatePage } from '../pages/translate/translate';
import { TravelClaimViewPage } from '../pages/travel-claim-view/travel-claim-view.component';
import { TravelclaimPage } from '../pages/travel-claim/travel-claim.component';
import { UploadPage } from '../pages/upload/upload';
import { UploaderProvider } from '../providers/uploader/uploader';
import { UserData } from '../providers/user-data';
import { UserPage } from '../pages/setup/user/user';
import { UserclaimslistPage } from '../pages/userclaimslist/userclaimslist';
import { eClaimApp } from './app.component';

// import {AddTollPage} from '../pages/add-toll/add-toll';
// import { Transfer } from "../providers/file-transfer";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
/* 1st level loading */
    eClaimApp,
    LoginPage,
    SignupPage,
/* 2nd level loading, only dashboard */
DashboardPage, 

/* 3nd level loading, after dashboard */
    TravelclaimPage,
    // MedicalclaimPage,
    AllClaimhistoryPage,
    PrintclaimPage,
    GiftclaimPage,
    OvertimeclaimPage,
    EntertainmentclaimPage,
    MiscellaneousClaimPage,
    AllClaimListPage,

    /* Should be loaded only when using setup */
       
    PermissionPage,
    RolemodulesetupPage,
    PagesetupPage,
    CountrysetupPage,
    TravelclaimPage,
    StatesetupPage,
    SetupguidePage,

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
    DeviceSetupPage,
    PaymenttypesetupPage,
    QualificationsetupPage,
    SubsciptionsetupPage,
    TenantsetupPage,
    AdminsetupPage,
    ProfileSetupPage,
    CustomerSetupPage,
    SocRegistrationPage,

    SettingsPage,
    CompanysettingsPage,
    DbmaintenancePage,
    OtRateSetupPage,
    ApprovalProfilePage,
    ImportExcelDataPage,
 /* */

     /* Should be loaded only when doing travel claims */
    AddTollPage,
    TravelClaimViewPage,

    AccountPage,
    TabsPage,
    UserPage,
    ApproverTaskListPage,
    EntertainmentClaimViewPage,
    // MedicalClaimViewPage,
    OvertimeClaimViewPage,
    PrintClaimViewPage,
    GiftClaimViewPage,
    MiscellaneousClaimViewPage,
    UploadPage,

    ClaimhistoryPage,
    ClaimhistorydetailPage,
    ClaimapprovertasklistPage,
    ClaimtasklistPage,
    UserclaimslistPage,
    ClaimReportPage,
    MonthlyClaimReportPage,
    ChangePasswordPage,
    ClaimReportUserPage,
    ClaimReportPrintPage,
    LeaveReportPage,
    AttendanceReportPage,


    FinancePaymentTasklistPage,
    CommonTasklistPage,
    PaymentHistoryPage,
    CommonHistorylistPage,

    ClaimSummaryPage
  ],

  imports: [
    BrowserModule,
    HttpModule, HttpClientModule, ChartsModule, NgxPaginationModule,
    TranslateModule.forRoot
      ({
        loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
        }
      }),
    IonicModule.forRoot(eClaimApp, {}, {
      links: [
        { component: TabsPage, name: 'TabsPage', segment: 'tabs' },
        // { component: DashboardPage, name: 'Home', segment: 'Home' },
        { component: ImportExcelDataPage, name: 'ImportExcelDataPage', segment: 'ImportExcelDataPage' },
        { component: DashboardPage, name: 'DashboardPage', segment: 'DashboardPage' },
        { component: SetupPage, name: 'SetupPage', segment: 'Setup' },
        { component: AdminsetupPage, name: 'AdminsetupPage', segment: 'AdminsetupPage' },
        { component: LoginPage, name: 'LoginPage', segment: 'login' },
        { component: AccountPage, name: 'AccountPage', segment: 'account' },
        { component: SignupPage, name: 'SignupPage', segment: 'signup' },
        { component: ChangePasswordPage, name: 'ChangePasswordPage', segment: 'changepassword' },
        { component: AllClaimListPage, name: 'AllClaimListPage', segment: 'AllClaimList' },

        { component: TravelclaimPage, name: 'TravelclaimPage', segment: 'TravelclaimPage' },
        { component: EntertainmentclaimPage, name: 'EntertainmentclaimPage', segment: 'EntertainmentclaimPage' },
        { component: GiftclaimPage, name: 'GiftclaimPage', segment: 'GiftclaimPage' },
        { component: OvertimeclaimPage, name: 'OvertimeclaimPage', segment: 'OvertimeclaimPage' },
        { component: PrintclaimPage, name: 'PrintclaimPage', segment: 'PrintclaimPage' },
        { component: MiscellaneousClaimPage, name: 'MiscellaneousClaimPage', segment: 'MiscellaneousClaimPage' },
        { component: CustomerSetupPage, name: 'CustomerSetupPage', segment: 'CustomerSetupPage' },
        { component: AllClaimhistoryPage, name: 'AllClaimhistoryPage', segment: 'AllClaimhistoryPage' },

        { component: ClaimtasklistPage, name: 'ClaimtasklistPage', segment: 'ClaimtasklistPage' },
        { component: ClaimapprovertasklistPage, name: 'ClaimapprovertasklistPage', segment: 'ClaimapprovertasklistPage' },
        { component: UserclaimslistPage, name: 'UserclaimslistPage', segment: 'UserclaimslistPage' },
        { component: ClaimhistoryPage, name: 'ClaimhistoryPage', segment: 'ClaimhistoryPage' },
        { component: ClaimhistorydetailPage, name: 'ClaimhistorydetailPage', segment: 'ClaimhistorydetailPage' },
        { component: ClaimReportPage, name: 'ClaimReportPage', segment: 'ClaimReportPage' },
        { component: MonthlyClaimReportPage, name: 'MonthlyClaimReportPage', segment: 'MonthlyClaimReportPage' },
        { component: ClaimReportUserPage, name: 'ClaimReportUserPage', segment: 'ClaimReportUserPage' },
        { component: LeaveReportPage, name: 'LeaveReportPage', segment: 'LeaveReportPage' },
        { component: AttendanceReportPage, name: 'AttendanceReportPage', segment: 'AttendanceReportPage' },
        { component: ClaimReportPrintPage, name: 'ClaimReportPrintPage', segment: 'ClaimReportPrintPage' },
        { component: FinancePaymentTasklistPage, name: 'FinancePaymentTasklistPage', segment: 'FinancePaymentTasklistPage' },
        { component: CommonTasklistPage, name: 'CommonTasklistPage', segment: 'CommonTasklistPage' },
        { component: PaymentHistoryPage, name: 'PaymentHistoryPage', segment: 'PaymentHistoryPage' },
        { component: CommonHistorylistPage, name: 'CommonHistorylistPage', segment: 'CommonHistorylistPage' },
        { component: ClaimSummaryPage, name: 'ClaimSummaryPage', segment: 'ClaimSummaryPage' }
      ]
    }),
    IonicStorageModule.forRoot()
  ],

  bootstrap: [IonicApp],
  entryComponents: [
    /* 1st level loading */
    eClaimApp,
    LoginPage,
    SignupPage,
    /* 2nd level loading, only dashboard */
    DashboardPage,

    /* 3rd level loading, after dashboard */



    // MedicalclaimPage,
    TravelclaimPage, 
    AllClaimhistoryPage,
    PrintclaimPage,
    GiftclaimPage,
    OvertimeclaimPage,
    EntertainmentclaimPage,
    MiscellaneousClaimPage,
    AllClaimListPage, 
    /* Should be loaded only when using setup */
  

    SetupguidePage,
    StatesetupPage,
    SetupPage,
    ModulesetupPage, 
    DeviceSetupPage,
    BanksetupPage,
    BranchsetupPage,
    CompanysetupPage,
    ClaimtypePage,
    CashcardsetupPage,
    PermissionPage,
    DesignationsetupPage,
    DepartmentsetupPage,
    MileagesetupPage,
    RolesetupPage,
    AdminsetupPage,
    PaymenttypesetupPage,
    PagesetupPage,
    CountrysetupPage,
    SubmodulesetupPage,
    TranslatePage,
    QualificationsetupPage,
    SubsciptionsetupPage,
    TenantsetupPage,
    RolemodulesetupPage,
    CustomerSetupPage,
    OtRateSetupPage,

    SettingsPage,
    CompanysettingsPage,
    DbmaintenancePage,
    ApprovalProfilePage,
    ImportExcelDataPage,

    /* */

    /* Should be loaded only when doing travel claims */
    TravelClaimViewPage,
    AddTollPage,

    TabsPage,
    ApproverTaskListPage,
    
    EntertainmentClaimViewPage,
    // MedicalClaimViewPage,
    OvertimeClaimViewPage,
    PrintClaimViewPage,
    GiftClaimViewPage,
    MiscellaneousClaimViewPage,
    UserPage,
    SocRegistrationPage,
    TravelclaimPage,
    ProfileSetupPage,
 
    ClaimhistoryPage,
    ClaimhistorydetailPage,
    ClaimapprovertasklistPage,
    ClaimtasklistPage,
    UserclaimslistPage,
    ClaimReportPage,
    MonthlyClaimReportPage,
    UploadPage,

    ChangePasswordPage,
    ClaimReportUserPage,
    ClaimReportPrintPage,
    LeaveReportPage,
    AttendanceReportPage,
    FinancePaymentTasklistPage,
    CommonTasklistPage,
    PaymentHistoryPage,
    CommonHistorylistPage,
    ClaimSummaryPage,

    AccountPage

  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ConferenceData, HttpClientModule, ApiManagerProvider,
    UserData, DatePipe, DecimalPipe,
    Services,

    Camera,
    ProfileManagerProvider,
    File,
    FilePath,
    FileTransfer,
    FileTransferObject,
    ApiManagerProvider, Transfer,
    SanitizerProvider,
    ToastProvider,
    CurrencyProvider,
    UploaderProvider,
  ]
})
export class AppModule { }
