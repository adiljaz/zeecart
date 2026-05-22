const https = require('https');

const makeRequest = (options, payload) => new Promise((resolve, reject) => {
  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => resolve({ status: res.statusCode, data }));
  });
  req.on('error', reject);
  if (payload) req.write(payload);
  req.end();
});

(async () => {
  try {
    const loginRes = await makeRequest({
      hostname: 'zeecart-backend.onrender.com',
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, '{}');
    
    console.log('Login status:', loginRes.status);
    console.log('Login response:', loginRes.data);
    
    const token = JSON.parse(loginRes.data).token;
    
    // Now try to hit a protected route using this token
    const statsRes = await makeRequest({
      hostname: 'zeecart-backend.onrender.com',
      path: '/api/settings', // Assuming settings requires admin
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}` 
      }
    });
    
    console.log('Settings status:', statsRes.status);
    console.log('Settings response:', statsRes.data);
  } catch (err) {
    console.error(err);
  }
})();
