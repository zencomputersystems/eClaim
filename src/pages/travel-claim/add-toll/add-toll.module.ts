import { NgModule } from '@angular/core';
//import { AddTollPage } from './add-toll.component';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components';


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
