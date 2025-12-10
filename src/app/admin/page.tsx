
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Calendar as CalendarIcon, Loader2, Trash2, Upload, X } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { availableTimes as staticAvailableTimes } from '@/lib/data';
import { cn } from '@/lib/utils';
import { ProductWithImage } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

const productSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  category: z.string().min(2, 'Category is required.'),
  imageUrl: z.string().url('Please upload or enter a valid image URL.'),
  imageFile: z.any().optional(),
});

export default function AdminPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<(typeof staticProducts[0] & { imageUrl?: string })[]>(staticProducts);
  
  const [busyDates, setBusyDates] = useState<Date[]>(
    staticBusyDates.map(d => new Date(d))
  );
  const [pendingBusyDates, setPendingBusyDates] = useState<Date[]>(busyDates);
  
  const [busyHours, setBusyHours] = useState<string[]>([]);
  const [pendingBusyHours, setPendingBusyHours] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedProducts = localStorage.getItem('customProducts');
    if (savedProducts) {
      setProducts(prev => [...prev, ...JSON.parse(savedProducts)]);
    }

    const savedBusyDates = localStorage.getItem('busyDates');
    const initialBusyDates = savedBusyDates 
      ? JSON.parse(savedBusyDates).map((d: string) => new Date(d))
      : staticBusyDates.map(d => new Date(d));
    setBusyDates(initialBusyDates);
    setPendingBusyDates(initialBusyDates);

    const savedBusyHours = localStorage.getItem('busyHours');
    const initialBusyHours = savedBusyHours
        ? JSON.parse(savedBusyHours)
        : staticAvailableTimes.filter(t => !t.available).map(t => t.time);
    setBusyHours(initialBusyHours);
    setPendingBusyHours(initialBusyHours);

    setIsLoading(false);
  }, []);

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      category: 'Cakes',
      imageUrl: '',
    },
  });

  const onProductSubmit = (values: z.infer<typeof productSchema>) => {
    const newProduct: ProductWithImage = { 
        ...values, 
        id: `prod-${Date.now()}`,
        name: values.name || '',
        description: values.description || ''
    };
    
    const { imageFile, ...productToSave } = newProduct as any;

    const updatedProducts = [...products, productToSave];
    setProducts(updatedProducts);

    const savedProducts = JSON.parse(
      localStorage.getItem('customProducts') || '[]'
    );
    savedProducts.push(productToSave);
    localStorage.setItem('customProducts', JSON.stringify(savedProducts));

    toast({
      title: 'Product Added!',
      description: `${values.name || 'A new product'} has been added to the catalog.`,
    });
    form.reset();
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('imageUrl', reader.result as string, { shouldValidate: true });
        form.setValue('imageFile', file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePendingDateSelect = (dates: Date[] | undefined) => {
    setPendingBusyDates(dates || []);
  };

  const handleUpdateBusyDates = () => {
    setBusyDates(pendingBusyDates);
    localStorage.setItem('busyDates', JSON.stringify(pendingBusyDates.map(d => format(d, 'yyyy-MM-dd'))));
    toast({
      title: 'Availability Updated',
      description: 'Your busy dates have been saved.',
    });
  };

  const handlePendingTimeToggle = (time: string) => {
    setPendingBusyHours(prev => 
        prev.includes(time)
            ? prev.filter(t => t !== time)
            : [...prev, time]
    );
  };

  const handleUpdateBusyHours = () => {
    setBusyHours(pendingBusyHours);
    localStorage.setItem('busyHours', JSON.stringify(pendingBusyHours));
    toast({
        title: 'Availability Updated',
        description: `Your busy hours have been saved.`,
    });
  }

  const selectedFile = form.watch('imageFile');
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <header className="text-center mb-12">
          <Skeleton className="h-10 w-1/2 mx-auto" />
          <Skeleton className="h-5 w-3/4 mx-auto mt-4" />
        </header>
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="text-center">
        <p className="mt-1 text-lg text-muted-foreground">
          Manage your products and availability here.
        </p>
      </header>
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
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
                        <FormLabel>Product Name (Optional)</FormLabel>
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
                        <FormLabel>Description (Optional)</FormLabel>
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
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Image</FormLabel>
                        <div className="space-y-4">
                            <FormControl>
                              <Input placeholder="https://example.com/image.png" {...field} />
                            </FormControl>

                            <div className="relative">
                                <Separator />
                                <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-card px-2 text-sm text-muted-foreground">OR</span>
                            </div>

                            <FormControl>
                              <div>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  ref={fileInputRef}
                                  onChange={handleImageUpload}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  className='w-full'
                                  onClick={() => fileInputRef.current?.click()}
                                >
                                  <Upload className="mr-2 h-4 w-4" />
                                  Upload Image
                                </Button>
                              </div>
                            </FormControl>
                        </div>
                        {selectedFile && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                            <span>{selectedFile.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => {
                                form.setValue('imageUrl', '', { shouldValidate: true });
                                form.setValue('imageFile', null);
                                if (fileInputRef.current) {
                                  fileInputRef.current.value = '';
                                }
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Add Product
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-12">
            <section>
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Manage Busy Dates</CardTitle>
                  <CardDescription>
                    Select dates you are unavailable for orders. Click a date to
                    toggle its status.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center flex-grow">
                  <Calendar
                    mode="multiple"
                    selected={pendingBusyDates}
                    onSelect={handlePendingDateSelect}
                    className="rounded-md border"
                  />
                </CardContent>
                <CardFooter>
                    <Button onClick={handleUpdateBusyDates} className="w-full">Update Dates</Button>
                </CardFooter>
              </Card>
            </section>
            <section>
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>Manage Busy Hours</CardTitle>
                        <CardDescription>
                            Click a time slot to toggle its availability.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                         <div className="grid grid-cols-2 gap-3">
                            {staticAvailableTimes.map(({ time }) => {
                                const isBusy = pendingBusyHours.includes(time);
                                return (
                                    <Button
                                        key={time}
                                        variant={isBusy ? "destructive" : "outline"}
                                        onClick={() => handlePendingTimeToggle(time)}
                                    >
                                        {time}
                                    </Button>
                                )
                            })}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleUpdateBusyHours} className="w-full">Update Hours</Button>
                    </CardFooter>
                </Card>
            </section>
        </div>
      </div>
    </div>
  );
}
