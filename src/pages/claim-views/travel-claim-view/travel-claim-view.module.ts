import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TravelClaimViewPage } from './travel-claim-view.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    TravelClaimViewPage,
  ],
  imports: [
    IonicPageModule.forChild(TravelClaimViewPage), TranslateModule.forChild()
  ],
})
export class TravelClaimViewPageModule {}
