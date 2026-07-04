export interface User {
  id: number;
  username: string;
  email: string;
  role: 'customer' | 'vendor';
}

export interface Shop {
  id: number;
  name: string;
  description: string;
  logo: string | null;
  rating: number;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  unit_type: string;
  image: string | null;
  sales_count: number;
  in_stock: boolean;
  shop_name: string;
  category_name: string;
}

export interface Review {
  id: number;
  author_name: string;
  rating: number;
  text: string;
  created_at: string;
}

export interface CartItem {
  id: number;
  product: number;
  product_title: string;
  product_price: number;
  shop_name: string;
  quantity: number;
}

export interface OrderItem {
  id: number;
  product_title: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  customer_name: string;
  customer_phone: string;
  status: 'new' | 'paid' | 'shipping' | 'completed' | 'canceled';
  total_price: number;
  created_at: string;
  items: OrderItem[];
}
