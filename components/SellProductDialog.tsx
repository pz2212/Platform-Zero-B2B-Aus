
import React, { useState, useEffect } from 'react';
import { Product, Customer, LogisticsDetails, Driver, User } from '../types';
import { mockService } from '../services/mockDataService';
import { triggerNativeSms, generateProductDeepLink } from '../services/smsService';
import { X, Truck, Hand, Calendar, Clock, MapPin, User as UserIcon, Plus, Smartphone, CheckCircle, DollarSign, CreditCard, FileText, Send, UserPlus, Search, Info, Loader2 } from 'lucide-react';

interface SellProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onComplete: (data: any) => void;
  user: User;
}

export const SellProductDialog: React.FC<SellProductDialogProps> = ({ isOpen, onClose, product, onComplete, user }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [pricePerKg, setPricePerKg] = useState<number>(product.defaultPricePerKg);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
      businessName: '',
      contactName: '',
      mobile: '',
      email: ''
  });
  const [logisticsMethod, setLogisticsMethod] = useState<'PICKUP' | 'LOGISTICS'>('PICKUP');
  const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().split('T')[0]);
  const [deliveryTime, setDeliveryTime] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('invoice');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setCustomers(mockService.getCustomers());
  }, []);

  if (!isOpen) return null;

  const totalAmount = (quantity * pricePerKg).toFixed(2);

  const handleSubmit = async (action: 'QUOTE' | 'SALE') => {
    const targetMobile = isNewCustomer ? newCustomer.mobile : customers.find(c => c.id === selectedCustomerId)?.phone;

    if (!isNewCustomer && !selectedCustomerId) {
        alert("Please select a customer.");
        return;
    }

    if (paymentMethod === 'pay_now' && !user.isStripeConnected) {
        alert("You must connect your account to Stripe in Settings to enable immediate Credit Card payments.");
        return;
    }

    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 1000));

    const saleData = {
        product,
        quantity,
        pricePerKg,
        customer: isNewCustomer ? { ...newCustomer, isNew: true } : { id: selectedCustomerId, isNew: false },
        logistics: {
            method: logisticsMethod,
            deliveryDate,
            deliveryTime,
            deliveryLocation: logisticsMethod === 'LOGISTICS' ? deliveryAddress : 'Warehouse Pickup'
        },
        paymentMethod,
        action
    };

    if (action === 'QUOTE' && targetMobile) {
        const link = generateProductDeepLink('quote', Math.random().toString(36).substr(2, 9));
        const msg = `PZ QUOTE: ${product.name} (${quantity}kg) available for $${pricePerKg}/kg. Total: $${totalAmount}. Click to accept: ${link}`;
        triggerNativeSms(targetMobile, msg);
    } else if (action === 'SALE') {
        const items = [{ productId: product.id, quantityKg: quantity, pricePerKg: pricePerKg }];
        mockService.createFullOrder(saleData.customer.id, items, parseFloat(totalAmount), user.id);
    }

    setIsProcessing(false);
    onComplete(saleData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[1.5rem] shadow-2xl w-full max-w-[560px] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header matching screenshot */}
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight leading-none uppercase">
                Make a Sale <span className="text-gray-400 font-bold ml-1">| {product.name}</span>
            </h2>
            <p className="text-[11px] text-gray-400 font-bold uppercase mt-1.5">Configure order details and send to customer.</p>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-900 transition-colors p-1">
            <X size={24} strokeWidth={2.5}/>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-10 custom-scrollbar">
            
            {/* Customer Search Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-end mb-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Customer</label>
                    <button 
                        onClick={() => setIsNewCustomer(!isNewCustomer)}
                        className="text-emerald-600 text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-1.5"
                    >
                        {isNewCustomer ? 'Existing List' : '+ New Customer'}
                    </button>
                </div>

                <div className="relative group">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors"/>
                    <input 
                        placeholder="Search existing customers..."
                        className="w-full pl-11 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl font-bold text-sm text-gray-900 outline-none focus:border-emerald-500 transition-all"
                        value={selectedCustomerId}
                        onChange={e => setSelectedCustomerId(e.target.value)}
                    />
                </div>
            </div>

            {/* Quantity and Price row */}
            <div className="flex gap-6 items-end">
                <div className="flex-1">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Quantity (kg)</label>
                    <input 
                        type="number"
                        className="w-full p-4 bg-white border-2 border-gray-100 rounded-2xl font-black text-2xl text-gray-900 outline-none focus:border-emerald-500 transition-all shadow-inner-sm"
                        value={quantity}
                        onChange={e => setQuantity(parseFloat(e.target.value))}
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Price ($/kg)</label>
                    <input 
                        type="number"
                        step="0.01"
                        className="w-full p-4 bg-white border-2 border-gray-100 rounded-2xl font-black text-2xl text-gray-900 outline-none focus:border-emerald-500 transition-all shadow-inner-sm"
                        value={pricePerKg}
                        onChange={e => setPricePerKg(parseFloat(e.target.value))}
                    />
                </div>
                {/* Total Box from screenshot */}
                <div className="w-[140px] bg-gray-50/50 rounded-2xl p-4 border border-gray-100 flex flex-col items-end justify-center h-[72px]">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total</span>
                    <span className="text-2xl font-black text-emerald-600 tracking-tighter leading-none">${totalAmount}</span>
                </div>
            </div>

            {/* Fulfillment and Payment row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Fulfillment</label>
                    <div className="flex bg-gray-100/50 p-1 rounded-2xl border border-gray-200 shadow-inner-sm">
                        <button 
                            onClick={() => setLogisticsMethod('PICKUP')}
                            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 ${logisticsMethod === 'PICKUP' ? 'bg-white text-gray-900 shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <Hand size={14}/> Pickup
                        </button>
                        <button 
                            onClick={() => setLogisticsMethod('LOGISTICS')}
                            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 ${logisticsMethod === 'LOGISTICS' ? 'bg-white text-gray-900 shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <Truck size={14}/> Delivery
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Payment</label>
                    <div className="space-y-2">
                        <button 
                            onClick={() => setPaymentMethod('invoice')}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all text-left ${paymentMethod === 'invoice' ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
                        >
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === 'invoice' ? 'bg-indigo-600 border-indigo-600' : 'border-gray-200'}`}>
                                {paymentMethod === 'invoice' && <div className="w-1.5 h-1.5 rounded-full bg-white"/>}
                            </div>
                            <FileText size={16}/>
                            <span className="text-[11px] font-black uppercase tracking-widest">Send Invoice (Terms)</span>
                        </button>
                        
                        <div className="relative group/stripe">
                            <button 
                                onClick={() => setPaymentMethod('pay_now')}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all text-left ${paymentMethod === 'pay_now' ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
                            >
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === 'pay_now' ? 'bg-indigo-600 border-indigo-600' : 'border-gray-200'}`}>
                                    {paymentMethod === 'pay_now' && <div className="w-1.5 h-1.5 rounded-full bg-white"/>}
                                </div>
                                <CreditCard size={16}/>
                                <span className="text-[11px] font-black uppercase tracking-widest">Credit Card (Now)</span>
                            </button>
                            
                            {/* Stripe Connected Indicator */}
                            <div className="absolute -top-2 -right-2">
                                <div className={`px-2 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-widest border shadow-sm ${user.isStripeConnected ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-orange-50 text-orange-600 border-orange-200'}`}>
                                    {user.isStripeConnected ? 'STRIPE LIVE' : 'CONNECT STRIPE'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer buttons matching screenshot */}
        <div className="p-8 border-t border-gray-100 bg-white flex gap-4 shrink-0">
            <button 
                onClick={() => handleSubmit('SALE')}
                disabled={isProcessing}
                className="flex-1 py-4 bg-white border-2 border-gray-200 text-gray-900 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-95 disabled:opacity-50"
            >
                {isProcessing ? <Loader2 className="animate-spin" size={18}/> : <><CheckCircle size={18}/> Record Sale</>}
            </button>
            <button 
                onClick={() => handleSubmit('QUOTE')}
                disabled={isProcessing}
                className="flex-[1.5] py-4 bg-[#043003] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
                <Smartphone size={18}/> Send Quote via SMS
            </button>
        </div>
      </div>
    </div>
  );
};
