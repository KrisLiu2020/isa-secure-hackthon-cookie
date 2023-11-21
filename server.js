const http = require('http');
const port = process.env.PORT || 3000;
const { sign, verify, JsonWebTokenError } = require('jsonwebtoken');

const server = http.createServer((req, res) => {
  // if you run the client from sth like file:///C:/nodejs/10httonlyCookie1/index.html
  // it would mean HTML file is being served via the file:// protocol directly from your filesystem rather than over HTTP or HTTPS.
  console.log('Request origin:', req.headers.origin);
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', '*');// Adjust the port if necessary
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    // Preflight request automatically sends by browser for many reasons
    res.writeHead(204);//success with no content to return to the client
    res.end();
    return;
  }
 
  /*\ /login */
  if (req.url === '/hackathon/server/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
      try {
        const { username, password } = JSON.parse(body); // Parse the JSON body
        if (username === 'admin' && password === 'abc123') {
            
            let token = sign({ username }, "BENISCOOL", { expiresIn: 60 * 60,})
            
          res.writeHead(200, {
            'Set-Cookie': `token=${token}; SameSite=None; Secure; Max-Age=3600; Path=/ `,
            'Content-Type': 'application/json',
          });
          res.end(JSON.stringify({ message: 'Logged in successfully' }));
        } else {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Unauthorized' }));
        }
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Bad Request: Invalid JSON' }));
      }
    });
    /*\ /something */
  } else if (req.url === '/hackathon/server/something' && req.method === 'GET') {
    // Check if the user is logged in by checking the cookie
    const cookie = req.headers.cookie;
    
    let token;
    
    if (cookie) {
        const parsedCookies = cookies.split(';').reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split('=');
          acc[key] = value;
          return acc;
        }, {});
    
        token = parsedCookies.token;
    }
    
    let decode = verify(token, "BENISCOOL");
    let jwt_user = decode.username;
    
    if (jwt_user == "admin") {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'You are logged in, here is treasure trove!!' }));
    
    
    // if (cookie && cookie.includes('token=123456')) {
    //   res.writeHead(200, { 'Content-Type': 'application/json' });
    //   res.end(JSON.stringify({ message: 'You are logged in, here is treasure trove!!' }));
    } else {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Unauthorized: You are not logged in.' }));
    }
  } else {
    // For any other route, return 404 not found
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('404 Not Found');
  }
});
server.listen(port, () => {
  console.log('Server running on port 3000');
});//**  Generated mostly by chatGPT ver. 4 **/
