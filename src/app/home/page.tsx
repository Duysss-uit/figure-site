import React, { useMemo, useState } from 'react';
import { ArrowRight, Search, ArrowUpDown } from 'lucide-react';
import { CATEGORIES, STUDIO_IMAGES, formatVND } from '../../data/initialData';
import { CategorySlug, Product } from '../../types/store';
import { ProductCard } from '../../components/ProductCard';
import { ProductImage } from '../../components/ProductImage';

interface HomePageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onNavigateCategory: (slug: CategorySlug) => void;
  onNavigateFigureDirectory: () => void;
}

export type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc'
  | 'stock-desc';

export type PriceRangeOption = 'all' | 'under-2m' | '2m-4.5m' | 'over-4.5m';

export const HomePage: React.FC<HomePageProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onNavigateCategory,
  onNavigateFigureDirectory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeHomeFilter, setActiveHomeFilter] = useState<'all' | 'Có sẵn' | 'Đặt trước'>('all');
  const [priceRange, setPriceRange] = useState<PriceRangeOption>('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (activeHomeFilter !== 'all' && p.availability !== activeHomeFilter) return false;
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
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name, 'vi');
        if (sortBy === 'name-desc') return b.name.localeCompare(a.name, 'vi');
        if (sortBy === 'stock-desc') return b.stock - a.stock;
        return Number(b.featured || false) - Number(a.featured || false);
      });
  }, [products, activeHomeFilter, priceRange, sortBy, searchQuery]);

  return (
    <div className="space-y-16 pb-16">
      {/* Section 1: Storefront Split Hero */}
      <section className="bg-white border-b border-stone-200">
        <div className="max-w-[1280px] mx-auto px-6 py-10 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <p className="text-xs font-medium text-zinc-500">
                  Figure Storefront · Chuyên Figure, Anime, Gundam & Đồ Chơi Sưu Tầm
                </p>
                <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-zinc-900 leading-[1.12]">
                  Thế Giới Figure Chính Hãng Nhật Bản.
                </h1>
                <p className="text-base text-zinc-600 leading-relaxed max-w-[60ch]">
                  Hệ thống trưng bày và phân phối đầy đủ các dòng Anime Figure, mô hình lắp ráp Gundam, Scale Figure 1/7, Nendoroid và Art Toy giới hạn.
                </p>
              </div>

              <div className="space-y-5 pt-2">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={onNavigateFigureDirectory}
                    className="px-5 py-3 text-xs font-semibold text-white bg-zinc-900 hover:bg-[#C83E2B] rounded-md transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Mở Trang Danh Mục Figure</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigateCategory('gundam-mecha')}
                    className="px-5 py-3 text-xs font-semibold text-zinc-800 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Khám phá kệ Gundam
                  </button>
                </div>

                <div className="pt-5 border-t border-stone-200">
                  <p className="text-xs text-zinc-500 mb-2.5">
                    Chọn nhanh thể loại đồ chơi sưu tầm:
                  </p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold text-zinc-800">
                    {CATEGORIES.map((cat, idx) => (
                      <React.Fragment key={cat.slug}>
                        <button
                          type="button"
                          onClick={() => onNavigateCategory(cat.slug)}
                          className="hover:text-[#C83E2B] underline underline-offset-4 transition-colors cursor-pointer"
                        >
                          {cat.shortName}
                        </button>
                        {idx < CATEGORIES.length - 1 && (
                          <span className="text-stone-300" aria-hidden="true">
                            /
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col">
              <div className="relative rounded-xl overflow-hidden border border-stone-200 bg-stone-100 h-full flex flex-col justify-between">
                <ProductImage
                  src={STUDIO_IMAGES.heroShowcase}
                  alt="Trưng bày bộ sưu tập Figure & Gundam"
                  aspectRatioClass="aspect-[16/9]"
                  className="lg:h-full"
                />
                <div className="p-4 bg-white border-t border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="text-zinc-600">
                    <span className="font-semibold text-zinc-900">Tiêu điểm mới về:</span>{' '}
                    Tướng Quân Sengoku & Mecha Barbatos — Collector Statue 1/7
                  </div>
                  <span className="font-mono font-semibold text-zinc-900 tabular-nums">
                    {formatVND(7650000)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Category Cards Strip */}
      <section className="max-w-[1280px] mx-auto px-6 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <p className="text-xs text-zinc-500">Phân loại theo dòng sản phẩm</p>
            <h2 className="text-2xl font-bold text-zinc-900 mt-0.5">
              Danh Mục Thể Loại Đồ Chơi
            </h2>
          </div>
          <button
            type="button"
            onClick={onNavigateFigureDirectory}
            className="text-xs font-semibold text-[#C83E2B] hover:underline underline-offset-4 flex items-center gap-1 cursor-pointer"
          >
            <span>Xem trang tổng hợp tất cả thể loại Figure</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => {
            const count = products.filter((p) => p.category === cat.slug).length;
            return (
              <div
                key={cat.slug}
                onClick={() => onNavigateCategory(cat.slug)}
                className="group bg-white border border-stone-200/90 hover:border-zinc-900 rounded-lg overflow-hidden cursor-pointer flex flex-col justify-between transition-transform duration-150 ease-out hover:-translate-y-0.5"
              >
                <ProductImage
                  src={cat.heroImage}
                  alt={cat.name}
                  aspectRatioClass="aspect-[4/3]"
                />
                <div className="p-4 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-zinc-500">
                    <span>{cat.scaleRange.split('·')[0]}</span>
                    <span className="font-mono tabular-nums">{count} mẫu</span>
                  </div>
                  <h3 className="text-sm font-bold text-zinc-900 group-hover:text-[#C83E2B] transition-colors">
                    {cat.shortName}
                  </h3>
                  <p className="text-xs text-zinc-500 line-clamp-2">
                    {cat.tagline}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 3: Main Storefront Product Shelf with Sort by Price, Name, Stock */}
      <section className="max-w-[1280px] mx-auto px-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-stone-200 pb-5">
          <div>
            <p className="text-xs text-zinc-500">
              Kệ trưng bày trang chủ · {filteredProducts.length} mặt hàng
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 mt-1">
              Mặt Hàng Figure & Đồ Chơi Nổi Bật
            </h2>
          </div>

          {/* Search, Price Filter, Availability & Sort Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm tên figure, Gundam, series..."
                className="pl-9 pr-3.5 py-2 text-xs bg-white border border-stone-300 rounded-md text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 w-52"
              />
            </div>

            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value as PriceRangeOption)}
              aria-label="Lọc theo khoảng giá"
              className="px-3 py-2 text-xs bg-white border border-stone-300 rounded-md text-zinc-800 focus:outline-none focus:border-zinc-900"
            >
              <option value="all">Mọi mức giá</option>
              <option value="under-2m">Dưới 2.000.000 ₫</option>
              <option value="2m-4.5m">2.000.000 ₫ – 4.500.000 ₫</option>
              <option value="over-4.5m">Trên 4.500.000 ₫</option>
            </select>

            <div className="flex items-center gap-1 bg-white border border-stone-300 rounded-md px-2.5 py-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label="Sắp xếp sản phẩm"
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

            <div className="flex items-center gap-1 p-1 bg-stone-200/70 rounded-lg">
              {(['all', 'Có sẵn', 'Đặt trước'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setActiveHomeFilter(st)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeHomeFilter === st
                      ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  {st === 'all' ? 'Tất cả' : st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-lg p-12 text-center space-y-3">
            <p className="text-base font-semibold text-zinc-900">
              Không tìm thấy mặt hàng khớp với tiêu chí lọc hiện tại.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveHomeFilter('all');
                setPriceRange('all');
                setSortBy('featured');
              }}
              className="px-4 py-2 text-xs font-medium text-white bg-zinc-900 rounded-md cursor-pointer"
            >
              Đặt lại bộ lọc & sắp xếp
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
                onAddToCart={onAddToCart}
                onNavigateCategory={onNavigateCategory}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
