import React, { useState } from 'react';
import { KeyRound } from 'lucide-react';
import usersJson from '../../catalog/users.json';
import { UserAccount } from '../../types/store';

interface LoginPageProps {
  users: UserAccount[];
  initialMode?: 'login' | 'register';
  onLogin: (user: UserAccount) => void;
  onRegisterUser: (newUser: UserAccount) => void;
  onNavigateForgotPassword: (emailPrefill?: string) => void;
}

export const INITIAL_USERS: UserAccount[] = usersJson as UserAccount[];

export const LoginPage: React.FC<LoginPageProps> = ({
  users,
  initialMode = 'login',
  onLogin,
  onRegisterUser,
  onNavigateForgotPassword,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const normalizedEmail = email.trim().toLowerCase();

    if (mode === 'login') {
      const matchedUser = users.find(
        (u) => u.email.toLowerCase() === normalizedEmail
      );

      if (!matchedUser) {
        setErrorMessage('Tài khoản Email này không tồn tại trong hệ thống.');
        return;
      }

      if (matchedUser.password && matchedUser.password !== password) {
        setErrorMessage('Mật khẩu không chính xác. Vui lòng thử lại hoặc bấm Quên mật khẩu.');
        return;
      }

      // System automatically reads matchedUser.isAdmin from the returned user data
      onLogin(matchedUser);
    } else {
      const exists = users.some(
        (u) => u.email.toLowerCase() === normalizedEmail
      );
      if (exists) {
        setErrorMessage('Email này đã được đăng ký. Vui lòng chuyển sang Đăng nhập.');
        return;
      }

      const newUser: UserAccount = {
        id: 'usr-' + Date.now(),
        name: name.trim() || 'Thành viên Figure',
        email: email.trim(),
        password,
        avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=' + encodeURIComponent(email.trim()),
        isAdmin: false,
        phone: phone.trim() || '0908 000 111',
        city: 'TP. Hồ Chí Minh',
        district: 'Quận 1',
        address: address.trim() || '142 Nguyễn Huệ, Phường Bến Nghé',
      };
      onRegisterUser(newUser);
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-12">
      <div className="max-w-lg mx-auto bg-white border border-stone-200 rounded-xl p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <div>
            <p className="text-xs text-zinc-500">Hệ thống tài khoản cửa hàng Figure</p>
            <h1 className="text-2xl font-bold text-zinc-900 mt-1">
              {mode === 'login' ? 'Đăng Nhập Tài Khoản' : 'Đăng Ký Tài Khoản Mới'}
            </h1>
          </div>

          <div className="flex items-center gap-1 p-1 bg-stone-200/70 rounded-md">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage(null);
              }}
              className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Đăng ký
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3.5 text-xs font-medium text-red-800 bg-red-50 border border-red-200 rounded-md">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Họ và tên *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập họ và tên của bạn"
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-stone-300 rounded-md text-zinc-900 focus:outline-none focus:border-zinc-900"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Địa chỉ Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập địa chỉ email..."
              className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-stone-300 rounded-md text-zinc-900 font-mono focus:outline-none focus:border-zinc-900"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-zinc-700">
                Mật khẩu *
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => onNavigateForgotPassword(email)}
                  className="text-xs font-medium text-[#C83E2B] hover:underline underline-offset-2 flex items-center gap-1 cursor-pointer"
                >
                  <KeyRound className="w-3 h-3" />
                  <span>Quên mật khẩu?</span>
                </button>
              )}
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu..."
              className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-stone-300 rounded-md text-zinc-900 focus:outline-none focus:border-zinc-900"
            />
          </div>

          {mode === 'register' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0908 xxx xxx"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-stone-300 rounded-md text-zinc-900 font-mono focus:outline-none focus:border-zinc-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Địa chỉ giao hàng mặc định
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Quận 1, TP. Hồ Chí Minh"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-stone-300 rounded-md text-zinc-900 focus:outline-none focus:border-zinc-900"
                />
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-5 text-xs font-semibold text-white bg-zinc-900 hover:bg-[#C83E2B] rounded-md transition-colors cursor-pointer"
            >
              {mode === 'login' ? 'Đăng nhập' : 'Hoàn tất đăng ký'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
