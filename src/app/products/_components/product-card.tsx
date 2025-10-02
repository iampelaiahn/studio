
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { type ProductWithImage } from '@/lib/types'

type ProductCardProps = {
  product: ProductWithImage,
  onClick: (product: ProductWithImage) => void
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <Card 
        className="flex flex-col overflow-hidden h-full cursor-pointer group"
        onClick={() => onClick(product)}
    >
      <CardHeader className="p-0">
        {product.imageUrl && (
            <div className="relative aspect-video overflow-hidden">
            <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-contain group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                data-ai-hint={product.imageHint}
            />
            </div>
        )}
      </CardHeader>
      <CardContent className="p-6 flex-grow flex flex-col">
        <CardTitle className="font-headline text-2xl mb-2">{product.name}</CardTitle>
        <CardDescription className="flex-grow">{product.description}</CardDescription>
      </CardContent>
    </Card>
  )
}
