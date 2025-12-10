
'use client';

import React from 'react';
import { BarChart, LineChart, PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart as BarChartRe, Line, LineChart as LineChartRe, Pie, PieChart as PieChartRe, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const kpis = [
  { title: "Total Visits", value: "12,403", change: "+12.5%", description: "vs. previous 30 days" },
  { title: "New Customers", value: "256", change: "+8.2%", description: "this month" },
  { title: "Conversion Rate", value: "4.8%", change: "-1.1%", description: "vs. previous 30 days" },
  { title: "Total Revenue", value: "$5,231", change: "+20.1%", description: "this month" },
];

const barChartData = [
  { name: 'Cakes', orders: 40, revenue: 2400 },
  { name: 'Cupcakes', orders: 30, revenue: 900 },
  { name: 'Cookies', orders: 20, revenue: 200 },
  { name: 'Muffins', orders: 27, revenue: 405 },
  { name: 'Other', orders: 18, revenue: 1200 },
];

const lineChartData = [
  { name: 'Jan', visits: 4000, orders: 240 },
  { name: 'Feb', visits: 3000, orders: 139 },
  { name: 'Mar', visits: 2000, orders: 980 },
  { name: 'Apr', visits: 2780, orders: 390 },
  { name: 'May', visits: 1890, orders: 480 },
  { name: 'Jun', visits: 2390, orders: 380 },
  { name: 'Jul', visits: 3490, orders: 430 },
];

const pieChartData = [
    { name: 'Cakes', value: 45 },
    { name: 'Cupcakes', value: 25 },
    { name: 'Other', value: 30 },
];

export default function AnalysisPage() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={kpi.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}>{kpi.change}</span> {kpi.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Orders by Category</CardTitle>
            <CardDescription>A breakdown of orders per product category for the last quarter.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px] w-full">
              <BarChartRe data={barChartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis />
                <RechartsTooltip 
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  content={<ChartTooltipContent />} 
                />
                <Legend />
                <Bar dataKey="orders" fill="hsl(var(--primary))" radius={4} />
              </BarChartRe>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Website Traffic vs. Orders</CardTitle>
            <CardDescription>Comparison of website visits and completed orders over time.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px] w-full">
                <LineChartRe data={lineChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <RechartsTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="visits" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} />
                    <Line yAxisId="right" type="monotone" dataKey="orders" stroke="hsl(var(--accent))" />
                </LineChartRe>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
       <div className="grid gap-8 md:grid-cols-2">
         <Card>
            <CardHeader>
                <CardTitle>Revenue by Category</CardTitle>
                <CardDescription>Contribution of each category to the total revenue.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}} className="h-[300px] w-full">
                    <PieChartRe>
                        <RechartsTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Pie
                            data={pieChartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="hsl(var(--primary))"
                            label
                        >
                             {pieChartData.map((entry, index) => (
                                <g key={`cell-${index}`}>
                                    <path
                                        d={""}
                                        fill={['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--secondary))'][index % 3]}
                                    />
                                </g>
                            ))}
                        </Pie>
                    </PieChartRe>
                </ChartContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Notes</CardTitle>
                 <CardDescription>A space for your thoughts and observations.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                    <ul>
                        <li><span className='font-bold text-foreground'>Spike in "Other" category revenue</span> seems to be driven by a few large, custom orders. Worth investigating if this is a repeatable trend.</li>
                        <li><span className='font-bold text-foreground'>Conversion rate dipped slightly.</span> This coincided with the new website launch. Monitor if this is a temporary adjustment period or if UX changes are needed.</li>
                        <li><span className='font-bold text-foreground'>Cupcake orders are consistent</span> but have lower revenue. Could explore bundled deals or premium cupcake options to increase average order value.</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
       </div>
    </div>
  );
}
