import React from 'react';
import { CATEGORIES, formatVND } from '../data/initialData';
import { CategorySlug, Product } from '../types/store';
import { ProductImage } from './ProductImage';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onNavigateCategory?: (slug: CategorySlug) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onAddToCart,
  onNavigateCategory,
}) => {
  const categoryInfo = CATEGORIES.find((c) => c.slug === product.category);

  return (
    <article className="group bg-white border border-stone-200/90 rounded-lg overflow-hidden flex flex-col transition-transform duration-150 ease-out hover:-translate-y-0.5">
      <div
        onClick={() => onSelectProduct(product)}
        className="cursor-pointer relative"
      >
        <ProductImage
          src={product.image}
          alt={product.name}
          aspectRatioClass="aspect-[4/3]"
        />
      </div>

      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          {/* Unboxed clean metadata with typographic separators */}
          <div className="flex items-center flex-wrap gap-1.5 text-xs text-zinc-500 mb-1.5">
            {onNavigateCategory && categoryInfo ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateCategory(product.category);
                }}
                className="hover:text-zinc-900 underline-offset-2 hover:underline transition-colors whitespace-nowrap shrink-0"
              >
                {categoryInfo.shortName}
              </button>
            ) : (
              <span>{categoryInfo?.shortName || product.category}</span>
            )}
            <span aria-hidden="true">·</span>
            <span>{product.scale}</span>
            <span aria-hidden="true">·</span>
            <span
              className={
                product.availability === 'Có sẵn'
                  ? 'text-zinc-700 font-medium'
                  : 'text-amber-800 font-medium'
              }
            >
              {product.availability}
            </span>
          </div>

          <h3
            onClick={() => onSelectProduct(product)}
            className="text-base font-semibold text-zinc-900 leading-snug cursor-pointer hover:text-[#C83E2B] transition-colors line-clamp-2"
          >
            {product.name}
          </h3>

          <p className="text-xs text-zinc-500 mt-1">
            {product.brand} · Cao {product.height}
          </p>
        </div>

        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
          <div>
            <span className="block text-[15px] font-mono font-semibold text-zinc-900 tabular-nums">
              {formatVND(product.price)}
            </span>
            <span className="block text-[11px] text-zinc-500 tabular-nums">
              Kho: {product.stock} bản
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onSelectProduct(product)}
              className="px-3 py-2 text-xs font-medium text-zinc-700 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors whitespace-nowrap shrink-0"
            >
              Chi tiết
            </button>
            <button
              type="button"
              disabled={product.stock <= 0}
              onClick={() => onAddToCart(product, 1)}
              className="px-3.5 py-2 text-xs font-medium text-white bg-zinc-900 hover:bg-[#C83E2B] disabled:bg-stone-300 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {product.stock > 0 ? 'Thêm giỏ' : 'Hết hàng'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
