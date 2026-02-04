import React from 'react';

interface VoxLuxLogoProps {
    className?: string;
    primaryColor?: string; // Hexagon Border
    secondaryColor?: string; // Inner Star
}

export const VoxLuxLogo: React.FC<VoxLuxLogoProps> = ({
    className = "w-24 h-24",
    primaryColor = "currentColor",
    secondaryColor = "currentColor"
}) => {
    return (
        <svg
            viewBox="0 0 100 100"
            className={className}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* 1. Rounded Hexagon Border */}
            {/* Points for a hexagon: (50, 5), (95, 27.5), (95, 72.5), (50, 95), (5, 72.5), (5, 27.5) */}
            <path
                d="M50 8 L88 28 V72 L50 92 L12 72 V28 L50 8Z"
                stroke={primaryColor}
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]"
            />

            {/* 2. Inner Sparkle (4-Point Star) */}
            {/* Center at 50,50. Points: Top(50,30), Right(70,50), Bottom(50,70), Left(30,50) */}
            {/* Using curves to make it sharp/stylish like the reference */}
            <path
                d="M50 25 C52 40 55 45 65 48 C75 50 75 50 75 50 C75 50 75 50 65 52 C55 55 52 60 50 75 C48 60 45 55 35 52 C25 50 25 50 25 50 C25 50 25 50 35 48 C45 45 48 40 50 25Z"
                fill={secondaryColor}
                className="drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] animate-pulse"
            />

            {/* 3. The Small Dot (Satellite) */}
            <circle cx="35" cy="65" r="3" fill={secondaryColor} className="animate-ping" />
        </svg>
    );
};
