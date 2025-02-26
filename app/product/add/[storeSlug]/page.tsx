// app/product/add/[storeSlug]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { addProduct, getStores, slugify } from '@/lib/api';
import React from 'react';

export default function AddProduct({ params }: { params: Promise<{ storeSlug: string }> }) {
  const router = useRouter();
  const storeSlug = React.use(params).storeSlug;
  const [storeId, setStoreId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [photoUrl, setPhotoUrl] = useState<File | null>(null);

  useEffect(() => {
    const fetchStoreId = async () => {
      const stores = await getStores();
      const targetStore = stores.find((s: any) => slugify(s.name) === storeSlug);
      if (targetStore) setStoreId(targetStore.id);
    };
    fetchStoreId();
  }, [storeSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeId) return;
    try {
      await addProduct(storeId, { name, description, price, photoUrl: photoUrl || undefined });
      router.push(`/store/${storeSlug}`);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Product</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4 max-w-md mx-auto">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Photo</label>
          <input
            type="file"
            onChange={(e) => setPhotoUrl(e.target.files?.[0] || null)}
            className="mt-1 block w-full"
          />
        </div>
        <button type="submit" className="w-full bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600">
          Add Product
        </button>
      </form>
    </div>
  );
}