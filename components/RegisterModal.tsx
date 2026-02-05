import React from 'react';
import { X, Lock } from 'lucide-react';

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAction: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onAction }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-lux-black border border-lux-gold/30 rounded-2xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(250,204,21,0.2)] animate-[zoomIn_0.3s_ease-out]">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-lux-gold/10 flex items-center justify-center mx-auto mb-6 border border-lux-gold/30">
                        <Lock className="w-8 h-8 text-lux-gold" />
                    </div>

                    <h3 className="text-2xl font-display font-bold text-white mb-2">Accesso Riservato</h3>
                    <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                        L'accesso a Vox Lux è un privilegio riservato. Non ci sono iscrizioni aperte.<br /><br />L'unico modo per entrare è possedere una <strong>Matrice</strong>.
                    </p>

                    <div className="space-y-3">
                        <button
                            onClick={() => {
                                onClose();
                                onAction();
                            }}
                            className="w-full py-4 bg-lux-gold text-black font-bold uppercase tracking-widest text-sm rounded hover:bg-yellow-400 transition-colors shadow-[0_0_20px_rgba(250,204,21,0.4)]"
                        >
                            VISUALIZZA LE MATRICI
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
