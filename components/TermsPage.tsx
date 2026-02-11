import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TermsPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-lux-black text-white p-8 md:p-16">
            <button
                onClick={() => navigate('/')}
                className="mb-8 flex items-center gap-2 text-stone-400 hover:text-white transition-colors uppercase tracking-widest text-xs"
            >
                <ArrowLeft className="w-4 h-4" /> Torna alla Home
            </button>

            <div className="max-w-3xl mx-auto space-y-8">
                <div className="flex flex-col items-center mb-12">
                    <Shield className="w-12 h-12 text-lux-gold mb-4" />
                    <h1 className="text-4xl md:text-5xl font-display text-lux-gold text-center">Termini e Condizioni</h1>
                    <p className="text-stone-400 mt-2 uppercase tracking-widest text-xs">Ultimo aggiornamento: Febbraio 2026</p>
                </div>

                <section className="space-y-4 text-stone-300 leading-relaxed font-light border-l border-stone-800 pl-6">
                    <h2 className="text-2xl font-display text-white">1. Esclusione del Diritto di Recesso</h2>
                    <p>
                        Ai sensi dell'art. 59 del Codice del Consumo, <strong>IL DIRITTO DI RECESSO È ESCLUSO</strong> per la fornitura di contenuto digitale mediante supporto non materiale (download, streaming, accesso online) se l'esecuzione è iniziata con l'accordo espresso del consumatore e con la sua accettazione del fatto che in tal caso avrebbe perso il diritto di recesso.
                    </p>
                    <div className="bg-red-900/10 border border-red-900/30 p-4 rounded-sm text-red-200 text-sm">
                        ❗️ ATTENZIONE: Effettuando l'accesso alla piattaforma e visualizzando anche solo parzialmente i contenuti video o scaricando materiali, l'utente rinuncia esplicitamente a qualsiasi richiesta di rimborso.
                    </div>
                </section>

                <section className="space-y-4 text-stone-300 leading-relaxed font-light border-l border-stone-800 pl-6">
                    <h2 className="text-2xl font-display text-white">2. Proprietà Intellettuale e Uso Personale</h2>
                    <p>
                        Tutti i contenuti presenti su VOX AUREA (video, audio, testi, script) sono protetti da copyright. L'acquisto garantisce una <strong>licenza personale, non trasferibile e non esclusiva</strong>.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li>È SEVERAMENTE VIETATA la condivisione delle credenziali di accesso.</li>
                        <li>È SEVERAMENTE VIETATA la rivendita, distribuzione o pubblicazione dei materiali.</li>
                        <li>Il sistema di monitoraggio attivo rileverà accessi simultanei o sospetti, portando al blocco immediato e permanente dell'account senza preavviso né rimborso.</li>
                    </ul>
                </section>

                <section className="space-y-4 text-stone-300 leading-relaxed font-light border-l border-stone-800 pl-6">
                    <h2 className="text-2xl font-display text-white">3. Limitazione di Responsabilità</h2>
                    <p>
                        VOX AUREA fornisce contenuti formativi. I risultati non sono garantiti e dipendono dall'applicazione individuale delle strategie. L'azienda non è responsabile per decisioni di business prese sulla base delle informazioni fornite o per mancati guadagni.
                    </p>
                </section>

                <section className="space-y-4 text-stone-300 leading-relaxed font-light border-l border-stone-800 pl-6">
                    <h2 className="text-2xl font-display text-white">4. Legge Applicabile</h2>
                    <p>
                        Questi termini sono regolati dalla legge italiana. Per qualsiasi controversia è competente in via esclusiva il Foro di Milano.
                    </p>
                </section>

            </div>
        </div>
    );
};
