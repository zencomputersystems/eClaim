import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OvertimeClaimViewPage } from './overtime-claim-view';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    OvertimeClaimViewPage,
  ],
  imports: [
    IonicPageModule.forChild(OvertimeClaimViewPage), TranslateModule.forChild()
  ],
})
export class OvertimeClaimViewPageModule {}
