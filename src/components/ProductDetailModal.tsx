import React, { useState } from 'react';
import { X, Minus, Plus, Check } from 'lucide-react';
import { CATEGORIES, formatVND } from '../data/initialData';
import { CategorySlug, Product } from '../types/store';
import { ProductImage } from './ProductImage';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
  onNavigateCategory: (slug: CategorySlug) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  onNavigateCategory,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  if (!product) return null;

  const categoryInfo = CATEGORIES.find((c) => c.slug === product.category);

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1400);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 md:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF9F6] border border-stone-200 rounded-xl max-w-4xl w-full overflow-hidden shadow-xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-stone-200">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span>Mã lưu trữ:</span>
            <span className="font-mono text-zinc-900 font-medium">{product.sku}</span>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigateCategory(product.category);
              }}
              className="hover:text-zinc-900 underline underline-offset-2"
            >
              {categoryInfo?.name}
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng chi tiết sản phẩm"
            className="p-2 text-zinc-500 hover:text-zinc-900 rounded-md hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contiguous Purchase Module: Gallery Left + Purchase Module Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-6 bg-stone-100 flex items-center justify-center p-6">
            <div className="w-full rounded-lg overflow-hidden border border-stone-200/80 bg-white">
              <ProductImage
                src={product.image}
                alt={product.name}
                aspectRatioClass="aspect-[4/3]"
              />
            </div>
          </div>

          <div className="lg:col-span-6 p-6 md:p-8 bg-white flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                <span>{product.brand}</span>
                <span aria-hidden="true">·</span>
                <span>{product.scale}</span>
                <span aria-hidden="true">·</span>
                <span className="font-medium text-zinc-800">{product.availability}</span>
              </div>

              <h2 className="text-2xl font-bold text-zinc-900 leading-tight">
                {product.name}
              </h2>

              <div className="mt-4 pb-4 border-b border-stone-200 flex items-baseline justify-between">
                <span className="text-2xl font-mono font-semibold text-zinc-900 tabular-nums">
                  {formatVND(product.price)}
                </span>
                <span className="text-xs text-zinc-500 tabular-nums">
                  Còn {product.stock} sản phẩm trong kho
                </span>
              </div>

              <p className="mt-4 text-sm text-zinc-600 leading-relaxed">
                {product.description}
              </p>

              {/* Technical Specifications Table */}
              <dl className="mt-5 pt-4 border-t border-stone-200 grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                <div>
                  <dt className="text-zinc-500">Tỉ lệ & Chiều cao</dt>
                  <dd className="font-medium text-zinc-900 mt-0.5 tabular-nums">
                    {product.scale} ({product.height})
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Chất liệu chế tác</dt>
                  <dd className="font-medium text-zinc-900 mt-0.5">{product.material}</dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Nghệ nhân điêu khắc</dt>
                  <dd className="font-medium text-zinc-900 mt-0.5">{product.sculptor}</dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Năm phát hành</dt>
                  <dd className="font-mono font-medium text-zinc-900 mt-0.5 tabular-nums">
                    {product.releaseYear}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Purchase Controls */}
            <div className="pt-4 border-t border-stone-200 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-medium text-zinc-700">Số lượng đặt mua</span>
                <div className="flex items-center border border-stone-300 rounded-md bg-[#FAF9F6]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 text-zinc-700 hover:bg-stone-200 transition-colors"
                    aria-label="Giảm số lượng"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-sm font-mono font-medium tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="p-2 text-zinc-700 hover:bg-stone-200 transition-colors"
                    aria-label="Tăng số lượng"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={product.stock <= 0}
                  onClick={handleAdd}
                  className="py-2.5 px-4 text-xs font-semibold text-zinc-900 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-md transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {addedFeedback ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-700" />
                      <span>Đã thêm vào giỏ</span>
                    </>
                  ) : (
                    <span>Thêm vào giỏ hàng</span>
                  )}
                </button>
                <button
                  type="button"
                  disabled={product.stock <= 0}
                  onClick={() => {
                    onBuyNow(product, quantity);
                    onClose();
                  }}
                  className="py-2.5 px-4 text-xs font-semibold text-white bg-[#C83E2B] hover:bg-[#b03220] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Mua ngay · {formatVND(product.price * quantity)}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
