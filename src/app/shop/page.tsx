
'use client';
import { products } from "@/lib/data"
import { PlaceHolderImages, ImagePlaceholder } from "@/lib/placeholder-images"
import React, { useState } from 'react';
import ProductCarousel from "./_components/product-carousel";
import { type ProductWithImage } from "@/lib/types";
import ProductGrid from "@/components/shared/product-grid";

export default function ShopPage() {
    const productsWithImages: ProductWithImage[] = products.map(product => {
        const image = PlaceHolderImages.find((img: ImagePlaceholder) => img.id === product.imageId)
        return { ...product, imageUrl: image?.imageUrl, imageHint: image?.imageHint }
    })
    
    const [isShowingDetail, setIsShowingDetail] = useState(false);
    const [activeProduct, setActiveProduct] = useState<ProductWithImage | null>(productsWithImages[1]);

    return (
        <div className="bg-background">
            <section className="relative py-16 md:py-24 bg-background text-foreground overflow-hidden -mt-[5vh] z-0">
                <ProductCarousel 
                    products={productsWithImages} 
                    isShowingDetail={isShowingDetail}
                    setIsShowingDetail={setIsShowingDetail}
                    activeProduct={activeProduct}
                    setActiveProduct={setActiveProduct}
                />
            </section>
            
            <section className="relative container mx-auto px-4 py-8 md:py-12 -mt-72 z-10 bg-background/80 backdrop-blur-md rounded-t-xl">
                 <header className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-headline text-balance">Try our cakes</h1>
                    <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
                        Browse our signature creations, each made with the finest ingredients and a sprinkle of love.
                    </p>
                </header>
                <ProductGrid products={productsWithImages} />
            </section>
        </div>
    )
}
