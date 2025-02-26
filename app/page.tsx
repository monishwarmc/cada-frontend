
// app/page.tsx
import Link from 'next/link';
import { getStores, slugify } from '@/lib/api';

export default async function Home() {
  const stores = await getStores();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 animate-fade-in">Store Management</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store: { id: number; name: string }) => (
          <Link
            key={store.id}
            href={`/store/${slugify(store.name)}`}
            className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-blue-600">{store.name}</h2>
          </Link>
        ))}
      </div>
      <Link
        href="/store/add"
        className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors"
      >
        Add New Store
      </Link>
    </div>
  );
}