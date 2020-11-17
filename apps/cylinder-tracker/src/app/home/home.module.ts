import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SparesListComponent } from './spares-list/spares-list.component';
import { MaterialModule } from '@cedar-all/material';
import { FormsModule } from '@angular/forms';
import { InUseComponent } from './in-use/in-use.component';
import { GlobsComponent } from './globs/globs.component';
import { UiFilterChipsModule } from '@cedar-all/ui-filter-chips';
import { DatePickerModule } from '@cedar-all/date-picker';
import { SelectAutocompleteModule } from '@cedar-all/select-autocomplete';
import { CylinderItemComponent } from './spares-list/cylinder-item/cylinder-item.component';

@NgModule({
  declarations: [HomeComponent, SparesListComponent, InUseComponent, GlobsComponent, CylinderItemComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MaterialModule,
    FormsModule,
    UiFilterChipsModule,
    DatePickerModule,
    SelectAutocompleteModule
  ],
  exports: [HomeComponent]
})
export class HomeModule { }
