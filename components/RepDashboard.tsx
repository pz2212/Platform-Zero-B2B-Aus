
import React, { useState, useEffect, useMemo } from 'react';
import { User, Customer, Order, Lead, AuState, LeadStatus } from '../types';
import { mockService } from '../services/mockDataService';
import { 
  Users, AlertCircle, CheckCircle, MessageSquare, TrendingUp, 
  DollarSign, Clock, Calendar, ChevronRight, Filter, Search,
  Plus, Target, Briefcase, History, Wallet, Landmark, ArrowUpRight,
  Globe, LayoutGrid, Star, MapPin, Smartphone,
  // Fix: Added missing ArrowRight import
  ArrowRight
} from 'lucide-react';

interface RepDashboardProps {
  user: User;
}

const AU_STATES: AuState[] = ['VIC', 'NSW', 'SA', 'QLD', 'WA', 'TAS', 'NT', 'ACT'];

const STAGES: { id: LeadStatus, label: string, color: string }[] = [
    { id: 'DISCOVERY', label: 'DISCOVERY', color: 'bg-blue-600' },
    { id: 'ENGAGEMENT', label: 'ENGAGEMENT', color: 'bg-indigo-600' },
    { id: 'PROPOSAL', label: 'PROPOSAL', color: 'bg-purple-600' },
    { id: 'CLOSING', label: 'CLOSING', color: 'bg-orange-600' },
    { id: 'ONBOARDED', label: 'ONBOARDED', color: 'bg-emerald-600' }
];

// Fix: Use React.FC to handle special props like 'key' correctly in TypeScript
const PipelineCard: React.FC<{ lead: Lead, onAdvance: (l: Lead) => void }> = ({ lead, onAdvance }) => (
    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all group flex flex-col justify-between min-h-[180px] animate-in zoom-in-95 duration-300">
        <div>
            <h4 className="font-black text-gray-900 text-sm uppercase tracking-tight mb-4">{lead.businessName}</h4>
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                <MapPin size={10} className="shrink-0"/> {lead.suburb}, {lead.state}
            </div>
            <div className="text-indigo-600 font-black text-xs uppercase tracking-widest mb-6">
                ${lead.potentialRevenue.toLocaleString()} / mo
            </div>
        </div>
        
        {lead.status !== 'ONBOARDED' && (
            <div className="flex gap-2">
                <button 
                    onClick={() => onAdvance(lead)}
                    className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-black transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    {/* Fix: ArrowRight is now correctly imported */}
                    ADVANCE <ArrowRight size={14} strokeWidth={3}/>
                </button>
                <button className="p-3 bg-gray-50 border border-gray-100 text-gray-300 rounded-xl hover:text-indigo-600 transition-all shadow-sm">
                    <Smartphone size={16}/>
                </button>
            </div>
        )}
    </div>
);

export const RepDashboard: React.FC<RepDashboardProps> = ({ user }) => {
  const [assignedCustomers, setAssignedCustomers] = useState<Customer[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<any>({
      totalSales: 0,
      commissionMade: 0,
      commissionComing: 0,
      customerCount: 0,
      opportunitiesManaged: 0
  });
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PIPELINE' | 'NETWORK' | 'LEDGER'>('OVERVIEW');
  const [selectedState, setSelectedState] = useState<AuState | 'ALL'>('ALL');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [user.id]);

  const loadData = () => {
    const customers = mockService.getRepCustomers(user.id);
    setAssignedCustomers(customers);
    setStats(mockService.getRepStats(user.id));
    setLeads(mockService.getLeads());
  };

  const handleAdvance = (lead: Lead) => {
    const currentIndex = STAGES.findIndex(s => s.id === lead.status);
    if (currentIndex < STAGES.length - 1) {
        const nextStage = STAGES[currentIndex + 1].id;
        mockService.updateLeadStatus(lead.id, nextStage);
        loadData();
    }
  };

  const commissionLog = useMemo(() => {
      if (!stats.orders) return [];
      return stats.orders.map((o: Order) => ({
          id: o.id,
          date: o.date,
          customerName: assignedCustomers.find(c => c.id === o.buyerId)?.businessName || 'Unknown Entity',
          amount: o.totalAmount,
          commission: o.totalAmount * ((user.commissionRate || 5) / 100),
          status: o.paymentStatus || 'Settled'
      })).sort((a: any, b: any) => b.id.localeCompare(a.id));
  }, [stats.orders, assignedCustomers, user.commissionRate]);

  return (
    <div className="space-y-10 pb-24 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
        
        {/* TOP THEMED HEADER */}
        <div className="bg-[#0B1221] text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-5 transform rotate-12 scale-150 pointer-events-none group-hover:rotate-0 transition-transform duration-1000">
                <LayoutGrid size={240}/>
            </div>
            
            <div className="relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <div className="bg-[#10B981]/20 border border-[#10B981]/30 text-[#10B981] px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2 w-fit">
                            <Star size={12} fill="currentColor"/> TOP PERFORMING CONSULTANT
                        </div>
                        <h1 className="text-6xl font-black tracking-tighter uppercase leading-none mb-3">HELLO, {user.name.split(' ')[0]}</h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm flex items-center gap-3">
                            Sales Representative <span className="text-[#10B981]">ID: PZ-CON-R1</span>
                        </p>
                    </div>
                    <button className="px-8 py-4 bg-[#10B981] hover:bg-[#059669] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#10B981]/20 transition-all active:scale-95 flex items-center gap-3">
                        <Plus size={20}/> ADD NEW LEAD
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white/5 p-8 rounded-3xl backdrop-blur-md border border-white/10 group/card hover:bg-white/10 transition-all cursor-default">
                        <div className="flex items-center gap-3 text-emerald-400 mb-6 font-black text-[10px] uppercase tracking-[0.2em]">
                            <div className="p-2 bg-emerald-500/20 rounded-xl"><CheckCircle size={16}/></div>
                            MONEY MADE
                        </div>
                        <div className="text-5xl font-black tracking-tighter mb-2">
                            ${stats.commissionMade.toLocaleString(undefined, {minimumFractionDigits: 2})}
                        </div>
                        <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">REALIZED COMMISSIONS (YTD)</div>
                    </div>

                    <div className="bg-white/5 p-8 rounded-3xl backdrop-blur-md border border-white/10 group/card hover:bg-white/10 transition-all cursor-default">
                        <div className="flex items-center gap-3 text-orange-400 mb-6 font-black text-[10px] uppercase tracking-[0.2em]">
                            <div className="p-2 bg-orange-500/20 rounded-xl"><Clock size={16}/></div>
                            MONEY COMING
                        </div>
                        <div className="text-5xl font-black tracking-tighter mb-2">
                            ${stats.commissionComing.toLocaleString(undefined, {minimumFractionDigits: 2})}
                        </div>
                        <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">PENDING SETTLEMENT</div>
                    </div>

                    <div className="bg-white/5 p-8 rounded-3xl backdrop-blur-md border border-white/10 group/card hover:bg-white/10 transition-all cursor-default">
                        <div className="flex items-center gap-3 text-blue-400 mb-6 font-black text-[10px] uppercase tracking-[0.2em]">
                            <div className="p-2 bg-blue-500/20 rounded-xl"><Users size={16}/></div>
                            LEAD PIPELINE
                        </div>
                        <div className="text-5xl font-black tracking-tighter mb-2">
                            {stats.opportunitiesManaged}
                        </div>
                        <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">OPPORTUNITIES MANAGED</div>
                    </div>
                </div>
            </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex bg-gray-100/50 p-2 rounded-[2.5rem] w-fit border border-gray-200/50 shadow-inner-sm mx-2">
            {['OVERVIEW', 'PIPELINE', 'NETWORK', 'LEDGER'].map((tab: any) => (
                <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-12 py-4 rounded-[1.75rem] text-[10px] font-black uppercase tracking-[0.25em] transition-all whitespace-nowrap ${
                        activeTab === tab 
                        ? 'bg-white text-indigo-700 shadow-xl ring-1 ring-black/5' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                    {tab}
                </button>
            ))}
        </div>

        {activeTab === 'PIPELINE' ? (
            /* PIPELINE KANBAN BOARD - MATCHES SCREENSHOT */
            <div className="px-2 overflow-x-auto no-scrollbar">
                <div className="flex gap-6 min-w-[1400px]">
                    {STAGES.map(stage => {
                        const stageLeads = leads.filter(l => l.status === stage.id);
                        return (
                            <div key={stage.id} className="flex-1 min-w-[280px] space-y-6">
                                <div className="flex items-center justify-between px-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-1 h-6 ${stage.color} rounded-full`}></div>
                                        <h3 className="font-black text-gray-900 text-xs uppercase tracking-widest">{stage.label}</h3>
                                    </div>
                                    <span className="text-[10px] font-black text-gray-400">{stageLeads.length}</span>
                                </div>

                                <div className="space-y-4">
                                    {stageLeads.map(lead => (
                                        <PipelineCard key={lead.id} lead={lead} onAdvance={handleAdvance} />
                                    ))}
                                    
                                    {/* Placeholder Add Card */}
                                    <div className="bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-[2rem] p-6 flex items-center justify-center text-gray-300 hover:border-indigo-300 hover:text-indigo-400 transition-all cursor-pointer group">
                                        <Plus size={24} strokeWidth={2.5} className="group-hover:scale-110 transition-transform"/>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-2">
                
                {/* MAIN CONTENT AREA */}
                <div className="lg:col-span-8 space-y-10">
                    {activeTab === 'OVERVIEW' && (
                        <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[600px] flex flex-col animate-in slide-in-from-left-4">
                            <div className="p-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/20">
                                <div className="flex items-center gap-5">
                                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100/50">
                                        <Target size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight leading-none">High Value Targets</h3>
                                    </div>
                                </div>
                                <button onClick={() => setActiveTab('PIPELINE')} className="text-indigo-600 font-black text-[9px] uppercase tracking-widest hover:underline transition-all">VIEW PIPELINE</button>
                            </div>
                            
                            <div className="p-10 space-y-4 flex-1">
                                {leads.filter(l => l.assignedRepId === user.id).length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center opacity-20 py-32">
                                        <Target size={80} className="text-gray-300 mb-6" />
                                        <p className="font-black uppercase tracking-widest text-xs">No targets currently assigned</p>
                                    </div>
                                ) : leads.filter(l => l.assignedRepId === user.id).map(lead => (
                                    <div key={lead.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all flex justify-between items-center group cursor-pointer active:scale-[0.98]">
                                        <div className="flex items-center gap-8">
                                            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xl shadow-inner-sm uppercase border border-indigo-100/50 group-hover:scale-105 transition-transform">
                                                {lead.businessName.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-gray-900 text-lg uppercase tracking-tight mb-1 group-hover:text-indigo-600 transition-colors">{lead.businessName}</h4>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">{lead.suburb}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-10">
                                            <div className="text-right">
                                                <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-1">Pot. Revenue</p>
                                                <p className="text-2xl font-black text-emerald-600 tracking-tighter leading-none">${lead.potentialRevenue.toLocaleString()}</p>
                                            </div>
                                            <div className="p-2.5 bg-gray-50 text-gray-300 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
                                                <ChevronRight size={20} strokeWidth={3}/>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* SIDEBAR: ACTIVE COMMISSIONS */}
                <div className="lg:col-span-4">
                    <div className="bg-[#5c56d6] text-white rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(92,86,214,0.3)] overflow-hidden flex flex-col h-full min-h-[700px] animate-in slide-in-from-right-4 duration-700">
                        <div className="p-10 border-b border-white/10 shrink-0">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-80 mb-2">Active Commissions</h3>
                            <div className="h-1 w-12 bg-white/20 rounded-full"></div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-8">
                            {commissionLog.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-40">
                                    <Landmark size={64} className="mb-6" />
                                    <p className="font-black uppercase tracking-[0.2em] text-xs">No settlements logged yet</p>
                                </div>
                            ) : commissionLog.map((log: any) => (
                                <div key={log.id} className="relative group transition-all">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1.5">
                                            <h4 className="font-black text-white text-base tracking-tighter uppercase">REF: {log.id.split('-').pop()}</h4>
                                            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{log.status === 'Paid' ? 'Order Settled' : 'Payment Processing'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-[#10B981] tracking-tighter animate-in fade-in slide-in-from-right-2 duration-700">
                                                +${log.commission.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="h-px bg-white/10 w-full mt-8"></div>
                                </div>
                            ))}
                        </div>

                        <div className="p-10 bg-white/5 backdrop-blur-md border-t border-white/10 shrink-0">
                            <button className="w-full py-5 bg-white text-[#5c56d6] rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all hover:bg-indigo-50">
                                DETAILED LEDGER <ArrowUpRight size={18} strokeWidth={3}/>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        )}
    </div>
  );
};
