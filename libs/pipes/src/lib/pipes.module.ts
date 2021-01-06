import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPipe } from './filter/filter.pipe';
import { CylinderFilterPipe } from './cylinder-filter/cylinder-filter.pipe';
import { GasProfileFilterPipe } from './gas-profile-filter/gas-profile-filter.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [
    CylinderFilterPipe, 
    FilterPipe, 
    GasProfileFilterPipe
  ],
  exports: [
    CylinderFilterPipe, 
    FilterPipe,
    GasProfileFilterPipe
  ]
})
export class PipesModule {}
