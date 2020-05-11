import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CylindersService } from './cylinder-tracker/cylinders.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    CylindersService
  ]
})
export class CoreDataModule {}
