
import React, { useState, useEffect } from 'react';
import { User, InventoryItem, Product, UserRole, Customer, Order } from '../types';
import { mockService } from '../services/mockDataService';
import { InviteBuyerModal } from './InviteBuyerModal';
import { ChatDialog } from './ChatDialog';
import { 
  X, Search, Plus, UserPlus, Mail, Smartphone, 
  MessageSquare, Camera, ChevronRight, Globe, Zap, Clock,
  TrendingUp, Users as UsersIcon, Filter, MoreVertical,
  CheckCircle2, Store, Handshake
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ContactsProps {
  user: User;
}

export const Contacts: React.FC<ContactsProps> = ({ user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'MY BUYERS' | 'PENDING SOURCING' | 'MARKET DIRECTORY'>('MY BUYERS');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal States
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [activeChatBuyer, setActiveChatBuyer] = useState<any | null>(null);
  
  // Data State
  const [myCustomers, setMyCustomers] = useState<Customer[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [directoryUsers, setDirectoryUsers] = useState<User[]>([]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [user.id]);

  const loadData = () => {
    setMyCustomers(mockService.getCustomers().filter(c => c.connectedSupplierId === user.id));
    setAllOrders(mockService.getOrders(user.id));
    // Market Directory includes everyone except self
    setDirectoryUsers(mockService.getAllUsers().filter(u => u.id !== user.id));
  };

  const getFilteredList = () => {
      if (activeTab === 'MY BUYERS') {
          return myCustomers.filter(c => 
              c.businessName.toLowerCase().includes(searchTerm.toLowerCase()) || 
              c.contactName.toLowerCase().includes(searchTerm.toLowerCase())
          ).map(c => ({
              id: c.id,
              businessName: c.businessName,
              category: c.category,
              email: c.email || 'SYSTEM_GEN',
              phone: c.phone || '0400 000 000',
              status: 'ACTIVE'
          }));
      } else if (activeTab === 'MARKET DIRECTORY') {
          return directoryUsers.filter(u => 
              u.businessName.toLowerCase().includes(searchTerm.toLowerCase()) || 
              u.name.toLowerCase().includes(searchTerm.toLowerCase())
          ).map(u => ({
              id: u.id,
              businessName: u.businessName,
              category: u.role,
              email: u.email,
              phone: u.phone || '04XX XXX XXX',
              status: 'DISCOVERED'
          }));
      }
      return [];
  };

  const filteredList = getFilteredList();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* HEADER SECTION MATCHING SCREENSHOT */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-2">
          <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-900">
                 <UsersIcon size={28} strokeWidth={2.5} />
              </div>
              <div>
                  <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase leading-none">Buyer Network</h1>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                      Connected Accounts & Manual Lead Management
                  </p>
              </div>
          </div>
          
          <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-indigo-600 transition-colors" size={18}/>
              <input 
                placeholder="Filter network..." 
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-indigo-50/10 shadow-sm"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
          </div>
      </div>

      {/* TAB SELECTOR MATCHING SCREENSHOT */}
      <div className="flex bg-gray-100/60 p-1.5 rounded-[2rem] w-fit border border-gray-200/50 shadow-inner-sm mx-2">
        {['MY BUYERS', 'PENDING SOURCING', 'MARKET DIRECTORY'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-10 py-4 rounded-[1.75rem] text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab 
                ? 'bg-white text-gray-900 shadow-xl ring-1 ring-black/5' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* SCROLLABLE GRID AREA */}
      <div className="flex gap-8 overflow-x-auto no-scrollbar pb-12 px-2 min-h-[500px]">
          
          {/* PROVISION BUYER CARD (DOTTED) - ONLY IN MY BUYERS */}
          {activeTab === 'MY BUYERS' && (
              <div 
                onClick={() => setIsInviteModalOpen(true)}
                className="min-w-[360px] border-4 border-dashed border-gray-100 bg-white/50 rounded-[3rem] flex flex-col items-center justify-center text-center p-12 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all cursor-pointer group shrink-0"
              >
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-gray-50 flex items-center justify-center text-emerald-500 mb-8 group-hover:scale-110 transition-transform">
                      <UserPlus size={40} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-400 group-hover:text-gray-900 tracking-tight uppercase leading-none mb-4">Provision Buyer</h3>
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[0.15em] max-w-[200px] leading-relaxed">
                      Generate a direct-connect onboarding portal link
                  </p>
              </div>
          )}

          {/* DYNAMIC LISTING OF CARDS */}
          {filteredList.map(entity => {
              const entityOrders = allOrders.filter(o => (o.buyerId === entity.id || o.sellerId === entity.id));
              const volumeTotal = entityOrders.reduce((sum, o) => sum + o.totalAmount, 0);

              return (
                  <div key={entity.id} className="min-w-[460px] bg-white rounded-[3rem] p-12 border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-2xl transition-all duration-500 shrink-0 group">
                      <div>
                        <div className="flex justify-between items-start mb-12">
                            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center font-black text-3xl text-indigo-600 shadow-inner-sm border border-indigo-100/50 uppercase">
                                {entity.businessName.charAt(0)}
                            </div>
                            <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-full border border-emerald-100 shadow-sm flex items-center gap-2">
                                <UserPlus size={14} strokeWidth={3} /> ACTIVE
                            </span>
                        </div>

                        <h3 className="text-[28px] font-black text-gray-900 tracking-tighter uppercase leading-none mb-2">{entity.businessName}</h3>
                        <p className="text-[11px] text-gray-400 font-black uppercase tracking-[0.2em] mb-10">{entity.category}</p>

                        <div className="grid grid-cols-2 gap-6 mb-10">
                            <div className="bg-gray-50/80 p-6 rounded-3xl border border-gray-100 group-hover:bg-white transition-colors">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <TrendingUp size={12} /> VOLUME
                                </p>
                                <p className="text-xl font-black text-gray-900 tracking-tighter">${volumeTotal.toLocaleString()}</p>
                            </div>
                            <div className="bg-gray-50/80 p-6 rounded-3xl border border-gray-100 group-hover:bg-white transition-colors">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Clock size={12} /> PARTNERSHIP
                                </p>
                                <p className="text-xl font-black text-gray-900 tracking-tighter uppercase">ACTIVE</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-12">
                            <div className="flex items-center gap-4 text-gray-400 text-sm font-bold uppercase tracking-tight">
                                <Mail size={18} className="text-gray-300" />
                                <span className="truncate">{entity.email}</span>
                            </div>
                            <div className="flex items-center gap-4 text-gray-400 text-sm font-bold uppercase tracking-tight">
                                <Smartphone size={18} className="text-gray-300" />
                                <span>{entity.phone}</span>
                            </div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                          <button 
                            onClick={() => navigate('/pricing')}
                            className="flex-1 py-5 bg-white border-2 border-indigo-600 text-indigo-600 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-indigo-50 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-sm"
                          >
                              <Camera size={18}/> OFFER
                          </button>
                          <button 
                            onClick={() => setActiveChatBuyer(entity)}
                            className="flex-[2] py-5 bg-[#043003] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(4,48,3,0.2)] hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-95"
                          >
                              <MessageSquare size={18}/> MANAGE
                          </button>
                      </div>
                  </div>
              );
          })}

          {filteredList.length === 0 && activeTab === 'MARKET DIRECTORY' && (
              <div className="flex flex-col items-center justify-center min-w-[600px] opacity-30 grayscale">
                  <Globe size={80} className="text-gray-300 mb-6"/>
                  <p className="text-xl font-black uppercase tracking-widest text-gray-400">Searching Network Registry...</p>
              </div>
          )}
      </div>

      <InviteBuyerModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} wholesaler={user} />
      
      <ChatDialog 
        isOpen={!!activeChatBuyer} 
        onClose={() => setActiveChatBuyer(null)} 
        orderId="NETWORK-THREAD" 
        issueType="Direct Trade Channel"
        repName={activeChatBuyer?.businessName || 'Partner'}
      />
    </div>
  );
};
