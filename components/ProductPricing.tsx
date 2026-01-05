
import React, { useState, useEffect, useRef } from 'react';
import { Product, PricingRule, User, InventoryItem, ProductUnit } from '../types';
import { mockService } from '../services/mockDataService';
import { SellProductDialog } from './SellProductDialog';
import { ShareModal } from './SellerDashboardV1';
import { 
  Tag, Edit2, Check, X, DollarSign, MapPin, 
  MoreVertical, ShoppingBag, 
  Share2, PackagePlus, CheckCircle, Plus, Camera, Loader2, ChevronRight,
  Box, Hash, Printer, QrCode, Sparkles, ChevronDown, Pencil, ShoppingCart,
  Search, HandCoins, ImagePlus, Leaf, Store, Smartphone, Settings2, Settings,
  AlertTriangle, Truck, Package, Info, List, LayoutGrid, Scale
} from 'lucide-react';

interface ProductPricingProps {
  user: User;
}

const UNITS: ProductUnit[] = ['KG', 'Tray', 'Bin', 'Tonne', 'loose'];

const MarketplacePublishModal = ({ isOpen, onClose, product, inventoryItem, onComplete }: {
    isOpen: boolean,
    onClose: () => void,
    product: Product,
    inventoryItem: InventoryItem,
    onComplete: () => void
}) => {
    const standardPrice = product.defaultPricePerKg;
    const minRequiredDiscount = 0.3; // 30%
    const maxAllowedPrice = standardPrice * (1 - minRequiredDiscount);
    
    const [price, setPrice] = useState(maxAllowedPrice.toFixed(2));
    const [minOrder, setMinOrder] = useState('100');
    const [logisticsPricePerKg, setLogisticsPricePerKg] = useState('0.10');
    const [minLogisticsKg, setMinLogisticsKg] = useState('200');
    const [isSaving, setIsSaving] = useState(false);

    if (!isOpen) return null;

    const currentPriceNum = parseFloat(price) || 0;
    const isPriceAttractive = currentPriceNum <= maxAllowedPrice;
    const discountPercent = ((standardPrice - currentPriceNum) / standardPrice) * 100;

    const handlePublish = async () => {
        if (!isPriceAttractive) return;
        setIsSaving(true);
        mockService.publishToMarketplace(
            inventoryItem.id, 
            currentPriceNum, 
            parseFloat(minOrder), 
            parseFloat(logisticsPricePerKg), 
            parseFloat(minLogisticsKg)
        );
        await new Promise(r => setTimeout(r, 1000));
        setIsSaving(false);
        onComplete();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 flex flex-col">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                            <Store size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight leading-none">Add to Marketplace</h2>
                            <p className="text-[10px] text-emerald-600 font-black uppercase tracking-[0.2em] mt-1.5">Direct Retail Clearance Protocol</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-300 hover:text-gray-900 transition-colors p-2 bg-white rounded-full border border-gray-100 shadow-sm">
                        <X size={24} strokeWidth={2.5} />
                    </button>
                </div>

                <div className="p-10 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="bg-[#043003] p-6 rounded-3xl text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 transform rotate-12 scale-150"><Sparkles size={120}/></div>
                        <div className="relative z-10 flex items-center gap-4">
                             <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/20 shrink-0">
                                <img src={product.imageUrl} className="w-full h-full object-cover" />
                             </div>
                             <div>
                                <h3 className="font-black uppercase tracking-tight text-lg leading-none">{product.name}</h3>
                                <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mt-1.5">Standard Rate: ${standardPrice.toFixed(2)} / {product.unit || 'kg'}</p>
                             </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between items-end px-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Marketplace Rate ($)</label>
                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border ${isPriceAttractive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100 animate-pulse'}`}>
                                    {isPriceAttractive ? `${discountPercent.toFixed(0)}% Discount Applied` : 'Min 30% Discount Req.'}
                                </span>
                            </div>
                            <div className="relative group">
                                <DollarSign className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isPriceAttractive ? 'text-emerald-500' : 'text-red-400'}`} size={24}/>
                                <input 
                                    type="number" 
                                    step="0.01"
                                    className={`w-full pl-14 pr-6 py-6 rounded-[1.75rem] font-black text-4xl outline-none transition-all shadow-inner-sm border-2 ${isPriceAttractive ? 'bg-gray-50 border-gray-100 focus:bg-white focus:border-emerald-500 text-gray-900' : 'bg-red-50 border-red-200 text-red-900 focus:bg-white'}`}
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight ml-1">
                                Price must be <span className="text-emerald-600 font-black">${maxAllowedPrice.toFixed(2)}</span> or less to qualify for the marketplace.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Minimum Order Qty ({product.unit || 'kg'})</label>
                                <div className="relative">
                                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18}/>
                                    <input 
                                        type="number" 
                                        className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-black text-gray-900 outline-none focus:bg-white focus:border-indigo-500 transition-all shadow-inner-sm"
                                        value={minOrder}
                                        onChange={(e) => setMinOrder(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Logistics Rate ($/kg)</label>
                                <div className="relative">
                                    <Truck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18}/>
                                    <input 
                                        type="number" 
                                        step="0.01"
                                        className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-black text-gray-900 outline-none focus:bg-white focus:border-indigo-500 transition-all shadow-inner-sm"
                                        value={logisticsPricePerKg}
                                        onChange={(e) => setLogisticsPricePerKg(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Minimum Logistics Weight (kg)</label>
                                <div className="relative">
                                    <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18}/>
                                    <input 
                                        type="number" 
                                        className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-black text-gray-900 outline-none focus:bg-white focus:border-indigo-500 transition-all shadow-inner-sm"
                                        value={minLogisticsKg}
                                        onChange={(e) => setMinLogisticsKg(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100 flex items-start gap-4">
                        <Info size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-emerald-800 font-medium leading-relaxed">
                            Publishing this lot will make it visible to all <span className="font-black">Grocery Store</span> and <span className="font-black">Retail</span> partners on the platform. These buyers seek bulk clearance volume at highly competitive rates.
                        </p>
                    </div>
                </div>

                <div className="p-8 border-t border-gray-100 bg-white shrink-0 flex gap-4">
                     <button onClick={onClose} className="flex-1 py-5 bg-gray-50 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">Discard</button>
                     <button 
                        onClick={handlePublish}
                        disabled={isSaving || !isPriceAttractive}
                        className={`flex-[2] py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl ${isPriceAttractive ? 'bg-[#043003] text-white shadow-emerald-100 hover:bg-black' : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'}`}
                     >
                         {isSaving ? <Loader2 className="animate-spin" size={20}/> : <><CheckCircle size={20}/> Publish Wholesale Lot</>}
                     </button>
                </div>
            </div>
        </div>
    );
};

const AddProductModal = ({ isOpen, onClose, onComplete }: { 
    isOpen: boolean, 
    onClose: () => void, 
    onComplete: () => void 
}) => {
    const [image, setImage] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [variety, setVariety] = useState('');
    const [category, setCategory] = useState<'Vegetable' | 'Fruit'>('Vegetable');
    const [price, setPrice] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => setImage(ev.target?.result as string);
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        
        const newProd: Product = {
            id: `p-man-${Date.now()}`,
            name,
            variety: variety || 'Standard',
            category,
            imageUrl: image || 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=400&h=400',
            defaultPricePerKg: parseFloat(price),
            co2SavingsPerKg: 0.8
        };

        mockService.addProduct(newProd);

        setTimeout(() => {
            setIsSaving(false);
            onComplete();
            onClose();
            setName('');
            setVariety('');
            setPrice('');
            setImage(null);
        }, 800);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-2xl font-black text-[#0F172A] tracking-tight uppercase">Add New Product</h2>
                        <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.2em] mt-1">Marketplace Catalog Creation</p>
                    </div>
                    <button onClick={onClose} className="text-gray-300 hover:text-gray-900 transition-colors p-2 bg-white rounded-full border border-gray-100 shadow-sm">
                        <X size={24} strokeWidth={2.5} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-8">
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`h-48 border-4 border-dashed rounded-[2rem] flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden bg-white shadow-inner-sm ${image ? 'border-emerald-300 shadow-none' : 'border-gray-100 hover:border-indigo-300 hover:bg-gray-50/50'}`}
                    >
                        {image ? (
                            <img src={image} className="w-full h-full object-cover" alt="Preview"/>
                        ) : (
                            <div className="text-center">
                                <div className="bg-indigo-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600 shadow-sm">
                                    <ImagePlus size={32} strokeWidth={2.5}/>
                                </div>
                                <h3 className="text-lg font-black text-gray-900 mb-1">Upload Catalog Image</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Hi-Res JPEG or PNG</p>
                            </div>
                        )}
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange}/>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Produce Name</label>
                            <input required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-gray-900 outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all" placeholder="e.g. Organic Roma Tomatoes" value={name} onChange={e => setName(e.target.value)}/>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Variety</label>
                            <input required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-gray-900 outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all" placeholder="e.g. Roma" value={variety} onChange={e => setVariety(e.target.value)}/>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Category</label>
                            <select className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-gray-900 outline-none focus:bg-white transition-all appearance-none" value={category} onChange={e => setCategory(e.target.value as any)}>
                                <option value="Vegetable">Vegetable</option>
                                <option value="Fruit">Fruit</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Default Market Price ($/kg)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20}/>
                                <input required type="number" step="0.01" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-black text-2xl text-gray-900 outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all" placeholder="0.00" value={price} onChange={e => setPrice(e.target.value)}/>
                            </div>
                        </div>
                    </div>

                    <button 
                        disabled={isSaving || !name || !price}
                        className="w-full py-5 bg-[#043003] hover:bg-black text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={24}/> : <><Sparkles size={20}/> Add to Global Catalog</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

const EditPricingModal = ({ isOpen, onClose, product, onComplete }: { 
    isOpen: boolean, 
    onClose: () => void, 
    product: Product | null,
    onComplete: () => void 
}) => {
    const [price, setPrice] = useState<string>('');
    const [unit, setUnit] = useState<ProductUnit>('KG');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (product) {
            setPrice(product.defaultPricePerKg.toString());
            setUnit(product.unit || 'KG');
        }
    }, [product]);

    if (!isOpen || !product) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        mockService.updateProductPricing(product.id, parseFloat(price), unit);
        setTimeout(() => {
            setIsSaving(false);
            onComplete();
            onClose();
        }, 600);
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Master Pricing</h2>
                        <p className="text-xs text-gray-400 font-black uppercase tracking-widest mt-1">{product.name}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2"><X size={24}/></button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 ml-1">Base Sale Rate</label>
                            <div className="relative group">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" size={20}/>
                                <input 
                                    required 
                                    type="number" 
                                    step="0.01"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-emerald-500 font-black text-2xl text-gray-900 transition-all shadow-inner-sm" 
                                    value={price} 
                                    onChange={e => setPrice(e.target.value)} 
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 ml-1">Unit of Measurement</label>
                            <div className="grid grid-cols-3 gap-2">
                                {UNITS.map(u => (
                                    <button
                                        key={u}
                                        type="button"
                                        onClick={() => setUnit(u)}
                                        className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${unit === u ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-gray-50 text-gray-400 hover:border-indigo-200'}`}
                                    >
                                        {u}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={isSaving}
                        className="w-full py-5 bg-[#043003] text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-emerald-100 hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={20}/> : <><CheckCircle size={20}/> Update Marketplace Rate</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

const AddInventoryModal = ({ isOpen, onClose, user, products, onComplete, initialProductId }: { 
    isOpen: boolean, 
    onClose: () => void, 
    user: User, 
    products: Product[],
    onComplete: () => void,
    initialProductId?: string
}) => {
    const [image, setImage] = useState<string | null>(null);
    const [productId, setProductId] = useState(initialProductId || '');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState<ProductUnit>('KG');
    const [harvestLocation, setHarvestLocation] = useState('');
    const [warehouseLocation, setWarehouseLocation] = useState('');
    const [farmerName, setFarmerName] = useState('');
    const [price, setPrice] = useState('');
    const [discountPrice, setDiscountPrice] = useState('');
    const [discountAfterDays, setDiscountAfterDays] = useState('3');
    const [isSubmitting, setSubmitting] = useState(false);
    
    const [isNewProductMode, setIsNewProductMode] = useState(false);
    const [newProductName, setNewProductName] = useState('');
    const [newProductVariety, setNewProductVariety] = useState('');
    const [newProductCategory, setNewProductCategory] = useState<'Vegetable' | 'Fruit'>('Vegetable');

    const [newLotId, setNewLotId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setProductId(initialProductId || '');
        }
    }, [isOpen, initialProductId]);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => setImage(ev.target?.result as string);
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if ((!isNewProductMode && !productId) || (isNewProductMode && !newProductName) || !quantity || !price) {
            alert("Please fill in all required fields.");
            return;
        }

        setSubmitting(true);
        const lotId = mockService.generateLotId();
        
        let targetProductId = productId;

        if (isNewProductMode) {
            const newProdId = `p-man-${Date.now()}`;
            const newProd: Product = {
                id: newProdId,
                name: newProductName,
                variety: newProductVariety || 'Standard',
                category: newProductCategory,
                imageUrl: image || 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=100&h=100',
                defaultPricePerKg: parseFloat(price),
                co2SavingsPerKg: 0.8
            };
            mockService.addProduct(newProd);
            targetProductId = newProdId;
        }

        const newItem: InventoryItem = {
            id: `inv-${Date.now()}`,
            lotNumber: lotId,
            productId: targetProductId,
            ownerId: user.id,
            quantityKg: parseFloat(quantity),
            unit: unit,
            harvestLocation,
            warehouseLocation,
            originalFarmerName: farmerName,
            status: 'Available',
            harvestDate: new Date().toISOString(),
            uploadedAt: new Date().toISOString(),
            expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            discountAfterDays: parseInt(discountAfterDays),
            discountPricePerKg: discountPrice ? parseFloat(discountPrice) : undefined,
            batchImageUrl: image || undefined
        };

        mockService.addInventoryItem(newItem);
        mockService.updateProductPrice(targetProductId, parseFloat(price));

        setTimeout(() => {
            setSubmitting(false);
            setNewLotId(lotId);
            onComplete();
            setIsNewProductMode(false);
            setNewProductName('');
            setNewProductVariety('');
        }, 800);
    };

    if (newLotId) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md p-10 text-center animate-in zoom-in-95 duration-200">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                        <CheckCircle size={40} className="md:w-12 md:h-12" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-2 uppercase">Stock Logged</h2>
                    <p className="text-gray-500 mb-8 font-medium text-sm md:text-base">Physical identification tag generated.</p>
                    
                    <div className="bg-gray-50 border-2 border-gray-100 rounded-[2rem] p-6 md:p-8 mb-8 flex flex-col items-center">
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-4">
                            <QrCode size={100} className="text-gray-900 md:w-32 md:h-32" />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Assigned Lot ID</p>
                        <p className="text-xl md:text-2xl font-black text-indigo-600 font-mono tracking-tighter">{newLotId}</p>
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-4 flex items-center gap-1.5">
                            <Box size={12}/> Bin: {warehouseLocation || 'Warehouse General'}
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button className="w-full py-4 md:py-5 bg-[#043003] text-white rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:bg-black transition-all">
                            <Printer size={18}/> Print Bin Label
                        </button>
                        <button onClick={() => { setNewLotId(null); onClose(); }} className="w-full py-3 md:py-4 bg-white border-2 border-gray-100 text-gray-400 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-gray-50 transition-all">
                            Back to Catalog
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl my-8 animate-in zoom-in-95 duration-200 overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
                <div className="p-6 md:p-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/30 sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl md:text-2xl font-black text-[#0F172A] tracking-tight uppercase">Log Arrival Batch</h2>
                        <p className="text-xs text-indigo-500 font-black uppercase tracking-[0.2em] mt-1">Audit Trail Entry • Market Inward</p>
                    </div>
                    <button onClick={onClose} className="text-gray-300 hover:text-gray-600 transition-colors p-2 bg-white rounded-full border border-gray-100 shadow-sm">
                        <X size={24} strokeWidth={2.5} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-10 pt-4 space-y-10 custom-scrollbar">
                    
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`h-48 md:h-56 border-4 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden bg-white shadow-inner-sm ${image ? 'border-emerald-300 shadow-none' : 'border-gray-100 hover:border-indigo-300 hover:bg-gray-50/50'}`}
                    >
                        {image ? (
                            <img src={image} className="w-full h-full object-cover" alt="Preview"/>
                        ) : (
                            <div className="text-center p-6">
                                <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600 shadow-sm">
                                    <Camera size={32} strokeWidth={2.5}/>
                                </div>
                                <h3 className="text-lg font-black text-gray-900 mb-1">Batch Evidence Photo</h3>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Required for Quality Audit</p>
                            </div>
                        )}
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange}/>
                    </div>

                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="md:col-span-2">
                                <div className="flex justify-between items-center mb-2 px-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Catalog Link</label>
                                    <button 
                                        type="button" 
                                        onClick={() => setIsNewProductMode(!isNewProductMode)}
                                        className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
                                    >
                                        {isNewProductMode ? 'Select from list' : '+ Add Custom Product'}
                                    </button>
                                </div>
                                
                                {isNewProductMode ? (
                                    <div className="space-y-4 animate-in slide-in-from-top-2">
                                        <input required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-sm text-gray-900 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none" placeholder="Product Name (e.g. Heirloom Carrots)" value={newProductName} onChange={e => setNewProductName(e.target.value)}/>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-sm text-gray-900 focus:bg-white outline-none" placeholder="Variety (Optional)" value={newProductVariety} onChange={e => setNewProductVariety(e.target.value)}/>
                                            <select className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-sm text-gray-900 outline-none" value={newProductCategory} onChange={e => setNewProductCategory(e.target.value as any)}>
                                                <option value="Vegetable">Vegetable</option>
                                                <option value="Fruit">Fruit</option>
                                            </select>
                                        </div>
                                    </div>
                                ) : (
                                    <select 
                                        required
                                        className="w-full p-4 md:p-5 bg-gray-50 border-2 border-gray-100 rounded-2xl font-black text-sm text-gray-900 focus:bg-white focus:border-indigo-500 transition-all outline-none appearance-none shadow-inner-sm"
                                        value={productId}
                                        onChange={e => setProductId(e.target.value)}
                                    >
                                        <option value="">Select recognized product...</option>
                                        {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.variety})</option>)}
                                    </select>
                                )}
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Volume (Qty)</label>
                                <div className="relative">
                                    <input required type="number" placeholder="0.00" className="w-full p-4 md:p-5 bg-gray-50 border border-gray-100 rounded-2xl font-black text-xl text-gray-900 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all" value={quantity} onChange={e => setQuantity(e.target.value)}/>
                                    <select className="absolute right-4 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-lg text-[10px] font-black px-2 py-1 outline-none" value={unit} onChange={e => setUnit(e.target.value as any)}>
                                        {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Unit Rate ($)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20}/>
                                    <input required type="number" step="0.01" placeholder="0.00" className="w-full pl-10 pr-4 py-4 md:p-5 bg-gray-50 border border-gray-100 rounded-2xl font-black text-xl text-gray-900 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all" value={price} onChange={e => setPrice(e.target.value)}/>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100">
                             <div className="md:col-span-2 flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
                                <MapPin size={14}/> Sourcing & Warehouse
                             </div>
                             <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1 block">Original Farm / Source</label><input className="w-full p-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 outline-none" placeholder="e.g. Sunny Hill Orchards" value={farmerName} onChange={e => setFarmerName(e.target.value)} /></div>
                             <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1 block">Harvest Location</label><input className="w-full p-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 outline-none" placeholder="e.g. Mildura, VIC" value={harvestLocation} onChange={e => setHarvestLocation(e.target.value)} /></div>
                             <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1 block">Internal Bin Location</label><input className="w-full p-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 outline-none" placeholder="e.g. Section B-42" value={warehouseLocation} onChange={e => setWarehouseLocation(e.target.value)} /></div>
                        </div>

                        <div className="bg-orange-50/50 p-6 md:p-8 rounded-[2.5rem] border border-orange-100/50">
                             <div className="flex items-center gap-2 text-orange-600 font-black text-[10px] uppercase tracking-[0.2em] mb-6">
                                <Sparkles size={16}/> Dynamic Pricing Config
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Days until expiry discount</label>
                                    <input type="number" className="w-full p-4 bg-white border border-orange-100 rounded-2xl font-black text-gray-900 outline-none focus:ring-4 focus:ring-orange-500/5" value={discountAfterDays} onChange={e => setDiscountAfterDays(e.target.value)}/>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Discounted Rate ($/kg)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-200" size={18}/>
                                        <input type="number" step="0.01" className="w-full pl-10 pr-4 py-4 bg-white border border-orange-100 rounded-2xl font-black text-gray-900 outline-none focus:ring-4 focus:ring-orange-500/5" placeholder="0.00" value={discountPrice} onChange={e => setDiscountPrice(e.target.value)}/>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                </form>

                <div className="p-6 md:p-10 border-t border-gray-100 bg-white sticky bottom-0 z-10 flex gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
                    <button 
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-4 md:py-5 bg-gray-50 text-gray-400 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
                    >
                        Discard
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex-[2] py-4 md:py-5 bg-[#043003] hover:bg-black text-white rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-900/10 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={20}/> : <><PackagePlus size={20}/> Finalize Stock Entry</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const ProductPricing: React.FC<ProductPricingProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'rules'>('catalog');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProductForInventory, setSelectedProductForInventory] = useState<string | undefined>(undefined);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
  
  // Marketplace Publishing State
  const [publishingToMarketplace, setPublishingToMarketplace] = useState<{product: Product, item: InventoryItem} | null>(null);

  // Instant Sale Logic
  const [saleProduct, setSaleProduct] = useState<Product | null>(null);
  
  // Share Logic
  const [shareItem, setShareItem] = useState<InventoryItem | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [user.id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveActionMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadData = () => {
    setInventory(mockService.getInventory(user.id));
    setProducts(mockService.getAllProducts().sort((a, b) => a.name.localeCompare(b.name)));
  };

  const toggleActionMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveActionMenu(activeActionMenu === id ? null : id);
  };

  const handleLogNewStock = () => {
    setSelectedProductForInventory(undefined);
    setIsInventoryModalOpen(true);
  };

  const handleProductAddStock = (productId: string) => {
    setSelectedProductForInventory(productId);
    setIsInventoryModalOpen(true);
    setActiveActionMenu(null);
  };

  const handlePublishToMarketplaceAction = (productId: string, stock: InventoryItem[]) => {
      if (stock.length > 0) {
          const product = products.find(p => p.id === productId);
          if (product) {
            setPublishingToMarketplace({ product, item: stock[0] });
          }
      } else {
          alert("Please log stock for this product before adding to marketplace.");
      }
      setActiveActionMenu(null);
  };

  const handleShareClick = (product: Product, stock: InventoryItem[]) => {
      if (stock.length > 0) {
          setShareItem(stock[0]);
      } else {
          const transientItem: InventoryItem = {
              id: `tr-${product.id}`,
              lotNumber: 'CATALOG',
              productId: product.id,
              ownerId: user.id,
              quantityKg: 0,
              expiryDate: new Date().toISOString(),
              harvestDate: new Date().toISOString(),
              uploadedAt: new Date().toISOString(),
              status: 'Available'
          };
          setShareItem(transientItem);
      }
      setActiveActionMenu(null);
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
        <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight uppercase leading-none">Inventory & Price</h1>
            <p className="text-gray-400 font-bold text-xs md:text-sm mt-1">Global catalog and stock management for {user.businessName}.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button 
                onClick={() => setIsAddProductModalOpen(true)}
                className="flex-1 md:flex-none px-6 py-3 md:py-4 bg-white border-2 border-indigo-600 text-indigo-600 rounded-[1.25rem] font-black text-[10px] md:text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm hover:bg-indigo-50 transition-all active:scale-95"
            >
                <Plus size={18}/> New Catalog Variety
            </button>
            <button 
                onClick={handleLogNewStock}
                className="flex-1 md:flex-none px-6 py-3 md:py-4 bg-[#043003] text-white rounded-[1.25rem] font-black text-[10px] md:text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-emerald-100 hover:bg-black transition-all active:scale-95"
            >
                <PackagePlus size={18}/> Log Fresh Stock
            </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-[2.5rem] shadow-sm overflow-visible min-h-[600px]">
        <div className="p-6 md:p-10 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 bg-gray-50/30">
            <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="p-3 bg-white rounded-2xl text-gray-900 border border-gray-200 shadow-sm hidden md:block">
                    <ShoppingBag size={24}/>
                </div>
                <div className="bg-gray-100 p-1 rounded-xl flex border border-gray-200">
                    <button onClick={() => setActiveTab('catalog')} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'catalog' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Market Catalog</button>
                    <button onClick={() => setActiveTab('rules')} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'rules' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><Zap size={12}/> Yield Rules</button>
                </div>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
                    <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}><LayoutGrid size={18}/></button>
                    <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}><List size={18}/></button>
                </div>
                <div className="relative w-full md:w-80 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search varieties..." 
                        className="w-full pl-12 pr-6 py-3.5 md:py-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-slate-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all shadow-sm" 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
        </div>

        {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-6 md:p-10 gap-6 md:gap-8 overflow-visible">
                {filteredProducts.map(product => {
                    const stock = inventory.filter(i => i.productId === product.id && i.status === 'Available');
                    const totalStock = stock.reduce((sum, s) => sum + s.quantityKg, 0);
                    const hasActiveMenu = activeActionMenu === product.id;

                    return (
                        <div key={product.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm flex flex-col hover:shadow-xl hover:scale-[1.02] transition-all group animate-in zoom-in-95 overflow-visible">
                            <div className="relative h-40 md:h-48 overflow-hidden rounded-t-[2rem] bg-gray-100">
                                <img src={product.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

                                <div className="absolute bottom-4 left-4 flex gap-2">
                                    <span className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-900 shadow-sm border border-white/20">{product.variety}</span>
                                    {totalStock > 0 && <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg animate-in slide-in-from-bottom-2">Live Now</span>}
                                </div>
                            </div>

                            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-xl font-black text-gray-900 tracking-tight leading-none uppercase">{product.name}</h3>
                                        <div className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1">
                                            <Leaf size={10}/>
                                            <span className="text-[7px] font-black uppercase">Market-Ready</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Global Rate</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-black text-emerald-600 tracking-tighter">${product.defaultPricePerKg.toFixed(2)}</span>
                                                <span className="text-[10px] font-black text-gray-400 uppercase">/{product.unit || 'kg'}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Stock Vol</p>
                                            <p className={`font-black text-sm ${totalStock > 0 ? 'text-indigo-600' : 'text-gray-400'}`}>
                                                {totalStock.toLocaleString()}{product.unit || 'kg'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex gap-2 relative">
                                    <button 
                                        onClick={() => setSaleProduct(product)}
                                        className="flex-1 py-4 bg-[#043003] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2 active:scale-95"
                                    >
                                        <HandCoins size={16}/> SELL
                                    </button>
                                    
                                    <button 
                                        onClick={() => handlePublishToMarketplaceAction(product.id, stock)}
                                        disabled={totalStock === 0}
                                        className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border-2 active:scale-95 ${totalStock > 0 ? 'bg-emerald-50 border-emerald-500 text-emerald-700 hover:bg-emerald-600 hover:text-white shadow-emerald-50' : 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed opacity-50'}`}
                                    >
                                        <Store size={16}/> + MARKETPLACE
                                    </button>

                                    <div className="absolute -top-3 -right-2">
                                        <button 
                                            onClick={(e) => toggleActionMenu(e, product.id)}
                                            className={`p-2 rounded-full transition-all border shadow-sm ${hasActiveMenu ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-400 border-gray-100 hover:text-indigo-600'}`}
                                        >
                                            <Settings size={14}/>
                                        </button>

                                        {hasActiveMenu && (
                                            <div ref={menuRef} className="absolute right-0 bottom-full mb-3 w-64 bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-gray-100 z-[100] animate-in slide-in-from-bottom-2 zoom-in-95 duration-200 py-3 overflow-hidden ring-1 ring-black/5 text-left">
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); handleProductAddStock(product.id); }}
                                                    className="w-full text-left px-6 py-4 hover:bg-gray-50 flex items-center gap-4 group/item transition-colors"
                                                >
                                                    <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-all shadow-sm">
                                                        <Edit2 size={16}/>
                                                    </div>
                                                    <span className="font-black text-gray-900 text-[11px] uppercase tracking-widest">Log Batch & Price</span>
                                                </button>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); handleShareClick(product, stock); }}
                                                    className="w-full text-left px-6 py-4 hover:bg-gray-50 flex items-center gap-4 group/item transition-colors border-t border-gray-50"
                                                >
                                                    <div className="p-2.5 bg-blue-500 rounded-xl text-white group-hover/item:bg-blue-700 transition-all shadow-md">
                                                        <Smartphone size={16}/>
                                                    </div>
                                                    <span className="font-black text-gray-900 text-[11px] uppercase tracking-widest">Connect (SMS)</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        ) : (
            <div className="overflow-x-auto p-4 md:p-10 animate-in fade-in duration-300">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                            <th className="px-6 py-6">Produce Variety</th>
                            <th className="px-6 py-6 text-center">Stock Vol</th>
                            <th className="px-6 py-6 text-right">Global Rate</th>
                            <th className="px-6 py-6 text-center">Market Status</th>
                            <th className="px-6 py-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredProducts.map(product => {
                            const stock = inventory.filter(i => i.productId === product.id && i.status === 'Available');
                            const totalStock = stock.reduce((sum, s) => sum + s.quantityKg, 0);
                            const hasActiveMenu = activeActionMenu === product.id;

                            return (
                                <tr key={product.id} className="hover:bg-gray-50/30 transition-all group">
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl overflow-hidden border border-gray-100 shadow-inner-sm shrink-0">
                                                <img src={product.imageUrl} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="font-black text-gray-900 text-base uppercase tracking-tight leading-none mb-1.5">{product.name}</div>
                                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.variety}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-center">
                                        <span className={`font-black text-lg tracking-tighter ${totalStock > 0 ? 'text-indigo-600' : 'text-gray-300'}`}>
                                            {totalStock.toLocaleString()}<span className="text-[10px] uppercase ml-0.5">{product.unit || 'kg'}</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <div className="font-black text-emerald-600 text-xl tracking-tighter">${product.defaultPricePerKg.toFixed(2)}</div>
                                        <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Base Rate</div>
                                    </td>
                                    <td className="px-6 py-6 text-center">
                                        {totalStock > 0 ? (
                                            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm animate-in zoom-in duration-300">Live Trade</span>
                                        ) : (
                                            <span className="bg-gray-100 text-gray-400 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-gray-200">Out of Stock</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-6 text-right relative">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => setSaleProduct(product)}
                                                className="px-4 py-2.5 bg-[#043003] text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-sm"
                                            >
                                                Sell
                                            </button>
                                            <button 
                                                onClick={() => handlePublishToMarketplaceAction(product.id, stock)}
                                                disabled={totalStock === 0}
                                                className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border-2 active:scale-95 ${totalStock > 0 ? 'bg-emerald-50 border-emerald-500 text-emerald-700 hover:bg-emerald-600 hover:text-white' : 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed opacity-50'}`}
                                            >
                                                Marketplace
                                            </button>
                                            <button 
                                                onClick={(e) => toggleActionMenu(e, product.id)}
                                                className={`p-2.5 rounded-xl border-2 transition-all active:scale-95 ${hasActiveMenu ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100 hover:text-indigo-600'}`}
                                            >
                                                <Settings size={16}/>
                                            </button>

                                            {hasActiveMenu && (
                                                <div ref={menuRef} className="absolute right-6 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[100] animate-in zoom-in-95 duration-150 py-2 overflow-hidden ring-1 ring-black/5 text-left">
                                                    <button onClick={(e) => { e.stopPropagation(); handleProductAddStock(product.id); }} className="w-full text-left px-5 py-3 hover:bg-gray-50 flex items-center gap-3"><Edit2 size={14}/> <span className="text-[10px] font-black uppercase">Edit Vol</span></button>
                                                    <button onClick={(e) => { e.stopPropagation(); handleShareClick(product, stock); }} className="w-full text-left px-5 py-3 hover:bg-gray-50 flex items-center gap-3 border-t border-gray-50"><Smartphone size={14}/> <span className="text-[10px] font-black uppercase">SMS Link</span></button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        )}
      </div>

      <EditPricingModal 
        isOpen={!!editingProduct} 
        onClose={() => setEditingProduct(null)} 
        product={editingProduct} 
        onComplete={loadData}
      />

      <AddProductModal 
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onComplete={loadData}
      />

      <AddInventoryModal 
        isOpen={isInventoryModalOpen}
        onClose={() => setIsInventoryModalOpen(false)}
        user={user}
        products={products}
        onComplete={loadData}
        initialProductId={selectedProductForInventory}
      />

      {publishingToMarketplace && (
        <MarketplacePublishModal 
            isOpen={!!publishingToMarketplace}
            onClose={() => setPublishingToMarketplace(null)}
            product={publishingToMarketplace.product}
            inventoryItem={publishingToMarketplace.item}
            onComplete={loadData}
        />
      )}

      {saleProduct && (
        <SellProductDialog 
            isOpen={!!saleProduct} 
            onClose={() => setSaleProduct(null)} 
            product={saleProduct} 
            user={user}
            onComplete={() => { loadData(); setSaleProduct(null); }}
        />
      )}

      {shareItem && (
        <ShareModal 
            item={shareItem} 
            onClose={() => setShareItem(null)} 
            onComplete={() => { loadData(); setShareItem(null); }} 
            currentUser={user}
        />
      )}
    </div>
  );
};

const Zap = ({ size = 24, ...props }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);

const Scale = ({ size = 24, ...props }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h18"/></svg>
);
