import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
    { path: 'spares', loadChildren: () => import('./spares/spares.module').then(m => m.SparesModule) },
    { path: 'inuse', loadChildren: () => import('./in-use/in-use.module').then(m => m.InUseModule) },
    { path: 'globs', loadChildren: () => import('./globs/globs.module').then(m => m.GlobsModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
