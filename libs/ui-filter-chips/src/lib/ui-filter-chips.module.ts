import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterChipsComponent } from './filter-chips/filter-chips.component';
import { MaterialModule } from '@cedar-all/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


@NgModule({
  imports: [
    CommonModule, 
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [FilterChipsComponent],
  exports: [FilterChipsComponent]
})
export class UiFilterChipsModule {}
