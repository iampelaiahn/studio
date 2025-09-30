
"use client";

import React,  { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { type ProductWithImage } from '@/lib/types';
import { Button } from '@/components/ui/button';
import CheckoutModal from './checkout-modal';

type ProductCarouselProps = {
    products: ProductWithImage[];
    isShowingDetail: boolean;
    setIsShowingDetail: (isShowing: boolean) => void;
    activeProduct: ProductWithImage | null;
    setActiveProduct: (product: ProductWithImage) => void;
}

export default function ProductCarousel({ products, isShowingDetail, setIsShowingDetail, activeProduct, setActiveProduct }: ProductCarouselProps) {
    const listRef = useRef<HTMLDivElement>(null);
    const carouselRef = useRef<HTMLDivElement>(null);
    const unacceptClickTimeout = useRef<NodeJS.Timeout | null>(null);
    const autoSlideInterval = useRef<NodeJS.Timeout | null>(null);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const showSlider = useCallback((type: 'next' | 'prev') => {
        if (!carouselRef.current) return;
        carouselRef.current.classList.remove('next', 'prev');
        
        const list = listRef.current;
        if (list) {
            const items = list.querySelectorAll('.item');
            if (type === 'next') {
                list.appendChild(items[0]);
                carouselRef.current?.classList.add('next');
            } else {
                list.prepend(items[items.length - 1]);
                carouselRef.current?.classList.add('prev');
            }
            
            const activeItem = list.querySelector('.item:nth-child(2)');
            const activeId = activeItem?.getAttribute('data-id');
            const newActiveProduct = products.find(p => p.id === activeId);
            if (newActiveProduct) {
                setActiveProduct(newActiveProduct);
            }
        }
        
        if (unacceptClickTimeout.current) clearTimeout(unacceptClickTimeout.current);
        unacceptClickTimeout.current = setTimeout(() => {
            // No need to do anything here, just preventing clicks during animation
        }, 2000);
    }, [products, setActiveProduct]);

    const stopAutoSlider = useCallback(() => {
        if (autoSlideInterval.current) {
            clearInterval(autoSlideInterval.current);
        }
    }, []);

    const startAutoSlider = useCallback(() => {
        stopAutoSlider();
        autoSlideInterval.current = setInterval(() => {
            showSlider('next');
        }, 10000);
    }, [stopAutoSlider, showSlider]);
    
    useEffect(() => {
        const nextButton = document.getElementById('next');
        const prevButton = document.getElementById('prev');
        if (nextButton) nextButton.onclick = () => { showSlider('next'); startAutoSlider(); };
        if (prevButton) prevButton.onclick = () => { showSlider('prev'); startAutoSlider(); };
        
        startAutoSlider();
        return () => stopAutoSlider();
    }, [showSlider, startAutoSlider, stopAutoSlider]);

    const handleSeeMoreClick = () => {
        setIsShowingDetail(true);
        stopAutoSlider();
    };

    const handleBackClick = () => {
        setIsShowingDetail(false);
        startAutoSlider();
    };

    const handleBuyNowClick = () => {
        stopAutoSlider();
        setIsCheckoutOpen(true);
    };

    useEffect(() => {
        const backButton = document.getElementById('back');
        if (backButton) {
            backButton.onclick = handleBackClick;
        }
    });

    return (
        <>
            <div ref={carouselRef} className={`carousel ${isShowingDetail ? 'showDetail' : ''}`}>
                <div ref={listRef} className="list">
                    {products.map((product) => (
                        <div className="item" key={product.id} data-id={product.id}>
                            {product.imageUrl && (
                                 <Image 
                                    src={product.imageUrl} 
                                    alt={product.name} 
                                    width={800} 
                                    height={800}
                                    className="object-contain"
                                    data-ai-hint={product.imageHint}
                                />
                            )}
                            <div className="introduce">
                                <div className="title">Discover</div>
                                <div className="topic">{product.name}</div>
                                <div className="des">{product.description}</div>
                                <div className="flex items-center gap-4 mt-4">
                                    <button className="seeMore" onClick={handleSeeMoreClick}>
                                        SEE MORE &#8594;
                                    </button>
                                     <div className="relative">
                                        <Button
                                            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full animate-bounce"
                                            onClick={handleBuyNowClick}
                                        >
                                            Order Now
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="detail">
                                <div className="title">{product.name}</div>
                                <div className="des">{product.description}</div>
                                <div className="specifications">
                                    {product.category && <div><p>Category</p><p>{product.category}</p></div>}
                                    {product.price && <div><p>Price</p><p>{product.price}</p></div>}
                                </div>
                                <div className="checkout">
                                    <Button onClick={handleBuyNowClick}>ADD TO CART</Button>
                                    <Button variant="outline" onClick={handleBuyNowClick}>CHECKOUT</Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="arrows">
                    <button id="prev">&lt;</button>
                    <button id="next">&gt;</button>
                </div>
                <button id="back">Back</button>
            </div>
            {activeProduct && (
                <CheckoutModal 
                    product={activeProduct}
                    isOpen={isCheckoutOpen}
                    onOpenChange={(isOpen) => {
                        setIsCheckoutOpen(isOpen);
                        if (!isOpen) {
                            startAutoSlider();
                        }
                    }}
                />
            )}
        </>
    );
};
