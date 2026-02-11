import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, LifeBuoy, ChevronDown, Paperclip, Loader2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Ticket {
    id: string;
    subject: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    last_reply_at: string;
}

interface Message {
    id: string;
    message: string;
    is_admin: boolean; // false = user, true = admin
    created_at: string;
}

const SUPPORT_TOPICS = [
    "Corso non si attiva dopo l'acquisto",
    "Problema con il pagamento",
    "Bug / Errore tecnico",
    "Domanda sul contenuto",
    "Richiesta Collaborazione",
    "Altro"
];

export const SupportWidget: React.FC = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<'list' | 'chat' | 'new'>('list');
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');

    // New Ticket State
    const [newTicketSubject, setNewTicketSubject] = useState('');
    const [selectedTopic, setSelectedTopic] = useState(SUPPORT_TOPICS[0]); // Default topic
    const [newTicketMessage, setNewTicketMessage] = useState('');

    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial Load
    useEffect(() => {
        if (isOpen && user) {
            fetchTickets();
        }
    }, [isOpen, user]);

    // Ticket Realtime
    useEffect(() => {
        if (!user) return;
        const channel = supabase
            .channel('user-tickets')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets', filter: `user_id=eq.${user.id}` }, () => {
                fetchTickets();
            })
            .subscribe();
        return () => { channel.unsubscribe(); };
    }, [user]);

    // Messages Realtime
    useEffect(() => {
        if (!activeTicket) return;
        fetchMessages(activeTicket.id);

        const channel = supabase
            .channel(`ticket-${activeTicket.id}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'support_messages', filter: `ticket_id=eq.${activeTicket.id}` }, (payload) => {
                setMessages(prev => [...prev, payload.new as Message]);
                scrollToBottom();
            })
            .subscribe();

        return () => { channel.unsubscribe(); };
    }, [activeTicket]);

    const fetchTickets = async () => {
        if (!user) return;
        setLoading(true);
        const { data } = await supabase
            .from('support_tickets')
            .select('*')
            .eq('user_id', user.id)
            .order('last_reply_at', { ascending: false });
        setTickets(data as any || []);
        setLoading(false);
    };

    const fetchMessages = async (ticketId: string) => {
        const { data } = await supabase
            .from('support_messages')
            .select('*')
            .eq('ticket_id', ticketId)
            .order('created_at', { ascending: true });
        setMessages(data || []);
        scrollToBottom();
    };

    const scrollToBottom = () => {
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    };

    const createTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newTicketMessage.trim()) return;

        // Construct effective subject
        const effectiveSubject = selectedTopic === 'Altro' ? newTicketSubject : selectedTopic;
        if (!effectiveSubject.trim()) return;

        setLoading(true);
        try {
            // 1. Create Ticket
            const { data: ticket, error: ticketError } = await supabase
                .from('support_tickets')
                .insert({
                    user_id: user.id,
                    subject: effectiveSubject,
                    status: 'open',
                    priority: 'normal'
                })
                .select()
                .single();

            if (ticketError) throw ticketError;

            // 2. Create Initial Message
            const { error: msgError } = await supabase
                .from('support_messages')
                .insert({
                    ticket_id: ticket.id,
                    sender_id: user.id,
                    message: newTicketMessage,
                    is_admin: false
                });

            if (msgError) throw msgError;

            // Reset UI
            setNewTicketSubject('');
            setNewTicketMessage('');
            setSelectedTopic(SUPPORT_TOPICS[0]); // Reset to default topic
            setActiveTicket(ticket as any);
            setView('chat');
        } catch (error) {
            console.error('Error creating ticket:', error);
            alert('Errore creazione ticket.');
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeTicket || !newMessage.trim() || !user) return;

        try {
            const { error } = await supabase.from('support_messages').insert({
                ticket_id: activeTicket.id,
                sender_id: user.id,
                message: newMessage,
                is_admin: false
            });

            if (error) throw error;

            // Update timestamp
            await supabase.from('support_tickets').update({
                last_reply_at: new Date().toISOString(),
                status: 'open' // Re-open if resolved
            }).eq('id', activeTicket.id);

            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return 'bg-green-500';
            case 'in_progress': return 'bg-blue-500';
            case 'resolved': return 'bg-gray-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <>
            {/* FLOATING BUTTON */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-green-500 to-green-700 text-white rounded-full shadow-[0_0_20px_rgba(34,197,94,0.3)] z-[9999] flex items-center justify-center border border-green-400/30"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={28} />}

                {/* Unread Badge Idea: could verify unread messages here later */}
            </motion.button>

            {/* WIDGET WINDOW */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-24 right-6 w-[380px] h-[500px] bg-zinc-950 border border-green-500/20 rounded-2xl shadow-2xl z-[9999] flex flex-col overflow-hidden backdrop-blur-xl"
                    >
                        {/* HEADER */}
                        <div className="p-4 bg-gradient-to-r from-green-900/20 to-zinc-900 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <LifeBuoy className="text-green-500" size={20} />
                                <span className="font-bold text-white tracking-wide">SUPPORTO ELITE</span>
                            </div>
                            {view !== 'list' && (
                                <button
                                    onClick={() => setView('list')}
                                    className="text-xs text-gray-400 hover:text-white underline"
                                >
                                    Indietro
                                </button>
                            )}
                        </div>

                        {/* CONTENT */}
                        <div className="flex-1 overflow-y-auto bg-black/50 relative">

                            {/* VIEW: LIST */}
                            {view === 'list' && (
                                <div className="p-4 space-y-4">
                                    <button
                                        onClick={() => setView('new')}
                                        className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-500/50 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2"
                                    >
                                        <MessageCircle size={16} />
                                        Nuova Richiesta
                                    </button>

                                    <div className="space-y-2">
                                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">I tuoi Ticket</h3>
                                        {tickets.length === 0 ? (
                                            <p className="text-center text-sm text-gray-600 py-4">Nessuna conversazione attiva.</p>
                                        ) : (
                                            tickets.map(ticket => (
                                                <div
                                                    key={ticket.id}
                                                    onClick={() => { setActiveTicket(ticket); setView('chat'); }}
                                                    className="p-3 bg-zinc-900/50 border border-white/5 hover:border-white/20 rounded-xl cursor-pointer transition-all group"
                                                >
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className="text-sm font-bold text-gray-300 group-hover:text-white truncate pr-2">{ticket.subject}</h4>
                                                        <div className={`w-2 h-2 rounded-full ${getStatusColor(ticket.status)} shrink-0 mt-1`}></div>
                                                    </div>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(ticket.last_reply_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* VIEW: NEW TICKET */}
                            {view === 'new' && (
                                <form onSubmit={createTicket} className="p-4 space-y-4">
                                    <div>
                                        <label className="text-xs text-gray-400 block mb-1">Oggetto</label>
                                        <input
                                            type="text"
                                            value={newTicketSubject}
                                            onChange={e => setNewTicketSubject(e.target.value)}
                                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white text-sm focus:border-green-500 outline-none"
                                            placeholder="Es. Problema accesso modulo 2..."
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 block mb-1">Messaggio</label>
                                        <textarea
                                            value={newTicketMessage}
                                            onChange={e => setNewTicketMessage(e.target.value)}
                                            className="w-full h-32 bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white text-sm focus:border-green-500 outline-none resize-none"
                                            placeholder="Descrivi il problema..."
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                                        Invia Richiesta
                                    </button>
                                </form>
                            )}

                            {/* VIEW: CHAT */}
                            {view === 'chat' && activeTicket && (
                                <div className="flex flex-col h-full">
                                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                        {messages.map(msg => (
                                            <div key={msg.id} className={`flex ${msg.is_admin ? 'justify-start' : 'justify-end'}`}>
                                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.is_admin
                                                    ? 'bg-zinc-800 text-gray-200 rounded-tl-none'
                                                    : 'bg-green-600 text-white rounded-tr-none'
                                                    }`}>
                                                    <p>{msg.message}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {messages.length === 0 && <p className="text-center text-xs text-gray-500">Inizio conversazione...</p>}
                                        <div ref={messagesEndRef} />
                                    </div>
                                    <form onSubmit={sendMessage} className="p-3 border-t border-white/10 bg-zinc-900/50 flex gap-2">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={e => setNewMessage(e.target.value)}
                                            className="flex-1 bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:border-green-500 outline-none"
                                            placeholder="Scrivi..."
                                        />
                                        <button
                                            type="submit"
                                            disabled={!newMessage.trim()}
                                            className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-500 disabled:opacity-50"
                                        >
                                            <Send size={16} />
                                        </button>
                                    </form>
                                </div>
                            )}

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
