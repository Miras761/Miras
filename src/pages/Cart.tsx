import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context';
import { Trash2, ShoppingBag, ArrowRight, Store, ShieldAlert } from 'lucide-react';

export const Cart: React.FC = () => {
  const { user, cart, removeFromCart, checkout } = useAppContext();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-12 flex flex-col items-center justify-center px-4">
        <div className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 max-w-md w-full text-center border border-slate-100">
          <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="h-10 w-10 text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Войдите в систему</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Чтобы просматривать и оформлять заказы, необходимо авторизоваться.
          </p>
          <Link
            to="/auth"
            className="w-full inline-flex justify-center items-center bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg gap-2"
          >
            Войти или создать аккаунт
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    );
  }

  // Group cart items by shop
  const groupedCart = cart.reduce<Record<string, typeof cart>>((acc, item) => {
    if (!acc[item.shop_name]) acc[item.shop_name] = [];
    acc[item.shop_name].push(item);
    return acc;
  }, {});

  const totalAmount = cart.reduce((sum, item) => sum + (Number(item.product_price) * item.quantity), 0);

  const handleCheckout = async () => {
    await checkout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-8">Корзина</h1>
        
        {cart.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl text-center border border-slate-100 shadow-sm">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-10 w-10 text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Корзина пуста</h2>
            <p className="text-slate-500 mb-8">Перейдите в каталог, чтобы добавить строительные материалы.</p>
            <Link
              to="/"
              className="inline-flex bg-slate-900 hover:bg-orange-500 text-white font-bold py-3 px-8 rounded-xl transition-colors"
            >
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-grow space-y-6">
              {Object.keys(groupedCart).map((shopName) => {
                const items = groupedCart[shopName];
                return (
                <div key={shopName} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden text-slate-900">
                  <div className="bg-slate-50 px-6 py-4 flex items-center gap-3 border-b border-slate-100">
                    <Store className="h-5 w-5 text-slate-400" />
                    <span className="font-semibold text-slate-700">{shopName}</span>
                  </div>
                  <ul className="divide-y divide-slate-100">
                    {items.map((item) => (
                      <li key={item.id} className="p-6 flex items-center sm:items-start flex-col sm:flex-row gap-4 sm:gap-6 hover:bg-slate-50/50 transition-colors">
                        <div className="flex-grow">
                          <h4 className="text-lg font-medium text-slate-800 mb-1">{item.product_title}</h4>
                          <div className="text-sm text-slate-500 flex items-center gap-4">
                            <span>Количество: <strong className="text-slate-700">{item.quantity} шт</strong></span>
                            <span>Цена: <strong className="text-slate-700">{Number(item.product_price).toLocaleString()} ₸</strong></span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:flex-col sm:items-end">
                          <span className="text-xl font-bold text-slate-900 whitespace-nowrap">
                            {(Number(item.product_price) * item.quantity).toLocaleString()} ₸
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-slate-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                            title="Удалить"
                          >
                            <Trash2 className="h-5 w-5" />
                            <span className="text-sm font-medium sm:hidden block text-red-500">Удалить</span>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )})}
            </div>

            <div className="lg:w-96 flex-shrink-0">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-24">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Ваш заказ</h3>
                
                <div className="space-y-4 mb-6 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Товары ({cart.reduce((a,c) => a + c.quantity, 0)} шт)</span>
                    <span>{totalAmount.toLocaleString()} ₸</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Доставка</span>
                    <span className="text-green-600 font-medium">Бесплатно</span>
                  </div>
                </div>
                
                <div className="border-t border-slate-100 pt-6 mb-8 flex justify-between items-end">
                  <span className="text-slate-500 font-medium">Итого</span>
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {totalAmount.toLocaleString()} ₸
                  </span>
                </div>
                
                <button
                  onClick={handleCheckout}
                  className="w-full bg-slate-900 hover:bg-orange-500 text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-md flex items-center justify-center gap-2 group"
                >
                  Оформить заказ
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-xs text-center text-slate-400 mt-4">
                  Нажимая кнопку, вы соглашаетесь с условиями оферты
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
