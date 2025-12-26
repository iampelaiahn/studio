
"use client"

import React, { useState, useMemo } from "react"
import { type ProductWithImage } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductCard } from "./product-card"

type ProductGridProps = {
  products: ProductWithImage[],
  onProductClick: (product: ProductWithImage) => void;
}

export default function ProductGrid({ products, onProductClick }: ProductGridProps) {
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
    uniqueCategories.sort();
    return ["All", ...uniqueCategories];
  }, [products]);
  const [activeTab, setActiveTab] = useState(categories[0]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="flex justify-center">
        <TabsList className="grid w-full max-w-[256px] grid-cols-2 mb-8">
          {categories.map(category => (
            <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
          ))}
        </TabsList>
      </div>
      
      {categories.map(category => (
        <TabsContent key={category} value={category}>
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                {products.filter(p => activeTab === 'All' || p.category === activeTab).map(product => (
                    <ProductCard 
                        key={product.id} 
                        product={product} 
                        onClick={onProductClick} 
                        showDetails={false}
                    />
                ))}
            </div>
            {products.filter(p => activeTab === 'All' || p.category === activeTab).length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                    <p>No products found in this category.</p>
                </div>
            )}
        </TabsContent>
      ))}
    </Tabs>
  )
}
