import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CountrysetupPage } from './countrysetup';

@NgModule({
  declarations: [
    CountrysetupPage,
  ],
  imports: [
    IonicPageModule.forChild(CountrysetupPage),
  ],
})
export class CountrysetupPageModule {}
