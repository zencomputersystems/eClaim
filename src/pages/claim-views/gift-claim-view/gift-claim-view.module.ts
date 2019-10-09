import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GiftClaimViewPage } from './gift-claim-view';

@NgModule({
  declarations: [
    GiftClaimViewPage,
  ],
  imports: [
    IonicPageModule.forChild(GiftClaimViewPage),
  ],
})
export class GiftClaimViewPageModule {}
