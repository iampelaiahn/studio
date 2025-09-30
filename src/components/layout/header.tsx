
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ShoppingCart } from 'lucide-react';
import React from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils';
import { navLinks } from '@/lib/data';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/theme-toggle';
import AvailabilityModal from './availability-modal';
import { useOrder } from '@/context/order-context';
import { Badge } from '../ui/badge';
import CartModal from './cart-modal';

export default function Header() {
  const pathname = usePathname();
  const [availabilityOpen, setAvailabilityOpen] = React.useState(false);
  const [cartOpen, setCartOpen] = React.useState(false);
  const { cart } = useOrder();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const renderNavLinks = (isMobile = false) => {
    return navLinks.map(link => {
      const className = cn(
        'font-medium transition-colors hover:text-primary whitespace-nowrap',
        isMobile ? 'text-lg' : 'text-sm',
        pathname === link.href ? 'text-primary' : 'text-foreground/60'
      );

      if (link.id === 'availability') {
        return (
          <button
            key={link.href}
            onClick={() => setAvailabilityOpen(true)}
            className={className}
          >
            {link.label}
          </button>
        );
      }
      return (
        <Link
          key={link.href}
          href={link.href}
          className={className}
        >
          {link.label}
        </Link>
      );
    });
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="container flex h-14 items-center justify-between lg:px-24 xl:px-32">
          <Link href="/" className="relative z-10 -mt-2">
            <Image src="https://i.imgur.com/iwxnVR1.png" alt="Rue's Delectables Logo" width={100} height={100} className="h-[100px] w-[100px]" />
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-sm">
            {renderNavLinks()}
          </nav>

          <div className="flex items-center justify-end gap-2">
            <div className="relative">
              <Button variant="ghost" size="icon" onClick={() => setCartOpen(true)}>
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Shopping Cart</span>
              </Button>
              {totalItems > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 justify-center p-0">{totalItems}</Badge>
              )}
            </div>
            <ThemeToggle />
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[120px] sm:w-[160px]">
                  <SheetHeader>
                    <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col items-start gap-6 mt-8">
                    {renderNavLinks(true)}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
      <AvailabilityModal isOpen={availabilityOpen} onOpenChange={setAvailabilityOpen} />
      <CartModal isOpen={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}
