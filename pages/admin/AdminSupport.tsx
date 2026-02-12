import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, CheckCircle, Clock, Search, Filter, User, MoreVertical, X, AlertCircle, RefreshCw, Mail, ChevronLeft } from 'lucide-react';
import { supabase } from '../../services/supabase';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';

// TYPES
interface UserProfile {
    email: string;
    full_name: string;
    avatar_url?: string;
}

interface Ticket {
    id: string;
    user_id: string;
    subject: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    priority: 'low' | 'normal' | 'high' | 'urgent';
    category: string;
    created_at: string;
    last_reply_at: string;
    profiles?: UserProfile; // Joined profile data
}

interface Message {
    id: string;
    ticket_id: string;
    sender_id: string | null; // NULL = System
    message: string;
    is_admin: boolean;
    created_at: string;
}

export const AdminSupport: React.FC = () => {
    // STATE
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('all'); // all, open, resolved
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // FETCH TICKETS
    useEffect(() => {
        fetchTicketsAndProfiles();

        // Subscribe to NEW tickets
        const channel = supabase
            .channel('admin-tickets')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets' }, () => {
                fetchTicketsAndProfiles();
            })
            .subscribe();

        return () => { channel.unsubscribe(); };
    }, []);

    // FETCH MESSAGES WHEN TICKET SELECTED
    useEffect(() => {
        if (!selectedTicket) return;

        fetchMessages(selectedTicket.id);

        // Subscribe to NEW messages for this ticket
        const channel = supabase
            .channel(`ticket-${selectedTicket.id}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'support_messages', filter: `ticket_id=eq.${selectedTicket.id}` }, (payload) => {
                setMessages(prev => [...prev, payload.new as Message]);
                scrollToBottom();
            })
            .subscribe();

        return () => { channel.unsubscribe(); };
    }, [selectedTicket]);

    const fetchTicketsAndProfiles = async () => {
        setLoading(true);
        try {
            // 1. Fetch Tickets (Raw, no join)
            const { data: ticketsData, error: ticketsError } = await supabase
                .from('support_tickets')
                .select('*')
                .order('last_reply_at', { ascending: false });

            if (ticketsError) throw ticketsError;

            if (!ticketsData || ticketsData.length === 0) {
                setTickets([]);
                setLoading(false);
                return;
            }

            // 2. Extract User IDs
            const userIds = Array.from(new Set(ticketsData.map(t => t.user_id)));

            // 3. Fetch Profiles manually
            const { data: profilesData, error: profilesError } = await supabase
                .from('profiles')
                .select('id, email, full_name, avatar_url')
                .in('id', userIds);

            if (profilesError) console.warn('Error fetching profiles:', profilesError);

            // 4. Merge Data
            const profilesMap = new Map();
            profilesData?.forEach(p => profilesMap.set(p.id, p));

            const mergedTickets = ticketsData.map(ticket => ({
                ...ticket,
                profiles: profilesMap.get(ticket.user_id) || { email: 'Sconosciuto', full_name: 'Utente' } // Fallback
            }));

            setTickets(mergedTickets as Ticket[]);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    // Kept for refresh button
    const fetchTickets = fetchTicketsAndProfiles;

    // Legacy function stub if needed, but fetchTicketsAndProfiles replaces it.

    const fetchMessages = async (ticketId: string) => {
        const { data } = await supabase
            .from('support_messages')
            .select('*')
            .eq('ticket_id', ticketId)
            .order('created_at', { ascending: true });
        setMessages(data || []);
        scrollToBottom();
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedTicket) return;

        try {
            const { error } = await supabase.from('support_messages').insert({
                ticket_id: selectedTicket.id,
                message: newMessage,
                is_admin: true,
                sender_id: (await supabase.auth.getUser()).data.user?.id
            });

            if (error) throw error;

            // Update ticket timestamp
            await supabase.from('support_tickets').update({
                last_reply_at: new Date().toISOString(),
                status: 'in_progress' // Auto set to in progress on reply
            }).eq('id', selectedTicket.id);

            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const updateStatus = async (status: string) => {
        if (!selectedTicket) return;
        await supabase.from('support_tickets').update({ status }).eq('id', selectedTicket.id);
        setSelectedTicket(prev => prev ? { ...prev, status: status as any } : null);
    };

    const scrollToBottom = () => {
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    };

    const filteredTickets = tickets.filter(t => {
        if (filterStatus === 'all') return true;
        if (filterStatus === 'open') return t.status === 'open' || t.status === 'in_progress';
        if (filterStatus === 'resolved') return t.status === 'resolved' || t.status === 'closed';
        return true;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return 'text-green-400 bg-green-500/20';
            case 'in_progress': return 'text-blue-400 bg-blue-500/20';
            case 'resolved': return 'text-gray-400 bg-gray-500/20';
            case 'closed': return 'text-gray-500 bg-gray-900';
            default: return 'text-gray-400';
        }
    };

    // Helper to get user display name
    const getUserName = (ticket: Ticket) => {
        if (ticket.profiles?.full_name) return ticket.profiles.full_name;
        if (ticket.profiles?.email) return ticket.profiles.email.split('@')[0];
        return 'Utente Sconosciuto';
    };

    const getUserEmail = (ticket: Ticket) => {
        return ticket.profiles?.email || 'Nessuna email';
    };

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-100px)] bg-black/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">

            {/* LEFT SIDEBAR: TICKET LIST */}
            <div className={`w-full md:w-1/3 border-b md:border-r md:border-b-0 border-white/10 flex flex-col h-full bg-black/60 md:bg-transparent ${selectedTicket ? 'hidden md:flex' : 'flex'}`}>
                {/* Header */}
                <div className="p-4 border-b border-white/10 bg-black/40">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-white">Supporto & Ticket</h2>
                        <button
                            onClick={() => fetchTickets()}
                            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                            title="Aggiorna lista"
                        >
                            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                        </button>
                    </div>
                    <div className="flex gap-2">
                        {['all', 'open', 'resolved'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${filterStatus === status
                                    ? 'bg-white text-black'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                {status === 'all' ? 'Tutti' : status === 'open' ? 'Aperti' : 'Chiusi'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">
                            <Clock className="w-8 h-8 mx-auto mb-2 animate-spin opacity-50" />
                            Caricamento...
                        </div>
                    ) : filteredTickets.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            Nessun ticket trovato.
                        </div>
                    ) : (
                        filteredTickets.map(ticket => (
                            <div
                                key={ticket.id}
                                onClick={() => setSelectedTicket(ticket)}
                                className={`p-4 border-b border-white/5 cursor-pointer transition-all hover:bg-white/5 ${selectedTicket?.id === ticket.id ? 'bg-white/10 border-l-4 border-l-green-500' : ''
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${getStatusColor(ticket.status)}`}>
                                        {ticket.status.replace('_', ' ')}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {ticket.last_reply_at && formatDistanceToNow(new Date(ticket.last_reply_at), { addSuffix: true, locale: it })}
                                    </span>
                                </div>
                                <h4 className="text-white font-medium truncate mb-1">{ticket.subject}</h4>
                                <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                                    <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-gray-300">
                                        {getUserName(ticket).charAt(0).toUpperCase()}
                                    </div>
                                    <span className="truncate font-medium text-gray-300">{getUserName(ticket)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-gray-600 ml-7">
                                    <span className="truncate">{getUserEmail(ticket)}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* RIGHT SIDEBAR: CHAT */}
            <div className={`flex-1 flex-col bg-gray-900/30 w-full md:w-auto ${selectedTicket ? 'flex' : 'hidden md:flex'}`}>
                {selectedTicket ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-white/10 bg-black/40 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setSelectedTicket(null)}
                                    className="md:hidden p-2 -ml-2 text-gray-400 hover:text-white"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{selectedTicket.subject}</h3>
                                    <div className="flex items-center gap-3 text-sm text-gray-400">
                                        <div className="flex items-center gap-1.5 text-white">
                                            <User size={14} />
                                            <span className="font-bold">{getUserName(selectedTicket)}</span>
                                        </div>
                                        <span className="text-zinc-600">|</span>
                                        <div className="flex items-center gap-1.5">
                                            <Mail size={14} />
                                            <span>{getUserEmail(selectedTicket)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {selectedTicket.status !== 'resolved' && (
                                        <button
                                            onClick={() => updateStatus('resolved')}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-bold rounded-lg flex items-center gap-2 transition-colors"
                                        >
                                            <CheckCircle size={16} />
                                            Risolvi
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setSelectedTicket(null)}
                                        className="p-2 text-gray-500 hover:text-white"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {messages.map((msg) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={msg.id}
                                        className={`flex ${msg.is_admin ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[70%] p-3 rounded-2xl text-sm leading-relaxed ${msg.is_admin
                                            ? 'bg-green-600 text-white rounded-br-none'
                                            : 'bg-zinc-800 text-gray-200 rounded-bl-none'
                                            }`}>
                                            <p>{msg.message}</p>
                                            <p className={`text-[10px] mt-1 text-right ${msg.is_admin ? 'text-green-200' : 'text-zinc-400'}`}>
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <form onSubmit={sendMessage} className="p-4 border-t border-white/10 bg-black/40">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Scrivi una risposta..."
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl py-3 pl-4 pr-12 text-white focus:outline-none focus:border-green-500 transition-colors"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className="absolute right-2 top-2 p-1.5 bg-green-600 text-white rounded-lg hover:bg-green-500 disabled:opacity-50 disabled:hover:bg-green-600 transition-colors"
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                            </form>
                        </>
                        ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                                <MessageSquare size={32} className="opacity-50" />
                            </div>
                            <p className="text-lg">Seleziona un ticket per vedere la chat</p>
                        </div>
                )}
                    </div>
            </div>
        </div>
    );
};
