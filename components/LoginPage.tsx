import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BRANDING } from '../config/branding';
import { LoginSchema } from '../types';

export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const validation = LoginSchema.safeParse({ email, password });
        if (!validation.success) {
            setError(validation.error.issues[0].message);
            setLoading(false);
            return;
        }

        const result = await login(email, password);

        if (result.success) {
            // Attempt to activate any pending purchases for this email
            try {
                await fetch('/api/activate-purchase', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: email,
                        userId: result.userId
                    })
                });
            } catch (e) {
                console.warn('Silent activation check failed:', e);
            }

            navigate('/dashboard');
        } else {
            setError(result.error || 'Login failed');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Login Form Container */}
            <div className="w-full max-w-md relative z-10">
                {/* Logo/Title */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-black mb-3 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600 bg-clip-text text-transparent tracking-wider">
                        {BRANDING.shortName}
                    </h1>
                    <p className="text-gray-400 text-sm italic">{BRANDING.tagline}</p>
                </div>

                {/* Glassmorphism Card */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">Accedi al Portale</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                                placeholder="tua@email.com"
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-500 hover:to-amber-400 text-black font-bold rounded-lg shadow-lg shadow-yellow-500/30 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Accesso in corso...' : 'ENTRA'}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-6 text-center space-y-3">
                        <button
                            onClick={() => navigate('/reset-password')}
                            className="text-sm text-gray-400 hover:text-yellow-500 transition-colors"
                        >
                            Password dimenticata?
                        </button>

                        <div className="text-sm text-gray-500">
                            Accesso riservato ai membri.
                        </div>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <button
                        onClick={() => navigate('/')}
                        className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                    >
                        ← Torna alla Home
                    </button>
                </div>
            </div>
        </div>
    );
};
