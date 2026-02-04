import React from 'react';
import { WorldTheme } from '../services/themeRegistry';

interface WorldBackgroundProps {
    theme: WorldTheme;
    className?: string;
    active?: boolean;
}

export const WorldBackground: React.FC<WorldBackgroundProps> = ({ theme, className = '' }) => {
    return (
        <div className={`absolute inset-0 z-0 transition-all duration-1000 ease-in-out bg-gradient-to-br ${theme.colors.primary} ${theme.colors.secondary} ${className}`}>

            {/* Pattern Overlay */}
            <div
                className="absolute inset-0 opacity-20 bg-repeat transition-opacity duration-1000"
                style={{ backgroundImage: theme.assets.bgPattern }}
            ></div>

            {/* Dynamic Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none"></div>

            {/* Particles / Atmospherics */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-white/5 blur-[120px] rounded-full mix-blend-overlay animate-pulse"></div>
                <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-black/50 blur-[120px] rounded-full"></div>
            </div>

        </div>
    );
};
