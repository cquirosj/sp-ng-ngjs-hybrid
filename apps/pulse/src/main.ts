import { enableProdMode, ViewEncapsulation } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as angular from 'angular';
import { AppModule } from './app/app.module';
import { setAngularJSGlobal } from '@angular/upgrade/static';
import './main-ngjs'
import { environment } from './environments/environment';

setAngularJSGlobal(angular);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    defaultEncapsulation: ViewEncapsulation.None,
  })
  .catch((err) => console.error(err));
