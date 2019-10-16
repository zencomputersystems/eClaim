import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DesignationsetupPage } from './designationsetup';

@NgModule({
  declarations: [
    DesignationsetupPage,
  ],
  imports: [
    IonicPageModule.forChild(DesignationsetupPage),
  ],
  exports: [
    DesignationsetupPage
  ]
})
export class DesignationsetupPageModule {}
