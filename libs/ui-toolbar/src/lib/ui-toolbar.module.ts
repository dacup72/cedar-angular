import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiToolbarComponent } from './ui-toolbar/ui-toolbar.component';
import { MaterialModule } from '@cedar-all/material';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  declarations: [UiToolbarComponent],
  exports: [UiToolbarComponent]
})
export class UiToolbarModule {}
