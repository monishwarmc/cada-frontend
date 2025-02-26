// components/DeleteButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { deleteStore } from '@/lib/api';

export default function DeleteButton({ storeId }: { storeId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this store?')) {
      try {
        await deleteStore(storeId);
        router.push('/');
      } catch (error) {
        console.error('Failed to delete store', error);
      }
    }
  };

  return (
    <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
      Delete Store
    </button>
  );
}