import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User as UserIcon, LogOut, HardHat, LayoutDashboard } from 'lucide-react';
import { useAppContext } from '../context';

export const Navbar: React.FC = () => {
  const { user, cartCount, logout } = useAppContext();

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200 transition-colors">
              <HardHat className="h-6 w-6" />
            </div>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">Stroy<span className="text-orange-500">Market</span></span>
          </Link>

          <div className="flex items-center gap-6">
            {(!user || user.role === 'customer') && (
              <Link to="/cart" className="relative group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors text-slate-600">
                  <ShoppingCart className="h-5 w-5" />
                </div>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-4">
                {user.role === 'vendor' && (
                  <Link to="/vendor" className="flex items-center gap-2 text-sm font-bold bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition-colors">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Кабинет</span>
                  </Link>
                )}
                <div className="flex items-center gap-2 text-slate-600 cursor-pointer hover:text-slate-900 transition-colors pl-2 border-l border-slate-200">
                  <UserIcon className="h-5 w-5" />
                  <span className="text-sm font-medium hidden sm:block">{user.username}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-slate-500 hover:text-red-500 transition-colors"
                  title="Выйти"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="text-[14px] bg-slate-900 text-white font-bold py-2 px-5 py-1.5 rounded-lg hover:bg-orange-500 transition-colors"
              >
                Войти
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
