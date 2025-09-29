
"use client";

import { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, MessageSquare, X, Frown, Annoyed, Smile, Laugh, Heart, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  feeling: z.string({ required_error: 'Please select how you are feeling.' }),
  comment: z.string().min(10, { message: 'Comment must be at least 10 characters.' }).optional().or(z.literal('')),
  feedbackImage: z.any().optional(),
});

const feelings = [
  {
    name: 'Terrible',
    icon: Frown
  },
  {
    name: 'Bad',
    icon: Annoyed
  },
  {
    name: 'Medium',
    icon: Smile
  },
  {
    name: 'Good',
    icon: Laugh
  },
  {
    name: 'Excellent',
    icon: Heart
  }
]

export default function FeedbackForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      feeling: 'Medium',
      comment: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);

    toast({
      title: 'Feedback Sent!',
      description: `Thank you for your feedback, ${values.name}. We appreciate you taking the time to write to us.`,
    });

    form.reset();
  }

  const selectedFile = form.watch('feedbackImage');

  return (
    <Card className="max-w-2xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
            <div className='flex items-center gap-2'>
                <MessageSquare className="w-6 h-6 text-foreground" />
                <CardTitle className="text-lg">Feedback</CardTitle>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6">
                <X className="w-4 h-4" />
            </Button>
        </CardHeader>
        <CardContent>
             <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">How are you feeling?</h2>
                <p className="text-muted-foreground">Your input is valuable in helping us better understand your needs and tailor our service accordingly.</p>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                </div>

                <FormField
                  control={form.control}
                  name="feeling"
                  render={({ field }) => (
                    <FormItem>
                       <FormLabel className="text-center block mb-4">How was your experience?</FormLabel>
                      <FormControl>
                        <div className="flex justify-center items-center gap-4">
                          {feelings.map(({name, icon: Icon}) => (
                            <div key={name} className="flex flex-col items-center gap-2">
                              <button
                                type="button"
                                onClick={() => field.onChange(name)}
                                className={cn(
                                  "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
                                  field.value === name 
                                    ? 'bg-primary/20 scale-110' 
                                    : 'bg-muted/50 hover:bg-muted'
                                )}
                              >
                                <Icon className={cn("w-8 h-8", field.value === name ? 'text-primary' : 'text-muted-foreground')} />
                              </button>
                               {field.value === name && (
                                <span className="text-sm font-medium text-primary">{name}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage className="text-center" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Comment</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Add a Comment..." {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="feedbackImage"
                  render={({ field: { onChange, onBlur, name, ref } }) => (
                    <FormItem>
                      <FormLabel>Upload a picture</FormLabel>
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
                                        form.setValue('feedbackImage', null, { shouldValidate: true });
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-green-400 to-teal-500 text-white" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Now
                </Button>
              </form>
            </Form>
        </CardContent>
    </Card>
  );
}
