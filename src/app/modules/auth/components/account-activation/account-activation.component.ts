import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { NotifierService } from 'angular-notifier';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app.reducer';
import { selectAuthLoading } from '../../store/auth.selectors';
import * as AuthActions from '../../store/auth.actions';

@Component({
  selector: 'app-account-activation',
  templateUrl: './account-activation.component.html',
  styleUrls: ['./account-activation.component.scss']
})
export class AccountActivationComponent implements OnInit {
  loading$: Observable<boolean> = this.store.select(selectAuthLoading);
  errorMessage: null | string = null;
  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private authService: AuthService,
    private notifierService: NotifierService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const uid = params.get('uid');
      if (uid) {
        this.store.dispatch(AuthActions.activateAccount({ uid }));
      }
    });
  }
}
