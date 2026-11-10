import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, CreditCard, Truck, Landmark, Wallet } from 'lucide-react';
import { formatVND } from '../../data/initialData';
import { CartItem, Order, PaymentMethodType, UserAccount } from '../../types/store';
import { ProductImage } from '../../components/ProductImage';

interface CheckoutPageProps {
  cart: CartItem[];
  currentUser: UserAccount | null;
  onPlaceOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => void;
  onBackToCart: () => void;
  onNavigateHome: () => void;
}

const FREE_SHIPPING_THRESHOLD = 3000000;
const STANDARD_SHIPPING_FEE = 45000;

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cart,
  currentUser,
  onPlaceOrder,
  onBackToCart,
  onNavigateHome,
}) => {
  // 1. Recipient Information
  const [customerName, setCustomerName] = useState(currentUser?.name || 'Nguyễn Minh Duy');
  const [phone, setPhone] = useState(currentUser?.phone || '0908 412 889');
  const [email, setEmail] = useState(currentUser?.email || 'duyng2006@gmail.com');

  // 2. Shipping Address
  const [city, setCity] = useState(currentUser?.city || 'TP. Hồ Chí Minh');
  const [district, setDistrict] = useState(currentUser?.district || 'Quận 1');
  const [address, setAddress] = useState(
    currentUser?.address || '142 Nguyễn Huệ, Phường Bến Nghé'
  );
  const [postalCode, setPostalCode] = useState('700000');
  const [note, setNote] = useState('Bọc chống sốc 4 góc hộp figure giúp mình.');

  // 3. Payment Information
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(
    'COD (Thanh toán khi nhận hàng)'
  );
  const [cardNumber, setCardNumber] = useState('4111 •••• •••• 8899');
  const [cardHolder, setCardHolder] = useState('NGUYEN MINH DUY');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('•••');
  const [walletPhone, setWalletPhone] = useState('0908 412 889');

  // 4. Coupon / Promo
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingFee =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const total = Math.max(0, subtotal + shippingFee - appliedDiscount);

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'FIGURE50' || code === 'GIAM50K') {
      setAppliedDiscount(50000);
      setCouponMessage('Đã áp dụng mã giảm 50.000 ₫!');
    } else if (code === 'FIGURE100') {
      setAppliedDiscount(100000);
      setCouponMessage('Đã áp dụng mã giảm 100.000 ₫!');
    } else {
      setAppliedDiscount(0);
      setCouponMessage('Mã ưu đãi hợp lệ: FIGURE50 hoặc FIGURE100');
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!customerName.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      setFormError(
        'Vui lòng điền đầy đủ Họ tên người nhận, Số điện thoại và Địa chỉ giao hàng.'
      );
      return;
    }

    let paymentDetails = 'Thanh toán tiền mặt khi nhận hàng';
    if (paymentMethod === 'Chuyển khoản ngân hàng (VietQR)') {
      paymentDetails = 'Vietcombank · STK 0071009988776 · FIGURE VN';
    } else if (paymentMethod === 'Thẻ Visa / Mastercard / JCB') {
      paymentDetails = `Thẻ ${cardNumber} (${cardHolder})`;
    } else if (paymentMethod === 'Ví điện tử MoMo / ZaloPay') {
      paymentDetails = `Ví điện tử SĐT ${walletPhone}`;
    }

    onPlaceOrder({
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      city: city.trim(),
      district: district.trim(),
      address: address.trim(),
      postalCode: postalCode.trim() || '700000',
      paymentMethod,
      paymentDetails,
      note: note.trim(),
      items: cart,
      subtotal,
      shippingFee,
      discount: appliedDiscount,
      total,
    });
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 py-16 text-center">
        <div className="bg-white border border-stone-200 rounded-xl p-12 max-w-lg mx-auto space-y-4">
          <h1 className="text-2xl font-bold text-zinc-900">
            Chưa có sản phẩm để thanh toán
          </h1>
          <p className="text-xs text-zinc-500">
            Vui lòng thêm ít nhất một mẫu Figure vào giỏ hàng trước khi vào trang thanh toán.
          </p>
          <button
            type="button"
            onClick={onNavigateHome}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-zinc-900 rounded-md cursor-pointer"
          >
            Quay về Trang chủ chọn hàng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-10 space-y-8">
      <div className="border-b border-stone-200 pb-5">
        <button
          type="button"
          onClick={onBackToCart}
          className="text-xs font-medium text-zinc-600 hover:text-zinc-900 flex items-center gap-1.5 mb-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Giỏ hàng trong Tài khoản</span>
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-zinc-900">
          Trang Thanh Toán & Giao Nhận Đơn Hàng
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Điền thông tin người nhận, địa chỉ giao hàng và phương thức thanh toán để hoàn tất đơn hàng.
        </p>
      </div>

      <form
        onSubmit={handleSubmitOrder}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        {/* Left Column: Recipient Info + Address + Payment Method */}
        <div className="lg:col-span-7 space-y-6">
          {formError && (
            <div className="p-4 text-xs text-red-800 bg-red-50 border border-red-200 rounded-lg">
              {formError}
            </div>
          )}

          {/* Block 1: Recipient Info */}
          <section className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h2 className="text-base font-bold text-zinc-900 border-b border-stone-200 pb-3">
              1. Thông Tin Người Nhận Hàng
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Họ và tên người nhận *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-3.5 py-2 text-sm bg-[#FAF9F6] border border-stone-300 rounded-md text-zinc-900 focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Số điện thoại nhận hàng *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0908 xxx xxx"
                  className="w-full px-3.5 py-2 text-sm bg-[#FAF9F6] border border-stone-300 rounded-md text-zinc-900 font-mono focus:outline-none focus:border-zinc-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Email nhận thông báo vận đơn
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-3.5 py-2 text-sm bg-[#FAF9F6] border border-stone-300 rounded-md text-zinc-900 font-mono focus:outline-none focus:border-zinc-900"
              />
            </div>
          </section>

          {/* Block 2: Shipping Address */}
          <section className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h2 className="text-base font-bold text-zinc-900 border-b border-stone-200 pb-3">
              2. Địa Chỉ Giao Hàng
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Tỉnh / Thành phố *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="TP. Hồ Chí Minh"
                  className="w-full px-3.5 py-2 text-sm bg-[#FAF9F6] border border-stone-300 rounded-md text-zinc-900 focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Quận / Huyện *
                </label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Quận 1"
                  className="w-full px-3.5 py-2 text-sm bg-[#FAF9F6] border border-stone-300 rounded-md text-zinc-900 focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Mã bưu chính
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="700000"
                  className="w-full px-3.5 py-2 text-sm bg-[#FAF9F6] border border-stone-300 rounded-md text-zinc-900 font-mono focus:outline-none focus:border-zinc-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Số nhà, tên đường, phường / xã *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ví dụ: 142 Nguyễn Huệ, Phường Bến Nghé"
                className="w-full px-3.5 py-2 text-sm bg-[#FAF9F6] border border-stone-300 rounded-md text-zinc-900 focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Ghi chú đóng gói & giao nhận
              </label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Yêu cầu bọc chống sốc hộp artbox, giờ nhận hàng..."
                className="w-full px-3.5 py-2 text-sm bg-[#FAF9F6] border border-stone-300 rounded-md text-zinc-900 focus:outline-none focus:border-zinc-900"
              />
            </div>
          </section>

          {/* Block 3: Payment Information */}
          <section className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h2 className="text-base font-bold text-zinc-900 border-b border-stone-200 pb-3">
              3. Thông Tin Thanh Toán
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(
                [
                  {
                    method: 'COD (Thanh toán khi nhận hàng)' as const,
                    label: 'COD — Nhận hàng trả tiền',
                    sub: 'Kiểm tra hộp nguyên seal trước khi thanh toán',
                    icon: Truck,
                  },
                  {
                    method: 'Chuyển khoản ngân hàng (VietQR)' as const,
                    label: 'Chuyển khoản Ngân hàng',
                    sub: 'Quét mã QR hoặc chuyển khoản nhanh 24/7',
                    icon: Landmark,
                  },
                  {
                    method: 'Thẻ Visa / Mastercard / JCB' as const,
                    label: 'Thẻ Tín dụng / Ghi nợ',
                    sub: 'Hỗ trợ Visa, Mastercard, JCB quốc tế',
                    icon: CreditCard,
                  },
                  {
                    method: 'Ví điện tử MoMo / ZaloPay' as const,
                    label: 'Ví MoMo / ZaloPay',
                    sub: 'Thanh toán tức thì qua ứng dụng ví',
                    icon: Wallet,
                  },
                ]
              ).map(({ method, label, sub, icon: Icon }) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`p-3.5 rounded-lg border text-left transition-colors cursor-pointer flex items-start gap-3 ${
                    paymentMethod === method
                      ? 'border-zinc-900 bg-[#FAF9F6]'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <Icon className="w-4 h-4 text-zinc-800 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold text-zinc-900">
                      {label}
                    </span>
                    <span className="block text-[11px] text-zinc-500 mt-0.5">
                      {sub}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Dynamic Payment Sub-forms */}
            {paymentMethod === 'Chuyển khoản ngân hàng (VietQR)' && (
              <div className="p-4 rounded-lg bg-[#FAF9F6] border border-stone-200 text-xs space-y-1.5">
                <p className="font-semibold text-zinc-900">
                  Thông tin tài khoản thụ hưởng Figure:
                </p>
                <p className="text-zinc-700">
                  Ngân hàng: <strong>Vietcombank — CN TP.HCM</strong>
                </p>
                <p className="text-zinc-700 font-mono">
                  Số tài khoản: <strong>0071 0099 88776</strong> · Chủ TK: <strong>FIGURE VN</strong>
                </p>
                <p className="text-zinc-500">
                  Nội dung chuyển khoản: <span className="font-mono text-zinc-900">{phone} THANH TOAN FIGURE</span>
                </p>
              </div>
            )}

            {paymentMethod === 'Thẻ Visa / Mastercard / JCB' && (
              <div className="p-4 rounded-lg bg-[#FAF9F6] border border-stone-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">
                      Số thẻ tín dụng / ghi nợ
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono bg-white border border-stone-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">
                      Tên chủ thẻ (Không dấu)
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono bg-white border border-stone-300 rounded-md"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">
                      Ngày hết hạn (MM/YY)
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono bg-white border border-stone-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">
                      Mã bảo mật CVV
                    </label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono bg-white border border-stone-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'Ví điện tử MoMo / ZaloPay' && (
              <div className="p-4 rounded-lg bg-[#FAF9F6] border border-stone-200 space-y-2">
                <label className="block text-xs font-medium text-zinc-700">
                  Số điện thoại đăng ký Ví điện tử MoMo / ZaloPay
                </label>
                <input
                  type="tel"
                  value={walletPhone}
                  onChange={(e) => setWalletPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-stone-300 rounded-md"
                />
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Order Summary & Submit */}
        <div className="lg:col-span-5 bg-white border border-stone-200 rounded-xl p-6 md:p-7 space-y-6 sticky top-24">
          <h2 className="text-lg font-bold text-zinc-900 border-b border-stone-200 pb-3">
            Tóm Tắt Đơn Hàng ({cart.reduce((s, i) => s + i.quantity, 0)} sản phẩm)
          </h2>

          <div className="space-y-3.5 max-h-80 overflow-y-auto pr-1 divide-y divide-stone-100">
            {cart.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="pt-3.5 first:pt-0 flex items-center justify-between gap-3"
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
                    <p className="text-xs font-semibold text-zinc-900 line-clamp-1">
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

          {/* Promo Code Box */}
          <div className="pt-4 border-t border-stone-200 space-y-2">
            <label className="block text-xs font-medium text-zinc-700">
              Mã giảm giá (Thử nhập: <span className="font-mono font-semibold">FIGURE50</span>)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Nhập mã ưu đãi..."
                className="flex-1 px-3 py-2 text-xs font-mono bg-[#FAF9F6] border border-stone-300 rounded-md uppercase"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="px-4 py-2 text-xs font-semibold text-zinc-800 bg-stone-200 hover:bg-stone-300 rounded-md transition-colors cursor-pointer"
              >
                Áp dụng
              </button>
            </div>
            {couponMessage && (
              <p className="text-[11px] text-emerald-700 font-medium">
                {couponMessage}
              </p>
            )}
          </div>

          {/* Financial Breakdown */}
          <div className="pt-4 border-t border-stone-200 space-y-2 text-xs">
            <div className="flex justify-between text-zinc-600">
              <span>Tạm tính</span>
              <span className="font-mono tabular-nums">{formatVND(subtotal)}</span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>Phí vận chuyển thùng chống sốc</span>
              <span className="font-mono tabular-nums">
                {shippingFee === 0 ? 'Miễn phí (0 ₫)' : formatVND(shippingFee)}
              </span>
            </div>
            {appliedDiscount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Giảm giá voucher</span>
                <span className="font-mono tabular-nums">
                  -{formatVND(appliedDiscount)}
                </span>
              </div>
            )}
            <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline text-sm font-bold text-zinc-900">
              <span>Tổng cộng thanh toán</span>
              <span className="text-xl font-mono text-[#C83E2B] tabular-nums">
                {formatVND(total)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-5 text-xs font-semibold text-white bg-[#C83E2B] hover:bg-[#b03220] rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Xác Nhận Đặt Hàng · {formatVND(total)}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
