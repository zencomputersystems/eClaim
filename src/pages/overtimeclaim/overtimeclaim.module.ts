import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OvertimeclaimPage } from './overtimeclaim';

@NgModule({
  declarations: [
    OvertimeclaimPage,
  ],
  imports: [
    IonicPageModule.forChild(OvertimeclaimPage),
  ],
  exports: [
    OvertimeclaimPage
  ]
})
export class OvertimeclaimPageModule {}
