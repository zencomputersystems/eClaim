import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MiscellaneousClaimViewPage } from './miscellaneous-claim-view';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    MiscellaneousClaimViewPage,
  ],
  imports: [
    IonicPageModule.forChild(MiscellaneousClaimViewPage), TranslateModule.forChild()
  ],
})
export class MiscellaneousClaimViewPageModule {}
