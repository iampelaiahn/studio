import { galleryImages } from "@/lib/data"
import { PlaceHolderImages, ImagePlaceholder } from "@/lib/placeholder-images"
import GalleryGrid from "./_components/gallery-grid"

export type GalleryImage = (typeof galleryImages)[0] & ImagePlaceholder;

export default function GalleryPage() {
    const images: GalleryImage[] = galleryImages.map(galleryImage => {
        const image = PlaceHolderImages.find((img: ImagePlaceholder) => img.id === galleryImage.id)
        if (!image) {
            // This case should ideally not happen if data is consistent
            return {
                id: galleryImage.id,
                description: 'Placeholder image',
                imageUrl: 'https://picsum.photos/seed/fallback/800/600',
                imageHint: 'fallback image'
            };
        }
        return { ...galleryImage, ...image }
    })

    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-headline text-balance">Our Gallery</h1>
                <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
                    A collection of our favorite creations. Find inspiration for your next custom order!
                </p>
            </header>
            <GalleryGrid images={images} />
        </div>
    )
}
