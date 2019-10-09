import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EntertainmentClaimViewPage } from './entertainment-claim-view';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    EntertainmentClaimViewPage,
  ],
  imports: [
    IonicPageModule.forChild(EntertainmentClaimViewPage), TranslateModule.forChild()
  ],
})
export class EntertainmentClaimViewPageModule {}
