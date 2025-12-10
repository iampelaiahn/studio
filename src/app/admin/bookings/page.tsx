
'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const bookings = [
  {
    id: 'ORD-001',
    customer: 'Liam Johnson',
    email: 'liam@example.com',
    date: '2025-10-25',
    product: 'Custom Wedding Cake',
    status: 'Pending',
  },
  {
    id: 'ORD-002',
    customer: 'Olivia Smith',
    email: 'olivia@example.com',
    date: '2025-10-28',
    product: 'Birthday Cupcakes (2 Dozen)',
    status: 'Confirmed',
  },
  {
    id: 'ORD-003',
    customer: 'Noah Williams',
    email: 'noah@example.com',
    date: '2025-11-02',
    product: 'Anniversary Cake',
    status: 'Completed',
  },
  {
    id: 'ORD-004',
    customer: 'Emma Brown',
    email: 'emma@example.com',
    date: '2025-11-05',
    product: 'Sourdough Bread Loaf',
    status: 'Pending',
  },
  {
    id: 'ORD-005',
    customer: 'Ava Jones',
    email: 'ava@example.com',
    date: '2025-11-10',
    product: 'Custom "Galaxy" Themed Cake',
    status: 'In Progress',
  },
];

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
    'Pending': 'outline',
    'Confirmed': 'default',
    'In Progress': 'secondary',
    'Completed': 'secondary',
    'Cancelled': 'destructive',
}


export default function BookingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Order Bookings</CardTitle>
        <CardDescription>
          A list of recent and upcoming custom order requests.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Event Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.id}</TableCell>
                <TableCell>
                  <div className="font-medium">{booking.customer}</div>
                  <div className="text-sm text-muted-foreground">{booking.email}</div>
                </TableCell>
                <TableCell>{booking.product}</TableCell>
                <TableCell>{booking.date}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[booking.status] || 'default'}>{booking.status}</Badge>
                </TableCell>
                <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Mark as Confirmed</DropdownMenuItem>
                            <DropdownMenuItem>Cancel Order</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
