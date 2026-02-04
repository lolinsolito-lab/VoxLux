import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Mail, Lock, User, Sparkles } from 'lucide-react';

interface LoginProps {
    onSuccess: () => void;
    initialMode?: 'login' | 'register';
}

export const Login: React.FC<LoginProps> = ({ onSuccess, initialMode = 'login' }) => {
    const { login, register } = useAuth();
    const [mode, setMode] = useState<'login' | 'register'>(initialMode);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('matrice-1');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (mode === 'login') {
                const success = await login(email, password);
                if (success) {
                    onSuccess();
                } else {
                    setError('Invalid credentials. Please try again.');
                }
            } else {
                if (!name.trim()) {
                    setError('Please enter your name.');
                    setLoading(false);
                    return;
                }
                const success = await register(name, email, password, selectedCourse);
                if (success) {
                    onSuccess();
                } else {
                    setError('Email already registered. Please login instead.');
                }
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-lux-black text-gray-200 flex items-center justify-center overflow-hidden relative">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-lux-navy via-lux-black to-lux-black opacity-90"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
            <div className="particles"></div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md mx-4">
                <div className="bg-lux-navy/80 backdrop-blur-lg border border-lux-gold/20 rounded-lg p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-block mb-4 animate-float">
                            <Shield className="w-12 h-12 text-lux-gold drop-shadow-[0_0_15px_rgba(228,197,114,0.5)]" />
                        </div>
                        <h1 className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-lux-gold via-lux-goldDim to-lux-goldDark mb-2">
                            {mode === 'login' ? 'Access Portal' : 'Begin Ascension'}
                        </h1>
                        <p className="text-sm text-gray-400 italic">
                            {mode === 'login' ? 'Enter your credentials to continue' : 'Create your account to unlock the matrices'}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {mode === 'register' && (
                            <div>
                                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-lux-black border border-lux-gold/30 rounded pl-10 pr-4 py-3 text-white focus:border-lux-gold focus:outline-none transition-colors"
                                        placeholder="Michael Jara"
                                        required={mode === 'register'}
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-lux-black border border-lux-gold/30 rounded pl-10 pr-4 py-3 text-white focus:border-lux-gold focus:outline-none transition-colors"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-lux-black border border-lux-gold/30 rounded pl-10 pr-4 py-3 text-white focus:border-lux-gold focus:outline-none transition-colors"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {mode === 'register' && (
                            <div>
                                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Select Your Path</label>
                                <div className="space-y-2">
                                    {[
                                        { id: 'matrice-1', name: 'Matrice I - Storytelling Strategy', price: '€497' },
                                        { id: 'matrice-2', name: 'Matrice II - Vox Podcast Master', price: '€497' },
                                        { id: 'ascension-box', name: 'Ascension Box - Ultimate Combo', price: '€997' }
                                    ].map((course) => (
                                        <label
                                            key={course.id}
                                            className={`flex items-center justify-between p-3 border rounded cursor-pointer transition-all ${selectedCourse === course.id
                                                    ? 'border-lux-gold bg-lux-gold/10'
                                                    : 'border-lux-gold/20 hover:border-lux-gold/50 bg-transparent'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name="course"
                                                    value={course.id}
                                                    checked={selectedCourse === course.id}
                                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                                    className="text-lux-gold focus:ring-lux-gold"
                                                />
                                                <div>
                                                    <div className="text-sm font-medium text-white">{course.name}</div>
                                                </div>
                                            </div>
                                            <span className="text-xs text-lux-gold font-bold">{course.price}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-900/20 border border-red-500/50 rounded p-3 text-red-300 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-lux-goldDim to-lux-gold text-lux-black font-bold py-3 rounded uppercase tracking-wider hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Sparkles className="w-4 h-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                mode === 'login' ? 'Enter Portal' : 'Begin Journey'
                            )}
                        </button>
                    </form>

                    {/* Toggle Mode */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                            className="text-sm text-gray-400 hover:text-lux-gold transition-colors"
                        >
                            {mode === 'login' ? (
                                <>Don't have an account? <span className="text-lux-gold font-bold">Sign Up</span></>
                            ) : (
                                <>Already have an account? <span className="text-lux-gold font-bold">Login</span></>
                            )}
                        </button>
                    </div>
                </div>

                {/* Footer Note */}
                <p className="text-center text-xs text-gray-600 mt-6 italic">
                    For demo purposes, all registrations are stored locally in your browser.
                </p>
            </div>
        </div>
    );
};
