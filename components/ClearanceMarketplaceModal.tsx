
import React, { useState, useEffect } from 'react';
import { X, Store, Info, CheckCircle, Package, Truck, Scale, Loader2, HandCoins } from 'lucide-react';
import { Product, User, ClearanceLot } from '../types';
import { mockService } from '../services/mockDataService';

interface ClearanceMarketplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  user: User;
  onComplete: () => void;
}

export const ClearanceMarketplaceModal: React.FC<ClearanceMarketplaceModalProps> = ({ isOpen, onClose, product, user, onComplete }) => {
    const [rate, setRate] = useState<string>('');
    const [minOrder, setMinOrder] = useState<string>('100');
    const [logisticsRate, setLogisticsRate] = useState<string>('0.10');
    const [minWeight, setMinWeight] = useState<string>('200');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && product) {
            // Apply automatic 30% discount floor
            const discounted = product.defaultPricePerKg * 0.7;
            setRate(discounted.toFixed(2));
        }
    }, [isOpen, product]);

    if (!isOpen) return null;

    const maxPriceEligible = (product.defaultPricePerKg * 0.7).toFixed(2);
    const isValidPrice = parseFloat(rate) <= parseFloat(maxPriceEligible);

    const handlePublish = async () => {
        if (!isValidPrice) {
            alert(`Rate must be at least 30% below standard rate ($${maxPriceEligible}) for marketplace eligibility.`);
            return;
        }

        setIsSubmitting(true);
        const lot: ClearanceLot = {
            id: `clr-${Date.now()}`,
            productId: product.id,
            sellerId: user.id,
            marketplaceRate: parseFloat(rate),
            minOrderKg: parseFloat(minOrder),
            logisticsRate: parseFloat(logisticsRate),
            minLogisticsWeight: parseFloat(minWeight),
            timestamp: new Date().toISOString(),
            status: 'ACTIVE'
        };

        await new Promise(r => setTimeout(r, 1500));
        mockService.addClearanceLot(lot);
        setIsSubmitting(false);
        onComplete();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[3.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200 border-2 border-white/50">
                
                {/* Header Section */}
                <div className="p-8 md:p-10 flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-[#D1FAE5] text-[#10B981] rounded-2xl flex items-center justify-center shadow-inner-sm border border-emerald-100">
                            <Store size={28} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-[#0F172A] uppercase tracking-tight leading-none">Add to Marketplace</h2>
                            <p className="text-[10px] text-[#10B981] font-black uppercase tracking-[0.2em] mt-2">Wholesale Clearance Protocol</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2.5 bg-white border border-gray-100 rounded-full text-gray-300 hover:text-gray-900 transition-all shadow-sm">
                        <X size={24} strokeWidth={2.5}/>
                    </button>
                </div>

                <div className="px-8 md:px-10 pb-10 space-y-8">
                    
                    {/* Product Card Header */}
                    <div className="bg-[#043003] rounded-[2rem] p-8 flex items-center gap-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 transform rotate-12 scale-150"><Sparkles size={120} className="text-emerald-400"/></div>
                        <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl relative z-10">
                            <img src={product.imageUrl} className="w-full h-full object-cover" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight">{product.name}</h3>
                            <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mt-1">Standard Rate: ${product.defaultPricePerKg.toFixed(2)} / kg</p>
                        </div>
                    </div>

                    {/* Pricing Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end px-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Marketplace Rate ($)</label>
                            <span className="bg-red-50 text-red-500 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-red-100">Min 30% Req.</span>
                        </div>
                        <div className={`p-8 rounded-[2rem] border-2 transition-all flex items-center gap-4 ${isValidPrice ? 'bg-white border-gray-100 shadow-inner-sm' : 'bg-red-50 border-red-200'}`}>
                            <span className="text-4xl font-black text-red-300">$</span>
                            <input 
                                type="number"
                                step="0.01"
                                className="flex-1 text-6xl font-black text-red-900 outline-none bg-transparent tracking-tighter"
                                value={rate}
                                onChange={e => setRate(e.target.value)}
                            />
                        </div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-2">
                            Max Price: <span className="text-emerald-600">${maxPriceEligible}</span> for eligibility.
                        </p>
                    </div>

                    {/* Grid Inputs */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Minimum Order (KG)</label>
                            <div className="bg-gray-50 rounded-2xl p-5 flex items-center gap-4 border border-gray-100 shadow-inner-sm">
                                <Package size={20} className="text-gray-300"/>
                                <input 
                                    type="number"
                                    className="flex-1 bg-transparent font-black text-gray-900 text-lg outline-none"
                                    value={minOrder}
                                    onChange={e => setMinOrder(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Logistics Rate ($/KG)</label>
                                <div className="bg-gray-50 rounded-2xl p-5 flex items-center gap-4 border border-gray-100 shadow-inner-sm">
                                    <Truck size={20} className="text-gray-300"/>
                                    <input 
                                        type="number"
                                        step="0.01"
                                        className="flex-1 bg-transparent font-black text-gray-900 text-lg outline-none"
                                        value={logisticsRate}
                                        onChange={e => setLogisticsRate(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Min Logistics Weight</label>
                                <div className="bg-gray-50 rounded-2xl p-5 flex items-center gap-4 border border-gray-100 shadow-inner-sm">
                                    <Scale size={20} className="text-gray-300"/>
                                    <input 
                                        type="number"
                                        className="flex-1 bg-transparent font-black text-gray-900 text-lg outline-none"
                                        value={minWeight}
                                        onChange={e => setMinWeight(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Visibility Alert */}
                    <div className="bg-[#F0FDF4] border border-[#DCFCE7] p-6 rounded-3xl flex items-start gap-4">
                        <Info size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-[#166534] font-medium leading-relaxed">
                            Visible to all <span className="font-black">Grocery Store</span> and <span className="font-black">Retail</span> partners. High-volume clearance at competitive rates.
                        </p>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 flex gap-4">
                        <button 
                            onClick={onClose}
                            className="flex-1 py-5 bg-gray-50 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
                        >
                            Discard
                        </button>
                        <button 
                            onClick={handlePublish}
                            disabled={isSubmitting || !rate}
                            className="flex-[2] py-5 bg-[#EEF2FF] hover:bg-indigo-600 hover:text-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                        >
                            {isSubmitting ? <Loader2 size={20} className="animate-spin"/> : <><CheckCircle size={20}/> Publish Lot</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Sparkles = ({ size = 24, ...props }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3 1.912 5.886L20 10.8l-5.886 1.912L12 21l-1.912-5.886L4 13.2l5.886-1.912L12 3Z"/><path d="M5 3v4"/><path d="M3 5h4"/><path d="M21 17v4"/><path d="M19 19h4"/></svg>
);
