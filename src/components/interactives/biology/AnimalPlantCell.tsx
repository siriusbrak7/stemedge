import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Eye, 
  Target, 
  Lightbulb, 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  XCircle,
  RotateCcw,
  BookOpen,
  Layers,
  Gamepad2
} from 'lucide-react';
import DetailDrawer from '../../shared/DetailDrawer';
import QuizMode from '../../shared/QuizMode';
import { CELL_MISCONCEPTIONS, Misconception } from '../../../data/misconceptions/biology';

type ViewMode = 'explore' | 'compare' | 'quiz' | 'learn';

interface Organelle {
  id: string;
  cell: 'animal' | 'plant';
  name: string;
  desc: string;
  shortDesc: string;
  x: number;
  y: number;
  color: string;
  outline: string;
  function: string;
  location: string;
  size: string;
  number: string;
  unique: string;
}

const ORGANELLES: Organelle[] = [
  {
    id: 'a-nucleus',
    cell: 'animal',
    name: 'Nucleus',
    desc: 'The control center of the cell, containing DNA and directing cell activities.',
    shortDesc: 'Control center with DNA',
    x: 150, y: 150,
    color: '#c084fc',
    outline: '#e879f9',
    function: 'Stores genetic material (DNA) and controls protein synthesis and cell division.',
    location: 'Central position in animal cells, pushed to side in plant cells.',
    size: '5-10 μm diameter',
    number: 'Usually 1 per cell',
    unique: 'Contains nucleolus where ribosomes are made.'
  },
  {
    id: 'a-mito',
    cell: 'animal',
    name: 'Mitochondrion',
    desc: 'Powerhouse of the cell, generating ATP through cellular respiration.',
    shortDesc: 'Energy producer (ATP)',
    x: 70, y: 120,
    color: '#f97316',
    outline: '#fb923c',
    function: 'Produces ATP through cellular respiration. Has its own DNA.',
    location: 'Scattered throughout cytoplasm, more active cells have more.',
    size: '1-10 μm long',
    number: 'Hundreds to thousands per cell',
    unique: 'Has its own DNA, believed to be from ancient bacteria.'
  },
  {
    id: 'a-golgi',
    cell: 'animal',
    name: 'Golgi Apparatus',
    desc: 'Modifies, packages, and ships proteins and lipids.',
    shortDesc: 'Protein packaging center',
    x: 120, y: 230,
    color: '#38bdf8',
    outline: '#7dd3fc',
    function: 'Modifies proteins and lipids, packages them into vesicles for transport.',
    location: 'Near the nucleus and endoplasmic reticulum.',
    size: 'Stack of flattened sacs',
    number: 'Several per cell',
    unique: 'Can create lysosomes for cellular digestion.'
  },
  {
    id: 'a-membrane',
    cell: 'animal',
    name: 'Cell Membrane',
    desc: 'Flexible boundary controlling what enters and leaves the cell.',
    shortDesc: 'Selective barrier',
    x: 150, y: 20,
    color: '#ef4444',
    outline: '#f87171',
    function: 'Protects cell, controls movement of materials in and out, communicates with other cells.',
    location: 'Outermost layer in animal cells (just inside cell wall in plants).',
    size: '8 nm thick',
    number: '1 continuous membrane',
    unique: 'Fluid mosaic model - proteins float in lipid bilayer.'
  },
  {
    id: 'p-nucleus',
    cell: 'plant',
    name: 'Nucleus',
    desc: 'Control center, pushed to the side by the large central vacuole.',
    shortDesc: 'Control center with DNA',
    x: 80, y: 100,
    color: '#c084fc',
    outline: '#e879f9',
    function: 'Stores genetic material (DNA) and controls protein synthesis and cell division.',
    location: 'Pushed to the side by central vacuole in plant cells.',
    size: '5-10 μm diameter',
    number: 'Usually 1 per cell',
    unique: 'Position differs from animal cells due to vacuole.'
  },
  {
    id: 'p-vacuole',
    cell: 'plant',
    name: 'Central Vacuole',
    desc: 'Large storage compartment that maintains turgor pressure.',
    shortDesc: 'Water storage & pressure',
    x: 180, y: 160,
    color: '#2dd4bf',
    outline: '#5eead4',
    function: 'Stores water, ions, and nutrients. Maintains turgor pressure for plant rigidity.',
    location: 'Central position, can occupy up to 90% of cell volume.',
    size: 'Can fill most of the cell',
    number: '1 large central vacuole',
    unique: 'Animal cells have small temporary vacuoles, not large permanent ones.'
  },
  {
    id: 'p-chloro',
    cell: 'plant',
    name: 'Chloroplast',
    desc: 'Photosynthesis factory, converting sunlight into glucose.',
    shortDesc: 'Photosynthesis site',
    x: 250, y: 80,
    color: '#84cc16',
    outline: '#a3e635',
    function: 'Conducts photosynthesis - converts CO₂ and H₂O into glucose using sunlight.',
    location: 'Throughout cytoplasm in leaf cells.',
    size: '4-10 μm long',
    number: '30-50 per leaf cell',
    unique: 'Contains chlorophyll and has its own DNA.'
  },
  {
    id: 'p-wall',
    cell: 'plant',
    name: 'Cell Wall',
    desc: 'Rigid outer layer providing structural support and protection.',
    shortDesc: 'Structural support',
    x: 150, y: 10,
    color: '#22c55e',
    outline: '#4ade80',
    function: 'Provides rigidity, protection, and shape. Prevents cell from bursting.',
    location: 'Outside the cell membrane.',
    size: '0.1-10 μm thick',
    number: '1 continuous layer',
    unique: 'Made of cellulose - ANIMAL CELLS DO NOT HAVE THIS.'
  },
];

const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    question: 'Which organelle is found in plant cells but NOT in animal cells?',
    type: 'multiple-choice' as const,
    options: ['Mitochondria', 'Nucleus', 'Cell Wall', 'Cell Membrane'],
    correctAnswer: 'Cell Wall',
    explanation: 'Cell walls are made of cellulose and provide rigid support. Animal cells only have a flexible cell membrane.',
  },
  {
    id: 'q2',
    question: 'What is the main function of the mitochondrion?',
    type: 'multiple-choice' as const,
    options: ['Photosynthesis', 'ATP production', 'Protein storage', 'Cell division'],
    correctAnswer: 'ATP production',
    explanation: 'Mitochondria are the powerhouses of the cell, producing ATP through cellular respiration.',
  },
  {
    id: 'q3',
    question: 'Why do plant cells have a large central vacuole?',
    type: 'multiple-choice' as const,
    options: ['To store DNA', 'To maintain turgor pressure', 'To make proteins', 'To produce energy'],
    correctAnswer: 'To maintain turgor pressure',
    explanation: 'The large vacuole stores water and maintains turgor pressure, which keeps the plant upright and rigid.',
  },
  {
    id: 'q4',
    question: 'Which organelle contains chlorophyll and performs photosynthesis?',
    type: 'multiple-choice' as const,
    options: ['Mitochondria', 'Nucleus', 'Chloroplast', 'Golgi Apparatus'],
    correctAnswer: 'Chloroplast',
    explanation: 'Chloroplasts contain chlorophyll, the green pigment that captures sunlight for photosynthesis.',
  },
];

export default function AnimalPlantCell() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('explore');
  const [selectedOrganelle, setSelectedOrganelle] = useState<Organelle | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showMisconception, setShowMisconception] = useState<Misconception | null>(null);
  const [highlightCell, setHighlightCell] = useState<'animal' | 'plant' | null>(null);
  const [quizComplete, setQuizComplete] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const hoveredData = ORGANELLES.find(o => o.id === hovered);

  const handleOrganelleClick = useCallback((organelle: Organelle) => {
    setSelectedOrganelle(organelle);
    setShowDetail(true);
  }, []);

  const getOrganelleByPart = (id: string): Organelle | undefined => {
    return ORGANELLES.find(o => o.id === id);
  };

  const renderCellSVG = (cellType: 'animal' | 'plant', isInteractive: boolean = true) => {
    const cellOrganelles = ORGANELLES.filter(o => o.cell === cellType);
    const isHighlighted = highlightCell === cellType;
    const isDimmed = highlightCell && highlightCell !== cellType;

    return (
      <div className="flex-1 flex flex-col items-center relative">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">
          {cellType === 'animal' ? 'Animal Cell' : 'Plant Cell'}
        </h3>

        <svg 
          viewBox="0 0 300 300" 
          className={`w-full max-w-[300px] h-auto transition-all duration-300 ${
            isHighlighted ? 'scale-105' : isDimmed ? 'opacity-30' : ''
          }`}
        >
          <defs>
            <filter id={`glow-${cellType}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {cellType === 'animal' ? (
            <>
              <circle 
                cx="150" cy="150" r="145" 
                fill="url(#animal-grad)" 
                stroke={hoveredData?.id === 'a-membrane' ? '#f43f5e' : '#f43f5e'} 
                strokeWidth="3"
                className={`cursor-pointer transition-all ${
                  isInteractive && viewMode === 'explore' ? 'hover:stroke-[4px]' : ''
                }`}
                onMouseEnter={() => setHovered('a-membrane')}
                onMouseLeave={() => setHovered(null)}
                onClick={() => {
                  const org = getOrganelleByPart('a-membrane');
                  if (org && isInteractive) handleOrganelleClick(org);
                }}
              />
              <radialGradient id="animal-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#4c1d95" />
                <stop offset="70%" stopColor="#831843" />
                <stop offset="100%" stopColor="#be123c" />
              </radialGradient>
            </>
          ) : (
            <>
              <rect 
                x="10" y="10" width="280" height="280" rx="30" 
                fill="url(#plant-grad)" 
                stroke={hoveredData?.id === 'p-wall' ? '#22c55e' : '#16a34a'} 
                strokeWidth="8"
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHovered('p-wall')}
                onMouseLeave={() => setHovered(null)}
                onClick={() => {
                  const org = getOrganelleByPart('p-wall');
                  if (org && isInteractive) handleOrganelleClick(org);
                }}
              />
              <rect x="18" y="18" width="264" height="264" rx="22" fill="none" stroke="#4ade80" strokeWidth="2" opacity="0.5" />
              <radialGradient id="plant-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#064e3b" />
                <stop offset="80%" stopColor="#14532d" />
                <stop offset="100%" stopColor="#15803d" />
              </radialGradient>
            </>
          )}

          {cellType === 'plant' && (
            <path 
              d="M 120 80 Q 220 50 250 140 T 160 250 Q 80 200 120 80 Z" 
              fill="#2dd4bf" 
              filter="url(#glow-plant)" 
              opacity={hoveredData?.id === 'p-vacuole' ? 0.9 : 0.6}
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHovered('p-vacuole')}
              onMouseLeave={() => setHovered(null)}
              onClick={() => {
                const org = getOrganelleByPart('p-vacuole');
                if (org && isInteractive) handleOrganelleClick(org);
              }}
            />
          )}

          {cellType === 'animal' ? (
            <>
              <circle 
                cx="150" cy="150" r="40" 
                fill="#9333ea" 
                filter="url(#glow-animal)"
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHovered('a-nucleus')}
                onMouseLeave={() => setHovered(null)}
                onClick={() => {
                  const org = getOrganelleByPart('a-nucleus');
                  if (org && isInteractive) handleOrganelleClick(org);
                }}
              />
              <circle cx="150" cy="150" r="15" fill="#d8b4fe" pointerEvents="none" />
            </>
          ) : (
            <>
              <circle 
                cx="70" cy="110" r="30" 
                fill="#9333ea" 
                filter="url(#glow-plant)"
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHovered('p-nucleus')}
                onMouseLeave={() => setHovered(null)}
                onClick={() => {
                  const org = getOrganelleByPart('p-nucleus');
                  if (org && isInteractive) handleOrganelleClick(org);
                }}
              />
              <circle cx="70" cy="110" r="10" fill="#d8b4fe" pointerEvents="none" />
            </>
          )}

          {cellType === 'animal' && (
            <>
              <g 
                className="cursor-pointer"
                onMouseEnter={() => setHovered('a-mito')}
                onMouseLeave={() => setHovered(null)}
                onClick={() => {
                  const org = getOrganelleByPart('a-mito');
                  if (org && isInteractive) handleOrganelleClick(org);
                }}
              >
                <ellipse cx="70" cy="120" rx="25" ry="12" fill="#ea580c" transform="rotate(-30, 70, 120)" filter="url(#glow-animal)" />
                <path d="M 55 110 Q 60 120 65 115 T 75 125 T 85 120" fill="none" stroke="#fed7aa" strokeWidth="2" />
              </g>
              <g 
                className="cursor-pointer"
                onClick={() => {
                  const org = getOrganelleByPart('a-mito');
                  if (org && isInteractive) handleOrganelleClick(org);
                }}
              >
                <ellipse cx="200" cy="220" rx="30" ry="14" fill="#ea580c" transform="rotate(45, 200, 220)" filter="url(#glow-animal)" />
                <path d="M 185 205 Q 190 220 200 215 T 215 230" fill="none" stroke="#fed7aa" strokeWidth="2" />
              </g>
              <g 
                className="cursor-pointer"
                onMouseEnter={() => setHovered('a-golgi')}
                onMouseLeave={() => setHovered(null)}
                onClick={() => {
                  const org = getOrganelleByPart('a-golgi');
                  if (org && isInteractive) handleOrganelleClick(org);
                }}
              >
                <path d="M 90 220 Q 120 250 150 220 M 95 230 Q 120 260 145 230 M 105 240 Q 120 270 135 240" fill="none" stroke="#0ea5e9" strokeWidth="8" strokeLinecap="round" filter="url(#glow-animal)" />
              </g>
            </>
          )}

          {cellType === 'plant' && (
            <>
              <g 
                className="cursor-pointer"
                onClick={() => {
                  const org = getOrganelleByPart('p-chloro');
                  if (org && isInteractive) handleOrganelleClick(org);
                }}
              >
                <ellipse cx="230" cy="220" rx="20" ry="12" fill="#65a30d" transform="rotate(-20, 230, 220)" filter="url(#glow-plant)" />
                <circle cx="225" cy="220" r="4" fill="#a3e635" />
                <circle cx="235" cy="220" r="4" fill="#a3e635" />
              </g>
              <g 
                className="cursor-pointer"
                onClick={() => {
                  const org = getOrganelleByPart('p-chloro');
                  if (org && isInteractive) handleOrganelleClick(org);
                }}
              >
                <ellipse cx="100" cy="240" rx="22" ry="14" fill="#65a30d" transform="rotate(15, 100, 240)" filter="url(#glow-plant)" />
                <circle cx="95" cy="240" r="5" fill="#a3e635" />
                <circle cx="107" cy="240" r="5" fill="#a3e635" />
              </g>
            </>
          )}
        </svg>

        {viewMode === 'compare' && (
          <div className="mt-4 text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">
              {cellType === 'animal' ? 'Unique to Animal Cells' : 'Unique to Plant Cells'}
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {(cellType === 'animal' 
                ? ['Centrioles', 'Lysosomes', 'Small Vacuoles']
                : ['Cell Wall', 'Chloroplasts', 'Large Vacuole']
              ).map((item, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full min-h-[600px] bg-[#0a0f18] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
      <div className="absolute inset-0 z-[-1]" style={{
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(34,211,238,0.05) 0%, transparent 60%), linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '100% 100%, 40px 40px, 40px 40px',
        backgroundPosition: 'center center'
      }}></div>

      <div className="absolute top-4 left-4 flex gap-2 z-20">
        <button
          onClick={() => setViewMode('explore')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
            viewMode === 'explore' 
              ? 'bg-brand-accent text-black' 
              : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          <Eye size={14} />
          Explore
        </button>
        <button
          onClick={() => setViewMode('compare')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
            viewMode === 'compare' 
              ? 'bg-brand-accent text-black' 
              : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          <Layers size={14} />
          Compare
        </button>
        <button
          onClick={() => setViewMode('quiz')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
            viewMode === 'quiz' 
              ? 'bg-brand-accent text-black' 
              : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          <Target size={14} />
          Quiz
        </button>
        <button
          onClick={() => setViewMode('learn')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
            viewMode === 'learn' 
              ? 'bg-brand-accent text-black' 
              : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          <GraduationCap size={14} />
          Learn
        </button>
      </div>

      <div className="flex w-full max-w-5xl h-full items-center justify-center gap-12 p-8 pt-16">
        {viewMode !== 'quiz' ? (
          <>
            {renderCellSVG('animal', viewMode === 'explore' || viewMode === 'learn')}
            {renderCellSVG('plant', viewMode === 'explore' || viewMode === 'learn')}
          </>
        ) : (
          <div className="w-full max-w-2xl">
            <QuizMode
              questions={QUIZ_QUESTIONS}
              title="Cell Structure Quiz"
              onComplete={(score) => {
                setQuizScore(score);
                setQuizComplete(true);
              }}
            />
          </div>
        )}
      </div>

      <AnimatePresence>
        {hoveredData && viewMode === 'explore' && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", damping: 20 }}
            className="absolute rounded-xl backdrop-blur-xl border border-slate-700/50 p-4 max-w-[280px] shadow-2xl pointer-events-none z-50 flex items-start gap-3"
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              left: hoveredData.cell === 'animal' ? '15%' : '55%',
              top: '35%'
            }}
          >
            <div 
              className="mt-1 w-8 h-8 rounded-full border border-white/20 flex items-center justify-center relative overflow-hidden shrink-0" 
              style={{ backgroundColor: hoveredData.color }}
            >
              <div className="absolute inset-0 opacity-50 blur-sm" style={{ backgroundColor: hoveredData.color }}></div>
              <div className="w-3 h-3 rounded-full bg-white relative z-10"></div>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-1">{hoveredData.name}</h4>
              <p className="text-slate-300 text-xs leading-relaxed mb-2">{hoveredData.shortDesc}</p>
              <div className="text-[10px] text-brand-accent">Click for details →</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {viewMode === 'learn' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4"
        >
          <button
            onClick={() => setShowMisconception(CELL_MISCONCEPTIONS[0])}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-xs font-bold uppercase tracking-widest hover:bg-red-500/30 transition-all"
          >
            <Lightbulb size={14} />
            Common Misconceptions
          </button>
          <button
            onClick={() => setViewMode('quiz')}
            className="flex items-center gap-2 px-4 py-2 bg-brand-accent text-black rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white transition-all"
          >
            Test Knowledge
            <ArrowRight size={14} />
          </button>
        </motion.div>
      )}

      <DetailDrawer
        title={selectedOrganelle?.name || ''}
        subtitle={`${selectedOrganelle?.cell} cell organelle`}
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        sections={[
          {
            title: 'Function',
            content: selectedOrganelle?.function || '',
          },
          {
            title: 'Details',
            content: '',
            items: selectedOrganelle ? [
              { label: 'Location', value: selectedOrganelle.location },
              { label: 'Size', value: selectedOrganelle.size },
              { label: 'Number', value: selectedOrganelle.number },
            ] : [],
          },
          {
            title: 'Key Fact',
            content: selectedOrganelle?.unique || '',
          },
        ]}
      />
    </div>
  );
}
