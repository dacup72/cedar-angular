import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InUseComponent } from './in-use.component';


const routes: Routes = [
  { path: '', component: InUseComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InUseRoutingModule { }
