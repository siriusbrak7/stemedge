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
  
  // Replace the closing bracket of subtopics with a comma
  // The script previously inserted new subtopics AFTER "],"
  // We need to change "]," to "}," so they become elements of the subtopics array
  code = code.replace(/],\s*{\s*id: /g, '},\n      {\n        id: ');
  
  // Now add "]," right before "finalAssessment: ["
  code = code.replace(/}\s*finalAssessment: \[/g, '}\n        ],\n        finalAssessment: [');
  
  fs.writeFileSync(f, code, 'utf8');
  console.log('Fixed ' + f);
});
