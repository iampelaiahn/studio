
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart, Book, Settings, PanelLeft } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarInset } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', icon: Home, label: 'Dashboard' },
    { href: '/admin/analysis', icon: BarChart, label: 'Analysis' },
    { href: '/admin/bookings', icon: Book, label: 'Bookings' },
  ];

  return (
    <SidebarProvider>
        <Sidebar>
            <SidebarContent>
            <SidebarHeader>
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <BarChart className="h-5 w-5" />
                    </div>
                    <span className="text-lg font-semibold">Admin</span>
                </div>
            </SidebarHeader>
            <SidebarMenu>
                {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        tooltip={{
                            children: item.label,
                            side: "right",
                            align: "center",
                        }}
                    >
                    <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                    </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                ))}
            </SidebarMenu>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                         <SidebarMenuButton
                            asChild
                            tooltip={{
                                children: "Settings",
                                side: "right",
                                align: "center",
                            }}
                         >
                            <Link href="#">
                                <Settings />
                                <span>Settings</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            </SidebarContent>
        </Sidebar>
        <SidebarInset>
            <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
                <SidebarTrigger asChild>
                    <Button variant="outline" size="icon" className='md:hidden'>
                        <PanelLeft />
                        <span className="sr-only">Toggle Sidebar</span>
                    </Button>
                </SidebarTrigger>
                <div className='flex-1'>
                    <h1 className="text-lg font-semibold uppercase">
                        {navItems.find(item => item.href === pathname)?.label || 'Admin'}
                    </h1>
                </div>
            </header>
            <main className="flex-1 p-6">
                {children}
            </main>
        </SidebarInset>
    </SidebarProvider>
  );
}
