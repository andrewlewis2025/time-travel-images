
import React from 'react';
import type { ProgressState } from '../types';

interface GeneratorControlsProps {
    onGenerate: () => void;
    progress: ProgressState;
    isGenerationDisabled: boolean;
    seed: string;
    onSeedChange: (value: string) => void;
}

export const GeneratorControls: React.FC<GeneratorControlsProps> = ({ onGenerate, progress, isGenerationDisabled, seed, onSeedChange }) => {
    return (
        <section className="bg-white/10 backdrop-blur rounded-3xl p-6 space-y-4 border border-white/10">
            <h2 className="text-xl font-semibold text-white">2. Generate Your Time-Travel Photos</h2>
             <div className="grid md:grid-cols-2 gap-4">
                <label className="flex flex-col gap-2">
                    <span className="text-sm text-slate-200">Seed (optional)</span>
                    <input 
                        id="seedInput" 
                        type="number" 
                        min="0" 
                        placeholder="Leave blank for random" 
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-500" 
                        value={seed}
                        onChange={(e) => onSeedChange(e.target.value)}
                    />
                </label>
                 <div className="text-sm text-slate-400 bg-slate-900/50 p-3 rounded-xl border border-white/10">
                     Your Google AI Studio API key is securely accessed from your environment variables. You don't need to enter it here.
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
                <button
                    id="generateBtn"
                    onClick={onGenerate}
                    disabled={isGenerationDisabled || progress.isLoading}
                    className="px-6 py-3 rounded-full bg-fuchsia-500 text-slate-900 text-lg font-semibold shadow-lg hover:bg-fuchsia-400 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    {progress.isLoading ? 'Generating...' : 'Generate 5 Looks'}
                </button>
                {progress.isLoading && (
                    <div className="flex-1">
                        <div className="w-full bg-white/10 rounded-full overflow-hidden h-2">
                            <div
                                id="progressBar"
                                className="h-full bg-fuchsia-500 transition-all duration-300"
                                style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                            ></div>
                        </div>
                        <p id="progressText" className="mt-2 text-sm text-slate-200">
                            {progress.label} ({progress.completed}/{progress.total})
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};
