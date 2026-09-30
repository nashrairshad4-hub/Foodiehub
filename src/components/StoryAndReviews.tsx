import React from 'react';
import { CustomerReview } from '../types';
import { Star, Flame, Wheat, Award, ShieldCheck, HeartHandshake } from 'lucide-react';

interface StoryAndReviewsProps {
  reviews: CustomerReview[];
  onOpenReservations: () => void;
}

export const StoryAndReviews: React.FC<StoryAndReviewsProps> = ({ reviews, onOpenReservations }) => {
  return (
    <section id="story" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
      {/* 2-Column Culinary Craftsmanship Story */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
        
        {/* Left Column: Editorial Story */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-500">
            <span>Philosophy & Hearth</span>
            <span aria-hidden="true">/</span>
            <span>Crafted With Respect</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight leading-snug">
            Where prime dry-aged cuts meet 900°F oak embers.
          </h2>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            At Rustica Grill & Kitchen, every burger patty is freshly ground in-house from whole primal cuts of Australian Wagyu and Black Angus chuck. We sear on screaming-hot planchas to forge a deeply caramelized, lacy crust while sealing in natural juices.
          </p>

          <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
            Our pizza dough undergoes a rigorous 72-hour cold fermentation process, creating an ultra-light, airy crumb that blisters rapidly under white-oak flame. No shortcuts, no artificial enhancers—just honest fire, sea salt, and patience.
          </p>

          {/* 3 Key Pillars */}
          <div className="grid grid-cols-3 gap-4 pt-3 border-t border-white/10 text-left">
            <div>
              <div className="flex items-center gap-1.5 text-amber-400 mb-1">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-base font-bold font-mono">900°F</span>
              </div>
              <span className="text-xs text-stone-400 leading-tight block">Wood-Fired Hearth</span>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-amber-400 mb-1">
                <Wheat className="w-4 h-4 text-amber-400" />
                <span className="text-base font-bold font-mono">72 Hrs</span>
              </div>
              <span className="text-xs text-stone-400 leading-tight block">Sourdough Cold Ferment</span>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-amber-400 mb-1">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-base font-bold font-mono">28 Days</span>
              </div>
              <span className="text-xs text-stone-400 leading-tight block">Dry-Aged Prime Cuts</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onOpenReservations}
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 py-3 rounded-xl text-xs sm:text-sm transition-all cursor-pointer shadow-md shadow-amber-500/10 inline-flex items-center gap-2"
            >
              <span>Book Table for Dine-In Experience</span>
            </button>
          </div>
        </div>

        {/* Right Column: Visual Hearth Collage */}
        <div className="lg:col-span-6 relative">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-white/10 group">
              <img
                src="/src/assets/images/woodfired_artisan_pizza_1790684507455.jpg"
                alt="Wood-fired sourdough pizza with blistered crust"
                className="w-full h-56 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs text-stone-200 font-medium">Neapolitan Wood-Fired Hearth</span>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-white/10 group mt-6">
              <img
                src="/src/assets/images/crispy_parmesan_fries_1790684521117.jpg"
                alt="Truffle rosemary parmesan cut fries"
                className="w-full h-56 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs text-stone-200 font-medium">Hand-Cut Truffle Herb Fries</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Customer Proof & Adjoining Reviews Section */}
      <div className="mt-12 pt-12 border-t border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-500 mb-1">
              <span>Verified Patron Critiques</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Words From Our Diners
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-400 font-mono">
            <span className="text-amber-400 font-bold text-sm">4.95 / 5.0</span>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span>Based on 1,420+ authenticated orders</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#141822] p-6 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4 shadow-lg shadow-black/30"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] text-stone-500 font-mono">{rev.date}</span>
                </div>

                <p className="text-stone-300 text-xs sm:text-sm leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-semibold text-white">{rev.author}</h4>
                  <span className="text-[11px] text-amber-400/90 font-mono">Ordered {rev.dishName}</span>
                </div>
                {rev.verifiedBuyer && (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
