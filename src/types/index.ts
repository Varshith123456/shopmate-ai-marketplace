export interface Store {
  id: string;
  name: string;
  type: string;
  rating: number;
  eta: string;
  logo: string;
  fee: number;
  bg: string;
  color?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  rating: number;
  image: string;
  storeId: string;
  stock: number;
  sales: number;
  description: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  q: number;
  image: string;
  unit: string;
}

export interface Order {
  id: string;
  customerEmail: string;
  storeName: string;
  date: string;
  itemsCount: number;
  total: number;
  status: 'Processing' | 'Shopping & Picking' | 'Courier Dispatched' | 'Delivered' | 'Refunded';
  details: string;
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
  tier: 'Regular' | 'Gold Shield' | 'Platinum Concierge';
  ordersCount: number;
  totalSpent: number;
  joinDate: string;
}

export interface Message {
  sender: 'user' | 'assistant' | 'shopper';
  text: string;
  time: string;
  productsEmbed?: Product[];
}

export interface StoreSettings {
  storeOpen: boolean;
  deliveryFee: number;
  platformFee: number;
  supportPhone: string;
  notificationsEnabled: boolean;
}
