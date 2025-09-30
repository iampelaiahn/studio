
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { type ProductWithImage } from '@/lib/types';

type CustomerDetails = {
  name: string;
  email: string;
};

type OrderContextType = {
  customerDetails: CustomerDetails;
  setCustomerDetails: (details: CustomerDetails) => void;
  bookingDate: Date | null;
  setBookingDate: (date: Date | null) => void;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({ name: '', email: '' });
  const [bookingDate, setBookingDate] = useState<Date | null>(null);

  return (
    <OrderContext.Provider value={{ customerDetails, setCustomerDetails, bookingDate, setBookingDate }}>
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
