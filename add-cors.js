// Add CORS headers to all Response.json calls in groq-api-service.ts
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'scripts', 'groq-api-service.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Pattern to match Response.json(...) without headers
const pattern = /return Response\.json\(([^)]+)\);/g;

let count = 0;
content = content.replace(pattern, (match, inner) => {
  // Skip if already has headers
  if (inner.includes('{ headers:') || inner.includes('{headers:')) {
    return match;
  }
  count++;
  return `return Response.json(${inner}, { headers: corsHeaders });`;
});

fs.writeFileSync(filePath, content, 'utf8');
console.log(`✅ Added CORS headers to ${count} Response.json() calls`);
