
import React, { useState, useEffect, useRef } from 'react';
import { User, Order, InventoryItem, Product, ProcurementRequest } from '../types';
import { mockService } from '../services/mockDataService';
/* Added missing Handshake icon */
import { 
  Sprout, Leaf, ShoppingBag, DollarSign, TrendingUp, 
  Calendar, MapPin, CheckCircle, Clock, Plus, 
  BarChart4, ArrowRight, Package, Truck, Info, Heart,
  Edit2, CloudRain, Thermometer, Droplets, SprayCan, FileText, Camera, X, Share2, Search, ChevronDown, Loader2, Send,
  Handshake
} from 'lucide-react';
import { AiOpportunityMatcher } from './AiOpportunityMatcher';
import { InterestsModal } from './InterestsModal';

interface FarmerDashboardProps {
  user: User;
}

const HarvestLoggingModal = ({ isOpen, onClose, onSave, products }: any) => {
    const [formData, setFormData] = useState({
        productId: '',
        quantity: '',
        description: '',
        sprays: '',
        water: '',
        weather: 'Sunny',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Log New Harvest</h2>
                        <p className="text-sm text-gray-500 font-medium">Record field conditions and product specifics.</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 bg-white rounded-full shadow-sm border border-gray-100"><X size={24}/></button>
                </div>

                <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Product</label>
                            <select 
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500"
                                value={formData.productId}
                                onChange={e => setFormData({...formData, productId: e.target.value})}
                            >
                                <option value="">Select Produce...</option>
                                {products.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Estimated Quantity (kg)</label>
                            <input 
                                type="number"
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="0.00"
                                value={formData.quantity}
                                onChange={e => setFormData({...formData, quantity: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Harvest Description</label>
                        <textarea 
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500 h-24 resize-none"
                            placeholder="e.g. Field 4, row 12. Early morning pick, high sugar content."
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                <SprayCan size={14} className="text-orange-500"/> Sprays / Inputs Used
                            </label>
                            <input 
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="Organic fungicide etc."
                                value={formData.sprays}
                                onChange={e => setFormData({...formData, sprays: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                <Droplets size={14} className="text-blue-500"/> Water Added (L/m2)
                            </label>
                            <input 
                                type="number"
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="0"
                                value={formData.water}
                                onChange={e => setFormData({...formData, water: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Date</label>
                            <input type="date" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}/>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Time</label>
                            <input type="time" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})}/>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Weather</label>
                            <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold" value={formData.weather} onChange={e => setFormData({...formData, weather: e.target.value})}>
                                <option>Sunny</option>
                                <option>Overcast</option>
                                <option>Rainy</option>
                                <option>Frosty</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex gap-4">
                    <button onClick={onClose} className="flex-1 py-4 bg-white border border-gray-200 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-500 hover:bg-gray-100 transition-all">
                        Cancel
                    </button>
                    <button 
                        onClick={() => onSave(formData)}
                        className="flex-[2] py-4 bg-[#043003] text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2"
                    >
                        <Plus size={18}/> List Harvest
                    </button>
                </div>
            </div>
        </div>
    );
};

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ user }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [procurementRequests, setProcurementRequests] = useState<ProcurementRequest[]>([]);
  
  // UI States
  const [isHarvestModalOpen, setIsHarvestModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [showStatsDropdown, setShowStatsDropdown] = useState(false);
  const [isInterestsModalOpen, setIsInterestsModalOpen] = useState(false);
  const [quotingRequestId, setQuotingRequestId] = useState<string | null>(null);
  const [quotePrice, setQuotePrice] = useState('');

  const statsDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);

    if ((!user.activeSellingInterests || user.activeSellingInterests.length === 0) && (!user.activeBuyingInterests || user.activeBuyingInterests.length === 0)) {
        setIsInterestsModalOpen(true);
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (statsDropdownRef.current && !statsDropdownRef.current.contains(event.target as Node)) {
        setShowStatsDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        clearInterval(interval);
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [user]);

  const loadData = () => {
    setInventory(mockService.getInventory(user.id));
    setOrders(mockService.getOrders(user.id).filter(o => o.sellerId === user.id));
    setProducts(mockService.getAllProducts());
    setProcurementRequests(mockService.getProcurementRequests(user.id).filter(r => r.supplierId === user.id));
  };

  const handleSaveHarvest = (data: any) => {
      const newItem: InventoryItem = {
          id: `inv-${Date.now()}`,
          lotNumber: mockService.generateLotId(),
          productId: data.productId,
          ownerId: user.id,
          quantityKg: parseFloat(data.quantity),
          status: 'Available',
          harvestDate: `${data.date}T${data.time}:00Z`,
          uploadedAt: new Date().toISOString(),
          expiryDate: new Date(Date.now() + 86400000 * 7).toISOString(),
          harvestLocation: `Field Update: ${data.weather}`,
          notes: JSON.stringify({
              sprays: data.sprays,
              water: data.water,
              description: data.description,
              weather: data.weather
          })
      };
      mockService.addInventoryItem(newItem);
      setIsHarvestModalOpen(false);
      loadData();
      alert("Harvest lot listed and live on the marketplace!");
  };

  const handleSendQuote = async (requestId: string) => {
      if (!quotePrice) return;
      await mockService.updateProcurementQuote(requestId, parseFloat(quotePrice));
      setQuotingRequestId(null);
      setQuotePrice('');
      loadData();
      alert("Quote dispatched to wholesaler!");
  };

  const pendingDeliveries = orders.filter(o => o.status === 'Pending' || o.status === 'Confirmed');

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-[32px] font-black text-[#043003] tracking-tight flex items-center gap-3 leading-none">
            <Sprout size={36} className="text-[#10B981]"/> Farmer Portal
          </h1>
          <p className="text-gray-500 font-medium mt-1">Managing {user.businessName} • Harvest to Market Console</p>
        </div>
        <div className="flex gap-3">
             <button 
                onClick={() => setIsHarvestModalOpen(true)}
                className="px-8 py-4 bg-[#043003] hover:bg-black text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2 shadow-2xl transition-all active:scale-95"
            >
                <Plus size={18}/> List New Harvest
            </button>
            <button 
                onClick={() => setIsSellModalOpen(true)}
                className="px-8 py-4 bg-white border-2 border-[#043003] text-[#043003] rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2 hover:bg-gray-50 transition-all active:scale-95"
            >
                <Camera size={18}/> Sell Now
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-emerald-100 flex flex-col justify-between h-44 group hover:shadow-xl transition-all">
                <div className="flex justify-between items-start">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Market Sourcing</p>
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl"><DollarSign size={20}/></div>
                </div>
                <div>
                    <h3 className="text-4xl font-black text-gray-900 tracking-tighter">{procurementRequests.filter(r => r.status === 'PENDING').length} Leads</h3>
                    <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest mt-1">Awaiting your pricing</p>
                </div>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-emerald-100 flex flex-col justify-between h-44 group hover:shadow-xl transition-all">
                <div className="flex justify-between items-start">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Farm Revenue</p>
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><TrendingUp size={20}/></div>
                </div>
                <div>
                    <h3 className="text-4xl font-black text-gray-900 tracking-tighter">$4,280</h3>
                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">Settled this month</p>
                </div>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-emerald-100 flex flex-col justify-between h-44 group hover:shadow-xl transition-all">
                <div className="flex justify-between items-start">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Active Stock</p>
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><Leaf size={20}/></div>
                </div>
                <div>
                    <h3 className="text-4xl font-black text-gray-900 tracking-tighter">{inventory.length} Lots</h3>
                    <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">Live in marketplace</p>
                </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* INBOUND REQUESTS SECTION */}
        <div className="lg:col-span-4">
            <div className="bg-[#0F172A] text-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col h-full min-h-[600px] relative">
                <div className="absolute top-0 right-0 p-8 opacity-5 transform rotate-12 scale-150"><Handshake size={200}/></div>
                <div className="p-8 border-b border-white/5 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg">
                            <ArrowRight size={24}/>
                        </div>
                        <div>
                            <h3 className="text-xl font-black uppercase tracking-tight">Sourcing Requests</h3>
                            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-1">Inbound Wholesaler Inquiries</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-6 relative z-10 custom-scrollbar">
                    {procurementRequests.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-20 grayscale">
                            <Plus size={64} className="mb-4" />
                            <p className="text-xs font-black uppercase tracking-widest">No active requests found</p>
                        </div>
                    ) : procurementRequests.map(req => (
                        <div key={req.id} className="bg-white/5 border border-white/10 rounded-[2rem] p-6 hover:bg-white/10 transition-all group">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h4 className="text-lg font-black uppercase tracking-tight mb-1 group-hover:text-emerald-400 transition-colors">{req.productName}</h4>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Wholesaler: {req.buyerName}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${req.status === 'PENDING' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30 animate-pulse' : 'bg-white/10 text-slate-400 border-white/5'}`}>{req.status}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Quantity</p>
                                    <p className="font-black text-white text-sm">{req.quantity}{req.unit}</p>
                                </div>
                                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Target Date</p>
                                    <p className="font-black text-white text-sm">{req.requiredDate}</p>
                                </div>
                            </div>

                            {req.status === 'PENDING' && (
                                <div className="space-y-4">
                                    {quotingRequestId === req.id ? (
                                        <div className="space-y-3 animate-in slide-in-from-bottom-2">
                                            <div className="relative">
                                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18}/>
                                                <input 
                                                    type="number" 
                                                    step="0.01"
                                                    placeholder="Enter price per kg"
                                                    className="w-full pl-10 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl font-black text-lg outline-none focus:bg-white focus:text-slate-900 transition-all text-white"
                                                    value={quotePrice}
                                                    onChange={e => setQuotePrice(e.target.value)}
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => setQuotingRequestId(null)} className="flex-1 py-3 bg-white/5 border border-white/10 text-slate-400 rounded-xl text-[10px] font-black uppercase">Cancel</button>
                                                <button onClick={() => handleSendQuote(req.id)} className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-indigo-500/20">Send Quote</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => setQuotingRequestId(req.id)}
                                            className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
                                        >
                                            <DollarSign size={16}/> Provide Quote
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* HARVEST LIST SECTION */}
        <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                    <Droplets className="text-emerald-500" size={28}/> Current Field Harvest
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {inventory.length === 0 ? (
                    <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100 shadow-inner-sm">
                        <Plus size={64} className="mx-auto text-gray-100 mb-6"/>
                        <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-xs">No active harvest lots. Use the button above to start.</p>
                    </div>
                ) : inventory.map(item => {
                    const product = products.find(p => p.id === item.productId);
                    let fieldData = { sprays: 'Standard', water: 'Logged', weather: 'Mixed', description: '' };
                    try { if(item.notes) fieldData = JSON.parse(item.notes); } catch(e){}

                    return (
                        <div key={item.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col group hover:shadow-xl transition-all animate-in zoom-in-95">
                            <div className="flex justify-between items-start mb-8">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-[1.25rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
                                        <img src={product?.imageUrl} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-900 text-2xl tracking-tight leading-none uppercase">{product?.name}</h4>
                                        <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mt-2">{item.quantityKg}kg available</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center justify-between text-[11px] font-black text-gray-400 uppercase tracking-widest">
                                    <span className="flex items-center gap-2"><SprayCan size={16} className="text-orange-400"/> Sprays:</span>
                                    <span className="text-gray-900">{fieldData.sprays || 'None'}</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px] font-black text-gray-400 uppercase tracking-widest">
                                    <span className="flex items-center gap-2"><Droplets size={16} className="text-blue-400"/> Irrigation:</span>
                                    <span className="text-gray-900">{fieldData.water}L/m2</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px] font-black text-gray-400 uppercase tracking-widest">
                                    <span className="flex items-center gap-2"><CloudRain size={16} className="text-slate-400"/> Weather:</span>
                                    <span className="text-gray-900">{fieldData.weather}</span>
                                </div>
                            </div>

                            <div className="mt-auto pt-8 border-t border-gray-50 flex items-center justify-between">
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                    Harvest: {new Date(item.harvestDate).toLocaleDateString()}
                                </p>
                                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">Market-Ready</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      </div>

      {/* MODALS */}
      <HarvestLoggingModal 
          isOpen={isHarvestModalOpen} 
          onClose={() => setIsHarvestModalOpen(false)}
          products={products}
          onSave={handleSaveHarvest}
      />

      {isSellModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-300">
              <div className="bg-white rounded-[3rem] w-full max-w-6xl h-[90vh] overflow-hidden relative shadow-2xl flex flex-col border border-gray-100">
                  <div className="p-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-4 uppercase"><Camera size={36} className="text-indigo-600"/> Visual Market Capture</h2>
                    <button onClick={() => setIsSellModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2 bg-white rounded-full shadow-sm border border-gray-100 transition-all active:scale-90"><X size={32}/></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                    <AiOpportunityMatcher user={user} />
                  </div>
              </div>
          </div>
      )}

      <InterestsModal 
        user={user}
        isOpen={isInterestsModalOpen}
        onClose={() => setIsInterestsModalOpen(false)}
        onSaved={loadData}
      />
    </div>
  );
};
