import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Order } from '../types';
import { PackageX, Clock, CreditCard, Truck, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const VendorOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/vendor/orders/');
      setOrders(data);
    } catch (error) {
      toast.error('Не удалось загрузить заказы');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: number, newStatus: string) => {
    try {
      await api.patch(`/vendor/orders/${orderId}/`, { status: newStatus });
      toast.success('Статус заказа обновлен');
      fetchOrders();
    } catch (error) {
      toast.error('Ошибка при обновлении статуса');
    }
  };

  const statusMap = {
    'new': { label: 'Новый', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Clock },
    'paid': { label: 'Оплачен', color: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: CreditCard },
    'shipping': { label: 'В доставке', color: 'bg-orange-100 text-orange-800 border-orange-200', icon: Truck },
    'completed': { label: 'Выполнен', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
    'canceled': { label: 'Отменен', color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Заказы</h1>
        <p className="text-slate-500 mt-1">Управление заказами ваших клиентов</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold tracking-wider">
                  <th className="px-6 py-4 w-24">ID</th>
                  <th className="px-6 py-4">Клиент</th>
                  <th className="px-6 py-4">Товары</th>
                  <th className="px-6 py-4">Сумма</th>
                  <th className="px-6 py-4">Статус</th>
                  <th className="px-6 py-4 text-right">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => {
                  const StatusIcon = statusMap[order.status as keyof typeof statusMap]?.icon || Clock;
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{order.customer_name}</p>
                        <p className="text-sm text-slate-500">{order.customer_phone}</p>
                        <p className="text-xs text-slate-400 mt-1">{new Date(order.created_at).toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <ul className="text-sm text-slate-600 space-y-1">
                          {order.items?.map(item => (
                            <li key={item.id} className="flex justify-between gap-4">
                              <span className="truncate max-w-[200px]" title={item.product_title}>{item.product_title}</span>
                              <span className="font-medium text-slate-900">{item.quantity} шт.</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-extrabold text-slate-900 text-lg whitespace-nowrap">
                          {Number(order.total_price).toLocaleString()} ₸
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusMap[order.status as keyof typeof statusMap]?.color || 'bg-slate-100 text-slate-800'}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusMap[order.status as keyof typeof statusMap]?.label || order.status}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2 font-medium shadow-sm cursor-pointer outline-none"
                        >
                          <option value="new">Новый</option>
                          <option value="paid">Оплачен</option>
                          <option value="shipping">В доставке</option>
                          <option value="completed">Выполнен</option>
                          <option value="canceled">Отменен</option>
                        </select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20">
            <PackageX className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-600 mb-2">У вас пока нет заказов</h3>
            <p className="text-slate-400">Когда покупатели сделают заказ, он появится здесь.</p>
          </div>
        )}
      </div>
    </div>
  );
};
