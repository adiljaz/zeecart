(async () => {
  try {
    const res = await fetch('http://localhost:5000/api/products?page=1&limit=20&sort=newest');
    const data = await res.json();
    console.log(Object.keys(data));
  } catch (err) {
    console.error(err);
  }
})();
