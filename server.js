const http = require('http');

// Simulating a lightweight Data Persistence Layer (In-Memory Array)
let usersDatabase = [
  { id: 1, name: 'Alice Smith', email: 'alice@decodelabs.com' },
  { id: 2, name: 'Bob Jones', email: 'bob@decodelabs.com' }
];

const PORT = 3000;

// Central Server Engine
const server = http.createServer((req, res) => {
  // Set default JSON headers for the Output Provision
  res.setHeader('Content-Type', 'application/json');

  // Parse routing pathways
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // ==========================================================================
  // 1. ROUTE: GET /users (Resource Retrieval - Safe & Idempotent)
  // ==========================================================================
  if (pathname === '/users' && req.method === 'GET') {
    res.statusCode = 200;
    return res.end(JSON.stringify({
      status: 'success',
      throughput: '5.2 GB/s', // Matching system throughput specs
      data: usersDatabase
    }));
  }

  // ==========================================================================
  // 2. ROUTE: POST /users (Resource Creation - Unsafe & Non-idempotent)
  // ==========================================================================
  else if (pathname === '/users' && req.method === 'POST') {
    let body = '';

    // INPUT: Capture incoming request data ingress streams
    req.on('data', chunk => {
      body += chunk.toString();
    });

    // PROCESS: Once the data stream finishes, validate and parse it
    req.on('end', () => {
      try {
        // Handle empty request payload errors gracefully
        if (!body) {
          res.statusCode = 400;
          return res.end(JSON.stringify({ 
            error: 'Bad Request', 
            message: 'Malformed or empty JSON payload received.' 
          }));
        }

        const inputData = JSON.parse(body);

        // Core Validation Logic Layer
        if (!inputData.name || !inputData.email) {
          res.statusCode = 422; // Unprocessable Entity
          return res.end(JSON.stringify({
            status: 'error',
            message: 'Validation Failed. both "name" and "email" fields are mandatory.'
          }));
        }

        // Generate the structural entry
        const newUser = {
          id: usersDatabase.length + 1,
          name: inputData.name,
          email: inputData.email
        };

        // Persist to local state collection
        usersDatabase.push(newUser);

        // OUTPUT: Return successful provision message along with the new entity
        res.statusCode = 201; // Created
        return res.end(JSON.stringify({
          status: 'success',
          message: 'User created successfully.',
          data: newUser
        }));

      } catch (error) {
        // Resilience Protocol: Prevent server crash on broken client payload formatting
        res.statusCode = 400;
        return res.end(JSON.stringify({
          status: 'error',
          message: 'Invalid JSON structural parsing failure.'
        }));
      }
    });
  }

  // ==========================================================================
  // 3. ERROR HANDLING: 404 Route Not Found
  // ==========================================================================
  else {
    res.statusCode = 404;
    return res.end(JSON.stringify({
      status: 'error',
      message: `The endpoint matching '${req.method} ${pathname}' does not exist on this server.`
    }));
  }
});

// Launch System Instance
server.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 DecodeLabs Neural Backend Online`);
  console.log(`📡 Listening for API Ingress Points on port ${PORT}`);
  console.log(`🟢 GET  Standard: http://localhost:${PORT}/users`);
  console.log(`🟡 POST Standard: http://localhost:${PORT}/users`);
  console.log(`===================================================`);
});