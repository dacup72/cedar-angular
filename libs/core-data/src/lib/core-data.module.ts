import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { CylindersService } from './cylinders/cylinders.service';
import { StateModule } from './state/state.module';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StateModule
  ],
  providers: [
    CylindersService
  ]
})
export class CoreDataModule {}
