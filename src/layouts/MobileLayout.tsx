import React from 'react';
import { Outlet } from 'react-router-dom';
import { BottomTabBar } from '../components/BottomTabBar';

export const MobileLayout: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col h-full relative bg-slate-50 overflow-hidden">
      <main className="flex-1 overflow-y-auto scrollbar-hide pb-20">
        <Outlet />
      </main>
      <BottomTabBar />
    </div>
  );
};
