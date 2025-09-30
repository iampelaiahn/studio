
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Cake, Package } from "lucide-react";

function CupcakeIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M17.5 11c.3-1.4.1-2.8-.7-4-.8-1.2-2.1-2-3.8-2h-2c-1.7 0-3 .8-3.8 2-.8 1.2-1 2.6-.7 4-1.2.3-2.5.8-2.5 2v2c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2c0-1.2-1.3-1.7-2.5-2z" />
            <path d="M5 15v2c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-2" />
            <path d="M8 11c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2" />
        </svg>
    )
}

const pricingTiers = [
    {
        title: "Cupcakes",
        price: "$15",
        period: "per dozen",
        icon: <CupcakeIcon className="w-8 h-8 mb-4 text-primary" />,
        features: [
            "12 delicious cupcakes",
            "Perfect for parties and events",
            "Variety of flavors available"
        ]
    },
    {
        title: "Bento Box",
        price: "$30",
        period: "per box",
        icon: <Package className="w-8 h-8 mb-4 text-primary" />,
        features: [
            "One small cake",
            "Five matching cupcakes",
            "Great for gifts"
        ]
    },
    {
        title: "Small Cake",
        price: "$80+",
        period: "4-6 inches",
        icon: <Cake className="w-8 h-8 mb-4 text-primary" />,
        features: [
            "Ideal for intimate gatherings",
            "Price varies by design, flavor, and icing",
        ]
    },
    {
        title: "Large Cake",
        price: "$120+",
        period: "8-10 inches",
        icon: <Cake className="w-8 h-8 mb-4 text-primary" />,
        features: [
            "Perfect for larger celebrations",
            "Price varies by design, flavor, and icing",
        ]
    },
];

const notes = [
    "A deposit is due upon placement of your order.",
    "The remaining balance is due upon collection or delivery.",
    "We offer free delivery within a 15-mile radius.",
    "A $15 delivery fee applies to locations outside the 15-mile radius."
];

export default function PricingPage() {
    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-headline text-balance">Capabilities & Pricing</h1>
                <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
                    Find the perfect treat for your occasion. Please note that prices for custom cakes are a starting point and can vary.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                {pricingTiers.map((tier) => (
                    <Card key={tier.title} className="flex flex-col">
                        <CardHeader className="items-center">
                            {tier.icon}
                            <CardTitle className="font-headline">{tier.title}</CardTitle>
                            <CardDescription className="text-center">
                                <span className="text-3xl font-bold text-foreground">{tier.price}</span>
                                <span className="text-muted-foreground"> {tier.period}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <ul className="space-y-2">
                                {tier.features.map((feature, index) => (
                                    <li key={index} className="flex items-center gap-2 text-sm">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="max-w-2xl mx-auto bg-muted/30 p-8 rounded-lg">
                <h2 className="text-2xl font-headline mb-4 text-center">Important Information</h2>
                <ul className="space-y-3">
                    {notes.map((note, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-primary mt-1 shrink-0" />
                            <span className="text-muted-foreground">{note}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
