import React, { type ComponentType, type LazyExoticComponent } from 'react';

// Biology
const AnimalPlantCell = React.lazy(() => import('./biology/AnimalPlantCell'));
const MembraneTransport = React.lazy(() => import('./biology/MembraneTransport'));
const LevelsOfOrg = React.lazy(() => import('./biology/LevelsOfOrg'));
const SynapticSpark = React.lazy(() => import('./biology/SynapticSpark'));
const MendelianInheritance = React.lazy(() => import('./biology/MendelianInheritance'));
const DNAReplication = React.lazy(() => import('./biology/DNAReplication'));
const Meiosis = React.lazy(() => import('./biology/Meiosis'));
const LacOperon = React.lazy(() => import('./biology/LacOperon'));
const CardiacCycle = React.lazy(() => import('./biology/CardiacCycle'));
const GasExchange = React.lazy(() => import('./biology/GasExchange'));
const NephronFilter = React.lazy(() => import('./biology/NephronFilter'));
const EndocrineFeedback = React.lazy(() => import('./biology/EndocrineFeedback'));
const MuscleContraction = React.lazy(() => import('./biology/MuscleContraction'));
const ImmuneResponse = React.lazy(() => import('./biology/ImmuneResponse'));
const NutritionDigestion = React.lazy(() => import('./biology/NutritionDigestion'));
const TransportSystems = React.lazy(() => import('./biology/TransportSystems'));
const EcologyEcosystems = React.lazy(() => import('./biology/EcologyEcosystems'));

// Physics
const TypesOfForces = React.lazy(() => import('./physics/TypesOfForces'));
const NewtonLaws = React.lazy(() => import('./physics/NewtonLaws'));
const VelocityAccel = React.lazy(() => import('./physics/VelocityAccel'));
const WaveProperties = React.lazy(() => import('./physics/WaveProperties'));
const DopplerEffect = React.lazy(() => import('./physics/DopplerEffect'));
const DoubleSlit = React.lazy(() => import('./physics/DoubleSlit'));
const OpticsRefraction = React.lazy(() => import('./physics/OpticsRefraction'));
const FaradayInduction = React.lazy(() => import('./physics/FaradayInduction'));
const MotorEffect = React.lazy(() => import('./physics/MotorEffect'));
const Transformers = React.lazy(() => import('./physics/Transformers'));
const KinematicsLinear = React.lazy(() => import('./physics/KinematicsLinear'));
const PropertiesOfMatter = React.lazy(() => import('./physics/PropertiesOfMatter'));
const HeatEnergy = React.lazy(() => import('./physics/HeatEnergy'));
const QuantumStudio = React.lazy(() => import('./physics/QuantumStudio'));
const EnergyTransferSankey = React.lazy(() => import('./physics/EnergyTransferSankey'));
const ElectricityGridSimulator = React.lazy(() => import('./physics/ElectricityGridSimulator'));

// Chemistry
const AtomicStructure = React.lazy(() => import('./chemistry/AtomicStructure'));
const ElectronConfig = React.lazy(() => import('./chemistry/ElectronConfig'));
const PeriodicTrends = React.lazy(() => import('./chemistry/PeriodicTrends'));
const MoleConcept = React.lazy(() => import('./chemistry/MoleConcept'));
const LimitingReactants = React.lazy(() => import('./chemistry/LimitingReactants'));
const TitrationCurve = React.lazy(() => import('./chemistry/TitrationCurve'));
const EnergyBonds = React.lazy(() => import('./chemistry/EnergyBonds'));
const HessLaw = React.lazy(() => import('./chemistry/HessLaw'));
const EntropySpontaneity = React.lazy(() => import('./chemistry/EntropySpontaneity'));
const AcidsBasesSalts = React.lazy(() => import('./chemistry/AcidsBasesSalts'));
const StatesOfMatterGasLaws = React.lazy(() => import('./chemistry/StatesOfMatterGasLaws'));
const SeparationTechniques = React.lazy(() => import('./chemistry/SeparationTechniques'));
const OrganicChemStudio = React.lazy(() => import('./chemistry/OrganicChemStudio'));
const EquilibriumSandbox = React.lazy(() => import('./chemistry/EquilibriumSandbox'));
const RedoxHalfEquationBuilder = React.lazy(() => import('./chemistry/RedoxHalfEquationBuilder'));

// Mathematics
const VarsExpressions = React.lazy(() => import('./math/VarsExpressions'));
const SolveLinear = React.lazy(() => import('./math/SolveLinear'));
const GraphLinear = React.lazy(() => import('./math/GraphLinear'));
const QuadraticExplorer = React.lazy(() => import('./math/QuadraticExplorer'));
const GeometryTrigonometry = React.lazy(() => import('./math/GeometryTrigonometry'));
const DerivativeExplorer = React.lazy(() => import('./mathematics/DerivativeExplorer'));
const IntegralAccumulator = React.lazy(() => import('./mathematics/IntegralAccumulator'));
const OptimizationSandbox = React.lazy(() => import('./mathematics/OptimizationSandbox'));
const CompletingSquare = React.lazy(() => import('./mathematics/CompletingSquare'));
const ProjectileMotionMath = React.lazy(() => import('./mathematics/ProjectileMotionMath'));
const QuadraticFormula = React.lazy(() => import('./mathematics/QuadraticFormula'));

const HomeostasisControlLoop = React.lazy(() => import('./biology/HomeostasisControlLoop'));
const PopulationGeneticsSimulator = React.lazy(() => import('./biology/PopulationGeneticsSimulator'));
const RespirationEnergyMap = React.lazy(() => import('./biology/RespirationEnergyMap'));

// Labs are loaded exclusively via LabLauncher (src/components/labs/LabLauncher.tsx)

export const interactiveRegistry: Record<string, LazyExoticComponent<ComponentType>> = {
  'animal-vs-plant': AnimalPlantCell,
  'membrane-transport': MembraneTransport,
  'levels-organization': LevelsOfOrg,
  neurotransmission: SynapticSpark,
  'mendelian-inheritance': MendelianInheritance,
  'dna-replication': DNAReplication,
  meiosis: Meiosis,
  'lac-operon': LacOperon,
  'cardiac-cycle': CardiacCycle,
  'gas-exchange': GasExchange,
  'nephron-filter': NephronFilter,
  'endocrine-feedback': EndocrineFeedback,
  'muscle-contraction': MuscleContraction,
  'immune-response': ImmuneResponse,
  'nutrition-digestion': NutritionDigestion,
  'transport-systems': TransportSystems,
  'ecology-ecosystems': EcologyEcosystems,

  'types-forces': TypesOfForces,
  'newton-laws': NewtonLaws,
  'velocity-accel': VelocityAccel,
  'wave-properties': WaveProperties,
  'doppler-effect': DopplerEffect,
  'double-slit': DoubleSlit,
  'optics-refraction': OpticsRefraction,
  'faraday-induction': FaradayInduction,
  'motor-effect': MotorEffect,
  transformers: Transformers,
  'kinematics-linear': KinematicsLinear,
  'properties-matter': PropertiesOfMatter,
  'heat-energy': HeatEnergy,
  'quantum-physics-studio': QuantumStudio,
  'energy-transfer-sankey': EnergyTransferSankey,
  'electricity-grid-simulator': ElectricityGridSimulator,

  'atomic-structure': AtomicStructure,
  'electron-config': ElectronConfig,
  'periodic-trends': PeriodicTrends,
  'mole-concept': MoleConcept,
  'limiting-reactants': LimitingReactants,
  'titration-curve': TitrationCurve,
  'energy-bonds': EnergyBonds,
  'hess-law': HessLaw,
  'entropy-spontaneity': EntropySpontaneity,
  'acids-bases-salts': AcidsBasesSalts,
  'states-matter-gas-laws': StatesOfMatterGasLaws,
  'separation-techniques': SeparationTechniques,
  'organic-chemistry-studio': OrganicChemStudio,
  'equilibrium-sandbox': EquilibriumSandbox,
  'redox-half-equation-builder': RedoxHalfEquationBuilder,

  'vars-expressions': VarsExpressions,
  'solve-linear': SolveLinear,
  'graph-linear': GraphLinear,
  'quadratic-explorer': QuadraticExplorer,
  'geometry-trigonometry': GeometryTrigonometry,
  'derivative-explorer': DerivativeExplorer,
  'integral-accumulator': IntegralAccumulator,
  'optimization-sandbox': OptimizationSandbox,
  'completing-square': CompletingSquare,
  'projectile-math': ProjectileMotionMath,
  'quadratic-formula': QuadraticFormula,
  'homeostasis-control-loop': HomeostasisControlLoop,
  'population-genetics-simulator': PopulationGeneticsSimulator,
  'respiration-energy-map': RespirationEnergyMap,
};
