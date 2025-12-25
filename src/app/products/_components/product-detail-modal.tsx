
"use client";

import React from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { type ProductWithImage } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useOrder } from '@/context/order-context';

type ProductDetailModalProps = {
  product: ProductWithImage;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export default function ProductDetailModal({ product, isOpen, onOpenChange }: ProductDetailModalProps) {
  const { setProductDetails } = useOrder();

  if (!product) return null;

  const handleRequestOrder = () => {
    setProductDetails({
      productType: product.category,
      flavor: product.name,
      icing: '' // No icing data in product, so we leave it empty
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl grid-rows-[auto,1fr,auto] p-0 max-h-[90vh]">
        <div className="grid md:grid-cols-2">
            <div className="relative aspect-square md:aspect-auto">
                {product.imageUrl && (
                    <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-contain rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                    data-ai-hint={product.imageHint}
                    />
                )}
            </div>
            <div className="flex flex-col">
                <DialogHeader className="p-6">
                    
                    <DialogDescription className="pt-2 text-base">
                        <span className="text-muted-foreground">{product.category}</span>
                    </DialogDescription>
                </DialogHeader>
                <div className="px-6 pb-6 flex-grow overflow-y-auto">
                    <p className='text-foreground'>{product.description}</p>
                </div>
                <div className="p-6 border-t">
                    <Button asChild size="lg" className='w-full' onClick={handleRequestOrder}>
                        <Link href="/custom-order">Request a Custom Order</Link>
                    </Button>
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
