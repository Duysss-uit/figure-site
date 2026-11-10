import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, KeyRound } from 'lucide-react';
import { UserAccount } from '../../types/store';

interface ForgotPasswordPageProps {
  users: UserAccount[];
  initialEmail?: string;
  onResetPasswordSubmit: (email: string, newPassword: string) => boolean;
  onBackToLogin: () => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  initialEmail = '',
  onResetPasswordSubmit,
  onBackToLogin,
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim()) {
      setErrorMsg('Vui lòng nhập địa chỉ Email đã đăng ký.');
      return;
    }

    if (!newPassword.trim() || newPassword.length < 6) {
      setErrorMsg('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    const updated = onResetPasswordSubmit(email.trim(), newPassword);
    if (!updated) {
      setErrorMsg(
        `Không tìm thấy tài khoản nào đăng ký với email "${email.trim()}".`
      );
      return;
    }

    setIsSuccess(true);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-12">
      <div className="max-w-lg mx-auto bg-white border border-stone-200 rounded-xl p-8 space-y-6">
        <div className="border-b border-stone-200 pb-5">
          <button
            type="button"
            onClick={onBackToLogin}
            className="text-xs font-medium text-zinc-600 hover:text-zinc-900 flex items-center gap-1.5 mb-3 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại trang Đăng nhập</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <KeyRound className="w-3.5 h-3.5 text-[#C83E2B]" />
            <span>Khôi phục quyền truy cập tài khoản Figure</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 mt-1">
            Trang Reset Mật Khẩu
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Nhập địa chỉ Email tài khoản của bạn và thiết lập mật khẩu mới.
          </p>
        </div>

        {isSuccess ? (
          <div className="space-y-5 py-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <p className="font-bold text-emerald-900">
                  Reset mật khẩu thành công!
                </p>
                <p className="text-emerald-800 leading-relaxed">
                  Mật khẩu mới cho tài khoản <span className="font-mono font-semibold">{email}</span> đã được lưu lại. Bạn có thể đăng nhập ngay bây giờ.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onBackToLogin}
              className="w-full py-3 px-5 text-xs font-semibold text-white bg-zinc-900 hover:bg-[#C83E2B] rounded-md transition-colors cursor-pointer"
            >
              Về trang Đăng nhập ngay
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3.5 text-xs font-medium text-red-800 bg-red-50 border border-red-200 rounded-md">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Email tài khoản cần Reset mật khẩu *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email đã đăng ký..."
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-stone-300 rounded-md text-zinc-900 font-mono focus:outline-none focus:border-zinc-900"
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
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-stone-300 rounded-md text-zinc-900 focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Xác nhận mật khẩu mới *
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới..."
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-stone-300 rounded-md text-zinc-900 focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-5 text-xs font-semibold text-white bg-zinc-900 hover:bg-[#C83E2B] rounded-md transition-colors cursor-pointer"
              >
                Xác nhận Đặt lại Mật khẩu
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
