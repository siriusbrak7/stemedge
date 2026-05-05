import React, { Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, FlaskConical } from 'lucide-react';

const OsmosisLab = React.lazy(() => import('./biology/OsmosisLab'));
const PhotosynthesisLab = React.lazy(() => import('./biology/PhotosynthesisLab'));
const EnzymeLab = React.lazy(() => import('./biology/EnzymeLab'));
const ProteinSynthesisLab = React.lazy(() => import('./biology/ProteinSynthesisLab'));
const FoodTestsLab = React.lazy(() => import('./biology/FoodTestsLab'));
const TranspirationPotometerLab = React.lazy(() => import('./biology/TranspirationPotometerLab'));
const MitosisLab = React.lazy(() => import('./biology/MitosisLab'));
const DNAExtractionLab = React.lazy(() => import('./biology/DNAExtractionLab'));
const HeartRateLab = React.lazy(() => import('./biology/HeartRateLab'));
const EcosystemEnergyLab = React.lazy(() => import('./biology/EcosystemEnergyLab'));
const BiodiversityLab = React.lazy(() => import('./biology/BiodiversityLab'));
const PhotosynthesisRateLab = React.lazy(() => import('./biology/PhotosynthesisRateLab'));

const ProjectileLab = React.lazy(() => import('./physics/ProjectileLab'));
const WaveLab = React.lazy(() => import('./physics/WaveLab'));
const SimplePendulumLab = React.lazy(() => import('./physics/SimplePendulumLab'));
const HookesLawLab = React.lazy(() => import('./physics/HookesLawLab'));
const CircuitLab = React.lazy(() => import('./physics/CircuitLab'));
const ConvexLensLab = React.lazy(() => import('./physics/ConvexLensLab'));
const SpecificHeatLab = React.lazy(() => import('./physics/SpecificHeatLab'));
const FreefallLab = React.lazy(() => import('./physics/FreefallLab'));
const ElectromagnetLab = React.lazy(() => import('./physics/ElectromagnetLab'));
const ResistivityLab = React.lazy(() => import('./physics/ResistivityLab'));

const ReactionLab = React.lazy(() => import('./chemistry/ReactionLab'));
const StoichiometryLab = React.lazy(() => import('./chemistry/StoichiometryLab'));
const AcidBaseTitrationLab = React.lazy(() => import('./chemistry/AcidBaseTitrationLab'));
const RateOfReactionLab = React.lazy(() => import('./chemistry/RateOfReactionLab'));
const FlameTestLab = React.lazy(() => import('./chemistry/FlameTestLab'));
const ElectrolysisLab = React.lazy(() => import('./chemistry/ElectrolysisLab'));
const CrystalLab = React.lazy(() => import('./chemistry/CrystalLab'));
const NeutralizationLab = React.lazy(() => import('./chemistry/NeutralizationLab'));
const GasLawsLab = React.lazy(() => import('./chemistry/GasLawsLab'));

const GraphChallengeLab = React.lazy(() => import('./math/GraphChallengeLab'));
const ParabolaLab = React.lazy(() => import('./math/ParabolaLab'));
const LinearRegressionLab = React.lazy(() => import('./math/LinearRegressionLab'));
const InequalitiesLab = React.lazy(() => import('./math/InequalitiesLab'));
const DifferentiationLab = React.lazy(() => import('./math/DifferentiationLab'));
const IntegrationLab = React.lazy(() => import('./math/IntegrationLab'));
const SequenceSeriesLab = React.lazy(() => import('./math/SequenceSeriesLab'));

interface LabLauncherProps {
  labId: string;
}

export default function LabLauncher({ labId }: LabLauncherProps) {
  const getLab = () => {
    switch (labId) {
      case 'osmosis-lab': return <OsmosisLab />;
      case 'photosynthesis-lab': return <PhotosynthesisLab />;
      case 'enzyme-lab': return <EnzymeLab />;
      case 'protein-synthesis-lab': return <ProteinSynthesisLab />;
      case 'food-tests-lab': return <FoodTestsLab />;
      case 'transpiration-potometer-lab': return <TranspirationPotometerLab />;
      case 'mitosis-lab': return <MitosisLab />;
      case 'dna-extraction-lab': return <DNAExtractionLab />;
      case 'heart-rate-lab': return <HeartRateLab />;
      case 'ecosystem-energy-lab': return <EcosystemEnergyLab />;
      case 'biodiversity-lab': return <BiodiversityLab />;
      case 'photosynthesis-rate-lab': return <PhotosynthesisRateLab />;
      case 'projectile-lab': return <ProjectileLab />;
      case 'wave-lab': return <WaveLab />;
      case 'simple-pendulum-lab': return <SimplePendulumLab />;
      case 'hookes-law-lab': return <HookesLawLab />;
      case 'circuit-lab': return <CircuitLab />;
      case 'convex-lens-lab': return <ConvexLensLab />;
      case 'specific-heat-lab': return <SpecificHeatLab />;
      case 'freefall-lab': return <FreefallLab />;
      case 'electromagnet-lab': return <ElectromagnetLab />;
      case 'resistivity-lab': return <ResistivityLab />;
      case 'reaction-lab': return <ReactionLab />;
      case 'stoichiometry-lab': return <StoichiometryLab />;
      case 'acid-base-titration-lab': return <AcidBaseTitrationLab />;
      case 'rate-of-reaction-lab': return <RateOfReactionLab />;
      case 'flame-test-lab': return <FlameTestLab />;
      case 'electrolysis-lab': return <ElectrolysisLab />;
      case 'crystal-lab': return <CrystalLab />;
      case 'neutralization-lab': return <NeutralizationLab />;
      case 'gas-laws-lab': return <GasLawsLab />;
      case 'graph-challenge-lab': return <GraphChallengeLab />;
      case 'parabola-lab': return <ParabolaLab />;
      case 'linear-regression-lab': return <LinearRegressionLab />;
      case 'inequalities-lab': return <InequalitiesLab />;
      case 'differentiation-lab': return <DifferentiationLab />;
      case 'integration-lab': return <IntegrationLab />;
      case 'sequence-series-lab': return <SequenceSeriesLab />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-96 bg-slate-900 border border-brand-border rounded-xl">
            <FlaskConical size={48} className="text-slate-600 mb-4" />
            <p className="text-slate-400 font-mono text-sm mb-2">Lab not found for ID: {labId}</p>
            <p className="text-slate-500 text-xs">Check if the lab configuration is correct.</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={labId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full"
        >
          <Suspense
            fallback={
              <div className="flex flex-col items-center justify-center h-96 bg-slate-900/50 rounded-[2rem] border border-brand-accent/20">
                <div className="flex items-center gap-3 mb-4">
                  <FlaskConical className="w-8 h-8 text-brand-accent animate-pulse" />
                  <Loader2 className="w-6 h-6 text-brand-accent animate-spin" />
                </div>
                <span className="text-brand-accent text-sm font-bold uppercase tracking-widest">
                  Loading Virtual Lab...
                </span>
                <span className="text-slate-500 text-xs mt-2">Preparing your experiment</span>
              </div>
            }
          >
            <div className="w-full min-h-[600px] bg-black/20 rounded-[2rem] border border-brand-accent/10 overflow-hidden p-8">
              {getLab()}
            </div>
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
