import type { Topic } from '../types';

export const ELECTROMAGNETISM_TOPIC: Topic = {
  id: 'electromagnetism',
  title: 'Electromagnetism',
  subtopics: [
    {
      id: 'faraday-induction',
      title: "Faraday's Law of Electromagnetic Induction",
      lesson: { sections: [
        { title: 'Inducing a Voltage', content: "Moving a magnet into a coil of wire induces an EMF (voltage) across the coil. The faster the magnet moves, the greater the induced EMF. Faraday's Law states: induced EMF = -N × (change in magnetic flux linkage) / (change in time). Key factors: speed of movement, number of turns N, and magnet strength. A stationary magnet near a coil produces NO induced EMF — only a CHANGE in flux induces voltage.", interactive: { type: 'reveal' as const, label: 'What happens if you move the coil instead of the magnet?', hiddenContent: 'The same EMF is induced! It does not matter whether the magnet moves or the coil moves — only the relative motion (and thus the change in flux) matters.' } },
        { title: "Lenz's Law", content: "The induced current always flows in a direction that opposes the change producing it. This is a consequence of conservation of energy — if the current helped the change, you would get free energy, which is impossible. If you push a magnet N-pole into a coil, the coil creates its own N-pole at that end to repel the incoming magnet.", interactive: { type: 'expand' as const, label: 'What happens if you drop a magnet through a copper tube?', hiddenContent: 'The magnet falls slowly! As it passes each section of the tube, the changing flux induces a current that creates an opposing magnetic field. The opposing force acts like a brake. This is used in eddy-current braking on trains and rollercoasters.' } },
        { title: 'WAEC Practical: Generating Electricity', content: "The Akosombo Hydroelectric Dam generates Ghana's electricity using Faraday's principle. Water from the Volta River spins turbines, which rotate coils inside powerful magnetic fields. More turns + stronger field + faster spin = greater EMF. In the WAEC practical, you may be asked to investigate how the number of turns on a coil affects the induced EMF by dropping a magnet through coils of different turn counts and measuring the peak voltage on an oscilloscope." }
      ] },
      flashcards: [
        { id: 'fi-f1', question: 'What law states that induced EMF equals the rate of change of flux linkage?', answer: "Faraday's Law" },
        { id: 'fi-f2', question: "Lenz's Law says the induced current opposes the...", answer: 'Change that produced it' },
        { id: 'fi-f3', question: 'What three factors increase induced EMF?', answer: 'More turns, stronger magnet, faster movement' },
        { id: 'fi-f4', question: 'Does a stationary magnet near a coil induce an EMF?', answer: 'No — only a change in flux induces EMF' },
        { id: 'fi-f5', question: 'Which Ghana dam uses Faraday induction to generate electricity?', answer: 'Akosombo Dam' },
        { id: 'fi-f6', question: 'Magnetic flux linkage = N × Φ. What does N stand for?', answer: 'Number of turns on the coil' }
      ],
      checkpointAssessment: [
        { id: 'fi-q1', type: 'mcq' as const, prompt: 'Which of these will NOT induce an EMF in a coil?', options: [{ id: 'a', text: 'Moving a magnet into the coil' }, { id: 'b', text: 'Holding a magnet stationary inside the coil' }, { id: 'c', text: 'Moving the coil towards a magnet' }, { id: 'd', text: 'Rotating a coil in a magnetic field' }], correctAnswer: 'b', explanation: 'Only a CHANGE in flux linkage induces an EMF. A stationary magnet means constant flux.' },
        { id: 'fi-q2', type: 'one-word' as const, prompt: "The direction of induced current always opposes the change. Whose law is this?", correctAnswer: "Lenz's" },
        { id: 'fi-q3', type: 'mcq' as const, prompt: 'Doubling the number of turns on a coil and doubling the speed of the magnet will:', options: [{ id: 'a', text: 'Double the EMF' }, { id: 'b', text: 'Quadruple the EMF' }, { id: 'c', text: 'Have no effect' }, { id: 'd', text: 'Halve the EMF' }], correctAnswer: 'b', explanation: 'EMF is proportional to N times rate of change of flux. Doubling both factors gives 2 x 2 = 4 times the EMF.' },
        { id: 'fi-q4', type: 'matching' as const, prompt: 'Match each factor to its effect on induced EMF:', pairs: [{ left: 'More turns', right: 'Increases EMF' }, { left: 'Stronger magnet', right: 'Increases EMF' }, { left: 'Slower movement', right: 'Decreases EMF' }] },
        { id: 'fi-q5', type: 'one-word' as const, prompt: 'The unit of magnetic flux is the?', correctAnswer: 'Weber', hint: 'Wb' }
      ]
    },
    {
      id: 'motor-effect',
      title: 'The Motor Effect and Forces on Wires',
      lesson: { sections: [
        { title: 'Force on a Current-Carrying Wire', content: "A wire carrying current in a magnetic field experiences a force. This is the motor effect. Fleming's Left-Hand Rule: thuMb = Force direction, First finger = magnetic Field direction (N to S), seCond finger = Current direction. The force is greatest when the wire is perpendicular to the field, and zero when the wire is parallel. Formula: F = BIL sin theta, where B = magnetic field strength (Tesla), I = current (Amps), L = length of wire in the field (metres)." },
        { title: 'The Electric Motor', content: "A coil in a magnetic field rotates because the forces on opposite sides of the coil act in opposite directions (one up, one down). This creates a turning effect (torque). The split-ring commutator reverses the current direction every half-turn, ensuring the coil keeps rotating in the same direction. Without the commutator, the coil would oscillate back and forth.", interactive: { type: 'expand' as const, label: 'How does the commutator work?', hiddenContent: 'The commutator is a split metal ring attached to the coil. As the coil rotates past the vertical position, the brushes contact the opposite half of the ring, reversing the current in the coil. This reversal ensures the force on each side of the coil always pushes in the same rotational direction.' } },
        { title: 'Applications in Ghana', content: "Electric fans, blenders, and car starter motors all use the motor effect. The Volta Aluminium Company (VALCO) in Tema uses enormous electric motors for smelting. WAEC often asks: explain why the coil rotates and state the role of the commutator. A strong answer mentions forces on opposite sides, the turning effect, and current reversal." }
      ] },
      flashcards: [
        { id: 'me-f1', question: "Fleming's Left-Hand Rule: what does the thumb represent?", answer: 'Force (or Motion)' },
        { id: 'me-f2', question: 'Formula for force on a wire in a magnetic field?', answer: 'F = BIL sin theta' },
        { id: 'me-f3', question: 'When is the force on a wire in a field zero?', answer: 'When the wire is parallel to the field (theta = 0)' },
        { id: 'me-f4', question: 'What does the split-ring commutator do?', answer: 'Reverses current every half-turn to maintain rotation' },
        { id: 'me-f5', question: 'What is the unit of magnetic field strength B?', answer: 'Tesla (T)' }
      ],
      checkpointAssessment: [
        { id: 'me-q1', type: 'mcq' as const, prompt: "In Fleming's Left-Hand Rule, the second finger represents:", options: [{ id: 'a', text: 'Force' }, { id: 'b', text: 'Magnetic Field' }, { id: 'c', text: 'Current' }, { id: 'd', text: 'Voltage' }], correctAnswer: 'c', explanation: "Thumb = Force (Motion), First finger = Field, seCond finger = Current." },
        { id: 'me-q2', type: 'one-word' as const, prompt: 'A wire of length 0.5 m carries 3 A in a 0.4 T field at 90 degrees. Force = ? (in N)', correctAnswer: '0.6', explanation: 'F = BIL = 0.4 x 3 x 0.5 = 0.6 N' },
        { id: 'me-q3', type: 'mcq' as const, prompt: 'Without a commutator, a DC motor coil would:', options: [{ id: 'a', text: 'Rotate continuously in one direction' }, { id: 'b', text: 'Oscillate back and forth' }, { id: 'c', text: 'Not move at all' }, { id: 'd', text: 'Speed up' }], correctAnswer: 'b', explanation: 'Without current reversal, the coil would reverse direction each half-turn, oscillating rather than spinning.' },
        { id: 'me-q4', type: 'matching' as const, prompt: 'Match component to function:', pairs: [{ left: 'Commutator', right: 'Reverses current direction' }, { left: 'Carbon brushes', right: 'Conduct current to commutator' }, { left: 'Permanent magnets', right: 'Provide the magnetic field' }] }
      ]
    },
    {
      id: 'transformers',
      title: 'Transformers and the National Grid',
      lesson: { sections: [
        { title: 'How Transformers Work', content: "A transformer changes the voltage of an alternating current. The primary coil creates an alternating magnetic field in the iron core, which induces an alternating voltage in the secondary coil. Turns ratio: Vs/Vp = Ns/Np. Step-up transformer: more turns on secondary (voltage increases, current decreases). Step-down transformer: fewer turns on secondary (voltage decreases, current increases). Transformers only work with AC because they need a changing magnetic field.", interactive: { type: 'reveal' as const, label: 'Why do transformers need AC?', hiddenContent: "A transformer requires a changing magnetic field to induce an EMF in the secondary coil (Faraday's Law). DC produces a constant magnetic field, so no EMF is induced after the initial switch-on moment. This is why the national grid uses AC." } },
        { title: 'The National Grid', content: "Electricity from Akosombo and Bui dams travels at very high voltage (161 kV or 330 kV) to reduce energy loss in transmission cables. Power loss = I-squared-R, so reducing current by stepping up voltage drastically reduces waste heat. A step-up transformer at the power station raises voltage; step-down transformers near towns lower it for safe domestic use at 240 V.", interactive: { type: 'expand' as const, label: 'Why does high voltage save energy?', hiddenContent: 'P = I-squared-R. If you double the voltage, you halve the current (P = VI stays the same). But power loss = I-squared-R, so halving the current quarters the loss. This is why the grid uses 161,000 V instead of 240 V — the current is about 670 times smaller, making transmission losses about 450,000 times smaller!' } },
        { title: 'Efficiency and Real Transformers', content: 'Real transformers are 95-99% efficient but not perfect. Energy losses come from: eddy currents in the iron core (reduced by laminating the core into thin insulated sheets), resistance heating in the copper coils (I-squared-R losses), and magnetic hysteresis (the core resists changes in magnetisation). Transformer equation for 100% efficiency: Vp x Ip = Vs x Is.' }
      ] },
      flashcards: [
        { id: 'tr-f1', question: 'Transformer turns ratio formula?', answer: 'Vs/Vp = Ns/Np' },
        { id: 'tr-f2', question: 'A step-up transformer has more turns on which coil?', answer: 'The secondary coil' },
        { id: 'tr-f3', question: 'Why do transformers only work with AC?', answer: 'They need a changing magnetic field to induce EMF' },
        { id: 'tr-f4', question: 'Power loss in transmission cables equals?', answer: 'I-squared-R' },
        { id: 'tr-f5', question: 'What reduces eddy current losses in a transformer core?', answer: 'Laminating the core into thin insulated sheets' }
      ],
      checkpointAssessment: [
        { id: 'tr-q1', type: 'mcq' as const, prompt: 'A transformer has 100 turns on the primary and 500 on the secondary. If Vp = 240 V, what is Vs?', options: [{ id: 'a', text: '48 V' }, { id: 'b', text: '1200 V' }, { id: 'c', text: '2400 V' }, { id: 'd', text: '60 V' }], correctAnswer: 'b', explanation: 'Vs/Vp = Ns/Np, so Vs = 240 x 500/100 = 1200 V.' },
        { id: 'tr-q2', type: 'one-word' as const, prompt: 'The Ghana national grid transmits at high voltage to reduce what type of loss?', correctAnswer: 'Heat', hint: 'I-squared-R losses cause...' },
        { id: 'tr-q3', type: 'mcq' as const, prompt: 'Which statement about a step-down transformer is correct?', options: [{ id: 'a', text: 'Ns > Np and Vs > Vp' }, { id: 'b', text: 'Ns < Np and Vs < Vp' }, { id: 'c', text: 'Ns = Np' }, { id: 'd', text: 'It increases current' }], correctAnswer: 'b', explanation: 'Fewer turns on secondary (Ns < Np) means lower secondary voltage (Vs < Vp). This is a step-down transformer.' },
        { id: 'tr-q4', type: 'matching' as const, prompt: 'Match loss type to solution:', pairs: [{ left: 'Eddy currents', right: 'Laminated core' }, { left: 'Coil resistance', right: 'Thicker copper wire' }, { left: 'Hysteresis', right: 'Soft iron core' }] }
      ]
    }
  ],
  finalAssessment: [
    { id: 'em-final-1', type: 'mcq' as const, prompt: 'Which device uses electromagnetic induction to generate electricity?', options: [{ id: 'a', text: 'Electric motor' }, { id: 'b', text: 'Transformer' }, { id: 'c', text: 'Generator (alternator)' }, { id: 'd', text: 'Battery' }], correctAnswer: 'c', explanation: 'A generator rotates a coil in a magnetic field, inducing an EMF by Faraday\'s Law.' },
    { id: 'em-final-2', type: 'one-word' as const, prompt: 'In a step-up transformer, the voltage on the secondary is ... than the primary?', correctAnswer: 'Higher' },
    { id: 'em-final-3', type: 'matching' as const, prompt: 'Match law to principle:', pairs: [{ left: "Faraday's Law", right: 'Induced EMF = rate of change of flux' }, { left: "Lenz's Law", right: 'Induced current opposes the change' }, { left: 'Motor effect', right: 'Force on current in a field' }] }
  ]
};
