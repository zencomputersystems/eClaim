import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MedicalclaimPage } from './medicalclaim';

@NgModule({
  declarations: [
    MedicalclaimPage,
  ],
  imports: [
    IonicPageModule.forChild(MedicalclaimPage),
  ],
  exports: [
    MedicalclaimPage
  ]
})
export class MedicalclaimPageModule {}
