const BASE_URL = import.meta.env.VITE_API_BASE;

async function request(path, options = {}) {
  if (!BASE_URL) throw new Error('API base not configured');
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Request failed');
  }
  return res.json();
}

export async function fetchProducts() {
  return request('/api/products');
}

export async function createProduct(payload, token) {
  return request('/api/products', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify(payload),
  });
}

export async function updateProduct(id, payload, token) {
  return request(`/api/products/${id}`, {
    method: 'PUT',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify(payload),
  });
}

export async function deleteProduct(id, token) {
  return request(`/api/products/${id}`, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export async function fetchReviews() {
  return request('/api/reviews');
}

export async function createReview(payload) {
  return request('/api/reviews', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function createOrder(payload) {
  return request('/api/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function login(email, password) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}
