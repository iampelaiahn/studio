
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils';
import { navLinks } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import AvailabilityModal from './availability-modal';

export default function Header() {
  const pathname = usePathname();
  const [availabilityOpen, setAvailabilityOpen] = React.useState(false);
  const [clickCount, setClickCount] = React.useState(0);
  const router = useRouter();

  React.useEffect(() => {
    if (clickCount === 3) {
      router.push('/admin');
      setClickCount(0);
    }

    const timer = setTimeout(() => {
      setClickCount(0);
    }, 1000); // Reset after 1 second

    return () => clearTimeout(timer);
  }, [clickCount, router]);

  const handleLogoClick = () => {
    setClickCount(prevCount => prevCount + 1);
  };

  const renderNavLinks = () => {
    return navLinks.map(link => {
      const className = cn(
        'font-medium transition-colors hover:text-primary whitespace-nowrap text-sm',
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
          <div onClick={handleLogoClick} className="relative z-10 -mt-2 cursor-pointer">
            <Link href="/" tabIndex={-1} aria-hidden>
              <Image src="https://i.imgur.com/iwxnVR1.png" alt="Rue's Delectables Logo" width={100} height={100} className="h-[100px] w-[100px]" />
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-sm">
            {renderNavLinks()}
          </nav>

          <div className="flex items-center justify-end gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <AvailabilityModal isOpen={availabilityOpen} onOpenChange={setAvailabilityOpen} />
    </>
  );
}
