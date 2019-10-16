import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

import { ComponentsModule } from '../../components/components.module';
import { DashboardPage } from './dashboard';
import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    DashboardPage,
    ComponentsModule, TranslateModule
  ],
  imports: [
    IonicPageModule.forChild(DashboardPage),
    ComponentsModule, TranslatePipe, TranslateModule
  ]
})
export class DashboardPageModule {}
