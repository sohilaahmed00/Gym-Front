import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const decodeJWT = (token) => {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  };

  const getUserIdFromLocalStorage = () => {
    return localStorage.getItem('id') || null;
  };

  // State to hold the current user's ID, which will trigger cart reloads
  const [currentUserId, setCurrentUserId] = useState(getUserIdFromLocalStorage);

  // This function will be called by Login/Logout components to update the user ID
  const updateUserInCartContext = () => {
    setCurrentUserId(getUserIdFromLocalStorage());
  };

  // Load cart from localStorage when currentUserId changes
  const [cart, setCart] = useState(() => {
    const userId = getUserIdFromLocalStorage();
    return userId ? JSON.parse(localStorage.getItem(`cart-${userId}`) || '[]') : [];
  });

  const [coupon, setCoupon] = useState(null);

  // Effect to load cart when currentUserId changes (on login/logout)
  useEffect(() => {
    if (currentUserId) {
      const savedCart = localStorage.getItem(`cart-${currentUserId}`);
      setCart(savedCart ? JSON.parse(savedCart) : []);
    } else {
      setCart([]); // Clear cart if no user is logged in
    }
  }, [currentUserId]);

  // Effect to save cart to localStorage whenever cart or currentUserId changes
  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem(`cart-${currentUserId}`, JSON.stringify(cart));
    }
  }, [cart, currentUserId]);

  const addToCart = (product) => {
    if (!currentUserId) {
      alert('Please login to add items to cart');
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.product_ID);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.product_ID
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      } else {
        const newItem = {
          id: product.product_ID,
          name: product.product_Name,
          image: product.image_URL,
          price: parseFloat(product.price),
          quantity: product.quantity,
        };
        if (isNaN(newItem.price) || newItem.quantity <= 0) {
          console.error("Attempted to add item with invalid price or quantity:", product);
          return prevCart;
        }
        return [...prevCart, newItem];
      }
    });
  };

  const clearCart = () => {
    if (!currentUserId) return;

    setCart([]);
    setCoupon(null);
    
    localStorage.removeItem(`cart-${currentUserId}`); // Clear specific user's cart from localStorage
  };

  const updateQuantity = (productId, newQuantity) => {
    if (!currentUserId) return;

    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    if (!currentUserId) return;

    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        coupon,
        setCoupon,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        updateUserInCartContext, 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
