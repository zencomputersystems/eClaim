import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { SetupPage } from './setup';

@NgModule({
  declarations: [
    SetupPage,
  ],
  imports: [
    IonicPageModule.forChild(SetupPage),
  ],
  exports: [
    SetupPage
  ],
  entryComponents: [
    SetupPage
  ]
})
export class SetupPageModule {}
