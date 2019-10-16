import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EntertainmentclaimPage } from './entertainmentclaim';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    EntertainmentclaimPage,
  ],
  imports: [
    IonicPageModule.forChild(EntertainmentclaimPage), TranslateModule.forChild()
  ],
  exports: [
    EntertainmentclaimPage
  ]
})
export class EntertainmentclaimPageModule {}
