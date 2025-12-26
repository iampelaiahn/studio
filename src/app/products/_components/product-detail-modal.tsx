
"use client";

import React from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { type ProductWithImage } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useOrder } from '@/context/order-context';
import { X } from 'lucide-react';

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
      <DialogContent className="sm:max-w-2xl max-h-[70vh] p-4 md:p-6 flex flex-col gap-4">
        <DialogTitle className="sr-only">{product.name || 'Product Details'}</DialogTitle>
        
        <div className="relative aspect-square w-full h-full overflow-hidden rounded-md">
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
        
        <div className="w-full">
            <Button asChild size="lg" className='w-full' onClick={handleRequestOrder}>
                <Link href="/custom-order">Request a Custom Order</Link>
            </Button>
        </div>

        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
        </DialogClose>

      </DialogContent>
    </Dialog>
  );
}
