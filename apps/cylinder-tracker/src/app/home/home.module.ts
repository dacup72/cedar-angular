import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SparesListComponent } from './spares-list/spares-list.component';
import { MaterialModule } from '@cedar-all/material';
import { FormsModule } from '@angular/forms';
import { InUseComponent } from './in-use/in-use.component';
import { GlobsComponent } from './globs/globs.component';


@NgModule({
  declarations: [HomeComponent, SparesListComponent, InUseComponent, GlobsComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MaterialModule,
    FormsModule
  ],
  exports: [HomeComponent]
})
export class HomeModule { }
