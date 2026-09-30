import React, { useState } from 'react';
import { TableReservation } from '../types';
import { X, Calendar, Clock, Users, Sparkles, CheckCircle2, MapPin } from 'lucide-react';

interface TableReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReservationCreated: (res: TableReservation) => void;
}

export const TableReservationModal: React.FC<TableReservationModalProps> = ({
  isOpen,
  onClose,
  onReservationCreated,
}) => {
  if (!isOpen) return null;

  const [guestName, setGuestName] = useState('Bilal Irshad');
  const [phone, setPhone] = useState('+1 (555) 389-4102');
  const [email, setEmail] = useState('bilalirshad366@gmail.com');
  const [guestsCount, setGuestsCount] = useState(2);
  const [date, setDate] = useState('Today (Evening)');
  const [timeSlot, setTimeSlot] = useState('7:30 PM');
  const [seatingArea, setSeatingArea] = useState<'indoor_dining' | 'woodfired_patio' | 'chef_counter'>('woodfired_patio');
  const [occasion, setOccasion] = useState('Date Night / Dinner');
  const [specialRequests, setSpecialRequests] = useState('Corner table with cozy hearth view if possible.');
  const [confirmedReservation, setConfirmedReservation] = useState<TableReservation | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const resCode = `RES-${Math.floor(8000 + Math.random() * 2000)}`;
    const tableAssigned = seatingArea === 'woodfired_patio' ? 'Table P-08 (Patio Hearth)' : seatingArea === 'chef_counter' ? 'Counter Seats #4-5' : 'Table 12 (Main Dining)';
    
    const newRes: TableReservation = {
      id: `res-${Date.now()}`,
      reservationCode: resCode,
      guestName,
      phone,
      email,
      guestsCount,
      date,
      timeSlot,
      seatingArea,
      occasion,
      specialRequests,
      tableAssigned,
      status: 'confirmed',
      createdAt: 'Just now',
    };

    onReservationCreated(newRes);
    setConfirmedReservation(newRes);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#13161f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-[#11141c] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-white">Reserve a Table</h2>
              <p className="text-xs text-stone-400">Experience our wood-fired dining in person</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedReservation ? (
          /* Confirmation Screen */
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                Table Reserved Successfully
              </span>
              <h3 className="text-2xl font-serif font-bold text-white mt-1">
                We're Saving a Table for You, {confirmedReservation.guestName}!
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Confirmation code: <strong className="text-amber-400 font-mono text-sm">{confirmedReservation.reservationCode}</strong>
              </p>
            </div>

            <div className="bg-[#181d29] p-4 rounded-xl border border-white/5 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-stone-400">Date & Time:</span>
                <span className="text-white font-medium">{confirmedReservation.date} at {confirmedReservation.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Party Size:</span>
                <span className="text-white font-medium">{confirmedReservation.guestsCount} Guests</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Seating Area:</span>
                <span className="text-amber-400 font-medium capitalize">{confirmedReservation.seatingArea.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Table Assignment:</span>
                <span className="text-white font-semibold font-mono">{confirmedReservation.tableAssigned}</span>
              </div>
            </div>

            <p className="text-[11px] text-stone-400">
              A confirmation SMS has been prepared for {confirmedReservation.phone}. We look forward to welcoming you!
            </p>

            <button
              onClick={onClose}
              className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3 px-6 rounded-xl transition-all cursor-pointer"
            >
              Done & Return to Menu
            </button>
          </div>
        ) : (
          /* Reservation Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            
            {/* Party Size & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-500" />
                  Number of Guests
                </label>
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className="w-full bg-[#181d29] text-white text-xs p-3 rounded-xl border border-white/10 focus:border-amber-500 focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                    <option key={num} value={num} className="bg-[#181d29]">
                      {num} {num === 1 ? 'Guest (Solo Dining)' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-stone-300 font-medium block mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  Time Slot
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full bg-[#181d29] text-white text-xs p-3 rounded-xl border border-white/10 focus:border-amber-500 focus:outline-none"
                >
                  <option value="5:30 PM" className="bg-[#181d29]">5:30 PM (Early Dinner)</option>
                  <option value="6:30 PM" className="bg-[#181d29]">6:30 PM</option>
                  <option value="7:30 PM" className="bg-[#181d29]">7:30 PM (Prime Hearth)</option>
                  <option value="8:30 PM" className="bg-[#181d29]">8:30 PM</option>
                  <option value="9:15 PM" className="bg-[#181d29]">9:15 PM (Late Night)</option>
                </select>
              </div>
            </div>

            {/* Date selection */}
            <div>
              <label className="text-xs text-stone-300 font-medium block mb-1.5">Date</label>
              <div className="grid grid-cols-3 gap-2">
                {['Today (Evening)', 'Tomorrow', 'This Friday'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDate(d)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer text-center ${
                      date === d
                        ? 'bg-amber-500 text-stone-950 font-bold border-amber-500 shadow-md'
                        : 'bg-[#181d29] border-white/5 text-stone-300 hover:border-white/20'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Seating Area */}
            <div>
              <label className="text-xs text-stone-300 font-medium block mb-1.5">Preferred Seating Area</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSeatingArea('woodfired_patio')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    seatingArea === 'woodfired_patio'
                      ? 'bg-amber-500/10 border-amber-500 text-white'
                      : 'bg-[#181d29] border-white/5 text-stone-400 hover:text-white'
                  }`}
                >
                  <span className="text-xs font-semibold block">Wood-Fired Patio</span>
                  <span className="text-[10px] text-stone-400">Festoon lights & heaters</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSeatingArea('indoor_dining')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    seatingArea === 'indoor_dining'
                      ? 'bg-amber-500/10 border-amber-500 text-white'
                      : 'bg-[#181d29] border-white/5 text-stone-400 hover:text-white'
                  }`}
                >
                  <span className="text-xs font-semibold block">Indoor Hearth</span>
                  <span className="text-[10px] text-stone-400">Cozy rustic leather booths</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSeatingArea('chef_counter')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    seatingArea === 'chef_counter'
                      ? 'bg-amber-500/10 border-amber-500 text-white'
                      : 'bg-[#181d29] border-white/5 text-stone-400 hover:text-white'
                  }`}
                >
                  <span className="text-xs font-semibold block">Chef's Bar</span>
                  <span className="text-[10px] text-stone-400">Direct 900°F oven view</span>
                </button>
              </div>
            </div>

            {/* Guest Contact info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[11px] text-stone-400 block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full bg-[#181d29] text-white text-xs p-3 rounded-xl border border-white/10 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-stone-400 block mb-1">Mobile Phone (For SMS Alert)</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#181d29] text-white text-xs p-3 rounded-xl border border-white/10 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-stone-400 block mb-1">Special Occasion & Requests</label>
              <input
                type="text"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="e.g. Birthday celebration, anniversary champagne, high chair needed"
                className="w-full bg-[#181d29] text-white text-xs p-3 rounded-xl border border-white/10 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition-all cursor-pointer mt-4"
            >
              <Sparkles className="w-4 h-4" />
              <span>Confirm Table Booking</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
