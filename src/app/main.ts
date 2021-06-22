import { AppModule } from './app.module';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

enableProdMode();
console.log("eClaim Web - release date: 24 February 2020");
platformBrowserDynamic().bootstrapModule(AppModule);
