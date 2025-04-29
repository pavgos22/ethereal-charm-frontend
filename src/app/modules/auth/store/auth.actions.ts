import { createAction, props } from '@ngrx/store';
import { IUser, LoginData, RegisterData } from '../../core/models/auth.model';

const LOGIN_TYPE = '[Auth] Login';
const LOGIN_SUCCESS_TYPE = '[Auth] Login Success';
const LOGIN_FAILURE_TYPE = '[Auth] Login Failure';

const AUTOLOGIN_TYPE = '[Auth] Auto Login';
const AUTOLOGIN_SUCCESS_TYPE = '[Auth] Auto Login Success';
const AUTOLOGIN_FAILURE_TYPE = '[Auth] Auto Login Failure';

const LOGOUT_TYPE = '[Auth] Logout';
const LOGOUT_SUCCESS_TYPE = '[Auth] Logout Success';
const LOGOUT_FAILURE_TYPE = '[Auth] Logout Failure';

const REGISTER_TYPE = '[Auth] Register';
const REGISTER_SUCCESS_TYPE = '[Auth] Register Success';
const REGISTER_FAILURE_TYPE = '[Auth] Register Failure';

const PASSWORD_RESET_TYPE = '[Auth] Password Reset';
const PASSWORD_RESET_SUCCESS_TYPE = '[Auth] Password Reset Success';
const PASSWORD_RESET_FAILURE_TYPE = '[Auth] Password Reset Failure';

const ACCOUNT_ACTIVATION_TYPE = '[Auth] Account Activation';
const ACCOUNT_ACTIVATION_SUCCESS = '[Auth] Account Activation Success';
const ACCOUNT_ACTIVATION_FAILURE = '[Auth] Account Activation Failure';

const CLEAR_ERROR_TYPE = '[Auth] Clear Error';

export const login = createAction(
  LOGIN_TYPE,
  props<{ loginData: LoginData }>()
);

export const loginSuccess = createAction(
  LOGIN_SUCCESS_TYPE,
  props<{ user: IUser }>()
);

export const loginFailure = createAction(
  LOGIN_FAILURE_TYPE,
  props<{ error: string }>()
);

export const autoLogin = createAction(AUTOLOGIN_TYPE);

export const autoLoginSuccess = createAction(
  AUTOLOGIN_SUCCESS_TYPE,
  props<{ user: IUser }>()
);

export const autoLoginFailure = createAction(AUTOLOGIN_FAILURE_TYPE);

export const logout = createAction(LOGOUT_TYPE);

export const logoutSuccess = createAction(LOGOUT_SUCCESS_TYPE);

export const logoutFailure = createAction(LOGOUT_FAILURE_TYPE);

export const register = createAction(
  REGISTER_TYPE,
  props<{ registerData: RegisterData }>()
);

export const registerSuccess = createAction(REGISTER_SUCCESS_TYPE);

export const registerFailure = createAction(
  REGISTER_FAILURE_TYPE,
  props<{ error: string }>()
);

export const clearError = createAction(CLEAR_ERROR_TYPE);

export const passwordReset = createAction(
  PASSWORD_RESET_TYPE,
  props<{ email: string }>()
);

export const passwordResetFailure = createAction(
  PASSWORD_RESET_FAILURE_TYPE,
  props<{ error: string }>()
);

export const activateAccount = createAction(
  ACCOUNT_ACTIVATION_TYPE,
  props<{ uid: string }>()
);

export const activateAccountSuccess = createAction(ACCOUNT_ACTIVATION_SUCCESS);

export const activateAccountFailure = createAction(
  ACCOUNT_ACTIVATION_FAILURE,
  props<{ error: string }>()
);

export const passwordResetSuccess = createAction(PASSWORD_RESET_SUCCESS_TYPE);
