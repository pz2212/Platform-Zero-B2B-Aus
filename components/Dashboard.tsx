import React, { useState, useEffect, useMemo } from 'react';
import { User, Order, Product, InventoryItem, ProcurementRequest } from '../types';
import { mockService } from '../services/mockDataService';
import { 
  Package, Truck, DollarSign, Activity, ShoppingCart, 
  ChevronRight, Camera, CheckCircle, Clock, Search,
  LayoutGrid, History, Globe, MapPin, 
  TrendingUp, AlertTriangle, List, 
  X, Plus, Zap, Bell, Loader2, Send, Handshake, Info, Calendar, Timer,
  Store, ArrowRight, ArrowLeft, MessageSquare, CreditCard,
  FileText,
  // Added User as UserIcon to resolve missing reference on line 44
  User as UserIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  user: User;
}

const FulfillmentOrderDetailsModal = ({ isOpen, onClose, order, products, onAccept, isAccepting }: any) => {
    if (!isOpen || !order) return null;

    const buyer = mockService.getCustomers().find(c => c.id === order.buyerId) || { businessName: 'Wholesale Client', location: 'Delivery Address Not Set' };
    
    return (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[3.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <ShoppingCart size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight leading-none">Order Manifest</h2>
                            <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest mt-1.5">ID: #{order.id.split('-').pop()} • Status: {order.status}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-300 hover:text-gray-900 p-2 bg-white rounded-full border border-gray-100 shadow-sm transition-all"><X size={24} strokeWidth={2.5}/></button>
                </div>

                <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                    {/* Buyer Info */}
                    <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-[0.03] transform rotate-12 scale-150"><UserIcon size={100}/></div>
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                            <Store size={16} className="text-indigo-500"/> CUSTOMER IDENTITY
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Business Name</p>
                                <p className="font-black text-gray-900 text-lg uppercase tracking-tight">{buyer.businessName}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Delivery Destination</p>
                                <p className="font-bold text-gray-700 text-sm leading-snug">{order.logistics?.deliveryLocation || buyer.location}</p>
                            </div>
                        </div>
                    </div>

                    {/* Logistics Status */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <Truck size={16} className="text-emerald-500"/> FULFILLMENT LOGISTICS
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                                <span className="text-[9px] font-black text-indigo-400 uppercase block mb-1">Requested Delivery</span>
                                <p className="font-black text-gray-900 text-sm">{order.logistics?.deliveryDate || 'ASAP'}</p>
                            </div>
                            <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                                <span className="text-[9px] font-black text-indigo-400 uppercase block mb-1">Target Window</span>
                                <p className="font-black text-gray-900 text-sm">{order.logistics?.deliveryTime || 'Standard Morning'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <Package size={16} className="text-orange-500"/> LINE ITEMS
                        </h4>
                        <div className="divide-y divide-gray-100 border border-gray-100 rounded-[2rem] overflow-hidden bg-white shadow-sm">
                            {order.items.map((item: any, idx: number) => {
                                const p = products.find((prod: any) => prod.id === item.productId);
                                return (
                                    <div key={idx} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                                                <img src={p?.imageUrl} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 text-sm uppercase tracking-tight">{p?.name || 'Produce Item'}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{p?.variety || 'Standard'}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-gray-900 text-base tracking-tighter">{item.quantityKg}{p?.unit || 'kg'}</p>
                                            <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">${item.pricePerKg.toFixed(2)} / unit</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-8">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Trade Total</p>
                        <h3 className="text-4xl font-black text-gray-900 tracking-tighter">${order.totalAmount.toFixed(2)}</h3>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-8 py-4 bg-white border border-gray-200 text-gray-400 hover:text-gray-900 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">Close</button>
                        {order.status === 'Pending' && (
                            <button 
                                onClick={() => onAccept(order.id)}
                                disabled={isAccepting}
                                className="px-12 py-4 bg-[#043003] hover:bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all flex items-center gap-2"
                            >
                                {isAccepting ? <Loader2 size={16} className="animate-spin"/> : 'Accept Order'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProcurementModal = ({ isOpen, onClose, product, user, allInventory, allUsers, onComplete }: any) => {
    const [selectedSupplier, setSelectedSupplier] = useState<User | null>(null);
    const [quantity, setQuantity] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen || !product) return null;

    const availableSuppliers = allInventory
        .filter((i: InventoryItem) => i.productId === product.id && i.ownerId !== user.id && i.status === 'Available')
        .map((i: InventoryItem) => ({
            inventory: i,
            user: allUsers.find((u: User) => u.id === i.ownerId)
        }))
        .filter((item: any) => !!item.user);

    const handleRequest = async () => {
        if (!selectedSupplier || !quantity || !date) return;
        setIsSubmitting(true);
        
        const request: ProcurementRequest = {
            id: `proc-${Date.now()}`,
            buyerId: user.id,
            buyerName: user.businessName,
            supplierId: selectedSupplier.id,
            productId: product.id,
            productName: product.name,
            quantity: parseFloat(quantity),
            unit: product.unit || 'KG',
            requiredDate: date,
            requiredTime: time || 'ASAP',
            status: 'PENDING',
            timestamp: new Date().toISOString()
        };

        mockService.addProcurementRequest(request);
        await new Promise(r => setTimeout(r, 1000));
        setIsSubmitting(false);
        onComplete();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <Zap size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Sourcing: {product.name}</h2>
                            <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest mt-1.5">Direct Network Sourcing Protocol</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-300 hover:text-gray-900 transition-all"><X size={28}/></button>
                </div>

                <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                    <section className="space-y-4">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">
                            <Store size={14}/> 1. Select Live Supply Source
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                            {availableSuppliers.length === 0 ? (
                                <div className="p-8 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                    <p className="text-xs font-bold text-gray-400 uppercase">No other suppliers currently listing this variety</p>
                                </div>
                            ) : availableSuppliers.map((item: any) => (
                                <button 
                                    key={item.user.id}
                                    onClick={() => setSelectedSupplier(item.user)}
                                    className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all text-left ${selectedSupplier?.id === item.user.id ? 'bg-indigo-50 border-indigo-600 shadow-md' : 'bg-white border-gray-100 hover:border-indigo-100'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black ${selectedSupplier?.id === item.user.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                            {item.user.businessName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900 uppercase text-sm">{item.user.businessName}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.inventory.quantityKg}kg available in {item.inventory.warehouseLocation || 'Market'}</p>
                                        </div>
                                    </div>
                                    {selectedSupplier?.id === item.user.id && <CheckCircle size={20} className="text-indigo-600"/>}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">
                            <Plus size={14}/> 2. Request Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Volume Needed ({product.unit || 'kg'})</label>
                                <input 
                                    type="number" 
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-black text-lg outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50"
                                    value={quantity}
                                    onChange={e => setQuantity(e.target.value)}
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Required Date</label>
                                <input 
                                    type="date" 
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:bg-white"
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                />
                            </div>
                        </div>
                    </section>

                    <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 flex items-start gap-4">
                        <Info size={20} className="text-indigo-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-indigo-800 font-medium leading-relaxed">
                            Sending this request will notify the supplier immediately. They will respond with a quote for your review.
                        </p>
                    </div>
                </div>

                <div className="p-8 border-t border-gray-100 bg-white flex gap-4">
                    <button onClick={onClose} className="flex-1 py-5 bg-gray-50 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">Cancel</button>
                    <button 
                        onClick={handleRequest}
                        disabled={isSubmitting || !selectedSupplier || !quantity || !date}
                        className="flex-[2] py-5 bg-[#043003] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 size={20} className="animate-spin"/> : <><Send size={18}/> Send Sourcing Request</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

const DemandCard: React.FC<{ product: Product, inventory: number, demand: number, onClick: () => void }> = ({ product, inventory, demand, onClick }) => {
  const percentage = Math.min(100, (inventory / Math.max(1, demand)) * 100);
  const isDeficit = inventory < demand;

  return (
    <div 
        onClick={onClick}
        className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all group cursor-pointer active:scale-[0.98]"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shadow-inner-sm">
            <img src={product.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={product.name} />
          </div>
          <div>
            <h4 className="font-black text-gray-900 text-sm uppercase tracking-tight leading-none mb-1.5">{product.name}</h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.variety}</p>
          </div>
        </div>
        <div className="p-2.5 bg-indigo-50 text-indigo-500 rounded-xl shadow-sm border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
          <Plus size={18} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 group-hover:bg-white transition-colors">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">On Hand</span>
          <span className="text-base font-black text-gray-900">{inventory}kg</span>
        </div>
        <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100/50 group-hover:bg-white transition-colors">
          <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest block mb-1">Demand</span>
          <span className="text-base font-black text-blue-700">{demand}kg</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner-sm">
          <div 
            className={`h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.1)] ${isDeficit ? 'bg-orange-500' : 'bg-emerald-500'}`} 
            style={{ width: `${percentage}%` }}
          />
        </div>
        {isDeficit && (
          <p className="text-[9px] font-black text-orange-600 uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
            <AlertTriangle size={10}/> Stock Deficit Identified • Click to source
          </p>
        )}
      </div>
    </div>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'OPERATIONS' | 'PROCUREMENT'>('OPERATIONS');
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activePipelineTab, setActivePipelineTab] = useState<'INCOMING' | 'PROCESSING' | 'ACTIVE_RUNS' | 'HISTORY'>('INCOMING');
  const [procurementRequests, setProcurementRequests] = useState<ProcurementRequest[]>([]);
  
  const [isAcceptingId, setIsAcceptingId] = useState<string | null>(null);
  const [selectedProductForProcurement, setSelectedProductForProcurement] = useState<Product | null>(null);
  const [quotingRequestId, setQuotingRequestId] = useState<string | null>(null);
  const [quotePrice, setQuotePrice] = useState('');

  // Added state for viewing an order in detail
  const [selectedOrderForView, setSelectedOrderForView] = useState<Order | null>(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [user.id]);

  const loadData = () => {
    const allOrders = mockService.getOrders(user.id).filter(o => o.sellerId === user.id);
    setOrders(allOrders);
    setInventory(mockService.getInventory(user.id));
    setProducts(mockService.getAllProducts());
    setProcurementRequests(mockService.getProcurementRequests(user.id));
  };

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const todaysOrders = orders.filter(o => new Date(o.date).toDateString() === today);
    const revenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    
    return {
      ordersToday: todaysOrders.length,
      wholesalers: 2, 
      onTheRoad: orders.filter(o => o.status === 'Shipped').length,
      revenue: revenue
    };
  }, [orders]);

  const demandMatrix = useMemo(() => {
    const matrix: Record<string, { inventory: number, demand: number }> = {};
    
    inventory.forEach(item => {
      if (item.status === 'Available') {
        matrix[item.productId] = { inventory: (matrix[item.productId]?.inventory || 0) + item.quantityKg, demand: 0 };
      }
    });

    orders.forEach(order => {
      if (['Pending', 'Confirmed'].includes(order.status)) {
        order.items.forEach(item => {
          if (!matrix[item.productId]) matrix[item.productId] = { inventory: 0, demand: 0 };
          matrix[item.productId].demand += item.quantityKg;
        });
      }
    });

    return Object.entries(matrix).map(([id, data]) => ({
      product: products.find(p => p.id === id)!,
      ...data
    })).filter(item => item.product && (item.inventory > 0 || item.demand > 0));
  }, [inventory, orders, products]);

  const handleAcceptOrder = async (orderId: string) => {
    setIsAcceptingId(orderId);
    await new Promise(r => setTimeout(r, 1200));
    mockService.acceptOrderV2(orderId);
    loadData();
    setIsAcceptingId(null);
  };

  const handleSendQuote = async (requestId: string) => {
      if (!quotePrice) return;
      await mockService.updateProcurementQuote(requestId, parseFloat(quotePrice));
      setQuotingRequestId(null);
      setQuotePrice('');
      loadData();
      alert("Quote dispatched to buyer!");
  };

  const handleAcceptQuote = async (requestId: string) => {
      mockService.acceptProcurementQuote(requestId);
      loadData();
      alert("Quote accepted! Procurement order created.");
  };

  const filteredOrders = useMemo(() => {
    switch (activePipelineTab) {
      case 'INCOMING': return orders.filter(o => o.status === 'Pending');
      case 'PROCESSING': return orders.filter(o => o.status === 'Confirmed' || o.status === 'Ready for Delivery');
      case 'ACTIVE_RUNS': return orders.filter(o => o.status === 'Shipped');
      case 'HISTORY': return orders.filter(o => o.status === 'Delivered');
      default: return [];
    }
  }, [orders, activePipelineTab]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-[1600px] mx-auto">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-[44px] font-black text-slate-900 tracking-tighter uppercase leading-none">Partner Operations</h1>
            {user.isStripeConnected && (
                <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 animate-in zoom-in duration-500">
                    <CreditCard size={12} strokeWidth={3}/>
                    <span className="text-[8px] font-black uppercase tracking-widest">Stripe Connected</span>
                </div>
            )}
          </div>
          <div className="flex items-center gap-4 mt-2">
             <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em]">Management Console <span className="mx-2 text-gray-200">•</span> {user.businessName}</p>
             <div className="flex bg-gray-100 p-1 rounded-xl gap-1 border border-gray-200 shadow-inner-sm">
                <button onClick={() => setActiveTab('OPERATIONS')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'OPERATIONS' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Ops View</button>
                <button onClick={() => setActiveTab('PROCUREMENT')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'PROCUREMENT' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-indigo-600'}`}>
                    Procurement Hub {procurementRequests.filter(r => r.supplierId === user.id && r.status === 'PENDING').length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>}
                </button>
             </div>
          </div>
        </div>
        <button 
          onClick={() => navigate('/pricing')}
          className="px-10 py-5 bg-[#3B82F6] hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-3 group"
        >
          <Camera size={20} className="group-hover:rotate-12 transition-transform" />
          Visual Scanner
        </button>
      </div>

      {activeTab === 'OPERATIONS' ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
                {[
                { label: 'Orders Today', value: stats.ordersToday, icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
                { label: 'Wholesalers', value: stats.wholesalers, icon: Globe, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                { label: 'On The Road', value: stats.onTheRoad, icon: Truck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { label: 'Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50', symbol: '$' }
                ].map((kpi, idx) => (
                <div key={idx} className="bg-white p-8 rounded-[2.25rem] border border-gray-100 shadow-sm flex flex-col justify-between h-40 group hover:shadow-xl transition-all">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">{kpi.label}</p>
                    <div className="flex justify-between items-end">
                    <h3 className="text-4xl font-black text-gray-900 tracking-tighter">{kpi.value}</h3>
                    <div className={`p-3 ${kpi.bg} ${kpi.color} rounded-xl group-hover:scale-110 transition-transform shadow-inner-sm border border-white/50`}>
                        <kpi.icon size={20} strokeWidth={2.5}/>
                    </div>
                    </div>
                </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-2">
                <div className="lg:col-span-4 space-y-6">
                <div className="bg-white/50 backdrop-blur-md rounded-[3rem] border border-gray-100 p-8 flex flex-col gap-10 h-full shadow-sm">
                    <div className="flex items-center gap-5">
                    <div className="p-3.5 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-100">
                        <LayoutGrid size={28} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Demand Matrix</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Inventory vs. Today's Fulfillment</p>
                    </div>
                    </div>

                    <div className="space-y-6">
                    {demandMatrix.length === 0 ? (
                        <div className="py-32 text-center opacity-20 flex flex-col items-center">
                        <Package size={64} className="mb-4" />
                        <p className="font-black uppercase text-[10px] tracking-widest">No active matrix data</p>
                        </div>
                    ) : demandMatrix.map((item, idx) => (
                        <DemandCard 
                            key={item.product.id} 
                            product={item.product} 
                            inventory={item.inventory} 
                            demand={item.demand} 
                            onClick={() => setSelectedProductForProcurement(item.product)}
                        />
                    ))}
                    </div>
                </div>
                </div>

                <div className="lg:col-span-8">
                <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[700px]">
                    <div className="p-10 border-b border-gray-100 flex flex-col xl:flex-row justify-between items-center gap-8 bg-gray-50/40">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-white rounded-[1.5rem] flex items-center justify-center text-gray-900 shadow-sm border border-gray-100">
                        <List size={28} />
                        </div>
                        <div>
                        <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight leading-none">Fulfillment Pipeline</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">Managing your direct sales trade flow</p>
                        </div>
                    </div>

                    <div className="bg-gray-100/90 p-1.5 rounded-[2rem] flex gap-1 border border-gray-200 shadow-inner-sm overflow-x-auto no-scrollbar">
                        {[
                        { id: 'INCOMING', label: 'INCOMING', icon: Bell, count: orders.filter(o => o.status === 'Pending').length },
                        { id: 'PROCESSING', label: 'PROCESSING', icon: Package, count: orders.filter(o => o.status === 'Confirmed').length },
                        { id: 'ACTIVE_RUNS', label: 'ACTIVE RUNS', icon: Truck },
                        { id: 'HISTORY', label: 'HISTORY', icon: History }
                        ].map((tab) => (
                        <button 
                            key={tab.id}
                            onClick={() => setActivePipelineTab(tab.id as any)}
                            className={`px-8 py-3.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2.5 whitespace-nowrap ${activePipelineTab === tab.id ? 'bg-white text-gray-900 shadow-xl ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-700'}`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                            {tab.count !== undefined && tab.count > 0 && (
                            <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shadow-lg shadow-blue-200">{tab.count}</span>
                            )}
                        </button>
                        ))}
                    </div>
                    </div>

                    <div className="flex-1 p-10 space-y-6 overflow-y-auto custom-scrollbar bg-gray-50/10">
                    {filteredOrders.length === 0 ? (
                        <div className="py-40 text-center text-gray-300">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-dashed border-gray-200">
                            <CheckCircle size={48} className="opacity-10" />
                        </div>
                        <p className="font-black uppercase tracking-[0.3em] text-[11px]">No orders in this phase</p>
                        </div>
                    ) : filteredOrders.map(order => {
                        const buyer = mockService.getCustomers().find(c => c.id === order.buyerId);
                        const isAccepting = isAcceptingId === order.id;

                        return (
                        <div 
                          key={order.id} 
                          onClick={() => setSelectedOrderForView(order)}
                          className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all flex flex-col md:flex-row justify-between items-center gap-8 group animate-in slide-in-from-top-4 duration-500 cursor-pointer"
                        >
                            <div className="flex items-center gap-8">
                            <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-700 font-black text-2xl shadow-inner-sm uppercase border border-indigo-100/50 group-hover:scale-105 transition-transform">
                                {buyer?.businessName.charAt(0) || 'U'}
                            </div>
                            <div>
                                <h4 className="font-black text-gray-900 text-xl uppercase tracking-tight mb-2 leading-none group-hover:text-indigo-600 transition-colors">{buyer?.businessName || 'Wholesale Client'}</h4>
                                <div className="flex items-center gap-4">
                                <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-indigo-100">{order.status}</span>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1.5"><Clock size={12}/> Logged: {new Date(order.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                            </div>
                            </div>
                            
                            <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-end">
                            <div className="text-right">
                                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1.5">Trade Total</p>
                                <p className="font-black text-gray-900 text-3xl tracking-tighter leading-none">${order.totalAmount.toFixed(2)}</p>
                            </div>
                            
                            {order.status === 'Pending' && (
                                <button 
                                onClick={(e) => { e.stopPropagation(); handleAcceptOrder(order.id); }}
                                disabled={isAccepting}
                                className="px-14 py-5 bg-[#043003] hover:bg-black text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_20px_40px_-10px_rgba(4,48,3,0.3)] transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                                >
                                {isAccepting ? <><Loader2 size={18} className="animate-spin"/> Processing</> : 'Accept Order'}
                                </button>
                            )}
                            
                            {order.status === 'Confirmed' && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); navigate('/settings'); }}
                                    className="px-10 py-4 bg-white border-2 border-indigo-600 text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center gap-2"
                                >
                                    Assign Crew <ChevronRight size={14}/>
                                </button>
                            )}
                            </div>
                        </div>
                        );
                    })}
                    </div>
                </div>
                </div>

            </div>
          </>
      ) : (
          <div className="px-2 animate-in slide-in-from-right-10 duration-700">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
                    <div className="p-8 border-b border-gray-100 bg-emerald-50/20 flex justify-between items-center">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                                <ArrowRight size={24}/>
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Active Sourcing</h3>
                                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">My Outbound Stock Requests</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 p-8 space-y-6 overflow-y-auto custom-scrollbar">
                        {procurementRequests.filter(r => r.buyerId === user.id).length === 0 ? (
                            <div className="py-32 text-center opacity-20">
                                <Handshake size={64} className="mx-auto mb-4" />
                                <p className="font-black uppercase text-xs tracking-widest">No active sourcing requests</p>
                            </div>
                        ) : procurementRequests.filter(r => r.buyerId === user.id).map(req => {
                            const supplier = mockService.getAllUsers().find(u => u.id === req.supplierId);
                            return (
                                <div key={req.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 font-black">
                                                {supplier?.businessName.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-gray-900 text-sm uppercase tracking-tight">{req.productName}</h4>
                                                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{supplier?.businessName}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${req.status === 'QUOTED' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>{req.status}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-6">
                                        <div className="flex items-center gap-2 text-gray-500 font-black text-[10px] uppercase tracking-widest">
                                            <Calendar size={14}/> {req.requiredDate}
                                        </div>
                                        <div className="font-black text-gray-900 text-sm">
                                            {req.quantity}{req.unit}
                                        </div>
                                    </div>
                                    {req.status === 'QUOTED' && (
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-end px-1">
                                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Offered Quote</p>
                                                <p className="text-2xl font-black text-indigo-700 tracking-tighter">${req.offeredPrice?.toFixed(2)}<span className="text-[10px] uppercase ml-0.5">/{req.unit}</span></p>
                                            </div>
                                            <button 
                                                onClick={() => handleAcceptQuote(req.id)}
                                                className="w-full py-4 bg-indigo-600 hover:bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95"
                                            >
                                                Accept & Confirm Trade
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
                    <div className="p-8 border-b border-gray-100 bg-indigo-50/20 flex justify-between items-center">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                                <ArrowLeft size={24}/>
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Supply Leads</h3>
                                <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest mt-1">Inbound Procurement Requests</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 p-8 space-y-6 overflow-y-auto custom-scrollbar">
                        {procurementRequests.filter(r => r.supplierId === user.id).length === 0 ? (
                            <div className="py-32 text-center opacity-20">
                                <MessageSquare size={64} className="mx-auto mb-4" />
                                <p className="font-black uppercase text-xs tracking-widest">No inbound supply requests</p>
                            </div>
                        ) : procurementRequests.filter(r => r.supplierId === user.id).map(req => (
                            <div key={req.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 font-black">
                                            {req.buyerName.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-gray-900 text-sm uppercase tracking-tight">{req.productName}</h4>
                                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Buyer: {req.buyerName}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${req.status === 'PENDING' ? 'bg-orange-50 text-orange-600 border-orange-100 animate-pulse' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>{req.status}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Qty Needed</p>
                                        <p className="font-black text-gray-900 text-sm">{req.quantity}{req.unit}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Target Date</p>
                                        <p className="font-black text-gray-900 text-sm">{req.requiredDate}</p>
                                    </div>
                                </div>

                                {req.status === 'PENDING' && (
                                    <div className="space-y-4">
                                        {quotingRequestId === req.id ? (
                                            <div className="space-y-3 animate-in slide-in-from-bottom-2">
                                                <div className="relative group">
                                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-indigo-600" size={18}/>
                                                    <input 
                                                        type="number" 
                                                        className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-black text-lg outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50"
                                                        value={quotePrice}
                                                        onChange={e => setQuotePrice(e.target.value)}
                                                        placeholder="0.00"
                                                        autoFocus
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => setQuotingRequestId(null)} className="flex-1 py-3 bg-white border border-gray-200 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest">Cancel</button>
                                                    <button onClick={() => handleSendQuote(req.id)} className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Submit Quote</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => setQuotingRequestId(req.id)}
                                                className="w-full py-4 bg-white border-2 border-indigo