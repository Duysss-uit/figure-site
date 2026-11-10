import React, { useMemo, useState } from 'react';
import { ArrowLeft, Search, ArrowUpDown } from 'lucide-react';
import { CATEGORIES } from '../../data/initialData';
import { CategorySlug, Product } from '../../types/store';
import { ProductCard } from '../../components/ProductCard';
import { ProductImage } from '../../components/ProductImage';
import { PriceRangeOption, SortOption } from '../home/page';

interface CategoryPageProps {
  activeSlug: CategorySlug;
  products: Product[];
  onSelectCategory: (slug: CategorySlug) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBackToShop: () => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  activeSlug,
  products,
  onSelectCategory,
  onSelectProduct,
  onAddToCart,
  onBackToShop,
}) => {
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'Có sẵn' | 'Đặt trước'>('all');
  const [priceRange, setPriceRange] = useState<PriceRangeOption>('all');
  const [sortOrder, setSortOrder] = useState<SortOption>('featured');
  const [searchQuery, setSearchQuery] = useState('');

  const currentCategory =
    CATEGORIES.find((c) => c.slug === activeSlug) || CATEGORIES[0];

  const categoryProducts = useMemo(() => {
    return products
      .filter((p) => p.category === currentCategory.slug)
      .filter((p) =>
        availabilityFilter === 'all' ? true : p.availability === availabilityFilter
      )
      .filter((p) => {
        if (priceRange === 'under-2m' && p.price >= 2000000) return false;
        if (priceRange === '2m-4.5m' && (p.price < 2000000 || p.price > 4500000)) return false;
        if (priceRange === 'over-4.5m' && p.price <= 4500000) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.series.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortOrder === 'price-asc') return a.price - b.price;
        if (sortOrder === 'price-desc') return b.price - a.price;
        if (sortOrder === 'name-asc') return a.name.localeCompare(b.name, 'vi');
        if (sortOrder === 'name-desc') return b.name.localeCompare(a.name, 'vi');
        if (sortOrder === 'stock-desc') return b.stock - a.stock;
        return Number(b.featured || false) - Number(a.featured || false);
      });
  }, [products, currentCategory.slug, availabilityFilter, priceRange, sortOrder, searchQuery]);

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-10 space-y-12">
      {/* Top Category Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <button
          type="button"
          onClick={onBackToShop}
          className="text-xs font-medium text-zinc-600 hover:text-zinc-900 flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Trang danh sách thể loại Figure</span>
        </button>

        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-200/70 rounded-lg">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => onSelectCategory(cat.slug)}
              className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                cat.slug === currentCategory.slug
                  ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {cat.shortName}
            </button>
          ))}
        </div>
      </div>

      {/* Category Editorial Showcase Header */}
      <section className="bg-white border border-stone-200/90 rounded-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-8 lg:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span>Chuyên trang thể loại đồ chơi</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">
                  {categoryProducts.length} sản phẩm
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-zinc-900 leading-tight">
                {currentCategory.name}
              </h1>
              <p className="text-sm font-medium text-zinc-800">
                {currentCategory.tagline}
              </p>
              <p className="text-sm text-zinc-600 leading-relaxed max-w-[62ch]">
                {currentCategory.description}
              </p>
            </div>

            <dl className="pt-6 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <dt className="text-zinc-500">Tỉ lệ & Quy cách tiêu chuẩn</dt>
                <dd className="font-semibold text-zinc-900 mt-1">
                  {currentCategory.scaleRange}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500">Chất liệu cấu thành</dt>
                <dd className="font-semibold text-zinc-900 mt-1">
                  {currentCategory.typicalMaterial}
                </dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-5 bg-stone-100 border-t lg:border-t-0 lg:border-l border-stone-200">
            <ProductImage
              src={currentCategory.heroImage}
              alt={currentCategory.name}
              aspectRatioClass="aspect-[4/3]"
              className="lg:h-full"
            />
          </div>
        </div>
      </section>

      {/* Filter & Sort Bar for Selected Category */}
      <section className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-zinc-900">
            Danh mục {currentCategory.shortName} ({categoryProducts.length})
          </h2>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Tìm trong ${currentCategory.shortName}...`}
                className="pl-9 pr-3.5 py-1.5 text-xs bg-white border border-stone-300 rounded-md text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 w-48"
              />
            </div>

            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value as PriceRangeOption)}
              aria-label="Lọc theo mức giá"
              className="px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-md text-zinc-800 focus:outline-none focus:border-zinc-900"
            >
              <option value="all">Mọi mức giá</option>
              <option value="under-2m">Dưới 2.000.000 ₫</option>
              <option value="2m-4.5m">2.000.000 ₫ – 4.500.000 ₫</option>
              <option value="over-4.5m">Trên 4.500.000 ₫</option>
            </select>

            <div className="flex items-center gap-1 bg-white border border-stone-300 rounded-md px-2.5 py-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOption)}
                aria-label="Sắp xếp theo giá hoặc tên"
                className="text-xs bg-transparent text-zinc-900 font-medium focus:outline-none cursor-pointer"
              >
                <option value="featured">Sắp xếp: Nổi bật</option>
                <option value="price-asc">Giá: Thấp → Cao</option>
                <option value="price-desc">Giá: Cao → Thấp</option>
                <option value="name-asc">Tên sản phẩm: A → Z</option>
                <option value="name-desc">Tên sản phẩm: Z → A</option>
                <option value="stock-desc">Tồn kho: Nhiều → Ít</option>
              </select>
            </div>

            <div className="flex items-center gap-1 p-1 bg-stone-200/70 rounded-md">
              {(['all', 'Có sẵn', 'Đặt trước'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setAvailabilityFilter(status)}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    availabilityFilter === status
                      ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  {status === 'all' ? 'Tất cả' : status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {categoryProducts.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-lg p-12 text-center space-y-3">
            <p className="text-base font-semibold text-zinc-900">
              Không có mặt hàng nào khớp với bộ lọc hiện tại trong phân loại {currentCategory.shortName}.
            </p>
            <button
              type="button"
              onClick={() => {
                setAvailabilityFilter('all');
                setPriceRange('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs font-medium text-white bg-zinc-900 rounded-md cursor-pointer"
            >
              Hiển thị tất cả sản phẩm {currentCategory.shortName}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {categoryProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
