
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, User, InventoryItem, ProductUnit } from '../types';
import { mockService } from '../services/mockDataService';
import { SellProductDialog } from './SellProductDialog';
import { ShareModal } from './SellerDashboardV1';
import { ClearanceMarketplaceModal } from './ClearanceMarketplaceModal';
import { 
  Tag, Edit2, Check, X, DollarSign, MapPin, 
  MoreVertical, ShoppingBag, 
  Share2, PackagePlus, CheckCircle, Plus, Camera, Loader2, ChevronRight,
  Box, Hash, Printer, QrCode, Sparkles, ChevronDown, Pencil, ShoppingCart,
  Search, HandCoins, ImagePlus, Leaf, Settings, Smartphone, Store
} from 'lucide-react';

interface ProductPricingProps {
  user: User;
}

const UNITS: ProductUnit[] = ['KG', 'Tray', 'Bin', 'Tonne', 'loose'];

// Fix: Implement missing modals
const AddProductModal = ({ isOpen, onClose, onComplete }: any) => {
    const [name, setName] = useState('');
    const [variety, setVariety] = useState('');
    const [price, setPrice] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mockService.addProduct({
            id: `p-${Date.now()}`,
            name,
            variety,
            category: 'Vegetable',
            defaultPricePerKg: parseFloat(price),
            imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=400'
        });
        onComplete();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black uppercase">Add Variety</h2>
                    <button onClick={onClose}><X size={20}/></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input required placeholder="Product Name" className="w-full p-3 border rounded-xl" value={name} onChange={e => setName(e.target.value)} />
                    <input required placeholder="Variety" className="w-full p-3 border rounded-xl" value={variety} onChange={e => setVariety(e.target.value)} />
                    <input required type="number" step="0.01" placeholder="Master Price ($/kg)" className="w-full p-3 border rounded-xl" value={price} onChange={e => setPrice(e.target.value)} />
                    <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-black rounded-xl">Save to Catalog</button>
                </form>
            </div>
        </div>
    );
};

const EditPricingModal = ({ isOpen, onClose, product, onComplete }: any) => {
    const [price, setPrice] = useState(product?.defaultPricePerKg?.toString() || '');

    useEffect(() => {
        if (product) setPrice(product.defaultPricePerKg.toString());
    }, [product]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mockService.updateProductPricing(product.id, parseFloat(price), product.unit || 'KG');
        onComplete();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black uppercase">Edit Rate: {product.name}</h2>
                    <button onClick={onClose}><X size={20}/></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-3 text-gray-400" size={20}/>
                        <input required type="number" step="0.01" className="w-full pl-10 p-3 border rounded-xl text-xl font-black" value={price} onChange={e => setPrice(e.target.value)} />
                    </div>
                    <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-black rounded-xl">Update Master Rate</button>
                </form>
            </div>
        </div>
    );
};

const AddInventoryModal = ({ isOpen, onClose, user, products, onComplete, initialProductId }: any) => {
    const [productId, setProductId] = useState(initialProductId || '');
    const [qty, setQty] = useState('');

    useEffect(() => {
        if (initialProductId) setProductId(initialProductId);
    }, [initialProductId]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mockService.addInventoryItem({
            id: `inv-${Date.now()}`,
            lotNumber: mockService.generateLotId(),
            productId,
            ownerId: user.id,
            quantityKg: parseFloat(qty),
            status: 'Available',
            uploadedAt: new Date().toISOString(),
            expiryDate: new Date(Date.now() + 86400000 * 7).toISOString(),
            harvestDate: new Date().toISOString()
        });
        onComplete();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black uppercase">Log Fresh Stock</h2>
                    <button onClick={onClose}><X size={20}/></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <select required className="w-full p-3 border rounded-xl" value={productId} onChange={e => setProductId(e.target.value)}>
                        <option value="">Select Product...</option>
                        {products.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <input required type="number" placeholder="Quantity (kg)" className="w-full p-3 border rounded-xl" value={qty} onChange={e => setQty(e.target.value)} />
                    <button type="submit" className="w-full py-3 bg-emerald-600 text-white font-black rounded-xl">Add to Warehouse</button>
                </form>
            </div>
        </div>
    );
};

export const ProductPricing: React.FC<ProductPricingProps> = ({ user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'catalog' | 'rules'>('catalog');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProductForInventory, setSelectedProductForInventory] = useState<string | undefined>(undefined);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
  
  // Clearance State
  const [selectedProductForClearance, setSelectedProductForClearance] = useState<Product | null>(null);
  
  // Instant Sale Logic
  const [saleProduct, setSaleProduct] = useState<Product | null>(null);
  
  // Share Logic
  const [shareItem, setShareItem] = useState<InventoryItem | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [user]);

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

  const handleOpenMarketplaceClearance = (product: Product) => {
    setSelectedProductForClearance(product);
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4 md:mb-10">
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
            <div className="relative w-full md:w-96 group">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-6 md:p-10 gap-6 md:gap-8">
            {filteredProducts.map(product => {
                const stock = inventory.filter(i => i.productId === product.id && i.status === 'Available');
                const totalStock = stock.reduce((sum, s) => sum + s.quantityKg, 0);
                const hasActiveMenu = activeActionMenu === product.id;

                return (
                    <div key={product.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-visible flex flex-col hover:shadow-xl transition-all group animate-in zoom-in-95">
                        <div className="relative h-48 md:h-56 overflow-hidden bg-gray-100 rounded-t-[2rem]">
                            <img src={product.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            
                            <div className="absolute bottom-4 left-4 flex gap-2">
                                <span className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-900 shadow-sm border border-white/20">{product.variety}</span>
                                {totalStock > 0 && <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg animate-in slide-in-from-bottom-2">Live Now</span>}
                            </div>
                        </div>

                        <div className="p-8 flex-1 flex flex-col justify-between">
                            <div className="mb-6">
                                <h3 className="text-2xl font-black text-gray-900 tracking-tighter leading-none uppercase mb-4">{product.name}</h3>
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Master Rate</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-black text-emerald-600 tracking-tighter">${product.defaultPricePerKg.toFixed(2)}</span>
                                            <span className="text-[10px] font-black text-gray-400 uppercase">/{product.unit || 'kg'}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">In Stock</p>
                                        <p className={`font-black text-lg ${totalStock > 0 ? 'text-indigo-600' : 'text-gray-400'}`}>
                                            {totalStock.toLocaleString()}{product.unit || 'kg'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex gap-2 relative">
                                <button 
                                    onClick={() => setSaleProduct(product)}
                                    className="flex-[4] py-4 bg-[#043003] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-3 active:scale-95"
                                >
                                    <HandCoins size={18}/> SELL
                                </button>
                                
                                <div className="relative flex-1">
                                    <button 
                                        onClick={(e) => toggleActionMenu(e, product.id)}
                                        className={`w-full h-full flex items-center justify-center rounded-2xl transition-all shadow-md active:scale-90 border ${hasActiveMenu ? 'bg-indigo-600 text-white' : 'bg-[#5c56d6] text-white'}`}
                                    >
                                        <Settings size={20} strokeWidth={2.5}/>
                                    </button>

                                    {hasActiveMenu && (
                                        <div ref={menuRef} className="absolute right-0 bottom-full mb-3 w-64 bg-white rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border border-gray-100 z-[100] animate-in zoom-in-95 slide-in-from-bottom-2 duration-150 py-3 overflow-hidden">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleProductAddStock(product.id); }}
                                                className="w-full text-left px-6 py-4 hover:bg-gray-50 flex items-center gap-5 group/item transition-colors"
                                            >
                                                <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-all shadow-inner-sm">
                                                    <Pencil size={18}/>
                                                </div>
                                                <span className="font-black text-gray-900 text-[11px] uppercase tracking-widest">LOG BATCH</span>
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleShareClick(product, stock); }}
                                                className="w-full text-left px-6 py-4 hover:bg-gray-50 flex items-center gap-5 group/item transition-colors border-y border-gray-50"
                                            >
                                                <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 group-hover/item:bg-blue-600 group-hover/item:text-white transition-all shadow-inner-sm">
                                                    <Smartphone size={18}/>
                                                </div>
                                                <span className="font-black text-gray-900 text-[11px] uppercase tracking-widest">CONNECT SMS</span>
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleOpenMarketplaceClearance(product); }}
                                                className="w-full text-left px-6 py-4 hover:bg-gray-50 flex items-center gap-5 group/item transition-colors"
                                            >
                                                <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 group-hover/item:bg-emerald-600 group-hover/item:text-white transition-all shadow-inner-sm">
                                                    <Store size={18}/>
                                                </div>
                                                <span className="font-black text-gray-900 text-[11px] uppercase tracking-widest">MARKETPLACE</span>
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
      </div>

      <ClearanceMarketplaceModal 
        isOpen={!!selectedProductForClearance}
        onClose={() => setSelectedProductForClearance(null)}
        product={selectedProductForClearance!}
        user={user}
        onComplete={loadData}
      />

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

      {saleProduct && (
        <SellProductDialog 
            isOpen={!!saleProduct} 
            onClose={() => setSaleProduct(null)} 
            product={saleProduct} 
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
