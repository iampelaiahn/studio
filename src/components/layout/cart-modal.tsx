
"use client";

import React from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useOrder } from '@/context/order-context';
import { Minus, Plus, Trash2, X } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

type CartModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export default function CartModal({ isOpen, onOpenChange }: CartModalProps) {
  const { cart, removeFromCart, updateCartItemQuantity, clearCart, customerDetails } = useOrder();
  const { toast } = useToast();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => {
    const price = parseFloat(item.product.price?.replace('$', '') || '0');
    return sum + price * item.quantity;
  }, 0);

  const handleCheckout = () => {
    if(cart.length === 0) {
      toast({
        title: 'Your cart is empty',
        description: 'Please add items to your cart before checking out.',
        variant: 'destructive',
      });
      return;
    }
    
    // 1. Format the order details for the email body
    const itemsSummary = cart.map(item => 
      `- ${item.product.name} (x${item.quantity}) - ${item.product.price}`
    ).join('\n');

    const emailBody = `
New Order Details:
==================

Customer Name: ${customerDetails.name || 'Not provided'}
Customer Email: ${customerDetails.email || 'Not provided'}

Order Items:
${itemsSummary}

Subtotal: $${subtotal.toFixed(2)}
    `;

    // 2. Create the mailto link
    const mailtoLink = `mailto:info@ruesdelectables.com?subject=${encodeURIComponent(`New Order from ${customerDetails.name || 'Website Customer'}`)}&body=${encodeURIComponent(emailBody)}`;

    // 3. Open the email client
    window.location.href = mailtoLink;

    // 4. Show confirmation and clear the cart
    let description = `Your order has been submitted.`;
    if (customerDetails.name) {
      description += ` Thank you, ${customerDetails.name}!`
    }

    toast({
      title: 'Order Submitted!',
      description,
    });
    
    clearCart();
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 grid-rows-[auto,1fr,auto] max-h-[90vh]">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="font-headline text-xl">
            Your Cart ({totalItems} items)
          </DialogTitle>
        </DialogHeader>
        
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <p className="text-lg font-medium text-muted-foreground">Your cart is empty</p>
            <DialogClose asChild>
                <Button variant="outline" className="mt-4">Continue Shopping</Button>
            </DialogClose>
          </div>
        ) : (
          <>
            <ScrollArea>
              <div className="p-6 space-y-4">
                {cart.map(item => (
                  <div key={item.product.id} className="flex items-start gap-4">
                    <div className="relative w-20 h-20 rounded-md overflow-hidden">
                      {item.product.imageUrl && (
                        <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">{item.product.price}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateCartItemQuantity(item.product.id, item.quantity - 1)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateCartItemQuantity(item.product.id, item.quantity + 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => removeFromCart(item.product.id)}>
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <DialogFooter className="p-6 border-t bg-background">
                <div className="w-full space-y-4">
                    <div className="flex justify-between items-center font-medium">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">Taxes and shipping calculated at checkout.</p>
                    <Button size="lg" className="w-full" onClick={handleCheckout}>
                        Proceed to Checkout
                    </Button>
                </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
