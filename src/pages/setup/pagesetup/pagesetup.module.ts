import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PagesetupPage } from './pagesetup';

@NgModule({
  declarations: [
    PagesetupPage,
  ],
  imports: [
    IonicPageModule.forChild(PagesetupPage),
  ],
  exports: [
    PagesetupPage
  ]
})
export class PagesetupPageModule {}
