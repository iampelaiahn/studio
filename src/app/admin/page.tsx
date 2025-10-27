
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Calendar as CalendarIcon, Loader2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { products as staticProducts } from '@/lib/data';
import { busyDates as staticBusyDates } from '@/lib/busy-dates';

const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters.'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters.'),
  category: z.string().min(2, 'Category is required.'),
  imageId: z.string().min(1, 'Image ID is required.'),
});

export default function AdminPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState(staticProducts);
  const [busyDates, setBusyDates] = useState<Date[]>(
    staticBusyDates.map(d => new Date(d))
  );

  useEffect(() => {
    const savedProducts = localStorage.getItem('customProducts');
    if (savedProducts) {
      setProducts(prev => [...prev, ...JSON.parse(savedProducts)]);
    }
    const savedBusyDates = localStorage.getItem('busyDates');
    if (savedBusyDates) {
      setBusyDates(JSON.parse(savedBusyDates).map((d: string) => new Date(d)));
    }
  }, []);

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      category: 'Cakes',
      imageId: '',
    },
  });

  const onProductSubmit = (values: z.infer<typeof productSchema>) => {
    const newProduct = { ...values, id: `prod-${Date.now()}` };
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);

    const savedProducts = JSON.parse(
      localStorage.getItem('customProducts') || '[]'
    );
    savedProducts.push(newProduct);
    localStorage.setItem('customProducts', JSON.stringify(savedProducts));

    toast({
      title: 'Product Added!',
      description: `${values.name} has been added to the catalog.`,
    });
    form.reset();
  };

  const handleDateSelect = (dates: Date[] | undefined) => {
    if (!dates) return;

    const lastSelectedDate = dates[dates.length - 1];
    if (!lastSelectedDate) return;
    
    const originalLength = busyDates.length;
    setBusyDates(dates);
    localStorage.setItem(
      'busyDates',
      JSON.stringify(dates.map(d => format(d, 'yyyy-MM-dd')))
    );

    const isBlocked = dates.length > originalLength;

    toast({
      title: `Date ${
        isBlocked ? 'blocked' : 'unblocked'
      }`,
      description: `${format(lastSelectedDate, 'PPP')} is now ${
        isBlocked ? 'unavailable' : 'available'
      }.`,
    });
  };

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline">Admin Panel</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Manage your products and availability here.
        </p>
      </header>
      <div className="grid md:grid-cols-2 gap-12">
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Add New Product</CardTitle>
              <CardDescription>
                Add a new cake or treat to your product catalog.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onProductSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Classic Cheesecake" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="A creamy and delicious dessert..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Cakes" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="imageId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image ID</FormLabel>
                        <FormControl>
                          <Input placeholder="An ID from placeholder-images.json" {...field} />
                        </FormControl>
                        <FormDescription>
                          This must match an ID in src/lib/placeholder-images.json
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">
                    {form.formState.isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Add Product
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </section>
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Manage Availability</CardTitle>
              <CardDescription>
                Select dates you are unavailable for orders. Click a date to
                toggle its status.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="multiple"
                selected={busyDates}
                onSelect={handleDateSelect}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
