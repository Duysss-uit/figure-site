export type CategorySlug =
  | 'anime-figure'
  | 'gundam-mecha'
  | 'scale-figure'
  | 'chibi-nendoroid'
  | 'art-toy';

export interface CategoryInfo {
  slug: CategorySlug;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  scaleRange: string;
  typicalMaterial: string;
  heroImage: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  series: string;
  category: CategorySlug;
  brand: string;
  scale: string;
  height: string;
  material: string;
  sculptor: string;
  price: number;
  originalPrice?: number;
  stock: number;
  availability: 'Có sẵn' | 'Đặt trước';
  releaseYear: string;
  image: string;
  description: string;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'Đang chuẩn bị giao' | 'Đang vận chuyển' | 'Đã hoàn tất' | 'Đã hủy';

export type PaymentMethodType =
  | 'COD (Thanh toán khi nhận hàng)'
  | 'Chuyển khoản ngân hàng (VietQR)'
  | 'Thẻ Visa / Mastercard / JCB'
  | 'Ví điện tử MoMo / ZaloPay';

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  phone: string;
  email?: string;
  city?: string;
  district?: string;
  address: string;
  postalCode: string;
  paymentMethod: PaymentMethodType;
  paymentDetails?: string;
  note?: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar: string;
  isAdmin: boolean;
  phone: string;
  city: string;
  district: string;
  address: string;
}

export type AccountSectionTab = 'orders-cart' | 'profile' | 'reset-password';

export type PageRoute =
  | { page: 'home' }
  | { page: 'figure-directory' }
  | { page: 'category'; slug: CategorySlug }
  | { page: 'account'; tab?: AccountSectionTab; highlightOrderId?: string }
  | { page: 'checkout' }
  | { page: 'login'; initialMode?: 'login' | 'register' }
  | { page: 'forgot-password'; emailPrefill?: string }
  | { page: 'admin' };
