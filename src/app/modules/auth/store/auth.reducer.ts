import { Action, createReducer, on } from '@ngrx/store';
import { User } from '../../core/models/auth.model';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  twoFAChallengeId: string | null;
  twoFARequired: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  twoFAChallengeId: null,
  twoFARequired: false
};

const reducer = createReducer(
  initialState,

  on(AuthActions.login, AuthActions.register, (state, action) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AuthActions.loginSuccess, (state, action) => ({
    ...state,
    loading: false,
    error: null,
    user: new User(action.user.login, action.user.email, action.user.role),
    twoFARequired: false,
    twoFAChallengeId: null
  })),

  on(
    AuthActions.loginFailure,
    AuthActions.registerFailure,
    (state, action) => ({
      ...state,
      loading: false,
      user: null,
      error: action.error,
      twoFARequired: false,
      twoFAChallengeId: null
    })
  ),

  on(AuthActions.registerSuccess, (state, action) => ({
    ...state,
    loading: false,
    error: null
  })),

  on(AuthActions.autoLogin, (state, action) => ({
    ...state
  })),

  on(AuthActions.autoLoginSuccess, (state, action) => ({
    ...state,
    user: new User(action.user.login, action.user.email, action.user.role),
    error: null,
    twoFARequired: false,
    twoFAChallengeId: null
  })),

  on(AuthActions.autoLoginFailure, (state, action) => ({
    ...state
  })),

  on(AuthActions.logout, (state, action) => ({
    ...state
  })),

  on(AuthActions.logoutSuccess, (state, action) => ({
    ...state,
    user: null,
    error: null,
    twoFARequired: false,
    twoFAChallengeId: null
  })),

  on(AuthActions.logoutFailure, (state, action) => ({
    ...state
  })),

  on(AuthActions.passwordReset, (state, action) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AuthActions.passwordResetSuccess, (state, action) => ({
    ...state,
    loading: false,
    error: null
  })),

  on(AuthActions.passwordResetFailure, (state, action) => ({
    ...state,
    loading: false,
    error: action.error
  })),

  on(AuthActions.activateAccount, (state, action) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AuthActions.activateAccountSuccess, (state, action) => ({
    ...state,
    loading: false,
    error: null
  })),

  on(AuthActions.activateAccountFailure, (state, action) => ({
    ...state,
    loading: false,
    error: action.error
  })),

  on(AuthActions.twoFARequired, (state, action) => ({
    ...state,
    loading: false,
    error: null,
    user: null,
    twoFARequired: true,
    twoFAChallengeId: action.challengeId
  })),

  on(AuthActions.twoFAVerify, (state, action) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AuthActions.twoFAVerifySuccess, (state, action) => ({
    ...state,
    loading: false,
    error: null,
    user: new User(action.user.login, action.user.email, action.user.role),
    twoFARequired: false,
    twoFAChallengeId: null
  })),

  on(AuthActions.twoFAVerifyFailure, (state, action) => ({
    ...state,
    loading: false,
    error: action.error
  })),

  on(AuthActions.toggleTwoFA, (state, action) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AuthActions.toggleTwoFASuccess, (state, action) => ({
    ...state,
    loading: false,
    error: null
  })),

  on(AuthActions.toggleTwoFAFailure, (state, action) => ({
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
  return reducer(state, action);
}
