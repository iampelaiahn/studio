
"use client";

import { useRef, useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, Upload, X, ArrowLeft } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { productTypes } from '@/lib/data';
import { getIcingSuggestions } from '../actions';
import { useOrder } from '@/context/order-context';
import { Progress } from '@/components/ui/progress';

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

const steps = [
    { id: 'Step 1', name: 'Contact Info', fields: ['name', 'email'] },
    { id: 'Step 2', name: 'Product Details', fields: ['productType', 'flavor', 'icing', 'servings'] },
    { id: 'Step 3', name: 'Design & Date', fields: ['designTheme', 'designImage', 'eventDate'] },
    { id: 'Step 4', name: 'Review & Submit' }
]

export default function CustomOrderForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { customerDetails, bookingDate } = useOrder();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      designTheme: '',
      flavor: '',
      icing: '',
      servings: undefined,
    },
  });
  
  const watchedValues = useWatch({ control: form.control });
  const [isClient, setIsClient] = useState(false);

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
  }, [customerDetails, bookingDate, form]);

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    
    const subject = `New Custom Order Request from ${values.name}`;
    const body = `
New Custom Order Request:
==========================

Customer Name: ${values.name}
Customer Email: ${values.email}

Product Type: ${values.productType}
Flavor: ${values.flavor}
Icing: ${values.icing}
Number of Servings: ${values.servings}

Event Date: ${format(values.eventDate, "PPP")}

Design/Theme:
${values.designTheme}

Inspiration Image Attached: ${values.designImage?.[0] ? 'Yes, see attached file.' : 'No'}
(Please instruct user to attach the file if they selected one, as it cannot be attached automatically).

--------------------
    `;

    const mailtoLink = `mailto:info@ruesdelectables.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;

    // We can't know for sure if the email was sent, but we can assume it was for UX purposes.
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setCurrentStep(0);

    toast({
      title: 'Your email client is opening...',
      description: `Please review and send the email to finalize your request. If you uploaded an image, please attach it to the email.`,
    });

    form.reset();
  }

  type FieldName = keyof FormValues;

  const next = async () => {
    const fields = steps[currentStep].fields as FieldName[];
    const output = await form.trigger(fields, { shouldFocus: true });

    if (!output) return;

    if (currentStep < steps.length - 1) {
        setCurrentStep(step => step + 1);
    }
  }

  const prev = () => {
    if (currentStep > 0) {
        setCurrentStep(step => step - 1);
    }
  }
  
  const progress = ((currentStep + 1) / steps.length) * 100;
  const selectedFile = form.watch('designImage');

  return (
    <div className='p-8 border rounded-lg shadow-md bg-card'>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        <div className="space-y-4">
            <Progress value={progress} className="w-full h-2" />
            <p className='text-sm text-muted-foreground'>Step {currentStep + 1} of {steps.length}: {steps[currentStep].name}</p>
        </div>

        {currentStep === 0 && (
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
        )}

        {currentStep === 1 && (
            <section className="space-y-8">
                <h2 className='text-2xl font-headline'>Tell us about the treat</h2>
                <FormField
                  control={form.control}
                  name="productType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                            <Input placeholder="e.g., Chocolate, Vanilla, Strawberry" {...field} />
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
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
        )}
        
        {currentStep === 2 && (
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
        )}

        {currentStep === 3 && (
            <section className="space-y-6">
                <h2 className='text-2xl font-headline'>Review Your Request</h2>
                <div className='space-y-4 rounded-lg bg-muted/30 p-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                        <div>
                            <p className='font-medium text-muted-foreground'>Name</p>
                            <p>{watchedValues.name}</p>
                        </div>
                        <div>
                            <p className='font-medium text-muted-foreground'>Email</p>
                            <p>{watchedValues.email}</p>
                        </div>
                         <div>
                            <p className='font-medium text-muted-foreground'>Product</p>
                            <p>{watchedValues.productType}</p>
                        </div>
                        <div>
                            <p className='font-medium text-muted-foreground'>Event Date</p>
                            <p>{watchedValues.eventDate && isClient ? format(watchedValues.eventDate, "PPP") : 'Not set'}</p>
                        </div>
                        <div>
                            <p className='font-medium text-muted-foreground'>Servings</p>
                            <p>{watchedValues.servings}</p>
                        </div>
                         <div>
                            <p className='font-medium text-muted-foreground'>Base Flavor</p>
                            <p>{watchedValues.flavor}</p>
                        </div>
                         <div>
                            <p className='font-medium text-muted-foreground'>Icing</p>
                            <p>{watchedValues.icing}</p>
                        </div>
                    </div>
                     <div>
                        <p className='font-medium text-muted-foreground'>Design/Theme</p>
                        <p>{watchedValues.designTheme}</p>
                    </div>
                     {watchedValues.designImage?.[0] && (
                        <div>
                            <p className='font-medium text-muted-foreground'>Inspiration</p>
                            <p className='text-sm text-muted-foreground'>{watchedValues.designImage[0].name}</p>
                        </div>
                     )}
                </div>
            </section>
        )}
        
        <div className="mt-8 pt-5">
            <div className="flex justify-between">
                <Button 
                    type="button" 
                    onClick={prev} 
                    disabled={currentStep === 0}
                    variant="outline"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                </Button>
                
                {currentStep < steps.length - 1 && (
                    <Button type="button" onClick={next}>
                        Next Step
                    </Button>
                )}

                {currentStep === steps.length - 1 && (
                    <Button type="submit" size="lg" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit Request
                    </Button>
                )}
            </div>
        </div>

      </form>
    </Form>
    </div>
  );
}
