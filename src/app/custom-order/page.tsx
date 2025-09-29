import CustomOrderForm from './_components/custom-order-form';

export default function CustomOrderPage() {
  return (
    <div className="container mx-auto max-w-3xl py-12 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline text-balance">Create Your Dream Treat</h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
          Let's bring your vision to life! Follow the steps below to tell us exactly what you're looking for.
        </p>
      </header>
      <main>
        <CustomOrderForm />
      </main>
    </div>
  );
}
