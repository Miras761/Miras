import React from 'react';
import { useAppContext } from '../context';
import { Trash2, ShoppingCart } from 'lucide-react';
import { api } from '../api';
import toast from 'react-hot-toast';

export const Cart: React.FC = () => {
  const { cart, fetchCart, user } = useAppContext();

  const handleRemove = async (id: number) => {
    try {
      await api.delete(`/cart/${id}/`);
      await fetchCart();
      toast.success('Товар удален');
    } catch (error) {
      toast.error('Не удалось удалить товар');
    }
  };

  const handleCheckout = async () => {
    try {
      await api.post('/cart/checkout/');
      await fetchCart();
      toast.success('Заказ успешно оформлен!');
    } catch (error) {
      toast.error('Ошибка при оформлении заказа');
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center pt-24">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <ShoppingCart className="w-10 h-10 text-slate-300" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 mb-2">Корзина пуста</h2>
        <p className="text-slate-500 mb-6 text-sm">Войдите, чтобы добавлять товары.</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center pt-24">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <ShoppingCart className="w-10 h-10 text-slate-300" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 mb-2">Корзина пуста</h2>
        <p className="text-slate-500 text-sm">Перейдите в каталог, чтобы добавить товары.</p>
      </div>
    );
  }

  const groupedCart = cart.reduce((acc, item) => {
    if (!acc[item.shop_name]) acc[item.shop_name] = [];
    acc[item.shop_name].push(item);
    return acc;
  }, {} as Record<string, typeof cart>);

  const totalPrice = cart.reduce((sum, item) => sum + (Number(item.product_price) * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <header className="sticky top-0 z-40 bg-white px-4 py-3 border-b border-slate-100 flex items-center justify-center">
        <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">Корзина</h1>
      </header>
      
      <div className="flex-1 overflow-y-auto p-4 pb-[160px] space-y-4">
        {Object.entries(groupedCart).map(([shopName, items]) => (
          <div key={shopName} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              {shopName}
            </h3>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-start">
                  <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ShoppingCart className="w-6 h-6 text-slate-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug">{item.product_title}</h4>
                    <p className="text-slate-900 font-extrabold mt-1 text-sm">{Number(item.product_price).toLocaleString()} ₸</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-3 bg-slate-50 px-2 py-1 rounded-lg">
                        <span className="text-xs font-bold text-slate-500">{item.quantity} шт.</span>
                      </div>
                      <button 
                        onClick={() => handleRemove(item.id)}
                        className="p-1.5 text-slate-300 hover:text-red-500 bg-slate-50 rounded-lg active:scale-95 transition-transform"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-[56px] left-0 w-full sm:absolute sm:bottom-0 bg-white border-t border-slate-200 p-4 pb-6 z-50">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-slate-500 text-sm font-medium">Итого ({totalItems})</p>
            <p className="text-2xl font-extrabold text-slate-900">{totalPrice.toLocaleString()} ₸</p>
          </div>
        </div>
        <button
          onClick={handleCheckout}
          className="w-full bg-orange-500 text-white font-bold py-4 rounded-2xl text-lg shadow-lg shadow-orange-500/20 active:scale-95 transition-transform min-h-[48px]"
        >
          Оформить заказ
        </button>
      </div>
    </div>
  );
};
