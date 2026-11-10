import React, { useState } from 'react';
import {
  PlusCircle,
  Trash2,
  Upload,
  CheckCircle2,
  Download,
  RefreshCw,
  FolderOpen,
  FileJson,
} from 'lucide-react';
import { IMAGE_FOLDER, STUDIO_IMAGES, formatVND } from '../../data/initialData';
import {
  CategoryInfo,
  CategorySlug,
  Order,
  OrderStatus,
  Product,
  UserAccount,
} from '../../types/store';
import { ProductImage } from '../../components/ProductImage';

interface AdminPageProps {
  categories: CategoryInfo[];
  products: Product[];
  orders: Order[];
  currentUser: UserAccount;
  onAddProduct: (newProduct: Omit<Product, 'id'>) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateStock: (productId: string, newStock: number) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onImportCatalogJson: (data: {
    categories: CategoryInfo[];
    products: Product[];
  }) => void;
  onReloadFromPublicJson: () => void;
  onNavigateShop: () => void;
}

const IMAGE_FOLDER_PRESETS = [
  { label: 'scale_statue.jpg', url: STUDIO_IMAGES.scaleStatue },
  { label: 'mecha_model.jpg', url: STUDIO_IMAGES.mechaModel },
  { label: 'chibi_vinyl.jpg', url: STUDIO_IMAGES.chibiVinyl },
  { label: 'art_toy.jpg', url: STUDIO_IMAGES.artToy },
  { label: 'hero_showcase.jpg', url: STUDIO_IMAGES.heroShowcase },
];

export const AdminPage: React.FC<AdminPageProps> = ({
  categories,
  products,
  orders,
  currentUser,
  onAddProduct,
  onDeleteProduct,
  onUpdateStock,
  onUpdateOrderStatus,
  onImportCatalogJson,
  onReloadFromPublicJson,
  onNavigateShop,
}) => {
  const [activeTab, setActiveTab] = useState<'publish' | 'inventory' | 'orders' | 'json'>('publish');

  const [name, setName] = useState('');
  const [series, setSeries] = useState('Mobile Suit Gundam / Anime Series');
  const [sku, setSku] = useState(`FG-NEW-${Math.floor(100 + Math.random() * 900)}`);
  const [category, setCategory] = useState<CategorySlug>(
    categories[0]?.slug || 'anime-figure'
  );
  const [brand, setBrand] = useState('Good Smile Company');
  const [scale, setScale] = useState('1/7 Scale');
  const [height, setHeight] = useState('250 mm');
  const [material, setMaterial] = useState('PVC · ABS sơn tĩnh điện');
  const [sculptor, setSculptor] = useState('Figure Studio');
  const [price, setPrice] = useState('3450000');
  const [stock, setStock] = useState('10');
  const [availability, setAvailability] = useState<'Có sẵn' | 'Đặt trước'>('Có sẵn');
  const [image, setImage] = useState(`${IMAGE_FOLDER}/scale_statue.jpg`);
  const [description, setDescription] = useState(
    'Phiên bản điêu khắc tỉ lệ chuẩn chính hãng từ Nhật Bản, hoàn thiện sơn chuyển sắc thủ công kèm bệ trưng bày riêng biệt.'
  );
  const [featured, setFeatured] = useState(true);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleJsonFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (Array.isArray(parsed.products)) {
          onImportCatalogJson({
            categories: Array.isArray(parsed.categories)
              ? parsed.categories
              : categories,
            products: parsed.products,
          });
          setPublishSuccess(
            `Đã nạp thành công ${parsed.products.length} vật phẩm từ file JSON "${file.name}"!`
          );
          setTimeout(() => setPublishSuccess(null), 4000);
        }
      } catch {
        setPublishSuccess('File JSON không đúng định dạng.');
      }
    };
    reader.readAsText(file);
  };

  const handleExportJson = () => {
    const payload = {
      imageFolder: IMAGE_FOLDER,
      categories,
      products,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const numericPrice = Math.max(
      10000,
      parseInt(price.replace(/\D/g, ''), 10) || 1500000
    );
    const numericStock = Math.max(0, parseInt(stock, 10) || 5);

    onAddProduct({
      sku: sku.trim() || `FG-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      series: series.trim() || 'Original Series',
      category,
      brand: brand.trim() || 'Good Smile Company',
      scale: scale.trim() || '1/7 Scale',
      height: height.trim() || '240 mm',
      material: material.trim() || 'PVC & ABS',
      sculptor: sculptor.trim() || 'Studio Sculptor',
      price: numericPrice,
      stock: numericStock,
      availability,
      releaseYear: '2026',
      image: image.trim() || `${IMAGE_FOLDER}/scale_statue.jpg`,
      description: description.trim(),
      featured,
    });

    setPublishSuccess(
      `Đã đăng bán "${name.trim()}" vào thể loại ${
        categories.find((c) => c.slug === category)?.shortName || category
      }!`
    );
    setName('');
    setSku(`FG-NEW-${Math.floor(100 + Math.random() * 900)}`);
    setTimeout(() => setPublishSuccess(null), 4000);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span>Xin chào Admin: {currentUser.name}</span>
            <span aria-hidden="true">·</span>
            <span>{products.length} vật phẩm</span>
            <span aria-hidden="true">·</span>
            <span>{categories.length} loại mặt hàng</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 mt-1">
            Trang Quản Trị Viên (Chỉ Hiển Thị Cho Tài Khoản Admin)
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportJson}
            className="px-3.5 py-2 text-xs font-medium text-zinc-800 bg-stone-200/80 hover:bg-stone-300 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải file products.json</span>
          </button>

          <button
            type="button"
            onClick={onReloadFromPublicJson}
            className="px-3.5 py-2 text-xs font-medium text-zinc-800 bg-stone-200/80 hover:bg-stone-300 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Đọc lại từ /catalog/products.json</span>
          </button>

          <button
            type="button"
            onClick={onNavigateShop}
            className="px-4 py-2 text-xs font-semibold text-white bg-zinc-900 hover:bg-[#C83E2B] rounded-md transition-colors cursor-pointer"
          >
            Về Trang chủ
          </button>
        </div>
      </div>

      {/* Info Box: Dedicated JSON & Image Folder Architecture */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="flex items-start gap-3">
          <FileJson className="w-5 h-5 text-[#C83E2B] shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-zinc-900">
              File JSON dữ liệu vật phẩm & thể loại:
            </p>
            <p className="font-mono text-zinc-700 mt-0.5">
              /public/catalog/products.json
            </p>
            <p className="text-zinc-500 mt-0.5">
              Chứa toàn bộ danh mục thể loại (`categories`), tên, giá bán (`price`) và thông tin vật phẩm (`products`).
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <FolderOpen className="w-5 h-5 text-zinc-800 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-zinc-900">
              Thư mục chứa ảnh vật phẩm riêng biệt:
            </p>
            <p className="font-mono text-zinc-700 mt-0.5">
              /public/catalog/images/
            </p>
            <p className="text-zinc-500 mt-0.5">
              Các file ảnh trong thư mục được tham chiếu qua đường dẫn `/catalog/images/[tên_ảnh].jpg`.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-200/70 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('publish')}
          className={`px-4 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === 'publish'
              ? 'bg-white text-zinc-900 shadow-xs font-semibold'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          1. Đăng mặt hàng mới lên bán
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === 'inventory'
              ? 'bg-white text-zinc-900 shadow-xs font-semibold'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          2. Quản lý kho hàng ({products.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-white text-zinc-900 shadow-xs font-semibold'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          3. Duyệt đơn hàng ({orders.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('json')}
          className={`px-4 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === 'json'
              ? 'bg-white text-zinc-900 shadow-xs font-semibold'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          4. Quản lý File JSON & Thư mục ảnh
        </button>
      </div>

      {publishSuccess && (
        <div className="bg-white border border-stone-300 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs font-semibold text-emerald-800">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{publishSuccess}</span>
          </div>
          <button
            type="button"
            onClick={onNavigateShop}
            className="text-xs font-semibold text-[#C83E2B] underline underline-offset-4 cursor-pointer"
          >
            Xem trên Trang chủ ngay
          </button>
        </div>
      )}

      {activeTab === 'publish' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <form
            onSubmit={handlePublishSubmit}
            className="lg:col-span-8 bg-white border border-stone-200 rounded-xl p-6 md:p-8 space-y-5"
          >
            <div className="border-b border-stone-200 pb-4">
              <h2 className="text-lg font-bold text-zinc-900">
                Đăng Mặt Hàng Mới Lên Kệ Bán
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Nhập tên, giá bán, chọn mục loại vật phẩm và chọn ảnh từ thư mục `/catalog/images/` hoặc tải từ máy.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Tên Figure / Đồ chơi sưu tầm *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: MG 1/100 Freedom Gundam Ver.2.0"
                  className="w-full px-3.5 py-2 text-sm bg-[#FAF9F6] border border-stone-300 rounded-md text-zinc-900 focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Mã SKU
                </label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-[#FAF9F6] border border-stone-300 rounded-md text-zinc-900 font-mono focus:outline-none focus:border-zinc-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Mục loại vật phẩm (Category) *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategorySlug)}
                  className="w-full px-3.5 py-2 text-sm bg-[#FAF9F6] border border-stone-300 rounded-md text-zinc-900 focus:outline-none focus:border-zinc-900"
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.shortName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Series / Bộ phim
                </label>
                <input
                  type="text"
                  value={series}
                  onChange={(e) => setSeries(e.target.value)}
                  placeholder="Gundam SEED, Jujutsu Kaisen..."
                  className="w-full px-3.5 py-2 text-sm bg-[#FAF9F6] border border-stone-300 rounded-md text-zinc-900 focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Hãng sản xuất
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Bandai, Good Smile, Alter..."
                  className="w-full px-3.5 py-2 text-sm bg-[#FAF9F6] border border-stone-300 rounded-md text-zinc-900 focus:outline-none focus:border-zinc-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Giá bán (VNĐ) *
                </label>
                <input
                  type="number"
                  required
                  min={10000}
                  step={10000}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-[#FAF9F6] border border-stone-300 rounded-md text-zinc-900 font-mono focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Số lượng kho *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-[#FAF9F6] border border-stone-300 rounded-md text-zinc-900 font-mono focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Tỉ lệ & Chiều cao
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <input
                    type="text"
                    value={scale}
                    onChange={(e) => setScale(e.target.value)}
                    placeholder="1/7 Scale"
                    className="w-full px-2 py-2 text-xs bg-[#FAF9F6] border border-stone-300 rounded-md text-zinc-900"
                  />
                  <input
                    type="text"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="250 mm"
                    className="w-full px-2 py-2 text-xs bg-[#FAF9F6] border border-stone-300 rounded-md text-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Tình trạng
                </label>
                <select
                  value={availability}
                  onChange={(e) =>
                    setAvailability(e.target.value as 'Có sẵn' | 'Đặt trước')
                  }
                  className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-stone-300 rounded-md text-zinc-900 focus:outline-none focus:border-zinc-900"
                >
                  <option value="Có sẵn">Hàng có sẵn</option>
                  <option value="Đặt trước">Đặt trước</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-stone-200">
              <label className="block text-xs font-medium text-zinc-700">
                Chọn file ảnh từ thư mục `/catalog/images/` hoặc tải ảnh mới:
              </label>
              <div className="flex flex-wrap gap-2">
                {IMAGE_FOLDER_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setImage(preset.url)}
                    className={`px-3 py-1.5 text-xs font-mono rounded-md border transition-colors cursor-pointer ${
                      image === preset.url
                        ? 'border-zinc-900 bg-zinc-900 text-white font-medium'
                        : 'border-stone-300 bg-[#FAF9F6] text-zinc-700 hover:border-zinc-600'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="/catalog/images/ten_anh.jpg"
                  className="flex-1 px-3.5 py-2 text-xs bg-[#FAF9F6] border border-stone-300 rounded-md text-zinc-800 font-mono focus:outline-none focus:border-zinc-900"
                />
                <label className="px-4 py-2 text-xs font-medium text-zinc-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-md flex items-center justify-center gap-1.5 cursor-pointer shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Tải ảnh từ máy</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Mô tả chi tiết
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-[#FAF9F6] border border-stone-300 rounded-md text-zinc-900 focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-xs text-zinc-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-stone-300"
                />
                <span>Hiển thị nổi bật ngoài Trang chủ</span>
              </label>

              <button
                type="submit"
                className="px-6 py-3 text-xs font-semibold text-white bg-[#C83E2B] hover:bg-[#b03220] rounded-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Đăng sản phẩm lên bán</span>
              </button>
            </div>
          </form>

          {/* Live Preview */}
          <div className="lg:col-span-4 space-y-3">
            <p className="text-xs font-semibold text-zinc-500">
              Xem trước thẻ sản phẩm:
            </p>
            <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
              <ProductImage
                src={image}
                alt={name || 'Tên Figure mới'}
                aspectRatioClass="aspect-[4/3]"
              />
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <span>
                    {categories.find((c) => c.slug === category)?.shortName}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{scale || '1/7 Scale'}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-medium text-zinc-800">{availability}</span>
                </div>
                <h3 className="text-base font-semibold text-zinc-900">
                  {name.trim() || 'Tên Figure mới sẽ hiển thị tại đây'}
                </h3>
                <p className="text-xs text-zinc-500">
                  {brand} · Cao {height}
                </p>
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[15px] font-mono font-semibold text-zinc-900 tabular-nums">
                    {formatVND(parseInt(price.replace(/\D/g, ''), 10) || 0)}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono tabular-nums">
                    Kho: {stock || 0} bản
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-[#FAF9F6] text-xs font-semibold text-zinc-600">
                  <th className="py-3.5 px-5">Sản phẩm & Đường dẫn ảnh</th>
                  <th className="py-3.5 px-4">Mục loại vật phẩm</th>
                  <th className="py-3.5 px-4">Giá bán</th>
                  <th className="py-3.5 px-4">Tồn kho</th>
                  <th className="py-3.5 px-5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-xs">
                {products.map((item) => {
                  const cat = categories.find((c) => c.slug === item.category);
                  return (
                    <tr key={item.id} className="hover:bg-stone-50/80">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-14 rounded overflow-hidden border border-stone-200 shrink-0">
                            <ProductImage
                              src={item.image}
                              alt={item.name}
                              aspectRatioClass="aspect-[4/3]"
                            />
                          </div>
                          <div>
                            <span className="font-mono text-[11px] text-zinc-500">
                              {item.sku} · {item.image}
                            </span>
                            <p className="font-semibold text-zinc-900 text-sm">
                              {item.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-zinc-700">
                        {cat?.shortName || item.category}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-zinc-900 tabular-nums">
                        {formatVND(item.price)}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={0}
                            value={item.stock}
                            onChange={(e) =>
                              onUpdateStock(
                                item.id,
                                Math.max(0, parseInt(e.target.value, 10) || 0)
                              )
                            }
                            aria-label={`Tồn kho của ${item.name}`}
                            className="w-16 px-2 py-1 text-xs font-mono bg-[#FAF9F6] border border-stone-300 rounded text-zinc-900 tabular-nums"
                          />
                          <span className="text-zinc-500">bản</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          type="button"
                          onClick={() => onDeleteProduct(item.id)}
                          className="inline-flex items-center gap-1 text-zinc-500 hover:text-red-700 font-medium cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Gỡ bỏ</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-[#FAF9F6] text-xs font-semibold text-zinc-600">
                  <th className="py-3.5 px-5">Mã đơn & Thời gian</th>
                  <th className="py-3.5 px-4">Người nhận</th>
                  <th className="py-3.5 px-4">Sản phẩm</th>
                  <th className="py-3.5 px-4">Tổng thu</th>
                  <th className="py-3.5 px-5">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-xs">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-50/80">
                    <td className="py-4 px-5">
                      <span className="font-mono font-bold text-zinc-900 block">
                        #{ord.id}
                      </span>
                      <span className="font-mono text-zinc-500 text-[11px] tabular-nums">
                        {ord.createdAt}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-zinc-900 block">
                        {ord.customerName}
                      </span>
                      <span className="font-mono text-zinc-500">{ord.phone}</span>
                    </td>
                    <td className="py-4 px-4 text-zinc-700">
                      {ord.items.map((i) => (
                        <div key={i.product.id} className="truncate max-w-xs">
                          {i.quantity}× {i.product.name}
                        </div>
                      ))}
                    </td>
                    <td className="py-4 px-4 font-mono font-semibold text-zinc-900 tabular-nums">
                      {formatVND(ord.total)}
                    </td>
                    <td className="py-4 px-5">
                      <select
                        value={ord.status}
                        onChange={(e) =>
                          onUpdateOrderStatus(ord.id, e.target.value as OrderStatus)
                        }
                        aria-label={`Trạng thái đơn ${ord.id}`}
                        className="px-3 py-1.5 text-xs bg-[#FAF9F6] border border-stone-300 rounded-md font-medium text-zinc-900 focus:outline-none focus:border-zinc-900"
                      >
                        <option value="Đang chuẩn bị giao">Đang chuẩn bị giao</option>
                        <option value="Đang vận chuyển">Đang vận chuyển</option>
                        <option value="Đã hoàn tất">Đã hoàn tất</option>
                        <option value="Đã hủy">Đã hủy</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'json' && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 md:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4">
            <div>
              <h2 className="text-lg font-bold text-zinc-900">
                Cấu Trúc File `/public/catalog/products.json` & Thư Mục `/public/catalog/images/`
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Bạn có thể chỉnh sửa trực tiếp file `/public/catalog/products.json` hoặc tải file JSON từ máy tính lên đây.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="px-4 py-2 text-xs font-semibold text-zinc-900 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-md flex items-center gap-1.5 cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Nhập file .json từ máy</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleJsonFileUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleExportJson}
                className="px-4 py-2 text-xs font-semibold text-white bg-zinc-900 hover:bg-[#C83E2B] rounded-md flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Xuất file products.json</span>
              </button>
            </div>
          </div>

          <pre className="p-4 bg-zinc-900 text-stone-100 rounded-lg text-xs font-mono overflow-x-auto max-h-96 leading-relaxed">
            {JSON.stringify(
              {
                imageFolder: IMAGE_FOLDER,
                categories,
                products,
              },
              null,
              2
            )}
          </pre>
        </div>
      )}
    </div>
  );
};
