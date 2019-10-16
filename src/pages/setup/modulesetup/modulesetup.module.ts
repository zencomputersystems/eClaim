import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModulesetupPage } from './modulesetup';

@NgModule({
  declarations: [
    ModulesetupPage,
  ],
  imports: [
    IonicPageModule.forChild(ModulesetupPage),
  ],
  exports: [
    ModulesetupPage
  ]
})
export class ModulesetupPageModule {}
