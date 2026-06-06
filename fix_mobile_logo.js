const fs = require('fs');

const path = './src/components/payload/HeaderPreview.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  /Chambers of JB/g,
  'Chambers of Jeet Bhatt'
);

fs.writeFileSync(path, code);
console.log('Success');
