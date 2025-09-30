
"use client"

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { type ProductWithImage } from '@/lib/types';
import { Button } from '@/components/ui/button';

type ProductCarouselProps = {
    products: ProductWithImage[];
    isShowingDetail: boolean;
    setIsShowingDetail: React.Dispatch<React.SetStateAction<boolean>>;
    activeProduct: ProductWithImage | null;
    setActiveProduct: React.Dispatch<React.SetStateAction<ProductWithImage | null>>;
};

export default function ProductCarousel({ products, isShowingDetail, setIsShowingDetail, activeProduct, setActiveProduct }: ProductCarouselProps) {

    const handleNext = () => {
        if (products.length > 0) {
            const list = document.querySelector('.carousel .list') as HTMLElement;
            const firstItem = document.querySelector('.carousel .list .item');
            if (list && firstItem) {
                list.appendChild(firstItem);
                const newActiveIndex = (products.findIndex(p => p.id === activeProduct?.id) + 1) % products.length;
                setActiveProduct(products[newActiveIndex]);
            }
        }
    };

    const handlePrev = () => {
        if (products.length > 0) {
            const list = document.querySelector('.carousel .list') as HTMLElement;
            const lastItem = document.querySelector('.carousel .list .item:last-child');
            if (list && lastItem) {
                list.prepend(lastItem);
                const newActiveIndex = (products.findIndex(p => p.id === activeProduct?.id) - 1 + products.length) % products.length;
                setActiveProduct(products[newActiveIndex]);
            }
        }
    };

    const handleShowDetail = () => {
        setIsShowingDetail(true);
    };

    const handleBack = () => {
        setIsShowingDetail(false);
    };

    return (
        <div className={`carousel ${isShowingDetail ? 'showDetail' : ''}`}>
            <div className="list">
                {products.map((product, index) => (
                    <div className="item" key={product.id}>
                        {product.imageUrl && (
                            <Image
                                src={product.imageUrl}
                                alt={product.name}
                                width={800}
                                height={800}
                                data-ai-hint={product.imageHint}
                            />
                        )}
                        <div className="introduce">
                            <div className="title">Discover</div>
                            <div className="topic font-headline">{product.name}</div>
                            <div className="des">{product.description}</div>
                            <button className="seeMore" onClick={handleShowDetail}>SEE MORE →</button>
                        </div>
                        <div className="detail">
                            <div className="title font-headline">{product.name}</div>
                            <div className="des">{product.description}</div>
                            <div className="specifications">
                                <div>
                                    <p>Category</p>
                                    <p>{product.category}</p>
                                </div>
                            </div>
                            <div className="checkout">
                                <Button asChild>
                                    <Link href="/custom-order">Order Now</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="arrows">
                <button id="prev" onClick={handlePrev}>&lt;</button>
                <button id="next" onClick={handleNext}>&gt;</button>
                <button id="back" onClick={handleBack}>Back</button>
            </div>
        </div>
    );
}

