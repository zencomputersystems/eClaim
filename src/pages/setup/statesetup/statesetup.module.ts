import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StatesetupPage } from './statesetup';

@NgModule({
  declarations: [
    StatesetupPage,
  ],
  imports: [
    IonicPageModule.forChild(StatesetupPage),
  ],
})
export class StatesetupPageModule {}
