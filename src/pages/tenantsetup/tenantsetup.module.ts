import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TenantsetupPage } from './tenantsetup';

@NgModule({
  declarations: [
    TenantsetupPage,
  ],
  imports: [
    IonicPageModule.forChild(TenantsetupPage),
  ],
  exports: [
    TenantsetupPage
  ]
})
export class TenantsetupPageModule {}
