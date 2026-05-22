(async () => {
  try {
    const res = await fetch('http://localhost:3000');
    console.log('Status:', res.status);
    console.log('Headers:', res.headers);
    const text = await res.text();
    console.log('Body length:', text.length);
    console.log('Body start:', text.substring(0, 100));
  } catch (err) {
    console.error(err);
  }
})();
