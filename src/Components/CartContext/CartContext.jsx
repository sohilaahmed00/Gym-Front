import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Load cart from localStorage on initial load
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [coupon, setCoupon] = useState(null); // ⬅️ أضفنا الكوبون هنا

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
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
    setCart([]);
    setCoupon(null); // ⬅️ نمسح الكوبون كمان عند تفريغ السلة
    localStorage.removeItem('cart'); // Clear cart from localStorage
  };

  const updateQuantity = (productId, newQuantity) => {
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
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        coupon,         // ⬅️ نبعته هنا
        setCoupon,      // ⬅️ وده كمان
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
