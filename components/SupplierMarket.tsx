
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole, Product, InventoryItem, ProcurementRequest } from '../types';
import { mockService } from '../services/mockDataService';
import { 
  Store, MapPin, Tag, MessageSquare, ChevronDown, ChevronUp, ShoppingCart, 
  X, CheckCircle, Bell, DollarSign, Truck, Send, 
  TrendingUp, Loader2, Users, Zap, Star, AlertCircle, Package, ArrowRight,
  HelpCircle, BrainCircuit, ShieldCheck, Globe, Info, Search, Filter, 
  Lock, ShoppingBag, Plus, Sparkles, MessageCircle, Link as LinkIcon,
  UserPlus, UserCheck, Calculator, Activity,
  /* Added missing icons */
  Eye, ChevronRight, Clock
} from 'lucide-react';
import { ChatDialog } from './ChatDialog';

interface SupplierMarketProps {
  user: User;
}

export const SupplierMarket: React.FC<SupplierMarketProps> = ({ user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'MY_NETWORK' | 'DISCOVERY' | 'QUOTES'>('DISCOVERY');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Data State
  const [allSuppliers, setAllSuppliers] = useState<User[]>([]);
  const [procurementRequests, setProcurementRequests] = useState<ProcurementRequest[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  
  // UI State
  const [expandedSupplierId, setExpandedSupplierId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatTargetName, setChatTargetName] = useState('');
  
  // Quote Request State
  const [requestingPriceItem, setRequestingPriceItem] = useState<{item: InventoryItem, product: Product, supplier: User} | null>(null);
  const [requestQty, setRequestQty] = useState('100');
  const [requestDate, setRequestDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  const products = mockService.getAllProducts();

  useEffect(() => {
    loadMarketData();
    const interval = setInterval(loadMarketData, 5000);
    return () => clearInterval(interval);
  }, [user.id]);

  const loadMarketData = () => {
    const allUsers = mockService.getAllUsers();
    // Filter for wholesalers and farmers, excluding self
    const suppliers = allUsers.filter(u => 
      (u.role === UserRole.WHOLESALER || u.role === UserRole.FARMER) && u.id !== user.id
    );
    setAllSuppliers(suppliers);
    setInventory(mockService.getAllInventory());
    setProcurementRequests(mockService.getProcurementRequests(user.id).filter(r => r.buyerId === user.id));
  };

  const handleConnect = (e: React.MouseEvent, supplier: User) => {
    e.stopPropagation();
    setChatTargetName(supplier.businessName);
    setIsChatOpen(true);
  };

  const submitPriceRequest = async () => {
      if (!requestingPriceItem || !requestQty) return;
      
      setIsSubmittingRequest(true);
      const req: ProcurementRequest = {
          id: `proc-${Date.now()}`,
          buyerId: user.id,
          buyerName: user.businessName,
          supplierId: requestingPriceItem.supplier.id,
          productId: requestingPriceItem.product.id,
          productName: requestingPriceItem.product.name,
          quantity: parseFloat(requestQty),
          unit: requestingPriceItem.product.unit || 'KG',
          requiredDate: requestDate,
          requiredTime: 'Morning Delivery',
          status: 'PENDING',
          timestamp: new Date().toISOString()
      };

      mockService.addProcurementRequest(req);
      
      // Simulate network delay
      await new Promise(r => setTimeout(r, 1000));
      
      setIsSubmittingRequest(false);
      setRequestingPriceItem(null);
      alert("Price request dispatched! You'll be notified when the supplier quotes.");
      loadMarketData();
  };

  const myNetworkSuppliers = useMemo(() => {
    // Logic: Suppliers I've either bought from or are explicitly marked as my agents
    const orders = mockService.getOrders(user.id).filter(o => o.buyerId === user.id);
    const sellerIds = new Set(orders.map(o => o.sellerId));
    return allSuppliers.filter(s => sellerIds.has(s.id));
  }, [allSuppliers, user.id]);

  const filteredDiscovery = allSuppliers.filter(s => 
    s.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.activeSellingInterests?.some(i => i.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
        <div>
            <h1 className="text-[44px] font-black text-[#0F172A] tracking-tighter uppercase leading-none">Supplier Market</h1>
            <p className="text-gray-400 font-bold text-sm tracking-tight mt-2 flex items-center gap-3 uppercase">
                Direct Procurement & Partner Discovery <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span> {user.businessName}
            </p>
        </div>
        
        <div className="flex bg-gray-100 p-1.5 rounded-2xl gap-1 border border-gray-200 shadow-inner-sm w-full md:w-auto">
            <button 
                onClick={() => setActiveTab('DISCOVERY')}
                className={`flex-1 md:flex-none px-8 py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${activeTab === 'DISCOVERY' ? 'bg-white text-gray-900 shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
            >
                <Globe size={16}/> Market Registry
            </button>
            <button 
                onClick={() => setActiveTab('MY_NETWORK')}
                className={`flex-1 md:flex-none px-8 py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${activeTab === 'MY_NETWORK' ? 'bg-white text-gray-900 shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
            >
                <UserCheck size={16}/> My Partners
            </button>
            <button 
                onClick={() => setActiveTab('QUOTES')}
                className={`flex-1 md:flex-none px-8 py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${activeTab === 'QUOTES' ? 'bg-white text-gray-900 shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
            >
                <Calculator size={16}/> Active Quotes {procurementRequests.filter(r => r.status === 'QUOTED').length > 0 && <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>}
            </button>
        </div>
      </div>

      {activeTab === 'DISCOVERY' && (
        <div className="space-y-8 px-2 animate-in slide-in-from-right-4">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={24}/>
                    <input 
                        placeholder="Search by business name or produce variety..." 
                        className="w-full pl-16 pr-8 py-5 bg-white border-2 border-gray-100 rounded-[2rem] font-bold text-lg outline-none focus:border-indigo-500 shadow-sm transition-all"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="px-10 py-5 bg-white border-2 border-gray-100 rounded-[2rem] text-gray-400 font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-2 hover:border-gray-200 transition-all shadow-sm">
                    <Filter size={20}/> Advanced Filter
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredDiscovery.map(supplier => {
                    const isExpanded = expandedSupplierId === supplier.id;
                    const supplierStock = inventory.filter(i => i.ownerId === supplier.id && i.status === 'Available');

                    return (
                        <div key={supplier.id} className={`bg-white rounded-[2.5rem] border transition-all overflow-hidden flex flex-col group ${isExpanded ? 'border-indigo-600 shadow-2xl lg:col-span-2' : 'border-gray-100 hover:border-indigo-200 shadow-sm'}`}>
                            <div 
                                onClick={() => setExpandedSupplierId(isExpanded ? null : supplier.id)}
                                className="p-8 flex flex-col justify-between h-full cursor-pointer hover:bg-gray-50/50 transition-colors"
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex items-center gap-5">
                                        <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black text-2xl shadow-inner-sm border ${supplier.role === 'FARMER' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                            {supplier.businessName.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none uppercase">{supplier.businessName}</h3>
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${supplier.role === 'FARMER' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>{supplier.role}</span>
                                                <span className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1"><MapPin size={12}/> {supplier.businessProfile?.businessLocation || 'SA Produce Market'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-2 bg-gray-50 rounded-xl text-gray-300 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all">
                                        {isExpanded ? <ChevronUp size={24}/> : <ChevronDown size={24}/>}
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Specialties</p>
                                    <div className="flex flex-wrap gap-2">
                                        {(supplier.activeSellingInterests || ['Fresh Produce', 'General Wholesale']).map(i => (
                                            <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-black uppercase tracking-tight">{i}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-6 border-t border-gray-50">
                                    <button 
                                        onClick={(e) => handleConnect(e, supplier)}
                                        className="flex-1 py-4 bg-white border-2 border-indigo-600 text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                                    >
                                        <MessageCircle size={16}/> Connect
                                    </button>
                                    <button 
                                        className="flex-[1.5] py-4 bg-[#0F172A] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2"
                                    >
                                        <Eye size={16}/> {isExpanded ? 'Hide Availability' : 'View Availability'}
                                    </button>
                                </div>
                            </div>

                            {/* AVAILABILITY MATRIX - EXPANDED VIEW */}
                            {isExpanded && (
                                <div className="border-t-2 border-indigo-600 bg-gray-50/30 p-10 animate-in slide-in-from-top-4 duration-500">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-100">
                                                <Activity size={20}/>
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">Live Availability Matrix</h4>
                                                <p className="text-xs text-indigo-600 font-bold uppercase tracking-widest">Real-time stock from {supplier.businessName}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {supplierStock.length === 0 ? (
                                        <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
                                            <Package size={48} className="mx-auto text-gray-200 mb-4"/>
                                            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No public inventory listed by this partner yet</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {supplierStock.map(item => {
                                                const p = products.find(prod => prod.id === item.productId);
                                                return (
                                                    <div key={item.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group/item flex flex-col justify-between">
                                                        <div className="mb-6">
                                                            <div className="w-full h-40 rounded-2xl overflow-hidden mb-4 border border-gray-100 bg-gray-50 shadow-inner-sm">
                                                                <img src={p?.imageUrl} className="w-full h-full object-cover transition-transform group-hover/item:scale-110" alt=""/>
                                                            </div>
                                                            <h5 className="text-lg font-black text-gray-900 uppercase tracking-tight">{p?.name}</h5>
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{p?.variety} • {item.quantityKg}{p?.unit || 'kg'} on-hand</p>
                                                        </div>
                                                        <button 
                                                            onClick={() => setRequestingPriceItem({item, product: p!, supplier})}
                                                            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 transition-all active:scale-95"
                                                        >
                                                            <Calculator size={14}/> Request Price
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
      )}

      {activeTab === 'MY_NETWORK' && (
        <div className="space-y-12 animate-in slide-in-from-left-4 duration-700 px-2">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                <div className="absolute bottom-0 right-0 p-10 opacity-[0.02] pointer-events-none transform translate-x-1/4 translate-y-1/4 scale-150"><Users size={200}/></div>
                <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-600 shadow-inner-sm border border-emerald-100 shrink-0">
                        <UserCheck size={40}/>
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight leading-none">Established Connections</h2>
                        <p className="text-gray-400 font-bold text-sm mt-2 uppercase tracking-widest">You have {myNetworkSuppliers.length} active supply partnerships</p>
                    </div>
                </div>
                <button 
                    onClick={() => setActiveTab('DISCOVERY')}
                    className="px-10 py-5 bg-[#0F172A] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] shadow-xl hover:bg-black transition-all active:scale-95 flex items-center gap-3"
                >
                    <Plus size={18}/> Provision New Partner
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {myNetworkSuppliers.length === 0 ? (
                    <div className="py-40 text-center opacity-30 grayscale bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                        <UserPlus size={80} className="mx-auto mb-6 text-gray-300"/>
                        <p className="text-lg font-black uppercase tracking-[0.2em] text-gray-400">No established supply partners yet</p>
                        <button onClick={() => setActiveTab('DISCOVERY')} className="mt-6 text-indigo-600 font-black uppercase text-xs hover:underline">Explore Marketplace Discovery</button>
                    </div>
                ) : myNetworkSuppliers.map(supplier => (
                    <div key={supplier.id} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8 group hover:shadow-xl transition-all">
                        <div className="flex items-center gap-8">
                            <div className={`w-20 h-20 rounded-[1.75rem] flex items-center justify-center font-black text-4xl shadow-inner-sm border ${supplier.role === 'FARMER' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                                {supplier.businessName.charAt(0)}
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight leading-none">{supplier.businessName}</h3>
                                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-inner-sm ${supplier.role === 'FARMER' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>{supplier.role}</span>
                                </div>
                                <div className="flex flex-wrap gap-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                                    <span className="flex items-center gap-2"><MapPin size={14} className="text-gray-300"/> Adelaide Regional Market</span>
                                    <span className="flex items-center gap-2"><Package size={14} className="text-emerald-400"/> Multiple Active Lines</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <button 
                                onClick={(e) => handleConnect(e, supplier)}
                                className="flex-1 md:flex-none px-10 py-4 bg-white border-2 border-indigo-600 text-indigo-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                            >
                                <MessageCircle size={18}/> Chat
                            </button>
                            <button 
                                onClick={() => { setExpandedSupplierId(supplier.id); setActiveTab('DISCOVERY'); }}
                                className="flex-1 md:flex-none px-12 py-4 bg-[#0F172A] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-slate-200"
                            >
                                Live Stock <ChevronRight size={18}/>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

      {activeTab === 'QUOTES' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 px-2">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Quote Management</h2>
                    <p className="text-sm text-gray-500 font-medium">Tracking {procurementRequests.length} sourcing inquiries</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {procurementRequests.length === 0 ? (
                    <div className="col-span-full py-40 text-center opacity-30 bg-white rounded-[3rem] border border-gray-100">
                        <ShoppingCart size={80} className="mx-auto mb-6 text-gray-300"/>
                        <p className="text-lg font-black uppercase tracking-[0.2em] text-gray-400">No active quotes on file</p>
                    </div>
                ) : procurementRequests.map(req => {
                    const supplier = allSuppliers.find(s => s.id === req.supplierId);
                    return (
                        <div key={req.id} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all animate-in zoom-in-95">
                            <div>
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-lg shadow-inner-sm">
                                            {supplier?.businessName.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-gray-900 uppercase text-lg leading-none">{req.productName}</h4>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5">{supplier?.businessName}</p>
                                        </div>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 shadow-sm ${req.status === 'QUOTED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>{req.status}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Volume</p>
                                        <p className="text-xl font-black text-gray-900 tracking-tighter">{req.quantity}{req.unit}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Target Date</p>
                                        <p className="text-xl font-black text-gray-900 tracking-tighter">{req.requiredDate.split('-').reverse().join('/')}</p>
                                    </div>
                                </div>
                            </div>

                            {req.status === 'QUOTED' ? (
                                <div className="space-y-6 pt-6 border-t border-gray-100">
                                    <div className="flex justify-between items-end px-2">
                                        <div>
                                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Supplier Offer</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-4xl font-black text-indigo-700 tracking-tighter">${req.offeredPrice?.toFixed(2)}</span>
                                                <span className="text-xs font-black text-indigo-400 uppercase">/ kg</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Quote</p>
                                            <p className="text-2xl font-black text-gray-900 tracking-tighter">${((req.offeredPrice || 0) * req.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button className="flex-1 py-4 bg-white border-2 border-gray-100 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all">Decline</button>
                                        <button 
                                            onClick={() => mockService.acceptProcurementQuote(req.id)}
                                            className="flex-[2] py-4 bg-[#043003] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-900/10 hover:bg-black transition-all flex items-center justify-center gap-2 active:scale-95"
                                        >
                                            <CheckCircle size={18}/> Accept & Dispatch
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 flex flex-col items-center justify-center text-center">
                                    <Clock size={32} className="text-orange-400 mb-4 animate-pulse"/>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Awaiting Supplier Response</p>
                                    <p className="text-[10px] text-gray-300 font-medium mt-2">Partner has been notified of your inquiry</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
      )}

      {/* PRICE REQUEST MODAL */}
      {requestingPriceItem && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
              <div className="bg-white rounded-[3.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100">
                  <div className="p-10 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center relative">
                      <div className="flex items-center gap-5">
                          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-emerald-600">
                              <Calculator size={32}/>
                          </div>
                          <div>
                              <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight leading-none">Price Request</h2>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5">Direct Market Negotiation</p>
                          </div>
                      </div>
                      <button onClick={() => setRequestingPriceItem(null)} className="text-gray-300 hover:text-gray-900 p-2 bg-white rounded-full border border-gray-100 shadow-sm transition-all"><X size={28}/></button>
                  </div>

                  <div className="p-10 space-y-10">
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shrink-0">
                            <img src={requestingPriceItem.product.imageUrl} className="w-full h-full object-cover" alt=""/>
                        </div>
                        <div>
                            <h4 className="font-black text-gray-900 text-2xl uppercase tracking-tighter leading-none mb-1.5">{requestingPriceItem.product.name}</h4>
                            <div className="flex items-center gap-2 text-indigo-600 text-[10px] font-black uppercase tracking-widest">
                                <Store size={12}/> Supplier: {requestingPriceItem.supplier.businessName}
                            </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Volume Required ({requestingPriceItem.product.unit || 'kg'})</label>
                            <input 
                                type="number"
                                className="w-full p-5 bg-gray-50 border-2 border-gray-100 rounded-3xl font-black text-3xl text-gray-900 outline-none focus:bg-white focus:border-indigo-500 transition-all shadow-inner-sm"
                                value={requestQty}
                                onChange={e => setRequestQty(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Target Delivery Date</label>
                            <input 
                                type="date"
                                className="w-full p-5 bg-gray-50 border-2 border-gray-100 rounded-3xl font-bold text-lg text-gray-900 outline-none focus:bg-white focus:border-indigo-500 transition-all shadow-inner-sm"
                                value={requestDate}
                                onChange={e => setRequestDate(e.target.value)}
                            />
                        </div>
                      </div>

                      <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100 flex items-start gap-4">
                          <Info size={20} className="text-indigo-600 shrink-0 mt-0.5"/>
                          <p className="text-xs text-indigo-800 font-medium leading-relaxed">
                            Submitting this request will instantly notify the supplier on their Platform Zero portal. They will provide a direct wholesale quote for your required volume.
                          </p>
                      </div>

                      <div className="flex gap-4 pt-4">
                          <button 
                            onClick={() => setRequestingPriceItem(null)}
                            className="flex-1 py-5 bg-gray-50 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={submitPriceRequest}
                            disabled={isSubmittingRequest || !requestQty}
                            className="flex-[2] py-5 bg-[#043003] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-emerald-900/10 hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                          >
                            {isSubmittingRequest ? <Loader2 className="animate-spin" size={20}/> : <><Send size={18}/> Send Inquiry</>}
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* CHAT INTERFACE */}
      <ChatDialog 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        orderId="NETWORK-THREAD" 
        issueType={`Network Partnership Inquiry`} 
        repName={chatTargetName} 
      />
    </div>
  );
};
