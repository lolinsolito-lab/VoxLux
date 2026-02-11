import React from 'react';

export const Footer: React.FC = () => {
    return (
        <div className="text-center opacity-90">
            <p className="text-[10px] uppercase tracking-widest text-lux-gold">
                Vox Aurea © 2026 • <a href="/privacy" className="hover:text-white transition-colors">Privacy</a> • <a href="/terms" className="hover:text-white transition-colors">Termini e Condizioni</a>
            </p>
        </div>
    );
};
