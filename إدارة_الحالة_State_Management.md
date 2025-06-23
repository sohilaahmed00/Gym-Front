# إدارة الحالة (State Management) في نظام إدارة الصالة الرياضية

## نظرة عامة

يستخدم النظام عدة تقنيات لإدارة الحالة بشكل فعال، بما في ذلك React Hooks (useState, useEffect)، Context API، و localStorage للحفظ المحلي.

## 1. استخدام useState لإدارة الحالة المحلية

### مثال 1: إدارة حالة المنتجات والفلترة

```javascript
// src/Components/Products/Products.jsx
export default function OnlineStore() {
  // إدارة حالة المنتجات
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // إدارة حالة عرض الفلاتر
  const [showFilters, setShowFilters] = useState(false);
  
  // إدارة حالة الفلاتر
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    searchTerm: ''
  });

  // تحديث الفلاتر
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // تبديل عرض الفلاتر
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
}
```

**الوظائف:**
- `products`: تخزين قائمة المنتجات
- `loading`: إدارة حالة التحميل
- `showFilters`: التحكم في إظهار/إخفاء الفلاتر
- `filters`: تخزين قيم الفلاتر المطبقة

### مثال 2: إدارة حالة المحادثة في ChatBot

```javascript
// src/UserProfile/pages/ChatBot.jsx
const ChatBot = () => {
  // إدارة رسائل المحادثة
  const [messages, setMessages] = useState([]);
  
  // إدارة النص المدخل
  const [input, setInput] = useState('');
  
  // إدارة حالة التحميل
  const [loading, setLoading] = useState(false);
  
  // إدارة بيانات السياق
  const [contextData, setContextData] = useState(null);

  // إضافة رسالة جديدة
  const handleSend = async (customInput = null) => {
    const text = customInput ?? input;
    if (!text.trim() || !contextData) return;

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    
    // ... باقي المنطق
  };
};
```

## 2. استخدام useEffect للتفاعل مع التغييرات

### مثال 1: تحميل البيانات عند تحميل المكون

```javascript
// تحميل المنتجات عند تحميل المكون
useEffect(() => {
  fetch('http://gymmatehealth.runasp.net/api/Products/GetAllProducts')
    .then((res) => res.json())
    .then((data) => {
      setProducts(data);
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching products:', error);
      setLoading(false);
    });
}, []); // مصفوفة فارغة = تشغيل مرة واحدة فقط
```

### مثال 2: حفظ البيانات في localStorage عند التغيير

```javascript
// حفظ رسائل المحادثة في localStorage
useEffect(() => {
  if (userId && messages.length) {
    localStorage.setItem(`chatHistory_${userId}`, JSON.stringify(messages));
  }
}, [messages, userId]); // تشغيل عند تغيير messages أو userId
```

### مثال 3: تحميل البيانات من localStorage عند تغيير المستخدم

```javascript
// تحميل رسائل المحادثة المحفوظة
useEffect(() => {
  const saved = localStorage.getItem(`chatHistory_${userId}`);
  if (saved) setMessages(JSON.parse(saved));
}, [userId]); // تشغيل عند تغيير userId
```

## 3. استخدام Context API لإدارة الحالة العامة

### مثال: CartContext لإدارة سلة التسوق

```javascript
// src/Components/CartContext/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // الحصول على معرف المستخدم من localStorage
  const getUserIdFromLocalStorage = () => {
    return localStorage.getItem('id') || null;
  };

  // حالة معرف المستخدم الحالي
  const [currentUserId, setCurrentUserId] = useState(getUserIdFromLocalStorage);

  // حالة سلة التسوق
  const [cart, setCart] = useState(() => {
    const userId = getUserIdFromLocalStorage();
    return userId ? JSON.parse(localStorage.getItem(`cart-${userId}`) || '[]') : [];
  });

  // حالة الكوبون
  const [coupon, setCoupon] = useState(null);

  // تحميل سلة التسوق عند تغيير المستخدم
  useEffect(() => {
    if (currentUserId) {
      const savedCart = localStorage.getItem(`cart-${currentUserId}`);
      setCart(savedCart ? JSON.parse(savedCart) : []);
    } else {
      setCart([]); // مسح السلة إذا لم يكن هناك مستخدم
    }
  }, [currentUserId]);

  // حفظ سلة التسوق في localStorage
  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem(`cart-${currentUserId}`, JSON.stringify(cart));
    }
  }, [cart, currentUserId]);

  // إضافة منتج إلى السلة
  const addToCart = (product) => {
    if (!currentUserId) {
      alert('Please login to add items to cart');
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.product_ID);
      if (existingItem) {
        // تحديث الكمية إذا كان المنتج موجود
        return prevCart.map((item) =>
          item.id === product.product_ID
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      } else {
        // إضافة منتج جديد
        const newItem = {
          id: product.product_ID,
          name: product.product_Name,
          image: product.image_URL,
          price: parseFloat(product.price),
          quantity: product.quantity,
        };
        return [...prevCart, newItem];
      }
    });
  };

  // تحديث كمية المنتج
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

  // إزالة منتج من السلة
  const removeFromCart = (productId) => {
    if (!currentUserId) return;
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // مسح السلة بالكامل
  const clearCart = () => {
    if (!currentUserId) return;
    setCart([]);
    setCoupon(null);
    localStorage.removeItem(`cart-${currentUserId}`);
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

// Hook مخصص لاستخدام Context
export const useCart = () => useContext(CartContext);
```

### استخدام CartContext في المكونات

```javascript
// في مكون المنتجات
import { useCart } from '../CartContext/CartContext';

export default function OnlineStore() {
  const { cart, addToCart } = useCart();

  // التحقق من وجود المنتج في السلة
  const isInCart = (productId) => cart.some((item) => item.id === productId);

  // إضافة منتج إلى السلة
  const handleAddToCart = (product) => {
    if (!isNaN(product.price) && product.price > 0) {
      addToCart({ ...product, quantity: 1 });
    }
  };
}
```

## 4. استخدام localStorage للحفظ المحلي

### مثال 1: حفظ بيانات المستخدم

```javascript
// src/Components/Auth/login/Login.jsx
const handleLoginSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const response = await fetch('http://gymmatehealth.runasp.net/Auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();

    if (response.ok) {
      // حفظ بيانات المستخدم في localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('id', data.id);
      localStorage.setItem('fullName', data.fullName);
      
      // تحديث Context
      updateUserInCartContext();
    }
  } catch (error) {
    // معالجة الأخطاء
  }
};
```

### مثال 2: حفظ سجل المحادثة

```javascript
// حفظ رسائل المحادثة لكل مستخدم
useEffect(() => {
  if (userId && messages.length) {
    localStorage.setItem(`chatHistory_${userId}`, JSON.stringify(messages));
  }
}, [messages, userId]);

// تحميل رسائل المحادثة المحفوظة
useEffect(() => {
  const saved = localStorage.getItem(`chatHistory_${userId}`);
  if (saved) setMessages(JSON.parse(saved));
}, [userId]);
```

### مثال 3: حفظ الأنشطة الأخيرة

```javascript
// src/admin/Admin.jsx
const [recentActivities, setRecentActivities] = useState([
  { id: 1, desc: 'New subscription added', date: '2024-06-01' },
  { id: 2, desc: 'New coach reviewed', date: '2024-05-30' },
  // ...
]);

// تحميل الأنشطة المحفوظة
useEffect(() => {
  const stored = localStorage.getItem('recentActivities');
  if (stored) {
    try {
      setRecentActivities(JSON.parse(stored));
    } catch {}
  }
}, []);
```

## 5. إدارة حالة التحميل والأخطاء

### مثال شامل لإدارة حالة التحميل

```javascript
// src/admin/ManageProducts.jsx
export default function ManageProducts() {
  // حالات مختلفة
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // تحميل المنتجات
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://gymmatehealth.runasp.net/api/Products/GetAllProducts');
        if (!response.ok) {
          throw new Error('فشل في جلب المنتجات');
        }
        
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // عرض الحالات المختلفة
  if (loading) {
    return <div className="text-center p-5"><div className="spinner-border text-primary" role="status"></div></div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      {/* عرض المنتجات */}
    </div>
  );
}
```

## 6. أفضل الممارسات المستخدمة

### 1. استخدام Functional Updates
```javascript
// بدلاً من
setCart([...cart, newItem]);

// استخدم
setCart(prevCart => [...prevCart, newItem]);
```

### 2. التحقق من صحة البيانات
```javascript
const addToCart = (product) => {
  if (!currentUserId) {
    alert('Please login to add items to cart');
    return;
  }

  if (isNaN(newItem.price) || newItem.quantity <= 0) {
    console.error("Invalid data");
    return;
  }
  // ...
};
```

### 3. تنظيف البيانات عند تسجيل الخروج
```javascript
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('id');
  localStorage.removeItem('fullName');
  // تنظيف Context
  updateUserInCartContext();
};
```

### 4. استخدام Custom Hooks
```javascript
// Hook مخصص للتحقق من حالة تسجيل الدخول
export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('fullName');
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser({ name: userData });
    }
  }, []);

  return { isLoggedIn, user };
};
```

## 7. ملخص التقنيات المستخدمة

| التقنية | الاستخدام | المثال |
|---------|-----------|--------|
| **useState** | إدارة الحالة المحلية | المنتجات، الفلاتر، النماذج |
| **useEffect** | التفاعل مع التغييرات | تحميل البيانات، حفظ البيانات |
| **Context API** | إدارة الحالة العامة | سلة التسوق، بيانات المستخدم |
| **localStorage** | الحفظ المحلي | رسائل المحادثة، بيانات المستخدم |
| **Custom Hooks** | إعادة استخدام المنطق | useCart, useAuth |

## 8. الفوائد المحققة

1. **أداء محسن**: استخدام Context API يقلل من re-renders غير الضرورية
2. **قابلية الصيانة**: فصل منطق إدارة الحالة عن المكونات
3. **تجربة مستخدم محسنة**: حفظ البيانات المحلية يمنع فقدان البيانات
4. **قابلية التوسع**: سهولة إضافة ميزات جديدة
5. **أمان البيانات**: التحقق من صحة البيانات قبل التحديث 