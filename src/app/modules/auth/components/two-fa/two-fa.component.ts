import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../store/auth.actions';
import { Observable } from 'rxjs';
import { AppState } from '../../../../store/app.reducer';
import {
  selectAuthLoading,
  selectTwoFAChallengeId,
  selectAuthError
} from '../../store/auth.selectors';

type TwoFAForm = {
  code: FormControl<string>;
};

@Component({
  selector: 'app-two-fa',
  templateUrl: './two-fa.component.html',
  styleUrls: ['./two-fa.component.scss']
})
export class TwoFaComponent {
  form = new FormGroup<TwoFAForm>({
    code: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^\d{6}$/)]
    })
  });

  loading$: Observable<boolean> = this.store.select(selectAuthLoading);
  errorMsg$: Observable<string | null> = this.store.select(selectAuthError);
  challengeId$: Observable<string | null> = this.store.select(
    selectTwoFAChallengeId
  );

  submitted = false;

  constructor(private store: Store<AppState>) {}

  submit(challengeId: string | null): void {
    this.submitted = true;
    if (!challengeId || this.form.invalid) return;

    const code = this.form.controls.code.value;
    this.store.dispatch(AuthActions.twoFAVerify({ challengeId, code }));
  }
}
