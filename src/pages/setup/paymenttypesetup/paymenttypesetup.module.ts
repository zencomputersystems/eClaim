import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymenttypesetupPage } from './paymenttypesetup';

@NgModule({
  declarations: [
    PaymenttypesetupPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymenttypesetupPage),
  ],
  exports: [
    PaymenttypesetupPage
  ]
})
export class PaymenttypesetupPageModule {}
