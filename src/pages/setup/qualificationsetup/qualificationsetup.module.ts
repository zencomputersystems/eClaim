import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QualificationsetupPage } from './qualificationsetup';

@NgModule({
  declarations: [
    QualificationsetupPage,
  ],
  imports: [
    IonicPageModule.forChild(QualificationsetupPage),
  ],
  exports: [
    QualificationsetupPage
  ]
})
export class QualificationsetupPageModule {}
