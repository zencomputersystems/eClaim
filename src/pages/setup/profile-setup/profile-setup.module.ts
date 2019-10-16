import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileSetupPage } from './profile-setup';

@NgModule({
  declarations: [
    ProfileSetupPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileSetupPage),
  ],
})
export class ProfileSetupPageModule {}
