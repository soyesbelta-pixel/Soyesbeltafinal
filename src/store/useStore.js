import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      // Carrito
      cart: [],

      addToCart: (product) => {
        const cart = get().cart;
        const existingItem = cart.find(item => item.id === product.id && item.size === product.size);
        
        if (existingItem) {
          set({
            cart: cart.map(item =>
              item.id === product.id && item.size === product.size
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          });
        } else {
          set({ cart: [...cart, { ...product, quantity: 1 }] });
        }
        
        // Trigger celebración
        window.dispatchEvent(new CustomEvent('cartSuccess'));
      },
      
      removeFromCart: (productId, size) => {
        set({
          cart: get().cart.filter(item => !(item.id === productId && item.size === size))
        });
      },
      
      updateQuantity: (productId, size, quantity) => {
        if (quantity === 0) {
          get().removeFromCart(productId, size);
        } else {
          set({
            cart: get().cart.map(item =>
              item.id === productId && item.size === size
                ? { ...item, quantity }
                : item
            )
          });
        }
      },
      
      clearCart: () => set({ cart: [] }),
      
      getCartTotal: () => {
        return get().cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      
      getCartCount: () => {
        return get().cart.reduce((total, item) => total + item.quantity, 0);
      },
      
      // Favoritos
      favorites: [],
      toggleFavorite: (productId) => {
        const favorites = get().favorites;
        if (favorites.includes(productId)) {
          set({ favorites: favorites.filter(id => id !== productId) });
        } else {
          set({ favorites: [...favorites, productId] });
        }
      },
      
      // Usuario
      user: null,
      setUser: (user) => set({ user }),
      
      // Notificaciones
      notifications: [],
      addNotification: (notification) => {
        const id = Date.now();
        set({
          notifications: [...get().notifications, { ...notification, id }]
        });

        // Auto-remove después de 5 segundos
        setTimeout(() => {
          set({
            notifications: get().notifications.filter(n => n.id !== id)
          });
        }, 5000);
      },

      // Chat Bot State
      chatMessages: [],
      chatIsOpen: false,
      chatIsTyping: false,

      setChatOpen: (isOpen) => set({ chatIsOpen: isOpen }),
      setChatTyping: (isTyping) => set({ chatIsTyping: isTyping }),

      // Virtual Try-On State
      showVirtualTryOn: false,
      setShowVirtualTryOn: (show) => set({ showVirtualTryOn: show }),

      // Product Detail Modal State
      productModalOpen: false,
      setProductModalOpen: (isOpen) => set({ productModalOpen: isOpen }),

      // Category Selection
      selectedCategory: 'todos',
      setSelectedCategory: (category) => set({ selectedCategory: category }),

      // Open Product Modal - Persisted
      openProductId: null,
      setOpenProductId: (id) => set({ openProductId: id }),

      // Email Capture
      capturedEmails: [],
      addCapturedEmail: (email) => {
        const emails = get().capturedEmails;
        if (!emails.includes(email)) {
          set({ capturedEmails: [...emails, email] });
        }
      },

      addChatMessage: (message) => {
        set({
          chatMessages: [...get().chatMessages, {
            ...message,
            id: message.id || Date.now(),
            timestamp: message.timestamp || new Date().toISOString()
          }]
        });
      },

      clearChatMessages: () => set({ chatMessages: [] }),

      getChatContext: () => {
        return {
          cartItems: get().cart,
          favorites: get().favorites,
          user: get().user,
          messagesCount: get().chatMessages.length
        };
      },
    }),
    {
      name: 'silueta-dorada-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cart: state.cart,
        favorites: state.favorites,
        user: state.user,
        capturedEmails: state.capturedEmails,
        chatMessages: state.chatMessages,
        chatIsOpen: state.chatIsOpen,
        openProductId: state.openProductId,
        // Excluir notifications para que no se persistan
      }),
    }
  )
);

export default useStore;