
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useOrder } from '@/context/order-context';
import { Minus, Plus, Trash2, X, ArrowLeft } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

type CartModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export default function CartModal({ isOpen, onOpenChange }: CartModalProps) {
  const { cart, removeFromCart, updateCartItemQuantity, clearCart, customerDetails, setCustomerDetails } = useOrder();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [name, setName] = useState(customerDetails.name || '');
  const [email, setEmail] = useState(customerDetails.email || '');
  const [address, setAddress] = useState('');


  useEffect(() => {
    if (isOpen) {
        setName(customerDetails.name || '');
        setEmail(customerDetails.email || '');
        setAddress('');
        setStep(1);
    }
  }, [isOpen, customerDetails]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleNextStep = () => {
    if (cart.length === 0) {
      toast({
        title: 'Your cart is empty',
        description: 'Please add items to your cart before proceeding.',
        variant: 'destructive',
      });
      return;
    }
    setCustomerDetails({ name, email });
    setStep(2);
  }

  const handleCheckout = () => {
    if (!name || !email || !address) {
        toast({
            title: 'Missing Details',
            description: 'Please fill out all the fields.',
            variant: 'destructive',
        });
        return;
    }
    
    const itemsSummary = cart.map(item => 
      `- ${item.product.name} (x${item.quantity})`
    ).join('\n');

    const emailBody = `
New Order Request:
==================

Customer Name: ${name}
Customer Email: ${email}
Delivery Address: ${address}

Order Items:
${itemsSummary}
    `;

    const mailtoLink = `mailto:info@ruesdelectables.com?subject=${encodeURIComponent(`New Order from ${name || 'Website Customer'}`)}&body=${encodeURIComponent(emailBody)}`;

    window.location.href = mailtoLink;

    let description = `Your order request has been prepared. Please send the email to finalize.`;
    if (name) {
      description += ` Thank you, ${name}!`
    }

    toast({
      title: 'Finalize Your Order',
      description,
    });
    
    clearCart();
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 grid-rows-[auto,1fr,auto] max-h-[90vh]">
        <DialogHeader className="p-6 pb-4 border-b flex flex-row items-center justify-between">
           <div className="flex items-center gap-4">
            {step === 2 && (
                <Button variant="ghost" size="icon" onClick={() => setStep(1)} className="h-8 w-8">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
            )}
            <DialogTitle className="font-headline text-xl">
                {step === 1 ? `Your Cart (${totalItems} items)` : 'Delivery Details'}
            </DialogTitle>
           </div>
        </DialogHeader>
        
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <p className="text-lg font-medium text-muted-foreground">Your cart is empty</p>
            <DialogClose asChild>
                <Button variant="outline" className="mt-4">Continue Shopping</Button>
            </DialogClose>
          </div>
        ) : (
            step === 1 ? (
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
                            <p className="text-sm text-muted-foreground">{item.product.category}</p>
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
                        <Button size="lg" className="w-full" onClick={handleNextStep} disabled={cart.length === 0}>
                            Next
                        </Button>
                    </div>
                </DialogFooter>
              </>
            ) : (
                <>
                <ScrollArea>
                    <div className="p-6 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name-cart">Full Name</Label>
                            <Input id="name-cart" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="email-cart">Email</Label>
                            <Input id="email-cart" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane.doe@example.com" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="address-cart">Delivery Address</Label>
                            <Textarea id="address-cart" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Sweet Street, Dallas, TX" />
                        </div>
                        <div>
                            <p className='font-medium text-sm mt-4 mb-2'>Order Summary</p>
                             <div className='text-sm text-muted-foreground space-y-1'>
                                {cart.map(item => (
                                    <div key={item.product.id} className="flex justify-between">
                                        <span>{item.product.name} (x{item.quantity})</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </ScrollArea>
                <DialogFooter className="p-6 border-t bg-background">
                    <div className="w-full space-y-4">
                         <p className="text-xs text-muted-foreground text-center">You will receive a quote via email after submitting your request.</p>
                        <Button size="lg" className="w-full" onClick={handleCheckout}>
                            Confirm Order
                        </Button>
                    </div>
                </DialogFooter>
                </>
            )
        )}
      </DialogContent>
    </Dialog>
  );
}
