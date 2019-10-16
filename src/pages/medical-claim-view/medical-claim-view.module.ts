import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MedicalClaimViewPage } from './medical-claim-view';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    MedicalClaimViewPage,
  ],
  imports: [
    IonicPageModule.forChild(MedicalClaimViewPage), TranslateModule.forChild()
  ],
})
export class MedicalClaimViewPageModule {}
