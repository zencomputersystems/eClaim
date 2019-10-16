import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RolesetupPage } from './rolesetup';

@NgModule({
  declarations: [
    RolesetupPage,
  ],
  imports: [
    IonicPageModule.forChild(RolesetupPage),
  ],
  exports: [
    RolesetupPage
  ]
})
export class RolesetupPageModule {}
