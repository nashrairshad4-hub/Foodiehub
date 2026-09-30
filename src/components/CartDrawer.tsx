import React, { useState } from 'react';
import { CartItem, OrderType } from '../types';
import { X, Trash2, Plus, Minus, ArrowRight, Tag, ShoppingBag, ShieldCheck } from 'lucide-react';
import { VALID_PROMO_CODES } from '../data/menuData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  orderType: OrderType;
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: () => void;
  appliedPromo: string;
  setAppliedPromo: (code: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  orderType,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  appliedPromo,
  setAppliedPromo,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  if (!isOpen) return null;

  // Financial calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);

  // Promo calculations
  let discount = 0;
  let freeDelivery = false;
  if (appliedPromo && VALID_PROMO_CODES[appliedPromo]) {
    const promo = VALID_PROMO_CODES[appliedPromo];
    if (promo.discountPercent) {
      discount = (subtotal * promo.discountPercent) / 100;
    } else if (promo.discountFixed) {
      discount = Math.min(subtotal, promo.discountFixed);
    }
    if (promo.freeDelivery) {
      freeDelivery = true;
    }
  }

  const deliveryFee = orderType === 'delivery' ? (freeDelivery || subtotal >= 45 ? 0 : 3.50) : 0;
  const estimatedTax = (subtotal - discount) * 0.085;
  const total = Math.max(0, subtotal - discount + deliveryFee + estimatedTax);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    if (VALID_PROMO_CODES[code]) {
      setAppliedPromo(code);
      setPromoSuccess(`Promo applied: ${VALID_PROMO_CODES[code].desc}`);
      setPromoInput('');
    } else {
      setPromoError('Invalid coupon code. Try WELCOME20 or BURGERFEST.');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo('');
    setPromoSuccess('');
    setPromoError('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#13161f] border-l border-white/10 shadow-2xl flex flex-col z-10">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#11141c]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-serif font-bold text-white">Your Order</h2>
              <span className="text-xs bg-white/10 text-stone-300 px-2 py-0.5 rounded-full font-mono">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Fulfillment indicator */}
          <div className="px-6 py-2.5 bg-[#171b26] border-b border-white/5 flex items-center justify-between text-xs">
            <span className="text-stone-400">Order Method:</span>
            <span className="text-amber-400 font-semibold uppercase tracking-wider font-mono">
              {orderType === 'delivery' ? 'Doorstep Delivery (25-35 min)' : 'Express Pickup (15 min)'}
            </span>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-stone-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-white">Your basket is hungry</h3>
                <p className="text-xs text-stone-400 max-w-xs">
                  Explore our artisan burgers, 72-hour sourdough pizzas, and truffle fries to get started.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 text-xs font-semibold text-stone-950 bg-amber-400 px-4 py-2 rounded-xl hover:bg-amber-300 transition-colors cursor-pointer"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              cartItems.map((cartItem) => (
                <div
                  key={cartItem.cartItemId}
                  className="bg-[#181d29] p-4 rounded-xl border border-white/5 flex flex-col gap-3 group"
                >
                  <div className="flex gap-3">
                    <img
                      src={cartItem.item.image}
                      alt={cartItem.item.name}
                      className="w-16 h-16 rounded-lg object-cover bg-stone-900 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-white leading-tight truncate">
                          {cartItem.item.name}
                        </h4>
                        <span className="text-sm font-bold text-white font-mono tabular-nums shrink-0">
                          ${cartItem.lineTotal.toFixed(2)}
                        </span>
                      </div>

                      {/* Modifiers breakdown */}
                      <div className="text-xs text-stone-400 space-y-0.5 mt-1">
                        {cartItem.selectedSize && (
                          <p className="truncate text-stone-300 font-mono text-[11px]">
                            Portion: {cartItem.selectedSize.name}
                          </p>
                        )}
                        {cartItem.selectedDoneness && (
                          <p className="truncate text-stone-300 text-[11px]">
                            Temp: {cartItem.selectedDoneness}
                          </p>
                        )}
                        {cartItem.selectedAddons.length > 0 && (
                          <p className="truncate text-amber-400/90 text-[11px]">
                            Add: {cartItem.selectedAddons.map((a) => a.name).join(', ')}
                          </p>
                        )}
                        {cartItem.specialInstructions && (
                          <p className="italic text-stone-400 text-[11px]">
                            Note: "{cartItem.specialInstructions}"
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Stepper & Remove */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <button
                      onClick={() => onRemoveItem(cartItem.cartItemId)}
                      className="text-stone-500 hover:text-red-400 transition-colors p-1 cursor-pointer flex items-center gap-1 text-xs"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>

                    <div className="flex items-center gap-2 bg-[#12151d] px-2 py-1 rounded-lg border border-white/5">
                      <button
                        onClick={() => onUpdateQuantity(cartItem.cartItemId, -1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-stone-400 hover:text-white cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-mono font-bold text-white tabular-nums">
                        {cartItem.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(cartItem.cartItemId, 1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-stone-400 hover:text-white cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer: Promo, Summary, Checkout */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-[#10131b] border-t border-white/10 space-y-4">
              
              {/* Promo Code Form */}
              <div>
                {appliedPromo ? (
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-amber-400" />
                      <span className="font-mono font-bold text-amber-300">{appliedPromo}</span>
                      <span className="text-stone-300">({VALID_PROMO_CODES[appliedPromo]?.desc})</span>
                    </div>
                    <button
                      onClick={handleRemovePromo}
                      className="text-stone-400 hover:text-white underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Promo code (e.g. WELCOME20)"
                      className="flex-1 bg-[#171b26] text-white placeholder-stone-500 text-xs px-3 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-amber-500 uppercase font-mono"
                    />
                    <button
                      type="submit"
                      className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoError && <p className="text-[11px] text-red-400 mt-1">{promoError}</p>}
                {promoSuccess && <p className="text-[11px] text-emerald-400 mt-1">{promoSuccess}</p>}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-400 pt-1 border-t border-white/5">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-mono tabular-nums">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span className="font-mono tabular-nums">-${discount.toFixed(2)}</span>
                  </div>
                )}
                {orderType === 'delivery' && (
                  <div className="flex justify-between">
                    <span>Delivery Fee {subtotal >= 45 && <span className="text-emerald-400 text-[10px]">(Over $45 Free)</span>}</span>
                    <span className="text-white font-mono tabular-nums">
                      {deliveryFee === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : `$${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Tax (8.5%)</span>
                  <span className="text-white font-mono tabular-nums">${estimatedTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                  <span>Total Amount</span>
                  <span className="text-amber-400 font-mono text-base tabular-nums">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                onClick={onProceedToCheckout}
                className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition-all cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Contact-free doorstep delivery available</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
