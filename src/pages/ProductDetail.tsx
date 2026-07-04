import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Product, Review } from '../types';
import { useAppContext } from '../context';
import { ShoppingCart, Star, Package, ChevronLeft, Store } from 'lucide-react';
import toast from 'react-hot-toast';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, user } = useAppContext();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const [productRes, reviewsRes] = await Promise.all([
          api.get(`/products/`),
          api.get(`/products/${id}/reviews/`).catch(() => ({ data: [] }))
        ]);
        const found = productRes.data.find((p: Product) => p.id === Number(id));
        setProduct(found || null);
        setReviews(reviewsRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-50">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Товар не найден</h2>
        <button onClick={() => navigate(-1)} className="text-orange-500 font-bold">Назад</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Header */}
      <header className="absolute top-0 left-0 w-full z-40 px-4 py-3 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-6 h-6 text-slate-900" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
        {/* Large Image */}
        <div className="w-full aspect-square bg-white flex items-center justify-center p-8 border-b border-slate-100 relative">
          {product.image ? (
            <img src={product.image} alt={product.title} className="object-contain w-full h-full mix-blend-multiply" />
          ) : (
            <Package className="w-32 h-32 text-slate-300" />
          )}
        </div>

        {/* Info */}
        <div className="bg-white p-4 mb-2">
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium mb-2">
            <Store className="w-4 h-4" />
            <span>{product.shop_name}</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 mb-2 leading-tight">{product.title}</h1>
          <p className="text-slate-500 text-sm mb-4 leading-relaxed">{product.description}</p>
        </div>

        {/* Reviews */}
        <div className="bg-white p-4">
          <h2 className="text-lg font-extrabold text-slate-900 mb-4">Отзывы</h2>
          {reviews.length > 0 ? (
            <div className="flex overflow-x-auto scrollbar-hide gap-4 snap-x pb-2">
              {reviews.map(review => (
                <div key={review.id} className="min-w-[280px] bg-slate-50 p-4 rounded-2xl snap-start border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 text-sm">{review.author_name}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-orange-500 fill-orange-500' : 'text-slate-300 fill-slate-300'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-3">{review.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">Нет отзывов</p>
          )}
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="absolute bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 pb-[max(env(safe-area-inset-bottom),16px)] z-50 flex items-center justify-between gap-4 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col">
          <span className="text-xs text-slate-500 font-medium">{product.unit_type || 'шт'}</span>
          <span className="text-2xl font-extrabold text-slate-900 leading-none">{Number(product.price).toLocaleString()} ₸</span>
        </div>
        
        {(!user || user.role === 'customer') && (
          <button
            onClick={() => {
              addToCart(product.id);
              toast.success('Добавлено в корзину');
            }}
            disabled={!product.in_stock}
            className={`flex-1 font-bold py-3.5 rounded-2xl text-base shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 min-h-[48px] ${
              product.in_stock 
                ? 'bg-orange-500 text-white shadow-orange-500/20' 
                : 'bg-slate-100 text-slate-400 shadow-none cursor-not-allowed'
            }`}
          >
            {product.in_stock ? 'В корзину' : 'Нет в наличии'}
          </button>
        )}
      </div>
    </div>
  );
};
