import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubmodulesetupPage } from './submodulesetup';

@NgModule({
  declarations: [
    SubmodulesetupPage,
  ],
  imports: [
    IonicPageModule.forChild(SubmodulesetupPage),
  ],
  exports: [
    SubmodulesetupPage
  ]
})
export class SubmodulesetupPageModule {}
