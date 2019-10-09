import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BanksetupPage } from './banksetup';

@NgModule({
  declarations: [
    BanksetupPage,
  ],
  imports: [
    IonicPageModule.forChild(BanksetupPage),
  ],
  exports: [
    BanksetupPage
  ]
})
export class BanksetupPageModule {}
