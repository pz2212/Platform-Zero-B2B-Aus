
import React, { useState, useEffect } from 'react';
import { User, Product, InventoryItem, OrderItem } from '../types';
import { mockService } from '../services/mockDataService';
import { 
  ShoppingCart, Search, Plus, X, Leaf, Minus, 
  Truck, Calendar, Clock, User as UserIcon, DollarSign, 
  Check, ChevronDown, Package, ShoppingBag, Sparkles, TrendingDown,
  Store, MapPin, ShieldCheck, Scale, Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductCard: React.FC<any> = ({ product, item, onAdd }) => {
    const [qty, setQty] = useState(item.minOrderQuantity || 50);
    const pzPrice = (item.discountPricePerKg || product.defaultPricePerKg) * 1.15; // Applying standard 15% marketplace markup
    
    const logisticsRate = item.logisticsPricePerKg || 0;
    const minLogistics = item.minLogisticsKg || 0;
    const logisticsActive = qty >= minLogistics;

    const handleQtyChange = (val: number) => {
        const min = item.minOrderQuantity || 1;
        if (val >= min) setQty(val);
    };

    return (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 flex flex-col h-full shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0">
                <div className="bg-emerald-500 text-white px-6 py-2 rounded-bl-3xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/10">
                    Bulk Clearance
                </div>
            </div>

            <div className="mb-6 pt-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden mb-4 border border-gray-100 shadow-inner-sm">
                    <img src={product.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                </div>
                <h3 className="text-2xl text-gray-900 font-black uppercase tracking-tight leading-none">{product.name}</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2">{product.variety}</p>
                <div className="mt-3 flex items-center gap-2 text-[9px] font-black text-indigo-600 uppercase tracking-widest">
                    <MapPin size={12}/> Origin: {item.harvestLocation || 'Regional Market'}
                </div>
            </div>

            {/* LOGISTICS INSIGHT BOX */}
            <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100 mb-6 space-y-3">
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-gray-400 font-black text-[9px] uppercase tracking-widest">
                        <Truck size={12}/> Freight Rate
                    </div>
                    <span className="font-black text-gray-900 text-xs">${logisticsRate.toFixed(2)} / kg</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-gray-400 font-black text-[9px] uppercase tracking-widest">
                        <Scale size={12}/> Min Freight Vol
                    </div>
                    <span className="font-black text-gray-900 text-xs">{minLogistics}kg</span>
                 </div>
            </div>

            <div className="mt-auto space-y-6">
                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 flex justify-between items-center">
                    <div>
                        <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-1">Clearance Rate</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-emerald-600 tracking-tighter">${pzPrice.toFixed(2)}</span>
                            <span className="text-[10px] font-black text-emerald-400 uppercase">/kg</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Min Order</p>
                        <p className="text-[10px] font-black text-gray-900 uppercase">{item.minOrderQuantity || 1}kg</p>
                    </div>
                </div>

                <div className="flex justify-between items-center gap-4">
                    <div className="flex-1 flex items-center bg-gray-100 p-1.5 rounded-2xl border border-gray-200/50 h-14">
                        <button onClick={() => handleQtyChange(qty - 1)} className="flex-1 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"><Minus size={18} strokeWidth={3}/></button>
                        <span className="flex-1 text-center font-black text-lg text-gray-900">{qty}</span>
                        <button onClick={() => handleQtyChange(qty + 1)} className="flex-1 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"><Plus size={18} strokeWidth={3}/></button>
                    </div>
                    <div className="text-right">
                        <span className="block text-[8px] font-black text-gray-400 uppercase tracking-widest">Available</span>
                        <span className="text-[10px] font-black text-gray-900 uppercase">{item.quantityKg}kg</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <button 
                        onClick={() => onAdd(product, qty, item, pzPrice)} 
                        className="w-full py-5 bg-[#043003] text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                    >
                        <ShoppingCart size={18}/> Purchase Clearance Lot
                    </button>
                    <p className="text-center text-[9px] font-black text-indigo-400 uppercase tracking-widest flex items-center justify-center gap-1">
                        <Info size={10}/> Total includes logistics floor price
                    </p>
                </div>
            </div>
        </div>
    );
};

export const GrocerMarketplace: React.FC<{ user: User }> = ({ user }) => {
  const navigate = useNavigate();
  const [agedInventory, setAgedInventory] = useState<{product: Product, item: InventoryItem}[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const products = mockService.getAllProducts();
    const inventory = mockService.getAllInventory();

    // Filter items explicitly marked as public marketplace by wholesalers
    const aged = inventory.filter(item => {
        if (item.status !== 'Available' || !item.isPublicMarketplace) return false;
        return true;
    }).map(item => ({
        item,
        product: products.find(p => p.id === item.productId)!
    })).filter(x => !!x.product);

    setAgedInventory(aged);
  }, []);

  const addToCart = (product: Product, qty: number, item: InventoryItem, pzPrice: number) => {
      // Logic for adding to cart including freight calculation
      const freight = item.logisticsPricePerKg ? Math.max(qty * item.logisticsPricePerKg, (item.minLogisticsKg || 0) * item.logisticsPricePerKg) : 0;
      setCart(prev => [...prev, { productId: product.id, qty, price: pzPrice, unit: 'KG', freight }]);
      alert(`${product.name} added to order via Platform Zero! Freight: $${freight.toFixed(2)}`);
  };

  const handleCheckout = () => {
      if (cart.length === 0) return;
      const totalItems = cart.reduce((sum, i) => sum + (i.qty * i.price), 0);
      const totalFreight = cart.reduce((sum, i) => sum + (i.freight || 0), 0);
      const total = totalItems + totalFreight;
      
      mockService.createFullOrder(user.id, cart, total, 'u1'); // sellerId is 'u1' (HQ Admin) as Master Supplier
      setCart([]);
      alert("Wholesale Order Processed! Total Trade: $" + total.toFixed(2) + " (Includes Freight). Platform Zero is your master supplier.");
      navigate('/');
  };

  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 px-2">
            <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white rounded-[1.5rem] shadow-sm border border-gray-100 flex items-center justify-center text-[#043003]"><Store size={36} /></div>
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">Market Clearance</h1>
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em] mt-2">Aggressive Bulk Discounts • Directly from Wholesalers</p>
                </div>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-80 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search clearance inventory..." 
                        className="w-full pl-14 pr-8 py-5 bg-white border border-gray-100 rounded-[1.5rem] text-sm font-bold shadow-sm outline-none focus:ring-4 focus:ring-indigo-50/5 transition-all" 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                </div>
                <button 
                    onClick={handleCheckout}
                    disabled={cart.length === 0}
                    className="relative px-8 bg-[#043003] text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-black transition-all disabled:bg-gray-100 disabled:text-gray-300 shadow-xl shadow-emerald-900/20"
                >
                    Checkout Trade ({cart.length})
                </button>
            </div>
        </div>

        <div className="bg-[#0B1221] text-white border border-white/5 p-10 rounded-[3rem] flex items-center gap-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 transform rotate-12 scale-150 pointer-events-none group-hover:scale-[1.7] transition-transform duration-1000"><ShieldCheck size={160} /></div>
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0 border-2 border-white/20"><ShieldCheck size={32} strokeWidth={2.5}/></div>
            <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Clearance Trading Rules Enabled</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-2xl">
                    Clearance stock listed here is priced at a minimum of <span className="text-white font-black">30% discount</span>. Wholesalers set specific minimum volume and logistics requirements per lot to ensure efficient bulk clearing.
                </p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-2">
            {agedInventory.filter(x => x.product.name.toLowerCase().includes(searchTerm.toLowerCase())).map((pair, idx) => (
                <ProductCard key={idx} product={pair.product} item={pair.item} onAdd={addToCart} />
            ))}
            {agedInventory.length === 0 && (
                <div className="col-span-full py-40 text-center text-gray-300 bg-white rounded-[3rem] border border-gray-100 shadow-inner">
                    <ShoppingBag size={64} className="mx-auto mb-4 opacity-10" />
                    <p className="font-black uppercase tracking-widest text-xs">No active clearance lots currently published.</p>
                </div>
            )}
        </div>
    </div>
  );
};
