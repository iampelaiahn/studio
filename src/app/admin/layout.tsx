
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, BarChart, Book, Settings, PanelLeft, LogOut } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarInset, useSidebar } from '@/components/ui/sidebar';
import { useFirebase } from '@/firebase';
import { getAuth, signOut } from 'firebase/auth';

function DesktopSidebarTrigger() {
    const { state, toggleSidebar } = useSidebar();
    return (
        <SidebarTrigger
            className="hidden md:flex"
            onClick={toggleSidebar}
        >
             <PanelLeft className={`transition-transform duration-300 ${state === 'expanded' ? '' : 'rotate-180'}`} />
        </SidebarTrigger>
    )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useFirebase();

  React.useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      router.push('/login');
    });
  };
  
  const navItems = [
    { href: '/admin', icon: Home, label: 'Dashboard' },
    { href: '/admin/analysis', icon: BarChart, label: 'Analysis' },
    { href: '/admin/bookings', icon: Book, label: 'Bookings' },
  ];

  if (isUserLoading || !user) {
      return (
          <div className="flex h-screen items-center justify-center">
              <div>Loading...</div>
          </div>
      )
  }

  return (
    <SidebarProvider>
        <Sidebar collapsible='icon' className='border-r'>
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
                     <SidebarMenuItem>
                         <SidebarMenuButton
                            onClick={handleSignOut}
                            tooltip={{
                                children: "Logout",
                                side: "right",
                                align: "center",
                            }}
                         >
                            <LogOut />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            </SidebarContent>
        </Sidebar>
        <SidebarInset>
            <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
                <SidebarTrigger variant="ghost" size="icon" className='md:hidden'>
                    <PanelLeft />
                    <span className="sr-only">Toggle Sidebar</span>
                </SidebarTrigger>
                <DesktopSidebarTrigger />
                <div className='flex-1'>
                    <h1 className="text-lg font-semibold uppercase">
                        {navItems.find(item => pathname.startsWith(item.href))?.label || 'Dashboard'}
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
