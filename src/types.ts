export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  unit_type: string;
  image: string;
  shop_name: string;
}

export interface CartItem {
  id: number;
  product: number;
  product_title: string;
  product_price: number;
  shop_name: string;
  quantity: number;
}
