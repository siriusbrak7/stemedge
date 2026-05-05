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
  
  // Find where finalAssessment is
  const regex = /},\s*finalAssessment: \[/g;
  if (code.match(regex)) {
    code = code.replace(regex, '}\n        ],\n        finalAssessment: [');
    fs.writeFileSync(f, code, 'utf8');
    console.log('Fixed array close in ' + f);
  }
});
