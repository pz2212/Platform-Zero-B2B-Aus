
import React, { useState, useEffect, useMemo } from 'react';
import { User, UserRole, Customer } from '../types';
import { mockService } from '../services/mockDataService';
import { 
  Users, TrendingUp, DollarSign, Award, ArrowRight, 
  BarChart, PieChart, Activity, UserPlus, ChevronDown,
  Search, Filter, MoreVertical, Plus, CreditCard,
  Target, Zap, Briefcase
} from 'lucide-react';

export const AdminRepManagement: React.FC = () => {
  const [reps, setReps] = useState<User[]>([]);
  const [repStats, setRepStats] = useState<Record<string, any>>({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    const allReps = mockService.getPzRepresentatives();
    setReps(allReps);

    const stats: Record<string, any> = {};
    allReps.forEach(rep => {
        stats[rep.id] = mockService.getRepStats(rep.id);
    });
    setRepStats(stats);
  };

  const totals = useMemo(() => {
    const statsArray = Object.values(repStats);
    return {
        sales: statsArray.reduce((sum, s: any) => sum + s.totalSales, 0),
        commissions: statsArray.reduce((sum, s: any) => sum + s.commissionMade, 0),
        reps: reps.length,
        leads: mockService.getRegistrationRequests().filter(r => r.status === 'Pending').length
    };
  }, [repStats, reps]);

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 px-2">
        <div>
          <h1 className="text-[44px] font-black text-[#0F172A] tracking-tighter uppercase leading-none">Team & Performance</h1>
          <p className="text-gray-400 font-bold text-xs tracking-widest mt-3 uppercase">Overseeing sales consultants & network growth</p>
        </div>
        <button 
          className="px-10 py-5 bg-[#043003] text-white rounded-[1.25rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all active:scale-95 flex items-center gap-3 group"
        >
          <UserPlus size={18} className="group-hover:rotate-12 transition-transform" />
          Provision New Rep
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
        {[
            { label: 'Team Sales', value: `$${totals.sales.toLocaleString()}`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Commissions Paid', value: `$${totals.commissions.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Active Reps', value: totals.reps, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Market Leads', value: totals.leads, icon: Activity, color: 'text-orange-600', bg: 'bg-orange-50' }
        ].map((kpi, idx) => (
            <div key={idx} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between h-48 group hover:shadow-xl transition-all">
                <div className="flex justify-between items-start">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">{kpi.label}</p>
                    <div className={`p-3 ${kpi.bg} ${kpi.color} rounded-2xl group-hover:scale-110 transition-transform shadow-inner-sm border border-white/50`}>
                        <kpi.icon size={20} strokeWidth={2.5}/>
                    </div>
                </div>
                <h3 className="text-[44px] font-black text-gray-900 tracking-tighter leading-none">{kpi.value}</h3>
            </div>
        ))}
      </div>

      {/* Leaderboard Section */}
      <div className="bg-white border border-gray-200 rounded-[3.5rem] shadow-sm overflow-visible">
        <div className="p-10 border-b border-gray-100 flex flex-col xl:flex-row justify-between items-center gap-8 bg-gray-50/20">
            <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-yellow-500 shadow-md border border-gray-100 shrink-0">
                    <Award size={32} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase leading-none">Performance Leaderboard</h2>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">Stack ranking network representatives</p>
                </div>
            </div>

            <div className="relative w-full sm:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input 
                    type="text" 
                    placeholder="Filter team..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-900 focus:ring-8 focus:ring-indigo-50/5 outline-none transition-all shadow-sm" 
                />
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-white border-b border-gray-100 text-[9px] font-black text-gray-400 uppercase tracking-[0.25em]">
                    <tr>
                        <th className="px-12 py-8 min-w-[280px]">Consultant Identity</th>
                        <th className="px-8 py-8 text-center">Lead Pipeline</th>
                        <th className="px-8 py-8 text-right">Aggregate Sales</th>
                        <th className="px-8 py-8 text-center">Commission Rate</th>
                        <th className="px-8 py-8 text-right text-emerald-600">Earned (YTD)</th>
                        <th className="px-12 py-8 text-center">Account Health</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {reps.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase())).map(rep => {
                        const stats = repStats[rep.id] || { totalSales: 0, commissionMade: 0, customerCount: 0, health: 80, grade: 'B' };
                        return (
                            <tr key={rep.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                                <td className="px-12 py-8">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center font-black text-xl text-indigo-600 shadow-inner-sm border border-indigo-100/50">
                                            {rep.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-black text-gray-900 text-base uppercase tracking-tight leading-none mb-1.5">{rep.name}</div>
                                            <div className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{rep.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-8 text-center">
                                    <span className="bg-gray-100 text-gray-500 px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-gray-200">
                                        {stats.customerCount} Active Clients
                                    </span>
                                </td>
                                <td className="px-8 py-8 text-right font-black text-gray-900 text-lg tracking-tighter">
                                    ${stats.totalSales.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                </td>
                                <td className="px-8 py-8 text-center">
                                    <span className="text-indigo-600 font-black text-xs uppercase tracking-widest">{rep.commissionRate}%</span>
                                </td>
                                <td className="px-8 py-8 text-right">
                                    <div className="font-black text-emerald-600 text-xl tracking-tighter">${stats.commissionMade.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                                </td>
                                <td className="px-12 py-8 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="flex items-center gap-3 w-full max-w-[120px]">
                                            <div className="h-2 flex-1 bg-gray-100 rounded-full overflow-hidden shadow-inner-sm">
                                                <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{width: `${stats.health}%`}}></div>
                                            </div>
                                            <span className="font-black text-gray-900 text-[10px] uppercase tracking-tighter">{stats.grade}</span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    {reps.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-10 py-32 text-center text-gray-300">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Users size={40} className="opacity-20"/>
                                </div>
                                <p className="font-black uppercase tracking-widest text-xs">No matching representatives</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};
