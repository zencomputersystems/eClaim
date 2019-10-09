import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { TenantsetupPage } from './tenantsetup';

@NgModule({
  declarations: [
    TenantsetupPage,
    TranslateService
  ],
  imports: [
    IonicPageModule.forChild(TenantsetupPage), TranslatePipe
  ],
  exports: [
    TenantsetupPage
  ]
})
export class TenantsetupPageModule {}
