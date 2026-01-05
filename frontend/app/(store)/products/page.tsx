import { listProducts } from '@/lib/products';

export const dynamic = 'force-static';

export default async function ProductsPage() {
  const products = await listProducts();
  return (
    <section className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p: any) => (
          <article key={p.id} className="border rounded p-3">
            <h3 className="font-medium">{p.name}</h3>
            <p className="text-sm text-gray-600">{p.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
