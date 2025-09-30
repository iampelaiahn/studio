
'use client';

import Link from "next/link";
import React from "react";
import AvailabilityModal from "./availability-modal";
import Image from "next/image";

export default function Footer() {
  const [availabilityOpen, setAvailabilityOpen] = React.useState(false);

  return (
    <>
      <footer className="bg-foreground text-background border-t border-border pt-24 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left text-muted-foreground">
            <div>
              <Link href="/" className="flex flex-col items-center md:items-start justify-center md:justify-start mb-4">
                 <Image src="https://i.imgur.com/iwxnVR1.png" alt="Rue's Delectables Logo" width={100} height={100} className="h-[100px] w-[100px]" />
              </Link>
              <p className="text-sm">Crafting sweet memories, one bite at a time.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 font-headline text-background">Contact Us</h3>
              <ul className="text-sm space-y-1">
                <li>Email: <a href="mailto:info@ruesdelectables.com" className="hover:text-primary">info@ruesdelectables.com</a></li>
                <li>Phone: <a href="tel:+19729983334" className="hover:text-primary">+1 (972) 998-3334</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 font-headline text-background">Operating Hours</h3>
              <p className="text-sm">
                Tuesday - Saturday: 9am - 6pm<br />
                <button onClick={() => setAvailabilityOpen(true)} className="hover:text-primary underline">Check our availability</button>
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Rue's Delectables. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
      <AvailabilityModal isOpen={availabilityOpen} onOpenChange={setAvailabilityOpen} />
    </>
  );
}

