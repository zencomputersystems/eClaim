import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrintClaimViewPage } from './print-claim-view';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PrintClaimViewPage,
  ],
  imports: [
    IonicPageModule.forChild(PrintClaimViewPage),  TranslateModule.forChild()
  ],
})
export class PrintClaimViewPageModule {}
