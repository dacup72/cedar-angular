import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '@cedar-all/ui-login';
import { AuthGuardService } from '@cedar-all/core-data';

const routes: Routes = [
    { path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule), canActivate: [AuthGuardService] },
    { path: 'cylinders', loadChildren: () => import('./spares/spares.module').then(m => m.SparesModule), canActivate: [AuthGuardService] },
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
