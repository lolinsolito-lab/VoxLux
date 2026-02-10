// ... imports ...
import { DollarSign, TrendingUp, TrendingDown, Calendar, RefreshCw, Download, Users, ShoppingCart, CreditCard, Trash2 } from 'lucide-react';
// ... imports ...

// ... inside component ...
const handleDeleteTransaction = async (id: string, amount: number) => {
    if (!confirm(`Sei sicuro di voler eliminare questa transazione da ${formatCurrency(amount / 100)}? Questa azione influenzerà i grafici e i totali.`)) return;

    try {
        const { error } = await supabase.from('purchases').delete().eq('id', id);
        if (error) throw error;

        // Optimistic update or wait for realtime
        setRecentTransactions(prev => prev.filter(t => t.id !== id));
        fetchFinanceData(); // Recalculate totals
        alert('Transazione eliminata.');
    } catch (error: any) {
        console.error('Error deleting transaction:', error);
        alert('Errore eliminazione: ' + error.message);
    }
};

// ... inside render loop ...
<motion.div
    key={tx.id}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
    className="backdrop-blur-sm bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all duration-300 group"
>
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
                <CreditCard size={20} className="text-green-400" />
            </div>
            <div>
                <h4 className="font-bold text-white">{tx.profiles?.full_name || tx.profiles?.email || 'Utente'}</h4>
                <p className="text-sm text-gray-400">{getCourseName(tx.course_id)}</p>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <div className="text-right">
                <p className="text-xl font-bold text-green-400">{formatCurrency(tx.amount / 100)}</p>
                <p className="text-xs text-gray-500">{new Date(tx.created_at).toLocaleString('it-IT')}</p>
            </div>
            <button
                onClick={() => handleDeleteTransaction(tx.id, tx.amount)}
                className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                title="Elimina Transazione"
            >
                <Trash2 size={18} />
            </button>
        </div>
    </div>
</motion.div>
