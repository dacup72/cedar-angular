import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NxModule } from '@nrwl/angular';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@cedar-all/material';
import { AppRoutingModule } from './app-routing.module';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokenInterceptor } from '@cedar-all/core-data';

import { AppComponent } from './app.component';
import { CoreDataModule } from '@cedar-all/core-data';
import { UiLoginModule } from '@cedar-all/ui-login';
import { UiToolbarModule } from '@cedar-all/ui-toolbar';


@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule, 
    BrowserAnimationsModule,
    NxModule.forRoot(),
    CoreDataModule,
    HttpClientModule, 
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    UiLoginModule,
    UiToolbarModule,
    MaterialModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
