import React from 'react';
import { UtensilsCrossed, MapPin, Clock, Phone, Mail, Database, ShieldAlert } from 'lucide-react';

interface FooterProps {
  onOpenDjangoAdmin: () => void;
  onOpenReservations: () => void;
  onNavigateToMenu: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenDjangoAdmin,
  onOpenReservations,
  onNavigateToMenu,
}) => {
  return (
    <footer className="bg-[#0b0d12] border-t border-white/10 text-stone-400 text-xs py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Brand Col */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-stone-950 font-bold">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-white tracking-tight">
                Rustica
              </span>
              <span className="block text-[10px] uppercase font-mono tracking-widest text-amber-500">
                Grill & Kitchen
              </span>
            </div>
          </div>
          <p className="text-stone-400 text-xs leading-relaxed">
            Authentic artisanal food ordering powered by oak-fired ovens, 72-hour sourdough fermentation, and dry-aged wagyu primals.
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenDjangoAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/40 text-emerald-300 rounded-lg text-xs font-mono transition-colors cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Django & MySQL Console</span>
            </button>
          </div>
        </div>

        {/* Hours & Service */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-widest text-white font-semibold">
            Hearth Operating Hours
          </h4>
          <div className="space-y-2 text-stone-300 text-xs font-mono">
            <div className="flex justify-between">
              <span>Mon – Thu:</span>
              <span className="text-white">11:30 AM – 10:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Friday:</span>
              <span className="text-white">11:30 AM – 11:30 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Saturday:</span>
              <span className="text-white">11:00 AM – 11:30 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Sunday Brunch:</span>
              <span className="text-white">10:30 AM – 9:30 PM</span>
            </div>
          </div>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-2">
            <Clock className="w-3.5 h-3.5" />
            Kitchen currently active & firing orders
          </p>
        </div>

        {/* Location & Contact */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-widest text-white font-semibold">
            Kitchen & Pickup Location
          </h4>
          <div className="space-y-2 text-stone-300 text-xs">
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>428 Foundry Street, Historic Culinary District, Downtown</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="font-mono">+1 (555) 787-8422</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="font-mono">orders@rusticakitchen.internal</span>
            </p>
          </div>
          <div className="pt-1">
            <button
              onClick={onOpenReservations}
              className="text-amber-400 hover:text-amber-300 text-xs font-medium underline cursor-pointer"
            >
              Book Table Reservation →
            </button>
          </div>
        </div>

        {/* Dietary & Allergen Advisory */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-widest text-white font-semibold flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            <span>Allergen & Quality Care</span>
          </h4>
          <p className="text-stone-400 text-xs leading-relaxed">
            Our wood-fired oven and planchas cook dairy, wheat, tree nuts, and shellfish. If you possess severe anaphylactic sensitivities, please note them when customizing your order.
          </p>
          <div className="text-[11px] text-stone-500 pt-2 font-mono border-t border-white/5">
            Stack: Python · Django 5.1 · MySQL · Bootstrap CSS · React JS
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
        <div>
          © {new Date().getFullYear()} Rustica Grill & Kitchen Co. All culinary rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onNavigateToMenu} className="hover:text-stone-300 transition-colors cursor-pointer">
            Menu
          </button>
          <span aria-hidden="true">·</span>
          <button onClick={onOpenReservations} className="hover:text-stone-300 transition-colors cursor-pointer">
            Reservations
          </button>
          <span aria-hidden="true">·</span>
          <button onClick={onOpenDjangoAdmin} className="hover:text-stone-300 transition-colors cursor-pointer">
            Django Admin
          </button>
        </div>
      </div>
    </footer>
  );
};
