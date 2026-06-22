/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Cart } from './pages/Cart';
import { Auth } from './pages/Auth';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';
  
  return (
    <>
      {!isAuthPage && <Navbar />}
      <main>
        {children}
      </main>
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </Layout>
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
              primary: '#10b981',
              secondary: '#fff',
            },
          },
        }} 
      />
    </AppProvider>
  );
}
