
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addDays, format, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '../ui/scroll-area';
import { useOrder } from '@/context/order-context';
import { busyDates as busyDatesList } from '@/lib/busy-dates';

type AvailabilityModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

const availableTimes = [
    { time: "10:00 AM", available: true },
    { time: "11:00 AM", available: true },
    { time: "12:00 PM", available: false },
    { time: "01:30 PM", available: true },
    { time: "02:15 PM", available: true },
    { time: "03:00 PM", available: false },
    { time: "04:30 PM", available: true },
    { time: "05:00 PM", available: true },
    { time: "06:15 PM", available: false },
];

const busyDates = busyDatesList.map(dateStr => new Date(dateStr));

export default function AvailabilityModal({ isOpen, onOpenChange }: AvailabilityModalProps) {
    const { setCustomerDetails, setBookingDate } = useOrder();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState("05:00 PM");
    const [currentDate, setCurrentDate] = useState(new Date());
    const [orderType, setOrderType] = useState('shop-now');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const router = useRouter();

    const dates = Array.from({ length: 7 }).map((_, i) => addDays(currentDate, i));

    const handleNextWeek = () => {
        setCurrentDate(addDays(currentDate, 7));
    };

    const handlePrevWeek = () => {
        setCurrentDate(addDays(currentDate, -7));
    };

    const handleNext = () => {
        setCustomerDetails({ name: fullName, email });
        setBookingDate(selectedDate);
        if (orderType === 'shop-now') {
            router.push('/shop');
        } else {
            router.push('/custom-order');
        }
        onOpenChange(false);
    }
    
    const isDateBusy = (date: Date) => {
        return busyDates.some(busyDate => isSameDay(date, busyDate));
    }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 grid-rows-[auto,1fr] max-h-[90vh]">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="font-headline text-xl flex items-center">
            Check Availability
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full">
            <div className="p-6 space-y-8">
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={handlePrevWeek} disabled={currentDate <= new Date()} className="disabled:opacity-50">
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            {format(currentDate, 'MMMM yyyy')}
                        </h3>
                        <button onClick={handleNextWeek}>
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="grid grid-cols-7 text-center">
                    {dates.map((date, index) => {
                      const isSelected = format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
                      const isBusy = isDateBusy(date);
                      const isPast = date < new Date(new Date().setHours(0,0,0,0));

                      return (
                        <div key={index} onClick={() => !isBusy && !isPast && setSelectedDate(date)} className={cn("cursor-pointer py-2", 
                            isSelected && !isBusy && "border-b-2 border-primary",
                            isBusy && "text-muted-foreground opacity-50 cursor-not-allowed",
                            isPast && "text-muted-foreground opacity-50 cursor-not-allowed"
                        )}>
                          <p className={cn("font-semibold text-lg", isSelected && !isBusy ? 'text-primary' : 'text-foreground')}>{format(date, 'dd')}</p>
                          <p className="text-xs text-muted-foreground">{format(date, 'E')}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
                
                <div>
                    <h3 className="text-lg font-semibold mb-4">Available Times</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {availableTimes.map(({ time, available }) => (
                            <Button 
                                key={time}
                                variant={selectedTime === time ? "default" : "outline"}
                                onClick={() => available && setSelectedTime(time)}
                                disabled={!available}
                                className={cn(
                                    "disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed",
                                    selectedTime === time && available ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""
                                )}
                            >
                                {time}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Type of Order</h3>
                    <RadioGroup defaultValue="shop-now" onValueChange={setOrderType}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="shop-now" id="shop-now" />
                            <Label htmlFor="shop-now">Shop Now</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="custom-cake" id="custom-cake" />
                            <Label htmlFor="custom-cake">Custom Cake</Label>
                        </div>
                    </RadioGroup>
                </div>

                <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Appointment for...</h3>
                    <div className='space-y-4'>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="name-modal">Full Name</Label>
                            <Input type="text" id="name-modal" placeholder="Jane Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="email-modal">Email Address</Label>
                            <Input type="email" id="email-modal" placeholder="jane.doe@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    </div>
                    <Button size="lg" className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleNext}>Next</Button>
                </div>
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
