import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, ShoppingCart, User } from 'lucide-react';
import { useAppContext } from '../context';

export const BottomTabBar: React.FC = () => {
  const { cart } = useAppContext();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    { to: '/', icon: Home, label: 'Главная' },
    { to: '/catalog', icon: Search, label: 'Каталог' },
    { to: '/cart', icon: ShoppingCart, label: 'Корзина', badge: cartCount },
    { to: '/profile', icon: User, label: 'Профиль' },
  ];

  return (
    <div className="absolute bottom-0 w-full bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-40 pb-[max(env(safe-area-inset-bottom),12px)]">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition-colors relative ${
              isActive ? 'text-orange-500' : 'text-slate-400 hover:text-slate-600'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className="relative">
                <item.icon className={`w-6 h-6 ${isActive ? 'fill-orange-50 stroke-orange-500' : 'stroke-2'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
};
