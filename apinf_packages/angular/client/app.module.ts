import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from "@angular/router";

import { appRoutes } from "./app.routes";
import { MainComponent } from "./main.component";

import { ListShowComponent } from './list_show/list_show.component';

@NgModule({
  // Components, Pipes, Directive
  declarations: [
    MainComponent,
    ListShowComponent,
  ],
  // Entry Components
  entryComponents: [
    MainComponent
  ],
  // Providers
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '/'
    }
  ],
  // Modules
  imports: [
    BrowserModule,
    // Angular components have hash routing
    RouterModule.forRoot(appRoutes, { useHash: true })
  ],
  // Main Component
  bootstrap: [MainComponent]
})
export class AppModule {
}
