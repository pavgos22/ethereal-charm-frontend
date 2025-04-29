import { createAction, props } from '@ngrx/store';

const CREATE_ORDER_TYPE = '[Order] Create Order';
const CREATE_ORDER_SUCCESS = '[Order] Create Order Success';
const CREATE_ORDER_FAILURE = '[Order] Create Order Failure';

export const createOrder = createAction(
  CREATE_ORDER_TYPE,
  props<{ orderData: any }>()
);

export const createOrderSuccess = createAction(CREATE_ORDER_SUCCESS);

export const createOrderFailure = createAction(
  CREATE_ORDER_FAILURE,
  props<{ error: string }>()
);
