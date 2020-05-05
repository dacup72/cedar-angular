import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GlobsRoutingModule } from './globs-routing.module';
import { GlobsComponent } from './globs.component';


@NgModule({
  declarations: [GlobsComponent],
  imports: [
    CommonModule,
    GlobsRoutingModule
  ],
  exports: [GlobsComponent]
})
export class GlobsModule { }
