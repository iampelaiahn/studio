
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Phone, MapPin, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';

function TiktokIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.65 4.24 1.76v3.45c-1.92.05-3.84.09-5.75.14-1.24.03-2.48.06-3.73.09v6.52c0 1.25-.33 2.5-1 3.61-1.02 1.6-2.9 2.16-4.82 1.57-1.92-.59-3.26-2.13-3.48-4.05-.22-1.92.56-3.8 2.18-4.94 1.62-1.14 3.63-1.42 5.43-.9v-6.52c.01-1.26.32-2.51.98-3.62 1.02-1.66 2.9-2.22 4.82-1.63.18.05.35.11.  52.17.01-.12.02-.23.02-.34.01-1.53.01-3.07.01-4.6 0-.63-.03-1.27-.04-1.9-.01-.63-.03-1.27-.04-1.9z" />
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

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground">
      <header className="relative h-[40vh] md:h-[50vh] w-full">
        <Image
          src="https://images.unsplash.com/photo-1579882390235-a0d729359ds9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Bakery storefront"
          fill
          className="object-cover"
          data-ai-hint="bakery storefront"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 w-full text-center p-8">
          <h1 className="text-4xl md:text-6xl font-headline text-foreground">About Rue's Delectables</h1>
        </div>
      </header>

      <div className="container mx-auto py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="prose prose-lg max-w-none">
            <h2 className="font-headline text-3xl">From Passion to Pastry</h2>
            <p>
              Hi, I'm Rue! My journey into the world of baking started not in a fancy culinary school, but in my own kitchen, driven by a simple love for creating joy through food. What began as a hobby, baking for family and friends, quickly blossomed into a full-fledged passion. The smiles on their faces with every bite were my biggest inspiration.
            </p>
            <p>
              At Rue's Delectables, we believe that every celebration, big or small, deserves a show-stopping centerpiece. We're dedicated to crafting delicious, beautiful, and memorable treats that turn your special moments into sweet memories.
            </p>
          </div>
          <div className="relative aspect-square w-full max-w-md mx-auto">
            <div className="absolute -top-4 -left-4 w-full h-full bg-accent/20 rounded-3xl transform -rotate-3"></div>
            <Image
              src="https://imgur.com/zaa3MSY.png"
              alt="Portrait of the baker, Rue"
              width={800}
              height={800}
              className="relative object-cover rounded-3xl shadow-lg"
              data-ai-hint="baker portrait"
            />
          </div>
        </div>

        <div className="text-center my-24 lg:my-32">
          <h2 className="font-headline text-3xl mb-4">Our Mission</h2>
          <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
            To craft exquisite and delicious baked goods using high-quality ingredients, customized to celebrate the unique story of every customer. We're committed to artistry, flavor, and creating a delightful experience from the first inquiry to the last crumb.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center bg-muted/30 p-8 md:p-12 rounded-2xl">
          <div className="relative aspect-square w-full max-w-md mx-auto order-last lg:order-first">
             <div className="absolute -top-4 -right-4 w-full h-full bg-primary/10 rounded-3xl transform rotate-3"></div>
            <Image
              src="https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Assortment of cakes and pastries"
              width={800}
              height={800}
              className="relative object-cover rounded-3xl shadow-lg"
              data-ai-hint="cakes pastries"
            />
          </div>
          <div className="prose prose-lg max-w-none">
            <h2 className="font-headline text-3xl">What We Offer</h2>
            <p>
              While our specialty is creating custom cakes that are as unique as you are, our ovens are always busy with a variety of other delectable treats.
            </p>
            <ul>
              <li><strong>Custom Cakes:</strong> For weddings, birthdays, anniversaries, and any celebration you can dream of.</li>
              <li><strong>Cupcakes:</strong> Perfect for parties, meetings, or just a sweet personal indulgence.</li>
              <li><strong>Baked Treats:</strong> A rotating menu of cookies, brownies, macarons, and seasonal specialties.</li>
            </ul>
            <Button asChild size="lg">
              <Link href="/custom-order">Design Your Dream Cake</Link>
            </Button>
          </div>
        </div>

        <div className="text-center mt-24 lg:mt-32">
            <h2 className="font-headline text-3xl mb-4">Get In Touch</h2>
            <p className="max-w-3xl mx-auto text-lg text-muted-foreground mb-8">
                We are a home-based bakery located in Dallas, TX. Ready to start planning your sweet creation or have a question? We'd love to hear from you!
            </p>
            <div className="flex flex-col lg:flex-row justify-center items-center gap-8 text-lg">
                <div className="flex items-center gap-3">
                    <Mail className="w-6 h-6 text-primary"/>
                    <a href="mailto:info@ruesdelectables.com" className="hover:text-primary">info@ruesdelectables.com</a>
                </div>
                 <div className="flex items-center gap-3">
                    <Phone className="w-6 h-6 text-primary"/>
                    <a href="tel:+19729983334" className="hover:text-primary">+1 (972) 998-3334</a>
                </div>
            </div>
            <div className="flex justify-center items-center gap-6 mt-8">
                <Link href="https://www.tiktok.com/@rues_delectables?_t=ZT-9006WAI7hKB&_r=1" aria-label="TikTok" target="_blank" rel="noopener noreferrer">
                    <TiktokIcon className="w-7 h-7 text-foreground hover:text-primary transition-colors" />
                </Link>
                 <Link href="https://www.instagram.com/deli.ghts84?igsh=MWhnc3ZseHVpenYwaA%3D%3D&utm_source=qr" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                    <Instagram className="w-7 h-7 text-foreground hover:text-primary transition-colors" />
                </Link>
                 <Link href="https://wa.me/1234567890" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
                    <WhatsappIcon className="w-7 h-7 text-foreground hover:text-primary transition-colors" />
                </Link>
            </div>
        </div>

      </div>
    </div>
  );
}
