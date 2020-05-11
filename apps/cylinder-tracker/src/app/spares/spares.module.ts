import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SparesRoutingModule } from './spares-routing.module';
import { SparesComponent } from './spares.component';
import { MaterialModule } from '@cedar-all/material';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [SparesComponent],
  imports: [
    CommonModule,
    SparesRoutingModule,
    MaterialModule,
    FormsModule
  ],
  exports: [SparesComponent]
})
export class SparesModule { }
