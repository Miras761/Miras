import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';
import { Product, Review } from '../types';
import { useAppContext } from '../context';
import { ShoppingCart, Star, Package, ArrowLeft, Send, Store, Box } from 'lucide-react';
import toast from 'react-hot-toast';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, text: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const { addToCart, user } = useAppContext();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const [productRes, reviewsRes] = await Promise.all([
          api.get(`/products/`).then(res => ({ data: res.data.find((p: Product) => p.id === Number(id)) })), // Fallback if no direct endpoint
          api.get(`/products/${id}/reviews/`).catch(() => ({ data: [] }))
        ]);
        
        // In a real app we'd fetch /products/{id}/ directly, but the prompt only specified /products/ and /products/bestsellers/
        // I will assume /products/ returns all and we can find it, OR /products/<id>/ exists. Let's try direct first, fallback to list if it fails.
        let pData = productRes.data;
        if (!pData) {
            const list = await api.get('/products/');
            pData = list.data.find((p: Product) => p.id === Number(id));
        }
        setProduct(pData);
        setReviews(reviewsRes.data);
      } catch (error) {
        console.error("Failed to load product", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Необходимо авторизоваться для отправки отзыва');
      return;
    }
    setSubmittingReview(true);
    try {
      await api.post(`/products/${id}/reviews/`, reviewForm);
      toast.success('Отзыв успешно добавлен');
      setReviewForm({ rating: 5, text: '' });
      // Refresh reviews
      const reviewsRes = await api.get(`/products/${id}/reviews/`);
      setReviews(reviewsRes.data);
    } catch (error) {
      toast.error('Не удалось отправить отзыв');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Товар не найден</h2>
        <Link to="/" className="text-orange-500 hover:underline">Вернуться в каталог</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/" className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-2" />
        <span className="text-sm font-medium">Назад в каталог</span>
      </Link>

      <div className="bg-white rounded-3xl p-6 lg:p-10 border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-12 mb-12">
        {/* Product Image */}
        <div className="lg:w-1/2">
          <div className="aspect-square bg-slate-100 rounded-2xl flex items-center justify-center p-8 relative">
            {product.image ? (
              <img src={product.image} alt={product.title} className="w-full h-full object-contain mix-blend-multiply" />
            ) : (
              <Package className="w-32 h-32 text-slate-300" />
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2 flex flex-col">
          <div className="mb-6">
            <p className="text-sm font-bold text-orange-500 mb-2 uppercase tracking-wide">{product.category_name || 'Категория'}</p>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight mb-4">{product.title}</h1>
            <div className="flex items-center gap-4 text-sm text-slate-600 mb-6">
              <span className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full"><Store className="w-4 h-4" /> {product.shop_name}</span>
              <span className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full"><Box className="w-4 h-4" /> {product.sales_count || 0} продаж</span>
            </div>
            
            <p className="text-slate-600 leading-relaxed">
              {product.description || 'Описание товара отсутствует. Свяжитесь с продавцом для получения дополнительных деталей.'}
            </p>
          </div>

          <div className="mt-auto pt-8 border-t border-slate-100">
            <div className="flex items-end gap-4 mb-6">
              <span className="text-5xl font-extrabold text-slate-900 tracking-tight">{Number(product.price).toLocaleString()} ₸</span>
              <span className="text-lg text-slate-400 font-medium mb-1.5">/ {product.unit_type || 'шт'}</span>
            </div>

            {(!user || user.role === 'customer') && (
              <button
                onClick={() => addToCart(product.id)}
                disabled={!product.in_stock}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                  product.in_stock 
                    ? 'bg-slate-900 hover:bg-orange-500 text-white shadow-lg hover:shadow-orange-500/20'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="h-6 w-6" />
                {product.in_stock ? 'Добавить в корзину' : 'Нет в наличии'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-4xl">
        <h3 className="text-2xl font-bold text-slate-900 mb-8">Отзывы покупателей</h3>
        
        {(!user || user.role === 'customer') && (
          <form onSubmit={handleReviewSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-10">
            <h4 className="font-bold text-slate-900 mb-4">Оставить отзыв</h4>
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                  className="focus:outline-none"
                >
                  <Star className={`w-8 h-8 ${star <= reviewForm.rating ? 'text-orange-500 fill-orange-500' : 'text-slate-200'}`} />
                </button>
              ))}
            </div>
            <textarea
              required
              value={reviewForm.text}
              onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
              placeholder="Напишите ваш отзыв о товаре..."
              className="w-full border border-slate-200 rounded-xl p-4 bg-slate-50 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none mb-4 resize-none h-24 text-slate-700"
            />
            <button
              type="submit"
              disabled={submittingReview}
              className="bg-slate-900 hover:bg-orange-500 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              {submittingReview ? 'Отправка...' : <><Send className="w-4 h-4" /> Отправить отзыв</>}
            </button>
          </form>
        )}

        <div className="space-y-6">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-slate-900">{review.author_name}</span>
                  <span className="text-xs text-slate-400">{new Date(review.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-orange-500 fill-orange-500' : 'text-slate-200'}`} />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{review.text}</p>
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-center py-8">Отзывов пока нет. Будьте первым!</p>
          )}
        </div>
      </div>
    </div>
  );
};
