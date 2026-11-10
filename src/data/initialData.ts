import catalogJson from '../catalog/products.json';
import { CategoryInfo, Order, Product } from '../types/store';

export const IMAGE_FOLDER = catalogJson.imageFolder;

export const STUDIO_IMAGES = {
  heroShowcase: `${IMAGE_FOLDER}/hero_showcase.jpg`,
  scaleStatue: `${IMAGE_FOLDER}/scale_statue.jpg`,
  mechaModel: `${IMAGE_FOLDER}/mecha_model.jpg`,
  chibiVinyl: `${IMAGE_FOLDER}/chibi_vinyl.jpg`,
  artToy: `${IMAGE_FOLDER}/art_toy.jpg`,
};

export const CATEGORIES: CategoryInfo[] = catalogJson.categories as CategoryInfo[];

export const INITIAL_PRODUCTS: Product[] = catalogJson.products as Product[];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'FG-1042',
    createdAt: '09/11/2026 · 14:30',
    customerName: 'Nguyễn Minh Duy',
    phone: '0908 412 889',
    email: 'duyng2006@gmail.com',
    city: 'TP. Hồ Chí Minh',
    district: 'Quận 1',
    address: '142 Nguyễn Huệ, Phường Bến Nghé',
    postalCode: '700000',
    paymentMethod: 'COD (Thanh toán khi nhận hàng)',
    note: 'Đóng gói 2 lớp chống sốc hộp figure giúp mình.',
    items: INITIAL_PRODUCTS.slice(0, 2).map((p) => ({ product: p, quantity: 1 })),
    subtotal:
      (INITIAL_PRODUCTS[0]?.price || 0) + (INITIAL_PRODUCTS[1]?.price || 0),
    shippingFee: 0,
    discount: 0,
    total:
      (INITIAL_PRODUCTS[0]?.price || 0) + (INITIAL_PRODUCTS[1]?.price || 0),
    status: 'Đang chuẩn bị giao',
  },
];

export async function fetchExternalCatalog(): Promise<{
  imageFolder: string;
  categories: CategoryInfo[];
  products: Product[];
}> {
  const response = await fetch('/catalog/products.json', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Không thể tải file /catalog/products.json');
  }
  return response.json();
}

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
}
