import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeviceSetupPage } from './device-setup';

@NgModule({
  declarations: [
    DeviceSetupPage,
  ],
  imports: [
    IonicPageModule.forChild(DeviceSetupPage),
  ],
})
export class DeviceSetupPageModule {}
