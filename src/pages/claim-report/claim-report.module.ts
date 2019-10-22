import { ClaimReportPage } from './claim-report';
import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ClaimReportPage,
  ],
  imports: [
    IonicPageModule.forChild(ClaimReportPage), TranslateModule
  ],
})
export class ClaimReportPageModule {}
