import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubsciptionsetupPage } from './subsciptionsetup';

@NgModule({
  declarations: [
    SubsciptionsetupPage,
  ],
  imports: [
    IonicPageModule.forChild(SubsciptionsetupPage),
  ],
  exports: [
    SubsciptionsetupPage
  ]
})
export class SubsciptionsetupPageModule {}
