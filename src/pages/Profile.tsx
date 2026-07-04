import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context';
import { BottomSheet } from '../components/BottomSheet';
import { User, LogOut, Package, Store, ChevronRight, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export const Profile: React.FC = () => {
  const { user, login, register, logout } = useAppContext();
  const navigate = useNavigate();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'customer' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'vendor') {
      navigate('/vendor');
    }
  }, [user, navigate]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLoginView) {
        await login({ username: formData.username, password: formData.password });
        setIsAuthOpen(false);
      } else {
        await register(formData);
        setIsLoginView(true);
      }
    } catch (error) {
      // Handled in context
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col h-full bg-slate-50">
        <div className="px-6 py-12 flex flex-col items-center justify-center flex-1 text-center">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 mb-6">
            <User className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Войдите в профиль</h2>
          <p className="text-slate-500 mb-8 max-w-[280px]">
            Чтобы совершать покупки, отслеживать заказы и сохранять любимые товары.
          </p>
          <button
            onClick={() => { setIsLoginView(true); setIsAuthOpen(true); }}
            className="w-full bg-orange-500 text-white font-bold py-4 rounded-2xl text-lg shadow-lg shadow-orange-500/20 active:scale-95 transition-transform min-h-[48px]"
          >
            Войти или создать аккаунт
          </button>
        </div>

        <BottomSheet isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)}>
          <h3 className="text-2xl font-extrabold text-slate-900 mb-6 text-center">
            {isLoginView ? 'Вход' : 'Регистрация'}
          </h3>
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {!isLoginView && (
              <div className="flex gap-2 mb-4 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'customer' })}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${formData.role === 'customer' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                >
                  Покупатель
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'vendor' })}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${formData.role === 'vendor' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                >
                  Продавец
                </button>
              </div>
            )}
            <div>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  required
                  type="text"
                  placeholder="Имя пользователя"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full bg-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 font-medium min-h-[48px]"
                />
              </div>
            </div>
            {!isLoginView && (
              <div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    required
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 font-medium min-h-[48px]"
                  />
                </div>
              </div>
            )}
            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  required
                  type="password"
                  placeholder="Пароль"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 font-medium min-h-[48px]"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl text-lg mt-6 active:scale-95 transition-transform disabled:opacity-70 flex justify-center items-center min-h-[48px]"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                isLoginView ? 'Войти' : 'Зарегистрироваться'
              )}
            </button>
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setIsLoginView(!isLoginView)}
                className="text-orange-500 font-bold text-sm"
              >
                {isLoginView ? 'У меня нет аккаунта' : 'Уже есть аккаунт? Войти'}
              </button>
            </div>
          </form>
        </BottomSheet>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-full">
      <div className="bg-white p-6 mb-2">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">{user.username}</h2>
            <p className="text-slate-500 text-sm">Покупатель</p>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 active:bg-slate-50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-slate-400" />
            <span className="font-bold text-slate-900">Мои заказы</span>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300" />
        </div>
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 active:bg-slate-50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <Store className="w-6 h-6 text-slate-400" />
            <span className="font-bold text-slate-900">Любимые магазины</span>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300" />
        </div>
      </div>

      <div className="p-6 mt-4">
        <button
          onClick={logout}
          className="w-full bg-slate-100 text-red-500 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 active:bg-slate-200 transition-colors min-h-[48px]"
        >
          <LogOut className="w-5 h-5" />
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
};
