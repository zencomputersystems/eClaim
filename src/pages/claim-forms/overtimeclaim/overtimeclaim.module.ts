import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { OvertimeclaimPage } from './overtimeclaim';

@NgModule({
  declarations: [
    OvertimeclaimPage, TranslatePipe, TranslateModule
  ],
  imports: [
    IonicPageModule.forChild(OvertimeclaimPage), TranslatePipe
  ],
  exports: [
    OvertimeclaimPage
  ]
})
export class OvertimeclaimPageModule {}
