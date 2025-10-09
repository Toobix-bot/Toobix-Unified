// Add CORS headers to ALL Response.json calls that don't have them
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'scripts', 'groq-api-service.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Pattern 1: Response.json({...}) with no second parameter at all
let count1 = 0;
content = content.replace(/return Response\.json\((\{[^}]+\})\);/g, (match, json) => {
  count1++;
  return `return Response.json(${json}, { headers: corsHeaders });`;
});

// Pattern 2: Multi-line Response.json({ ... })
let count2 = 0;
const lines = content.split('\n');
const result = [];
let inResponseJson = false;
let responseStart = -1;
let braceCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (line.includes('return Response.json(') && !line.includes('headers: corsHeaders')) {
    inResponseJson = true;
    responseStart = i;
    braceCount = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
    result.push(line);
  } else if (inResponseJson) {
    braceCount += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
    result.push(line);

    if (braceCount <= 0 && line.includes(');')) {
      // End of Response.json - add headers if not present
      if (!lines.slice(responseStart, i+1).join('\n').includes('headers: corsHeaders')) {
        // Replace the closing );
        result[result.length - 1] = line.replace(/\);/, ', { headers: corsHeaders });');
        count2++;
      }
      inResponseJson = false;
    }
  } else {
    result.push(line);
  }
}

fs.writeFileSync(filePath, result.join('\n'), 'utf8');
console.log(`✅ Added CORS headers to ${count1 + count2} Response.json() calls`);
console.log(`   Pattern 1 (single line): ${count1}`);
console.log(`   Pattern 2 (multi line): ${count2}`);
