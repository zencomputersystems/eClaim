import { ClaimReportUserPage } from './claim-report-user';
import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ClaimReportUserPage,
  ],
  imports: [
    IonicPageModule.forChild(ClaimReportUserPage), TranslateModule
  ],
})
export class ClaimReportUserPageModule {}
