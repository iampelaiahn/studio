
"use client";

import { useRef, useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, Sparkles, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { productTypes } from '@/lib/data';
import { useOrder } from '@/context/order-context';
import { getIcingSuggestions } from '../actions';
import { useFirebase } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  productType: z.string({ required_error: 'Please select a product type.' }),
  designTheme: z.string().min(10, { message: 'Please describe your design in at least 10 characters.' }),
  designImage: z.any().optional(),
  flavor: z.string().min(3, { message: 'Flavor must be at least 3 characters.' }),
  icing: z.string().min(3, { message: 'Icing flavor must be at least 3 characters.' }),
  eventDate: z.date({ required_error: 'A date for your event is required.' }),
  servings: z.coerce.number().min(1, { message: 'Please enter a valid number of servings.' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function CustomOrderForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { customerDetails, bookingDate, productDetails } = useOrder();
  const { firestore, user } = useFirebase();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: customerDetails.name || '',
      email: customerDetails.email || '',
      productType: productDetails.productType || '',
      flavor: productDetails.flavor || '',
      icing: productDetails.icing || '',
      eventDate: bookingDate || undefined,
      designTheme: '',
      servings: undefined,
    },
  });
  
  const [isClient, setIsClient] = useState(false);
  const productTypeValue = useWatch({ control: form.control, name: 'productType' });
  const flavorValue = useWatch({ control: form.control, name: 'flavor' });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (customerDetails.name) {
      form.setValue('name', customerDetails.name);
    }
    if (customerDetails.email) {
      form.setValue('email', customerDetails.email);
    }
    if (bookingDate) {
      form.setValue('eventDate', bookingDate);
    }
    if (productDetails.productType) {
        form.setValue('productType', productDetails.productType);
    }
    if (productDetails.flavor) {
        form.setValue('flavor', productDetails.flavor);
    }
    if (productDetails.icing) {
        form.setValue('icing', productDetails.icing);
    }
  }, [customerDetails, bookingDate, productDetails, form]);
  
  const handleGetSuggestions = async () => {
    if (!productTypeValue || !flavorValue) {
      toast({
        variant: "destructive",
        title: "Missing Details",
        description: "Please select a product type and enter a flavor first.",
      });
      return;
    }
    setIsSuggesting(true);
    setSuggestions([]);
    const result = await getIcingSuggestions({ productType: productTypeValue, desiredFlavor: flavorValue });
    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    } else if (result.suggestions) {
      setSuggestions(result.suggestions);
    }
    setIsSuggesting(false);
  };

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);

    if (!firestore) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Database not available. Please try again later.",
      });
      setIsSubmitting(false);
      return;
    }
    
    // For now, we'll use a placeholder customer ID. 
    // In a real app, this would come from the logged-in user.
    const customerId = user ? user.uid : 'guest';

    try {
      await addDoc(collection(firestore, `customers/${customerId}/customOrders`), {
        productType: values.productType,
        designTheme: values.designTheme,
        flavors: values.flavor,
        icing: values.icing,
        pickupDeliveryDate: values.eventDate,
        servings: values.servings,
        customerName: values.name,
        customerEmail: values.email,
        status: 'Pending',
        createdAt: serverTimestamp(),
      });

      toast({
        title: 'Request Submitted!',
        description: "Thank you! We've received your custom order request and will be in touch shortly.",
      });
      form.reset();

    } catch (error) {
      console.error("Error submitting order: ", error);
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "There was a problem submitting your request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  const selectedFile = form.watch('designImage');

  return (
    <div className='p-8 border rounded-lg shadow-md bg-card'>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        <section className="space-y-8">
            <h2 className='text-2xl font-headline'>Let's start with your details</h2>
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                    <Input placeholder="Jane Doe" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                    <Input placeholder="jane.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </section>

        <section className="space-y-8">
            <h2 className='text-2xl font-headline'>Tell us about the treat</h2>
            <FormField
                control={form.control}
                name="productType"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Product Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {productTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                    control={form.control}
                    name="flavor"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Cake/Base Flavor</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., Chocolate, Vanilla" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="icing"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Icing Flavor</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., Cream Cheese, Buttercream" {...field} />
                        </FormControl>
                         <FormDescription>
                            Need ideas? Type a flavor above and <button type="button" onClick={handleGetSuggestions} className="text-primary underline" disabled={isSuggesting || !productTypeValue || !flavorValue}>get suggestions</button>.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            {isSuggesting && (
              <div className="flex items-center justify-center text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Generating flavor ideas...</span>
              </div>
            )}
            {suggestions.length > 0 && (
              <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <Sparkles className="h-4 w-4 text-accent" />
                    <h4 className="text-sm font-semibold">AI-Powered Suggestions</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion, index) => (
                          <Button 
                              key={index} 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              onClick={() => form.setValue('icing', suggestion, { shouldValidate: true })}
                          >
                              {suggestion}
                          </Button>
                      ))}
                  </div>
              </div>
            )}
                <FormField
                control={form.control}
                name="servings"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Number of Servings</FormLabel>
                    <FormControl>
                    <Input type="number" placeholder="e.g., 20" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </section>
        
        <section className="space-y-8">
            <h2 className='text-2xl font-headline'>Design and Date</h2>
            <FormField
                control={form.control}
                name="designTheme"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Design / Theme</FormLabel>
                    <FormControl>
                    <Textarea placeholder="e.g., enchanted forest theme, minimalist with gold leaf, superhero design..." {...field} />
                    </FormControl>
                    <FormDescription>
                    Describe the look, feel, or any specific characters/elements you'd like.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="designImage"
                render={({ field: { onChange, onBlur, name, ref } }) => (
                <FormItem>
                    <FormLabel>Upload Inspiration</FormLabel>
                    <FormControl>
                    <Input 
                        type="file" 
                        accept="image/*" 
                        ref={fileInputRef}
                        className="hidden"
                        onChange={(e) => onChange(e.target.files)}
                        onBlur={onBlur}
                        name={name}
                    />
                    </FormControl>
                    <div className='flex items-center gap-4'>
                    <Button 
                        type='button' 
                        variant='outline'
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload className="mr-2 h-4 w-4" />
                        Choose File
                    </Button>
                    {selectedFile?.[0] && (
                        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                            <span>{selectedFile[0].name}</span>
                            <Button 
                                type='button' 
                                variant='ghost'
                                size='icon'
                                className='h-6 w-6'
                                onClick={() => {
                                    form.setValue('designImage', null, { shouldValidate: true });
                                    if(fileInputRef.current) {
                                        fileInputRef.current.value = '';
                                    }
                                }}
                            >
                                <X className='h-4 w-4' />
                            </Button>
                        </div>
                    )}
                    </div>
                    <FormDescription>
                    Have a specific design in mind? Upload an image for reference.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="eventDate"
                render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>Pickup / Event Date</FormLabel>
                    <Popover>
                    <PopoverTrigger asChild>
                        <FormControl>
                        <Button
                            variant={"outline"}
                            className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                            )}
                        >
                            {isClient && field.value ? (
                            format(field.value, "PPP")
                            ) : (
                            <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                        </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                            date < new Date(new Date().setHours(0,0,0,0))
                        }
                        initialFocus
                        />
                    </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
                )}
            />
        </section>

        <div className="mt-8 pt-5">
            <div className="flex justify-end">
                <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Request
                </Button>
            </div>
        </div>

      </form>
    </Form>
    </div>
  );
}
