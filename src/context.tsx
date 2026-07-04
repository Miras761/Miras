import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from './api';
import { User, CartItem } from './types';
import toast from 'react-hot-toast';

interface AppContextType {
  user: User | null;
  cart: CartItem[];
  cartCount: number;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  checkout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');
    if (token) {
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        if (parsedUser.role !== 'vendor') fetchCart();
      } else {
        const decoded = parseJwt(token);
        const fetchedUser: User = { 
          id: decoded?.user_id || -1, 
          username: decoded?.username || 'Authorized User', 
          email: '', 
          role: decoded?.role || 'customer' 
        };
        setUser(fetchedUser);
        if (fetchedUser.role !== 'vendor') fetchCart();
      }
    }
  }, []);

  const login = async (credentials: any) => {
    try {
      const { data } = await api.post('/auth/login/', credentials);
      localStorage.setItem('access_token', data.access);
      if (data.refresh) localStorage.setItem('refresh_token', data.refresh);
      
      const decoded = parseJwt(data.access);
      const sessionUser: User = { 
        id: decoded?.user_id || Date.now(), 
        username: credentials.username, 
        email: '', 
        role: decoded?.role || data.role || 'customer' 
      };
      localStorage.setItem('user', JSON.stringify(sessionUser));
      setUser(sessionUser);
      
      if (sessionUser.role === 'customer') {
        await fetchCart();
      } else {
        setCart([]);
      }
      toast.success('Успешный вход в систему');
    } catch (error) {
      toast.error('Ошибка входа. Проверьте данные.');
      throw error;
    }
  };

  const register = async (credentials: any) => {
    try {
      await api.post('/auth/register/', credentials);
      toast.success('Регистрация успешна! Пожалуйста, войдите.');
    } catch (error) {
       toast.error('Ошибка регистрации. Возможно пользователь существует.');
       throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
    setCart([]);
    toast.success('Вы вышли из системы');
  };

  const fetchCart = async () => {
    if (user?.role === 'vendor') return;
    try {
      const { data } = await api.get('/cart/');
      setCart(data);
    } catch (error) {
      console.error('Failed to fetch cart', error);
    }
  };

  const addToCart = async (productId: number) => {
    if (!user) {
      toast.error('Пожалуйста, войдите для добавления в корзину');
      return;
    }
    if (user.role === 'vendor') {
      toast.error('Продавцы не могут делать покупки');
      return;
    }
    try {
      await api.post('/cart/', { product: productId, quantity: 1 });
      await fetchCart();
      toast.success('Добавлено в корзину');
    } catch (error) {
      toast.error('Ошибка при добавлении в корзину');
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    try {
      await api.delete(`/cart/${cartItemId}/`);
      await fetchCart();
      toast.success('Удалено из корзины');
    } catch (error) {
      toast.error('Ошибка при удалении');
    }
  };

  const checkout = async () => {
    try {
      await api.post('/cart/checkout/');
      setCart([]);
      toast.success('Заказ оформлен! Спасибо за покупку.');
    } catch (error) {
      toast.error('Ошибка при оформлении заказа');
    }
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        user,
        cart,
        cartCount,
        login,
        register,
        logout,
        fetchCart,
        addToCart,
        removeFromCart,
        checkout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
