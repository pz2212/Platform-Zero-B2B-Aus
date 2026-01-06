
import React, { useState, useEffect } from 'react';
import { User, Product, InventoryItem, ClearanceLot } from '../types';
import { mockService } from '../services/mockDataService';
import { 
  ShoppingCart, Search, Plus, X, Leaf, Minus, 
  Truck, Calendar, Clock, User as UserIcon, DollarSign, 
  Check, ChevronDown, Package, ShoppingBag, Sparkles, TrendingDown,
  Store, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ClearanceLotCard: React.FC<{ lot: ClearanceLot, product: Product, onAdd: (lot: ClearanceLot, qty: number) => void }> = ({ lot, product, onAdd }) => {
    const [qty, setQty] = useState(lot.minOrderKg);

    return (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 flex flex-col h-full shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="mb-6">
                <div className="w-16 h-16 rounded-2xl overflow-hidden mb-4 border border-gray-100 bg-gray-50">
                    <img src={product.imageUrl} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-2xl text-gray-900 font-black uppercase tracking-tight leading-none">{product.name}</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2">{product.variety} • Min Order: {lot.minOrderKg}kg</p>
            </div>

            <div className="mt-auto space-y-6">
                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 flex justify-between items-center">
                    <div>
                        <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-1">Clearance Rate</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-emerald-600 tracking-tighter">${lot.marketplaceRate.toFixed(2)}</span>
                            <span className="text-[10px] font-black text-emerald-400 uppercase">/kg</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-1">Standard Market</p>
                        <p className="text-sm font-bold text-gray-400 line-through">${product.defaultPricePerKg.toFixed(2)}</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                        <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                            <Truck size={12}/> Logistics: ${lot.logisticsRate.toFixed(2)}/kg
                        </p>
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Min {lot.minLogisticsWeight}kg for rate</p>
                    </div>
                    <div className="flex items-center bg-gray-100 p-1.5 rounded-2xl border border-gray-200/50 h-14">
                        <button onClick={() => setQty(Math.max(lot.minOrderKg, qty - 10))} className="flex-1 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"><Minus size={18} strokeWidth={3}/></button>
                        <span className="flex-1 text-center font-black text-lg text-gray-900">{qty}kg</span>
                        <button onClick={() => setQty(qty + 10)} className="flex-1 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"><Plus size={18} strokeWidth={3}/></button>
                    </div>
                </div>

                <button 
                    onClick={() => onAdd(lot, qty)} 
                    className="w-full py-5 bg-[#043003] text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                >
                    <ShoppingCart size={18}/> Secure Wholesale Lot
                </button>
            </div>
        </div>
    );
};

export const GrocerMarketplace: React.FC<{ user: User }> = ({ user }) => {
  const navigate = useNavigate();
  const [clearanceLots, setClearanceLots] = useState<{lot: ClearanceLot, product: Product}[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    refreshLots();
    const interval = setInterval(refreshLots, 5000);
    return () => clearInterval(interval);
  }, []);

  const refreshLots = () => {
    const products = mockService.getAllProducts();
    const lots = mockService.getClearanceLots();
    
    setClearanceLots(lots.map(l => ({
        lot: l,
        product: products.find(p => p.id === l.productId)!
    })).filter(x => !!x.product));
  };

  const addToCart = (lot: ClearanceLot, qty: number) => {
      setCart(prev => [...prev, { lotId: lot.id, productId: lot.productId, qty, price: lot.marketplaceRate }]);
      alert("Clearance lot added to order!");
  };

  const handleCheckout = () => {
      if (cart.length === 0) return;
      const total = cart.reduce((sum, i) => sum + (i.qty * i.price), 0);
      const orderItems = cart.map(i => ({ productId: i.productId, quantityKg: i.qty, pricePerKg: i.price, unit: 'KG' as any }));
      mockService.createFullOrder(user.id, orderItems, total);
      setCart([]);
      alert("Wholesale Clearance Order Processed!");
      navigate('/');
  };

  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 px-2">
            <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white rounded-[1.5rem] shadow-sm border border-gray-100 flex items-center justify-center text-indigo-600 shadow-inner-sm"><Store size={36} /></div>
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">Wholesale Marketplace</h1>
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em] mt-2">Direct Supply • Clearance Protocol • Preferred Partners</p>
                </div>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-80 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search clearance lots..." 
                        className="w-full pl-14 pr-8 py-5 bg-white border border-gray-100 rounded-[1.5rem] text-sm font-bold shadow-sm outline-none focus:ring-4 focus:ring-indigo-50/5 transition-all" 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                </div>
                <button 
                    onClick={handleCheckout}
                    disabled={cart.length === 0}
                    className="relative px-8 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all disabled:bg-gray-100 disabled:text-gray-300 shadow-xl shadow-indigo-200"
                >
                    Review Order ({cart.length})
                </button>
            </div>
        </div>

        <div className="bg-indigo-600 rounded-[3rem] p-10 text-white shadow-2xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 transform rotate-12 scale-150 pointer-events-none group-hover:scale-[1.7] transition-transform duration-1000"><TrendingDown size={160} /></div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white shadow-sm shrink-0 border border-white/20 backdrop-blur-sm"><Sparkles size={32}/></div>
            <div className="relative z-10">
                <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Clearance Sourcing Active</h3>
                <p className="text-indigo-100 text-sm font-medium leading-relaxed max-w-2xl">Access immediate wholesale clearance rates published directly by Wholesalers and Farmers. These lots are optimized for high-volume Grocers and Retailers to ensure maximum profitability.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-2">
            {clearanceLots.filter(x => x.product.name.toLowerCase().includes(searchTerm.toLowerCase())).map((item, idx) => (
                <ClearanceLotCard key={idx} lot={item.lot} product={item.product} onAdd={addToCart} />
            ))}
            {clearanceLots.length === 0 && (
                <div className="col-span-full py-40 text-center text-gray-300">
                    <ShoppingBag size={64} className="mx-auto mb-4 opacity-10" />
                    <p className="font-black uppercase tracking-widest">No active wholesale clearance lots found.</p>
                </div>
            )}
        </div>
    </div>
  );
};
