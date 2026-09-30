import React, { useState, useMemo } from 'react';
import { MenuItem, CategoryId, Category } from '../types';
import { Plus, Star, Sparkles, Flame, Check, SlidersHorizontal } from 'lucide-react';

interface MenuSectionProps {
  categories: Category[];
  activeCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
  menuItems: MenuItem[];
  onOpenCustomize: (item: MenuItem) => void;
  searchQuery: string;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  menuItems,
  onOpenCustomize,
  searchQuery,
}) => {
  const [filterVegOnly, setFilterVegOnly] = useState(false);
  const [filterSpicyOnly, setFilterSpicyOnly] = useState(false);
  const [filterGlutenFree, setFilterGlutenFree] = useState(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'price_asc' | 'price_desc' | 'rating'>('recommended');

  // Filter and sort items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category filter
      if (activeCategory !== 'all' && item.categoryId !== activeCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCat = item.categoryId.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCat) {
          return false;
        }
      }
      // Dietary filters
      if (filterVegOnly && !item.isVeg) return false;
      if (filterSpicyOnly && !item.isSpicy) return false;
      if (filterGlutenFree && !item.isGlutenFree) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
    });
  }, [menuItems, activeCategory, searchQuery, filterVegOnly, filterSpicyOnly, filterGlutenFree, sortBy]);

  return (
    <section id="menu-catalog" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-500 mb-1.5">
            <span>Artisanal Kitchen</span>
            <span aria-hidden="true">/</span>
            <span>Made To Order</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Curated Hearth Menu
          </h2>
          <p className="text-sm text-stone-400 mt-1 max-w-xl">
            Prime meats dry-aged in-house, 72-hour cold-fermented doughs, and market-fresh organic produce fire-roasted on demand.
          </p>
        </div>

        {/* Sort & Dietary Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1 bg-[#151922] p-1 rounded-lg border border-white/10 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400 ml-1.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-stone-300 text-xs py-1 px-2 focus:outline-none cursor-pointer"
            >
              <option value="recommended" className="bg-[#151922]">Chef's Picks</option>
              <option value="rating" className="bg-[#151922]">Highest Rated</option>
              <option value="price_asc" className="bg-[#151922]">Price: Low to High</option>
              <option value="price_desc" className="bg-[#151922]">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar border-b border-white/10">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-amber-500 text-stone-950 font-semibold shadow-md shadow-amber-500/10'
                  : 'bg-[#151821] text-stone-400 hover:text-white hover:bg-white/5 border border-white/5'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Dietary Checkbox Toggles */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-8 text-xs text-stone-300">
        <span className="text-stone-500 font-mono text-[11px]">Dietary filters:</span>
        <button
          onClick={() => setFilterVegOnly(!filterVegOnly)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
            filterVegOnly
              ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
              : 'bg-[#12151c] border-white/10 text-stone-400 hover:text-white'
          }`}
        >
          <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${filterVegOnly ? 'border-emerald-400 bg-emerald-500 text-black' : 'border-stone-500'}`}>
            {filterVegOnly && <Check className="w-2.5 h-2.5" />}
          </div>
          <span>Vegetarian</span>
        </button>

        <button
          onClick={() => setFilterSpicyOnly(!filterSpicyOnly)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
            filterSpicyOnly
              ? 'bg-red-950/60 border-red-500 text-red-300'
              : 'bg-[#12151c] border-white/10 text-stone-400 hover:text-white'
          }`}
        >
          <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${filterSpicyOnly ? 'border-red-400 bg-red-500 text-black' : 'border-stone-500'}`}>
            {filterSpicyOnly && <Check className="w-2.5 h-2.5" />}
          </div>
          <span>Spicy & Fiery</span>
        </button>

        <button
          onClick={() => setFilterGlutenFree(!filterGlutenFree)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
            filterGlutenFree
              ? 'bg-amber-950/60 border-amber-500 text-amber-300'
              : 'bg-[#12151c] border-white/10 text-stone-400 hover:text-white'
          }`}
        >
          <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${filterGlutenFree ? 'border-amber-400 bg-amber-500 text-black' : 'border-stone-500'}`}>
            {filterGlutenFree && <Check className="w-2.5 h-2.5" />}
          </div>
          <span>Gluten-Free</span>
        </button>

        {(filterVegOnly || filterSpicyOnly || filterGlutenFree) && (
          <button
            onClick={() => {
              setFilterVegOnly(false);
              setFilterSpicyOnly(false);
              setFilterGlutenFree(false);
            }}
            className="text-stone-500 hover:text-amber-400 text-xs underline cursor-pointer ml-1"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-4 text-xs text-stone-400 font-mono">
        Showing <span className="text-amber-400 font-bold">{filteredItems.length}</span> dishes
        {searchQuery && <span> matching "{searchQuery}"</span>}
      </div>

      {/* Menu Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 px-4 bg-[#141821] rounded-2xl border border-white/10">
          <p className="text-stone-400 text-base">No dishes found matching your current filter criteria.</p>
          <button
            onClick={() => {
              setFilterVegOnly(false);
              setFilterSpicyOnly(false);
              setFilterGlutenFree(false);
              onSelectCategory('all');
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold text-stone-900 bg-amber-400 rounded-lg hover:bg-amber-300 transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="group flex flex-col bg-[#141821] rounded-2xl border border-white/10 overflow-hidden hover:border-amber-500/40 hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-black/40"
            >
              {/* Product Card Image Container (65-75% visual prominence) */}
              <div
                onClick={() => onOpenCustomize(item)}
                className="relative h-56 sm:h-60 w-full overflow-hidden bg-stone-900 cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback container in case image error
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.classList.add('bg-gradient-to-br', 'from-stone-900', 'to-amber-950/40');
                    }
                  }}
                />
                
                {/* Subtle scrim for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#141821] via-transparent to-black/20 pointer-events-none" />

                {/* Subtle single text badge (anti-pill spam) */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  {item.isPopular && (
                    <span className="bg-amber-500 text-stone-950 text-[11px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                      Chef's Choice
                    </span>
                  )}
                  {item.isSpicy && (
                    <span className="bg-red-600/90 text-white text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                      <Flame className="w-3 h-3" /> Spicy
                    </span>
                  )}
                  {item.isVeg && (
                    <span className="bg-emerald-700/90 text-white text-[11px] font-semibold px-2 py-0.5 rounded">
                      Vegetarian
                    </span>
                  )}
                </div>

                {/* Quick Add Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="bg-amber-500 text-stone-950 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Customize & Add
                  </span>
                </div>
              </div>

              {/* Card Body & Unboxed Metadata */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  {/* Clean unboxed metadata with typographic separators */}
                  <div className="flex items-center gap-2 text-xs text-stone-400 font-mono mb-1.5">
                    <span className="text-amber-400/90 font-medium flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {item.rating.toFixed(2)}
                      <span className="text-stone-500">({item.reviewCount})</span>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{item.prepTimeMinutes} min</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.calories} kcal</span>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => onOpenCustomize(item)}
                    className="text-lg font-semibold text-white group-hover:text-amber-400 transition-colors cursor-pointer leading-snug"
                  >
                    {item.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-stone-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Card Footer: Price & Primary Action */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider font-mono">
                      Starting at
                    </span>
                    <span className="text-xl font-bold text-white font-mono tabular-nums">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => onOpenCustomize(item)}
                    className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-md shadow-amber-500/10 active:scale-95 cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Customize</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
