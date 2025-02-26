// app/store/[slug]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getStore, getProductsByStore, addProduct, deleteProduct, BASE_URL, getStores, slugify } from '@/lib/api';
import DeleteButton from '@/components/DeleteButton';
import React from 'react';

export default function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const slug = React.use(params).slug;
  const [store, setStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [sheetUrl, setSheetUrl] = useState('');
  const [storePhotoError, setStorePhotoError] = useState<string | null>(null);
  const [productPhotoErrors, setProductPhotoErrors] = useState<Record<string, string>>({});
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stores = await getStores();
        const targetStore = stores.find((s: any) => slugify(s.name) === slug);
        if (!targetStore) {
          setFetchError(`Store not found for slug: ${slug}`);
          return;
        }

        const storeData = await getStore(targetStore.id);
        const productsData = await getProductsByStore(targetStore.id);

        setStore(storeData);
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching store data:', error);
        setFetchError(error instanceof Error ? error.message : 'Unknown error occurred while fetching store data');
      }
    };
    fetchData();
  }, [slug]);


  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      console.log('Deleting product with ID:', productId);
      await deleteProduct(productId);
      setProducts(products.filter(product => product.id !== productId));
      console.log('Product deleted successfully:', productId);
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  if (fetchError) return <div className="text-center p-6 text-red-500">{fetchError}</div>;
  if (!store) return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{store.name}</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">Location: {store.location}</p>
        <p className="text-gray-600">Phone: {store.phoneNumber}</p>
        <img
          src={`${BASE_URL}/store/photo/${store.id}`}
          alt={store.name}
          className="mt-4 rounded-lg w-64 h-64 object-cover"
          onError={(e) => {
            const errorMsg = `Failed to load store photo for ${store.id}`;
            console.error(errorMsg, e);
            setStorePhotoError(errorMsg);
          }}
          onLoad={() => console.log('Store photo loaded successfully:', `${BASE_URL}/store/photo/${store.id}`)}
        />
        {storePhotoError && <p className="text-red-500 mt-2">{storePhotoError}</p>}
        <div className="mt-4 flex space-x-4">
          <Link href={`/store/edit/${slugify(store.name)}`} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
            Edit Store
          </Link>
          <DeleteButton storeId={store.id} />
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mt-6">Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">{product.name}</h3>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-gray-800 font-bold">${product.price}</p>
            <img
              src={`${BASE_URL}/product/photo/${product.id}`}
              alt={product.name}
              className="mt-2 rounded-lg w-48 h-48 object-cover"
              onError={(e) => {
                const errorMsg = `Failed to load product photo for ${product.id}`;
                console.error(errorMsg, e);
                setProductPhotoErrors((prev) => ({ ...prev, [product.id]: errorMsg }));
              }}
              onLoad={() => console.log('Product photo loaded successfully:', `${BASE_URL}/product/photo/${product.id}`)}
            />
            {productPhotoErrors[product.id] && (
              <p className="text-red-500 mt-2">{productPhotoErrors[product.id]}</p>
            )}
            <div className="mt-2 flex space-x-2">
              <Link href={`/product/edit/${product.id}`} className="text-blue-500 hover:underline">
                Edit
              </Link>
              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Link href={`/product/add/${slugify(store.name)}`} className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600">
          Add Product
        </Link>
      </div>
    </div>
  );
}