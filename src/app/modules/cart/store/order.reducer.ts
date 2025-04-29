import { createReducer, on } from '@ngrx/store';
import * as OrderActions from './order.actions';

export interface OrderState {
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  loading: false,
  error: null
};

export const orderReducer = createReducer(
  initialState,
  on(OrderActions.createOrder, (state) => ({ ...state, loading: true })),
  on(OrderActions.createOrderSuccess, (state) => ({
    ...state,
    loading: false,
    error: null
  })),
  on(OrderActions.createOrderFailure, (state, action) => ({
    ...state,
    loading: false,
    error: action.error
  }))
);
