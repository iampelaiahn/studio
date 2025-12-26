
import {
  BookUser,
  LayoutGrid,
  Scissors,
  MessageSquare,
  Calendar,
  type LucideIcon,
} from 'lucide-react';


export const products = [
  {
    id: "prod-1",
    name: "Blueberry Bliss",
    description: "A fluffy vanilla cake layered with fresh blueberry jam and a light cream cheese frosting.",
    category: "Cakes",
    imageId: "cake-1",
  },
  {
    id: "prod-2",
    name: "Strawberry Shortcake",
    description: "A slice of vanilla sponge cake with fresh strawberries and cream.",
    category: "Cakes",
    imageId: "cake-2",
  },
  {
    id: "prod-3",
    name: "Rainbow Delight",
    description: "A vibrant six-layered rainbow cake with vanilla frosting.",
    category: "Cakes",
    imageId: "cake-3",
  },
  {
    id: "prod-4",
    name: "Sweet Swirl",
    description: "A classic vanilla cupcake with a beautiful rose frosting swirl.",
    category: "Cupcakes",
    imageId: "cupcake-1",
  },
  {
    id: "prod-5",
    name: "Watercolor Wonder",
    description: "A stunning cake with a watercolor-effect buttercream frosting.",
    category: "Cakes",
    imageId: "cupcake-2",
  },
  {
    id: "prod-6",
    name: "Pink & Purple Dream",
    description: "A beautiful two-tiered cake with pink and purple ombre frosting.",
    category: "Cakes",
    imageId: "other-1",
  },
  {
    id: "prod-7",
    name: "Bicycle Ride",
    description: "A whimsical cake featuring a silhouette of a person riding a bicycle.",
    category: "Cakes",
    imageId: "other-2",
  },
  {
    id: "prod-8",
    name: "Nature's Ride",
    description: "A cake decorated with a bicycle on top, surrounded by rustic elements.",
    category: "Cakes",
    imageId: "other-3",
  },
  {
    id: "prod-9",
    name: "Whiskey Barrel",
    description: "A cake designed to look like a whiskey barrel, perfect for a connoisseur.",
    category: "Cakes",
    imageId: "cake-4",
  },
  {
    id: "prod-12",
    name: "Lemon & Strawberry",
    description: "A delightful stack of lemon and strawberry cake with complementary fillings.",
    category: "Cakes",
    imageId: "cake-5",
  },
  {
    id: "prod-13",
    name: "Red Velvet",
    description: "A classic red velvet cake with a rich cream cheese frosting.",
    category: "Cakes",
    imageId: "cake-6",
  },
  {
    id: "prod-14",
    name: "Chocolate & Vanilla",
    description: "A perfect combination of chocolate and vanilla layers.",
    category: "Cakes",
    imageId: "cake-7",
  },
  {
    id: "prod-15",
    name: "Triple Chocolate Fudge",
    description: "Decadent triple-layered chocolate fudge cake with a rich ganache frosting.",
    category: "Cakes",
    imageId: "cake-8",
  },
];

export type NavLink = {
  id: string;
  href: string;
  label: string;
  icon: LucideIcon;
};


export const navLinks: NavLink[] = [
  { id: "about", href: "/about", label: "About", icon: BookUser },
  { id: "products", href: "/products", label: "Catalog", icon: LayoutGrid },
  { id: "custom-order", href: "/custom-order", label: "Customize", icon: Scissors },
  { id: "feedback", href: "/feedback", label: "Feedback", icon: MessageSquare },
  { id: "availability", href: "#", label: "Book", icon: Calendar },
];

export const productTypes = ["Cakes", "Desserts", "Donuts", "Vegan", "Drinks", "Cupcakes"];

export const availableTimes = [
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
