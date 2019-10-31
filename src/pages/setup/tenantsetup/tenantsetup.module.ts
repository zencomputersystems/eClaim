import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';

import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { TenantsetupPage } from './tenantsetup';

@NgModule({
  declarations: [
    TenantsetupPage,
    TranslateService
  ],
  imports: [
    IonicPageModule.forChild(TenantsetupPage), TranslatePipe, TranslateModule
  ],
  exports: [
    TenantsetupPage
  ]
})
export class TenantsetupPageModule {}
