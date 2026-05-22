const API_URL = 'http://localhost:5000';

async function testAddProduct() {
  try {
    // 1. Login to get token
    const loginRes = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Adiljaseem',
        password: 'Adiljaz@123'
      })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('Logged in, token received');

    // 2. Add product
    // We send JSON here for simplicity, although real app sends multipart
    const res = await fetch(`${API_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Premium Silk Scarf',
        description: 'Elegant silk scarf with hand-rolled edges.',
        price: 2499,
        category: 'Accessories',
        subcategory: 'Scarves',
        gender: 'women',
        stock: 15,
        isFeatured: true,
        sizes: JSON.stringify(['One Size']),
        images: [{
          filename: 'scarf.jpg',
          url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=1000'
        }]
      })
    });

    const data = await res.json();
    console.log('Product added:', data);
  } catch (err) {
    console.error('Error adding product:', err.message);
  }
}

testAddProduct();
