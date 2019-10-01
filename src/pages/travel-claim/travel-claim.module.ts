import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TravelclaimPage } from './travel-claim.component';

@NgModule({
  declarations: [
    TravelclaimPage,
    TranslatePipe
  ],
  entryComponents: [ ],
  imports: [
    IonicPageModule.forChild(TravelclaimPage),
    TranslatePipe,
  ],
  exports: [
    TravelclaimPage
  ]
})
export class TravelclaimPageModule {}
