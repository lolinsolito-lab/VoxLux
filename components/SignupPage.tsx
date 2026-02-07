import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BRANDING } from '../config/branding';
import { SignupSchema } from '../types';

export const SignupPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { signup } = useAuth();

    const prefilledEmail = searchParams.get('email') || '';

    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState(prefilledEmail);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [tcAccepted, setTcAccepted] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        // Validation
        if (password !== confirmPassword) {
            setError('Le password non corrispondono');
            return;
        }

        const validation = SignupSchema.safeParse({
            email,
            password,
            fullName,
            phone: phone || undefined, // Send undefined if empty string
            tcAccepted
        });

        if (!validation.success) {
            setError(validation.error.issues[0].message);
            return;
        }

        setLoading(true);

        const result = await signup(email, password, fullName, phone);

        if (result.success) {
            // Call activate-purchase Edge Function to link any pending purchases
            try {
                // Call local Vercel API (avoids CORS issues)
                const response = await fetch('/api/activate-purchase', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email.toLowerCase(),
                        userId: result.userId
                    })
                });

                if (!response.ok) {
                    console.error('Failed to activate purchases:', await response.text());
                } else {
                    console.log('Purchases activated successfully');
                }
            } catch (error) {
                console.error('Error activating purchases:', error);
                // Don't block signup if activation fails
            }

            navigate('/onboarding');
        } else {
            setError(result.error || 'Registrazione fallita');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Signup Form Container */}
            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-black mb-3 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600 bg-clip-text text-transparent tracking-wider">
                        {BRANDING.shortName}
                    </h1>
                    <p className="text-gray-400 text-sm italic">Inizia la tua ascensione</p>
                </div>

                {/* Glassmorphism Card */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">Crea il tuo Account</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Nome Completo
                            </label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                                placeholder="Mario Rossi"
                            />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Telefono (WhatsApp)
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                                placeholder="+39 333 1234567"
                            />
                        </div>

                        {/* Email */}
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

                        {/* Password */}
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

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Conferma Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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

                        {/* Terms Notice */}
                        {/* Terms Notice with Checkbox */}
                        <div className="flex items-center space-x-3 justify-center">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={tcAccepted}
                                onChange={(e) => setTcAccepted(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-600 text-yellow-500 focus:ring-yellow-500 bg-black/40"
                            />
                            <label htmlFor="terms" className="text-xs text-gray-500">
                                Accetto i{' '}
                                <a href="/terms" target="_blank" className="text-yellow-500 hover:text-yellow-400 underline">
                                    Termini di Servizio
                                </a>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-500 hover:to-amber-400 text-black font-bold rounded-lg shadow-lg shadow-yellow-500/30 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creazione account...' : 'REGISTRATI'}
                        </button>
                    </form>

                    {/* Footer Link */}
                    <div className="mt-6 text-center text-sm text-gray-500">
                        Hai già un account?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-yellow-500 hover:text-yellow-400 font-semibold transition-colors"
                        >
                            Accedi
                        </button>
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
