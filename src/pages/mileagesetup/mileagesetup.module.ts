import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MileagesetupPage } from './mileagesetup';

@NgModule({
  declarations: [
    MileagesetupPage,
  ],
  imports: [
    IonicPageModule.forChild(MileagesetupPage),
  ],
  exports: [
    MileagesetupPage
  ]
})
export class MileagesetupPageModule {}

