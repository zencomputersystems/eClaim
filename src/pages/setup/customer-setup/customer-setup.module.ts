import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerSetupPage } from './customer-setup';

@NgModule({
  declarations: [
    CustomerSetupPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerSetupPage),
  ],
})
export class CustomerSetupPageModule {}
