const https = require('https');

const tryLogin = (payload) => new Promise(res => {
  const req = https.request('https://zeecart-backend.onrender.com/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, r => {
    res(r.statusCode);
  });
  req.on('error', () => res(0));
  req.write(payload);
  req.end();
});

(async () => {
  const code = await tryLogin('{}');
  console.log(`Tried empty object -> ${code}`);
  const code2 = await tryLogin('{"username":null,"password":null}');
  console.log(`Tried nulls -> ${code2}`);
})();
