import 'reflect-metadata';
import 'zone.js/dist/zone.js';

// Angular packages import
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

enableProdMode();

export function bootstrapA2() {
  platformBrowserDynamic().bootstrapModule(AppModule);
}
