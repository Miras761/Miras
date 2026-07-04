import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { Product, Shop } from '../types';
import { useAppContext } from '../context';
import { ShoppingCart, Star, Package, HardHat, Store } from 'lucide-react';

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

  const renderProductCard = (product: Product, isHorizontal: boolean = false) => (
    <div 
      key={product.id} 
      className={`bg-white rounded-2xl flex flex-col relative overflow-hidden ${isHorizontal ? 'min-w-[140px] max-w-[140px] snap-start' : 'w-full'} shadow-sm border border-slate-100`}
    >
      <Link to={`/product/${product.id}`} className="block aspect-square bg-slate-100 flex items-center justify-center p-3 relative">
        {product.image ? (
          <img src={product.image} alt={product.title} className="object-contain w-full h-full mix-blend-multiply" />
        ) : (
          <Package className="w-10 h-10 text-slate-300" />
        )}
      </Link>
      <div className="p-3 flex-grow flex flex-col">
        <p className="text-[10px] text-slate-400 font-medium mb-1 line-clamp-1">{product.shop_name}</p>
        <Link to={`/product/${product.id}`} className="text-slate-900 font-bold text-xs leading-snug line-clamp-2 mb-2">
          {product.title}
        </Link>
        <p className="text-slate-900 font-extrabold mt-auto text-sm">
          {Number(product.price).toLocaleString()} ₸
        </p>
        
        {(!user || user.role === 'customer') && (
          <button
            onClick={() => addToCart(product.id)}
            disabled={!product.in_stock}
            className={`w-full mt-2 font-bold py-2 rounded-xl text-xs min-h-[36px] flex items-center justify-center transition-transform active:scale-95 ${
              product.in_stock 
                ? 'bg-slate-100 text-slate-900' 
                : 'bg-slate-50 text-slate-300 cursor-not-allowed'
            }`}
          >
            {product.in_stock ? 'В корзину' : 'Нет'}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full pb-6">
      {/* Fixed Mobile Header */}
      <header className="sticky top-0 z-40 bg-white px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <HardHat className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">StroyMarket</span>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <>
          {/* Shops (Stories style) */}
          {shops.length > 0 && (
            <section className="bg-white pt-4 pb-2 mb-2">
              <div className="flex overflow-x-auto scrollbar-hide px-4 gap-4 snap-x pb-2">
                {shops.map(shop => (
                  <div key={shop.id} className="flex flex-col items-center gap-1 min-w-[72px] snap-start">
                    <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-orange-500 p-0.5 flex items-center justify-center overflow-hidden">
                      {shop.logo ? (
                        <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <Store className="h-6 w-6 text-slate-400" />
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-900 truncate w-full text-center">{shop.name}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Bestsellers (Horizontal scroll) */}
          {bestsellers.length > 0 && (
            <section className="mb-2 py-4">
              <div className="px-4 flex items-center justify-between mb-3">
                <h2 className="text-lg font-extrabold text-slate-900">Хиты продаж</h2>
              </div>
              <div className="flex overflow-x-auto scrollbar-hide px-4 gap-3 snap-x pb-4">
                {bestsellers.map(p => renderProductCard(p, true))}
              </div>
            </section>
          )}

          {/* All Products Grid */}
          <section className="px-4" id="catalog">
            <h2 className="text-lg font-extrabold text-slate-900 mb-3">Все товары</h2>
            {products.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {products.map(p => renderProductCard(p, false))}
              </div>
            ) : (
              <div className="text-center py-10 bg-white rounded-2xl">
                <Package className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-600">Пусто</h3>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};
