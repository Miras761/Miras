import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Product } from '../types';
import { Package, Plus, Search, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const VendorProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    unit_type: 'шт',
    category: '',
    in_stock: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/vendor/products/');
      setProducts(data);
    } catch (error) {
      toast.error('Не удалось загрузить товары');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData({ ...formData, [name]: val });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('price', formData.price);
    submitData.append('unit_type', formData.unit_type);
    submitData.append('category', formData.category); // Assuming backend takes category string or ID
    submitData.append('in_stock', String(formData.in_stock));
    if (imageFile) {
      submitData.append('image', imageFile);
    }

    try {
      await api.post('/vendor/products/', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Товар успешно добавлен!');
      setIsModalOpen(false);
      setFormData({ title: '', description: '', price: '', unit_type: 'шт', category: '', in_stock: true });
      setImageFile(null);
      fetchProducts();
    } catch (error) {
      toast.error('Ошибка при добавлении товара');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Мои товары</h1>
          <p className="text-slate-500 mt-1">Управляйте каталогом ваших строительных материалов</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-5 rounded-xl transition-colors shadow-lg shadow-orange-500/20 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Добавить товар
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold tracking-wider">
                  <th className="px-6 py-4">Товар</th>
                  <th className="px-6 py-4">Категория</th>
                  <th className="px-6 py-4">Цена</th>
                  <th className="px-6 py-4">Статус</th>
                  <th className="px-6 py-4 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-200">
                          {product.image ? (
                            <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-6 h-6 text-slate-300" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{product.title}</p>
                          <p className="text-xs text-slate-500">Продаж: {product.sales_count || 0}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">
                      {product.category_name || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{Number(product.price).toLocaleString()} ₸</p>
                      <p className="text-xs text-slate-500">за {product.unit_type || 'шт'}</p>
                    </td>
                    <td className="px-6 py-4">
                      {product.in_stock ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                          В наличии
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          Нет в наличии
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="p-2 text-slate-400 hover:text-orange-500 bg-slate-50 hover:bg-orange-50 rounded-lg transition-colors" title="Редактировать">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-lg transition-colors" title="Удалить">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20">
            <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-600 mb-2">У вас пока нет товаров</h3>
            <p className="text-slate-400 mb-6">Добавьте первый товар, чтобы начать продажи</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-md"
            >
              Добавить товар
            </button>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-3xl w-full max-w-2xl relative z-10 shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
              <h2 className="text-2xl font-bold text-slate-900">Новый товар</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900">
                &times;
              </button>
            </div>
            <div className="overflow-y-auto p-8 flex-grow">
              <form id="add-product-form" onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Название товара *</label>
                  <input required type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" placeholder="Например: Цемент ПЦ 400" />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Цена (₸) *</label>
                    <input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Ед. измерения</label>
                    <input required type="text" name="unit_type" value={formData.unit_type} onChange={handleInputChange} className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" placeholder="шт, кг, м2" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Категория</label>
                  <input type="text" name="category" value={formData.category} onChange={handleInputChange} className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" placeholder="Строительные смеси" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Описание</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 resize-none" placeholder="Подробное описание товара..."></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Фотография товара</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 transition-colors" />
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <input type="checkbox" id="in_stock" name="in_stock" checked={formData.in_stock} onChange={handleInputChange} className="w-5 h-5 text-orange-500 rounded border-slate-300 focus:ring-orange-500" />
                  <label htmlFor="in_stock" className="text-sm font-bold text-slate-700">В наличии</label>
                </div>
              </form>
            </div>
            <div className="px-8 py-5 border-t border-slate-100 flex justify-end gap-3 flex-shrink-0 bg-slate-50/50 rounded-b-3xl">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-colors">
                Отмена
              </button>
              <button type="submit" form="add-product-form" disabled={submitting} className="px-6 py-2.5 font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-md transition-colors disabled:opacity-70 flex items-center gap-2">
                {submitting ? 'Сохранение...' : 'Сохранить товар'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
