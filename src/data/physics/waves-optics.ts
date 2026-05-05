import type { Topic } from '../types';

export const WAVES_OPTICS_TOPIC: Topic = {
  id: 'waves-optics',
  title: 'Waves and the EM Spectrum',
  subtopics: [
    {
      id: 'wave-properties',
      title: 'Waves: Properties, Types, and the EM Spectrum',
      lesson: {
        sections: [
          {
            title: 'What is a Wave?',
            content: 'A wave is a transfer of energy without the transfer of matter. Waves are described by: amplitude (A) — the maximum displacement from equilibrium; wavelength (λ) — the distance between two successive identical points; frequency (f) — the number of complete oscillations per second (Hz); and wave speed (v). The wave equation is v = fλ.',
            interactive: {
              type: 'reveal' as const,
              label: 'Calculate: if f = 200 Hz and λ = 1.5 m, what is v?',
              hiddenContent: 'v = fλ = 200 × 1.5 = 300 m/s'
            }
          },
          {
            title: 'Transverse vs Longitudinal',
            content: 'Transverse waves: particles oscillate perpendicular to the direction of wave travel (examples: light, water waves, seismic S-waves). Longitudinal waves: particles oscillate parallel to the direction of wave travel, forming compressions and rarefactions (examples: sound, seismic P-waves, ultrasound). Longitudinal waves require a medium; EM waves can travel through vacuum.',
            interactive: {
              type: 'expand' as const,
              label: 'Which type is sound?',
              hiddenContent: 'Sound is a longitudinal wave — air particles are pushed together (compression) and pulled apart (rarefaction) in the direction of travel. This is why sound cannot travel through space but light can.'
            }
          },
          {
            title: 'The Electromagnetic Spectrum',
            content: 'All EM waves travel at c = 3 × 10⁸ m/s in vacuum. From lowest to highest frequency: Radio → Microwave → Infrared → Visible → Ultraviolet → X-ray → Gamma ray. Higher frequency means shorter wavelength and more energy per photon (E = hf). In Ghana: GBC/Citi FM uses radio waves; DSTV uses microwaves; Korle Bu uses X-rays and gamma radiation.',
          },
          {
            title: 'The Doppler Effect',
            content: 'When a wave source moves toward an observer, the observed frequency increases (blue shift). Moving away decreases it (red shift). Formula: f\' = f × v/(v ∓ v_source). Applications include: police speed cameras (microwave radar), ultrasound diagnostics, and red shift in astronomy confirming the expanding universe.',
            interactive: {
              type: 'reveal' as const,
              label: 'Ghana speed camera example',
              hiddenContent: 'On the Accra–Kumasi road, police radar guns emit microwaves at a known frequency. A car\'s reflection Doppler-shifts that frequency. The change in frequency is measured electronically and converted to speed in real time.'
            }
          }
        ]
      },
      flashcards: [
        { id: 'wp-f1', question: 'Wave equation relating speed, frequency, and wavelength?', answer: 'v = fλ' },
        { id: 'wp-f2', question: 'In which wave type do particles vibrate perpendicular to wave direction?', answer: 'Transverse wave' },
        { id: 'wp-f3', question: 'Speed of all EM waves in vacuum?', answer: '3 × 10⁸ m/s (c)' },
        { id: 'wp-f4', question: 'Which EM wave has highest frequency?', answer: 'Gamma radiation' },
        { id: 'wp-f5', question: 'What is the Doppler effect?', answer: 'Change in observed frequency due to relative motion between source and observer' },
        { id: 'wp-f6', question: 'Period (T) and frequency (f) are related by?', answer: 'T = 1/f' },
        { id: 'wp-f7', question: 'Name the EM wave used in DSTV satellite dishes.', answer: 'Microwaves' },
        { id: 'wp-f8', question: 'Longitudinal waves require a?', answer: 'Medium (cannot travel through vacuum)' }
      ],
      checkpointAssessment: [
        {
          id: 'wp-q1',
          type: 'mcq' as const,
          prompt: 'A wave has f = 200 Hz and λ = 1.5 m. What is its speed?',
          options: [
            { id: 'a', text: '133 m/s' },
            { id: 'b', text: '300 m/s' },
            { id: 'c', text: '201.5 m/s' },
            { id: 'd', text: '0.0075 m/s' }
          ],
          correctAnswer: 'b',
          explanation: 'v = fλ = 200 × 1.5 = 300 m/s'
        },
        {
          id: 'wp-q2',
          type: 'one-word' as const,
          prompt: 'Waves that can travel through a vacuum are called?',
          correctAnswer: 'Electromagnetic',
          explanation: 'EM waves consist of oscillating electric and magnetic fields and require no medium.'
        },
        {
          id: 'wp-q3',
          type: 'mcq' as const,
          prompt: 'Which EM radiation is used in hospital X-ray machines?',
          options: [
            { id: 'a', text: 'Ultraviolet' },
            { id: 'b', text: 'Infrared' },
            { id: 'c', text: 'X-rays' },
            { id: 'd', text: 'Gamma rays' }
          ],
          correctAnswer: 'c',
          explanation: 'X-rays have enough energy to penetrate soft tissue but are absorbed by dense bone, creating shadow images.'
        },
        {
          id: 'wp-q4',
          type: 'matching' as const,
          prompt: 'Match wave type to example:',
          pairs: [
            { left: 'Transverse', right: 'Light' },
            { left: 'Longitudinal', right: 'Sound' },
            { left: 'EM wave', right: 'Travels in vacuum' }
]
},
{
id: 'wp-q5',
type: 'one-word' as const,
prompt: 'The Doppler shift of light from distant galaxies moving away is called?',
correctAnswer: 'Redshift',
hint: 'Red...'
}
]
},
{
id: 'doppler-effect',
title: 'The Doppler Effect',
lesson: {
sections: [
{
title: 'What is the Doppler Effect?',
content: 'The Doppler Effect is the change in observed frequency (or wavelength) of a wave when the source and observer are moving relative to each other. When a source moves toward you, wavefronts are compressed — frequency increases and wavelength decreases. When it moves away, wavefronts are stretched — frequency decreases and wavelength increases.',
},
{
title: 'Sound: Pitch Change',
content: 'A police siren sounds higher-pitched as it approaches (compressed waves, higher f) and lower-pitched as it moves away (stretched waves, lower f). The actual frequency emitted by the siren never changes — only the observed frequency does.',
interactive: {
type: 'reveal' as const,
label: 'Why does a racing car whine change?',
hiddenContent: 'As a Formula 1 car approaches, the engine note rises in pitch. As it passes and moves away, the pitch drops suddenly. This is the Doppler Effect in action — the wavefronts bunch up ahead of the car and spread out behind it.'
}
},
{
title: 'Light: Redshift and Blueshift',
content: 'The Doppler Effect applies to light too. Light from galaxies moving away from us is shifted toward longer wavelengths (redshift). Light from galaxies approaching us shifts toward shorter wavelengths (blueshift). Edwin Hubble used redshift to prove the universe is expanding.',
}
]
},
flashcards: [
{ id: 'de-f1', question: 'What happens to observed frequency when a source approaches?', answer: 'It increases (higher pitch/blueshift)' },
{ id: 'de-f2', question: 'What happens to wavelength when a source moves away?', answer: 'It increases (stretched/redshift)' },
{ id: 'de-f3', question: 'Does the actual emitted frequency change?', answer: 'No — only the observed frequency changes' },
{ id: 'de-f4', question: 'Redshift means a galaxy is...', answer: 'Moving away from us' },
{ id: 'de-f5', question: 'Who used redshift to prove the universe is expanding?', answer: 'Edwin Hubble' }
],
checkpointAssessment: [
{ id: 'de-q1', type: 'mcq' as const, prompt: 'An ambulance siren sounds higher as it approaches because:', options: [{ id: 'a', text: 'The driver turns up the volume' }, { id: 'b', text: 'Wavefronts are compressed (higher frequency)' }, { id: 'c', text: 'Sound travels faster' }, { id: 'd', text: 'Air pressure increases' }], correctAnswer: 'b', explanation: 'Compressed wavefronts = shorter wavelength = higher frequency = higher pitch.' },
{ id: 'de-q2', type: 'one-word' as const, prompt: 'Light from receding galaxies is shifted toward the red end. This is called?', correctAnswer: 'Redshift' },
{ id: 'de-q3', type: 'mcq' as const, prompt: 'The Doppler Effect applies to:', options: [{ id: 'a', text: 'Only sound waves' }, { id: 'b', text: 'Only light waves' }, { id: 'c', text: 'All types of waves' }, { id: 'd', text: 'Only water waves' }], correctAnswer: 'c', explanation: 'The Doppler Effect is universal — it applies to sound, light, water waves, and all wave phenomena.' },
{ id: 'de-q4', type: 'matching' as const, prompt: 'Match movement to effect:', pairs: [{ left: 'Source approaching', right: 'Higher frequency' }, { left: 'Source receding', right: 'Lower frequency' }, { left: 'Galaxy moving away', right: 'Redshift' }] },
{ id: 'de-q5', type: 'one-word' as const, prompt: 'When a source moves toward you, wavefronts are...?', correctAnswer: 'Compressed', hint: 'Squeezed together' }
]
},
{
id: 'double-slit',
title: 'Interference & Double Slit',
lesson: {
sections: [
{
title: 'Superposition of Waves',
content: 'When two waves meet, they combine. If their crests align (in phase), they produce a bigger wave — constructive interference. If a crest meets a trough (antiphase), they cancel out — destructive interference. This is the principle of superposition.',
},
{
title: "Young's Double Slit Experiment",
content: "Thomas Young passed monochromatic light through two narrow slits. On a screen behind, he observed alternating bright and dark bands (fringes). Bright fringes = constructive interference (path difference = nλ). Dark fringes = destructive interference (path difference = (n+½)λ). This proved light behaves as a wave.",
interactive: {
type: 'expand' as const,
label: 'What is path difference?',
hiddenContent: 'Path difference is the extra distance one wave travels compared to the other. If this difference equals a whole number of wavelengths (0, λ, 2λ...), crests meet crests → bright fringe. If it equals a half-wavelength (½λ, 1½λ...), crests meet troughs → dark fringe.'
}
},
{
title: 'Fringe Spacing',
content: 'The fringe spacing w = λD/s, where λ = wavelength, D = distance to screen, s = slit separation. Longer wavelength → wider fringes. Smaller slit separation → wider fringes. This is why red light (longer λ) produces wider fringes than blue light.',
}
]
},
flashcards: [
{ id: 'ds-f1', question: 'What is constructive interference?', answer: 'When crests align (in phase), producing a bigger amplitude' },
{ id: 'ds-f2', question: 'What is destructive interference?', answer: 'When a crest meets a trough (antiphase), cancelling out' },
{ id: 'ds-f3', question: 'Path difference for a bright fringe?', answer: 'nλ (whole number of wavelengths)' },
{ id: 'ds-f4', question: 'Formula for fringe spacing?', answer: 'w = λD/s' },
{ id: 'ds-f5', question: 'Who proved light is a wave using double slits?', answer: 'Thomas Young' }
],
checkpointAssessment: [
{ id: 'ds-q1', type: 'mcq' as const, prompt: 'For constructive interference, the path difference must be:', options: [{ id: 'a', text: 'nλ (whole wavelengths)' }, { id: 'b', text: '(n+½)λ' }, { id: 'c', text: 'Zero only' }, { id: 'd', text: 'Random' }], correctAnswer: 'a' },
{ id: 'ds-q2', type: 'one-word' as const, prompt: 'Dark fringes are caused by ... interference.', correctAnswer: 'Destructive' },
{ id: 'ds-q3', type: 'mcq' as const, prompt: 'Increasing wavelength makes fringes:', options: [{ id: 'a', text: 'Narrower' }, { id: 'b', text: 'Wider' }, { id: 'c', text: 'Disappear' }, { id: 'd', text: 'No change' }], correctAnswer: 'b', explanation: 'w = λD/s. Larger λ → larger w.' },
{ id: 'ds-q4', type: 'matching' as const, prompt: 'Match condition to result:', pairs: [{ left: 'Crest + Crest', right: 'Constructive (bright)' }, { left: 'Crest + Trough', right: 'Destructive (dark)' }, { left: 'nλ path difference', right: 'Bright fringe' }] },
{ id: 'ds-q5', type: 'one-word' as const, prompt: 'The double-slit experiment proved light is a...?', correctAnswer: 'Wave' }
]
},
{
id: 'optics-refraction',
title: 'Optics & Refraction',
lesson: {
sections: [
{
title: "Snell's Law",
content: "When light passes from one medium to another (e.g., air to glass), it changes speed and bends. This is refraction. Snell's Law: n₁ sin θ₁ = n₂ sin θ₂, where n is the refractive index and θ is the angle to the normal. A higher refractive index means light travels slower in that medium.",
interactive: {
type: 'reveal' as const,
label: 'What is the refractive index of diamond?',
hiddenContent: 'Diamond has n = 2.42 — one of the highest of any natural material. This is why diamonds sparkle so brilliantly: light bends dramatically and undergoes total internal reflection inside the gem, creating flashes of colour.'
}
},
{
title: 'Total Internal Reflection',
content: 'When light travels from a denser medium to a less dense one (e.g., glass to air), there is a critical angle beyond which all light is reflected back inside. This is total internal reflection. The critical angle: sin θc = n₂/n₁. For glass (n=1.5) to air: θc ≈ 42°.',
},
{
title: 'Lenses',
content: 'A convex (converging) lens focuses parallel light rays to a focal point. A concave (diverging) lens spreads parallel rays apart. The focal length depends on the curvature and refractive index of the lens. Convex lenses are used in magnifying glasses, cameras, and the human eye.',
interactive: {
type: 'expand' as const,
label: 'Real vs Virtual Images',
hiddenContent: 'A real image is formed where light rays actually converge — it can be projected on a screen. A virtual image is where rays appear to diverge from — it cannot be projected. Magnifying glasses produce virtual images; camera lenses produce real images.'
}
}
]
},
flashcards: [
{ id: 'or-f1', question: "State Snell's Law", answer: 'n₁ sin θ₁ = n₂ sin θ₂' },
{ id: 'or-f2', question: 'What is the critical angle?', answer: 'The angle of incidence above which total internal reflection occurs' },
{ id: 'or-f3', question: 'Refractive index of water?', answer: '1.33' },
{ id: 'or-f4', question: 'A convex lens is also called a...?', answer: 'Converging lens' },
{ id: 'or-f5', question: 'Formula for critical angle?', answer: 'sin θc = n₂/n₁ (less dense / more dense)' }
],
checkpointAssessment: [
{ id: 'or-q1', type: 'mcq' as const, prompt: 'Light bends toward the normal when entering a:', options: [{ id: 'a', text: 'Less dense medium' }, { id: 'b', text: 'More dense medium' }, { id: 'c', text: 'Vacuum' }, { id: 'd', text: 'It never bends' }], correctAnswer: 'b', explanation: 'Light slows down in denser media and bends toward the normal.' },
{ id: 'or-q2', type: 'one-word' as const, prompt: 'When all light reflects back inside a denser medium, it is called total internal...?', correctAnswer: 'Reflection' },
{ id: 'or-q3', type: 'mcq' as const, prompt: 'A magnifying glass uses a:', options: [{ id: 'a', text: 'Concave lens' }, { id: 'b', text: 'Convex lens' }, { id: 'c', text: 'Flat mirror' }, { id: 'd', text: 'Prism' }], correctAnswer: 'b' },
{ id: 'or-q4', type: 'matching' as const, prompt: 'Match material to refractive index:', pairs: [{ left: 'Air', right: '1.00' }, { left: 'Water', right: '1.33' }, { left: 'Glass', right: '1.50' }] },
{ id: 'or-q5', type: 'one-word' as const, prompt: 'A concave lens is also called a ... lens.', correctAnswer: 'Diverging' }
]
}
        ,
      {
        id: 'quantum-physics-sub',
      title: 'Quantum Physics: Photons and Wave-Particle Duality',
      lesson: { sections: [{ title: 'Quantized Energy', content: "Energy is exchanged in discrete packets called quanta. A photon carries energy E = hf, where h is Planck constant and f is frequency. Higher frequency light carries more energy per photon." }, { title: 'The Photoelectric Effect', content: "Light below a threshold frequency cannot eject electrons regardless of intensity. Above threshold, increasing intensity ejects more electrons. This proves light behaves as particles (photons), not just waves." }, { title: 'Wave-Particle Duality', content: "Electrons show diffraction patterns (wave behavior) and photons show particle behavior. De Broglie wavelength λ = h/mv links particle momentum to wavelength. This duality is fundamental to quantum mechanics." }] },
      flashcards: [{ id: 'qp-f1', question: 'Photon energy equation?', answer: 'E = hf' }, { id: 'qp-f2', question: 'What is the threshold frequency?', answer: 'Minimum frequency to eject electrons' }, { id: 'qp-f3', question: 'De Broglie wavelength formula?', answer: 'λ = h/mv' }, { id: 'qp-f4', question: 'What experiment shows electron wave behavior?', answer: 'Electron diffraction' }, { id: 'qp-f5', question: 'Increasing intensity above threshold does what?', answer: 'Ejects more electrons (not faster ones)' }],
      checkpointAssessment: [{ id: 'qp-q1', type: 'mcq' as const, prompt: 'Increasing light intensity below threshold frequency will:', options: [{ id: 'a', text: 'Eject more electrons' }, { id: 'b', text: 'Eject faster electrons' }, { id: 'c', text: 'Cause no photoemission' }, { id: 'd', text: 'Increase wavelength' }], correctAnswer: 'c' }, { id: 'qp-q2', type: 'one-word' as const, prompt: 'Higher frequency photons carry more?', correctAnswer: 'Energy' }]
    }
        ],
        finalAssessment: [
    {
      id: 'wo-final-1',
      type: 'mcq' as const,
      prompt: 'Citi FM broadcasts at 97.3 MHz. Using c = 3 × 10⁸ m/s, its wavelength is approximately:',
      options: [
        { id: 'a', text: '3.08 m' },
        { id: 'b', text: '0.308 m' },
        { id: 'c', text: '30.8 m' },
        { id: 'd', text: '308 m' }
      ],
      correctAnswer: 'a',
      explanation: 'λ = v/f = (3 × 10⁸)/(97.3 × 10⁶) ≈ 3.08 m'
    },
    {
      id: 'wo-final-2',
      type: 'one-word' as const,
      prompt: 'A sound wave with frequency 500 Hz has period T = ?',
      correctAnswer: '0.002 s',
      explanation: 'T = 1/f = 1/500 = 0.002 s (2 milliseconds)'
    },
    {
      id: 'wo-final-3',
      type: 'matching' as const,
      prompt: 'Match Ghana application to EM wave type:',
      pairs: [
        { left: 'GBC/Citi FM broadcast', right: 'Radio waves' },
        { left: 'DSTV satellite', right: 'Microwaves' },
        { left: 'Korle Bu diagnostics', right: 'X-rays' }
      ]
    }
  ]
};
