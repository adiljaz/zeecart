const run = async () => {
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Adiljaseem',
        password: 'Adiljaz@123'
      })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('Token:', token);

    const form = new FormData();
    form.append('name', 'Test Product');
    form.append('description', 'Test Description');
    form.append('price', '100');
    form.append('discountedPrice', '');
    form.append('category', 'T-Shirts');
    form.append('subcategory', 'Round Neck');
    form.append('gender', 'men');
    form.append('sizes', JSON.stringify(['S', 'M']));
    form.append('stock', '10');
    form.append('is360View', 'false');
    form.append('isFeatured', 'false');

    const res = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: form
    });

    const resData = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', resData);
  } catch (err) {
    console.error('Error:', err);
  }
};

run();
