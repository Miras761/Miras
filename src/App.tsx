/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider, useAppContext } from './context';
import { MobileLayout } from './layouts/MobileLayout';
import { VendorLayout } from './layouts/VendorLayout';
import { Home } from './pages/Home';
import { Cart } from './pages/Cart';
import { Profile } from './pages/Profile';
import { ProductDetail } from './pages/ProductDetail';
import { VendorDashboard } from './pages/VendorDashboard';
import { VendorProducts } from './pages/VendorProducts';
import { VendorOrders } from './pages/VendorOrders';

const PrivateVendorRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAppContext();
  if (!user) return <Navigate to="/profile" />;
  if (user.role !== 'vendor') return <Navigate to="/" />;
  return <>{children}</>;
};

export default function App() {
  return (
    <div className="bg-slate-200 min-h-screen flex items-center justify-center font-sans">
      <div className="w-full max-w-md h-[100dvh] bg-slate-50 relative overflow-hidden sm:shadow-2xl sm:rounded-[2.5rem] sm:h-[844px] flex flex-col">
        <AppProvider>
          <Router>
            <Routes>
              {/* Mobile Routes with Bottom Tab Bar */}
              <Route element={<MobileLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
              
              {/* Product Detail - Full Screen */}
              <Route path="/product/:id" element={<ProductDetail />} />

              {/* Vendor Routes */}
              <Route path="/vendor" element={
                <PrivateVendorRoute>
                  <VendorLayout />
                </PrivateVendorRoute>
              }>
                <Route index element={<VendorDashboard />} />
                <Route path="products" element={<VendorProducts />} />
                <Route path="orders" element={<VendorOrders />} />
              </Route>
            </Routes>
          </Router>
          <Toaster 
            position="top-center"
            toastOptions={{
              className: '!rounded-2xl !shadow-lg !font-medium !text-sm mt-4',
              duration: 3000,
              style: {
                background: '#334155',
                color: '#fff',
              },
              success: {
                iconTheme: {
                  primary: '#f97316',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AppProvider>
      </div>
    </div>
  );
}
