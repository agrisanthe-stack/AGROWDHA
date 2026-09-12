import { 
  createContext, 
  useContext, 
  ReactNode, 
  useEffect, 
  useState,
  createElement, 
  PropsWithChildren
} from "react";
import { Product, CartItem } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product & { b2bOrder?: boolean; b2bSlabApplied?: any }, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | null>(null);

const getCartItemId = (productId: number, isB2B: boolean) => {
  return isB2B ? `${productId}-b2b` : `${productId}-retail`;
};

export const CartProvider = ({ children }: PropsWithChildren<{}>) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        const parsed = JSON.parse(storedCart);
        const migrated = parsed.map((item: any) => ({
          ...item,
          cartItemId: item.cartItemId || getCartItemId(item.id, !!item.b2bOrder),
        }));
        setCartItems(migrated);
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
        setCartItems([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product & { b2bOrder?: boolean; b2bSlabApplied?: any }, quantity = 1) => {
    const isB2B = !!(product as any).b2bOrder;
    const cartItemId = getCartItemId(product.id, isB2B);
    
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.cartItemId === cartItemId);
      
      if (existingItem) {
        if (isB2B) {
          toast({
            title: "Wholesale cart updated",
            description: `Updated ${product.name} wholesale order to ${quantity} ${product.unit}`,
            duration: 3000,
          });
          return prevItems.map((item) =>
            item.cartItemId === cartItemId
              ? { ...item, quantity, price: product.price, b2bSlabApplied: product.b2bSlabApplied }
              : item
          );
        } else {
          toast({
            title: "Cart updated",
            description: `Increased ${product.name} quantity to ${existingItem.quantity + quantity}`,
            duration: 3000,
          });
          return prevItems.map((item) =>
            item.cartItemId === cartItemId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
      } else {
        toast({
          title: isB2B ? "Wholesale added to cart" : "Added to cart",
          description: isB2B 
            ? `${quantity} ${product.unit} of ${product.name} added (wholesale)` 
            : `${product.name} has been added to your cart`,
          duration: 3000,
        });
        
        return [...prevItems, { 
          ...product, 
          quantity, 
          cartItemId,
          b2bOrder: isB2B,
          b2bSlabApplied: product.b2bSlabApplied,
        }];
      }
    });
  };

  const removeFromCart = (cartItemId: string) => {
    const itemToRemove = cartItems.find(item => item.cartItemId === cartItemId);
    
    setCartItems((prevItems) => 
      prevItems.filter((item) => item.cartItemId !== cartItemId)
    );
    
    if (itemToRemove) {
      toast({
        title: "Removed from cart",
        description: `${itemToRemove.name} has been removed from your cart`,
        duration: 3000,
      });
    }
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    
    const itemToUpdate = cartItems.find(item => item.cartItemId === cartItemId);
    
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      )
    );
    
    if (itemToUpdate) {
      toast({
        title: "Cart updated",
        description: `${itemToUpdate.name} quantity updated to ${quantity}`,
        duration: 3000,
      });
    }
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
    
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
      duration: 3000,
    });
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice
  };

  return createElement(CartContext.Provider, { value }, children);
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
