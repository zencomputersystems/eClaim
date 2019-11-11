import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { UserPage } from './user';

@NgModule({
  declarations: [
    UserPage,
  ],
  imports: [
    IonicPageModule.forChild(UserPage), TranslateModule
  ],
  exports: [
    UserPage
  ]
})
export class UserPageModule {}
