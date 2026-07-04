import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PackageSearch, ClipboardList, LogOut } from 'lucide-react';
import { useAppContext } from '../context';

export const VendorLayout: React.FC = () => {
  const { logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/profile');
  };

  const navItems = [
    { to: '/vendor', icon: LayoutDashboard, label: 'Обзор', end: true },
    { to: '/vendor/products', icon: PackageSearch, label: 'Товары' },
    { to: '/vendor/orders', icon: ClipboardList, label: 'Заказы' },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Top Header */}
      <header className="bg-slate-900 text-white px-4 py-4 flex items-center justify-between z-10 shadow-lg relative">
        <h1 className="text-lg font-extrabold tracking-tight">Кабинет продавца</h1>
        <button onClick={handleLogout} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 transition-all">
          <LogOut className="w-5 h-5 text-white" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto scrollbar-hide pb-20">
        <Outlet />
      </main>

      {/* Vendor Bottom Tab Bar */}
      <div className="absolute bottom-0 w-full bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-40 pb-[max(env(safe-area-inset-bottom),12px)]">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 transition-colors relative ${
                isActive ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                <span className="text-[10px] font-bold">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};
