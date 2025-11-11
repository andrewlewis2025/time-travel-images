
import React from 'react';

export const HowItWorks: React.FC = () => (
  <section className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4 text-sm text-slate-200">
    <h2 className="text-lg font-semibold text-fuchsia-300">How it works</h2>
    <ol className="list-decimal list-inside space-y-2 text-slate-300">
      <li>Upload a single portrait. An automatic mask protects the subject's face and body.</li>
      <li>Click generate. The app calls the Gemini model five times, once for each decade.</li>
      <li>Each preset updates hair, clothing, and background while preserving the subject's identity, pose, and proportions.</li>
      <li>Download your five new looks as a ZIP file, or save them individually from the gallery.</li>
    </ol>
  </section>
);
