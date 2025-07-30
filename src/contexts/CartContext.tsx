import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  ReactNode,
} from "react";
import { Product } from "@/data/products";
// --- 1. Types and Interfaces ---

// Assuming Product interface is defined elsewhere (e.g., imported from '@/data/products')
// If not, define it here or import it.

// Interface for items stored in the cart
export interface CartItem extends Product {
  quantity: number;
  pricePerUnit: number; // The actual price used for this item when added
}

// Interface for the cart state
interface CartState {
  items: CartItem[];
}

// Interface for the context value
interface CartContextProps {
  state: CartState;
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  totalPrice: number;
  itemCount: number;
}

// --- 2. Helper Function for Price Parsing ---

/**
 * Parses a price string (e.g., "250 ج.م", "$19.99") into a number.
 * Handles potential currency symbols and non-numeric characters.
 * @param priceString - The price string to parse.
 * @returns The parsed price as a number, or 0 if parsing fails.
 */
const parsePrice = (priceString: string | undefined): number => {
  if (!priceString) {
    return 0;
  }
  // Remove common currency symbols, spaces, and commas. Keep the decimal point.
  // Adjust regex as needed for specific currency formats.
  const numericString = priceString.replace(/[^0-9.]/g, "");
  const price = parseFloat(numericString);
  return isNaN(price) ? 0 : price;
};

/**
 * Determines the effective price for a product (sale price or original price).
 * @param product - The product object.
 * @returns The effective price as a number.
 */
const getEffectivePrice = (product: Product): number => {
  if (product.onSale && product.salePrice) {
    const salePriceNum = parsePrice(product.salePrice);
    if (salePriceNum > 0) {
      return salePriceNum;
    }
  }
  return parsePrice(product.price);
};

// --- 3. Reducer Logic ---

type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Product; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { productId: string } }
  | {
      type: "UPDATE_QUANTITY";
      payload: { productId: string; quantity: number };
    }
  | { type: "CLEAR_CART" };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === product.id
      );
      const pricePerUnit = getEffectivePrice(product); // Get the correct price NOW

      if (pricePerUnit <= 0) {
        console.error(
          `Invalid price for product ${product.name}. Item not added.`
        );
        return state; // Don't add items with invalid price
      }

      if (existingItemIndex > -1) {
        // Product already in cart, update quantity
        const updatedItems = [...state.items];
        const existingItem = updatedItems[existingItemIndex];
        existingItem.quantity += quantity;
        // Keep the original pricePerUnit from when it was first added
        // Or uncomment below to update price if it changes while in cart (less common)
        // existingItem.pricePerUnit = pricePerUnit;
        return { ...state, items: updatedItems };
      } else {
        // Product not in cart, add as new item
        const newItem: CartItem = {
          ...product,
          quantity: quantity,
          pricePerUnit: pricePerUnit, // Store the calculated price
        };
        return { ...state, items: [...state.items, newItem] };
      }
    }

    case "REMOVE_ITEM": {
      const { productId } = action.payload;
      return {
        ...state,
        items: state.items.filter((item) => item.id !== productId),
      };
    }

    case "UPDATE_QUANTITY": {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        // If quantity is zero or less, remove the item
        return {
          ...state,
          items: state.items.filter((item) => item.id !== productId),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === productId ? { ...item, quantity: quantity } : item
        ),
      };
    }

    case "CLEAR_CART":
      return { items: [] };

    default:
      return state;
  }
};

// --- 4. Context Definition ---

const CartContext = createContext<CartContextProps | undefined>(undefined);

// --- 5. Context Provider Component ---

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const initialState: CartState = { items: [] };
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Actions mapped to dispatch
  const addItem = (product: Product, quantity: number) => {
    dispatch({ type: "ADD_ITEM", payload: { product, quantity } });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { productId } });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const getItemQuantity = (productId: string): number => {
    const item = state.items.find((i) => i.id === productId);
    return item ? item.quantity : 0;
  };

  // Calculate total price and item count using useMemo for optimization
  const { totalPrice, itemCount } = useMemo(() => {
    let total = 0;
    let count = 0;
    state.items.forEach((item) => {
      total += item.pricePerUnit * item.quantity; // Use stored pricePerUnit
      count += item.quantity;
    });
    return { totalPrice: total, itemCount: count };
  }, [state.items]);

  const contextValue: CartContextProps = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
    totalPrice,
    itemCount,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

// --- 6. Custom Hook for Consuming Context ---

export const useCart = (): CartContextProps => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
