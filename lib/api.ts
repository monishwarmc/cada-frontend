// lib/api.ts
export const BASE_URL = 'http://localhost:8080';

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, ''); // Remove special characters
}

export async function getStores() {
  try {
    const response = await fetch(`${BASE_URL}/store`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch stores: ${response.status} - ${response.statusText} - ${errorText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error in getStores:', error);
    throw error;
  }
}

export async function getStore(id: string) {
  const response = await fetch(`${BASE_URL}/store/${id}`);
  if (!response.ok) throw new Error('Failed to fetch store');
  return response.json();
}

export async function getProductsByStore(storeId: string) {
  const response = await fetch(`${BASE_URL}/product/store/${storeId}`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
}

export async function addStore(storeData: { name: string; location: string; phoneNumber: string; photo?: File }) {
  const formData = new FormData();
  formData.append('name', storeData.name);
  formData.append('location', storeData.location);
  formData.append('phoneNumber', storeData.phoneNumber);
  if (storeData.photo) formData.append('photo', storeData.photo);

  const response = await fetch(`${BASE_URL}/store/add`, { method: 'POST', body: formData });
  if (!response.ok) throw new Error('Failed to add store');
  return response.json();
}

export async function updateStore(id: string, storeData: { name?: string; location?: string; phoneNumber?: string; photo?: File }) {
  const formData = new FormData();
  if (storeData.name) formData.append('name', storeData.name);
  if (storeData.location) formData.append('location', storeData.location);
  if (storeData.phoneNumber) formData.append('phoneNumber', storeData.phoneNumber);
  if (storeData.photo) formData.append('photo', storeData.photo);

  const response = await fetch(`${BASE_URL}/store/update/${id}`, { method: 'PUT', body: formData });
  if (!response.ok) throw new Error('Failed to update store');
  return response.json();
}

export async function deleteStore(id: string) {
  const response = await fetch(`${BASE_URL}/store/delete/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete store');
}

export async function addProduct(storeId: string, productData: { name: string; description?: string; price: string; photoUrl?: File }) {
  const formData = new FormData();
  formData.append('name', productData.name);
  if (productData.description) formData.append('description', productData.description);
  formData.append('price', productData.price);
  if (productData.photoUrl) formData.append('photo', productData.photoUrl);

  const response = await fetch(`${BASE_URL}/product/add/${storeId}`, { method: 'POST', body: formData });
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to add product: ${response.status} - ${response.statusText}`, errorText);
    throw new Error(`Failed to add product: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}

export async function updateProduct(id: string, productData: { name?: string; description?: string; price?: string; photo?: File }) {
  const formData = new FormData();
  if (productData.name) formData.append('name', productData.name);
  if (productData.description) formData.append('description', productData.description);
  if (productData.price) formData.append('price', productData.price);
  if (productData.photo) formData.append('photo', productData.photo);

  const response = await fetch(`${BASE_URL}/product/update/${id}`, { method: 'PUT', body: formData });
  if (!response.ok) throw new Error('Failed to update product');
  return response.json();
}

export async function deleteProduct(id: string) {
  const response = await fetch(`${BASE_URL}/product/delete/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete product');
}