import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context';
import { ArrowLeft, HardHat, Mail, Lock, User } from 'lucide-react';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login, register } = useAppContext();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login({ username: formData.username, password: formData.password });
        navigate('/');
      } else {
        await register(formData);
        setIsLogin(true); // Switch to login after register
      }
    } catch (error) {
      // Errors handled by context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left split - Image/Graphic */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 justify-center items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-90 z-0"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-500/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="relative z-10 p-12 max-w-lg">
          <div className="flex items-center space-x-3 mb-10">
            <div className="p-3 bg-orange-500 rounded-2xl">
              <HardHat className="h-8 w-8 text-white" />
            </div>
            <span className="text-3xl font-bold text-white tracking-tight">StroyMarket</span>
          </div>
          <h2 className="text-5xl font-extrabold text-white mb-6 leading-tight">
            Стройте <br/><span className="text-orange-500">будущее</span> <br/>вместе с нами
          </h2>
          <p className="text-xl text-slate-300 leading-relaxed">
            Присоединяйтесь к крупнейшему маркетплейсу строительных материалов. Прямые поставки от производителей и гарантия качества.
          </p>
        </div>
      </div>

      {/* Right split - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
        <Link to="/" className="absolute top-8 left-8 sm:left-12 flex items-center text-slate-500 hover:text-slate-900 transition-colors bg-white hover:bg-slate-50 px-4 py-2 rounded-full border border-slate-200 shadow-sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">На главную</span>
        </Link>

        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-slate-900 mb-2">
              {isLogin ? 'С возвращением' : 'Создать аккаунт'}
            </h3>
            <p className="text-slate-500">
              {isLogin ? 'Войдите, чтобы продолжить покупки' : 'Регистрация займет всего пару минут'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Имя пользователя</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                  placeholder="Ведите логин"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                    placeholder="example@mail.com"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Пароль</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-xl font-bold text-lg transition-all shadow-md mt-4 disabled:opacity-70 flex justify-center items-center"
            >
              {loading ? (
                <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                isLogin ? 'Войти' : 'Зарегистрироваться'
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            {isLogin ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-bold text-slate-900 hover:text-orange-500 transition-colors"
            >
              {isLogin ? 'Создать аккаунт' : 'Войти'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
