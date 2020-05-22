import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NxModule } from '@nrwl/angular';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@cedar-all/material';
import { AppRoutingModule } from './app-routing.module';
import { UiToolbarModule } from '@cedar-all/ui-toolbar';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CoreDataModule } from '@cedar-all/core-data';

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
    UiToolbarModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
