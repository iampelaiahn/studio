
'use client';

import React, { useState, useEffect } from 'react';
import { products as staticProducts } from "@/lib/data"
import { PlaceHolderImages, ImagePlaceholder } from "@/lib/placeholder-images"
import ProductGrid from "./_components/product-grid"
import ProductCarousel from '@/app/shop/_components/product-carousel';
import { type ProductWithImage } from "@/lib/types";
import ProductDetailModal from './_components/product-detail-modal';

export default function ProductsPage() {
    const [products, setProducts] = useState(staticProducts);

    useEffect(() => {
        const savedProducts = localStorage.getItem('customProducts');
        if (savedProducts) {
            setProducts(prev => [...prev, ...JSON.parse(savedProducts)]);
        }
    }, []);

    const productsWithImages: ProductWithImage[] = products.map(product => {
        const image = PlaceHolderImages.find((img: ImagePlaceholder) => img.id === product.imageId)
        return { ...product, imageUrl: image?.imageUrl, imageHint: image?.imageHint }
    })

    const [isCarouselShowingDetail, setIsCarouselShowingDetail] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductWithImage | null>(null);

    const handleProductClick = (product: ProductWithImage) => {
        setSelectedProduct(product);
    };

    const handleCloseModal = () => {
        setSelectedProduct(null);
    };

    return (
        <div className="bg-background">
            <section className="relative py-16 md:py-24 bg-background text-foreground overflow-hidden -mt-[5vh] z-0">
                <ProductCarousel
                    products={productsWithImages}
                    isShowingDetail={isCarouselShowingDetail}
                    setIsShowingDetail={setIsCarouselShowingDetail}
                />
            </section>
            <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <header className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-headline text-balance">Our Delectables</h1>
                    <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
                        Browse our signature creations, each made with the finest ingredients and a sprinkle of love.
                    </p>
                </header>
                <ProductGrid products={productsWithImages} onProductClick={handleProductClick} />
            </div>
             {selectedProduct && (
                <ProductDetailModal
                    product={selectedProduct}
                    isOpen={!!selectedProduct}
                    onOpenChange={handleCloseModal}
                />
            )}
        </div>
    )
}
