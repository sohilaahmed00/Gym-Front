import { API_BASE_URL } from "../config";

export const fetchProductById = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/Products/GetProductById${id}`);
    if (!res.ok) throw new Error('Failed to fetch product with ID ' + id);
    const data = await res.json();
    console.log(`✅ Product ${id} API response:`, data);
    return data;
  } catch (err) {
    console.error(`❌ Error fetching product ${id}:`, err);
    return null;
  }
}; 