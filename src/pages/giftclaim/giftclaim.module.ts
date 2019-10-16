import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GiftclaimPage } from './giftclaim';

@NgModule({
  declarations: [
    GiftclaimPage,
  ],
  imports: [
    IonicPageModule.forChild(GiftclaimPage),
  ],
  exports: [
    GiftclaimPage
  ]
})
export class GiftclaimPageModule {}
