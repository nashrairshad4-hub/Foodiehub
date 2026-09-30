import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { X, CheckCircle2, Clock, MapPin, Phone, Car, Utensils, ShieldCheck, ChevronRight, PackageCheck, Printer } from 'lucide-react';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  activeOrderId?: string;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
}

const STATUS_STEPS: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'received', label: 'Order Received', desc: 'Kitchen acknowledged & firing queued' },
  { status: 'preparing', label: 'Wood-Fired Hearth Prep', desc: 'Burgers searing & pizzas in 900°F oven' },
  { status: 'packed', label: 'Quality Check & Sealed', desc: 'Thermal insulated packaging applied' },
  { status: 'on_the_way', label: 'Courier On Route', desc: 'Speeding towards your location' },
  { status: 'delivered', label: 'Delivered Fresh', desc: 'Handed over at your doorstep' },
];

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  orders,
  activeOrderId,
  onUpdateOrderStatus,
}) => {
  if (!isOpen) return null;

  // Selected order to view
  const [selectedId, setSelectedId] = useState<string>(activeOrderId || (orders[0]?.id ?? ''));
  const currentOrder = orders.find((o) => o.id === selectedId) || orders[0];
  const [callModalOpen, setCallModalOpen] = useState(false);

  if (!currentOrder) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="w-full max-w-md bg-[#13161f] border border-white/10 rounded-2xl p-6 text-center space-y-4">
          <Clock className="w-12 h-12 text-stone-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Active Orders Yet</h3>
          <p className="text-xs text-stone-400">
            Once you place an order, you can track the hearth preparation and live delivery progress here.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold py-2.5 rounded-xl cursor-pointer text-sm"
          >
            Close Tracker
          </button>
        </div>
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.status === currentOrder.status);

  const handleNextStep = () => {
    if (currentStepIndex < STATUS_STEPS.length - 1) {
      const nextStatus = STATUS_STEPS[currentStepIndex + 1].status;
      onUpdateOrderStatus(currentOrder.id, nextStatus);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#13161f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-[#11141c] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-serif font-bold text-white">
                  Order #{currentOrder.orderNumber}
                </h2>
                <span className="text-xs font-mono bg-white/5 text-stone-300 px-2 py-0.5 rounded border border-white/5">
                  {currentOrder.orderType.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Placed {currentOrder.createdAt} · Estimated: <span className="text-amber-400 font-semibold">{currentOrder.estimatedDeliveryTime}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1.5"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-stone-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Close tracker"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Order Selector (if multiple orders exist) */}
        {orders.length > 1 && (
          <div className="px-6 py-2.5 bg-[#171b26] border-b border-white/5 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-stone-500 font-mono shrink-0">Your Orders:</span>
            {orders.map((ord) => (
              <button
                key={ord.id}
                onClick={() => setSelectedId(ord.id)}
                className={`px-3 py-1 rounded-md text-xs font-mono transition-colors shrink-0 cursor-pointer ${
                  ord.id === currentOrder.id
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'bg-white/5 text-stone-300 hover:text-white'
                }`}
              >
                #{ord.orderNumber} ({ord.status})
              </button>
            ))}
          </div>
        )}

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Progress Tracker Stepper */}
          <div className="bg-[#181d29] p-5 rounded-2xl border border-white/5 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-mono tracking-wider text-amber-500 font-semibold">
                Kitchen & Delivery Pipeline
              </span>
              <button
                onClick={handleNextStep}
                disabled={currentStepIndex >= STATUS_STEPS.length - 1}
                className="text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 font-mono"
              >
                <span>Advance Demo Stage</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Step icons & line */}
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-stone-800 -z-0" />
              <div
                className="absolute top-4 left-4 h-0.5 bg-amber-500 transition-all duration-500 -z-0"
                style={{
                  width: `${Math.min(100, (currentStepIndex / (STATUS_STEPS.length - 1)) * 96)}%`,
                }}
              />

              <div className="relative z-10 flex justify-between">
                {STATUS_STEPS.map((step, idx) => {
                  const isDone = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  return (
                    <div key={step.status} className="flex flex-col items-center max-w-[80px] text-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          isDone
                            ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                            : 'bg-[#12151e] border border-stone-700 text-stone-500'
                        } ${isCurrent ? 'ring-4 ring-amber-500/20' : ''}`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-mono">{idx + 1}</span>}
                      </div>
                      <span
                        className={`text-[11px] mt-2 font-medium leading-tight ${
                          isCurrent ? 'text-amber-400 font-bold' : isDone ? 'text-white' : 'text-stone-500'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Current status description callout */}
            <div className="p-3.5 rounded-xl bg-[#12151e] border border-white/5 flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <div className="text-xs">
                <span className="text-white font-semibold">{STATUS_STEPS[currentStepIndex]?.label}: </span>
                <span className="text-stone-400">{STATUS_STEPS[currentStepIndex]?.desc}</span>
              </div>
            </div>
          </div>

          {/* Courier Card (if on the way and driver exists) */}
          {currentOrder.driver && currentOrder.status === 'on_the_way' && (
            <div className="bg-gradient-to-r from-stone-900 to-[#181d29] p-5 rounded-2xl border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-lg border border-amber-500/30">
                  {currentOrder.driver.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{currentOrder.driver.name}</h4>
                    <span className="text-xs text-amber-400 font-mono">★ {currentOrder.driver.rating}</span>
                  </div>
                  <p className="text-xs text-stone-400 flex items-center gap-1 mt-0.5">
                    <Car className="w-3.5 h-3.5 text-stone-500" />
                    {currentOrder.driver.vehicle}
                  </p>
                  <p className="text-[11px] text-emerald-400 font-medium mt-0.5">
                    Estimated arrival in {currentOrder.driver.etaMinutes} minutes
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setCallModalOpen(true)}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Contact Courier</span>
                </button>
              </div>
            </div>
          )}

          {/* Order Itemized Summary */}
          <div className="bg-[#181d29] p-5 rounded-2xl border border-white/5 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-amber-500 font-semibold flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5" />
              Items in This Order
            </h3>

            <div className="divide-y divide-white/5">
              {currentOrder.items.map((item) => (
                <div key={item.cartItemId} className="py-3 flex items-start justify-between gap-4 first:pt-0 last:pb-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-white/10 text-white text-xs font-mono flex items-center justify-center font-bold">
                        {item.quantity}×
                      </span>
                      <span className="text-sm font-semibold text-white">{item.item.name}</span>
                    </div>
                    {item.selectedSize && (
                      <p className="text-xs text-stone-400 pl-7">{item.selectedSize.name}</p>
                    )}
                    {item.selectedAddons.length > 0 && (
                      <p className="text-xs text-amber-400/80 pl-7">
                        + {item.selectedAddons.map((a) => a.name).join(', ')}
                      </p>
                    )}
                    {item.specialInstructions && (
                      <p className="text-[11px] text-stone-400 italic pl-7">
                        Note: "{item.specialInstructions}"
                      </p>
                    )}
                  </div>
                  <span className="text-sm font-mono font-bold text-white tabular-nums">
                    ${item.lineTotal.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Order Financials */}
            <div className="pt-3 border-t border-white/5 space-y-1 text-xs text-stone-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-white tabular-nums">${currentOrder.subtotal.toFixed(2)}</span>
              </div>
              {currentOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Promo Code ({currentOrder.promoCodeApplied})</span>
                  <span className="font-mono tabular-nums">-${currentOrder.discount.toFixed(2)}</span>
                </div>
              )}
              {currentOrder.orderType === 'delivery' && (
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-mono text-white tabular-nums">
                    {currentOrder.deliveryFee === 0 ? 'FREE' : `$${currentOrder.deliveryFee.toFixed(2)}`}
                  </span>
                </div>
              )}
              {currentOrder.tip > 0 && (
                <div className="flex justify-between">
                  <span>Courier Tip</span>
                  <span className="font-mono text-white tabular-nums">${currentOrder.tip.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-mono text-white tabular-nums">${currentOrder.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                <span>Total Paid ({currentOrder.paymentMethod.replace('_', ' ').toUpperCase()})</span>
                <span className="text-amber-400 font-mono tabular-nums">${currentOrder.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Delivery address info */}
            <div className="p-3 rounded-xl bg-[#12151e] border border-white/5 text-xs text-stone-400 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-white font-medium">Destination: </span>
                <span>{currentOrder.customer.address} {currentOrder.customer.aptSuite}</span>
                {currentOrder.customer.deliveryNotes && (
                  <p className="text-stone-500 italic mt-0.5">Instructions: "{currentOrder.customer.deliveryNotes}"</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#10131b] border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-stone-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Rustica Fresh Food Guarantee</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Back to Menu
          </button>
        </div>
      </div>

      {/* Driver Call Modal Simulation */}
      {callModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-[#181d29] p-6 rounded-2xl border border-white/15 max-w-sm w-full text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-2xl font-bold animate-pulse">
              <Phone className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Calling {currentOrder.driver?.name}</h3>
              <p className="text-xs text-stone-400 mt-1">{currentOrder.driver?.phone}</p>
              <p className="text-xs text-amber-400 font-mono mt-2">Connecting via encrypted relay...</p>
            </div>
            <div className="p-3 bg-stone-900 rounded-xl text-xs text-stone-300">
              "Hi Bilal, this is Marco! I just picked up your Wagyu Prime and Truffle Fries. ETA is ~8 minutes!"
            </div>
            <button
              onClick={() => setCallModalOpen(false)}
              className="w-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer"
            >
              End Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
