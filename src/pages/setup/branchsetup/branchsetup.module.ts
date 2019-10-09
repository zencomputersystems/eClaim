import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BranchsetupPage } from './branchsetup';

@NgModule({
  declarations: [
    BranchsetupPage,
  ],
  imports: [
    IonicPageModule.forChild(BranchsetupPage),
  ],
  exports: [
    BranchsetupPage
  ]
})
export class BranchsetupPageModule {}
