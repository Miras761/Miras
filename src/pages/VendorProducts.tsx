import React, { useEffect, useState, useRef } from 'react';
import { api } from '../api';
import { Product } from '../types';
import toast from 'react-hot-toast';
import { BottomSheet } from '../components/BottomSheet';
import { Plus, Package, Image as ImageIcon, Check } from 'lucide-react';

export const VendorProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category_name: '',
    unit_type: 'шт',
    in_stock: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/vendor/products/');
      setProducts(res.data);
    } catch (error) {
      toast.error('Ошибка загрузки товаров');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('category_name', formData.category_name);
      data.append('unit_type', formData.unit_type);
      data.append('in_stock', String(formData.in_stock));
      
      if (imageFile) {
        data.append('image', imageFile);
      }

      await api.post('/vendor/products/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Товар успешно добавлен');
      setIsAddOpen(false);
      fetchProducts();
      setFormData({ title: '', description: '', price: '', category_name: '', unit_type: 'шт', in_stock: true });
      setImageFile(null);
    } catch (error) {
      toast.error('Ошибка при добавлении товара');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 relative min-h-full pb-24">
      <h2 className="text-xl font-extrabold text-slate-900 mb-4">Мои товары</h2>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-100">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 mb-1">Нет товаров</h3>
          <p className="text-slate-500 text-sm">Нажмите кнопку ниже, чтобы добавить.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
              <div className="aspect-square bg-slate-50 relative p-3 flex items-center justify-center border-b border-slate-100">
                {product.image ? (
                  <img src={product.image} alt={product.title} className="w-full h-full object-contain mix-blend-multiply" />
                ) : (
                  <Package className="w-8 h-8 text-slate-300" />
                )}
                {!product.in_stock && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                    <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded">Нет в наличии</span>
                  </div>
                )}
              </div>
              <div className="p-3 flex-1 flex flex-col">
                <p className="text-xs text-slate-400 font-medium mb-1 line-clamp-1">{product.category_name || 'Категория'}</p>
                <h4 className="font-bold text-slate-900 text-sm line-clamp-2 mb-2">{product.title}</h4>
                <p className="font-extrabold text-slate-900 mt-auto">{Number(product.price).toLocaleString()} ₸</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Add Button */}
      <button 
        onClick={() => setIsAddOpen(true)}
        className="fixed bottom-[96px] right-6 w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-xl shadow-slate-900/30 active:scale-95 transition-transform z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      <BottomSheet isOpen={isAddOpen} onClose={() => setIsAddOpen(false)}>
        <h3 className="text-xl font-extrabold text-slate-900 mb-6 text-center">Добавить товар</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-32 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative"
          >
            {imageFile ? (
              <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-contain mix-blend-multiply" />
            ) : (
              <>
                <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-sm font-bold text-slate-500">Добавить фото</span>
              </>
            )}
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef}
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImageFile(e.target.files[0]);
                }
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">Название</label>
            <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-100 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 font-medium" placeholder="Например, Цемент М500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">Цена (₸)</label>
              <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-slate-100 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 font-medium" placeholder="0" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">Ед. изм.</label>
              <select value={formData.unit_type} onChange={e => setFormData({...formData, unit_type: e.target.value})} className="w-full bg-slate-100 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 font-medium appearance-none">
                <option value="шт">Штука (шт)</option>
                <option value="кг">Килограмм (кг)</option>
                <option value="т">Тонна (т)</option>
                <option value="м">Метр (м)</option>
                <option value="м2">Кв. метр (м²)</option>
                <option value="л">Литр (л)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">Категория</label>
            <input required type="text" value={formData.category_name} onChange={e => setFormData({...formData, category_name: e.target.value})} className="w-full bg-slate-100 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 font-medium" placeholder="Сухие смеси" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">Описание</label>
            <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-100 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 font-medium min-h-[80px]" placeholder="Краткое описание товара..." />
          </div>
          
          <label className="flex items-center gap-3 p-4 bg-slate-100 rounded-2xl cursor-pointer">
            <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${formData.in_stock ? 'bg-slate-900' : 'bg-slate-300'}`}>
              <Check className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">В наличии</span>
            <input type="checkbox" checked={formData.in_stock} onChange={e => setFormData({...formData, in_stock: e.target.checked})} className="hidden" />
          </label>

          <button type="submit" disabled={submitting} className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl text-lg mt-4 active:scale-95 transition-transform disabled:opacity-70 flex justify-center items-center min-h-[48px]">
            {submitting ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Сохранить товар'}
          </button>
        </form>
      </BottomSheet>
    </div>
  );
};
