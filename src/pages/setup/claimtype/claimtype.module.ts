import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClaimtypePage } from './claimtype';

@NgModule({
  declarations: [
    ClaimtypePage,
  ],
  imports: [
    IonicPageModule.forChild(ClaimtypePage),
  ],
  exports: [
    ClaimtypePage
  ]
})
export class ClaimtypePageModule {}
