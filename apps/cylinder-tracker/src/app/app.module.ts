import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NxModule } from '@nrwl/angular';
import { MaterialModule } from '@cedar-all/material';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { HomeModule } from './home/home.module';
import { GlobsModule } from './globs/globs.module';
import { InUseModule } from './in-use/in-use.module';
import { SparesModule } from './spares/spares.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    NxModule.forRoot(),
    HttpClientModule, 
    BrowserAnimationsModule,
    RouterModule.forRoot([], { initialNavigation: 'enabled' }),
    MaterialModule,
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot(),
    StoreModule.forRoot({}, {}),
    HomeModule,
    GlobsModule,
    InUseModule,
    SparesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
