
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Calendar as CalendarIcon, Loader2, Trash2, Upload, X } from 'lucide-react';
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
import { availableTimes as staticAvailableTimes } from '@/lib/data';
import { cn } from '@/lib/utils';
import { ProductWithImage } from '@/lib/types';

const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters.'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters.'),
  category: z.string().min(2, 'Category is required.'),
  imageUrl: z.string().url('Please upload a valid image.'),
  imageFile: z.any().optional(),
});

export default function AdminPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<(typeof staticProducts[0] & { imageUrl?: string })[]>(staticProducts);
  const [busyDates, setBusyDates] = useState<Date[]>(
    staticBusyDates.map(d => new Date(d))
  );
  const [busyHours, setBusyHours] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedProducts = localStorage.getItem('customProducts');
    if (savedProducts) {
      setProducts(prev => [...prev, ...JSON.parse(savedProducts)]);
    }
    const savedBusyDates = localStorage.getItem('busyDates');
    if (savedBusyDates) {
      setBusyDates(JSON.parse(savedBusyDates).map((d: string) => new Date(d)));
    }
    const savedBusyHours = localStorage.getItem('busyHours');
    if (savedBusyHours) {
        setBusyHours(JSON.parse(savedBusyHours));
    } else {
        const staticBusyTimes = staticAvailableTimes.filter(t => !t.available).map(t => t.time);
        setBusyHours(staticBusyTimes);
    }
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
    };
    
    // We don't want to store the file object in localStorage
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
      description: `${values.name} has been added to the catalog.`,
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

  const handleDateSelect = (dates: Date[] | undefined) => {
    const newDates = dates || [];
    setBusyDates(newDates);
    localStorage.setItem('busyDates', JSON.stringify(newDates.map(d => format(d, 'yyyy-MM-dd'))));
    toast({
      title: 'Availability Updated',
      description: 'Your busy dates have been updated.',
    });
  };

  const handleTimeToggle = (time: string) => {
    setBusyHours(prev => {
        const newBusyHours = prev.includes(time)
            ? prev.filter(t => t !== time)
            : [...prev, time];
        localStorage.setItem('busyHours', JSON.stringify(newBusyHours));
        
        toast({
            title: `Time slot ${prev.includes(time) ? 'made available' : 'blocked'}`,
            description: `${time} is now ${prev.includes(time) ? 'available' : 'unavailable'}.`,
        });

        return newBusyHours;
    });
  };

  const selectedFile = form.watch('imageFile');

  return (
    <div className="container mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline">Admin Panel</h1>
        <p className="mt-3 text-lg text-muted-foreground">
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
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Image</FormLabel>
                        <FormControl>
                          <>
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
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Image
                            </Button>
                          </>
                        </FormControl>
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
              <Card>
                <CardHeader>
                  <CardTitle>Manage Busy Dates</CardTitle>
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
            <section>
                <Card>
                    <CardHeader>
                        <CardTitle>Manage Busy Hours</CardTitle>
                        <CardDescription>
                            Click a time slot to toggle its availability.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                         <div className="grid grid-cols-2 gap-3">
                            {staticAvailableTimes.map(({ time }) => {
                                const isBusy = busyHours.includes(time);
                                return (
                                    <Button
                                        key={time}
                                        variant={isBusy ? "destructive" : "outline"}
                                        onClick={() => handleTimeToggle(time)}
                                    >
                                        {time}
                                    </Button>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
      </div>
    </div>
  );
}

    