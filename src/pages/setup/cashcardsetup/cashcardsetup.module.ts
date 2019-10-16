import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CashcardsetupPage } from './cashcardsetup';

@NgModule({
  declarations: [
    CashcardsetupPage,
  ],
  imports: [
    IonicPageModule.forChild(CashcardsetupPage),
  ],
  exports: [
    CashcardsetupPage
  ]
})
export class CashcardsetupPageModule {}
