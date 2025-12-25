
"use client"

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent } from '@/components/ui/card';

type Cake = {
    name: string;
    description: string;
    weight: string;
    size: string;
    productionTime: string;
    imageId: string;
}

const carouselCakes: Omit<Cake, 'price'>[] = [
    {
        name: 'Triple Chocolate Fudge',
        description: 'Decadent triple-layered chocolate fudge cake with a rich ganache frosting.',
        weight: '2.4 KG',
        size: '22 CM',
        productionTime: '72 H',
        imageId: 'hero-1'
    },
    {
        name: 'Chocolate Dream',
        description: 'Rich dark chocolate cake with a molten lava center.',
        weight: '1.8 KG',
        size: '20 CM',
        productionTime: '48 H',
        imageId: 'hero-2'
    },
    {
        name: 'Rainbow Delight',
        description: 'A vibrant six-layered rainbow cake with vanilla frosting.',
        weight: '2.8 KG',
        size: '24 CM',
        productionTime: '96 H',
        imageId: 'hero-3'
    },
    {
        name: 'Sweet Swirl',
        description: 'A classic vanilla cupcake with a beautiful rose frosting swirl.',
        weight: '0.2 KG',
        size: '8 CM',
        productionTime: '24 H',
        imageId: 'hero-4'
    }
];

export default function HeroCarousel() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [currentCake, setCurrentCake] = useState(carouselCakes[0]);

  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  )

  useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap())

    const onSelect = () => {
      const selectedIndex = api.selectedScrollSnap();
      setCurrent(selectedIndex);
      setCurrentCake(carouselCakes[selectedIndex]);
    };

    api.on("select", onSelect)
    
    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  const heroImages = carouselCakes.map(cake => {
      const placeholder = PlaceHolderImages.find((img) => img.id === cake.imageId)
      return {
          ...cake,
          imageUrl: placeholder?.imageUrl,
          imageHint: placeholder?.imageHint,
          alt: placeholder?.description
      }
  })

  return (
    <div className="relative w-full">
        <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
                <Carousel 
                    setApi={setApi}
                    plugins={[plugin.current]}
                    className="w-full"
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                >
                    <CarouselContent>
                        {heroImages.map((img, index) => (
                            <CarouselItem key={index}>
                                <div className="relative w-full aspect-square">
                                    {img.imageUrl && (
                                        <Image
                                            src={img.imageUrl}
                                            alt={img.alt || ''}
                                            fill
                                            className="object-contain"
                                            priority={index === 0}
                                            data-ai-hint={img.imageHint}
                                        />
                                    )}
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
            
            <div className="text-sm w-full space-y-4">
                 <Card className="bg-card text-card-foreground border-border/50">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-base font-bold">Cake</span>
                            <Link href="/custom-order">
                                <button className="bg-primary/20 text-primary-foreground rounded-full p-1 hover:bg-primary/30"><Plus className="w-4 h-4" /></button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
                <div className="flex flex-col gap-4 text-foreground">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-muted-foreground">Cake weight</p>
                            <p>{currentCake.weight}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Cake size</p>
                            <p>{currentCake.size}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Production time</p>
                        <p>{currentCake.productionTime}</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex justify-center mt-6">
            <div className="flex gap-2">
                {carouselCakes.map((_, i) => (
                    <button key={i} onClick={() => api?.scrollTo(i)} className={`w-2 h-2 rounded-full ${i === current ? 'bg-primary' : 'bg-primary/50'}`}></button>
                ))}
            </div>
        </div>
    </div>
  )
}
