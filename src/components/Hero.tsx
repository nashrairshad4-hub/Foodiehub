import React from 'react';
import { Search, Flame, Clock, Award, ShieldCheck } from 'lucide-react';
import { OrderType } from '../types';

interface HeroProps {
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectCategory: (categoryId: any) => void;
  onOpenReservations: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  orderType,
  setOrderType,
  searchQuery,
  setSearchQuery,
  onSelectCategory,
  onOpenReservations,
}) => {
  return (
    <div className="relative overflow-hidden bg-[#0c0e12] border-b border-white/5">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -z-10 w-80 h-80 bg-orange-700/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline, Fulfillment Mode, Search, Trust */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            
            {/* Clean unboxed status metadata */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-400 font-medium tracking-wide">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Hearth Firing Now
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-stone-300">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                25–35 Min Delivery
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-stone-300">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                4.95 Rating (1,400+ Orders)
              </span>
            </div>

            {/* Editorial Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.1]">
                Wood-fired passion,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500">
                  handcrafted flavors.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-stone-300 max-w-xl leading-relaxed">
                Dry-aged prime wagyu burgers, 72-hour sourdough pizzas, and oak-grilled cuts prepared fresh to order. Delivered sizzling hot to your door or ready for express pickup.
              </p>
            </div>

            {/* Order Fulfillment Selector */}
            <div className="bg-[#141821] p-1.5 rounded-xl border border-white/10 max-w-md flex items-center justify-between">
              <button
                onClick={() => setOrderType('delivery')}
                className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer ${
                  orderType === 'delivery'
                    ? 'bg-amber-500 text-stone-950 font-semibold shadow-md'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Doorstep Delivery
              </button>
              <button
                onClick={() => setOrderType('pickup')}
                className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer ${
                  orderType === 'pickup'
                    ? 'bg-amber-500 text-stone-950 font-semibold shadow-md'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Store Pickup
              </button>
              <button
                onClick={onOpenReservations}
                className="flex-1 py-2 text-xs sm:text-sm font-medium text-stone-400 hover:text-white rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <span>Dine-In Table</span>
              </button>
            </div>

            {/* Live Search Bar */}
            <div className="relative max-w-xl">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-stone-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search artisanal burgers, wood-fired pizzas, truffle fries..."
                  className="w-full bg-[#161a24] text-white placeholder-stone-400 text-sm pl-11 pr-24 py-3.5 rounded-xl border border-white/15 focus:outline-none focus:border-amber-500 transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 px-2 py-1 text-xs text-stone-400 hover:text-white bg-white/5 rounded cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Quick trending suggestions */}
              <div className="mt-2.5 flex items-center gap-2 overflow-x-auto text-xs text-stone-400 py-1 no-scrollbar">
                <span className="shrink-0 text-stone-500 font-mono">Popular:</span>
                <button
                  onClick={() => setSearchQuery('Wagyu')}
                  className="shrink-0 hover:text-amber-400 transition-colors cursor-pointer bg-white/5 px-2 py-0.5 rounded border border-white/5"
                >
                  Wagyu Prime
                </button>
                <button
                  onClick={() => {
                    onSelectCategory('pizzas');
                    setSearchQuery('Margherita');
                  }}
                  className="shrink-0 hover:text-amber-400 transition-colors cursor-pointer bg-white/5 px-2 py-0.5 rounded border border-white/5"
                >
                  Margherita D.O.P.
                </button>
                <button
                  onClick={() => setSearchQuery('Truffle')}
                  className="shrink-0 hover:text-amber-400 transition-colors cursor-pointer bg-white/5 px-2 py-0.5 rounded border border-white/5"
                >
                  Truffle Fries
                </button>
                <button
                  onClick={() => setSearchQuery('Ribeye')}
                  className="shrink-0 hover:text-amber-400 transition-colors cursor-pointer bg-white/5 px-2 py-0.5 rounded border border-white/5"
                >
                  Prime Ribeye
                </button>
              </div>
            </div>

            {/* Trust Markers */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-stone-400">
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-400" />
                <span>900°F Oak Wood Oven</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>100% Certified Prime Cuts</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold font-mono">20% OFF</span>
                <span>Code <code className="text-amber-300 font-mono font-semibold">WELCOME20</code></span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/80 group">
              <img
                src="/src/assets/images/hero_gourmet_burger_spread_1790684464363.jpg"
                alt="Gourmet double smash cheeseburger with truffle fries on rustic slate"
                className="w-full h-80 sm:h-96 lg:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {/* Subtle gradient scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

              {/* Floating Chef's Special Tag */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-amber-400 font-mono">
                    Chef's Feature
                  </p>
                  <h3 className="text-white font-semibold text-sm sm:text-base">
                    Smoked Double Smash & Truffle Cut Fries
                  </h3>
                  <p className="text-stone-300 text-xs mt-0.5">
                    Crispy lacy edges, melted cheddar, brioche roll
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-base sm:text-lg font-bold text-amber-400 font-mono tabular-nums">
                    $15.75
                  </span>
                  <p className="text-[11px] text-stone-400">Order Ready</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
