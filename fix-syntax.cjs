const fs = require('fs');

const files = [
  'src/data/biology/human-physiology.ts',
  'src/data/biology/genetics-molecular.ts',
  'src/data/physics/forces-motion.ts',
  'src/data/physics/waves-optics.ts',
  'src/data/chemistry/atomic-periodic.ts',
  'src/data/chemistry/quantitative-chemistry.ts',
  'src/data/chemistry/thermodynamics.ts'
];

files.forEach(f => {
  let code = fs.readFileSync(f, 'utf8');
  
  // The bad replacement turned `],\n    {\n      id:` into `},\n    {\n      id:`
  // But the previous line already had `}` closing the object.
  // So we have `}\n        },\n      {` which is a syntax error.
  // We want to replace `\n        },\n      {\n` with `\n        ,\n      {\n`
  // Let's use a regex that finds `}\n        },\n` and changes it to `}\n        ,\n`
  code = code.replace(/}\s*},\s*\{\s*id:/g, '}\n        ,\n      {\n        id:');
  
  fs.writeFileSync(f, code, 'utf8');
  console.log('Fixed syntax in ' + f);
});
