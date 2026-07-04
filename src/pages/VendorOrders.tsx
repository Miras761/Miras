import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Order } from '../types';
import toast from 'react-hot-toast';
import { BottomSheet } from '../components/BottomSheet';
import { ChevronDown, Package, Clock, CheckCircle2, Truck, XCircle } from 'lucide-react';

const STATUS_MAP: Record<string, { label: string, color: string, icon: any }> = {
  'new': { label: 'Новый', color: 'bg-blue-100 text-blue-700', icon: Clock },
  'paid': { label: 'Оплачен', color: 'bg-purple-100 text-purple-700', icon: CheckCircle2 },
  'shipping': { label: 'В доставке', color: 'bg-orange-100 text-orange-700', icon: Truck },
  'completed': { label: 'Завершен', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  'canceled': { label: 'Отменен', color: 'bg-red-100 text-red-700', icon: XCircle },
};

export const VendorOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  const [isStatusSheetOpen, setIsStatusSheetOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/vendor/orders/');
      setOrders(res.data);
    } catch (error) {
      toast.error('Ошибка загрузки заказов');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!selectedOrder) return;
    try {
      await api.patch(`/vendor/orders/${selectedOrder.id}/`, { status });
      toast.success('Статус обновлен');
      setIsStatusSheetOpen(false);
      fetchOrders();
    } catch (error) {
      toast.error('Не удалось обновить статус');
    }
  };

  const openStatusSheet = (order: Order) => {
    setSelectedOrder(order);
    setIsStatusSheetOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-extrabold text-slate-900 mb-4">Заказы</h2>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-100">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 mb-1">Нет заказов</h3>
          <p className="text-slate-500 text-sm">У вас пока нет активных заказов.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const StatusIcon = STATUS_MAP[order.status]?.icon || Clock;
            return (
              <div key={order.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer active:bg-slate-50 transition-colors"
                  onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900">Заказ #{order.id}</span>
                      <span className="font-extrabold text-slate-900">{Number(order.total_price).toLocaleString()} ₸</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">{order.customer_name}</span>
                      <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase flex items-center gap-1 ${STATUS_MAP[order.status]?.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {STATUS_MAP[order.status]?.label}
                      </div>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-slate-400 ml-3 transition-transform ${expandedId === order.id ? 'rotate-180' : ''}`} />
                </div>
                
                {expandedId === order.id && (
                  <div className="p-4 bg-slate-50 border-t border-slate-100">
                    <div className="mb-4">
                      <p className="text-xs text-slate-500 mb-1">Телефон клиента:</p>
                      <p className="text-sm font-medium text-slate-900">{order.customer_phone || 'Не указан'}</p>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-xs text-slate-500 mb-1">Товары:</p>
                      {order.items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm bg-white p-2 rounded-lg border border-slate-100">
                          <span className="text-slate-900 line-clamp-1 flex-1 pr-2">{item.product_title}</span>
                          <span className="text-slate-500 font-medium whitespace-nowrap">{item.quantity} шт × {item.price} ₸</span>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); openStatusSheet(order); }}
                      className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl text-sm active:scale-95 transition-transform"
                    >
                      Изменить статус
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <BottomSheet isOpen={isStatusSheetOpen} onClose={() => setIsStatusSheetOpen(false)}>
        <h3 className="text-xl font-extrabold text-slate-900 mb-4 text-center">Статус заказа #{selectedOrder?.id}</h3>
        <div className="space-y-2">
          {Object.entries(STATUS_MAP).map(([key, { label, color, icon: Icon }]) => (
            <button
              key={key}
              onClick={() => handleStatusChange(key)}
              className={`w-full p-4 rounded-2xl flex items-center gap-3 active:scale-95 transition-transform border ${
                selectedOrder?.status === key ? 'border-slate-900 bg-slate-50' : 'border-slate-100 bg-white'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-900 text-base flex-1 text-left">{label}</span>
              {selectedOrder?.status === key && (
                <CheckCircle2 className="w-5 h-5 text-slate-900" />
              )}
            </button>
          ))}
        </div>
      </BottomSheet>
    </div>
  );
};
