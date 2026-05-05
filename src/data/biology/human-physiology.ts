import type { Topic } from '../types';

export const HUMAN_PHYSIOLOGY_TOPIC: Topic = {
  id: 'human-physiology',
  title: 'Human Physiology',
  subtopics: [
    {
      id: 'neurotransmission',
      title: 'The Synaptic Spark: Neurotransmission',
      lesson: {
        sections: [
          {
            title: 'The Action Potential',
            content: 'Neurons transmit signals electrically along their axons. When a neuron fires, voltage-gated sodium channels open, allowing Na+ ions to rush in and depolarize the membrane. This electrical signal travels down the axon to the terminal.',
          },
          {
            title: 'The Synapse',
            content: 'The synapse is the small gap between two neurons. When the action potential reaches the axon terminal, it causes voltage-gated calcium channels to open. Calcium ions rush in, causing vesicles filled with neurotransmitters to fuse with the membrane.',
          },
          {
            title: 'Neurotransmitter Release',
            content: 'Neurotransmitters cross the synaptic cleft and bind to receptors on the post-synaptic neuron. If enough receptors are activated, a new action potential is triggered in the next neuron.',
          }
        ]
      },
      flashcards: [
        { id: 'ntf1', question: 'What ion causes depolarization?', answer: 'Sodium (Na+)' },
        { id: 'ntf2', question: 'What ion triggers vesicle fusion at the terminal?', answer: 'Calcium (Ca2+)' },
        { id: 'ntf3', question: 'What is the gap between neurons called?', answer: 'Synaptic Cleft' }
      ],
      checkpointAssessment: [
        {
          id: 'ntq1',
          type: 'mcq',
          prompt: 'Which ion rushes into the cell during an action potential?',
          options: [
            { id: 'a', text: 'Potassium (K+)' },
            { id: 'b', text: 'Sodium (Na+)' },
            { id: 'c', text: 'Calcium (Ca2+)' },
            { id: 'd', text: 'Chloride (Cl-)' }
          ],
          correctAnswer: 'b'
        }
      ]
    },
    {
      id: 'cardiac-cycle',
      title: 'The Cardiac Cycle',
      lesson: {
        sections: [
          {
            title: 'Systole and Diastole',
            content: 'The heart works as a double pump. Systole is the contraction phase — ventricles pump blood out of the heart. Diastole is the relaxation phase — ventricles fill with blood from the atria. The cardiac cycle repeats about 70 times per minute at rest, meaning one full cycle takes roughly 0.8 seconds. During each cycle, atria contract first (atrial systole), then ventricles contract (ventricular systole), and finally the whole heart relaxes (cardiac diastole).',
            interactive: {
              type: 'reveal',
              label: 'What causes the "lub-dub" heart sounds?',
              hiddenContent: 'The "lub" sound is caused by the AV valves (tricuspid and bicuspid) snapping shut as the ventricles contract. The "dub" sound is caused by the semilunar valves closing as the ventricles relax. A stethoscope lets doctors hear these sounds — a murmur may indicate a valve that does not close properly.',
            },
          },
          {
            title: 'The Double Circulation',
            content: 'Humans have a double circulatory system. The right side of the heart pumps deoxygenated blood to the lungs via the pulmonary circuit — here, blood picks up O2 and drops off CO2. The left side of the heart pumps oxygenated blood to the whole body via the systemic circuit — here, blood delivers O2 and picks up CO2. The left ventricle has a much thicker muscular wall than the right ventricle because it must pump blood at much higher pressure to reach all body tissues, whereas the right ventricle only needs enough pressure to reach the nearby lungs.',
          },
          {
            title: 'Blood Flow Through the Heart',
            content: 'Deoxygenated blood enters the right atrium via the vena cava, flows through the tricuspid valve into the right ventricle, and is pumped out through the semilunar valve into the pulmonary artery towards the lungs. In the lungs, blood gains oxygen and loses CO2. Oxygenated blood returns via the pulmonary vein into the left atrium, passes through the bicuspid (mitral) valve into the left ventricle, and is pumped out through the aortic semilunar valve into the aorta to supply the body. Valves prevent backflow, ensuring blood moves in one direction only. The septum separates oxygenated and deoxygenated blood on either side of the heart.',
          },
          {
            title: 'WAEC Focus: The Cardiac Cycle',
            content: 'WAEC commonly asks students to label a diagram of the heart and trace the path of blood through it. You must know: bicuspid valve (left AV valve), tricuspid valve (right AV valve), semilunar valves (in the aorta and pulmonary artery), and the septum (divides left and right sides). A common WAEC question: "Trace the path of blood from the vena cava to the aorta." Korle Bu Teaching Hospital in Accra performs open-heart surgery — understanding cardiac anatomy is not just exam knowledge, it saves lives. Many cardiac patients in Ghana are treated by specialists who studied this exact content.',
          },
        ]
      },
      flashcards: [
        { id: 'ccf1', question: 'What is systole?', answer: 'The contraction phase of the heart — ventricles pump blood out' },
        { id: 'ccf2', question: 'What is diastole?', answer: 'The relaxation phase of the heart — ventricles fill with blood' },
        { id: 'ccf3', question: 'Why does the left ventricle have a thicker wall than the right?', answer: 'It must pump blood at much higher pressure to reach the whole body (systemic circuit)' },
        { id: 'ccf4', question: 'What causes the "lub" heart sound?', answer: 'AV valves (tricuspid and bicuspid) closing during ventricular systole' },
        { id: 'ccf5', question: 'Which blood vessel carries deoxygenated blood from the heart to the lungs?', answer: 'Pulmonary artery' },
        { id: 'ccf6', question: 'What is the function of the septum?', answer: 'It separates oxygenated and deoxygenated blood in the heart' },
      ],
      checkpointAssessment: [
        {
          id: 'ccq1',
          type: 'mcq',
          prompt: 'Which valve prevents backflow of blood from the left ventricle to the left atrium?',
          options: [
            { id: 'a', text: 'Tricuspid valve' },
            { id: 'b', text: 'Bicuspid (mitral) valve' },
            { id: 'c', text: 'Semilunar valve' },
            { id: 'd', text: 'Aortic valve' },
          ],
          correctAnswer: 'b',
        },
        {
          id: 'ccq2',
          type: 'mcq',
          prompt: 'Which blood vessel carries oxygenated blood from the lungs to the heart?',
          options: [
            { id: 'a', text: 'Pulmonary artery' },
            { id: 'b', text: 'Vena cava' },
            { id: 'c', text: 'Pulmonary vein' },
            { id: 'd', text: 'Aorta' },
          ],
          correctAnswer: 'c',
        },
        {
          id: 'ccq3',
          type: 'one-word',
          prompt: 'The phase of the cardiac cycle where the ventricles relax and fill with blood is called...?',
          correctAnswer: 'Diastole',
        },
        {
          id: 'ccq4',
          type: 'one-word',
          prompt: 'The wall separating the left and right sides of the heart is called the...?',
          correctAnswer: 'Septum',
        },
        {
          id: 'ccq5',
          type: 'matching',
          prompt: 'Match each heart valve to its location.',
          pairs: [
            { left: 'Tricuspid valve', right: 'Between right atrium and right ventricle' },
            { left: 'Bicuspid valve', right: 'Between left atrium and left ventricle' },
            { left: 'Semilunar valves', right: 'At the base of the aorta and pulmonary artery' },
          ],
        },
      ],
    },
    {
      id: 'gas-exchange',
      title: 'Gas Exchange in the Alveoli',
      lesson: {
        sections: [
          {
            title: 'The Diffusion Gradient',
            content: 'Gas exchange occurs in the alveoli — tiny air sacs at the end of the bronchioles. Oxygen diffuses from the alveolar air (high partial pressure of O2) into the blood in the surrounding capillaries (low partial pressure of O2). Carbon dioxide diffuses in the opposite direction — from the blood (high partial pressure of CO2) into the alveolar air (low partial pressure of CO2). This movement is driven entirely by concentration (partial pressure) gradients — no energy is required, making it passive transport. Haemoglobin in red blood cells binds O2 to form oxyhaemoglobin, which transports oxygen throughout the body.',
          },
          {
            title: 'Alveolar Adaptations',
            content: 'The alveoli are perfectly adapted for efficient gas exchange. Large surface area: there are millions of alveoli, providing a total surface area roughly the size of a tennis court. Thin walls: each alveolus and its surrounding capillary are only one cell thick, giving an extremely short diffusion distance. Moist lining: the inner surface is coated with a thin film of water, which dissolves gases so they can diffuse across the membrane. Dense capillary network: blood constantly flows through the capillaries, removing O2-rich blood and bringing in CO2-rich blood, maintaining the steep diffusion gradient.',
            interactive: {
              type: 'expand',
              label: 'Why is maintaining the diffusion gradient so important?',
              hiddenContent: 'If blood stayed still in the capillaries, O2 would quickly equalise on both sides and diffusion would stop. The constant flow of blood — and constant ventilation of the alveoli — ensures the gradient is always steep, so diffusion continues rapidly. This is why breathing and blood flow must work together.',
            },
          },
          {
            title: 'WAEC: Smoking and Gas Exchange',
            content: 'Smoking severely damages the alveoli and reduces gas exchange. In emphysema, the walls between alveoli break down, creating fewer but larger air sacs — this drastically reduces the surface area for gas exchange. Carbon monoxide in cigarette smoke binds to haemoglobin about 200 times more strongly than oxygen, forming carboxyhaemoglobin and reducing the blood\'s oxygen-carrying capacity. Tar in smoke paralyses cilia, allowing mucus and bacteria to accumulate, causing infections like bronchitis. The Ghana Health Service reports rising respiratory disease in Accra due to air pollution from vehicle exhaust and cooking smoke. WAEC may ask you to explain how smoking reduces gas exchange efficiency.',
          },
        ]
      },
      flashcards: [
        { id: 'gef1', question: 'What drives oxygen from the alveoli into the blood?', answer: 'The diffusion gradient (higher O2 partial pressure in alveoli, lower in blood)' },
        { id: 'gef2', question: 'What is oxyhaemoglobin?', answer: 'The compound formed when oxygen binds to haemoglobin in red blood cells' },
        { id: 'gef3', question: 'How are alveolar walls adapted for gas exchange?', answer: 'They are only one cell thick, giving a very short diffusion distance' },
        { id: 'gef4', question: 'How does emphysema reduce gas exchange?', answer: 'It breaks down alveolar walls, reducing the total surface area available' },
        { id: 'gef5', question: 'Why does carbon monoxide reduce oxygen transport in blood?', answer: 'It binds to haemoglobin 200x more strongly than oxygen, reducing O2-carrying capacity' },
      ],
      checkpointAssessment: [
        {
          id: 'geq1',
          type: 'mcq',
          prompt: 'Which adaptation of the alveoli provides a short diffusion distance?',
          options: [
            { id: 'a', text: 'Large surface area' },
            { id: 'b', text: 'Thin walls (one cell thick)' },
            { id: 'c', text: 'Moist lining' },
            { id: 'd', text: 'Dense capillary network' },
          ],
          correctAnswer: 'b',
        },
        {
          id: 'geq2',
          type: 'mcq',
          prompt: 'What does carbon monoxide in cigarette smoke do to haemoglobin?',
          options: [
            { id: 'a', text: 'It increases oxygen binding' },
            { id: 'b', text: 'It destroys haemoglobin' },
            { id: 'c', text: 'It binds to haemoglobin 200x more strongly than O2' },
            { id: 'd', text: 'It has no effect on haemoglobin' },
          ],
          correctAnswer: 'c',
        },
        {
          id: 'geq3',
          type: 'one-word',
          prompt: 'The compound formed when oxygen binds to haemoglobin is called...?',
          correctAnswer: 'Oxyhaemoglobin',
        },
        {
          id: 'geq4',
          type: 'matching',
          prompt: 'Match each alveolar adaptation to its function.',
          pairs: [
            { left: 'Large surface area', right: 'Maximum space for diffusion' },
            { left: 'Thin walls', right: 'Short diffusion distance' },
            { left: 'Moist lining', right: 'Dissolves gases for diffusion' },
            { left: 'Dense capillary network', right: 'Maintains steep diffusion gradient' },
          ],
        },
      ],
    },
    {
      id: 'nephron-filter',
      title: 'The Nephron and Kidney Filtration',
      lesson: {
        sections: [
          {
            title: 'Ultrafiltration',
            content: 'Blood enters the glomerulus — a knot of capillaries — under high pressure. This high pressure forces small molecules (water, glucose, urea, ions) through the capillary walls and the basement membrane into the Bowman\'s capsule, forming the filtrate. Large molecules such as proteins and blood cells are too big to pass through the basement membrane and remain in the blood. About 180 litres of filtrate are produced per day, but most of it is reabsorbed — only about 1.5 litres leaves the body as urine.',
          },
          {
            title: 'Selective Reabsorption',
            content: 'In the proximal convoluted tubule, ALL glucose is reabsorbed back into the blood (a healthy person should have zero glucose in urine). A large amount of water and useful ions are also reabsorbed here. The loop of Henle creates a salt gradient in the medulla, which allows water to be reabsorbed by osmosis in the collecting duct. Antidiuretic hormone (ADH), released by the pituitary gland, controls how permeable the collecting duct walls are — more ADH means more water is reabsorbed, producing more concentrated urine.',
            interactive: {
              type: 'reveal',
              label: 'Why is urine more concentrated in the morning?',
              hiddenContent: 'At night, ADH levels rise because you are not drinking water. The high ADH makes the collecting duct walls very permeable to water, so more water is reabsorbed back into the blood and the urine becomes concentrated and dark. During the day, when you drink fluids, ADH levels fall, the collecting duct becomes less permeable, and urine is more dilute.',
            },
          },
          {
            title: 'WAEC: Dialysis and Kidney Failure',
            content: 'If both kidneys fail, toxic urea accumulates in the blood — this is uraemia and is fatal if untreated. A dialysis machine filters blood artificially: blood flows on one side of a partially permeable membrane, and dialysis fluid flows on the other. Small waste molecules (urea, excess ions) diffuse from the blood into the dialysis fluid, while useful molecules (glucose, needed ions) remain because they are at equal concentration on both sides. Korle Bu Teaching Hospital runs Ghana\'s largest dialysis unit, treating hundreds of patients weekly. WAEC may ask: compare filtration in the nephron with filtration in a dialysis machine — both rely on diffusion across a partially permeable membrane.',
          },
        ]
      },
      flashcards: [
        { id: 'nff1', question: 'What is ultrafiltration?', answer: 'The forcing of small molecules through the basement membrane into the Bowman\'s capsule under high pressure' },
        { id: 'nff2', question: 'Which molecules are too large to pass through the basement membrane?', answer: 'Proteins and blood cells' },
        { id: 'nff3', question: 'Where is ALL glucose reabsorbed?', answer: 'In the proximal convoluted tubule' },
        { id: 'nff4', question: 'What hormone controls water reabsorption in the collecting duct?', answer: 'Antidiuretic hormone (ADH)' },
        { id: 'nff5', question: 'How does a dialysis machine remove urea from blood?', answer: 'Urea diffuses across a partially permeable membrane from blood into dialysis fluid' },
      ],
      checkpointAssessment: [
        {
          id: 'nfq1',
          type: 'mcq',
          prompt: 'Which substance should NOT be present in the urine of a healthy person?',
          options: [
            { id: 'a', text: 'Urea' },
            { id: 'b', text: 'Water' },
            { id: 'c', text: 'Glucose' },
            { id: 'd', text: 'Ions (salts)' },
          ],
          correctAnswer: 'c',
        },
        {
          id: 'nfq2',
          type: 'mcq',
          prompt: 'What is the main function of the loop of Henle?',
          options: [
            { id: 'a', text: 'Filter blood under high pressure' },
            { id: 'b', text: 'Create a salt gradient for water reabsorption' },
            { id: 'c', text: 'Reabsorb all glucose' },
            { id: 'd', text: 'Produce ADH' },
          ],
          correctAnswer: 'b',
        },
        {
          id: 'nfq3',
          type: 'one-word',
          prompt: 'The hormone that makes the collecting duct more permeable to water is called...?',
          correctAnswer: 'ADH',
        },
        {
          id: 'nfq4',
          type: 'matching',
          prompt: 'Match each nephron part to its function.',
          pairs: [
            { left: 'Glomerulus', right: 'High-pressure filtration of blood' },
            { left: 'Proximal convoluted tubule', right: 'Reabsorption of all glucose and some water' },
            { left: 'Loop of Henle', right: 'Creates salt gradient for water reabsorption' },
            { left: 'Collecting duct', right: 'ADH-controlled water reabsorption' },
          ],
        },
      ],
    },
    {
      id: 'endocrine-feedback',
      title: 'Endocrine Feedback Loops',
      lesson: {
        sections: [
          {
            title: 'Blood Sugar Regulation',
            content: 'After a meal, blood glucose levels rise. The pancreas detects this and releases the hormone insulin from beta cells. Insulin stimulates body cells to absorb glucose from the blood and converts excess glucose to glycogen in the liver — this lowers blood glucose back to normal. When blood glucose falls (e.g. between meals or during exercise), the pancreas releases glucagon from alpha cells. Glucagon converts glycogen stored in the liver back into glucose, raising blood glucose. This is a classic negative feedback loop: a change in one direction triggers a response that reverses it, keeping blood glucose within a narrow range.',
          },
          {
            title: 'Diabetes',
            content: 'Type 1 diabetes: the pancreas produces no insulin because the body\'s immune system has destroyed the beta cells (autoimmune disease). It usually starts in childhood and requires daily insulin injections. Type 2 diabetes: the pancreas still produces insulin, but body cells become resistant to it — they do not respond properly. It is linked to obesity, inactivity, and poor diet, and usually develops in adults. Ghana has a growing diabetes epidemic — the Ghana Diabetes Association estimates over 3 million cases, with Type 2 rising fastest due to changing diets and urban lifestyles.',
            interactive: {
              type: 'expand',
              label: 'How do WAEC questions differentiate Type 1 from Type 2?',
              hiddenContent: 'WAEC often asks you to compare the two types. Key differences: Type 1 is caused by no insulin production (autoimmune), starts young, and needs insulin injections. Type 2 is caused by insulin resistance, starts later in life, and can be managed with diet, exercise, and medication. A common trick: "Which type is linked to obesity?" — answer: Type 2.',
            },
          },
          {
            title: 'Other Feedback Loops',
            content: 'Thyroid hormones (T3 and T4) are controlled by negative feedback: the pituitary gland releases thyroid-stimulating hormone (TSH), which stimulates the thyroid to produce T3/T4. When T3/T4 levels rise, they inhibit further TSH release. Adrenaline is an important exception — it is controlled by the nervous system (sympathetic nerves), not a feedback loop. Adrenaline is released for fight-or-flight responses, not for homeostasis. WAEC trick question: "Is adrenaline controlled by negative feedback?" — the answer is NO. Adrenaline prepares the body for rapid action; it is not part of a homeostatic mechanism.',
          },
        ]
      },
      flashcards: [
        { id: 'eff1', question: 'What hormone lowers blood glucose?', answer: 'Insulin' },
        { id: 'eff2', question: 'What hormone raises blood glucose by converting glycogen to glucose?', answer: 'Glucagon' },
        { id: 'eff3', question: 'What is the cause of Type 1 diabetes?', answer: 'Autoimmune destruction of beta cells in the pancreas, so no insulin is produced' },
        { id: 'eff4', question: 'Is adrenaline controlled by negative feedback?', answer: 'No — it is controlled by the nervous system for fight-or-flight responses' },
        { id: 'eff5', question: 'What controls thyroid hormone production?', answer: 'Negative feedback — TSH from the pituitary stimulates T3/T4, and high T3/T4 inhibits TSH release' },
      ],
      checkpointAssessment: [
        {
          id: 'efq1',
          type: 'mcq',
          prompt: 'Which hormone converts glycogen to glucose in the liver?',
          options: [
            { id: 'a', text: 'Insulin' },
            { id: 'b', text: 'Glucagon' },
            { id: 'c', text: 'Adrenaline' },
            { id: 'd', text: 'TSH' },
          ],
          correctAnswer: 'b',
        },
        {
          id: 'efq2',
          type: 'mcq',
          prompt: 'Which type of diabetes is caused by insulin resistance and is linked to obesity?',
          options: [
            { id: 'a', text: 'Type 1' },
            { id: 'b', text: 'Type 2' },
            { id: 'c', text: 'Gestational diabetes' },
            { id: 'd', text: 'Type 3' },
          ],
          correctAnswer: 'b',
        },
        {
          id: 'efq3',
          type: 'one-word',
          prompt: 'The type of feedback that reverses a change to maintain homeostasis is called...?',
          correctAnswer: 'Negative feedback',
        },
        {
          id: 'efq4',
          type: 'matching',
          prompt: 'Match each hormone to its function.',
          pairs: [
            { left: 'Insulin', right: 'Lowers blood glucose, converts glucose to glycogen' },
            { left: 'Glucagon', right: 'Raises blood glucose, converts glycogen to glucose' },
            { left: 'Adrenaline', right: 'Fight-or-flight response, not controlled by feedback' },
            { left: 'TSH', right: 'Stimulates thyroid to produce T3 and T4' },
          ],
        },
      ],
    },
    {
      id: 'muscle-contraction',
      title: 'Muscle Contraction and Movement',
      lesson: {
        sections: [
          {
            title: 'Sliding Filament Theory',
            content: 'Muscles contain overlapping actin (thin) and myosin (thick) filaments arranged in units called sarcomeres. When a nerve impulse arrives at a muscle fibre, calcium ions (Ca2+) are released from the sarcoplasmic reticulum. Ca2+ binds to troponin, exposing the binding sites on actin. Myosin heads attach to these sites, perform a power stroke that pulls the actin filaments inward (towards the centre of the sarcomere), then detach using ATP. This sliding of filaments shortens the sarcomere — and when many sarcomeres shorten together, the whole muscle contracts.',
          },
          {
            title: 'ATP and Energy Supply',
            content: 'Muscles need ATP for both contraction (power stroke and detachment of myosin heads) AND relaxation (pumping Ca2+ back into the sarcoplasmic reticulum). During intense short exercise, creatine phosphate provides rapid ATP regeneration without needing oxygen. For prolonged activity, aerobic respiration in mitochondria produces ATP efficiently (36 ATP per glucose molecule). When oxygen supply cannot keep up during intense exercise, anaerobic respiration takes over — but it produces only 2 ATP per glucose and generates lactic acid as a by-product, causing muscle fatigue.',
            interactive: {
              type: 'reveal',
              label: 'What causes muscle cramps during exercise?',
              hiddenContent: 'Muscle cramps are linked to the build-up of lactic acid from anaerobic respiration. Lactic acid lowers the pH in the muscle, interfering with enzyme activity and calcium ion release. This makes muscle fibres less able to contract and relax properly. After exercise, deep breathing supplies extra oxygen to break down the lactic acid — this extra oxygen is the "oxygen debt" that must be repaid.',
            },
          },
          {
            title: 'WAEC: Muscle Types and Functions',
            content: 'There are three types of muscle in the human body. Skeletal muscle: attached to bones, voluntary control, striated (striped appearance under microscope), used for movement. Smooth muscle: found in walls of intestines, blood vessels, and other organs, involuntary control, not striated, used for peristalsis and controlling blood flow. Cardiac muscle: found only in the heart, involuntary control, striated, has branching fibres and intercalated discs for rapid electrical communication between cells. WAEC may ask you to compare the three types in a table — know whether each is voluntary/involuntary, striated/not striated, and where it is found.',
          },
        ]
      },
      flashcards: [
        { id: 'mcf1', question: 'What ion is released to expose binding sites on actin?', answer: 'Calcium (Ca2+)' },
        { id: 'mcf2', question: 'What is the power stroke?', answer: 'When myosin heads pull actin filaments inward, shortening the sarcomere' },
        { id: 'mcf3', question: 'How many ATP per glucose does anaerobic respiration produce?', answer: '2 ATP' },
        { id: 'mcf4', question: 'Which muscle type is voluntary and striated?', answer: 'Skeletal muscle' },
        { id: 'mcf5', question: 'What connects cardiac muscle cells for rapid electrical communication?', answer: 'Intercalated discs' },
      ],
      checkpointAssessment: [
        {
          id: 'mcq1',
          type: 'mcq',
          prompt: 'Which molecule provides the energy for both muscle contraction and relaxation?',
          options: [
            { id: 'a', text: 'Creatine phosphate' },
            { id: 'b', text: 'Lactic acid' },
            { id: 'c', text: 'ATP' },
            { id: 'd', text: 'Glycogen' },
          ],
          correctAnswer: 'c',
        },
        {
          id: 'mcq2',
          type: 'mcq',
          prompt: 'Which muscle type is involuntary, striated, and found only in the heart?',
          options: [
            { id: 'a', text: 'Skeletal muscle' },
            { id: 'b', text: 'Smooth muscle' },
            { id: 'c', text: 'Cardiac muscle' },
            { id: 'd', text: 'Voluntary muscle' },
          ],
          correctAnswer: 'c',
        },
        {
          id: 'mcq3',
          type: 'one-word',
          prompt: 'The by-product of anaerobic respiration in muscles that causes fatigue is called...?',
          correctAnswer: 'Lactic acid',
        },
        {
          id: 'mcq4',
          type: 'matching',
          prompt: 'Match each muscle type to its characteristics.',
          pairs: [
            { left: 'Skeletal muscle', right: 'Voluntary, striated, attached to bones' },
            { left: 'Smooth muscle', right: 'Involuntary, not striated, walls of intestines' },
            { left: 'Cardiac muscle', right: 'Involuntary, striated, heart only' },
          ],
        },
      ],
    },
    {
      id: 'immune-response',
      title: 'The Immune Response System',
      lesson: {
        sections: [
          {
            title: 'Pathogen Defence',
            content: 'The body has three lines of defence against pathogens. First line: physical barriers — the skin acts as a waterproof barrier, mucus traps pathogens in the respiratory tract, and stomach acid destroys microbes in food. Second line: non-specific white blood cells called phagocytes engulf and digest pathogens by phagocytosis — they attack any invader regardless of type. Third line: the specific immune response — lymphocytes (a type of white blood cell) produce antibodies that target specific antigens on the surface of a particular pathogen. Each antibody is shaped to fit one specific antigen, like a key fitting a lock.',
            interactive: {
              type: 'expand',
              label: 'How do antibodies destroy pathogens?',
              hiddenContent: 'Antibodies neutralise pathogens in several ways: they bind to antigens and block the pathogen from entering host cells, they cause pathogens to clump together (agglutination) making them easier for phagocytes to engulf, and they trigger the complement system which punches holes in the bacterial cell membrane. Once an antibody is produced, it is specific to that antigen and will not work against any other pathogen.',
            },
          },
          {
            title: 'B-Cells and T-Cells',
            content: 'B-lymphocytes (B-cells) produce antibodies — this is humoral immunity. When a B-cell encounters its specific antigen, it divides rapidly to form plasma cells (which make large amounts of antibody) and memory B-cells (which remain in the body long-term). T-lymphocytes (T-cells) provide cell-mediated immunity: helper T-cells coordinate the immune response by releasing chemical signals, and killer T-cells (cytotoxic T-cells) destroy body cells that have been infected by viruses. Memory cells remain after an infection is cleared — if the same pathogen returns, memory cells produce a faster and stronger response. This is the basis of immunity and vaccination.',
          },
          {
            title: 'WAEC: Vaccination and Immunity in Ghana',
            content: 'Ghana\'s Expanded Programme on Immunisation (EPI) vaccinates children against TB, polio, measles, hepatitis B, and more. Vaccines contain weakened or dead pathogens (or just their antigens) that trigger the production of memory cells without causing the actual disease. If the real pathogen later enters the body, memory cells respond so quickly that the person does not become ill. Booster doses are sometimes needed because the memory cell response can weaken over time. WAEC commonly asks: explain how vaccination provides immunity and why booster doses are needed. The University of Ghana has contributed to vaccine research for diseases like malaria, which remains a major health challenge in the country.',
          },
        ]
      },
      flashcards: [
        { id: 'irf1', question: 'What is phagocytosis?', answer: 'The process by which phagocytes engulf and digest pathogens' },
        { id: 'irf2', question: 'What is the difference between an antigen and an antibody?', answer: 'An antigen is a molecule on the surface of a pathogen; an antibody is a protein made by lymphocytes that binds to a specific antigen' },
        { id: 'irf3', question: 'What do B-lymphocytes produce?', answer: 'Antibodies (humoral immunity)' },
        { id: 'irf4', question: 'What do killer T-cells do?', answer: 'Destroy body cells that have been infected by viruses (cell-mediated immunity)' },
        { id: 'irf5', question: 'Why do vaccines contain weakened or dead pathogens?', answer: 'To trigger memory cell production without causing the actual disease' },
      ],
      checkpointAssessment: [
        {
          id: 'irq1',
          type: 'mcq',
          prompt: 'Which line of defence involves phagocytes engulfing pathogens?',
          options: [
            { id: 'a', text: 'First line — physical barriers' },
            { id: 'b', text: 'Second line — non-specific white blood cells' },
            { id: 'c', text: 'Third line — specific immune response' },
            { id: 'd', text: 'Fourth line — antibiotics' },
          ],
          correctAnswer: 'b',
        },
        {
          id: 'irq2',
          type: 'mcq',
          prompt: 'What is the role of memory cells in immunity?',
          options: [
            { id: 'a', text: 'They produce antibodies immediately on first exposure' },
            { id: 'b', text: 'They remain in the body and respond faster if the same pathogen returns' },
            { id: 'c', text: 'They engulf pathogens by phagocytosis' },
            { id: 'd', text: 'They destroy infected body cells' },
          ],
          correctAnswer: 'b',
        },
        {
          id: 'irq3',
          type: 'one-word',
          prompt: 'The process by which phagocytes surround and digest a pathogen is called...?',
          correctAnswer: 'Phagocytosis',
        },
        {
          id: 'irq4',
          type: 'matching',
          prompt: 'Match each immune component to its function.',
          pairs: [
            { left: 'Phagocyte', right: 'Engulfs and digests any pathogen (non-specific)' },
            { left: 'B-lymphocyte', right: 'Produces antibodies specific to an antigen' },
            { left: 'Killer T-cell', right: 'Destroys virus-infected body cells' },
            { left: 'Memory cell', right: 'Provides long-term immunity after infection or vaccination' },
          ],
        },
      ],
    },
    {
      id: 'homeostasis-control-loop',
      title: 'Homeostasis and Control Loops',
      lesson: {
        sections: [
          {
            title: 'Negative Feedback',
            content: 'Homeostasis maintains internal conditions near set points. Any deviation is detected by a receptor; a coordination centre (brain/hypothalamus) compares it to the set point and sends instructions to an effector to correct the deviation. The correction reduces the original stimulus — this is negative feedback.',
            interactive: {
              type: 'reveal',
              label: 'Blood glucose negative feedback loop',
              hiddenContent: 'Rise in blood glucose → pancreatic beta cells detect it → insulin secreted → liver & cells absorb glucose → blood glucose falls back to set point. If it falls too low, glucagon does the reverse. One hormone reverses what the other started.'
            }
          },
          {
            title: 'Temperature Regulation',
            content: 'Core body temperature is maintained at ~37 °C by the hypothalamus. Too hot: peripheral vasodilation, sweating, erector pili muscles relax (hairs lie flat). Too cold: vasoconstriction, shivering (muscle contractions generate heat), erector pili contract (hairs stand up, trapping air). These are all effector responses in a negative feedback loop.',
          },
          {
            title: 'Water Balance (Osmoregulation)',
            content: 'The hypothalamus monitors blood osmolarity. When solute concentration is too high (dehydrated), the pituitary releases ADH, making collecting ducts more permeable and reabsorbing more water. When dilute, less ADH → more dilute urine. This links the endocrine and excretory systems into one integrated homeostatic loop.',
            interactive: {
              type: 'expand',
              label: 'Why is morning urine more concentrated?',
              hiddenContent: 'At night, fluid intake stops but losses continue. ADH levels rise, collecting ducts become very permeable, and water is reabsorbed. The kidneys produce small volumes of dark, concentrated urine. After drinking water in the morning, ADH drops and urine becomes pale and dilute within about 30 minutes.'
            }
          }
        ]
      },
      flashcards: [
        { id: 'homeo-f1', question: 'What hormone lowers blood glucose?', answer: 'Insulin' },
        { id: 'homeo-f2', question: 'What hormone increases water reabsorption in the kidney?', answer: 'ADH (Antidiuretic hormone)' },
        { id: 'homeo-f3', question: 'What type of feedback reverses deviation from a set point?', answer: 'Negative feedback' },
        { id: 'homeo-f4', question: 'Which organ monitors core body temperature?', answer: 'Hypothalamus' },
        { id: 'homeo-f5', question: 'What is vasodilation?', answer: 'Widening of blood vessels near the skin to lose heat' },
      ],
      checkpointAssessment: [
        {
          id: 'homeo-q1',
          type: 'mcq',
          prompt: 'Negative feedback always:',
          options: [
            { id: 'a', text: 'Amplifies the original change' },
            { id: 'b', text: 'Reverses the deviation to restore the set point' },
            { id: 'c', text: 'Stops all hormone production' },
            { id: 'd', text: 'Requires the nervous system only' }
          ],
          correctAnswer: 'b'
        },
        {
          id: 'homeo-q2',
          type: 'one-word',
          prompt: 'Shivering mainly helps to do what to body temperature?',
          correctAnswer: 'Raise',
          explanation: 'Muscle contractions during shivering release heat as a by-product of cellular respiration.'
        },
        {
          id: 'homeo-q3',
          type: 'matching',
          prompt: 'Match each homeostatic response to its trigger:',
          pairs: [
            { left: 'Sweating', right: 'Body too hot' },
            { left: 'Shivering', right: 'Body too cold' },
            { left: 'ADH release', right: 'Blood too concentrated' }
          ]
        }
      ]
    },
    {
      id: 'nutrition-digestion-sub',
      title: 'Nutrition and the Digestive System',
      lesson: { sections: [{ title: 'Mechanical and Chemical Digestion', content: "Food is processed physically by chewing and churning, then chemically by enzymes. Amylase breaks starch into maltose, pepsin breaks proteins into peptides, and lipase breaks fats into fatty acids and glycerol." }, { title: 'The Alimentary Canal', content: "The mouth, oesophagus, stomach, small intestine, and large intestine each play different roles. The stomach produces HCl and pepsin. The pancreas secretes enzymes into the duodenum. Bile from the liver emulsifies fats." }, { title: 'Absorption in the Small Intestine', content: "Villi and microvilli massively increase surface area. Each villus has a thin epithelium, a dense capillary network, and a lacteal for fat absorption. Glucose and amino acids are absorbed by active transport and diffusion." }] },
      flashcards: [{ id: 'nd-f1', question: 'Which enzyme starts starch digestion in the mouth?', answer: 'Amylase' }, { id: 'nd-f2', question: 'Where does most absorption occur?', answer: 'Small intestine' }, { id: 'nd-f3', question: 'What does bile do?', answer: 'Emulsifies fats' }, { id: 'nd-f4', question: 'What structures increase surface area in the small intestine?', answer: 'Villi and microvilli' }, { id: 'nd-f5', question: 'Which organ produces bile?', answer: 'Liver' }],
      checkpointAssessment: [{ id: 'nd-q1', type: 'mcq' as const, prompt: 'Which organ mainly produces hydrochloric acid?', options: [{ id: 'a', text: 'Mouth' }, { id: 'b', text: 'Stomach' }, { id: 'c', text: 'Pancreas' }, { id: 'd', text: 'Large intestine' }], correctAnswer: 'b' }, { id: 'nd-q2', type: 'one-word' as const, prompt: 'Proteins are digested into which monomers?', correctAnswer: 'Amino acids' }]
    },
    {
      id: 'transport-systems-sub',
      title: 'Transport in Humans and Plants',
      lesson: { sections: [{ title: 'The Human Circulatory System', content: "A double circulatory system pumps blood through the lungs (pulmonary circuit) and body (systemic circuit). The left ventricle has the thickest wall because it pumps blood to the whole body at high pressure." }, { title: 'Blood Vessels and Blood', content: "Arteries carry blood away from the heart with thick elastic walls. Veins return blood with valves preventing backflow. Capillaries are one cell thick for efficient exchange. Red blood cells carry oxygen via haemoglobin." }, { title: 'Transport in Plants', content: "Xylem carries water and minerals upward by transpiration pull — evaporation from leaves creates a continuous column of water. Phloem transports dissolved sugars from source to sink by translocation, an active process requiring ATP." }] },
      flashcards: [{ id: 'ts-f1', question: 'Which vessel carries blood away from the heart?', answer: 'Artery' }, { id: 'ts-f2', question: 'Which tissue transports sugars in plants?', answer: 'Phloem' }, { id: 'ts-f3', question: 'Which tissue transports water upward?', answer: 'Xylem' }, { id: 'ts-f4', question: 'Why is the left ventricle wall thickest?', answer: 'It pumps blood to the whole body' }, { id: 'ts-f5', question: 'What prevents backflow in veins?', answer: 'Valves' }],
      checkpointAssessment: [{ id: 'ts-q1', type: 'mcq' as const, prompt: 'Which chamber pumps blood to the body?', options: [{ id: 'a', text: 'Left atrium' }, { id: 'b', text: 'Right atrium' }, { id: 'c', text: 'Left ventricle' }, { id: 'd', text: 'Right ventricle' }], correctAnswer: 'c' }, { id: 'ts-q2', type: 'one-word' as const, prompt: 'Transpiration pull is linked to which tissue?', correctAnswer: 'Xylem' }]
    }
        ],
        finalAssessment: [
    {
      id: 'hp-final-1',
      type: 'mcq',
      prompt: 'During which phase of the cardiac cycle do the ventricles contract and pump blood out?',
      options: [
        { id: 'a', text: 'Diastole' },
        { id: 'b', text: 'Systole' },
        { id: 'c', text: 'Fibrillation' },
        { id: 'd', text: 'Asystole' },
      ],
      correctAnswer: 'b',
    },
    {
      id: 'hp-final-2',
      type: 'one-word',
      prompt: 'In the nephron, what process forces small molecules through the basement membrane into the Bowman\'s capsule?',
      correctAnswer: 'Ultrafiltration',
    },
    {
      id: 'hp-final-3',
      type: 'matching',
      prompt: 'Match each immune cell to its role in the immune response.',
      pairs: [
        { left: 'Phagocyte', right: 'Engulfs pathogens non-specifically' },
        { left: 'B-lymphocyte', right: 'Produces antibodies' },
        { left: 'Memory cell', right: 'Provides long-term immunity after infection' },
      ],
    },
  ],
};
