"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { type GalleryImage } from '../page'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'

type GalleryGridProps = {
  images: GalleryImage[]
}

export default function GalleryGrid({ images }: GalleryGridProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <Dialog key={image.id}>
            <DialogTrigger asChild>
              <Card
                className="overflow-hidden cursor-pointer group"
                onClick={() => setSelectedImage(image)}
              >
                <CardContent className="p-0">
                  <div className="aspect-square relative">
                    <Image
                      src={image.imageUrl}
                      alt={image.description}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={image.imageHint}
                    />
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-full p-2">
              {selectedImage && (
                <div className="relative aspect-video">
                  <Image
                    src={selectedImage.imageUrl}
                    alt={selectedImage.description}
                    fill
                    className="object-contain"
                    data-ai-hint={selectedImage.imageHint}
                  />
                </div>
              )}
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </>
  )
}
