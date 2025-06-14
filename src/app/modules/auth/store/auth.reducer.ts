import { User } from '../../core/models/auth.model';
import { Action, createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null
};

const _authReducer = createReducer(
  initialState,
  on(AuthActions.login, AuthActions.register, (state, action) => ({
    ...state,
    loading: true
  })),
  on(AuthActions.loginSuccess, (state, action) => ({
    ...state,
    loading: false,
    user: new User(action.user.login, action.user.email, action.user.role),
    error: null
  })),
  on(
    AuthActions.loginFailure,
    AuthActions.registerFailure,
    (state, action) => ({
      ...state,
      loading: false,
      user: null,
      error: action.error
    })
  ),
  on(
    AuthActions.autoLogin,
    AuthActions.autoLoginFailure,
    AuthActions.logout,
    AuthActions.logoutFailure,
    (state, action) => ({
      ...state
    })
  ),
  on(AuthActions.autoLoginSuccess, (state, action) => ({
    ...state,
    user: new User(action.user.login, action.user.email, action.user.role)
  })),
  on(AuthActions.logoutSuccess, (state, action) => ({
    ...state,
    user: null,
    error: null
  })),
  on(AuthActions.registerSuccess, (state, action) => ({
    ...state,
    loading: false,
    error: null
  })),
  on(AuthActions.passwordReset, (state) => ({
    ...state,
    loading: true
  })),
  on(AuthActions.passwordResetSuccess, (state) => ({
    ...state,
    loading: false,
    error: null
  })),
  on(AuthActions.passwordResetFailure, (state, action) => ({
    ...state,
    loading: false,
    error: action.error
  })),
  on(AuthActions.activateAccount, (state) => ({
    ...state,
    loading: true
  })),
  on(AuthActions.activateAccountSuccess, (state) => ({
    ...state,
    loading: false,
    error: null
  })),
  on(AuthActions.activateAccountFailure, (state, action) => ({
    ...state,
    loading: false,
    error: action.error
  })),
  on(AuthActions.clearError, (state, action) => ({
    ...state,
    error: null
  }))
);

export function authReducer(state: AuthState | undefined, action: Action) {
  return _authReducer(state, action);
}
