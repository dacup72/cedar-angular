import { NgModule } from '@angular/core';
import { MatButtonModule } from  '@angular/material/button';
import { MatCardModule } from  '@angular/material/card';
import { MatCheckboxModule } from  '@angular/material/checkbox';
import { MatFormFieldModule } from  '@angular/material/form-field';
import { MatGridListModule } from  '@angular/material/grid-list';
import { MatIconModule } from  '@angular/material/icon';
import { MatInputModule } from  '@angular/material/input';
import { MatListModule } from  '@angular/material/list';
import { MatMenuModule } from  '@angular/material/menu';
import { MatSelectModule } from  '@angular/material/select';
import { MatSidenavModule } from  '@angular/material/sidenav';
import { MatSliderModule } from  '@angular/material/slider';
import { MatSnackBarModule } from  '@angular/material/snack-bar';
import { MatTableModule } from  '@angular/material/table';
import { MatToolbarModule } from  '@angular/material/toolbar';
import { MatButtonToggleModule } from  '@angular/material/button-toggle';
import { MatRadioModule } from  '@angular/material/radio';
import { DragDropModule } from '@angular/cdk/drag-drop'

@NgModule({
  imports: [
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSnackBarModule,
    MatTableModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MatRadioModule,
    DragDropModule
  ],
  exports: [
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSnackBarModule,
    MatTableModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MatRadioModule,
    DragDropModule
  ]
})
export class MaterialModule {}
