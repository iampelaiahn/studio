
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { navLinks, type NavLink } from '@/lib/data';
import AvailabilityModal from './availability-modal';

export default function BottomNav() {
  const pathname = usePathname();
  const [availabilityOpen, setAvailabilityOpen] = React.useState(false);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    link: NavLink
  ) => {
    if (link.id === 'availability') {
      e.preventDefault();
      setAvailabilityOpen(true);
    }
  };

  return (
    <>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm lg:hidden z-50">
        <div className="bg-background/80 backdrop-blur-sm border border-border rounded-full p-2 shadow-lg">
          <nav className="flex items-center justify-around">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-full transition-colors duration-200',
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <link.icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium tracking-tight">
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      <AvailabilityModal
        isOpen={availabilityOpen}
        onOpenChange={setAvailabilityOpen}
      />
    </>
  );
}
