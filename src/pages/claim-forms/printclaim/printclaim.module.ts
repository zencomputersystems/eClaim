import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { PrintclaimPage } from './printclaim';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PrintclaimPage,
  ],
  imports: [
    IonicPageModule.forChild(PrintclaimPage), TranslateModule
  ],
  exports: [
    PrintclaimPage
  ]
})
export class PrintclaimPageModule {}
