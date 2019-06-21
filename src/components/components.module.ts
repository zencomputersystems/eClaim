import { NgModule } from '@angular/core';
import { MenuComponent } from './menu/menu';
import { ImgCropperComponent } from './img-cropper/img-cropper';
@NgModule({
	declarations: [MenuComponent,
    ImgCropperComponent],
	imports: [],
	exports: [MenuComponent,
    ImgCropperComponent]
})
export class ComponentsModule {}
