import { createSlice } from "@reduxjs/toolkit";

// LocalStorage se cart uthao
const savedCart = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

const initialState = {
  userData: null,
  currentCity: null,
  currentState: null,
  currentAddress: null,
  shopsInMyCity: null,
  itemsInMyCity: null,
  cartItems: savedCart,
  myOrders: [],
  searchItems: null,
  socket: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      localStorage.setItem("userData", JSON.stringify(state.userData));
    },
    setCurrentCity: (state, action) => {
      state.currentCity = action.payload;
      localStorage.setItem("currentCity", state.currentCity);
    },
    setCurrentState: (state, action) => {
      state.currentState = action.payload;
      localStorage.setItem("currentState", state.currentState);
    },
    setCurrentAddress: (state, action) => {
      state.currentAddress = action.payload;
      localStorage.setItem("currentAddress", state.currentAddress);
    },
    setShopsInMyCity: (state, action) => {
      state.shopsInMyCity = action.payload;
    },
    setItemsInMyCity: (state, action) => {
      state.itemsInMyCity = action.payload;
    },

    // ✅ Add item to cart
    addToCart: (state, action) => {
      const cartItem = action.payload;
      const existingItem = state.cartItems.find((i) => i.id === cartItem.id);
      if (existingItem) {
        existingItem.quantity += cartItem.quantity;
      } else {
        state.cartItems.push(cartItem);
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    // ✅ Remove ek single item
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((i) => i.id !== action.payload);
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    // ✅ Poora cart clear
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
    },

    // ✅ Quantity increase / decrease
    updateQuantity: (state, action) => {
      const { id, type } = action.payload;
      const existingItem = state.cartItems.find((i) => i.id === id);
      if (existingItem) {
        if (type === "increase") {
          existingItem.quantity += 1;
        } else if (type === "decrease") {
          if (existingItem.quantity > 1) {
            existingItem.quantity -= 1;
          } else {
            // agar quantity 1 hai aur aur kam karte ho toh item hata do
            state.cartItems = state.cartItems.filter((i) => i.id !== id);
          }
        }
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    setMyOrders: (state, action) => {
      state.myOrders = action.payload;
    },
    addMyOrder: (state, action) => {
      state.myOrders = [action.payload, ...state.myOrders];
    },
    updateOrderStatus: (state, action) => {
      const { orderId, shopId, status } = action.payload;
      const order = state.myOrders.find((o) => o._id == orderId);
      if (order) {
        if (order.shopOrders && order.shopOrders.shop._id == shopId) {
          order.shopOrders.status = status;
        }
      }
    },

    updateRealTimeOrderStatus: (state, action) => {
      const { orderId, shopId, status } = action.payload;
      const order = state.myOrders.find((o) => o._id == orderId);
      if (order) {
        const shopOrder = order.shopOrders.find(
          (so) => so.shop._id == shopId
        );
        if (shopOrder) {
          shopOrder.status = status;
        }
      }
    },

    setSearchItems: (state, action) => {
      state.searchItems = action.payload;
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
  },
});

export const {
  setUserData,
  setCurrentAddress,
  setCurrentCity,
  setCurrentState,
  setShopsInMyCity,
  setItemsInMyCity,
  addToCart,
  removeFromCart,
  clearCart,
  addMyOrder,
  setMyOrders,
  updateOrderStatus,
  updateQuantity,
  setSearchItems,
  setSocket,
  updateRealTimeOrderStatus
} = userSlice.actions;

export default userSlice.reducer;
