import { ComponentsModule } from '../../../components';
import { NgModule } from '@angular/core';
//import { AddTollPage } from './add-toll.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    //AddTollPage,    
  ],
  imports: [
     TranslateModule.forChild(), ComponentsModule
    //  IonicPageModule.forChild(AddTollPage),
  ],
})
export class AddTollPageModule {}
