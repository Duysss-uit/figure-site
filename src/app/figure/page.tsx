import React, { useMemo, useState } from 'react';
import { ArrowRight, Search, ArrowUpDown } from 'lucide-react';
import { CATEGORIES } from '../../data/initialData';
import { CategorySlug, Product } from '../../types/store';
import { ProductCard } from '../../components/ProductCard';
import { ProductImage } from '../../components/ProductImage';
import { PriceRangeOption, SortOption } from '../home/page';

interface FigureDirectoryPageProps {
  products: Product[];
  onSelectCategory: (slug: CategorySlug) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const FigureDirectoryPage: React.FC<FigureDirectoryPageProps> = ({
  products,
  onSelectCategory,
  onSelectProduct,
  onAddToCart,
}) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'Có sẵn' | 'Đặt trước'>('all');
  const [priceRange, setPriceRange] = useState<PriceRangeOption>('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [searchQuery, setSearchQuery] = useState('');

  const brands = useMemo(() => {
    const set = new Set(products.map((p) => p.brand));
    return Array.from(set);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedBrand !== 'all' && p.brand !== selectedBrand) return false;
        if (availabilityFilter !== 'all' && p.availability !== availabilityFilter) return false;
        if (priceRange === 'under-2m' && p.price >= 2000000) return false;
        if (priceRange === '2m-4.5m' && (p.price < 2000000 || p.price > 4500000)) return false;
        if (priceRange === 'over-4.5m' && p.price <= 4500000) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            p.series.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
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
  }, [products, selectedBrand, availabilityFilter, priceRange, sortBy, searchQuery]);

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-10 space-y-14">
      {/* Section 1: Directory of Toy Categories */}
      <section className="space-y-6">
        <div className="border-b border-stone-200 pb-5">
          <p className="text-xs text-zinc-500">
            Trang chủ / Figure · Danh mục toàn bộ thể loại đồ chơi sưu tầm
          </p>
          <h1 className="text-3xl font-bold text-zinc-900 mt-1">
            Danh Sách Các Thể Loại Figure & Đồ Chơi
          </h1>
          <p className="text-sm text-zinc-600 mt-1 max-w-2xl">
            Chọn trực tiếp vào từng thể loại đồ chơi bên dưới (Anime Figure, Gundam & Mecha, Scale Figure, Nendoroid & Chibi, Art Toy) để chuyển tới trang trưng bày riêng của thể loại đó.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => {
            const catItems = products.filter((p) => p.category === cat.slug);
            const inStockCount = catItems.filter((p) => p.availability === 'Có sẵn').length;
            return (
              <article
                key={cat.slug}
                onClick={() => onSelectCategory(cat.slug)}
                className="group bg-white border border-stone-200 hover:border-zinc-900 rounded-xl overflow-hidden flex flex-col justify-between cursor-pointer transition-transform duration-150 ease-out hover:-translate-y-0.5"
              >
                <div>
                  <ProductImage
                    src={cat.heroImage}
                    alt={cat.name}
                    aspectRatioClass="aspect-[4/3]"
                  />
                  <div className="p-6 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <span className="font-mono tabular-nums">{catItems.length} sản phẩm</span>
                      <span aria-hidden="true">·</span>
                      <span>{inStockCount} mẫu có sẵn</span>
                    </div>
                    <h2 className="text-lg font-bold text-zinc-900 group-hover:text-[#C83E2B] transition-colors">
                      {cat.name}
                    </h2>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 py-4 bg-[#FAF9F6] border-t border-stone-200 flex items-center justify-between text-xs">
                  <span className="text-zinc-500 truncate max-w-[200px]">
                    {cat.scaleRange}
                  </span>
                  <span className="font-semibold text-zinc-900 group-hover:text-[#C83E2B] flex items-center gap-1 shrink-0">
                    <span>Vào trang {cat.shortName}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Section 2: Full Catalog with Sort by Price, Name, Stock, Brand */}
      <section className="space-y-6 pt-4 border-t border-stone-200">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <p className="text-xs text-zinc-500">
              Tất cả mặt hàng hiện có · {filteredProducts.length} mẫu
            </p>
            <h2 className="text-2xl font-bold text-zinc-900 mt-1">
              Kệ Hàng Tổng Hợp Tất Cả Thể Loại
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm tên figure, series, SKU..."
                className="pl-9 pr-3.5 py-2 text-xs bg-white border border-stone-300 rounded-md text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 w-52"
              />
            </div>

            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              aria-label="Lọc theo hãng sản xuất"
              className="px-3 py-2 text-xs bg-white border border-stone-300 rounded-md text-zinc-800 focus:outline-none focus:border-zinc-900"
            >
              <option value="all">Tất cả hãng ({brands.length})</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

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

            <select
              value={availabilityFilter}
              onChange={(e) =>
                setAvailabilityFilter(e.target.value as 'all' | 'Có sẵn' | 'Đặt trước')
              }
              aria-label="Lọc tình trạng hàng"
              className="px-3 py-2 text-xs bg-white border border-stone-300 rounded-md text-zinc-800 focus:outline-none focus:border-zinc-900"
            >
              <option value="all">Mọi tình trạng</option>
              <option value="Có sẵn">Hàng có sẵn</option>
              <option value="Đặt trước">Hàng đặt trước</option>
            </select>

            <div className="flex items-center gap-1 bg-white border border-stone-300 rounded-md px-2.5 py-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
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
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              onAddToCart={onAddToCart}
              onNavigateCategory={onSelectCategory}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
