import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { SharedModule } from '../shared/shared.module';
import { RegisterComponent } from './components/register/register.component';
import { AccountActivationComponent } from './components/account-activation/account-activation.component';
import { PasswordRecoveryComponent } from './components/password-recovery/password-recovery.component';
import { PasswordRecoveryFormComponent } from './components/password-recovery-form/password-recovery-form.component';
import { CoreModule } from '../core/core.module';
import { TwoFaComponent } from './components/two-fa/two-fa.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    AccountActivationComponent,
    PasswordRecoveryComponent,
    PasswordRecoveryFormComponent,
    TwoFaComponent
  ],
  imports: [SharedModule, AuthRoutingModule, CoreModule]
})
export class AuthModule {}
