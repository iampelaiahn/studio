
'use client';

import React, { useState } from 'react';
import { products } from "@/lib/data"
import { PlaceHolderImages, ImagePlaceholder } from "@/lib/placeholder-images"
import ProductGrid from "./_components/product-grid"
import ProductCarousel from '@/app/shop/_components/product-carousel';
import { type Product as ProductType } from "@/lib/data";

export type ProductWithImage = ProductType & {
    imageUrl?: string;
    imageHint?: string;
};


export default function ProductsPage() {
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
            <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <header className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-headline text-balance">Our Delectables</h1>
                    <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
                        Browse our signature creations, each made with the finest ingredients and a sprinkle of love.
                    </p>
                </header>
                <ProductGrid products={productsWithImages} />
            </div>
        </div>
    )
}

