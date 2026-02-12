import React, { useState } from 'react';
import { LegalModal } from './LegalModal';
import { Shield, Lock, Cookie, FileText, Scale } from 'lucide-react';

type ModalType = null | 'privacy' | 'terms' | 'cookies' | 'gdpr';

export const Footer: React.FC = () => {
    const [activeModal, setActiveModal] = useState<ModalType>(null);

    const links: { label: string; modal: ModalType; icon: React.ReactNode }[] = [
        { label: 'Privacy', modal: 'privacy', icon: <Lock className="w-3 h-3" /> },
        { label: 'Termini', modal: 'terms', icon: <FileText className="w-3 h-3" /> },
        { label: 'Cookie', modal: 'cookies', icon: <Cookie className="w-3 h-3" /> },
        { label: 'GDPR', modal: 'gdpr', icon: <Shield className="w-3 h-3" /> },
    ];

    return (
        <>
            <div className="text-center opacity-90 space-y-2">
                <div className="flex items-center justify-center gap-3 flex-wrap">
                    {links.map((link, i) => (
                        <React.Fragment key={link.modal}>
                            <button
                                onClick={() => setActiveModal(link.modal)}
                                className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-lux-gold/70 hover:text-lux-gold transition-colors duration-300"
                            >
                                {link.icon}
                                {link.label}
                            </button>
                            {i < links.length - 1 && <span className="text-stone-700 text-[8px]">•</span>}
                        </React.Fragment>
                    ))}
                </div>
                <p className="text-[9px] uppercase tracking-widest text-stone-600">
                    Vox Aurea © 2026 — Tutti i diritti riservati • P.IVA in fase di registrazione
                </p>
            </div>

            {/* ═══ PRIVACY POLICY ═══ */}
            <LegalModal isOpen={activeModal === 'privacy'} onClose={() => setActiveModal(null)} title="Informativa sulla Privacy">
                <section>
                    <h3 className="text-white font-display font-bold text-base mb-3">1. Titolare del Trattamento</h3>
                    <p>
                        Il titolare del trattamento dei dati personali è <strong className="text-white">VOX AUREA</strong> (di seguito "il Titolare").
                        Per qualsiasi richiesta relativa al trattamento dei dati personali, è possibile contattarci all'indirizzo email indicato nella sezione contatti del sito.
                    </p>
                </section>

                <section>
                    <h3 className="text-white font-display font-bold text-base mb-3">2. Dati Raccolti</h3>
                    <p>Raccogliamo le seguenti categorie di dati personali:</p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                        <li><strong className="text-white">Dati identificativi:</strong> nome, cognome, indirizzo email forniti in fase di registrazione.</li>
                        <li><strong className="text-white">Dati di navigazione:</strong> indirizzo IP, tipo di browser, pagine visitate, orario di accesso.</li>
                        <li><strong className="text-white">Dati di pagamento:</strong> elaborati tramite Stripe Inc. in qualità di responsabile del trattamento. Non conserviamo dati della carta di credito.</li>
                    </ul>
                </section>

                <section>
                    <h3 className="text-white font-display font-bold text-base mb-3">3. Finalità del Trattamento</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Erogazione dei servizi acquistati e gestione dell'account utente.</li>
                        <li>Adempimento di obblighi contrattuali e legali.</li>
                        <li>Invio di comunicazioni relative ai servizi (con il tuo consenso).</li>
                        <li>Analisi statistiche anonime per migliorare il servizio.</li>
                    </ul>
                </section>

                <section>
                    <h3 className="text-white font-display font-bold text-base mb-3">4. Base Giuridica</h3>
                    <p>
                        Il trattamento è basato su: esecuzione del contratto (Art. 6(1)(b) GDPR), consenso dell'interessato (Art. 6(1)(a) GDPR),
                        legittimo interesse del titolare (Art. 6(1)(f) GDPR), adempimento di obblighi legali (Art. 6(1)(c) GDPR).
                    </p>
                </section>

                <section>
                    <h3 className="text-white font-display font-bold text-base mb-3">5. Conservazione dei Dati</h3>
                    <p>
                        I dati personali saranno conservati per il tempo necessario all'adempimento delle finalità indicate,
                        e comunque non oltre i termini di legge. I dati di navigazione vengono cancellati entro 26 mesi.
                    </p>
                </section>

                <section>
                    <h3 className="text-white font-display font-bold text-base mb-3">6. Diritti dell'Interessato</h3>
                    <p>Ai sensi degli artt. 15-22 del GDPR, hai diritto di:</p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                        <li>Accedere ai tuoi dati personali</li>
                        <li>Richiedere la rettifica o la cancellazione</li>
                        <li>Limitare od opporti al trattamento</li>
                        <li>Richiedere la portabilità dei dati</li>
                        <li>Revocare il consenso in qualsiasi momento</li>
                        <li>Proporre reclamo all'Autorità Garante per la protezione dei dati personali</li>
                    </ul>
                </section>

                <section>
                    <h3 className="text-white font-display font-bold text-base mb-3">7. Trasferimenti Extra-UE</h3>
                    <p>
                        Alcuni servizi terzi (Supabase, Stripe, Vercel) possono comportare il trasferimento di dati al di fuori dell'UE.
                        Tali trasferimenti avvengono nel rispetto delle garanzie previste dal GDPR, incluse le Clausole Contrattuali Standard della Commissione Europea.
                    </p>
                </section>
            </LegalModal>

            {/* ═══ TERMINI E CONDIZIONI ═══ */}
            <LegalModal isOpen={activeModal === 'terms'} onClose={() => setActiveModal(null)} title="Termini e Condizioni">
                <section>
                    <h3 className="text-white font-display font-bold text-base mb-3">1. Esclusione del Diritto di Recesso</h3>
                    <p>
                        Ai sensi dell'art. 59 del Codice del Consumo, <strong className="text-white">IL DIRITTO DI RECESSO È ESCLUSO</strong> per la fornitura
                        di contenuto digitale mediante supporto non materiale (download, streaming, accesso online) se l'esecuzione è iniziata
                        con l'accordo espresso del consumatore e con la sua accettazione del fatto che in tal caso avrebbe perso il diritto di recesso.
                    </p>
                    <div className="bg-red-950/30 border border-red-900/30 p-4 rounded-xl text-red-200 text-sm mt-3">
                        ❗ Effettuando l'accesso alla piattaforma e visualizzando anche solo parzialmente i contenuti, l'utente rinuncia esplicitamente a qualsiasi richiesta di rimborso.
                    </div>
                </section>

                <section>
                    <h3 className="text-white font-display font-bold text-base mb-3">2. Proprietà Intellettuale</h3>
                    <p>
                        Tutti i contenuti presenti su VOX AUREA (video, audio, testi, script, metodologie) sono protetti da copyright.
                        L'acquisto garantisce una <strong className="text-white">licenza personale, non trasferibile e non esclusiva</strong>.
                    </p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                        <li>È SEVERAMENTE VIETATA la condivisione delle credenziali di accesso.</li>
                        <li>È SEVERAMENTE VIETATA la rivendita, distribuzione o pubblicazione dei materiali.</li>
                        <li>Il sistema di monitoraggio rileverà accessi sospetti, portando al blocco immediato dell'account senza rimborso.</li>
                    </ul>
                </section>

                <section>
                    <h3 className="text-white font-display font-bold text-base mb-3">3. Limitazione di Responsabilità</h3>
                    <p>
                        VOX AUREA fornisce contenuti formativi. I risultati non sono garantiti e dipendono dall'applicazione individuale.
                        L'azienda non è responsabile per decisioni prese sulla base delle informazioni fornite o per mancati guadagni.
                    </p>
                </section>

                <section>
                    <h3 className="text-white font-display font-bold text-base mb-3">4. Modalità di Pagamento</h3>
                    <p>
                        I pagamenti sono elaborati tramite <strong className="text-white">Stripe</strong> in modalità sicura.
                        Accettiamo carte di credito e debito dei principali circuiti. L'importo viene addebitato al momento dell'acquisto.
                    </p>
                </section>

                <section>
                    <h3 className="text-white font-display font-bold text-base mb-3">5. Legge Applicabile e Foro Competente</h3>
                    <p>
                        Questi termini sono regolati dalla legge italiana. Per qualsiasi controversia è competente in via esclusiva il Foro di Milano.
                    </p>
                </section>
            </LegalModal>

            {/* ═══ COOKIE POLICY ═══ */}
            <LegalModal isOpen={activeModal === 'cookies'} onClose={() => setActiveModal(null)} title="Cookie Policy">
                <section>
                    <h3 className="text-white font-display font-bold text-base mb-3">Cosa sono i Cookie</h3>
                    <p>
                        I cookie sono piccoli file di testo che vengono memorizzati sul tuo dispositivo quando visiti il nostro sito web.
                        Sono ampiamente utilizzati per far funzionare i siti web e fornire informazioni ai proprietari del sito.
                    </p>
                </section>

                <section>
                    <h3 className="text-white font-display font-bold text-base mb-3">Cookie Utilizzati</h3>

                    <div className="space-y-4 mt-3">
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-green-400" />
                                <p className="text-white text-sm font-bold">Cookie Necessari</p>
                            </div>
                            <p className="text-stone-400 text-xs leading-relaxed">
                                Essenziali per il funzionamento del sito. Includono cookie di sessione, autenticazione (Supabase Auth)
                                e preferenze cookie. Non possono essere disattivati.
                            </p>
                        </div>

                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-blue-400" />
                                <p className="text-white text-sm font-bold">Cookie Analitici</p>
                            </div>
                            <p className="text-stone-400 text-xs leading-relaxed">
                                Ci aiutano a capire come i visitatori interagiscono con il sito raccogliendo informazioni anonime.
                                Utilizzati per migliorare la struttura e i contenuti.
                            </p>
                        </div>

                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-purple-400" />
                                <p className="text-white text-sm font-bold">Cookie di Marketing</p>
                            </div>
                            <p className="text-stone-400 text-xs leading-relaxed">
                                Utilizzati per tracciare i visitatori attraverso i siti web con lo scopo di mostrare pubblicità pertinente.
                                Possono essere impostati da partner terzi.
                            </p>
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-white font-display font-bold text-base mb-3">Gestione dei Cookie</h3>
                    <p>
                        Puoi modificare le tue preferenze sui cookie in qualsiasi momento tramite le impostazioni del browser
                        o cliccando su "Cookie" nel footer del sito. La disabilitazione di alcuni cookie potrebbe influire sulla funzionalità del sito.
                    </p>
                </section>

                <section>
                    <h3 className="text-white font-display font-bold text-base mb-3">Cookie di Terze Parti</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><strong className="text-white">Supabase:</strong> autenticazione e gestione dati utente.</li>
                        <li><strong className="text-white">Stripe:</strong> elaborazione pagamenti sicuri (cookies funzionali).</li>
                        <li><strong className="text-white">Vercel:</strong> hosting e analytics di performance.</li>
                    </ul>
                </section>
            </LegalModal>

            {/* ═══ GDPR ═══ */}
            <LegalModal isOpen={activeModal === 'gdpr'} onClose={() => setActiveModal(null)} title="I Tuoi Diritti — GDPR">
                <section>
                    <h3 className="text-white font-display font-bold text-base mb-3">Regolamento (UE) 2016/679</h3>
                    <p>
                        Il Regolamento Generale sulla Protezione dei Dati (GDPR) garantisce ai cittadini dell'Unione Europea
                        diritti specifici riguardo ai propri dati personali. VOX AUREA si impegna a rispettare pienamente tali diritti.
                    </p>
                </section>

                <section>
                    <h3 className="text-white font-display font-bold text-base mb-3">I Tuoi Diritti</h3>
                    <div className="space-y-3 mt-3">
                        {[
                            { title: 'Diritto di Accesso (Art. 15)', desc: 'Hai il diritto di ottenere conferma che sia o meno in corso un trattamento dei tuoi dati e di accedervi.' },
                            { title: 'Diritto di Rettifica (Art. 16)', desc: 'Hai il diritto di ottenere la rettifica dei dati personali inesatti che ti riguardano.' },
                            { title: 'Diritto alla Cancellazione (Art. 17)', desc: 'Hai il diritto di ottenere la cancellazione dei tuoi dati personali ("diritto all\'oblio").' },
                            { title: 'Diritto alla Portabilità (Art. 20)', desc: 'Hai il diritto di ricevere i tuoi dati in un formato strutturato, di uso comune e leggibile da dispositivo automatico.' },
                            { title: 'Diritto di Opposizione (Art. 21)', desc: 'Hai il diritto di opporti al trattamento dei tuoi dati, incluso il trattamento per finalità di marketing diretto.' },
                            { title: 'Diritto di Reclamo (Art. 77)', desc: 'Hai il diritto di proporre reclamo al Garante per la Protezione dei Dati Personali (www.garanteprivacy.it).' },
                        ].map((right, i) => (
                            <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                                <p className="text-white text-sm font-bold mb-1">{right.title}</p>
                                <p className="text-stone-400 text-xs leading-relaxed">{right.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h3 className="text-white font-display font-bold text-base mb-3">Come Esercitare i Tuoi Diritti</h3>
                    <p>
                        Per esercitare qualunque dei diritti sopra elencati, puoi inviarci una richiesta all'indirizzo email
                        indicato nella sezione contatti del sito. Risponderemo entro 30 giorni dalla ricezione della richiesta,
                        come previsto dal GDPR.
                    </p>
                </section>

                <section>
                    <h3 className="text-white font-display font-bold text-base mb-3">Responsabile della Protezione dei Dati</h3>
                    <p>
                        Per domande specifiche sulla protezione dei dati, puoi contattare il nostro responsabile designato
                        tramite i canali di contatto disponibili sul sito.
                    </p>
                </section>
            </LegalModal>
        </>
    );
};
