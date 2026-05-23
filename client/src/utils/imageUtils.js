const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://zeecart-backend.onrender.com' : 'http://localhost:5000');

export const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000';
  if (imagePath.startsWith('http') || imagePath.startsWith('data:image')) return imagePath;
  
  const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  return `${baseUrl}${path}`;
};
