
import React, { useState } from 'react';
import { AlertTriangle, ArrowRight, RefreshCcw } from 'lucide-react';

const CODON_MAP: Record<string, string> = {
    'ATG': 'Start', 'AAA': 'Lys', 'GGC': 'Gly', 'TTC': 'Phe', 'TAG': 'Stop',
    'ATA': 'Ile', 'AAG': 'Lys', 'GGG': 'Gly', 'TTT': 'Phe', 'TAA': 'Stop'
};

const MutationSim: React.FC = () => {
    const originalSequence = "ATGAAAGGCTTC"; // Start - Lys - Gly - Phe
    const [sequence, setSequence] = useState(originalSequence.split(''));
    const [message, setMessage] = useState<string | null>(null);

    const translate = (seq: string[]) => {
        const str = seq.join('');
        const codons = [];
        for(let i=0; i<str.length; i+=3) {
            codons.push(str.substring(i, i+3));
        }
        return codons.map(c => CODON_MAP[c] || '???');
    };

    const originalProtein = translate(originalSequence.split(''));
    const currentProtein = translate(sequence);

    const handleMutate = (index: number) => {
        const bases = ['A', 'T', 'C', 'G'];
        const current = sequence[index];
        const next = bases[(bases.indexOf(current) + 1) % 4];
        
        const newSeq = [...sequence];
        newSeq[index] = next;
        setSequence(newSeq);

        // Analyze mutation
        const newProt = translate(newSeq);
        if (newProt.join('-') === originalProtein.join('-')) {
            setMessage("Silent Mutation: The protein sequence is unchanged.");
        } else if (newProt.includes('Stop') && !originalProtein.includes('Stop')) {
            setMessage("Nonsense Mutation: A premature STOP codon was created!");
        } else {
            setMessage("Missense Mutation: The amino acid sequence has changed.");
        }
    };

    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Mutation Visualizer</h3>
                <button onClick={() => { setSequence(originalSequence.split('')); setMessage(null); }} className="p-2 hover:bg-slate-800 rounded-full text-slate-400">
                    <RefreshCcw className="w-4 h-4" />
                </button>
            </div>

            <div className="flex-1 space-y-8">
                {/* DNA Strip */}
                <div>
                    <p className="text-xs text-slate-500 uppercase font-bold mb-2">DNA Sequence (Click base to mutate)</p>
                    <div className="flex flex-wrap gap-2">
                        {sequence.map((base, i) => (
                            <button 
                                key={i}
                                onClick={() => handleMutate(i)}
                                className={`w-10 h-12 rounded-lg font-mono text-lg font-bold border-b-4 transition-all active:scale-95 ${
                                    base !== originalSequence[i] ? 'bg-red-600 border-red-800 text-white animate-pulse' : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'
                                }`}
                            >
                                {base}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center">
                    <ArrowRight className="w-6 h-6 text-slate-600 rotate-90" />
                </div>

                {/* Protein Strip */}
                <div>
                    <p className="text-xs text-slate-500 uppercase font-bold mb-2">Protein Chain</p>
                    <div className="flex flex-wrap gap-2">
                        {currentProtein.map((aa, i) => (
                            <div 
                                key={i}
                                className={`px-4 py-2 rounded-full font-bold text-sm flex items-center justify-center shadow-lg transition-colors ${
                                    aa !== originalProtein[i] ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'
                                }`}
                            >
                                {aa}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Analysis Box */}
                {message && (
                    <div className={`p-4 rounded-xl border flex items-start gap-3 animate-fade-in ${
                        message.includes('Silent') ? 'bg-green-900/20 border-green-500/30 text-green-300' : 'bg-amber-900/20 border-amber-500/30 text-amber-300'
                    }`}>
                        <AlertTriangle className="w-5 h-5 shrink-0" />
                        <p className="text-sm">{message}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MutationSim;
