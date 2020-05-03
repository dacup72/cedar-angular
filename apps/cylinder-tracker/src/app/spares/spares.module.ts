import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SparesRoutingModule } from './spares-routing.module';
import { SparesComponent } from './spares.component';
import { MaterialModule } from '@cedar-all/material';


@NgModule({
  declarations: [SparesComponent],
  imports: [
    CommonModule,
    SparesRoutingModule,
    MaterialModule
  ],
  exports: [SparesComponent]
})
export class SparesModule { }
