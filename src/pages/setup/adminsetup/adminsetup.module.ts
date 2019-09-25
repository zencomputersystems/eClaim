import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminsetupPage } from './adminsetup';

@NgModule({
  declarations: [
    AdminsetupPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminsetupPage),
  ],
  exports: [
    AdminsetupPage
  ]
})
export class AdminsetupPageModule {}
