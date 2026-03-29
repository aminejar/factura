// Test syntax check for payments.js
const fs = require('fs');

try {
  const content = fs.readFileSync('./invoice-api/src/routes/payments.js', 'utf8');

  // Basic syntax check - look for unmatched braces
  let braceCount = 0;
  let inString = false;
  let stringChar = '';

  for (let i = 0; i < content.length; i++) {
    const char = content[i];

    if (!inString && (char === '"' || char === "'")) {
      inString = true;
      stringChar = char;
    } else if (inString && char === stringChar && content[i-1] !== '\\') {
      inString = false;
    } else if (!inString) {
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
    }
  }

  if (braceCount === 0) {
    console.log('✅ Syntax check passed: Braces are balanced');
  } else {
    console.log(`❌ Syntax error: Unbalanced braces (${braceCount})`);
  }

  // Check for try without catch/finally
  const tryMatches = content.match(/try\s*\{/g) || [];
  const catchMatches = content.match(/catch\s*\(/g) || [];
  const finallyMatches = content.match(/finally\s*\{/g) || [];

  if (tryMatches.length === catchMatches.length + finallyMatches.length) {
    console.log('✅ Try-catch structure is correct');
  } else {
    console.log(`❌ Try-catch mismatch: ${tryMatches.length} try blocks, ${catchMatches.length} catch blocks, ${finallyMatches.length} finally blocks`);
  }

} catch (error) {
  console.error('Error reading file:', error.message);
}


