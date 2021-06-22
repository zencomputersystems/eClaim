import { AppModule } from './app.module';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

enableProdMode();
console.log("eClaim Web - release date: 22 June 2021");
platformBrowserDynamic().bootstrapModule(AppModule);
