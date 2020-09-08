import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { CylindersService } from './cylinders/cylinders.service';
import { StateModule } from './state/state.module';
import { UserService } from './auth/user.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StateModule
  ],
  providers: [
    CylindersService,
    UserService
  ]
})
export class CoreDataModule {}
