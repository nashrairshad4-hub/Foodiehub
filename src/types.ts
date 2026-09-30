export type CategoryId = 'all' | 'burgers' | 'pizzas' | 'grills' | 'sides' | 'drinks' | 'desserts';

export interface Category {
  id: CategoryId;
  name: string;
  tagline: string;
  iconName: string;
}

export interface MenuItemOption {
  name: string;
  priceDelta: number;
}

export interface MenuItemAddon {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  categoryId: CategoryId;
  description: string;
  price: number;
  image: string;
  fallbackGradient?: string;
  isPopular?: boolean;
  isSpicy?: boolean;
  isVeg?: boolean;
  isGlutenFree?: boolean;
  calories: number;
  prepTimeMinutes: number;
  rating: number;
  reviewCount: number;
  available: boolean;
  options?: {
    sizes?: MenuItemOption[];
    doneness?: string[];
  };
  addons?: MenuItemAddon[];
}

export interface CartItem {
  cartItemId: string;
  item: MenuItem;
  selectedSize?: MenuItemOption;
  selectedDoneness?: string;
  selectedAddons: MenuItemAddon[];
  specialInstructions: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export type OrderStatus = 'received' | 'preparing' | 'packed' | 'on_the_way' | 'delivered' | 'cancelled';
export type OrderType = 'delivery' | 'pickup' | 'dine_in';
export type PaymentMethod = 'credit_card' | 'cash_on_delivery' | 'apple_pay';

export interface OrderCustomer {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  aptSuite?: string;
  deliveryNotes?: string;
}

export interface OrderDriver {
  name: string;
  phone: string;
  vehicle: string;
  rating: number;
  avatar: string;
  etaMinutes: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  orderType: OrderType;
  status: OrderStatus;
  customer: OrderCustomer;
  items: CartItem[];
  subtotal: number;
  discount: number;
  promoCodeApplied?: string;
  tip: number;
  deliveryFee: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  driver?: OrderDriver;
  estimatedDeliveryTime: string;
  tableNumber?: string;
}

export interface TableReservation {
  id: string;
  reservationCode: string;
  guestName: string;
  phone: string;
  email: string;
  guestsCount: number;
  date: string;
  timeSlot: string;
  seatingArea: 'indoor_dining' | 'woodfired_patio' | 'chef_counter';
  occasion?: string;
  specialRequests?: string;
  tableAssigned: string;
  status: 'confirmed' | 'seated' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface CustomerReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  dishName: string;
  comment: string;
  verifiedBuyer: boolean;
}
