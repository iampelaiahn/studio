
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { type ProductWithImage } from '@/lib/types';

type CustomerDetails = {
  name: string;
  email: string;
};

export type CartItem = {
  product: ProductWithImage;
  quantity: number;
};

type OrderContextType = {
  customerDetails: CustomerDetails;
  setCustomerDetails: (details: CustomerDetails) => void;
  bookingDate: Date | null;
  setBookingDate: (date: Date | null) => void;
  cart: CartItem[];
  addToCart: (product: ProductWithImage, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({ name: '', email: '' });
  const [bookingDate, setBookingDate] = useState<Date | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: ProductWithImage, quantity: number) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.product.id === product.id);
      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      } else {
        return [...prevCart, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart => 
      prevCart.map(item => 
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  }

  return (
    <OrderContext.Provider value={{ customerDetails, setCustomerDetails, bookingDate, setBookingDate, cart, addToCart, removeFromCart, updateCartItemQuantity, clearCart }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}
