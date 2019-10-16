import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrintclaimPage } from './printclaim';

@NgModule({
  declarations: [
    PrintclaimPage,
  ],
  imports: [
    IonicPageModule.forChild(PrintclaimPage),
  ],
  exports: [
    PrintclaimPage
  ]
})
export class PrintclaimPageModule {}
