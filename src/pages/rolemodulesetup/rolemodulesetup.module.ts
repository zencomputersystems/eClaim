import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RolemodulesetupPage } from './rolemodulesetup';

@NgModule({
  declarations: [
    RolemodulesetupPage,
  ],
  imports: [
    IonicPageModule.forChild(RolemodulesetupPage),
  ],
  exports: [
    RolemodulesetupPage
  ]
})
export class RolemodulesetupPageModule {}
