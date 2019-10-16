import { NgModule } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { RolemodulesetupPage } from './rolemodulesetup';

@NgModule({
  declarations: [
    RolemodulesetupPage, TranslatePipe
  ],
  imports: [
    IonicPageModule.forChild(RolemodulesetupPage),
    TranslatePipe
  ],
  exports: [
    RolemodulesetupPage
  ]
})
export class RolemodulesetupPageModule {}
