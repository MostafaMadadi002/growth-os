import React, { useState } from 'react';
import { useAppStore, UserRole } from '../../core/stores/appStore';
import { useI18n } from '../../core/store/useI18n';
import { 
  Flame, Target, Zap, ChevronRight, TrendingUp, 
  Terminal, GraduationCap, ArrowUpRight, Activity,
  Layers, Wallet, Network, GitBranch, Binary, Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type TreeNode = 'ROOT' | 'EDUCATIONAL' | 'BEHAVIORAL' | 'FINANCIAL';

export default function DashboardScreen() {
  const { currentRoot, studentData, traderData } = useAppStore();
  const { t } = useI18n();
  const [activeNode, setActiveNode] = useState<TreeNode>('ROOT');

  const isTrader = currentRoot === UserRole.TRADER;

  // Tree Content Logic
  const renderTreeContent = () => {
    switch (activeNode) {
      case 'EDUCATIONAL':
        return <EducationalNode data={studentData} onBack={() => setActiveNode('ROOT')} />;
      case 'BEHAVIORAL':
        return <BehavioralNode data={studentData} onBack={() => setActiveNode('ROOT')} />;
      case 'FINANCIAL':
        return <FinancialNode data={traderData} onBack={() => setActiveNode('ROOT')} />;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <TreeBranch 
               label="Educational_Node" 
               icon={<GraduationCap />} 
               id="STUDENT"
               meta={`${studentData.goals.length} Goals Active`}
               onClick={() => setActiveNode('EDUCATIONAL')}
               color="indigo"
             />
             <TreeBranch 
               label="Behavioral_Node" 
               icon={<Activity />} 
               id="HABITS"
               meta={`${studentData.habits.length} Neural Paths`}
               onClick={() => setActiveNode('BEHAVIORAL')}
               color="rose"
             />
             <TreeBranch 
               label="Financial_Node" 
               icon={<TrendingUp />} 
               id="TRADER"
               meta={`$${traderData.trades.reduce((acc, t) => acc + t.pnl_amount, 0)} Net_PnL`}
               onClick={() => setActiveNode('FINANCIAL')}
               color="emerald"
             />
          </div>
        );
    }
  };

  return (
    <div className="p-6 md:p-12 space-y-12 max-w-6xl mx-auto pb-44 scrollbar-hide">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-2 h-2 rounded-full ${activeNode === 'ROOT' ? 'bg-brand-primary' : 'bg-white'} animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.3)]`} />
            <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-[0.4em]">
              System_Tree // {activeNode}_DOMAIN
            </span>
          </div>
          <h1 className="text-4xl md:text-7xl font-display font-black text-white tracking-tighter uppercase leading-none">
            {activeNode === 'ROOT' ? 'Roots.' : activeNode.replace('AL', '') + '.'}
          </h1>
        </div>
        
        {activeNode === 'ROOT' && (
          <div className="flex gap-8 bg-slate-900/40 border border-white/5 p-6 rounded-[2rem]">
             <div className="text-right">
                <span className="text-[9px] font-mono font-black text-slate-600 uppercase tracking-widest block mb-1">Growth_Index</span>
                <span className="text-2xl font-mono font-black text-brand-primary">OPTIMAL</span>
             </div>
          </div>
        )}
      </header>

      <AnimatePresence mode="wait">
        <motion.div 
          key={activeNode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: 'circOut' }}
        >
          {renderTreeContent()}
        </motion.div>
      </AnimatePresence>

      {activeNode === 'ROOT' && (
        <section className="bg-slate-900/20 border border-white/5 rounded-[3rem] p-10 mt-12">
           <div className="flex items-center gap-4 mb-8">
              <Network className="text-brand-primary" size={24} />
              <h3 className="text-xl font-display font-black text-white uppercase tracking-tight">Active Neural Threads</h3>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <LogBit label="Sync_Status" val="ENCRYPTED" />
              <LogBit label="Memory_Alloc" val="STABLE" />
              <LogBit label="Lat_Coord" val="NODE_A1" />
              <LogBit label="Uptime" val="12d 04h" />
           </div>
        </section>
      )}
    </div>
  );
}

function TreeBranch({ label, icon, id, meta, onClick, color }: { label: string, icon: any, id: string, meta: string, onClick: () => void, color: string }) {
  const colorMap: any = {
    indigo: 'from-indigo-500/20 to-transparent border-indigo-500/20 text-indigo-400',
    rose: 'from-rose-500/20 to-transparent border-rose-500/20 text-rose-400',
    emerald: 'from-emerald-500/20 to-transparent border-emerald-500/20 text-emerald-400',
  };

  return (
    <button 
      onClick={onClick}
      className={`relative group p-10 rounded-[3rem] bg-gradient-to-br ${colorMap[color]} border flex flex-col justify-between min-h-[340px] text-left transition-all hover:scale-[1.02] active:scale-95`}
    >
       <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mb-12 shadow-2xl group-hover:shadow-indigo-500/10 transition-all border border-white/5">
          {React.cloneElement(icon, { size: 28, className: 'group-hover:scale-110 transition-transform' })}
       </div>
       <div>
          <h3 className="text-3xl font-display font-black text-white uppercase tracking-tighter mb-2 leading-none">{label}</h3>
          <p className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">{meta}</p>
       </div>
       <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight size={24} className="text-white" />
       </div>
    </button>
  );
}

function EducationalNode({ data, onBack }: { data: any, onBack: () => void }) {
  return (
    <div className="space-y-8">
       <button onClick={onBack} className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest flex items-center gap-2 mb-4 hover:text-white transition-colors">
          <ChevronRight className="rotate-180" size={14} /> Back_To_Root
       </button>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.goals.map((goal: any) => (
             <div key={goal.id} className="p-8 bg-slate-900/40 border border-white/5 rounded-[2.5rem] group hover:border-indigo-500/30 transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5"><GraduationCap size={80} /></div>
                <div className="flex justify-between items-start mb-10">
                   <h4 className="text-xl font-display font-black text-white uppercase tracking-tight">{goal.title}</h4>
                   <span className="text-xs font-mono font-black text-indigo-400">{goal.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden p-[1px] border border-white/5">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${goal.progress}%` }}
                     className="h-full bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.4)]"
                   />
                </div>
             </div>
          ))}
          {data.goals.length === 0 && <EmptyLeaf label="No Knowledge Branches Found" />}
       </div>
    </div>
  );
}

function BehavioralNode({ data, onBack }: { data: any, onBack: () => void }) {
  return (
    <div className="space-y-8">
       <button onClick={onBack} className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest flex items-center gap-2 mb-4 hover:text-white transition-colors">
          <ChevronRight className="rotate-180" size={14} /> Back_To_Root
       </button>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.habits.map((habit: any) => (
             <div key={habit.id} className="p-8 bg-slate-900 border border-white/5 rounded-[2.5rem] flex flex-col justify-between min-h-[220px] group hover:border-rose-500/30">
                <div className="flex justify-between items-start mb-6">
                   <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${habit.type === 'good' ? 'bg-emerald-500' : 'bg-rose-500'} shadow-lg`} />
                      <h4 className="text-xl font-display font-black text-white uppercase tracking-tight">{habit.title}</h4>
                   </div>
                   <Activity size={20} className="text-slate-800 group-hover:text-rose-500 transition-colors" />
                </div>
                <div className="flex gap-2">
                   {habit.weekLog.map((val: number, i: number) => (
                      <div key={i} className={`flex-1 h-3 rounded-full ${val === 1 ? 'bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-slate-800'}`} />
                   ))}
                </div>
             </div>
          ))}
          {data.habits.length === 0 && <EmptyLeaf label="No Behavioral Paths Mapped" />}
       </div>
    </div>
  );
}

function FinancialNode({ data, onBack }: { data: any, onBack: () => void }) {
  return (
    <div className="space-y-8">
       <button onClick={onBack} className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest flex items-center gap-2 mb-4 hover:text-white transition-colors">
          <ChevronRight className="rotate-180" size={14} /> Back_To_Root
       </button>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.trades.slice(-6).reverse().map((trade: any) => (
             <div key={trade.id} className="p-8 bg-slate-900 border border-white/5 rounded-[2.5rem] flex items-center justify-between group hover:border-emerald-500/30">
                <div className="flex items-center gap-6">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${trade.pnl_amount >= 0 ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'}`}>
                      {trade.pnl_amount >= 0 ? <TrendingUp size={24} /> : <Binary size={24} />}
                   </div>
                   <div>
                      <h4 className="text-lg font-display font-black text-white uppercase">{trade.market}</h4>
                      <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest mt-1">{trade.date.split('T')[0]}</p>
                   </div>
                </div>
                <div className={`text-2xl font-display font-black ${trade.pnl_amount >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                   {trade.pnl_amount >= 0 ? '+' : ''}${Math.abs(trade.pnl_amount)}
                </div>
             </div>
          ))}
          {data.trades.length === 0 && <EmptyLeaf label="No Financial Transmissions Detected" />}
       </div>
    </div>
  );
}

function EmptyLeaf({ label }: { label: string }) {
  return (
    <div className="col-span-full py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-slate-900/10">
       <Database size={48} className="mx-auto mb-6 text-slate-800 opacity-20" />
       <p className="text-[10px] font-mono font-black text-slate-700 uppercase tracking-widest">{label}</p>
    </div>
  );
}

function LogBit({ label, val }: { label: string, val: string }) {
  return (
    <div className="text-left">
       <span className="text-[8px] font-mono font-black text-slate-700 uppercase tracking-widest block mb-1">{label}</span>
       <span className="text-xs font-mono font-black text-slate-400 uppercase tracking-tight">{val}</span>
    </div>
  );
}
