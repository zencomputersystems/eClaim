import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TravelclaimPage } from './travel-claim.component';

@NgModule({
  declarations: [
    TravelclaimPage,
  ],
  imports: [
    IonicPageModule.forChild(TravelclaimPage),
  ],
  exports: [
    TravelclaimPage
  ]
})
export class TravelclaimPageModule {}
