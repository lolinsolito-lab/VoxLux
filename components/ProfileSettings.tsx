import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Loader, User, Phone, Globe, FileText } from 'lucide-react';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ProfileData {
    full_name: string;
    surname: string;
    phone_number: string;
    website: string;
    bio: string;
}

interface ProfileSettingsProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ isOpen, onClose }) => {
    const { user, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<ProfileData>({
        full_name: '',
        surname: '',
        phone_number: '',
        website: '',
        bio: ''
    });

    const loadedRef = useRef(false);

    useEffect(() => {
        if (isOpen && user && !loadedRef.current) {
            loadedRef.current = true;
            loadProfile();
        }
        if (!isOpen) {
            loadedRef.current = false;
        }
    }, [isOpen]);

    const loadProfile = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('full_name, surname, phone_number, website, bio')
                .eq('id', user.id)
                .single();

            if (error) throw error;

            setProfile({
                full_name: data.full_name || '',
                surname: data.surname || '',
                phone_number: data.phone_number || '',
                website: data.website || '',
                bio: data.bio || ''
            });
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!user) return;

        setSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: profile.full_name,
                    surname: profile.surname,
                    phone_number: profile.phone_number,
                    website: profile.website,
                    bio: profile.bio,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (error) throw error;

            await refreshUser();
            onClose();
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Errore durante il salvataggio');
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        loadedRef.current = false;
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={handleClose}
        >
            <div
                className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                    <h2 className="text-xl font-black text-white tracking-tight">
                        PROFILO PERSONALE
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader className="animate-spin text-red-600" size={32} />
                        </div>
                    ) : (
                        <>
                            {/* Name */}
                            <div>
                                <label className="flex items-center text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                                    <User size={14} className="mr-2" />
                                    Nome
                                </label>
                                <input
                                    type="text"
                                    value={profile.full_name}
                                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl py-3 px-4 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-900/50"
                                    placeholder="Il tuo nome"
                                />
                            </div>

                            {/* Surname */}
                            <div>
                                <label className="flex items-center text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                                    <User size={14} className="mr-2" />
                                    Cognome
                                </label>
                                <input
                                    type="text"
                                    value={profile.surname}
                                    onChange={(e) => setProfile({ ...profile, surname: e.target.value })}
                                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl py-3 px-4 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-900/50"
                                    placeholder="Il tuo cognome"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="flex items-center text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                                    <Phone size={14} className="mr-2" />
                                    Telefono
                                </label>
                                <input
                                    type="tel"
                                    value={profile.phone_number}
                                    onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl py-3 px-4 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-900/50"
                                    placeholder="+39 123 456 7890"
                                />
                            </div>

                            {/* Website */}
                            <div>
                                <label className="flex items-center text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                                    <Globe size={14} className="mr-2" />
                                    Sito Web
                                </label>
                                <input
                                    type="url"
                                    value={profile.website}
                                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl py-3 px-4 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-900/50"
                                    placeholder="https://tuosito.com"
                                />
                            </div>

                            {/* Bio */}
                            <div>
                                <label className="flex items-center text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                                    <FileText size={14} className="mr-2" />
                                    Biografia
                                </label>
                                <textarea
                                    value={profile.bio}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    rows={4}
                                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl py-3 px-4 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-900/50 resize-none"
                                    placeholder="Racconta qualcosa di te..."
                                />
                            </div>


                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-zinc-800 bg-black/30">
                    <button
                        onClick={handleClose}
                        className="px-6 py-2.5 text-zinc-400 hover:text-white font-bold transition-colors"
                    >
                        Annulla
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-all disabled:opacity-50"
                    >
                        {saving ? (
                            <Loader className="animate-spin" size={18} />
                        ) : (
                            <Save size={18} />
                        )}
                        Salva
                    </button>
                </div>
            </div>
        </div>
    );
};
