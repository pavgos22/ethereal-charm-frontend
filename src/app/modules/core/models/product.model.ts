export interface PrimitiveProduct {
  uid: string;
  name: string;
  price: number;
  createAt: string;
  imageUrl: string;
  mainDesc: string;
  discount: boolean;
  discountedPrice: number;
  priority: number;
}

export interface Product extends Omit<PrimitiveProduct, 'imageUrl'> {
  uid: string;
  activate: boolean;
  descHtml: string;
  imageUrls: string[];
  parameters: { [key: string]: string };
  categoryDTO: {
    name: string;
    shortId: string;
  };
  discount: boolean;
  discountedPrice: number;
}

export interface GetProductsResponse {
  products: PrimitiveProduct[];
  totalCount: number;
}

export interface AddProductData {
  name: string;
  mainDesc: string;
  descHtml: string;
  price: number;
  imagesUuid: string[];
  parameters: string;
  category: string;
}

export interface ProductResponse {
  timestamp: string;
  message: string;
}
