import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompanysetupPage } from './companysetup';

@NgModule({
  declarations: [
    CompanysetupPage,
  ],
  imports: [
    IonicPageModule.forChild(CompanysetupPage),
  ],
  exports: [
    CompanysetupPage
  ]
})
export class CompanysetupPageModule {}
