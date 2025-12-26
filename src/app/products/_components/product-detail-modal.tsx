
"use client";

import React from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
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
      <DialogContent className="sm:max-w-3xl p-0 max-h-[90vh] flex flex-col">
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        
        <div className="relative h-[90%] w-full">
            {product.imageUrl && (
                <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-contain rounded-t-lg"
                data-ai-hint={product.imageHint}
                />
            )}
        </div>
        
        <div className="h-[10%] p-4 flex items-center justify-center border-t">
            <Button asChild size="lg" className='w-full' onClick={handleRequestOrder}>
                <Link href="/custom-order">Request a Custom Order</Link>
            </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
