import React, { useState, useEffect } from 'react';
import { MenuItem, MenuItemOption, MenuItemAddon, CartItem } from '../types';
import { X, Plus, Minus, Check, Flame, Clock, Sparkles } from 'lucide-react';

interface CustomizationModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  item,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  if (!isOpen || !item) return null;

  const [selectedSize, setSelectedSize] = useState<MenuItemOption | undefined>(
    item.options?.sizes ? item.options.sizes[0] : undefined
  );
  const [selectedDoneness, setSelectedDoneness] = useState<string | undefined>(
    item.options?.doneness ? item.options.doneness[0] : undefined
  );
  const [selectedAddons, setSelectedAddons] = useState<MenuItemAddon[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Reset local state when item changes
  useEffect(() => {
    if (item) {
      setSelectedSize(item.options?.sizes ? item.options.sizes[0] : undefined);
      setSelectedDoneness(item.options?.doneness ? item.options.doneness[0] : undefined);
      setSelectedAddons([]);
      setSpecialInstructions('');
      setQuantity(1);
    }
  }, [item]);

  // Calculate unit price based on options & addons
  const basePrice = item.price;
  const sizeDelta = selectedSize ? selectedSize.priceDelta : 0;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = basePrice + sizeDelta + addonsTotal;
  const lineTotal = unitPrice * quantity;

  const toggleAddon = (addon: MenuItemAddon) => {
    setSelectedAddons((prev) => {
      const exists = prev.some((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const handleConfirm = () => {
    const cartItem: CartItem = {
      cartItemId: `${item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      item,
      selectedSize,
      selectedDoneness,
      selectedAddons,
      specialInstructions: specialInstructions.trim(),
      quantity,
      unitPrice,
      lineTotal,
    };
    onAddToCart(cartItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-[#141822] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header / Image Section */}
        <div className="relative h-48 sm:h-56 w-full shrink-0 overflow-hidden bg-stone-900">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141822] via-[#141822]/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/90 text-stone-300 hover:text-white transition-colors cursor-pointer border border-white/10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title on image */}
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
              <span>{item.calories} kcal</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {item.prepTimeMinutes} min preparation
              </span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-white leading-tight">
              {item.name}
            </h2>
          </div>
        </div>

        {/* Scrollable Content Options */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Item Description */}
          <p className="text-sm text-stone-300 leading-relaxed">
            {item.description}
          </p>

          {/* Size / Portion Options */}
          {item.options?.sizes && item.options.sizes.length > 0 && (
            <div className="space-y-3">
              <label className="text-xs uppercase font-mono tracking-wider text-amber-500 font-semibold block">
                Choose Portion / Size <span className="text-stone-400">(Required)</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {item.options.sizes.map((size) => {
                  const isSelected = selectedSize?.name === size.name;
                  return (
                    <button
                      key={size.name}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 text-white'
                          : 'bg-[#181d29] border-white/5 text-stone-300 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-amber-400 bg-amber-400' : 'border-stone-500'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                        </div>
                        <span className="text-xs sm:text-sm font-medium">{size.name}</span>
                      </div>
                      <span className="text-xs font-mono text-stone-400">
                        {size.priceDelta > 0 ? `+$${size.priceDelta.toFixed(2)}` : 'Included'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cooking Doneness (Steaks & Burgers) */}
          {item.options?.doneness && item.options.doneness.length > 0 && (
            <div className="space-y-3">
              <label className="text-xs uppercase font-mono tracking-wider text-amber-500 font-semibold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                Cooking Temperature Preference
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {item.options.doneness.map((done) => {
                  const isSelected = selectedDoneness === done;
                  return (
                    <button
                      key={done}
                      type="button"
                      onClick={() => setSelectedDoneness(done)}
                      className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all text-center cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-stone-950 font-bold border-amber-500'
                          : 'bg-[#181d29] border-white/5 text-stone-300 hover:border-white/20'
                      }`}
                    >
                      {done}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add-ons & Extra Toppings */}
          {item.addons && item.addons.length > 0 && (
            <div className="space-y-3">
              <label className="text-xs uppercase font-mono tracking-wider text-amber-500 font-semibold block">
                Artisan Add-ons & Extra Toppings <span className="text-stone-400">(Optional)</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {item.addons.map((addon) => {
                  const isChecked = selectedAddons.some((a) => a.id === addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddon(addon)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-amber-500/10 border-amber-500 text-white'
                          : 'bg-[#181d29] border-white/5 text-stone-300 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            isChecked ? 'border-amber-400 bg-amber-400 text-black' : 'border-stone-500'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 text-black" />}
                        </div>
                        <span className="text-xs sm:text-sm font-medium">{addon.name}</span>
                      </div>
                      <span className="text-xs font-mono text-amber-400 tabular-nums">
                        +${addon.price.toFixed(2)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Kitchen Requests */}
          <div className="space-y-2">
            <label className="text-xs uppercase font-mono tracking-wider text-stone-400 font-semibold block">
              Special Instructions for Kitchen
            </label>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Dressing on the side, extra crispy crust, no onions..."
              className="w-full bg-[#161b26] text-white placeholder-stone-500 text-xs p-3 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>
        </div>

        {/* Footer Actions: Quantity Stepper & Add to Cart */}
        <div className="p-4 sm:p-6 bg-[#10131b] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Quantity Stepper */}
          <div className="flex items-center gap-3 bg-[#181d29] px-3 py-1.5 rounded-xl border border-white/10 w-full sm:w-auto justify-between sm:justify-start">
            <span className="text-xs text-stone-400 font-mono">Qty</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center text-white transition-colors cursor-pointer"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-sm font-bold text-white font-mono tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Add to Order Button */}
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-98 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Add to Order</span>
            <span className="ml-1 font-mono tabular-nums">· ${lineTotal.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
