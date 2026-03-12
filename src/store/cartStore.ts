import { create } from 'zustand';
import { Product, PriceOption } from '../data/menu';

export interface CartItem {
  id: string;
  name: string;
  description: string;
  prices: PriceOption[];
  category: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (product) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.id === product.id);
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      const cartItem: CartItem = {
        id: product.id,
        name: product.name,
        description: product.description,
        prices: product.prices,
        category: product.category,
        quantity: 1,
      };
      return { items: [...state.items, cartItem] };
    });
  },
  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    }));
  },
  updateQuantity: (productId, quantity) => {
    set((state) => {
      if (quantity <= 0) {
        return {
          items: state.items.filter((item) => item.id !== productId),
        };
      }
      return {
        items: state.items.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        ),
      };
    });
  },
  clearCart: () => set({ items: [] }),
  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
  getSubtotal: () => {
    return get().items.reduce(
      (total, item) => total + (item.prices[0]?.price ?? 0) * item.quantity,
      0
    );
  },
}));
