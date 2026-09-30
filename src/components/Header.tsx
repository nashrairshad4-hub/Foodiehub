import React from 'react';
import { ShoppingBag, Clock, Database, Calendar, UtensilsCrossed } from 'lucide-react';
import { OrderType } from '../types';

interface HeaderProps {
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenReservations: () => void;
  onOpenDjangoAdmin: () => void;
  onOpenLiveOrder: () => void;
  activeOrderCount: number;
  onNavigateToMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  orderType,
  setOrderType,
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenReservations,
  onOpenDjangoAdmin,
  onOpenLiveOrder,
  activeOrderCount,
  onNavigateToMenu,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#11141a]/95 backdrop-blur-md border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white hover:text-amber-400 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-md shadow-amber-900/30">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl tracking-tight text-white leading-none">
                Rustica
              </span>
              <span className="text-[10px] uppercase tracking-widest text-amber-500/90 font-mono mt-0.5">
                Grill & Kitchen
              </span>
            </div>
          </a>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-300">
          <button
            onClick={onNavigateToMenu}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            Menu Catalog
          </button>
          <a
            href="#story"
            className="hover:text-amber-400 transition-colors"
          >
            Our Hearth Story
          </a>
          <button
            onClick={onOpenReservations}
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-amber-500" />
            <span>Table Booking</span>
          </button>
          <button
            onClick={onOpenLiveOrder}
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors cursor-pointer relative"
          >
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Order Tracker</span>
            {activeOrderCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-[11px] font-bold text-black bg-emerald-400 rounded-full">
                {activeOrderCount}
              </span>
            )}
          </button>
          <button
            onClick={onOpenDjangoAdmin}
            className="flex items-center gap-1.5 text-stone-400 hover:text-white transition-colors cursor-pointer bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md border border-white/10"
            title="Django Admin & MySQL Database Console"
          >
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-mono">Django & MySQL</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* Fulfillment mode switch */}
          <div className="hidden sm:flex items-center bg-[#1a1f29] p-1 rounded-lg border border-white/10 text-xs font-medium">
            <button
              onClick={() => setOrderType('delivery')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                orderType === 'delivery'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Delivery
            </button>
            <button
              onClick={() => setOrderType('pickup')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                orderType === 'pickup'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Pickup
            </button>
          </div>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer whitespace-nowrap"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 text-stone-950" />
            <span className="text-sm font-medium">
              Cart
            </span>
            <span className="bg-stone-950 text-amber-400 text-xs px-2 py-0.5 rounded-full font-mono tabular-nums font-bold">
              {cartCount}
            </span>
            {cartTotal > 0 && (
              <span className="hidden md:inline text-xs font-mono tabular-nums font-semibold border-l border-stone-950/20 pl-2">
                ${cartTotal.toFixed(2)}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
