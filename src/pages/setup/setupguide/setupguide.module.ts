import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { SetupguidePage } from './setupguide';

@NgModule({
  declarations: [
    SetupguidePage,
  ],
  imports: [
    IonicPageModule.forChild(SetupguidePage),
  ],
  entryComponents: [
    SetupguidePage
  ]
})
export class SetupguidePageModule {}
