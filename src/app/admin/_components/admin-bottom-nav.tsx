
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { navItems } from '../layout';
import { LogOut } from 'lucide-react';
import { getAuth, signOut } from 'firebase/auth';

export default function AdminBottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      router.push('/login');
    });
  };

  return (
    <>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm md:hidden z-50">
        <div className="bg-background/80 backdrop-blur-sm border border-border rounded-full p-2 shadow-lg">
          <nav className="flex items-center justify-around">
            {navItems.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
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
            <button
                onClick={handleSignOut}
                className={cn(
                'flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-full transition-colors duration-200',
                'text-muted-foreground hover:text-foreground'
                )}
            >
                <LogOut className="w-5 h-5" />
                <span className="text-[10px] font-medium tracking-tight">
                    Logout
                </span>
            </button>
          </nav>
        </div>
      </div>
    </>
  );
}
