import React, { useState } from 'react';
import { CartItem, OrderType, PaymentMethod, Order } from '../types';
import { X, CreditCard, Banknote, Smartphone, ShieldCheck, MapPin, Phone, User, Clock, ArrowRight } from 'lucide-react';
import { VALID_PROMO_CODES } from '../data/menuData';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  orderType: OrderType;
  appliedPromo: string;
  onOrderPlaced: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  orderType,
  appliedPromo,
  onOrderPlaced,
}) => {
  if (!isOpen) return null;

  // Form states
  const [fullName, setFullName] = useState('Bilal Irshad');
  const [phone, setPhone] = useState('+1 (555) 389-4102');
  const [email, setEmail] = useState('bilalirshad366@gmail.com');
  const [address, setAddress] = useState('1400 Grand Ave, Apt 7B');
  const [aptSuite, setAptSuite] = useState('Floor 7');
  const [deliveryNotes, setDeliveryNotes] = useState('Please leave on the door hook and buzz.');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [tipAmount, setTipAmount] = useState<number>(3.00);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Card details state
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 9821');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('712');

  // Financial calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
  let discount = 0;
  let freeDelivery = false;
  if (appliedPromo && VALID_PROMO_CODES[appliedPromo]) {
    const promo = VALID_PROMO_CODES[appliedPromo];
    if (promo.discountPercent) discount = (subtotal * promo.discountPercent) / 100;
    if (promo.discountFixed) discount = Math.min(subtotal, promo.discountFixed);
    if (promo.freeDelivery) freeDelivery = true;
  }
  const deliveryFee = orderType === 'delivery' ? (freeDelivery || subtotal >= 45 ? 0 : 3.50) : 0;
  const tax = (subtotal - discount) * 0.085;
  const total = Math.max(0, subtotal - discount + deliveryFee + tax + tipAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!fullName.trim()) errors.fullName = 'Name is required';
    if (!phone.trim()) errors.phone = 'Phone number is required';
    if (orderType === 'delivery' && !address.trim()) errors.address = 'Delivery address is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    // Simulate swift server order verification
    setTimeout(() => {
      const orderNumber = `BR-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber,
        createdAt: 'Just now',
        orderType,
        status: 'received',
        customer: {
          fullName,
          phone,
          email,
          address: orderType === 'delivery' ? address : 'Rustica Hearth Pick-up Counter',
          aptSuite,
          deliveryNotes,
        },
        items: [...cartItems],
        subtotal,
        discount,
        promoCodeApplied: appliedPromo || undefined,
        tip: tipAmount,
        deliveryFee,
        tax,
        total,
        paymentMethod,
        driver: orderType === 'delivery' ? {
          name: 'Marco Santos',
          phone: '+1 (555) 789-0144',
          vehicle: 'Matte Grey Hybrid Courier (Plate: R78-B9)',
          rating: 4.96,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
          etaMinutes: 28,
        } : undefined,
        estimatedDeliveryTime: orderType === 'delivery' ? '25-30 minutes' : '12-15 minutes',
      };

      setIsSubmitting(false);
      onOrderPlaced(newOrder);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#13161f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-[#11141c] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-white">Complete Your Order</h2>
              <p className="text-xs text-stone-400">
                {orderType === 'delivery' ? 'Doorstep Delivery' : 'Pickup at Kitchen'} · {cartItems.length} items
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Contact Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-amber-500 font-semibold flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              1. Customer Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-stone-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#181d29] text-white text-xs p-3 rounded-xl border border-white/10 focus:border-amber-500 focus:outline-none"
                  placeholder="e.g. John Doe"
                />
                {formErrors.fullName && <p className="text-[11px] text-red-400 mt-0.5">{formErrors.fullName}</p>}
              </div>

              <div>
                <label className="text-[11px] text-stone-400 block mb-1">Phone Number (For Driver Updates)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#181d29] text-white text-xs p-3 rounded-xl border border-white/10 focus:border-amber-500 focus:outline-none"
                  placeholder="e.g. +1 (555) 000-0000"
                />
                {formErrors.phone && <p className="text-[11px] text-red-400 mt-0.5">{formErrors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="text-[11px] text-stone-400 block mb-1">Email (For Digital Receipt)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#181d29] text-white text-xs p-3 rounded-xl border border-white/10 focus:border-amber-500 focus:outline-none"
                placeholder="e.g. user@example.com"
              />
            </div>
          </div>

          {/* Delivery Address (if Delivery) */}
          {orderType === 'delivery' ? (
            <div className="space-y-3 pt-3 border-t border-white/5">
              <h3 className="text-xs font-mono uppercase tracking-wider text-amber-500 font-semibold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                2. Delivery Destination
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[11px] text-stone-400 block mb-1">Street Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-[#181d29] text-white text-xs p-3 rounded-xl border border-white/10 focus:border-amber-500 focus:outline-none"
                    placeholder="e.g. 742 Evergreen Terrace"
                  />
                  {formErrors.address && <p className="text-[11px] text-red-400 mt-0.5">{formErrors.address}</p>}
                </div>
                <div>
                  <label className="text-[11px] text-stone-400 block mb-1">Apt / Suite / Unit</label>
                  <input
                    type="text"
                    value={aptSuite}
                    onChange={(e) => setAptSuite(e.target.value)}
                    className="w-full bg-[#181d29] text-white text-xs p-3 rounded-xl border border-white/10 focus:border-amber-500 focus:outline-none"
                    placeholder="Apt 4B"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-stone-400 block mb-1">Delivery Instructions for Courier</label>
                <input
                  type="text"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className="w-full bg-[#181d29] text-white text-xs p-3 rounded-xl border border-white/10 focus:border-amber-500 focus:outline-none"
                  placeholder="e.g. Gate code #1234, buzz 401, leave on porch table"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2 pt-3 border-t border-white/5 bg-amber-500/10 p-3.5 rounded-xl border border-amber-500/20 text-xs">
              <span className="font-semibold text-amber-300 block">Pickup Location</span>
              <p className="text-stone-300">
                Rustica Artisanal Kitchen — 428 Foundry Street, Culinary District.
              </p>
              <p className="text-[11px] text-stone-400">
                Estimated pickup readiness: <strong className="text-white">15 minutes</strong> from order placement.
              </p>
            </div>
          )}

          {/* Courier Tip (for delivery) */}
          {orderType === 'delivery' && (
            <div className="space-y-2 pt-3 border-t border-white/5">
              <label className="text-xs font-mono uppercase tracking-wider text-amber-500 font-semibold block">
                Add Tip for Courier
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[2.00, 3.00, 5.00, 0].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setTipAmount(amount)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold font-mono transition-all cursor-pointer ${
                      tipAmount === amount
                        ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-md'
                        : 'bg-[#181d29] border-white/5 text-stone-300 hover:border-white/20'
                    }`}
                  >
                    {amount === 0 ? 'No Tip' : `$${amount.toFixed(2)}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Payment Method */}
          <div className="space-y-3 pt-3 border-t border-white/5">
            <h3 className="text-xs font-mono uppercase tracking-wider text-amber-500 font-semibold flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" />
              3. Payment Method
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('credit_card')}
                className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  paymentMethod === 'credit_card'
                    ? 'bg-amber-500/10 border-amber-500 text-white'
                    : 'bg-[#181d29] border-white/5 text-stone-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="text-xs font-medium">Credit Card</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('apple_pay')}
                className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  paymentMethod === 'apple_pay'
                    ? 'bg-amber-500/10 border-amber-500 text-white'
                    : 'bg-[#181d29] border-white/5 text-stone-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="text-xs font-medium">Digital Pay</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cash_on_delivery')}
                className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  paymentMethod === 'cash_on_delivery'
                    ? 'bg-amber-500/10 border-amber-500 text-white'
                    : 'bg-[#181d29] border-white/5 text-stone-400 hover:text-white'
                }`}
              >
                <Banknote className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="text-xs font-medium">Cash on Delivery</div>
              </button>
            </div>

            {/* Credit Card inputs */}
            {paymentMethod === 'credit_card' && (
              <div className="p-3.5 rounded-xl bg-[#161b26] border border-white/5 space-y-2.5">
                <div>
                  <label className="text-[10px] text-stone-400 uppercase font-mono block mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-[#12151e] text-white text-xs p-2.5 rounded-lg border border-white/10 font-mono"
                    placeholder="4242 4242 4242 4242"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-stone-400 uppercase font-mono block mb-1">Expiry</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-[#12151e] text-white text-xs p-2.5 rounded-lg border border-white/10 font-mono"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-400 uppercase font-mono block mb-1">CVC</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full bg-[#12151e] text-white text-xs p-2.5 rounded-lg border border-white/10 font-mono"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* COD terms notice */}
            {paymentMethod === 'cash_on_delivery' && (
              <div className="p-3 rounded-xl bg-stone-900 border border-white/5 text-xs text-stone-300 space-y-1">
                <p className="font-semibold text-white">Cash on Delivery Policy</p>
                <p className="text-stone-400 text-[11px]">
                  Please have the exact sum of <strong className="text-amber-400 font-mono">${total.toFixed(2)}</strong> ready for our courier upon doorstep arrival. Drivers carry minimal change for safety.
                </p>
              </div>
            )}
          </div>

          {/* Order Summary Confirmation */}
          <div className="p-4 bg-[#10131b] rounded-xl border border-white/5 space-y-2 text-xs">
            <div className="flex justify-between text-stone-400">
              <span>Items Total ({cartItems.length} items)</span>
              <span className="text-white font-mono tabular-nums">${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Promotional Discount</span>
                <span className="font-mono tabular-nums">-${discount.toFixed(2)}</span>
              </div>
            )}
            {orderType === 'delivery' && (
              <div className="flex justify-between text-stone-400">
                <span>Doorstep Delivery Fee</span>
                <span className="text-white font-mono tabular-nums">
                  {deliveryFee === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : `$${deliveryFee.toFixed(2)}`}
                </span>
              </div>
            )}
            {tipAmount > 0 && (
              <div className="flex justify-between text-stone-400">
                <span>Courier Tip</span>
                <span className="text-white font-mono tabular-nums">${tipAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-400">
              <span>State & Local Tax</span>
              <span className="text-white font-mono tabular-nums">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
              <span>Grand Total</span>
              <span className="text-amber-400 font-mono tabular-nums text-lg">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Place Order CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Securing Your Order...</span>
            ) : (
              <>
                <span>Place Order & Track Live</span>
                <span className="font-mono tabular-nums">· ${total.toFixed(2)}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
