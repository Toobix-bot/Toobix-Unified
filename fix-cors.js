// Fix CORS headers - merge into existing options object
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'scripts', 'groq-api-service.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Fix: Response.json(..., { status: X }, { headers: corsHeaders }) → Response.json(..., { status: X, headers: corsHeaders })
content = content.replace(/Response\.json\(([^)]+), \{ status: (\d+) \}, \{ headers: corsHeaders \}\)/g,
  'Response.json($1, { status: $2, headers: corsHeaders })');

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Fixed CORS headers syntax');
