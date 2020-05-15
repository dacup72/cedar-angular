import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InUseRoutingModule } from './in-use-routing.module';
import { InUseComponent } from './in-use.component';


@NgModule({
  declarations: [InUseComponent],
  imports: [
    CommonModule,
    InUseRoutingModule
  ],
  exports: [
    InUseComponent
  ]
})
export class InUseModule { }
