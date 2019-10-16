import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MiscellaneousClaimPage } from './miscellaneous-claim';
//import { ComponentsModule } from '../../components';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    MiscellaneousClaimPage,
  ],
  imports: [
    IonicPageModule.forChild(MiscellaneousClaimPage),TranslateModule.forChild()
  ],
})
export class MiscellaneousClaimPageModule {}
