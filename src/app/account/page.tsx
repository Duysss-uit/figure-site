import React, { useEffect, useState } from 'react';
import {
  ShoppingBag,
  User,
  KeyRound,
  LogOut,
  Trash2,
  Minus,
  Plus,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { CATEGORIES, formatVND } from '../../data/initialData';
import {
  AccountSectionTab,
  CartItem,
  Order,
  OrderStatus,
  UserAccount,
} from '../../types/store';
import { ProductImage } from '../../components/ProductImage';

interface AccountPageProps {
  currentUser: UserAccount;
  initialTab?: AccountSectionTab;
  highlightOrderId?: string;
  cart: CartItem[];
  orders: Order[];
  onUpdateCartQuantity: (productId: string, quantity: number) => void;
  onRemoveCartItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  onCancelOrder: (orderId: string) => void;
  onUpdateUserProfile: (updated: UserAccount) => void;
  onLogout: () => void;
  onNavigateHome: () => void;
  onNavigateAdmin: () => void;
}

const AVATAR_PRESETS = [
  'https://api.dicebear.com/9.x/notionists/svg?seed=KurokawaCollector',
  'https://api.dicebear.com/9.x/notionists/svg?seed=GundamPilot',
  'https://api.dicebear.com/9.x/notionists/svg?seed=SakuraBlade',
  'https://api.dicebear.com/9.x/notionists/svg?seed=ArtToyCurator',
];

export const AccountPage: React.FC<AccountPageProps> = ({
  currentUser,
  initialTab = 'orders-cart',
  highlightOrderId,
  cart,
  orders,
  onUpdateCartQuantity,
  onRemoveCartItem,
  onClearCart,
  onProceedToCheckout,
  onCancelOrder,
  onUpdateUserProfile,
  onLogout,
  onNavigateHome,
  onNavigateAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<AccountSectionTab>(initialTab);
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | OrderStatus>('all');

  // Profile Form State
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [city, setCity] = useState(currentUser.city || 'TP. Hồ Chí Minh');
  const [district, setDistrict] = useState(currentUser.district || 'Quận 1');
  const [address, setAddress] = useState(currentUser.address);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [profileSavedMsg, setProfileSavedMsg] = useState<string | null>(null);

  // Reset Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordFeedback, setPasswordFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredOrders = orders.filter((o) =>
    orderStatusFilter === 'all' ? true : o.status === orderStatusFilter
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUserProfile({
      ...currentUser,
      name: name.trim() || currentUser.name,
      email: email.trim() || currentUser.email,
      phone: phone.trim() || currentUser.phone,
      city: city.trim(),
      district: district.trim(),
      address: address.trim(),
      avatar: avatar.trim() || currentUser.avatar,
    });
    setProfileSavedMsg('Đã lưu thông tin cá nhân thành công!');
    setTimeout(() => setProfileSavedMsg(null), 3500);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim() || newPassword.length < 6) {
      setPasswordFeedback({
        type: 'error',
        text: 'Mật khẩu mới cần có ít nhất 6 ký tự.',
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordFeedback({
        type: 'error',
        text: 'Mật khẩu xác nhận không trùng khớp.',
      });
      return;
    }
    onUpdateUserProfile({
      ...currentUser,
      password: newPassword,
    });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordFeedback({
      type: 'success',
      text: 'Đã đặt lại (Reset) mật khẩu mới cho tài khoản của bạn thành công!',
    });
    setTimeout(() => setPasswordFeedback(null), 4000);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Account Navigation Sidebar */}
        <aside className="lg:col-span-3 bg-white border border-stone-200 rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-3.5 pb-5 border-b border-stone-200">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-full border border-stone-300 bg-stone-100 object-cover shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-bold text-zinc-900 truncate">
                {currentUser.name}
              </p>
              <p className="text-xs text-zinc-500 font-mono truncate">
                {currentUser.email}
              </p>
              <p className="text-[11px] font-medium text-[#C83E2B] mt-0.5">
                {currentUser.isAdmin ? 'Quản trị viên (Admin)' : 'Thành viên Sưu tầm'}
              </p>
            </div>
          </div>

          <nav className="space-y-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('orders-cart')}
              className={`w-full px-3.5 py-2.5 text-xs font-medium rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === 'orders-cart'
                  ? 'bg-zinc-900 text-white font-semibold'
                  : 'text-zinc-700 hover:bg-stone-100'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4" />
                <span>Giỏ hàng & Đơn hàng</span>
              </span>
              <span className="font-mono text-[11px] tabular-nums">
                {totalCartItems} giỏ · {orders.length} đơn
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`w-full px-3.5 py-2.5 text-xs font-medium rounded-lg flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-zinc-900 text-white font-semibold'
                  : 'text-zinc-700 hover:bg-stone-100'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Thông tin cá nhân</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reset-password')}
              className={`w-full px-3.5 py-2.5 text-xs font-medium rounded-lg flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === 'reset-password'
                  ? 'bg-zinc-900 text-white font-semibold'
                  : 'text-zinc-700 hover:bg-stone-100'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Reset / Đổi mật khẩu</span>
            </button>

            {currentUser.isAdmin && (
              <button
                type="button"
                onClick={onNavigateAdmin}
                className="w-full px-3.5 py-2.5 text-xs font-medium rounded-lg flex items-center gap-2.5 text-[#C83E2B] hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Trang Admin Đăng Hàng</span>
              </button>
            )}
          </nav>

          <div className="pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onLogout}
              className="w-full px-3.5 py-2.5 text-xs font-medium text-red-700 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất tài khoản</span>
            </button>
          </div>
        </aside>

        {/* Right Content Area */}
        <div className="lg:col-span-9 space-y-10">
          {/* TAB 1: GIỎ HÀNG & ĐƠN HÀNG */}
          {activeTab === 'orders-cart' && (
            <div className="space-y-10">
              {/* Post-checkout Order Confirmation Notice */}
              {highlightOrderId && (
                <div className="bg-white border border-zinc-900 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <h2 className="text-sm font-bold text-zinc-900">
                        Đặt hàng thành công! Mã vận đơn #{highlightOrderId} đã được ghi nhận
                      </h2>
                      <p className="text-xs text-zinc-600 mt-0.5">
                        Đơn hàng của bạn đã được chuyển xuống danh sách Đơn hàng bên dưới và đang được chuẩn bị đóng gói chống sốc.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Part A: Shopping Cart inside Account Page */}
              <section className="bg-white border border-stone-200 rounded-xl p-6 md:p-7 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4">
                  <div>
                    <p className="text-xs text-zinc-500">
                      Tài khoản / Giỏ hàng hiện tại ({totalCartItems} vật phẩm)
                    </p>
                    <h1 className="text-xl md:text-2xl font-bold text-zinc-900 mt-0.5">
                      Giỏ Hàng Của Tôi
                    </h1>
                  </div>

                  {cart.length > 0 && (
                    <button
                      type="button"
                      onClick={onClearCart}
                      className="text-xs font-medium text-zinc-500 hover:text-red-700 underline underline-offset-4 cursor-pointer"
                    >
                      Làm trống giỏ hàng
                    </button>
                  )}
                </div>

                {cart.length === 0 ? (
                  <div className="py-8 text-center space-y-3">
                    <p className="text-sm font-semibold text-zinc-900">
                      Giỏ hàng của bạn hiện đang trống.
                    </p>
                    <p className="text-xs text-zinc-500">
                      Hãy chọn thêm các mẫu Anime Figure, Gundam hoặc Art Toy để tiến hành thanh toán.
                    </p>
                    <button
                      type="button"
                      onClick={onNavigateHome}
                      className="px-4 py-2 text-xs font-semibold text-white bg-zinc-900 hover:bg-[#C83E2B] rounded-md transition-colors cursor-pointer"
                    >
                      Khám phá mặt hàng trên Trang chủ
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="divide-y divide-stone-200">
                      {cart.map(({ product, quantity }) => {
                        const cat = CATEGORIES.find((c) => c.slug === product.category);
                        return (
                          <div
                            key={product.id}
                            className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-20 shrink-0 rounded-md overflow-hidden border border-stone-200">
                                <ProductImage
                                  src={product.image}
                                  alt={product.name}
                                  aspectRatioClass="aspect-[4/3]"
                                />
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                                  <span className="font-mono">{product.sku}</span>
                                  <span aria-hidden="true">·</span>
                                  <span>{cat?.shortName}</span>
                                  <span aria-hidden="true">·</span>
                                  <span>{product.scale}</span>
                                </div>
                                <h3 className="text-sm font-semibold text-zinc-900 leading-snug">
                                  {product.name}
                                </h3>
                                <p className="text-xs font-mono text-zinc-600 tabular-nums">
                                  Đơn giá: {formatVND(product.price)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                              <div className="flex items-center border border-stone-300 rounded-md bg-[#FAF9F6]">
                                <button
                                  type="button"
                                  onClick={() =>
                                    onUpdateCartQuantity(product.id, quantity - 1)
                                  }
                                  className="p-1.5 text-zinc-700 hover:bg-stone-200 transition-colors"
                                  aria-label="Giảm số lượng"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="px-3 text-xs font-mono font-medium tabular-nums">
                                  {quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    onUpdateCartQuantity(
                                      product.id,
                                      Math.min(product.stock, quantity + 1)
                                    )
                                  }
                                  className="p-1.5 text-zinc-700 hover:bg-stone-200 transition-colors"
                                  aria-label="Tăng số lượng"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <span className="text-sm font-mono font-semibold text-zinc-900 tabular-nums min-w-[110px] text-right">
                                {formatVND(product.price * quantity)}
                              </span>

                              <button
                                type="button"
                                onClick={() => onRemoveCartItem(product.id)}
                                aria-label="Xóa sản phẩm"
                                className="p-1.5 text-zinc-400 hover:text-red-700 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-5 border-t border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-xs text-zinc-500 block">
                          Tạm tính ({totalCartItems} sản phẩm trong giỏ):
                        </span>
                        <span className="text-xl font-mono font-bold text-[#C83E2B] tabular-nums">
                          {formatVND(cartSubtotal)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={onNavigateHome}
                          className="px-4 py-2.5 text-xs font-semibold text-zinc-700 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors cursor-pointer"
                        >
                          Chọn thêm hàng
                        </button>
                        <button
                          type="button"
                          onClick={onProceedToCheckout}
                          className="flex-1 sm:flex-initial px-6 py-2.5 text-xs font-semibold text-white bg-[#C83E2B] hover:bg-[#b03220] rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Tiến hành Thanh toán</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </section>

              {/* Part B: Orders History inside Account Page */}
              <section className="bg-white border border-stone-200 rounded-xl p-6 md:p-7 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4">
                  <div>
                    <p className="text-xs text-zinc-500">
                      Tài khoản / Lịch sử đơn hàng ({orders.length} đơn)
                    </p>
                    <h2 className="text-xl md:text-2xl font-bold text-zinc-900 mt-0.5">
                      Đơn Hàng Đã Đặt
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-200/70 rounded-lg">
                    {(
                      [
                        'all',
                        'Đang chuẩn bị giao',
                        'Đang vận chuyển',
                        'Đã hoàn tất',
                        'Đã hủy',
                      ] as const
                    ).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setOrderStatusFilter(st)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          orderStatusFilter === st
                            ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                            : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                      >
                        {st === 'all' ? 'Tất cả' : st}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredOrders.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-6 text-center">
                    Chưa có đơn hàng nào ở trạng thái này.
                  </p>
                ) : (
                  <div className="space-y-5">
                    {filteredOrders.map((order) => (
                      <article
                        key={order.id}
                        className={`border rounded-xl overflow-hidden ${
                          order.id === highlightOrderId
                            ? 'border-zinc-900'
                            : 'border-stone-200'
                        }`}
                      >
                        <div className="px-5 py-3.5 bg-[#FAF9F6] border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex flex-wrap items-center gap-2 text-zinc-600">
                            <span className="font-mono font-bold text-zinc-900">
                              #{order.id}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums">
                              {order.createdAt}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{order.paymentMethod}</span>
                            <span aria-hidden="true">·</span>
                            <span
                              className={`font-semibold ${
                                order.status === 'Đã hoàn tất'
                                  ? 'text-emerald-800'
                                  : order.status === 'Đã hủy'
                                  ? 'text-red-700'
                                  : 'text-[#C83E2B]'
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="font-mono font-bold text-zinc-900 tabular-nums">
                              Tổng: {formatVND(order.total)}
                            </span>
                            {order.status === 'Đang chuẩn bị giao' && (
                              <button
                                type="button"
                                onClick={() => onCancelOrder(order.id)}
                                className="text-zinc-500 hover:text-red-700 underline underline-offset-2 cursor-pointer"
                              >
                                Hủy đơn
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-6">
                          <div className="md:col-span-8 space-y-3">
                            {order.items.map(({ product, quantity }) => (
                              <div
                                key={product.id}
                                className="flex items-center justify-between gap-4 pb-3 border-b border-stone-100 last:border-b-0 last:pb-0"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-14 rounded overflow-hidden border border-stone-200 shrink-0">
                                    <ProductImage
                                      src={product.image}
                                      alt={product.name}
                                      aspectRatioClass="aspect-[4/3]"
                                    />
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-zinc-900">
                                      {product.name}
                                    </p>
                                    <p className="text-[11px] font-mono text-zinc-500 tabular-nums">
                                      {formatVND(product.price)} × {quantity}
                                    </p>
                                  </div>
                                </div>
                                <span className="text-xs font-mono font-semibold text-zinc-900 tabular-nums shrink-0">
                                  {formatVND(product.price * quantity)}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="md:col-span-4 md:border-l md:border-stone-200 md:pl-5 space-y-1.5 text-xs">
                            <p className="font-semibold text-zinc-900">
                              Địa chỉ giao nhận
                            </p>
                            <p className="text-zinc-800 font-medium">
                              {order.customerName} ·{' '}
                              <span className="font-mono">{order.phone}</span>
                            </p>
                            <p className="text-zinc-600 leading-relaxed">
                              {order.address}
                              {order.district ? `, ${order.district}` : ''}
                              {order.city ? `, ${order.city}` : ''}
                            </p>
                            {order.note && (
                              <p className="text-zinc-500 italic">
                                Ghi chú: "{order.note}"
                              </p>
                            )}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}

          {/* TAB 2: THÔNG TIN CÁ NHÂN */}
          {activeTab === 'profile' && (
            <section className="bg-white border border-stone-200 rounded-xl p-6 md:p-8 space-y-6">
              <div className="border-b border-stone-200 pb-4">
                <p className="text-xs text-zinc-500">Tài khoản / Hồ sơ cá nhân</p>
                <h1 className="text-2xl font-bold text-zinc-900 mt-0.5">
                  Thông Tin Cá Nhân & Địa Chỉ Mặc Định
                </h1>
              </div>

              {profileSavedMsg && (
                <div className="p-3.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{profileSavedMsg}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-zinc-700">
                    Ảnh đại diện (Avatar hiển thị trên thanh điều hướng)
                  </label>
                  <div className="flex flex-wrap items-center gap-4">
                    <img
                      src={avatar}
                      alt={name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-full border border-stone-300 bg-stone-100 object-cover"
                    />
                    <div className="space-y-2">
                      <p className="text-xs text-zinc-500">
                        Chọn nhanh Avatar nhân vật sưu tầm:
                      </p>
                      <div className="flex items-center gap-2">
                        {AVATAR_PRESETS.map((presetUrl, i) => (
                          <button
                            key={presetUrl}
                            type="button"
                            onClick={() => setAvatar(presetUrl)}
                            className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-transform cursor-pointer ${
                              avatar === presetUrl
                                ? 'border-[#C83E2B] scale-105'
                                : 'border-stone-200'
                            }`}
                          >
                            <img
                              src={presetUrl}
                              alt={`Avatar mẫu ${i + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-[#FAF9F6] border border-stone-300 rounded-md text-zinc-900 focus:outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">
                      Email tài khoản *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-[#FAF9F6] border border-stone-300 rounded-md text-zinc-900 font-mono focus:outline-none focus:border-zinc-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">
                      Số điện thoại liên hệ *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-[#FAF9F6] border border-stone-300 rounded-md text-zinc-900 font-mono focus:outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">
                      Tỉnh / Thành phố
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-[#FAF9F6] border border-stone-300 rounded-md text-zinc-900 focus:outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">
                      Quận / Huyện
                    </label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-[#FAF9F6] border border-stone-300 rounded-md text-zinc-900 focus:outline-none focus:border-zinc-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Địa chỉ số nhà, tên đường, phường/xã mặc định
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-[#FAF9F6] border border-stone-300 rounded-md text-zinc-900 focus:outline-none focus:border-zinc-900"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-semibold text-white bg-zinc-900 hover:bg-[#C83E2B] rounded-md transition-colors cursor-pointer"
                  >
                    Lưu cập nhật thông tin cá nhân
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* TAB 3: RESET / ĐỔI MẬT KHẨU */}
          {activeTab === 'reset-password' && (
            <section className="bg-white border border-stone-200 rounded-xl p-6 md:p-8 max-w-2xl space-y-6">
              <div className="border-b border-stone-200 pb-4">
                <p className="text-xs text-zinc-500">Tài khoản / Bảo mật</p>
                <h1 className="text-2xl font-bold text-zinc-900 mt-0.5">
                  Reset & Đổi Mật Khẩu Tài Khoản
                </h1>
                <p className="text-xs text-zinc-500 mt-1">
                  Đặt lại mật khẩu mới cho tài khoản <span className="font-mono text-zinc-800">{currentUser.email}</span>.
                </p>
              </div>

              {passwordFeedback && (
                <div
                  className={`p-3.5 text-xs font-medium rounded-md border ${
                    passwordFeedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-red-50 text-red-800 border-red-200'
                  }`}
                >
                  {passwordFeedback.text}
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Mật khẩu hiện tại (Hoặc để trống nếu Reset nhanh)
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 text-sm bg-[#FAF9F6] border border-stone-300 rounded-md text-zinc-900 focus:outline-none focus:border-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Mật khẩu mới (Tối thiểu 6 ký tự) *
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới..."
                    className="w-full px-3.5 py-2 text-sm bg-[#FAF9F6] border border-stone-300 rounded-md text-zinc-900 focus:outline-none focus:border-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Xác nhận lại mật khẩu mới *
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới..."
                    className="w-full px-3.5 py-2 text-sm bg-[#FAF9F6] border border-stone-300 rounded-md text-zinc-900 focus:outline-none focus:border-zinc-900"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-semibold text-white bg-zinc-900 hover:bg-[#C83E2B] rounded-md transition-colors cursor-pointer"
                  >
                    Xác nhận Reset mật khẩu
                  </button>
                </div>
              </form>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
