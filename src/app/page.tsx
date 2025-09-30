
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import HeroCarousel from './_components/hero-carousel';
import Image from 'next/image';
import { Instagram, Mail } from 'lucide-react';

function TiktokIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.65 4.24 1.76v3.45c-1.92.05-3.84.09-5.75.14-1.24.03-2.48.06-3.73.09v6.52c0 1.25-.33 2.5-1 3.61-1.02 1.6-2.9 2.16-4.82 1.57-1.92-.59-3.26-2.13-3.48-4.05-.22-1.92.56-3.8 2.18-4.94 1.62-1.14 3.63-1.42 5.43-.9v-6.52c.01-1.26.32-2.51.98-3.62 1.02-1.66 2.9-2.22 4.82-1.63.18.05.35.11.52.17.01-.12.02-.23.02-.34.01-1.53.01-3.07.01-4.6 0-.63-.03-1.27-.04-1.9-.01-.63-.03-1.27-.04-1.9z" />
        </svg>
    )
}

function WhatsappIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
    )
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh">
      <main className="flex-1">
        <section className="relative bg-background pt-24 md:pt-32 lg:pt-40">
          <div className="container mx-auto px-4 z-10 relative">
            <div className="flex flex-col gap-8 items-center">
              <div className="relative text-center">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-headline font-bold text-foreground text-balance">
                  Baking enthusiast, all things cake lover.
                </h1>
                <p className="mt-4 max-w-xl mx-auto text-lg text-muted-foreground">
                  Indulge your tastebuds with the flakiest, moist and tastiest treats. There’s a treat to make every occasion memorable.
                </p>
                <div className="mt-8 flex gap-4 justify-center">
                  <Button size="lg" asChild className="rounded-full">
                    <Link href="/custom-order">Order Now</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="rounded-full">
                    <Link href="/products">View all</Link>
                  </Button>
                </div>
              </div>

              <div className="w-full max-w-4xl mx-auto pt-8">
                <HeroCarousel />
              </div>
            </div>
          </div>
        </section>

        <section
          className="relative text-background overflow-hidden py-24 md:py-32 lg:py-40 bg-foreground"
          style={{ marginTop: '90px' }}
        >
        <div className="lg:block absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 lg:translate-x-1/2">
          <div className="w-[150px] h-[150px] lg:w-[250px] lg:h-[250px] rounded-full bg-primary/10"></div>
        </div>
        <div className="lg:block absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 lg:-translate-x-1/2">
          <div className="w-[100px] h-[100px] lg:w-[200px] lg:h-[200px] rounded-full bg-accent/10"></div>
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div className="relative w-full max-w-sm mx-auto md:max-w-none">
              <div className="absolute -top-4 -left-4 w-full h-full bg-accent/20 rounded-3xl transform -rotate-6"></div>
              <div className="relative bg-background rounded-3xl overflow-hidden shadow-lg">
                <div className="aspect-w-1 aspect-h-1">
                  <Image
                    src="https://i.imgur.com/zaa3MSY.png"
                    alt="Meet the baker"
                    width={800}
                    height={800}
                    className="object-cover"
                    data-ai-hint="baker portrait"
                  />
                </div>
              </div>
            </div>
            <div className="text-center lg:text-left">
              <h2 className="text-3xl lg:text-4xl font-headline text-background mb-4">
                Meet Rudo Konga: The Baker Behind the Bakes
              </h2>
              <p className="text-muted-foreground mb-6 text-lg">
                Based in the vibrant city of Dallas, TX, I am Rudo Konga, a passionate baker dedicated to crafting unforgettable sweet and savory experiences. My kitchen is where tradition meets innovation, specializing in artisan sourdough, custom celebration cakes, and local delicacies that tell a story. I believe the best food is made with a generous sprinkle of love and the freshest ingredients.
              </p>
              <div className="flex flex-col items-center lg:items-start gap-6">
                <Button asChild>
                  <Link href="/about">More About Me</Link>
                </Button>
                <div className="flex items-center gap-4">
                    <Link href="https://www.tiktok.com/@rues_delectables?_t=ZT-9006WAI7hKB&_r=1" aria-label="TikTok" target="_blank" rel="noopener noreferrer">
                        <TiktokIcon className="w-6 h-6 text-background hover:text-primary transition-colors" />
                    </Link>
                     <Link href="https://www.instagram.com/deli.ghts84?igsh=MWhnc3ZseHVpenYwaA%3D%3D&utm_source=qr" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                        <Instagram className="w-6 h-6 text-background hover:text-primary transition-colors" />
                    </Link>
                     <Link href="https://wa.me/1234567890" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
                        <WhatsappIcon className="w-6 h-6 text-background hover:text-primary transition-colors" />
                    </Link>
                     <Link href="mailto:info@ruesdelectables.com" aria-label="Email">
                        <Mail className="w-6 h-6 text-background hover:text-primary transition-colsors" />
                    </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      </main>
    </div>
  );
}
