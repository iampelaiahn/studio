
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
import { useCollection } from '@/firebase';
import { collectionGroup, query } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useMemo } from 'react';
import { format } from 'date-fns';

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
    'Pending': 'outline',
    'Confirmed': 'default',
    'In Progress': 'secondary',
    'Completed': 'secondary',
    'Cancelled': 'destructive',
}


export default function BookingsPage() {
  const firestore = useFirestore();
  
  const customOrdersQuery = useMemo(() => {
      if (!firestore) return null;
      return query(collectionGroup(firestore, 'customOrders'));
  }, [firestore]);

  const { data: bookings, isLoading } = useCollection<any>(customOrdersQuery);

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
            {isLoading && <TableRow><TableCell colSpan={6} className="text-center">Loading bookings...</TableCell></TableRow>}
            {!isLoading && bookings?.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.id}</TableCell>
                <TableCell>
                  <div className="font-medium">{booking.customerName || 'N/A'}</div>
                  <div className="text-sm text-muted-foreground">{booking.customerEmail || 'N/A'}</div>
                </TableCell>
                <TableCell>{booking.designTheme}</TableCell>
                <TableCell>
                  {booking.pickupDeliveryDate 
                    ? format(new Date(booking.pickupDeliveryDate.seconds * 1000), 'PPP')
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[booking.status as string] || 'default'}>{booking.status as string || 'Pending'}</Badge>
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
             {!isLoading && (!bookings || bookings.length === 0) && (
                <TableRow>
                    <TableCell colSpan={6} className="text-center">No bookings found.</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
