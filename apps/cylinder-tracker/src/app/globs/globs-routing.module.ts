import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GlobsComponent } from './globs.component';


const routes: Routes = [
  { path: '', component: GlobsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GlobsRoutingModule { }
