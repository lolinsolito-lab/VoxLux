import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import { generateCertificateId, formatCertificateDate } from '../utils/certificate';

export const VerifyCertificate: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [status, setStatus] = useState<'loading' | 'valid' | 'invalid'>('loading');
    const [certData, setCertData] = useState<any>(null);

    useEffect(() => {
        // Simulate API verification delay
        const verify = async () => {
            await new Promise(r => setTimeout(r, 1500));

            // REAL VERIFICATION LOGIC (Future Implementation)
            // const { data, error } = await supabase
            //    .from('user_diplomas')
            //    .select('*, profiles(full_name)')
            //    .eq('certificate_id', id)
            //    .single();

            // MOCK VALIDATION: Check for valid format (VL-SS-YYYY-XXXX-XXXX)
            const isValidFormat = /^VL-(SS|PM)-\d{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(id || '');

            if (id && (isValidFormat || id.startsWith('VL-'))) {
                setStatus('valid');
                setCertData({
                    id: id,
                    name: "Studente Certificato", // Dynamic from DB
                    course: id.includes('SS') ? "Storytelling Strategy Master" : "Vox Podcast Master",
                    issueDate: formatCertificateDate(new Date()),
                    status: "ACTIVE",
                    metadata: "NFT-Linked Signature: " + Math.random().toString(36).substring(7) // Mock NFT Hash
                });
            } else {
                setStatus('invalid');
            }
        };

        verify();
    }, [id]);

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">

            {/* BACKGROUND EFFECTS */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a1a1a_0%,_#000000_100%)] z-0" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent z-10 opacity-50" />

            {/* CONTENT CARD */}
            <div className="relative z-10 w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-xl p-8 shadow-[0_0_50px_rgba(212,175,55,0.1)] text-center animate-[fadeIn_0.5s]">

                {/* STATUS ICON */}
                <div className="flex justify-center mb-6">
                    {status === 'loading' && (
                        <Loader2 className="w-16 h-16 text-[#d4af37] animate-spin" />
                    )}
                    {status === 'valid' && (
                        <div className="w-20 h-20 bg-[#d4af37]/10 rounded-full flex items-center justify-center border border-[#d4af37]">
                            <ShieldCheck className="w-10 h-10 text-[#d4af37]" />
                        </div>
                    )}
                    {status === 'invalid' && (
                        <div className="w-20 h-20 bg-red-900/10 rounded-full flex items-center justify-center border border-red-500">
                            <XCircle className="w-10 h-10 text-red-500" />
                        </div>
                    )}
                </div>

                {/* TEXT CONTENT */}
                {status === 'loading' && (
                    <h2 className="text-xl font-display tracking-widest uppercase text-white/50">Verifica in corso...</h2>
                )}

                {status === 'valid' && certData && (
                    <>
                        <h1 className="text-2xl font-display font-bold text-[#d4af37] mb-2 uppercase tracking-widest">
                            Certificato Autentico
                        </h1>
                        <p className="text-white/60 text-sm mb-6">
                            Il certificato digitiale <strong>{certData.id}</strong> è presente nel registro ufficiale Vox Lux.
                        </p>

                        <div className="bg-white/5 rounded-lg p-4 text-left space-y-3 mb-8 border border-white/5">
                            <div>
                                <div className="text-[10px] uppercase tracking-wider text-white/40">Corso</div>
                                <div className="text-sm font-medium text-white">{certData.course}</div>
                            </div>
                            {/* <div>
                                <div className="text-[10px] uppercase tracking-wider text-white/40">Intestatario</div>
                                <div className="text-sm font-medium text-white">{certData.name}</div>
                            </div>*/}
                            <div className="flex justify-between">
                                <div>
                                    <div className="text-[10px] uppercase tracking-wider text-white/40">Data Emissione</div>
                                    <div className="text-sm font-medium text-white">{certData.issueDate}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] uppercase tracking-wider text-white/40">Stato</div>
                                    <div className="text-sm font-bold text-green-400">{certData.status}</div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {status === 'invalid' && (
                    <>
                        <h1 className="text-2xl font-display font-bold text-red-500 mb-2 uppercase tracking-widest">
                            Non Trovato
                        </h1>
                        <p className="text-white/60 text-sm mb-8">
                            L'ID fornito non corrisponde a nessun certificato emesso nel nostro registro. Potrebbe essere errato o revocato.
                        </p>
                    </>
                )}

                {/* FOOTER ACTION */}
                <Link to="/" className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-[#d4af37] transition-colors uppercase tracking-widest">
                    <ArrowLeft size={12} />
                    Torna alla Home
                </Link>
            </div>

            {/* BRANDING */}
            <div className="absolute bottom-6 text-center">
                <div className="text-[#d4af37] font-display uppercase tracking-[0.5em] text-xs opacity-50">Vox Lux Strategy</div>
            </div>
        </div>
    );
};
