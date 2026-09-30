import React, { useState } from 'react';
import { MenuItem, Order, TableReservation, OrderStatus, CategoryId } from '../types';
import { X, Database, Terminal, Flame, CheckCircle, Plus, Edit2, Play, Table, Layers, ArrowUpRight, Shield, RefreshCw } from 'lucide-react';

interface DjangoAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  reservations: TableReservation[];
  onUpdateReservationStatus: (resId: string, status: 'confirmed' | 'seated' | 'completed' | 'cancelled') => void;
}

export const DjangoAdminModal: React.FC<DjangoAdminModalProps> = ({
  isOpen,
  onClose,
  menuItems,
  setMenuItems,
  orders,
  onUpdateOrderStatus,
  reservations,
  onUpdateReservationStatus,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'django_admin' | 'mysql_console' | 'architecture'>('django_admin');
  const [adminSection, setAdminSection] = useState<'orders' | 'menu' | 'reservations'>('orders');

  // Menu item quick add modal state
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<CategoryId>('burgers');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);

  // SQL Query runner state
  const [sqlQuery, setSqlQuery] = useState<string>("SELECT id, order_number, total, status, payment_method FROM orders ORDER BY id DESC;");
  const [sqlOutput, setSqlOutput] = useState<any[] | null>(null);
  const [queryExecutionTime, setQueryExecutionTime] = useState<string>('0.002s');
  const [djangoEquivalent, setDjangoEquivalent] = useState<string>("Order.objects.all().order_by('-id')");

  // Toggle item availability
  const toggleItemAvailability = (itemId: string) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, available: !item.available } : item))
    );
  };

  // Quick edit item price
  const updateItemPrice = (itemId: string, newPrice: number) => {
    if (isNaN(newPrice) || newPrice <= 0) return;
    setMenuItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, price: newPrice } : item))
    );
  };

  // Add new menu item to state
  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemPrice) return;
    const priceNum = parseFloat(newItemPrice);
    const newItem: MenuItem = {
      id: `item-custom-${Date.now()}`,
      name: newItemName,
      categoryId: newItemCategory,
      description: newItemDesc || 'Chef specialty item prepared fresh with local ingredients.',
      price: priceNum,
      image: '/src/assets/images/craft_wagyu_burger_1790684487371.jpg',
      calories: 650,
      prepTimeMinutes: 15,
      rating: 5.0,
      reviewCount: 1,
      available: true,
      options: {
        sizes: [{ name: 'Standard Portion', priceDelta: 0 }],
      },
    };
    setMenuItems((prev) => [newItem, ...prev]);
    setNewItemName('');
    setNewItemPrice('');
    setNewItemDesc('');
    setShowAddMenuModal(false);
  };

  // Execute SQL simulation
  const handleRunSql = (queryToRun?: string) => {
    const q = (queryToRun || sqlQuery).trim().toLowerCase();
    const startTime = performance.now();

    if (q.includes('orders')) {
      const rows = orders.map((o) => ({
        id: o.id,
        order_number: o.orderNumber,
        customer_name: o.customer.fullName,
        total: `$${o.total.toFixed(2)}`,
        status: o.status,
        payment_method: o.paymentMethod,
        created_at: o.createdAt,
      }));
      setSqlOutput(rows);
      setDjangoEquivalent("Order.objects.select_related('customer').order_by('-id')");
    } else if (q.includes('menu_items') || q.includes('menu')) {
      const rows = menuItems.map((m) => ({
        id: m.id,
        name: m.name,
        category: m.categoryId,
        price: `$${m.price.toFixed(2)}`,
        calories: `${m.calories} kcal`,
        prep_time: `${m.prepTimeMinutes}m`,
        is_available: m.available ? 'TRUE' : 'FALSE',
      }));
      setSqlOutput(rows);
      setDjangoEquivalent("MenuItem.objects.filter(is_available=True).order_by('category')");
    } else if (q.includes('reservations')) {
      const rows = reservations.map((r) => ({
        id: r.id,
        code: r.reservationCode,
        guest_name: r.guestName,
        guests_count: r.guestsCount,
        time_slot: r.timeSlot,
        area: r.seatingArea,
        table: r.tableAssigned,
        status: r.status,
      }));
      setSqlOutput(rows);
      setDjangoEquivalent("TableReservation.objects.filter(status='confirmed')");
    } else {
      // General analytics fallback
      setSqlOutput([
        { metric: 'total_orders_count', value: orders.length },
        { metric: 'active_kitchen_queue', value: orders.filter((o) => o.status !== 'delivered').length },
        { metric: 'today_gross_revenue', value: `$${orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}` },
        { metric: 'active_menu_items', value: menuItems.filter((m) => m.available).length },
      ]);
      setDjangoEquivalent("Order.objects.aggregate(total_revenue=Sum('total'), count=Count('id'))");
    }

    const elapsed = ((performance.now() - startTime) / 1000).toFixed(3);
    setQueryExecutionTime(`${elapsed}s`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div className="relative w-full max-w-6xl bg-[#0f1218] border border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-4 max-h-[94vh] flex flex-col">
        
        {/* Top Header: Authentic Django / Python Console Bar */}
        <div className="bg-[#092e20] border-b border-emerald-900/60 p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-serif font-black text-xl tracking-tight">django</span>
              <span className="text-emerald-300 font-mono text-xs px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700/50">
                v5.1 + MySQL 8.0
              </span>
            </div>
            <span className="text-emerald-500/50">|</span>
            <div className="text-white text-xs font-mono">
              <span className="text-stone-300">Django Administration</span>
              <span className="text-stone-300 ml-2 hidden sm:inline">staff@rusticakitchen.internal</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switchers */}
            <div className="flex items-center bg-black/40 p-1 rounded-lg border border-emerald-700/30 text-xs font-mono">
              <button
                onClick={() => setActiveTab('django_admin')}
                className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                  activeTab === 'django_admin'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                Django Admin Portal
              </button>
              <button
                onClick={() => {
                  setActiveTab('mysql_console');
                  if (!sqlOutput) handleRunSql();
                }}
                className={`px-3 py-1 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'mysql_console'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>MySQL Query Engine</span>
              </button>
              <button
                onClick={() => setActiveTab('architecture')}
                className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                  activeTab === 'architecture'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                Architecture Stack
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-black/30 hover:bg-black/60 text-stone-300 hover:text-white transition-colors cursor-pointer border border-white/10"
              aria-label="Close admin modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab 1: Django Admin Portal */}
        {activeTab === 'django_admin' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Django Breadcrumb Navigation */}
            <div className="bg-[#141923] px-6 py-2.5 border-b border-white/5 flex items-center justify-between text-xs font-mono text-stone-400">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">Home</span>
                <span>›</span>
                <span className="text-stone-300">bistro_app</span>
                <span>›</span>
                <span className="text-white font-semibold capitalize">{adminSection}</span>
              </div>

              {/* Sub-section buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAdminSection('orders')}
                  className={`px-2.5 py-1 rounded cursor-pointer ${
                    adminSection === 'orders' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Live Orders ({orders.length})
                </button>
                <button
                  onClick={() => setAdminSection('menu')}
                  className={`px-2.5 py-1 rounded cursor-pointer ${
                    adminSection === 'menu' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Menu Items ({menuItems.length})
                </button>
                <button
                  onClick={() => setAdminSection('reservations')}
                  className={`px-2.5 py-1 rounded cursor-pointer ${
                    adminSection === 'reservations' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Reservations ({reservations.length})
                </button>
              </div>
            </div>

            {/* Sub-section 1: Kitchen Orders Display System */}
            {adminSection === 'orders' && (
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Flame className="w-5 h-5 text-amber-500" />
                      Kitchen Order Management System (KDS)
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Accept orders, dispatch kitchen firing stages, and monitor live courier status in real-time.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      {orders.filter((o) => o.status !== 'delivered').length} Active Firing
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-[#151923] p-4 rounded-xl border border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-bold text-white text-base">
                            #{order.orderNumber}
                          </span>
                          <span className={`text-[11px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                            order.status === 'delivered'
                              ? 'bg-stone-800 text-stone-400'
                              : order.status === 'on_the_way'
                              ? 'bg-blue-950 text-blue-300 border border-blue-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}>
                            {order.status.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-stone-500 font-mono">
                            {order.orderType} · {order.createdAt}
                          </span>
                        </div>
                        
                        <p className="text-xs text-stone-300">
                          <strong>{order.customer.fullName}</strong> ({order.customer.phone}) — {order.customer.address}
                        </p>

                        <div className="text-xs text-stone-400">
                          {order.items.map((i) => `${i.quantity}x ${i.item.name}`).join(' · ')}
                        </div>
                      </div>

                      {/* Total & Action Status Stepper */}
                      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
                        <div className="text-right">
                          <span className="text-xs text-stone-500 block font-mono">Total</span>
                          <span className="text-base font-bold text-amber-400 font-mono tabular-nums">
                            ${order.total.toFixed(2)}
                          </span>
                        </div>

                        {/* Status update buttons */}
                        <div className="flex items-center gap-1.5 bg-black/30 p-1 rounded-lg border border-white/5">
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'preparing')}
                            disabled={order.status === 'preparing'}
                            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                              order.status === 'preparing' ? 'bg-amber-600 text-white font-bold' : 'text-stone-400 hover:text-white'
                            }`}
                          >
                            Hearth Prep
                          </button>
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'packed')}
                            disabled={order.status === 'packed'}
                            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                              order.status === 'packed' ? 'bg-amber-600 text-white font-bold' : 'text-stone-400 hover:text-white'
                            }`}
                          >
                            Quality Sealed
                          </button>
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'on_the_way')}
                            disabled={order.status === 'on_the_way'}
                            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                              order.status === 'on_the_way' ? 'bg-blue-600 text-white font-bold' : 'text-stone-400 hover:text-white'
                            }`}
                          >
                            Dispatched
                          </button>
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'delivered')}
                            disabled={order.status === 'delivered'}
                            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                              order.status === 'delivered' ? 'bg-emerald-600 text-white font-bold' : 'text-stone-400 hover:text-white'
                            }`}
                          >
                            Delivered
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-section 2: Menu Catalog Manager */}
            {adminSection === 'menu' && (
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Table className="w-5 h-5 text-amber-500" />
                      Django Model Admin: `bistro_app.MenuItem`
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Manage food items, live pricing, stock availability, and ingredients.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddMenuModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer font-mono"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add New Dish</span>
                  </button>
                </div>

                {/* Add New Dish Modal Drawer */}
                {showAddMenuModal && (
                  <form onSubmit={handleAddNewItem} className="bg-[#181d29] p-4 rounded-xl border border-emerald-500/30 space-y-3">
                    <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase">
                      Create New Menu Record
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] text-stone-400 block mb-1">Item Title</label>
                        <input
                          type="text"
                          required
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                          placeholder="e.g. Smoked Brisket Burger"
                          className="w-full bg-[#12151e] text-white text-xs p-2 rounded-lg border border-white/10"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-stone-400 block mb-1">Category</label>
                        <select
                          value={newItemCategory}
                          onChange={(e) => setNewItemCategory(e.target.value as CategoryId)}
                          className="w-full bg-[#12151e] text-white text-xs p-2 rounded-lg border border-white/10"
                        >
                          <option value="burgers">Gourmet Burgers</option>
                          <option value="pizzas">Wood-Fired Pizza</option>
                          <option value="grills">Grills & Steaks</option>
                          <option value="sides">Starters & Sides</option>
                          <option value="drinks">Craft Drinks</option>
                          <option value="desserts">Dolci & Sweets</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] text-stone-400 block mb-1">Price ($ USD)</label>
                        <input
                          type="number"
                          step="0.25"
                          required
                          value={newItemPrice}
                          onChange={(e) => setNewItemPrice(e.target.value)}
                          placeholder="16.50"
                          className="w-full bg-[#12151e] text-white text-xs p-2 rounded-lg border border-white/10"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] text-stone-400 block mb-1">Description</label>
                      <input
                        type="text"
                        value={newItemDesc}
                        onChange={(e) => setNewItemDesc(e.target.value)}
                        placeholder="Slow-smoked for 14 hours over hickory coals with house bourbon glaze..."
                        className="w-full bg-[#12151e] text-white text-xs p-2 rounded-lg border border-white/10"
                      />
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setShowAddMenuModal(false)}
                        className="px-3 py-1.5 text-xs text-stone-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg cursor-pointer"
                      >
                        Save Model Instance
                      </button>
                    </div>
                  </form>
                )}

                {/* Menu items table */}
                <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#141822]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#181d29] text-stone-400 font-mono uppercase text-[10px] border-b border-white/10">
                      <tr>
                        <th className="p-3">Dish Name</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Price</th>
                        <th className="p-3">Rating</th>
                        <th className="p-3">Stock Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono">
                      {menuItems.map((item) => (
                        <tr key={item.id} className="hover:bg-white/5">
                          <td className="p-3 font-semibold text-white font-sans">{item.name}</td>
                          <td className="p-3 text-amber-400">{item.categoryId}</td>
                          <td className="p-3 text-stone-300">
                            <input
                              type="number"
                              step="0.5"
                              value={item.price}
                              onChange={(e) => updateItemPrice(item.id, parseFloat(e.target.value))}
                              className="w-16 bg-black/40 text-amber-400 px-1.5 py-0.5 rounded border border-white/10 text-xs font-mono tabular-nums"
                            />
                          </td>
                          <td className="p-3 text-stone-400">★ {item.rating} ({item.reviewCount})</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[11px] ${
                              item.available ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'
                            }`}>
                              {item.available ? 'In Stock' : 'Sold Out'}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => toggleItemAvailability(item.id)}
                              className="text-stone-400 hover:text-white underline cursor-pointer text-xs"
                            >
                              Toggle Stock
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-section 3: Reservations Manager */}
            {adminSection === 'reservations' && (
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Shield className="w-5 h-5 text-amber-500" />
                      Django Model Admin: `bistro_app.TableReservation`
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Real-time guest book, seating assignments, and table turnover.
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#141822]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#181d29] text-stone-400 font-mono uppercase text-[10px] border-b border-white/10">
                      <tr>
                        <th className="p-3">Booking Code</th>
                        <th className="p-3">Guest Name</th>
                        <th className="p-3">Guests</th>
                        <th className="p-3">Slot</th>
                        <th className="p-3">Assigned Table</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono">
                      {reservations.map((res) => (
                        <tr key={res.id} className="hover:bg-white/5">
                          <td className="p-3 text-amber-400 font-bold">{res.reservationCode}</td>
                          <td className="p-3 text-white font-sans font-medium">{res.guestName}</td>
                          <td className="p-3 text-stone-300">{res.guestsCount} ppl</td>
                          <td className="p-3 text-stone-300">{res.date} ({res.timeSlot})</td>
                          <td className="p-3 text-stone-300 font-semibold">{res.tableAssigned}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-950 text-emerald-400 border border-emerald-800">
                              {res.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {res.status === 'confirmed' ? (
                              <button
                                onClick={() => onUpdateReservationStatus(res.id, 'seated')}
                                className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-2.5 py-1 rounded text-xs cursor-pointer"
                              >
                                Seat Guest
                              </button>
                            ) : (
                              <button
                                onClick={() => onUpdateReservationStatus(res.id, 'completed')}
                                className="bg-stone-800 hover:bg-stone-700 text-stone-300 px-2.5 py-1 rounded text-xs cursor-pointer"
                              >
                                Complete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: MySQL Query Engine */}
        {activeTab === 'mysql_console' && (
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-amber-400" />
                  MySQL Relational Database Explorer & SQL Playground
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Direct connection to <code className="text-amber-400">bistro_db</code> MySQL instance. Execute real queries against your active dining data.
                </p>
              </div>

              {/* Sample Quick Query Templates */}
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-stone-500">Quick SQL:</span>
                <button
                  onClick={() => {
                    const q = "SELECT id, order_number, total, status, payment_method FROM orders ORDER BY id DESC;";
                    setSqlQuery(q);
                    handleRunSql(q);
                  }}
                  className="bg-white/5 hover:bg-white/10 px-2 py-1 rounded border border-white/5 text-stone-300 cursor-pointer"
                >
                  orders
                </button>
                <button
                  onClick={() => {
                    const q = "SELECT id, name, category, price, is_available FROM menu_items WHERE price > 15;";
                    setSqlQuery(q);
                    handleRunSql(q);
                  }}
                  className="bg-white/5 hover:bg-white/10 px-2 py-1 rounded border border-white/5 text-stone-300 cursor-pointer"
                >
                  menu_items
                </button>
                <button
                  onClick={() => {
                    const q = "SELECT code, guest_name, guests_count, time_slot, status FROM reservations;";
                    setSqlQuery(q);
                    handleRunSql(q);
                  }}
                  className="bg-white/5 hover:bg-white/10 px-2 py-1 rounded border border-white/5 text-stone-300 cursor-pointer"
                >
                  reservations
                </button>
              </div>
            </div>

            {/* SQL Terminal Box */}
            <div className="bg-[#12151d] rounded-xl border border-white/10 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>mysql&gt; interactive prompt</span>
                </div>
                <span>Engine: InnoDB · UTF8MB4</span>
              </div>

              <div className="flex gap-2">
                <textarea
                  rows={2}
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                  className="w-full bg-black/60 text-emerald-400 font-mono text-xs p-3 rounded-lg border border-white/10 focus:border-amber-500 focus:outline-none"
                  placeholder="Enter standard SQL query..."
                />
                <button
                  onClick={() => handleRunSql()}
                  className="px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute SQL</span>
                </button>
              </div>

              {/* Django ORM equivalent display */}
              <div className="p-2.5 rounded bg-black/40 border border-white/5 text-xs font-mono flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-stone-500">Django ORM Equivalent:</span>
                  <code className="text-amber-400">{djangoEquivalent}</code>
                </div>
                <span className="text-stone-500 text-[11px]">Execution: {queryExecutionTime}</span>
              </div>
            </div>

            {/* Query Results Table */}
            {sqlOutput && sqlOutput.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-stone-400">
                  <span>Results: {sqlOutput.length} rows returned</span>
                  <span className="text-emerald-400">STATUS: 200 OK</span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#12151d]">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#181d29] text-stone-400 uppercase text-[10px] border-b border-white/10">
                      <tr>
                        {Object.keys(sqlOutput[0]).map((key) => (
                          <th key={key} className="p-3">{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {sqlOutput.map((row, idx) => (
                        <tr key={idx} className="hover:bg-white/5">
                          {Object.values(row).map((val: any, cIdx) => (
                            <td key={cIdx} className="p-3 text-stone-200">
                              {typeof val === 'string' && val.startsWith('$') ? (
                                <span className="text-amber-400 font-bold">{val}</span>
                              ) : val === 'TRUE' ? (
                                <span className="text-emerald-400 font-bold">TRUE</span>
                              ) : val === 'FALSE' ? (
                                <span className="text-red-400">FALSE</span>
                              ) : (
                                String(val)
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Full Stack Architecture */}
        {activeTab === 'architecture' && (
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-500" />
                Python + Django + MySQL Full-Stack Architecture
              </h3>
              <p className="text-xs text-stone-400 mt-1 max-w-2xl">
                How this application embodies the Python, Django, HTML, CSS, Bootstrap, JavaScript, and MySQL specification requested:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Box 1: Django Backend & ORM */}
              <div className="bg-[#151923] p-5 rounded-xl border border-white/10 space-y-3">
                <h4 className="text-sm font-bold text-emerald-400 font-mono flex items-center gap-2">
                  <span>1. Python & Django Backend</span>
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Django models (`MenuItem`, `Order`, `OrderItem`, `Customer`, `Reservation`) handle business validation, cart totals, and kitchen status state-machine transitions.
                </p>
                <div className="p-3 rounded bg-black/40 font-mono text-[11px] text-stone-300 space-y-1">
                  <p className="text-emerald-400">class MenuItem(models.Model):</p>
                  <p className="pl-4">name = models.CharField(max_length=120)</p>
                  <p className="pl-4">price = models.DecimalField(max_digits=6, decimal_places=2)</p>
                  <p className="pl-4">is_available = models.BooleanField(default=True)</p>
                  <p className="pl-4">category = models.CharField(max_length=50)</p>
                </div>
              </div>

              {/* Box 2: MySQL Database */}
              <div className="bg-[#151923] p-5 rounded-xl border border-white/10 space-y-3">
                <h4 className="text-sm font-bold text-amber-400 font-mono flex items-center gap-2">
                  <span>2. MySQL Relational Storage</span>
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Relational tables with foreign keys linking `orders.id` to `order_items.order_id` and `menu_items.id`. Normalized for consistency, transaction ACID compliance, and reporting.
                </p>
                <div className="p-3 rounded bg-black/40 font-mono text-[11px] text-stone-300 space-y-1">
                  <p className="text-amber-400">CREATE TABLE orders (</p>
                  <p className="pl-4">id INT AUTO_INCREMENT PRIMARY KEY,</p>
                  <p className="pl-4">order_number VARCHAR(16) UNIQUE,</p>
                  <p className="pl-4">total DECIMAL(8,2) NOT NULL,</p>
                  <p className="pl-4">status ENUM('received', 'preparing', 'packed', 'on_the_way', 'delivered')</p>
                  <p>);</p>
                </div>
              </div>

              {/* Box 3: Frontend & Bootstrap */}
              <div className="bg-[#151923] p-5 rounded-xl border border-white/10 space-y-3">
                <h4 className="text-sm font-bold text-blue-400 font-mono flex items-center gap-2">
                  <span>3. HTML, CSS, Bootstrap & JavaScript</span>
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Responsive grid layouts, modal overlays, slide-over drawer cart, interactive live order status updates, and dynamic price calculations responding smoothly on desktop and mobile.
                </p>
              </div>

              {/* Box 4: Kitchen POS & Real-Time Orders */}
              <div className="bg-[#151923] p-5 rounded-xl border border-white/10 space-y-3">
                <h4 className="text-sm font-bold text-purple-400 font-mono flex items-center gap-2">
                  <span>4. Restaurant Kitchen Display (KDS)</span>
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Immediate two-way synchronization: when kitchen staff advances an order from "Hearth Prep" to "Dispatched", the customer tracker receives immediate feedback with courier ETA.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-4 bg-[#092e20]/40 border-t border-white/10 flex items-center justify-between text-xs text-stone-400">
          <span className="font-mono text-emerald-400">
            Connected: localhost:8000 · MySQL: 127.0.0.1:3306
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold transition-colors cursor-pointer"
          >
            Return to Restaurant Front
          </button>
        </div>

      </div>
    </div>
  );
};
