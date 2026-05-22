(async () => {
  try {
    const res = await fetch('http://localhost:5000/api/products');
    const data = await res.json();
    const badProducts = data.products.filter(p => typeof p.name !== 'string');
    console.log('Bad products:', badProducts);
    
    // Check if category is string
    const badCategory = data.products.filter(p => typeof p.category !== 'string' && p.category !== undefined && p.category !== null);
    console.log('Bad categories:', badCategory);
  } catch (err) {
    console.error(err);
  }
})();
