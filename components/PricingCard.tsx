import React from 'react';
import { Sparkles, Mic, Unlock, CheckCircle } from 'lucide-react';

interface PricingCardProps {
    id: string;
    type: 'sun' | 'moon';
    title: React.ReactNode;
    subtitle: string;
    description: string;
    features: string[];
    price: string;
    priceFull: string;
    onEnter: (id: string) => void;
    onHover?: () => void;
    isDesktop?: boolean;
}

export const PricingCard: React.FC<PricingCardProps> = ({
    id,
    type,
    title,
    subtitle,
    description,
    features,
    price,
    priceFull,
    onEnter,
    onHover,
    isDesktop = false
}) => {
    const isSun = type === 'sun';

    // Theme configuration
    const theme = isSun ? {
        border: "border-yellow-500/20 hover:border-yellow-300",
        shadowHover: "hover:shadow-[0_0_80px_rgba(250,204,21,0.4)]",
        iconColor: "text-yellow-500",
        iconHover: "group-hover:text-yellow-100",
        iconBg: "group-hover:bg-yellow-500/10",
        gradientText: "from-yellow-100 to-yellow-600",
        gradientHover: "group-hover:from-white group-hover:to-yellow-300",
        subTextColor: "text-yellow-600 group-hover:text-yellow-300",
        buttonBorder: "border-yellow-900/30 text-yellow-600 group-hover:text-black group-hover:bg-yellow-400",
        buttonShadow: "shadow-[0_0_20px_rgba(250,204,21,0.1)] group-hover:shadow-[0_0_40px_rgba(250,204,21,0.5)]",
        mobileBorder: "border-yellow-500/50",
        mobileShadow: "shadow-[0_0_40px_rgba(250,204,21,0.2)]",
        mobileIconShadow: "shadow-[0_0_60px_rgba(250,204,21,0.5)]",
        featureIcon: "text-yellow-500"
    } : {
        border: "border-stone-700 hover:border-white",
        shadowHover: "hover:shadow-[0_0_80px_rgba(255,255,255,0.3)]",
        iconColor: "text-stone-500",
        iconHover: "group-hover:text-white",
        iconBg: "group-hover:bg-white/10",
        gradientText: "from-stone-200 to-stone-600",
        gradientHover: "group-hover:from-white group-hover:to-stone-300",
        subTextColor: "text-stone-500 group-hover:text-white",
        buttonBorder: "border-stone-800 text-stone-500 group-hover:text-white group-hover:border-white/80 group-hover:bg-white/5",
        buttonShadow: "shadow-[0_0_20px_rgba(255,255,255,0.05)] group-hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]",
        mobileBorder: "border-stone-500/60",
        mobileShadow: "shadow-[0_0_40px_rgba(255,255,255,0.2)]",
        mobileIconShadow: "shadow-[0_0_50px_rgba(255,255,255,0.3)]",
        featureIcon: "text-stone-400"
    };

    const Icon = isSun ? Sparkles : Mic;

    // Feature List Component
    const FeatureList = () => (
        <ul className="w-full text-left space-y-3 mb-8 px-4">
            {features.map((feature, i) => (
                <li key={i} className={`flex items-start gap-2 text-xs ${isSun ? 'text-yellow-100/80' : 'text-stone-300'} font-medium`}>
                    <CheckCircle className={`w-4 h-4 min-w-[16px] ${theme.featureIcon}`} />
                    <span>{feature}</span>
                </li>
            ))}
        </ul>
    );

    // Desktop
    if (isDesktop) {
        return (
            <div
                onClick={() => onEnter(id)}
                onMouseEnter={onHover}
                className={`group relative rounded-lg overflow-hidden flex flex-col pt-12 pb-8 px-6 items-center text-center transition-all duration-700 ease-out hover:scale-105 cursor-pointer bg-black ${theme.border} ${theme.shadowHover}`}
            >
                {/* Background Effects */}
                <div className="absolute inset-0 opacity-30 group-hover:opacity-100 transition-opacity duration-700">
                    {isSun ? (
                        <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_340deg,#facc15_360deg)] animate-[spin_6s_linear_infinite] blur-xl opacity-20"></div>
                    ) : (
                        <>
                            <div className="absolute top-[10%] left-[10%] w-[80%] h-[80%] border-t-2 border-r-2 border-white/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
                            <div className="absolute top-[15%] left-[15%] w-[70%] h-[70%] border-b-2 border-l-2 border-white/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                        </>
                    )}
                    <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] ${isSun ? 'from-yellow-500/10' : 'from-stone-800/40'} via-black to-black`}></div>
                    {isSun && <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-60 animate-pulse text-yellow-200"></div>}
                </div>

                <div className="relative z-10 flex flex-col h-full items-center w-full">
                    <div className={`w-20 h-20 rounded-full border ${isSun ? 'border-yellow-500/40' : 'border-stone-600'} flex items-center justify-center bg-black/60 mb-6 ${theme.iconBg} group-hover:scale-110 transition-all duration-500 shadow-[0_0_30px_rgba(250,204,21,0.1)] ${isSun ? 'group-hover:shadow-[0_0_60px_rgba(250,204,21,0.6)]' : 'group-hover:shadow-[0_0_50px_rgba(255,255,255,0.6)]'} relative overflow-hidden`}>
                        <div className={`absolute inset-0 ${isSun ? 'bg-yellow-400/10' : 'bg-white/0 group-hover:bg-white/20'} blur-md animate-pulse`}></div>
                        <Icon className={`w-8 h-8 ${theme.iconColor} ${theme.iconHover} transition-colors relative z-10 ${isSun ? 'animate-[spin_8s_linear_infinite]' : 'animate-[pulse_4s_infinite]'}`} />
                    </div>

                    <h3 className={`text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b ${theme.gradientText} mb-2 ${theme.gradientHover} transition-all drop-shadow-lg leading-tight min-h-[64px] flex items-center justify-center`}>{title}</h3>
                    <p className={`text-[9px] uppercase tracking-[0.3em] ${theme.subTextColor} mb-6 transition-colors font-bold`}>{subtitle}</p>

                    <p className={`text-stone-400 text-xs leading-relaxed mb-6 px-2 ${isSun ? 'group-hover:text-yellow-100/90' : 'group-hover:text-stone-300'} transition-colors italic`}>
                        "{description}"
                    </p>

                    {/* Features List */}
                    <FeatureList />

                    <div className="mt-auto w-full">
                        <div className="mb-4 flex flex-col items-center">
                            <span className={`${isSun ? 'text-lux-gold' : 'text-stone-300'} text-3xl font-bold`}>{price}</span>
                            <span className="text-stone-500 text-xs line-through">{priceFull}</span>
                        </div>

                        <button className={`w-full py-3 border ${theme.buttonBorder} transition-all text-xs tracking-[0.15em] font-bold uppercase flex items-center justify-center gap-2 rounded-sm ${theme.buttonShadow}`}>
                            <Unlock className="w-3 h-3" /> ACQUISTA ORA
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Mobile View
    return (
        <div
            onClick={() => onEnter(id)}
            className={`relative w-full max-w-[340px] mx-auto min-h-[520px] rounded-2xl overflow-hidden flex flex-col border ${theme.mobileBorder} bg-lux-navy/80 backdrop-blur-xl ${theme.mobileShadow}`}
        >
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-100 pointer-events-none">
                {isSun ? (
                    <>
                        <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_340deg,#facc15_360deg)] animate-[spin_10s_linear_infinite] blur-3xl opacity-40"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-900/40 via-black/80 to-black"></div>
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-80 animate-pulse text-yellow-200"></div>
                    </>
                ) : (
                    <>
                        <div className="absolute top-[5%] left-[5%] w-[90%] h-[90%] border-t-2 border-r-2 border-white/40 rounded-full animate-[spin_10s_linear_infinite] shadow-[0_0_30px_rgba(255,255,255,0.2)]"></div>
                        <div className="absolute top-[10%] left-[10%] w-[80%] h-[80%] border-b-2 border-l-2 border-white/30 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-stone-800/70 via-black to-black"></div>
                    </>
                )}
            </div>

            <div className="relative z-10 flex flex-col h-full items-center py-8 px-6">
                {/* Icon */}
                <div className={`w-20 h-20 rounded-full border ${isSun ? 'border-yellow-500/80 bg-yellow-500/10' : 'border-stone-400/80 bg-white/5'} flex items-center justify-center mb-4 ${theme.mobileIconShadow} relative overflow-visible mt-2`}>
                    {isSun ? <div className="absolute inset-0 bg-yellow-400/30 blur-2xl animate-[pulse_2s_infinite]"></div> : <div className="absolute inset-0 rounded-full bg-white/20 animate-[ping_3s_infinite]"></div>}
                    <Icon className={`w-10 h-10 ${isSun ? 'text-yellow-300 animate-[spin_4s_linear_infinite]' : 'text-white animate-[pulse_2s_infinite]'} relative z-10`} />
                </div>

                <div className="flex flex-col items-center w-full">
                    <h3 className={`text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b ${isSun ? 'from-yellow-50 to-yellow-500' : 'from-stone-100 to-stone-500'} mb-2 drop-shadow-xl leading-tight text-center`}>{title}</h3>
                    <p className={`text-[10px] uppercase tracking-[0.4em] ${isSun ? 'text-yellow-500' : 'text-stone-300'} mb-6 font-bold border-b ${isSun ? 'border-yellow-500/30' : 'border-stone-500/50'} pb-2`}>{subtitle}</p>

                    {/* Features List Mobile */}
                    <FeatureList />
                </div>

                <div className="mt-auto w-full">
                    <div className="mb-4 flex flex-col items-center">
                        <span className={`${isSun ? 'text-lux-gold' : 'text-stone-300'} text-3xl font-bold`}>{price}</span>
                        <span className="text-stone-500 text-xs line-through">{priceFull}</span>
                    </div>

                    <button className={`w-full py-4 border ${isSun ? 'border-yellow-500/50 text-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20' : 'border-stone-600/50 text-stone-300 bg-white/10 hover:bg-white/20'} transition-all text-xs tracking-[0.25em] font-bold uppercase flex items-center justify-center gap-2 rounded-sm shadow-[0_0_20px_rgba(255,255,255,0.2)]`}>
                        <Unlock className="w-3 h-3" /> {isSun ? 'Ignite' : 'Materialize'}
                    </button>
                </div>
            </div>
        </div>
    );
};
