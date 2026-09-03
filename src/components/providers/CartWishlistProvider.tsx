"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

export interface CartItem {
  id: number;
  title: string;
  hindiTitle?: string;
  subtitle?: string;
  author?: string;
  category?: string;
  price: number;
  originalPrice?: number;
  image?: string;
  edition?: string;
  quantity: number;
  coverType?: string;
}

export interface WishlistItem {
  id: number;
  title: string;
  hindiTitle?: string;
  subtitle?: string;
  author?: string;
  category?: string;
  price: number;
  originalPrice?: number;
  image?: string;
  edition?: string;
  rating?: number;
  reviewsCount?: number;
  coverType?: string;
}

export interface ToastData {
  id: string;
  type: "cart" | "wishlist" | "info";
  title: string;
  message: string;
  image?: string;
  price?: number;
}

interface CartWishlistContextType {
  cart: CartItem[];
  wishlist: WishlistItem[];
  cartCount: number;
  wishlistCount: number;
  cartTotal: number;
  cartOriginalTotal: number;
  cartSavings: number;
  freeDeliveryThreshold: number;
  addToCart: (
    item: {
      id: number;
      title: string;
      hindiTitle?: string;
      subtitle?: string;
      author?: string;
      category?: string;
      price: number;
      originalPrice?: number;
      image?: string;
      edition?: string;
      coverType?: string;
    },
    quantity?: number,
    openDrawer?: boolean
  ) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, delta: number) => void;
  setQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  clearWishlist: () => void;
  clearAll: () => void;
  isInCart: (id: number) => boolean;
  getCartQuantity: (id: number) => number;
  toggleWishlist: (item: {
    id: number;
    title: string;
    hindiTitle?: string;
    subtitle?: string;
    author?: string;
    category?: string;
    price: number;
    originalPrice?: number;
    image?: string;
    edition?: string;
    rating?: number;
    reviewsCount?: number;
    coverType?: string;
  }) => void;
  isInWishlist: (id: number) => boolean;
  removeFromWishlist: (id: number) => void;
  moveToCart: (id: number) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isWishlistDrawerOpen: boolean;
  setIsWishlistDrawerOpen: (open: boolean) => void;
  toast: ToastData | null;
  hideToast: () => void;
}

const CartWishlistContext = createContext<CartWishlistContextType | null>(null);

const CART_STORAGE_KEY = "devanagari_cart_v2";
const WISHLIST_STORAGE_KEY = "devanagari_wishlist_v2";
const FREE_DELIVERY_THRESHOLD = 499;

// Default initial items - empty by default
const INITIAL_CART: CartItem[] = [];
const INITIAL_WISHLIST: WishlistItem[] = [];

export function CartWishlistProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<CartItem[]>(INITIAL_CART);
  const [wishlist, setWishlist] = useState<WishlistItem[]>(INITIAL_WISHLIST);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isWishlistDrawerOpen, setIsWishlistDrawerOpen] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      // Clean up legacy mock storage keys if present
      localStorage.removeItem("devanagari_cart_items");
      localStorage.removeItem("devanagari_wishlist_items");

      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      
      setTimeout(() => {
        if (savedCart) {
          try {
            const parsed = JSON.parse(savedCart);
            if (Array.isArray(parsed)) {
              setCart(parsed);
            }
          } catch (e) {
            console.error("Cart parse error", e);
          }
        }
        if (savedWishlist) {
          try {
            const parsed = JSON.parse(savedWishlist);
            if (Array.isArray(parsed)) {
              setWishlist(parsed);
            }
          } catch (e) {
            console.error("Wishlist parse error", e);
          }
        }
        setIsLoaded(true);
      }, 0);
    } catch (e) {
      console.warn("Could not load cart/wishlist from localStorage:", e);
      setTimeout(() => setIsLoaded(true), 0);
    }
  }, []);

  // Save Cart to LocalStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn("Could not save cart to localStorage:", e);
    }
  }, [cart, isLoaded]);

  // Save Wishlist to LocalStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.warn("Could not save wishlist to localStorage:", e);
    }
  }, [wishlist, isLoaded]);

  const showToast = useCallback(
    (data: Omit<ToastData, "id">) => {
      const id = `${Date.now()}-${Math.random()}`;
      setToast({ ...data, id });
    },
    []
  );

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  // Auto-dismiss toast after 3.5s
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  // Total items in cart (sum of quantities)
  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  }, [cart]);

  // Wishlist count
  const wishlistCount = useMemo(() => {
    return wishlist.length;
  }, [wishlist]);

  // Total price calculation
  const cartTotal = useMemo(() => {
    return cart.reduce(
      (total, item) => total + item.price * (item.quantity || 1),
      0
    );
  }, [cart]);

  const cartOriginalTotal = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total + (item.originalPrice || item.price) * (item.quantity || 1),
      0
    );
  }, [cart]);

  const cartSavings = useMemo(() => {
    return Math.max(0, cartOriginalTotal - cartTotal);
  }, [cartOriginalTotal, cartTotal]);

  const isInCart = useCallback(
    (id: number) => {
      return cart.some((item) => item.id === id);
    },
    [cart]
  );

  const getCartQuantity = useCallback(
    (id: number) => {
      const item = cart.find((item) => item.id === id);
      return item ? item.quantity : 0;
    },
    [cart]
  );

  const addToCart = useCallback(
    (
      item: {
        id: number;
        title: string;
        hindiTitle?: string;
        subtitle?: string;
        author?: string;
        category?: string;
        price: number;
        originalPrice?: number;
        image?: string;
        edition?: string;
        coverType?: string;
      },
      quantity: number = 1,
      openDrawer: boolean = false
    ) => {
      setCart((prev) => {
        const existingIndex = prev.findIndex((p) => p.id === item.id);
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
          };
          return updated;
        } else {
          return [
            ...prev,
            {
              id: item.id,
              title: item.title,
              hindiTitle: item.hindiTitle,
              subtitle: item.subtitle,
              author: item.author,
              category: item.category,
              price: item.price,
              originalPrice: item.originalPrice || item.price,
              image: item.image || "/images/books/image-2.png",
              edition: item.edition,
              quantity: Math.max(1, quantity),
              coverType: item.coverType,
            },
          ];
        }
      });

      showToast({
        type: "cart",
        title: "Added to Cart!",
        message: item.title,
        image: item.image,
        price: item.price,
      });

      if (openDrawer) {
        setIsCartDrawerOpen(true);
      }
    },
    [showToast]
  );

  const removeFromCart = useCallback(
    (id: number) => {
      setCart((prev) => {
        const item = prev.find((i) => i.id === id);
        if (item) {
          showToast({
            type: "info",
            title: "Removed from Cart",
            message: item.title,
          });
        }
        return prev.filter((i) => i.id !== id);
      });
    },
    [showToast]
  );

  const updateQuantity = useCallback(
    (id: number, delta: number) => {
      setCart((prev) => {
        return prev
          .map((item) => {
            if (item.id === id) {
              const newQty = item.quantity + delta;
              return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
          })
          .filter(Boolean) as CartItem[];
      });
    },
    []
  );

  const setQuantity = useCallback(
    (id: number, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(id);
        return;
      }
      setCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    showToast({
      type: "info",
      title: "Cart Cleared",
      message: "All items removed from your cart.",
    });
  }, [showToast]);

  const clearWishlist = useCallback(() => {
    setWishlist([]);
    showToast({
      type: "info",
      title: "Wishlist Cleared",
      message: "All items removed from your wishlist.",
    });
  }, [showToast]);

  const clearAll = useCallback(() => {
    setCart([]);
    setWishlist([]);
    showToast({
      type: "info",
      title: "Cart & Wishlist Cleared",
      message: "All items removed.",
    });
  }, [showToast]);

  const isInWishlist = useCallback(
    (id: number) => {
      return wishlist.some((item) => item.id === id);
    },
    [wishlist]
  );

  const toggleWishlist = useCallback(
    (item: {
      id: number;
      title: string;
      hindiTitle?: string;
      subtitle?: string;
      author?: string;
      category?: string;
      price: number;
      originalPrice?: number;
      image?: string;
      edition?: string;
      rating?: number;
      reviewsCount?: number;
      coverType?: string;
    }) => {
      setWishlist((prev) => {
        const exists = prev.some((w) => w.id === item.id);
        if (exists) {
          showToast({
            type: "info",
            title: "Removed from Wishlist",
            message: item.title,
          });
          return prev.filter((w) => w.id !== item.id);
        } else {
          showToast({
            type: "wishlist",
            title: "Saved to Wishlist! ❤️",
            message: item.title,
            image: item.image,
            price: item.price,
          });
          return [
            ...prev,
            {
              id: item.id,
              title: item.title,
              hindiTitle: item.hindiTitle,
              subtitle: item.subtitle,
              author: item.author,
              category: item.category,
              price: item.price,
              originalPrice: item.originalPrice || item.price,
              image: item.image || "/images/books/image-2.png",
              edition: item.edition,
              rating: item.rating,
              reviewsCount: item.reviewsCount,
              coverType: item.coverType,
            },
          ];
        }
      });
    },
    [showToast]
  );

  const removeFromWishlist = useCallback(
    (id: number) => {
      setWishlist((prev) => {
        const item = prev.find((i) => i.id === id);
        if (item) {
          showToast({
            type: "info",
            title: "Removed from Wishlist",
            message: item.title,
          });
        }
        return prev.filter((i) => i.id !== id);
      });
    },
    [showToast]
  );

  const moveToCart = useCallback(
    (id: number) => {
      const item = wishlist.find((w) => w.id === id);
      if (item) {
        addToCart(item, 1, false);
        removeFromWishlist(id);
      }
    },
    [wishlist, addToCart, removeFromWishlist]
  );

  const contextValue = useMemo(
    () => ({
      cart,
      wishlist,
      cartCount,
      wishlistCount,
      cartTotal,
      cartOriginalTotal,
      cartSavings,
      freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
      addToCart,
      removeFromCart,
      updateQuantity,
      setQuantity,
      clearCart,
      clearWishlist,
      clearAll,
      isInCart,
      getCartQuantity,
      toggleWishlist,
      isInWishlist,
      removeFromWishlist,
      moveToCart,
      isCartDrawerOpen,
      setIsCartDrawerOpen,
      isWishlistDrawerOpen,
      setIsWishlistDrawerOpen,
      toast,
      hideToast,
    }),
    [
      cart,
      wishlist,
      cartCount,
      wishlistCount,
      cartTotal,
      cartOriginalTotal,
      cartSavings,
      addToCart,
      removeFromCart,
      updateQuantity,
      setQuantity,
      clearCart,
      clearWishlist,
      clearAll,
      isInCart,
      getCartQuantity,
      toggleWishlist,
      isInWishlist,
      removeFromWishlist,
      moveToCart,
      isCartDrawerOpen,
      isWishlistDrawerOpen,
      toast,
      hideToast,
    ]
  );

  return (
    <CartWishlistContext.Provider value={contextValue}>
      {children}
    </CartWishlistContext.Provider>
  );
}

export function useCartWishlist() {
  const context = useContext(CartWishlistContext);
  if (!context) {
    throw new Error(
      "useCartWishlist must be used within a CartWishlistProvider"
    );
  }
  return context;
}
