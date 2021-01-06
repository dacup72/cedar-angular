import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@cedar-all/material';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { AvailableCylindersComponent } from './available-cylinders/available-cylinders.component';
import { AssignCylindersComponent } from './assign-cylinders/assign-cylinders.component';
import { CylinderItemComponent } from './available-cylinders/cylinder-item/cylinder-item.component';
import { GasProfileItemComponent } from './assign-cylinders/gas-profile-item/gas-profile-item.component';
import { CylinderDropDialogComponent } from './cylinder-drop-dialog/cylinder-drop-dialog.component';
import { GasProfileUnassignDialogComponent } from './gas-profile-unassign-dialog/gas-profile-unassign-dialog.component';
import { CylinderUnassignDialogComponent } from './cylinder-unassign-dialog/cylinder-unassign-dialog.component';
import { CylinderRetireDialogComponent } from './cylinder-retire-dialog/cylinder-retire-dialog.component';
import { HomeCardComponent } from './home-card/home-card.component';

import { UiFilterChipsModule } from '@cedar-all/ui-filter-chips';
import { SelectAutocompleteModule } from '@cedar-all/select-autocomplete';
import { PipesModule } from '@cedar-all/pipes';
import { HomeTabGroupComponent } from './home-tab-group/home-tab-group.component';

@NgModule({
  declarations: [
    HomeComponent, 
    AvailableCylindersComponent, 
    AssignCylindersComponent, 
    CylinderItemComponent, 
    GasProfileItemComponent, 
    CylinderDropDialogComponent, 
    GasProfileUnassignDialogComponent, 
    CylinderUnassignDialogComponent, 
    CylinderRetireDialogComponent, 
    HomeCardComponent, HomeTabGroupComponent  
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MaterialModule,
    FormsModule,
    UiFilterChipsModule,
    SelectAutocompleteModule,
    PipesModule
  ],
  exports: [HomeComponent]
})
export class HomeModule { }
