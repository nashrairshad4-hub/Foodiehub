/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { CustomizationModal } from './components/CustomizationModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { TableReservationModal } from './components/TableReservationModal';
import { DjangoAdminModal } from './components/DjangoAdminModal';
import { StoryAndReviews } from './components/StoryAndReviews';
import { Footer } from './components/Footer';

import {
  CATEGORIES,
  INITIAL_MENU_ITEMS,
  INITIAL_ORDERS,
  INITIAL_RESERVATIONS,
  CUSTOMER_REVIEWS,
} from './data/menuData';

import {
  MenuItem,
  CategoryId,
  CartItem,
  Order,
  TableReservation,
  OrderStatus,
  OrderType,
} from './types';

import { CheckCircle2, ShoppingBag } from 'lucide-react';

export default function App() {
  // Core state
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [categories] = useState(CATEGORIES);
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart & Orders State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [appliedPromo, setAppliedPromo] = useState<string>('WELCOME20');
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [reservations, setReservations] = useState<TableReservation[]>(INITIAL_RESERVATIONS);

  // Modal visibility states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | undefined>(undefined);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isDjangoAdminOpen, setIsDjangoAdminOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Cart Calculations
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.lineTotal, 0);

  // Active uncompleted orders count
  const activeOrderCount = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length;

  // Handlers
  const handleOpenCustomize = (item: MenuItem) => {
    setCustomizingItem(item);
    setIsCustomizeOpen(true);
  };

  const handleAddToCart = (newItem: CartItem) => {
    setCartItems((prev) => {
      // Check if an identical customized item exists
      const existingIdx = prev.findIndex(
        (i) =>
          i.item.id === newItem.item.id &&
          i.selectedSize?.name === newItem.selectedSize?.name &&
          i.selectedDoneness === newItem.selectedDoneness &&
          JSON.stringify(i.selectedAddons.map((a) => a.id).sort()) ===
            JSON.stringify(newItem.selectedAddons.map((a) => a.id).sort()) &&
          i.specialInstructions === newItem.specialInstructions
      );

      if (existingIdx >= 0) {
        const updated = [...prev];
        const current = updated[existingIdx];
        const newQty = current.quantity + newItem.quantity;
        updated[existingIdx] = {
          ...current,
          quantity: newQty,
          lineTotal: current.unitPrice * newQty,
        };
        return updated;
      }
      return [...prev, newItem];
    });

    showToast(`Added ${newItem.quantity}× ${newItem.item.name} to order`);
  };

  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              lineTotal: item.unitPrice * newQty,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderPlaced = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    setActiveTrackingOrderId(newOrder.id);
    setIsTrackerOpen(true);
    showToast(`Order #${newOrder.orderNumber} confirmed! Kitchen is firing.`);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(`Order status updated to: ${newStatus.replace('_', ' ')}`);
  };

  const handleReservationCreated = (newRes: TableReservation) => {
    setReservations((prev) => [newRes, ...prev]);
    showToast(`Table confirmed: Code ${newRes.reservationCode}`);
  };

  const handleUpdateReservationStatus = (
    resId: string,
    status: 'confirmed' | 'seated' | 'completed' | 'cancelled'
  ) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === resId ? { ...r, status } : r))
    );
    showToast(`Reservation marked as ${status}`);
  };

  const handleNavigateToMenu = () => {
    const el = document.getElementById('menu-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0c0e13] text-[#f3f4f6]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#161a24] text-white px-4 py-3 rounded-xl border border-amber-500/40 shadow-2xl flex items-center gap-2.5 text-xs font-medium animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header (Top Bar Contract Compliant) */}
      <Header
        orderType={orderType}
        setOrderType={setOrderType}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenReservations={() => setIsReservationOpen(true)}
        onOpenDjangoAdmin={() => setIsDjangoAdminOpen(true)}
        onOpenLiveOrder={() => {
          setActiveTrackingOrderId(orders[0]?.id);
          setIsTrackerOpen(true);
        }}
        activeOrderCount={activeOrderCount}
        onNavigateToMenu={handleNavigateToMenu}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Section 1: Hero & Search */}
        <Hero
          orderType={orderType}
          setOrderType={setOrderType}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSelectCategory={(catId) => {
            setActiveCategory(catId);
            handleNavigateToMenu();
          }}
          onOpenReservations={() => setIsReservationOpen(true)}
        />

        {/* Section 2: Menu Catalog & Dietary Filtering */}
        <MenuSection
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          menuItems={menuItems}
          onOpenCustomize={handleOpenCustomize}
          searchQuery={searchQuery}
        />

        {/* Section 3: Culinary Craftsmanship Story & Verified Reviews */}
        <StoryAndReviews
          reviews={CUSTOMER_REVIEWS}
          onOpenReservations={() => setIsReservationOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenDjangoAdmin={() => setIsDjangoAdminOpen(true)}
        onOpenReservations={() => setIsReservationOpen(true)}
        onNavigateToMenu={handleNavigateToMenu}
      />

      {/* Modals & Slide-overs */}
      
      {/* 1. Customization PDP Modal */}
      <CustomizationModal
        item={customizingItem}
        isOpen={isCustomizeOpen}
        onClose={() => {
          setIsCustomizeOpen(false);
          setCustomizingItem(null);
        }}
        onAddToCart={handleAddToCart}
      />

      {/* 2. Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        orderType={orderType}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCheckout}
        appliedPromo={appliedPromo}
        setAppliedPromo={setAppliedPromo}
      />

      {/* 3. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        orderType={orderType}
        appliedPromo={appliedPromo}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* 4. Live Order Tracker Modal */}
      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        orders={orders}
        activeOrderId={activeTrackingOrderId}
        onUpdateOrderStatus={handleUpdateOrderStatus}
      />

      {/* 5. Table Reservation Modal */}
      <TableReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
        onReservationCreated={handleReservationCreated}
      />

      {/* 6. Python + Django + MySQL Administration Console */}
      <DjangoAdminModal
        isOpen={isDjangoAdminOpen}
        onClose={() => setIsDjangoAdminOpen(false)}
        menuItems={menuItems}
        setMenuItems={setMenuItems}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        reservations={reservations}
        onUpdateReservationStatus={handleUpdateReservationStatus}
      />

      {/* Floating Quick Cart pill button for mobile */}
      {cartCount > 0 && !isCartOpen && !isCheckoutOpen && !isCustomizeOpen && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-30 sm:hidden">
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2.5 bg-amber-500 text-stone-950 font-bold px-5 py-3 rounded-full shadow-2xl shadow-amber-500/40 active:scale-95 transition-transform"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>View Cart ({cartCount})</span>
            <span className="font-mono tabular-nums">· ${cartTotal.toFixed(2)}</span>
          </button>
        </div>
      )}
    </div>
  );
}
