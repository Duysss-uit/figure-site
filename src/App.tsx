/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { ShoppingBag, ChevronDown, ShieldCheck } from 'lucide-react';
import {
  CATEGORIES as INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  fetchExternalCatalog,
} from './data/initialData';
import {
  CartItem,
  CategoryInfo,
  CategorySlug,
  Order,
  OrderStatus,
  PageRoute,
  Product,
  UserAccount,
} from './types/store';
import { HomePage } from './app/home/page';
import { FigureDirectoryPage } from './app/figure/page';
import { CategoryPage } from './app/category/page';
import { AccountPage } from './app/account/page';
import { CheckoutPage } from './app/checkout/page';
import { INITIAL_USERS, LoginPage } from './app/login/page';
import { ForgotPasswordPage } from './app/forgot-password/page';
import { AdminPage } from './app/admin/page';
import { ProductDetailModal } from './components/ProductDetailModal';

const STORAGE_KEYS = {
  CATEGORIES: 'figure_categories_v4',
  PRODUCTS: 'figure_products_v4',
  CART: 'figure_cart_v4',
  ORDERS: 'figure_orders_v4',
  USERS: 'figure_users_v4',
  CURRENT_USER: 'figure_current_user_v4',
};

export default function App() {
  const [route, setRoute] = useState<PageRoute>({ page: 'home' });
  const [figureDropdownOpen, setFigureDropdownOpen] = useState(false);

  const [categories, setCategories] = useState<CategoryInfo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_CATEGORIES;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      { product: INITIAL_PRODUCTS[0], quantity: 1 },
      { product: INITIAL_PRODUCTS[1], quantity: 1 },
    ];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_ORDERS;
  });

  const [users, setUsers] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  const [selectedProductModal, setSelectedProductModal] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Automatic Admin Detection strictly from returned user account's isAdmin boolean
  const isAdmin = Boolean(currentUser?.isAdmin);

  // Load external /catalog/products.json and /catalog/users.json on mount
  useEffect(() => {
    const hasCustomProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!hasCustomProducts) {
      fetchExternalCatalog()
        .then((data) => {
          if (Array.isArray(data.categories) && data.categories.length > 0) {
            setCategories(data.categories);
          }
          if (Array.isArray(data.products) && data.products.length > 0) {
            setProducts(data.products);
          }
        })
        .catch(() => {
          // fallback already loaded
        });
    }

    const hasCustomUsers = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!hasCustomUsers) {
      fetch('/catalog/users.json', { cache: 'no-store' })
        .then((res) => (res.ok ? res.json() : null))
        .then((userData) => {
          if (Array.isArray(userData) && userData.length > 0) {
            setUsers(userData);
          }
        })
        .catch(() => {
          // fallback already loaded
        });
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch {
      // ignore
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch {
      // ignore
    }
  }, [users]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  // Redirect away from Admin page if not an Admin
  useEffect(() => {
    if (route.page === 'admin' && !isAdmin) {
      setRoute({ page: 'home' });
    }
  }, [route.page, isAdmin]);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const handleReloadFromPublicJson = () => {
    fetchExternalCatalog()
      .then((data) => {
        setCategories(data.categories);
        setProducts(data.products);
        localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
        localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
        showToast('Đã nạp lại dữ liệu gốc từ /catalog/products.json');
      })
      .catch(() => {
        setCategories(INITIAL_CATEGORIES);
        setProducts(INITIAL_PRODUCTS);
        showToast('Đã khôi phục dữ liệu từ file products.json');
      });
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((i) => i.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const nextQty = Math.min(
          product.stock,
          updated[existingIndex].quantity + quantity
        );
        updated[existingIndex] = { product, quantity: nextQty };
        return updated;
      }
      return [...prev, { product, quantity: Math.min(product.stock, quantity) }];
    });
    showToast(`Đã thêm "${product.name}" vào giỏ hàng`);
  };

  const handleBuyNow = (product: Product, quantity: number) => {
    handleAddToCart(product, quantity);
    setRoute({ page: 'checkout' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handlePlaceOrder = (
    orderData: Omit<Order, 'id' | 'createdAt' | 'status'>
  ) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const timeStr = now.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const newOrderId = `FG-${Math.floor(1050 + orders.length + Math.random() * 90)}`;

    const newOrder: Order = {
      ...orderData,
      id: newOrderId,
      createdAt: `${dateStr} · ${timeStr}`,
      status: 'Đang chuẩn bị giao',
    };

    setProducts((prev) =>
      prev.map((prod) => {
        const orderedItem = orderData.items.find((i) => i.product.id === prod.id);
        if (!orderedItem) return prod;
        return {
          ...prod,
          stock: Math.max(0, prod.stock - orderedItem.quantity),
        };
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);

    if (currentUser) {
      setRoute({
        page: 'account',
        tab: 'orders-cart',
        highlightOrderId: newOrderId,
      });
    } else {
      showToast(`Đặt hàng thành công! Mã đơn #${newOrderId}`);
      setRoute({ page: 'home' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'Đã hủy' } : o))
    );
    showToast(`Đã hủy đơn hàng #${orderId}`);
  };

  const handleAddProduct = (newProductData: Omit<Product, 'id'>) => {
    const created: Product = {
      ...newProductData,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [created, ...prev]);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCart((prev) => prev.filter((c) => c.product.id !== productId));
  };

  const handleUpdateStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
    );
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const handleResetPasswordByEmail = (
    email: string,
    newPassword: string
  ): boolean => {
    const normalized = email.trim().toLowerCase();
    const exists = users.some((u) => u.email.toLowerCase() === normalized);
    if (!exists) return false;

    setUsers((prev) =>
      prev.map((u) =>
        u.email.toLowerCase() === normalized
          ? { ...u, password: newPassword }
          : u
      )
    );

    if (currentUser && currentUser.email.toLowerCase() === normalized) {
      setCurrentUser({ ...currentUser, password: newPassword });
    }
    return true;
  };

  const handleUpdateUserProfile = (updated: UserAccount) => {
    setCurrentUser(updated);
    setUsers((prev) =>
      prev.map((u) => (u.id === updated.id ? updated : u))
    );
  };

  const navigateToCategory = (slug: CategorySlug) => {
    setFigureDropdownOpen(false);
    setRoute({ page: 'category', slug });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-zinc-900">
      {/* Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-stone-200">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
          {/* Zone 1: Brand Wordmark ("Figure") */}
          <button
            type="button"
            onClick={() => {
              setRoute({ page: 'home' });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="font-display text-xl font-bold tracking-tight text-zinc-900 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Figure
          </button>

          {/* Zone 2: Primary Navigation (Admin link ONLY rendered if currentUser.isAdmin === true) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-600">
            <button
              type="button"
              onClick={() => {
                setRoute({ page: 'home' });
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`hover:text-zinc-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                route.page === 'home'
                  ? 'text-zinc-900 font-semibold underline decoration-2 decoration-[#C83E2B] underline-offset-8'
                  : ''
              }`}
            >
              Trang chủ
            </button>

            {/* Figure Link + Dropdown of Toy Categories */}
            <div
              className="relative"
              onMouseEnter={() => setFigureDropdownOpen(true)}
              onMouseLeave={() => setFigureDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => {
                  setRoute({ page: 'figure-directory' });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center gap-1 hover:text-zinc-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 ${
                  route.page === 'figure-directory' || route.page === 'category'
                    ? 'text-zinc-900 font-semibold underline decoration-2 decoration-[#C83E2B] underline-offset-8'
                    : ''
                }`}
              >
                <span>Figure</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {figureDropdownOpen && (
                <div className="absolute left-0 top-full pt-2 w-64 z-50">
                  <div className="bg-white border border-stone-200 rounded-lg shadow-lg py-2 divide-y divide-stone-100">
                    <div className="px-3.5 py-2">
                      <button
                        type="button"
                        onClick={() => {
                          setFigureDropdownOpen(false);
                          setRoute({ page: 'figure-directory' });
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full text-left text-xs font-bold text-[#C83E2B] hover:underline cursor-pointer"
                      >
                        Danh sách tất cả thể loại đồ chơi →
                      </button>
                    </div>
                    <div className="py-1">
                      {categories.map((cat) => (
                        <button
                          key={cat.slug}
                          type="button"
                          onClick={() => navigateToCategory(cat.slug)}
                          className="w-full text-left px-3.5 py-2 text-xs text-zinc-700 hover:bg-stone-100 hover:text-zinc-900 flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <span className="font-medium">{cat.shortName}</span>
                          <span className="text-[11px] font-mono text-zinc-400">
                            {products.filter((p) => p.category === cat.slug).length}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {categories.slice(0, 3).map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => navigateToCategory(cat.slug)}
                className={`hover:text-zinc-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  route.page === 'category' && route.slug === cat.slug
                    ? 'text-zinc-900 font-semibold underline decoration-2 decoration-[#C83E2B] underline-offset-8'
                    : ''
                }`}
              >
                {cat.shortName}
              </button>
            ))}

            {/* Automatically shown ONLY when logged-in user has isAdmin === true */}
            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  setRoute({ page: 'admin' });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center gap-1 text-[#C83E2B] hover:text-zinc-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer font-semibold ${
                  route.page === 'admin'
                    ? 'underline decoration-2 decoration-[#C83E2B] underline-offset-8'
                    : ''
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin</span>
              </button>
            )}
          </nav>

          {/* Zone 3: Top-Right Auth / Cart + Avatar */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-3">
                {/* Cart Icon next to User Avatar -> Leads directly to Orders/Cart inside Account Page */}
                <button
                  type="button"
                  onClick={() => {
                    setRoute({ page: 'account', tab: 'orders-cart' });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  title="Giỏ hàng & Đơn hàng của tôi"
                  aria-label="Giỏ hàng và Đơn hàng"
                  className="relative p-2 text-zinc-800 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[#C83E2B] text-white text-[10px] font-mono font-bold rounded-full flex items-center justify-center tabular-nums">
                    {totalCartCount}
                  </span>
                </button>

                {/* User Avatar Link -> Leads to Account Page */}
                <button
                  type="button"
                  onClick={() => {
                    setRoute({ page: 'account', tab: 'profile' });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  title={`Tài khoản: ${currentUser.name}`}
                  className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border border-stone-200 hover:border-zinc-900 bg-[#FAF9F6] transition-colors cursor-pointer"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover bg-stone-200"
                  />
                  <span className="text-xs font-semibold text-zinc-800 max-w-[110px] truncate hidden sm:inline">
                    {currentUser.name}
                  </span>
                </button>
              </div>
            ) : (
              /* Not logged in: Show Login / Register Link */
              <button
                type="button"
                onClick={() => {
                  setRoute({ page: 'login', initialMode: 'login' });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-zinc-900 hover:bg-[#C83E2B] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Đăng nhập / Đăng ký
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Secondary Navigation */}
      <div className="md:hidden bg-white border-b border-stone-200 px-4 py-2 flex items-center justify-between gap-2 overflow-x-auto text-xs font-medium text-zinc-600">
        <button
          type="button"
          onClick={() => setRoute({ page: 'home' })}
          className={`px-2.5 py-1 rounded whitespace-nowrap shrink-0 ${
            route.page === 'home' ? 'bg-stone-100 text-zinc-900 font-semibold' : ''
          }`}
        >
          Trang chủ
        </button>
        <button
          type="button"
          onClick={() => setRoute({ page: 'figure-directory' })}
          className={`px-2.5 py-1 rounded whitespace-nowrap shrink-0 ${
            route.page === 'figure-directory' ? 'bg-stone-100 text-zinc-900 font-semibold' : ''
          }`}
        >
          Figure (Thể loại)
        </button>
        {categories.slice(0, 2).map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => navigateToCategory(c.slug)}
            className={`px-2.5 py-1 rounded whitespace-nowrap shrink-0 ${
              route.page === 'category' && route.slug === c.slug
                ? 'bg-stone-100 text-zinc-900 font-semibold'
                : ''
            }`}
          >
            {c.shortName}
          </button>
        ))}
        {isAdmin && (
          <button
            type="button"
            onClick={() => setRoute({ page: 'admin' })}
            className={`px-2.5 py-1 rounded whitespace-nowrap shrink-0 text-[#C83E2B] font-semibold ${
              route.page === 'admin' ? 'bg-stone-100' : ''
            }`}
          >
            Admin
          </button>
        )}
      </div>

      {/* Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-zinc-900 text-white px-4 py-3 rounded-lg shadow-lg border border-zinc-700 flex items-center gap-3 text-xs font-medium">
          <span>{toastMessage}</span>
          {currentUser ? (
            <button
              type="button"
              onClick={() => {
                setToastMessage(null);
                setRoute({ page: 'account', tab: 'orders-cart' });
              }}
              className="text-[#ff8a7a] font-semibold underline underline-offset-2 whitespace-nowrap cursor-pointer"
            >
              Mở Giỏ hàng & Đơn hàng
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setToastMessage(null);
                setRoute({ page: 'login' });
              }}
              className="text-[#ff8a7a] font-semibold underline underline-offset-2 whitespace-nowrap cursor-pointer"
            >
              Đăng nhập để xem giỏ
            </button>
          )}
        </div>
      )}

      {/* Main Content Router */}
      <main className="flex-1">
        {route.page === 'home' && (
          <HomePage
            products={products}
            onSelectProduct={(prod) => setSelectedProductModal(prod)}
            onAddToCart={handleAddToCart}
            onNavigateCategory={navigateToCategory}
            onNavigateFigureDirectory={() => {
              setRoute({ page: 'figure-directory' });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {route.page === 'figure-directory' && (
          <FigureDirectoryPage
            products={products}
            onSelectCategory={navigateToCategory}
            onSelectProduct={(prod) => setSelectedProductModal(prod)}
            onAddToCart={handleAddToCart}
          />
        )}

        {route.page === 'category' && (
          <CategoryPage
            activeSlug={route.slug}
            products={products}
            onSelectCategory={navigateToCategory}
            onSelectProduct={(prod) => setSelectedProductModal(prod)}
            onAddToCart={handleAddToCart}
            onBackToShop={() => setRoute({ page: 'figure-directory' })}
          />
        )}

        {route.page === 'account' && (
          currentUser ? (
            <AccountPage
              currentUser={currentUser}
              initialTab={route.tab}
              highlightOrderId={route.highlightOrderId}
              cart={cart}
              orders={orders}
              onUpdateCartQuantity={handleUpdateCartQuantity}
              onRemoveCartItem={handleRemoveCartItem}
              onClearCart={handleClearCart}
              onProceedToCheckout={() => {
                setRoute({ page: 'checkout' });
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onCancelOrder={handleCancelOrder}
              onUpdateUserProfile={handleUpdateUserProfile}
              onLogout={() => {
                setCurrentUser(null);
                setRoute({ page: 'home' });
                showToast('Đã đăng xuất tài khoản');
              }}
              onNavigateHome={() => setRoute({ page: 'home' })}
              onNavigateAdmin={() => {
                if (isAdmin) setRoute({ page: 'admin' });
              }}
            />
          ) : (
            <LoginPage
              users={users}
              onLogin={(user) => {
                setCurrentUser(user);
                if (user.isAdmin) {
                  setRoute({ page: 'admin' });
                  showToast(`Xin chào Admin ${user.name}!`);
                } else {
                  setRoute({ page: 'account', tab: 'orders-cart' });
                  showToast(`Xin chào, ${user.name}!`);
                }
              }}
              onRegisterUser={(newUser) => {
                setUsers((prev) => [...prev, newUser]);
                setCurrentUser(newUser);
                setRoute({ page: 'account', tab: 'orders-cart' });
                showToast(`Đăng ký thành công! Xin chào ${newUser.name}`);
              }}
              onNavigateForgotPassword={(emailPrefill) =>
                setRoute({ page: 'forgot-password', emailPrefill })
              }
            />
          )
        )}

        {route.page === 'checkout' && (
          <CheckoutPage
            cart={cart}
            currentUser={currentUser}
            onPlaceOrder={handlePlaceOrder}
            onBackToCart={() => {
              if (currentUser) {
                setRoute({ page: 'account', tab: 'orders-cart' });
              } else {
                setRoute({ page: 'login' });
              }
            }}
            onNavigateHome={() => setRoute({ page: 'home' })}
          />
        )}

        {route.page === 'login' && (
          <LoginPage
            users={users}
            initialMode={route.initialMode}
            onLogin={(user) => {
              setCurrentUser(user);
              // Automatically display Admin page if returned user has isAdmin === true
              if (user.isAdmin) {
                setRoute({ page: 'admin' });
                showToast(`Đã nhận diện tài khoản Admin: ${user.name}`);
              } else {
                setRoute({ page: 'home' });
                showToast(`Xin chào, ${user.name}!`);
              }
            }}
            onRegisterUser={(newUser) => {
              setUsers((prev) => [...prev, newUser]);
              setCurrentUser(newUser);
              setRoute({ page: 'home' });
              showToast(`Đăng ký thành công! Xin chào ${newUser.name}`);
            }}
            onNavigateForgotPassword={(emailPrefill) => {
              setRoute({ page: 'forgot-password', emailPrefill });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {route.page === 'forgot-password' && (
          <ForgotPasswordPage
            users={users}
            initialEmail={route.emailPrefill}
            onResetPasswordSubmit={handleResetPasswordByEmail}
            onBackToLogin={() => setRoute({ page: 'login', initialMode: 'login' })}
          />
        )}

        {/* Strictly guard AdminPage: Only render if currentUser.isAdmin === true */}
        {route.page === 'admin' && isAdmin && currentUser && (
          <AdminPage
            categories={categories}
            products={products}
            orders={orders}
            currentUser={currentUser}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateStock={handleUpdateStock}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onImportCatalogJson={(data) => {
              setCategories(data.categories);
              setProducts(data.products);
            }}
            onReloadFromPublicJson={handleReloadFromPublicJson}
            onNavigateShop={() => setRoute({ page: 'home' })}
          />
        )}
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductModal}
        onClose={() => setSelectedProductModal(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onNavigateCategory={navigateToCategory}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 mt-16">
        <div className="max-w-[1280px] mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-12 gap-8 text-xs text-zinc-600">
          <div className="md:col-span-5 space-y-2">
            <p className="font-display text-base font-bold text-zinc-900">
              Figure — Cửa Hàng Figure & Đồ Chơi Sưu Tầm
            </p>
            <p className="leading-relaxed max-w-sm">
              Hệ thống trưng bày và phân phối Anime Figure, mô hình lắp ráp Gundam, Scale Figure 1/7, Nendoroid và Art Toy chính hãng.
            </p>
          </div>

          <div className="md:col-span-4 space-y-2">
            <p className="font-semibold text-zinc-900">
              Danh mục thể loại trong trang Figure
            </p>
            <ul className="space-y-1.5">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <button
                    type="button"
                    onClick={() => navigateToCategory(cat.slug)}
                    className="hover:text-[#C83E2B] hover:underline underline-offset-2 cursor-pointer"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3 space-y-2">
            <p className="font-semibold text-zinc-900">Tài khoản & Mua sắm</p>
            <ul className="space-y-1.5">
              <li>
                <button
                  type="button"
                  onClick={() => setRoute({ page: 'figure-directory' })}
                  className="hover:text-zinc-900 hover:underline underline-offset-2 cursor-pointer"
                >
                  Trang tổng hợp Figure
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    setRoute(
                      currentUser
                        ? { page: 'account', tab: 'orders-cart' }
                        : { page: 'login' }
                    )
                  }
                  className="hover:text-zinc-900 hover:underline underline-offset-2 cursor-pointer"
                >
                  Giỏ hàng & Đơn hàng của tôi
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setRoute({ page: 'checkout' })}
                  className="hover:text-zinc-900 hover:underline underline-offset-2 cursor-pointer"
                >
                  Trang Thanh toán
                </button>
              </li>
              {isAdmin && (
                <li>
                  <button
                    type="button"
                    onClick={() => setRoute({ page: 'admin' })}
                    className="text-[#C83E2B] font-semibold hover:underline underline-offset-2 cursor-pointer"
                  >
                    Trang Admin đăng hàng
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
