import { getProduct } from '@/lib/products';
import type { Metadata } from 'next';

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.id);
  return {
    title: product?.name ? `${product.name} • Store` : 'Product',
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProduct(params.id);
  return (
    <section className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
      <p className="text-gray-700 mb-4">{product.description}</p>
      <div className="text-lg font-medium">${product.price}</div>
    </section>
  );
}
