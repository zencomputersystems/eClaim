import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DepartmentsetupPage } from './departmentsetup';

@NgModule({
  declarations: [
    DepartmentsetupPage,
  ],
  imports: [
    IonicPageModule.forChild(DepartmentsetupPage),
  ],
  exports: [
    DepartmentsetupPage
  ]
})
export class DepartmentsetupPageModule {}
