/**
 * LabPage.tsx — Updated router for all biology virtual labs.
 * 
 * Registered routes:
 *   lab-cell-staining   → CellStainingLab
 *   lab-osmosis         → OsmosisLab
 *   lab-enzyme-temp     → EnzymeActivityLab
 *   lab-photosynthesis  → PhotosynthesisLab
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { labService } from '../services/labService';
import { AlertTriangle, ArrowLeft, FlaskConical } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

// Lab scene imports
import CellStainingLab from './virtual-labs/CellStainingLab';
import OsmosisLab from './virtual-labs/OsmosisLab';
import EnzymeActivityLab from './virtual-labs/EnzymeActivityLab';
import PhotosynthesisLab from './virtual-labs/PhotosynthesisLab';
import MitosisLab from './virtual-labs/MitosisLab';
import FoodTestsLab from './virtual-labs/FoodTestsLab';
import AtomicStructureLab from './virtual-labs/AtomicStructureLab';
import ChemicalBondingLab from './virtual-labs/ChemicalBondingLab';
import StoichiometryLab from './virtual-labs/StoichiometryLab';
import AcidsBasesLab from './virtual-labs/AcidsBasesLab';
import ElectrochemistryLab from './virtual-labs/ElectrochemistryLab';

// ─── Active lab IDs (update this as new labs ship) ────────────────────────────
const ACTIVE_LABS = new Set([
    'lab-cell-staining',
    'lab-osmosis',
    'lab-enzyme-temp',
    'lab-photosynthesis',
]);

// ─── Component ─────────────────────────────────────────────────────────────────

const LabPage: React.FC = () => {
    const { labId } = useParams<{ labId: string }>();
    const navigate = useNavigate();
    const { user } = useUser();

    const lab = labId ? labService.getLabById(labId) : undefined;

    // ── Auth / not-found guard ───────────────────────────────────────────────
    if (!lab || !user) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-slate-800">
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-4">Lab Access Denied</h1>
                <p className="text-slate-400 mb-8">
                    {user ? 'Lab module not found.' : 'You must be logged in to access the laboratory.'}
                </p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold flex items-center gap-2 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Go Back
                </button>
            </div>
        );
    }

    const sharedProps = { lab, studentId: user.username, onExit: () => navigate(-1) };

    // ── Lab router ───────────────────────────────────────────────────────────
    switch (labId) {
        case 'lab-cell-staining':
            return <CellStainingLab {...sharedProps} />;

        case 'lab-osmosis':
            return <OsmosisLab {...sharedProps} />;

        case 'lab-enzyme-temp':
            return <EnzymeActivityLab {...sharedProps} />;

        case 'lab-photosynthesis':
            return <PhotosynthesisLab {...sharedProps} />;

        case 'lab-mitosis':
            return <MitosisLab {...sharedProps} />;

        case 'lab-food-tests':
            return <FoodTestsLab {...sharedProps} />;

        // ── Chemistry Labs ──────────────────────────────────────────────────
        case 'lab-atomic-structure':
            return <AtomicStructureLab {...sharedProps} />;

        case 'lab-chemical-bonding':
            return <ChemicalBondingLab {...sharedProps} />;

        case 'lab-stoichiometry':
            return <StoichiometryLab {...sharedProps} />;

        case 'lab-acids-bases':
            return <AcidsBasesLab {...sharedProps} />;

        case 'lab-electrochemistry':
            return <ElectrochemistryLab {...sharedProps} />;

        default:
            // Lab exists in service but not yet implemented
            return (
                <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-8">
                    <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-slate-800">
                        <FlaskConical className="w-10 h-10 text-purple-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-3">{lab.title}</h1>
                    <p className="text-slate-400 mb-2">This lab is currently under development.</p>
                    <p className="text-slate-600 text-sm mb-8">Check back in the next update.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold flex items-center gap-2 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Return to Labs
                    </button>
                </div>
            );
    }
};

export default LabPage;