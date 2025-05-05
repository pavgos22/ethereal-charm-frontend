import { ServerResponse } from './server-response.model';

export interface CartProduct {
  uuid: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  summaryPrice: number;
  createAt: string;
}

export interface GetCartResponse {
  cartProducts: CartProduct[];
  summaryPrice: number;
}

export interface PostCartBody {
  product: string;
  quantity: number;
}

export interface CartResponse {
  body: ServerResponse | GetCartResponse | null;
  totalCount: number;
}
