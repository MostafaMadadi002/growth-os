import React, { useState } from 'react';
import { 
  Plus, Search, ChevronRight, Trash2, Edit3, X, 
  Calendar, Book, ArrowLeft, Filter, Zap, 
  GraduationCap, Terminal, Hash
} from 'lucide-react';
import { useI18n } from '../../core/store/useI18n';
import { useAppStore, UserRole } from '../../core/stores/appStore';
import { motion, AnimatePresence } from 'motion/react';

type JournalMode = 'LIST' | 'CREATE' | 'DETAIL';

export default function JournalScreen() {
  const { t } = useI18n();
  const { currentRoot, studentData, traderData, addStudentNote, addTraderNote } = useAppStore();
  
  const [mode, setMode] = useState<JournalMode>('LIST');
  const [search, setSearch] = useState('');
  const [selectedNote, setSelectedNote] = useState<any>(null);

  const isTrader = currentRoot === UserRole.TRADER;
  
  const notes = isTrader ? traderData.notes : studentData.notes;
  const filteredNotes = notes.filter(n => 
    (n as any).title?.toLowerCase().includes(search.toLowerCase()) || 
    (n as any).content?.toLowerCase().includes(search.toLowerCase()) ||
    (n as any).symbol?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const id = Math.random().toString(36).substr(2, 9);
    const date = new Date().toISOString();

    if (isTrader) {
      addTraderNote({
        id,
        symbol: formData.get('symbol') as string,
        content: formData.get('content') as string,
        date
      });
    } else {
      addStudentNote({
        id,
        title: formData.get('title') as string,
        content: formData.get('content') as string,
        date,
        tags: (formData.get('tags') as string).split(',').map(t => t.trim())
      });
    }
    setMode('LIST');
  };

  if (mode === 'CREATE') {
    return (
      <div className="flex flex-col h-full bg-slate-950 overflow-y-auto pb-40 scrollbar-hide">
        <header className="p-8 md:p-12 border-b border-white/5 flex items-center justify-between">
           <div>
             <h2 className="text-3xl font-display font-black text-white uppercase tracking-tighter">
               {isTrader ? 'New_Tactical_Entry' : 'New_Knowledge_Node'}
             </h2>
             <p className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest mt-2">Inputting Data to Core Archive</p>
           </div>
           <button onClick={() => setMode('LIST')} className="w-14 h-14 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white transition-all"><X size={24} /></button>
        </header>

        <form onSubmit={handleCreate} className="p-8 md:p-12 max-w-4xl mx-auto w-full space-y-10">
           {isTrader ? (
             <div className="space-y-2">
                <label className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest">Symbol_Ref</label>
                <input name="symbol" required placeholder="BTC_USD // XAU" className="w-full bg-slate-900 border border-white/5 rounded-2xl p-6 text-white font-mono placeholder:text-slate-800 outline-none focus:border-emerald-500/30 transition-all text-xl" />
             </div>
           ) : (
             <div className="space-y-2">
                <label className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest">Node_Title</label>
                <input name="title" required placeholder="Lesson Concept // Study Log" className="w-full bg-slate-900 border border-white/5 rounded-2xl p-6 text-white font-display font-black placeholder:text-slate-800 outline-none focus:border-indigo-500/30 transition-all text-2xl uppercase" />
             </div>
           )}

           <div className="space-y-2">
              <label className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest">Archive_Data</label>
              <textarea name="content" required rows={10} placeholder="Type detailed logs..." className="w-full bg-slate-900 border border-white/5 rounded-3xl p-8 text-slate-300 font-sans text-lg placeholder:text-slate-800 outline-none focus:border-brand-primary/20 transition-all resize-none" />
           </div>

           {!isTrader && (
             <div className="space-y-2">
                <label className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest">Global_Tags</label>
                <input name="tags" placeholder="biology, neural_net, calculus" className="w-full bg-slate-900 border border-white/5 rounded-2xl p-5 text-slate-400 font-mono text-sm placeholder:text-slate-800 outline-none" />
             </div>
           )}

           <button type="submit" className={`w-full py-8 rounded-3xl font-display font-black text-2xl uppercase transition-all shadow-2xl ${isTrader ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20' : 'bg-indigo-600 text-white shadow-indigo-600/20'}`}>
              Commit To Archive.
           </button>
        </form>
      </div>
    );
  }

  if (mode === 'DETAIL' && selectedNote) {
    return (
      <div className="flex flex-col h-full bg-slate-950 overflow-y-auto pb-40 scrollbar-hide">
         <header className="p-8 border-b border-white/5 flex items-center justify-between sticky top-0 bg-slate-950/80 backdrop-blur-xl z-50">
            <button onClick={() => setMode('LIST')} className="flex items-center gap-4 text-slate-500 hover:text-white transition-colors">
               <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center"><ArrowLeft size={20} /></div>
               <span className="text-[10px] font-mono font-black tracking-widest uppercase">Go_Back</span>
            </button>
            <div className="flex gap-4">
              <button className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-rose-500/50 hover:text-rose-500 transition-colors"><Trash2 size={18} /></button>
            </div>
         </header>

         <main className="p-8 md:p-16 max-w-4xl mx-auto w-full">
            <div className="flex items-center gap-3 mb-8">
               <div className={`px-3 py-1 rounded-lg border font-mono font-black text-[9px] uppercase tracking-widest ${isTrader ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' : 'border-indigo-500/20 text-indigo-400 bg-indigo-500/5'}`}>
                  {isTrader ? 'TACTICAL_FEED' : 'KNOWLEDGE_VAULT'}
               </div>
               <span className="text-[9px] font-mono text-slate-700 uppercase tracking-widest">{selectedNote.date.split('T')[0]}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-black text-white leading-none tracking-tighter mb-12 uppercase">
              {isTrader ? selectedNote.symbol : selectedNote.title}
            </h1>
            <div className="prose prose-invert max-w-none">
               <p className="text-xl md:text-2xl text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">{selectedNote.content}</p>
            </div>
            {!isTrader && selectedNote.tags && (
              <div className="flex flex-wrap gap-2 mt-16 pt-8 border-t border-white/5">
                 {selectedNote.tags.map((t: string) => <span key={t} className="px-5 py-2 bg-slate-900 border border-white/5 rounded-xl text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">#{t}</span>)}
              </div>
            )}
         </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-y-auto pb-44 scrollbar-hide">
      <div className="p-8 md:p-12 space-y-12 max-w-6xl mx-auto w-full">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-2 h-2 rounded-full ${isTrader ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-indigo-500 shadow-[0_0_8px_#6366f1]'}`} />
              <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-[0.4em]">
                {isTrader ? 'Tactical_Journal_Core' : 'Knowledge_Synthesis_Hub'}
              </span>
            </div>
            <h1 className="text-4xl md:text-7xl font-display font-black text-white tracking-tighter uppercase leading-none">Journal.</h1>
          </div>
          <button 
            onClick={() => setMode('CREATE')}
            className={`w-16 h-16 rounded-[2rem] flex items-center justify-center text-white transition-all shadow-2xl relative group ${isTrader ? 'bg-emerald-600 shadow-emerald-600/20' : 'bg-indigo-600 shadow-indigo-600/20'}`}
          >
             <Plus size={28} className="group-hover:rotate-90 transition-transform duration-500" strokeWidth={3} />
          </button>
        </header>

        <div className="relative group">
           <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 pointer-events-none group-focus-within:text-brand-primary transition-colors">
              <Search size={20} />
           </div>
           <input 
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             placeholder={`Search ${isTrader ? 'Trades & Symbols' : 'Concepts & Lessons'}...`}
             className="w-full bg-slate-900/40 border border-white/5 rounded-3xl py-7 pl-16 pr-8 text-white font-mono text-xs uppercase tracking-widest focus:border-white/10 outline-none transition-all placeholder:text-slate-800"
           />
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {filteredNotes.map((note: any) => (
             <button 
               key={note.id}
               onClick={() => { setSelectedNote(note); setMode('DETAIL'); }}
               className="bg-slate-900/50 border border-white/5 p-8 rounded-[2.5rem] flex flex-col justify-between text-left group hover:bg-slate-900 hover:border-white/10 transition-all min-h-[220px]"
             >
                <div>
                   <div className="flex justify-between items-start mb-6">
                      <div className="text-[10px] font-mono font-black text-slate-700 uppercase tracking-[0.3em] group-hover:text-brand-primary transition-colors">
                        SEC_{note.id.slice(0, 4)} // {note.date.split('T')[0]}
                      </div>
                      <ChevronRight size={18} className="text-slate-800 group-hover:text-white transition-transform group-hover:translate-x-1" />
                   </div>
                   <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight line-clamp-1 mb-2">
                     {isTrader ? note.symbol : note.title}
                   </h3>
                   <p className="text-sm text-slate-600 font-medium line-clamp-2 leading-relaxed">
                     {note.content}
                   </p>
                </div>
             </button>
           ))}
           
           {filteredNotes.length === 0 && (
             <div className="col-span-full py-32 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-slate-900/10">
                <Book size={60} strokeWidth={1} className="mx-auto mb-6 text-slate-800" />
                <p className="text-[10px] font-mono font-black text-slate-700 uppercase tracking-widest">Archive Empty // Node Inactive</p>
             </div>
           )}
        </section>
      </div>
    </div>
  );
}
