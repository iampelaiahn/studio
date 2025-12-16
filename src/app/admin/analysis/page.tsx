
'use client';

import React from 'react';
import { BarChart, LineChart, PieChart, Users, ShoppingBag, DollarSign, Percent } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart as BarChartRe, Line, LineChart as LineChartRe, Pie, PieChart as PieChartRe, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useCollection } from '@/firebase';
import { collectionGroup, query } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useMemo } from 'react';

const PIE_CHART_COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--secondary))'];

export default function AnalysisPage() {
  const firestore = useFirestore();
  
  const customOrdersQuery = useMemo(() => {
      if (!firestore) return null;
      return query(collectionGroup(firestore, 'customOrders'));
  }, [firestore]);

  const { data: orders, isLoading } = useCollection<any>(customOrdersQuery);

  const { kpis, barChartData, lineChartData, pieChartData } = useMemo(() => {
    if (!orders) {
      return { kpis: [], barChartData: [], lineChartData: [], pieChartData: [] };
    }

    // This is a placeholder for total visits, as we are not tracking it.
    const totalVisits = 12403; 
    
    const totalCustomers = new Set(orders.map(o => o.customerId)).size;
    const totalOrders = orders.length;
    // Placeholder conversion rate
    const conversionRate = totalVisits > 0 ? (totalOrders / totalVisits) * 100 : 0;

    const totalRevenue = orders.reduce((acc, order) => {
        // Assuming orders have a price, otherwise this will be 0
        return acc + (order.price || 0); 
    }, 0);

    const kpiData = [
      { title: "Total Visits", value: totalVisits.toLocaleString(), change: "+12.5%", description: "vs. previous 30 days", icon: BarChart },
      { title: "New Customers", value: totalCustomers.toLocaleString(), change: "+8.2%", description: "this month", icon: Users },
      { title: "Conversion Rate", value: `${conversionRate.toFixed(1)}%`, change: "-1.1%", description: "vs. previous 30 days", icon: Percent },
      { title: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, change: "+20.1%", description: "this month", icon: DollarSign },
    ];

    const ordersByCategory = orders.reduce((acc, order) => {
      const category = order.productType || 'Other';
      if (!acc[category]) {
        acc[category] = { orders: 0, revenue: 0 };
      }
      acc[category].orders += 1;
      acc[category].revenue += order.price || 0;
      return acc;
    }, {} as Record<string, { orders: number, revenue: number }>);

    const barData = Object.entries(ordersByCategory).map(([name, data]) => ({ name, ...data }));
    
    const revenueByCategory = Object.entries(ordersByCategory).map(([name, data]) => ({
      name,
      value: data.revenue,
    }));

    // Placeholder line chart data
    const lineData = [
      { name: 'Jan', visits: 4000, orders: 24 },
      { name: 'Feb', visits: 3000, orders: 13 },
      { name: 'Mar', visits: 2000, orders: 80 },
      { name: 'Apr', visits: 2780, orders: 39 },
      { name: 'May', visits: 1890, orders: 48 },
      { name: 'Jun', visits: 2390, orders: 38 },
      { name: 'Jul', visits: 3490, orders: 43 },
    ];


    return { kpis: kpiData, barChartData: barData, lineChartData: lineData, pieChartData: revenueByCategory };

  }, [orders]);


  if (isLoading) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
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
            <CardDescription>A breakdown of orders per product category.</CardDescription>
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
            <CardDescription>Comparison of website visits and completed orders over time (static data).</CardDescription>
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
                                <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
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
