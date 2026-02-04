import { world1Content } from '../content/story/world1';
import { world2 } from '../content/story/world2';
import { world3 } from '../content/story/world3';
import { world4 } from '../content/story/world4';
import { world5 } from '../content/story/world5';
import { world6 } from '../content/story/world6';
import { world7 } from '../content/story/world7';
import { world8 } from '../content/story/world8';
import { world9 } from '../content/story/world9';
import { world10 } from '../content/story/world10';
import { podcastWorld1Content } from '../content/podcast/world1';
import { podcastWorld2Content } from '../content/podcast/world2';
import { podcastWorld3Content } from '../content/podcast/world3';
import { podcastWorld4Content } from '../content/podcast/world4';
import { podcastWorld5Content } from '../content/podcast/world5';
import { podcastWorld6Content } from '../content/podcast/world6';
import { podcastWorld7Content } from '../content/podcast/world7';
import { podcastWorld8Content } from '../content/podcast/world8';
import { podcastWorld9Content } from '../content/podcast/world9';
import { podcastWorld10Content } from '../content/podcast/world10';

export interface WorldTheme {
    id: string;
    name: string;
    subname: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        glow: string;
        border: string;
        text: string;
    };
    assets: {
        bgPattern: string;
        symbolIcon: string;
    };
    narrative: {
        intro: string;
        outro: string;
    };
    audio: {
        music: string;
        sfx: string;
    };
    modulesContent?: Array<{
        scene: { visual: string; };
        download: { title: string; content: string; };
        ritual: { title: string; action: string; task: string; feedback: string; output: string; };
        script: string;
    }>;
    download?: any;
    rituals?: any;
    script?: any;
}

export const WORLD_THEMES: WorldTheme[] = [
    {
        id: 'mondo_1',
        name: 'ORIGINE',
        subname: 'Prima della voce, c\'è il respiro.',
        colors: {
            primary: 'from-black',
            secondary: 'to-gray-900',
            accent: 'text-amber-500',
            glow: 'shadow-[0_0_60px_rgba(251,191,36,0.3)]',
            border: 'border-amber-600/40',
            text: 'text-stone-300'
        },
        assets: {
            bgPattern: "url('https://www.transparenttextures.com/patterns/black-mamba.png')",
            symbolIcon: 'circle-notch'
        },
        audio: {
            music: "Sub-bass drone, heartbeat rallentato",
            sfx: "Vetro nero che si rompe, campana tibetana processata"
        },
        ...world1Content
    },
    {
        id: 'mondo_2',
        name: 'PRESENZA',
        subname: 'La tua voce è il primo mondo che costruisci.',
        colors: {
            primary: 'from-violet-950',
            secondary: 'to-indigo-950',
            accent: 'text-fuchsia-300',
            glow: 'shadow-[0_0_50px_rgba(216,180,254,0.4)]',
            border: 'border-violet-500/40',
            text: 'text-violet-100'
        },
        assets: {
            bgPattern: "url('https://www.transparenttextures.com/patterns/notebook.png')",
            symbolIcon: 'eye'
        },
        audio: {
            music: "Archi scuri, marziali, bassi pesanti",
            sfx: "Pietra su pietra, mercurio liquido, gong profondo"
        },
        ...world2
    },
    {
        id: 'mondo_3',
        name: 'VISIONE',
        subname: 'I narratori vedono mondi prima che esistano.',
        colors: {
            primary: 'from-cyan-950',
            secondary: 'to-slate-900',
            accent: 'text-cyan-300',
            glow: 'shadow-[0_0_50px_rgba(34,211,238,0.4)]',
            border: 'border-cyan-500/40',
            text: 'text-cyan-100'
        },
        assets: {
            bgPattern: "url('https://www.transparenttextures.com/patterns/prism.png')",
            symbolIcon: 'eye'
        },
        audio: {
            music: "Synth cristallini, riverberi lunghi",
            sfx: "Vetro che canta, refrazioni sonore"
        },
        ...world3
    },
    {
        id: 'mondo_4',
        name: 'FREQUENZA',
        subname: 'La storia è un\'onda. Impara a cavalcarla.',
        colors: {
            primary: 'from-blue-950',
            secondary: 'to-indigo-900',
            accent: 'text-blue-300',
            glow: 'shadow-[0_0_50px_rgba(96,165,250,0.4)]',
            border: 'border-blue-500/40',
            text: 'text-blue-100'
        },
        assets: {
            bgPattern: "url('https://www.transparenttextures.com/patterns/sound-wave.png')",
            symbolIcon: 'activity' // Changed from waves to activity which is lucide valid usually
        },
        audio: {
            music: "Pad oceanici, ritmo fluido",
            sfx: "Onde, respiro, battito cardiaco"
        },
        ...world4
    },
    {
        id: 'mondo_5',
        name: 'ARCHETIPI',
        subname: 'Indossa le maschere degli dei.',
        colors: {
            primary: 'from-emerald-950',
            secondary: 'to-teal-900',
            accent: 'text-emerald-300',
            glow: 'shadow-[0_0_50px_rgba(52,211,153,0.4)]',
            border: 'border-emerald-500/40',
            text: 'text-emerald-100'
        },
        assets: {
            bgPattern: "url('https://www.transparenttextures.com/patterns/wood-pattern.png')",
            symbolIcon: 'users' // mask generic
        },
        audio: {
            music: "Tamburi tribali, flauti distanti",
            sfx: "Fuoco che crepita, passi nella foresta"
        },
        ...world5
    },
    {
        id: 'mondo_6',
        name: 'NARRATIVA TATTICA',
        subname: 'La strategia è l\'arte della guerra senza sangue.',
        colors: {
            primary: 'from-red-950',
            secondary: 'to-orange-950',
            accent: 'text-orange-500',
            glow: 'shadow-[0_0_50px_rgba(249,115,22,0.4)]',
            border: 'border-orange-500/40',
            text: 'text-orange-100'
        },
        assets: {
            bgPattern: "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')",
            symbolIcon: 'target'
        },
        audio: {
            music: "Percussioni militari, synth tesi",
            sfx: "Radar, target lock, metal impact"
        },
        ...world6
    },
    {
        id: 'mondo_7',
        name: 'EMPATIA STRATEGICA',
        subname: 'Connettersi è vincere.',
        colors: {
            primary: 'from-rose-950',
            secondary: 'to-pink-900',
            accent: 'text-rose-300',
            glow: 'shadow-[0_0_50px_rgba(251,113,133,0.4)]',
            border: 'border-rose-500/40',
            text: 'text-rose-100'
        },
        assets: {
            bgPattern: "url('https://www.transparenttextures.com/patterns/shattered-island.png')",
            symbolIcon: 'heart'
        },
        audio: {
            music: "Piano emozionale, archi caldi",
            sfx: "Battito lento, respiro vicino"
        },
        ...world7
    },
    {
        id: 'mondo_8',
        name: 'ASCENSIONE',
        subname: 'Oltre la tecnica, c\'è lo spirito.',
        colors: {
            primary: 'from-slate-100', // Invoking White/Pearl via high slate
            secondary: 'to-gray-200',
            accent: 'text-slate-600',  // Darker text for contrast on light or flip logic
            // Actually let's stick to dark mode base but with White Glows
            glow: 'shadow-[0_0_80px_rgba(255,255,255,0.6)]',
            border: 'border-white/60',
            text: 'text-white'
        },
        // Override colors for correct rendering in dark context
        assets: {
            bgPattern: "url('https://www.transparenttextures.com/patterns/stardust.png')",
            symbolIcon: 'cloud' // feather/wing
        },
        audio: {
            music: "Cori eterei, frequenze 963Hz",
            sfx: "Vento in quota, chime"
        },
        ...world8
    },
    {
        id: 'mondo_9',
        name: 'RIVELAZIONE',
        subname: 'La verità è l\'unica moneta.',
        colors: {
            primary: 'from-slate-900',
            secondary: 'to-black',
            accent: 'text-white', // Absolute White
            glow: 'shadow-[0_0_60px_rgba(255,255,255,0.8)]',
            border: 'border-white',
            text: 'text-white'
        },
        assets: {
            bgPattern: "url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')", // Mirror like
            symbolIcon: 'search' // or sparkle
        },
        audio: {
            music: "Silenzio attivo, high pitch glass",
            sfx: "Specchio rotto, laser cut"
        },
        ...world9
    },
    {
        id: 'mondo_10',
        name: 'MAESTRIA',
        subname: 'La storia è tua. Falla brillare.',
        colors: {
            primary: 'from-yellow-950', // Gold Base
            secondary: 'to-amber-900',
            accent: 'text-yellow-400',
            glow: 'shadow-[0_0_100px_rgba(250,204,21,0.6)]', // Solar Gold
            border: 'border-yellow-500',
            text: 'text-yellow-100'
        },
        assets: {
            bgPattern: "url('https://www.transparenttextures.com/patterns/gold-scale.png')",
            symbolIcon: 'sun' // crown
        },
        audio: {
            music: "Orchestra epica, finale trionfale",
            sfx: "Esplosione solare, metallo fuso"
        },
        ...world10
    }
];

export const PODCAST_THEMES: WorldTheme[] = [
    {
        id: 'pod_1', name: 'L’Eco Primordiale', subname: 'Acustica Psicoattiva',
        colors: { primary: 'from-violet-950', secondary: 'to-indigo-900', accent: 'text-cyan-400', glow: 'shadow-[0_0_50px_rgba(139,92,246,0.4)]', border: 'border-cyan-500/50', text: 'text-cyan-50' },
        assets: { bgPattern: "url('https://www.transparenttextures.com/patterns/sound-wave.png')", symbolIcon: 'waves' },
        audio: { music: "Droni bassi, pulsazioni lente a 60Hz", sfx: "Riverbero di cattedrale, sub-bass drop" },
        ...podcastWorld1Content
    },
    {
        id: 'pod_2', name: 'Hardware & Setup', subname: 'La Forgia del Suono',
        colors: { primary: 'from-slate-950', secondary: 'to-gray-900', accent: 'text-emerald-400', glow: 'shadow-[0_0_50px_rgba(16,185,129,0.4)]', border: 'border-emerald-500/50', text: 'text-emerald-50' },
        assets: { bgPattern: "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')", symbolIcon: 'mic' },
        audio: { music: "Elettronica minimale, precisione", sfx: "Click meccanici, switch, attivazione circuiti" },
        ...podcastWorld2Content
    },
    {
        id: 'pod_3', name: 'Sound Design Epico', subname: 'Architettura Sonora',
        colors: { primary: 'from-blue-950', secondary: 'to-sky-900', accent: 'text-amber-400', glow: 'shadow-[0_0_50px_rgba(251,191,36,0.4)]', border: 'border-amber-500/50', text: 'text-amber-50' },
        assets: { bgPattern: "url('https://www.transparenttextures.com/patterns/cubes.png')", symbolIcon: 'music' },
        audio: { music: "Orchestrale ibrido, cinema", sfx: "Impacts, risers potenti" },
        ...podcastWorld3Content
    },
    {
        id: 'pod_4', name: 'La Regia Invisibile', subname: 'Il Burattinaio',
        colors: { primary: 'from-indigo-950', secondary: 'to-purple-900', accent: 'text-fuchsia-400', glow: 'shadow-[0_0_50px_rgba(232,121,249,0.4)]', border: 'border-fuchsia-500/50', text: 'text-fuchsia-50' },
        assets: { bgPattern: "url('https://www.transparenttextures.com/patterns/diagmonds-light.png')", symbolIcon: 'eye' },
        audio: { music: "Misterioso, texture vocali", sfx: "Sussurri, vento" },
        ...podcastWorld4Content
    },
    {
        id: 'pod_5', name: 'Interviste Strategiche', subname: 'L’Arte della Domanda',
        colors: { primary: 'from-red-950', secondary: 'to-rose-900', accent: 'text-rose-400', glow: 'shadow-[0_0_50px_rgba(251,113,133,0.4)]', border: 'border-rose-500/50', text: 'text-rose-50' },
        assets: { bgPattern: "url('https://www.transparenttextures.com/patterns/hexellence.png')", symbolIcon: 'users' },
        audio: { music: "Jazz noir, contrabbasso", sfx: "Bicchiere che tintinna, fumo" },
        ...podcastWorld5Content
    },
    {
        id: 'pod_6', name: 'Montaggio Ritmico', subname: 'Il Battito della Storia',
        colors: { primary: 'from-orange-950', secondary: 'to-amber-900', accent: 'text-orange-400', glow: 'shadow-[0_0_50px_rgba(251,146,60,0.4)]', border: 'border-orange-500/50', text: 'text-orange-50' },
        assets: { bgPattern: "url('https://www.transparenttextures.com/patterns/zig-zag.png')", symbolIcon: 'scissors' },
        audio: { music: "Percussivo, drum & bass lento", sfx: "Forbici, nastro che scorre" },
        ...podcastWorld6Content
    },
    {
        id: 'pod_7', name: 'Distribuzione Globale', subname: 'L’Onda d’Urto',
        colors: { primary: 'from-teal-950', secondary: 'to-cyan-900', accent: 'text-teal-400', glow: 'shadow-[0_0_50px_rgba(45,212,191,0.4)]', border: 'border-teal-500/50', text: 'text-teal-50' },
        assets: { bgPattern: "url('https://www.transparenttextures.com/patterns/world-map.png')", symbolIcon: 'globe' },
        audio: { music: "Ambient futuristico, network", sfx: "Data stream, connessione" },
        ...podcastWorld7Content
    },
    {
        id: 'pod_8', name: 'Monetizzazione Audio', subname: 'L’Alchimia dell’Oro',
        colors: { primary: 'from-yellow-950', secondary: 'to-amber-950', accent: 'text-yellow-400', glow: 'shadow-[0_0_50px_rgba(250,204,21,0.4)]', border: 'border-yellow-500/50', text: 'text-yellow-50' },
        assets: { bgPattern: "url('https://www.transparenttextures.com/patterns/gold-scale.png')", symbolIcon: 'coins' },
        audio: { music: "Elegante, piano e archi", sfx: "Monete d'oro, casseforti" },
        ...podcastWorld8Content
    },
    {
        id: 'pod_9', name: 'AI Voice Cloning', subname: 'Il Nono Cerchio',
        colors: { primary: 'from-fuchsia-950', secondary: 'to-purple-950', accent: 'text-pink-500', glow: 'shadow-[0_0_50px_rgba(236,72,153,0.4)]', border: 'border-pink-500/50', text: 'text-pink-50' },
        assets: { bgPattern: "url('https://www.transparenttextures.com/patterns/circuit.png')", symbolIcon: 'cpu' },
        audio: { music: "Glitch, digitale distorto", sfx: "Voce robotica, errore sistema" },
        ...podcastWorld9Content
    },
    {
        id: 'pod_10', name: 'L’Eredità Sonora', subname: 'La Voce Eterna',
        colors: { primary: 'from-slate-950', secondary: 'to-black', accent: 'text-white', glow: 'shadow-[0_0_50px_rgba(255,255,255,0.4)]', border: 'border-white/50', text: 'text-white' },
        assets: { bgPattern: "url('https://www.transparenttextures.com/patterns/stardust.png')", symbolIcon: 'infinity' },
        audio: { music: "Solenne, coro finale", sfx: "Campana tibetana, vento" },
        ...podcastWorld10Content
    }
];

export const getThemeForMastermind = (index: number, courseId: string = 'matrice-1'): WorldTheme => {
    if (courseId === 'matrice-2') {
        const theme = PODCAST_THEMES[index % PODCAST_THEMES.length];
        return theme || PODCAST_THEMES[0];
    }
    const theme = WORLD_THEMES[index]; // Use Module Index directly, but safeguard
    return theme || WORLD_THEMES[0];
};
