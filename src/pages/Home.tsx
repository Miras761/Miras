import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { Product, Shop } from '../types';
import { useAppContext } from '../context';
import { ShoppingCart, Star, Package, ArrowRight, ShieldCheck, Truck, Clock, Store } from 'lucide-react';

export const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, user } = useAppContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, bestsRes, shopsRes] = await Promise.all([
          api.get('/products/').catch(() => ({ data: [] })),
          api.get('/products/bestsellers/').catch(() => ({ data: [] })),
          api.get('/shops/').catch(() => ({ data: [] }))
        ]);
        setProducts(productsRes.data);
        setBestsellers(bestsRes.data);
        setShops(shopsRes.data);
      } catch (error) {
        console.error("Failed to load catalog", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderProductCard = (product: Product, showBadge: boolean = false) => (
    <div key={product.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col relative">
      <Link to={`/product/${product.id}`} className="block h-40 bg-slate-100 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.title} className="object-contain w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-24 h-24 bg-white shadow-sm rounded-lg flex items-center justify-center">
            <Package className="h-10 w-10 text-slate-300" />
          </div>
        )}
        <div className="absolute top-2 left-2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded">
          {product.shop_name}
        </div>
        {showBadge && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
            ХИТ ПРОДАЖ
          </div>
        )}
      </Link>
      <div className="mb-4 flex-grow flex flex-col">
        <p className="text-xs text-slate-400 font-medium mb-1">{product.category_name || 'Категория'}</p>
        <Link to={`/product/${product.id}`} className="text-slate-900 font-bold leading-snug line-clamp-2 hover:text-orange-500 transition-colors">
          {product.title}
        </Link>
        <p className="text-orange-500 font-extrabold text-lg mt-auto pt-2">
          {Number(product.price).toLocaleString()} ₸ <span className="text-xs text-slate-400 font-normal">/ {product.unit_type || 'шт'}</span>
        </p>
      </div>
      {(!user || user.role === 'customer') && (
        <button
          onClick={() => addToCart(product.id)}
          disabled={!product.in_stock}
          className={`w-full font-bold py-2 rounded-xl flex items-center justify-center gap-2 transition-colors ${
            product.in_stock 
              ? 'bg-slate-900 text-white hover:bg-orange-500' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="h-4 w-4" /> 
          {product.in_stock ? 'В корзину' : 'Нет в наличии'}
        </button>
      )}
    </div>
  );

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-slate-900 sm:rounded-[2rem] p-8 lg:p-12 flex items-center justify-between mb-12 overflow-hidden relative shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 opacity-90"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"></div>
          <div className="max-w-2xl relative z-10 w-full lg:w-2/3">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
              Все для стройки <br className="hidden sm:block" />
              <span className="text-orange-500">в один клик</span>
            </h2>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed max-w-xl">
              Заказывайте строительные материалы от проверенных поставщиков с доставкой прямо на ваш объект. Оптовые цены и гарантия качества.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <a href="#catalog" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2">
                В каталог <ArrowRight className="h-5 w-5" />
              </a>
              <Link to="/auth" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 py-3.5 rounded-xl font-bold transition-all">
                Стать продавцом
              </Link>
            </div>
            
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-white/10">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-orange-400" />
                <span className="text-sm font-medium text-slate-200">Гарантия качества</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="h-6 w-6 text-orange-400" />
                <span className="text-sm font-medium text-slate-200">Быстрая доставка</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-orange-400" />
                <span className="text-sm font-medium text-slate-200">Поддержка 24/7</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex w-1/3 justify-end opacity-20 relative z-10">
            <Package className="w-64 h-64 text-white" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <>
            {/* Active Shops */}
            {shops.length > 0 && (
              <section className="mb-16">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                    <Store className="h-6 w-6 text-slate-500" /> Популярные магазины
                  </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {shops.map(shop => (
                    <div key={shop.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                        {shop.logo ? <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover rounded-xl" /> : <Store className="h-6 w-6 text-slate-400" />}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 truncate">{shop.name}</h4>
                        <div className="flex items-center text-xs font-medium text-slate-500 mt-1">
                          <Star className="h-3 w-3 text-orange-500 fill-orange-500 mr-1" />
                          {shop.rating}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Bestsellers */}
            {bestsellers.length > 0 && (
              <section className="mb-16">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Star className="h-6 w-6 text-orange-500 fill-orange-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Хиты продаж</h2>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {bestsellers.map(p => renderProductCard(p, true))}
                </div>
              </section>
            )}

            {/* All Products */}
            <section id="catalog">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-8">Весь каталог</h2>
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.map(p => renderProductCard(p))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                  <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-slate-600 mb-2">Каталог пуст</h3>
                  <p className="text-slate-400">Товары скоро появятся</p>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};
