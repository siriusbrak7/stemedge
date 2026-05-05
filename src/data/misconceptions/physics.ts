import { Misconception } from '../../components/shared/MisconceptionAlert';

export type { Misconception };

export const FORCES_MOTION_MISCONCEPTIONS: Misconception[] = [
  {
    id: 'force-needed-motion',
    title: 'A Force Is Needed to Keep an Object Moving',
    misconception: 'Objects naturally slow down and stop unless a force keeps pushing them.',
    correction: 'An object in motion stays in motion at constant velocity unless acted on by a net force (Newton\'s First Law). Objects slow down because of friction, not because they "want" to stop.',
    explanation: 'This is Aristotle\'s view of motion, which persisted for 2000 years. Galileo and Newton showed that a moving object keeps moving forever unless a force (like friction, air resistance, or gravity) acts on it. In space, where there is no friction, spacecraft coast indefinitely after their engines shut off.',
    examples: [
      'A puck on an air hockey table glides for a long time because friction is nearly eliminated.',
      'The Voyager spacecraft have been coasting through space since 1977 with no engine thrust.',
    ],
    relatedTopic: 'forces-motion',
    difficulty: 'common',
  },
  {
    id: 'heavier-falls-faster',
    title: 'Heavier Objects Fall Faster',
    misconception: 'A heavy stone falls faster than a light feather because gravity pulls harder on heavier objects.',
    correction: 'In a vacuum, ALL objects fall at the same rate regardless of mass. Objects fall at different speeds in air because of air resistance, not gravity.',
    explanation: 'Galileo proved that gravitational acceleration (g ≈ 9.8 m/s²) is the same for all objects. While gravity exerts more force on a heavier object (F = mg), the heavier object also has more inertia (F = ma), and these effects exactly cancel. On the Moon (no air), an astronaut dropped a hammer and feather simultaneously — they hit the ground together.',
    examples: [
      'On the Moon, a hammer and feather fall at the same rate.',
      'A crumpled piece of paper falls faster than a flat sheet because of reduced air resistance, not increased gravity.',
    ],
    relatedTopic: 'forces-motion',
    difficulty: 'common',
  },
  {
    id: 'normal-reaction-opposite-weight',
    title: 'Normal Force Is Always Equal to Weight',
    misconception: 'The normal reaction force always equals the object\'s weight (mg).',
    correction: 'The normal force equals mg only when the surface is horizontal and no other vertical forces act. On an incline, or with additional forces, the normal force changes.',
    explanation: 'The normal force is whatever the surface exerts to prevent the object from passing through. On a horizontal surface with no other forces, N = mg. On an incline at angle θ, N = mg cos θ. In an elevator accelerating upward, N = m(g + a). Always apply Newton\'s Second Law in the perpendicular direction.',
    examples: [
      'On a 30° incline, N = mg cos 30° ≈ 0.87mg, not mg.',
      'In an elevator accelerating upward, you feel heavier because N > mg.',
    ],
    relatedTopic: 'forces-motion',
    difficulty: 'moderate',
  },
  {
    id: 'action-reaction-cancel',
    title: 'Action-Reaction Forces Cancel Out',
    misconception: 'Newton\'s Third Law means action and reaction forces cancel each other, so objects shouldn\'t accelerate.',
    correction: 'Action-reaction forces act on DIFFERENT objects, so they never cancel. Forces only cancel when they act on the SAME object.',
    explanation: 'If you push a box, the box pushes back on you with equal force. But your push acts on the box, and the box\'s push acts on you. They are on different objects. To determine whether the box accelerates, consider only the forces ON the box, not the reaction forces on other objects.',
    examples: [
      'Earth pulls you down with gravity; you pull Earth up equally — but Earth barely moves because of its huge mass.',
      'A rocket pushes gas backward; the gas pushes the rocket forward. These act on different objects, so the rocket accelerates.',
    ],
    relatedTopic: 'forces-motion',
    difficulty: 'moderate',
  },
  {
    id: 'velocity-acceleration-same',
    title: 'Velocity and Acceleration Always Point the Same Way',
    misconception: 'If an object is moving forward, its acceleration must also be forward.',
    correction: 'Acceleration is the rate of change of velocity. It can point in the opposite direction to velocity (deceleration) or perpendicular to it (circular motion).',
    explanation: 'When you brake a car, velocity is forward but acceleration is backward (deceleration). In circular motion, velocity is tangent to the circle but acceleration (centripetal) points toward the centre. Acceleration tells you how velocity is CHANGING, not which way the object is going.',
    examples: [
      'A ball thrown upward has downward acceleration (gravity) even while still moving upward.',
      'In uniform circular motion, acceleration is always perpendicular to velocity.',
    ],
    relatedTopic: 'forces-motion',
    difficulty: 'common',
  },
];

export const WAVES_MISCONCEPTIONS: Misconception[] = [
  {
    id: 'sound-vacuum',
    title: 'Sound Travels in a Vacuum',
    misconception: 'Sound can travel through empty space, which is why we can hear explosions in space movies.',
    correction: 'Sound is a mechanical wave that requires a medium (solid, liquid, or gas). It cannot travel through a vacuum.',
    explanation: 'Sound is a longitudinal wave — vibrations of particles in a medium. In a vacuum, there are no particles to vibrate, so sound cannot propagate. Space movies depict audible explosions for dramatic effect, but in reality space is silent. Electromagnetic waves (light, radio) can travel through a vacuum because they don\'t need a medium.',
    examples: [
      'The "Star Wars" explosion sound would not actually be heard in space.',
      'Astronauts communicate using radios (electromagnetic waves), not sound.',
    ],
    relatedTopic: 'waves-optics',
    difficulty: 'common',
  },
  {
    id: 'loud-equals-fast',
    title: 'Louder Sounds Travel Faster',
    misconception: 'A louder sound travels faster through air than a quieter sound.',
    correction: 'The speed of sound in air depends on temperature (and the medium), not on loudness or frequency. All sounds at the same temperature travel at the same speed.',
    explanation: 'The speed of sound in air at 20°C is approximately 343 m/s regardless of volume or pitch. Speed depends on the medium\'s properties (temperature, density, elasticity). A whisper and a shout at the same temperature reach you at the same speed — the shout just has more energy (amplitude).',
    examples: [
      'At Cape Coast Castle, a loud drum and a quiet whisper travel at the same speed through the air.',
      'Sound travels faster in warm air (v ∝ √T) — about 343 m/s at 20°C vs 331 m/s at 0°C.',
    ],
    relatedTopic: 'waves-optics',
    difficulty: 'common',
  },
  {
    id: 'light-always-straight',
    title: 'Light Always Travels in Straight Lines',
    misconception: 'Light never bends — it always travels in a perfectly straight path.',
    correction: 'Light bends (refracts) when passing between media of different densities, and diffracts around obstacles or through narrow gaps.',
    explanation: 'While light travels in straight lines in a uniform medium, it changes direction at boundaries (refraction) — this is why a straw looks bent in water. Light also bends around edges (diffraction), especially when the gap or obstacle is comparable to the wavelength. These effects are essential for lenses, fibre optics, and underwater optical communication systems.',
    examples: [
      'A straw appears bent in water because light refracts at the water-air boundary.',
      'Diffraction gratings spread white light into a spectrum — used in spectroscopy at Ghana\'s research labs.',
    ],
    relatedTopic: 'waves-optics',
    difficulty: 'moderate',
  },
];

export const ELECTROMAGNETISM_MISCONCEPTIONS: Misconception[] = [
  {
    id: 'current-used-up',
    title: 'Current Gets Used Up in a Circuit',
    misconception: 'Current is consumed by components in a circuit — less current leaves a resistor than enters it.',
    correction: 'Current is conserved: the same current flows into and out of every component in a series circuit. It is ENERGY that is transferred, not current.',
    explanation: 'Think of current like water flow in a pipe: the same amount of water flows past every point in a single pipe. A resistor converts electrical energy to heat energy, but the charge carriers (electrons) keep flowing. Kirchhoff\'s Current Law states that current in = current out at every junction. What changes is the voltage (potential energy per charge), not the current.',
    examples: [
      'In a series circuit with a 12V battery and two equal resistors, 6V drops across each, but the same current flows through both.',
      'A 100W bulb and a 60W bulb in series have the same current — the 100W bulb has lower resistance.',
    ],
    relatedTopic: 'electromagnetism',
    difficulty: 'common',
  },
  {
    id: 'voltage-current-same',
    title: 'Voltage and Current Are the Same Thing',
    misconception: 'Voltage is just another word for current — they are the same.',
    correction: 'Voltage (potential difference) is the energy per unit charge (measured in volts). Current is the rate of flow of charge (measured in amperes). They are related by V = IR but are fundamentally different.',
    explanation: 'A helpful analogy: voltage is like water pressure (how hard the pump pushes), and current is like water flow rate (how much water passes per second). A high voltage can exist with zero current (like a disconnected battery). Ohm\'s Law (V = IR) connects them, but they are different quantities. At Akosombo Dam, high voltage is used for transmission to reduce current and therefore energy loss.',
    examples: [
      'A 12V car battery can deliver hundreds of amps (starting current) but a 12V small battery delivers milliamps — same voltage, different current capacity.',
      'Ghana\'s transmission lines carry 161 kV at relatively low current to minimise I²R energy losses.',
    ],
    relatedTopic: 'electromagnetism',
    difficulty: 'common',
  },
];

export const ALL_PHYSICS_MISCONCEPTIONS = [
  ...FORCES_MOTION_MISCONCEPTIONS,
  ...WAVES_MISCONCEPTIONS,
  ...ELECTROMAGNETISM_MISCONCEPTIONS,
];
