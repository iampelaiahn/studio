
"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { type ProductWithImage } from '@/lib/types';
import { Button } from '@/components/ui/button';

type ProductCarouselProps = {
    products: ProductWithImage[];
    isShowingDetail: boolean;
    setIsShowingDetail: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ProductCarousel({ products, isShowingDetail, setIsShowingDetail }: ProductCarouselProps) {
    const [carouselProducts, setCarouselProducts] = useState<ProductWithImage[]>([]);
    
    useEffect(() => {
        setCarouselProducts(products);
    }, [products]);

    const activeProduct = carouselProducts.length > 1 ? carouselProducts[1] : carouselProducts[0];

    const handleNext = () => {
        setCarouselProducts(prev => {
            const newList = [...prev];
            const first = newList.shift();
            if (first) {
                newList.push(first);
            }
            return newList;
        });
    };

    const handlePrev = () => {
        setCarouselProducts(prev => {
            const newList = [...prev];
            const last = newList.pop();
            if (last) {
                newList.unshift(last);
            }
            return newList;
        });
    };
    
    const handleShowDetail = () => {
        setIsShowingDetail(true);
    };

    const handleBack = () => {
        setIsShowingDetail(false);
    };

    if (!carouselProducts.length) {
        return null;
    }

    return (
        <div className={`carousel ${isShowingDetail ? 'showDetail' : ''}`}>
            <div className="list">
                {carouselProducts.map((product) => (
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
