import React from 'react';
import { useAppContext } from '../context';
import { Package, ShoppingCart, TrendingUp, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

export const VendorDashboard: React.FC = () => {
  const { user } = useAppContext();

  // In a real app, these stats would be fetched from a dashboard endpoint.
  // Since no explicit endpoint was provided in the prompt for dashboard stats, 
  // we will show a welcoming placeholder or mock stats.
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Добро пожаловать, {user?.username}!</h1>
        <p className="text-slate-500 mt-2">Обзор вашего бизнеса на платформе StroyMarket.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-600">Продажи за месяц</h3>
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">0 ₸</p>
          <div className="flex items-center text-sm mt-2 text-green-600 font-medium">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>Новый магазин</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-600">Новые заказы</h3>
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">-</p>
          <Link to="/vendor/orders" className="text-sm text-orange-500 hover:underline mt-2 inline-block font-medium">Перейти к заказам</Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-600">Товары в каталоге</h3>
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">-</p>
          <Link to="/vendor/products" className="text-sm text-blue-500 hover:underline mt-2 inline-block font-medium">Управление товарами</Link>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Начните продавать!</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-8">
          Добавьте свои первые строительные материалы в каталог, чтобы покупатели могли их заказать.
        </p>
        <Link 
          to="/vendor/products"
          className="bg-slate-900 hover:bg-orange-500 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg inline-flex items-center gap-2"
        >
          <Package className="w-5 h-5" />
          Добавить товар
        </Link>
      </div>
    </div>
  );
};
