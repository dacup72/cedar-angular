import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectAutocompleteComponent } from './select-autocomplete/select-autocomplete.component';
import { MaterialModule } from '@cedar-all/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule, 
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [SelectAutocompleteComponent],
  exports: [SelectAutocompleteComponent]
})
export class SelectAutocompleteModule {}
