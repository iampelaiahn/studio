
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { type ProductWithImage } from '@/lib/types';
import { Minus, Plus, ShoppingCart, CheckCircle } from 'lucide-react';
import { useOrder } from '@/context/order-context';

type CheckoutModalProps = {
  product: ProductWithImage;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export default function CheckoutModal({ product, isOpen, onOpenChange }: CheckoutModalProps) {
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const { customerDetails, addToCart } = useOrder();

  const handleAddToCart = () => {
    addToCart(product, quantity);
    
    let description = `${quantity} x "${product.name}" has been added to your cart.`;
    if (customerDetails.name) {
      description += ` Ready to checkout, ${customerDetails.name}?`
    }

    toast({
      title: 'Added to cart!',
      description,
    });
    onOpenChange(false);
  };
  
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        onOpenChange(open);
        if(open) {
            setQuantity(1); // Reset quantity when modal opens
        }
    }}>
      <DialogContent className="max-w-4xl w-full p-0">
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-square md:aspect-auto">
            {product.imageUrl && (
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover rounded-l-lg"
                    data-ai-hint={product.imageHint}
                />
            )}
          </div>
          <div className="p-8 flex flex-col">
              <DialogHeader>
                <DialogTitle className="text-3xl font-headline text-foreground">{product.name}</DialogTitle>
                <DialogDescription className="sr-only">
                    Checkout modal for {product.name}. You can select quantity and add to cart.
                </DialogDescription>
              </DialogHeader>

            <div>
              <p className="text-muted-foreground mt-2">{product.category}</p>
              <Separator className="my-4" />
              <p className="text-sm text-muted-foreground">{product.description}</p>
              <p className="text-4xl font-bold text-foreground my-6">{product.price}</p>
            </div>

            <div className="mt-auto space-y-6">
                <div className="flex items-center gap-4">
                    <p className="font-medium">Quantity:</p>
                    <div className="flex items-center gap-2 border rounded-md">
                        <Button variant="ghost" size="icon" onClick={decrementQuantity} className='h-10 w-10'>
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">{quantity}</span>
                         <Button variant="ghost" size="icon" onClick={incrementQuantity} className='h-10 w-10'>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

              <div className="flex gap-4">
                <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
              </div>
               <p className="text-xs text-center text-muted-foreground">
                Free delivery on orders over $30.0
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
