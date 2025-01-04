import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AccountActivationComponent } from './components/account-activation/account-activation.component';
import { PasswordRecoveryComponent } from './components/password-recovery/password-recovery.component';
import { PasswordRecoveryFormComponent } from './components/password-recovery-form/password-recovery-form.component';
import { UnauthGuard } from '../core/guards/unauth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [UnauthGuard] },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [UnauthGuard]
  },
  { path: 'activate/:uid', component: AccountActivationComponent },
  { path: 'password-recovery', component: PasswordRecoveryComponent },
  { path: 'password-recovery/:uid', component: PasswordRecoveryFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
