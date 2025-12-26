
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
      <DialogContent className="sm:max-w-2xl max-h-[70vh] flex flex-col p-4 md:p-6">
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        
        <div className="flex-grow flex flex-col justify-center items-center gap-4">
          <div className="relative w-full aspect-[4/3]">
            {product.imageUrl && (
                <Image
                src={product.imageUrl}
                alt={product.name || 'A cake from Rue\'s Delectables'}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                data-ai-hint={product.imageHint}
              />
            )}
          </div>
        </div>
        
        <div className="flex-shrink-0 pt-4">
            <Button asChild size="lg" className='w-full' onClick={handleRequestOrder}>
                <Link href="/custom-order">Request a Custom Order</Link>
            </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
