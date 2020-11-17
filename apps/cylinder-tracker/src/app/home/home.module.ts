import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { AvailableCylindersComponent } from './available-cylinders/available-cylinders.component';
import { MaterialModule } from '@cedar-all/material';
import { FormsModule } from '@angular/forms';
import { AssignCylindersComponent } from './assign-cylinders/assign-cylinders.component';
import { UiFilterChipsModule } from '@cedar-all/ui-filter-chips';
import { DatePickerModule } from '@cedar-all/date-picker';
import { SelectAutocompleteModule } from '@cedar-all/select-autocomplete';
import { CylinderItemComponent } from './available-cylinders/cylinder-item/cylinder-item.component';

@NgModule({
  declarations: [HomeComponent, AvailableCylindersComponent, AssignCylindersComponent, CylinderItemComponent],
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
