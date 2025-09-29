
"use client"

import React, { useState, useMemo } from "react"
import { type ProductWithImage } from "../page"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductCard } from "./product-card"

type ProductGridProps = {
  products: ProductWithImage[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  const categories = useMemo(() => ["All", ...Array.from(new Set(products.map(p => p.category)))], [products]);
  const [activeTab, setActiveTab] = useState(categories[0]);

  const filteredProducts = useMemo(() => {
    if (activeTab === "All") return products;
    return products.filter(p => p.category === activeTab);
  }, [activeTab, products]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="flex justify-center">
        <TabsList className="grid w-full max-w-md grid-cols-2 md:grid-cols-4 mb-8">
          {categories.map(category => (
            <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
          ))}
        </TabsList>
      </div>
      
      {categories.map(category => (
        <TabsContent key={category} value={category}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.filter(p => activeTab === 'All' || p.category === activeTab).map(product => (
                    <ProductCard key={product.id} product={product} />
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
