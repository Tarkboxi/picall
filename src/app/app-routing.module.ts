import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './modules/auth/components/auth/auth.component';
import { HomeComponent } from './modules/photos/components/home/home.component';
import { LoginComponent } from './modules/auth/components/login/login.component';
import { SignupComponent } from './modules/auth/components/signup/signup.component';
import { AuthGuard } from './guards/auth-guard/auth.guard';
import { LocknavGuard } from './guards//no-nav-guard/locknav.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'auth', component: AuthComponent, canActivate: [LocknavGuard],
          children: [
                      { path: '', redirectTo: 'login', pathMatch: 'full' },
                      { path: 'login', component: LoginComponent },
                      { path: 'signup', component: SignupComponent} ]
  },
  { path: '', component: HomeComponent, canActivate: [AuthGuard]},
  { path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
