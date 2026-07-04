import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Order, Product } from '../types';
import { Package, ClipboardList, TrendingUp } from 'lucide-react';

export const VendorDashboard: React.FC = () => {
  const [stats, setStats] = useState({ productsCount: 0, ordersCount: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          api.get('/vendor/products/'),
          api.get('/vendor/orders/')
        ]);
        
        const products = productsRes.data as Product[];
        const orders = ordersRes.data as Order[];
        
        const revenue = orders
          .filter(o => o.status !== 'canceled')
          .reduce((sum, o) => sum + Number(o.total_price), 0);

        setStats({
          productsCount: products.length,
          ordersCount: orders.length,
          totalRevenue: revenue
        });
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-slate-500 text-sm font-medium mb-1">Выручка</p>
          <h3 className="text-3xl font-extrabold text-slate-900">{stats.totalRevenue.toLocaleString()} ₸</h3>
        </div>
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-green-600" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <ClipboardList className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-slate-500 text-sm font-medium mb-1">Заказы</p>
          <h3 className="text-2xl font-extrabold text-slate-900">{stats.ordersCount}</h3>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mb-3">
            <Package className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-slate-500 text-sm font-medium mb-1">Товары</p>
          <h3 className="text-2xl font-extrabold text-slate-900">{stats.productsCount}</h3>
        </div>
      </div>
    </div>
  );
};
