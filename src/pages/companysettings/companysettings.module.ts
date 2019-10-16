import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompanysettingsPage } from './companysettings';

@NgModule({
  declarations: [
    CompanysettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(CompanysettingsPage),
  ],
})
export class CompanysettingsPageModule {}
