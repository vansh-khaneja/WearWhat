export async function listProducts() {
  const res = await fetch(`${process.env.API_BASE_URL}/products`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function getProduct(id: string) {
  const res = await fetch(`${process.env.API_BASE_URL}/products/${id}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}
