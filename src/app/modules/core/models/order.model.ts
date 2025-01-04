import { Customer } from './customer.model';
import { Address } from './address.model';
import { GetDelivery, PostDelivery } from './delivery.model';
import { CartProduct } from './cart.module';

export interface GetOrderResponse {
  uuid: string;
  orders: string;
  status: string;
  customerDetails: Customer;
  address: Address;
  deliver: GetDelivery;
  items: CartProduct[];
  summaryPrice: number;
  isCompany: boolean;
  companyName: string;
  nip: string;
  info: string;
}

export type GetOrdersResponse = Omit<
  GetOrderResponse,
  'items' | 'summaryPrice'
>;

export interface PostOrderBody {
  customerDetails: Customer;
  address: Address;
  deliver: PostDelivery;
}

export interface PostOrderResponse {
  status: {
    statusCode: string;
  };
  redirectUri: string;
  orderId: string;
  extOrderId: string;
}
