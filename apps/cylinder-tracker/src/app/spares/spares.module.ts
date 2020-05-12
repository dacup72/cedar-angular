import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SparesRoutingModule } from './spares-routing.module';
import { SparesComponent } from './spares.component';
import { MaterialModule } from '@cedar-all/material';
import { FormsModule } from '@angular/forms';
import { SparesListComponent } from './spares-list/spares-list.component';
import { SparesDetailsComponent } from './spares-details/spares-details.component';


@NgModule({
  declarations: [SparesComponent, SparesListComponent, SparesDetailsComponent],
  imports: [
    CommonModule,
    SparesRoutingModule,
    MaterialModule,
    FormsModule
  ],
  exports: [SparesComponent]
})
export class SparesModule { }
