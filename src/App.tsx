/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider, useAppContext } from './context';
import { PublicLayout } from './layouts/PublicLayout';
import { VendorLayout } from './layouts/VendorLayout';
import { Home } from './pages/Home';
import { Cart } from './pages/Cart';
import { Auth } from './pages/Auth';
import { ProductDetail } from './pages/ProductDetail';
import { VendorDashboard } from './pages/VendorDashboard';
import { VendorProducts } from './pages/VendorProducts';
import { VendorOrders } from './pages/VendorOrders';

const PrivateVendorRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAppContext();
  if (!user) return <Navigate to="/auth" />;
  if (user.role !== 'vendor') return <Navigate to="/" />;
  return <>{children}</>;
};

const AuthRedirect = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAppContext();
  if (user) {
    return <Navigate to={user.role === 'vendor' ? '/vendor' : '/'} />;
  }
  return <>{children}</>;
};

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public Routes with Navbar */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
          </Route>
          
          {/* Auth Route without Layout */}
          <Route path="/auth" element={
            <AuthRedirect>
              <Auth />
            </AuthRedirect>
          } />

          {/* Vendor Routes with Sidebar */}
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
        position="bottom-right"
        toastOptions={{
          className: '!rounded-xl !border !border-slate-100 !shadow-lg',
          duration: 4000,
          style: {
            background: '#fff',
            color: '#0f172a',
            fontWeight: 500,
          },
          success: {
            iconTheme: {
              primary: '#f97316', // orange-500
              secondary: '#fff',
            },
          },
        }} 
      />
    </AppProvider>
  );
}
