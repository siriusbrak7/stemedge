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
  
  // My previous scripts created `}\n  },\n  {` or similar. 
  // We want `}\n  ,\n  {`
  // Let's use a very forgiving regex:
  // Match `}`, followed by any whitespace, followed by `}`, followed by any whitespace, followed by `,`, followed by any whitespace, followed by `{` and `id:`
  // And replace the middle `},` with just `,`
  code = code.replace(/}(\s*)},(\s*)\{\s*id:/g, '}$1,$2{\n        id:');
  
  fs.writeFileSync(f, code, 'utf8');
  console.log('Fixed syntax 2 in ' + f);
});
