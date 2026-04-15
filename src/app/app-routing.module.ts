import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContestListComponent } from './modules/contest/components/contest-list/contest-list.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { RegisterComponent } from './modules/auth/register/register.component';

const routes: Routes = [
  { path: 'contests', component: ContestListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/contests', pathMatch: 'full' },
  { path: '**', redirectTo: '/contests' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }