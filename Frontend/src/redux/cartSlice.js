import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  restaurantId: null,
  items: [],
  subTotal: 0,
};

const calculateSubTotal = (items) => {
  return items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action) => {
      const item = action.payload;

      if (state.restaurantId && state.restaurantId !== item.restaurantId) {
        state.items = [];
        state.restaurantId = item.restaurantId;
      }

      if (!state.restaurantId) {
        state.restaurantId = item.restaurantId;
      }

      const existingItem = state.items.find(
        (cartItem) => cartItem.menuItemId === item.menuItemId
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          menuItemId: item.menuItemId,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: 1,
        });
      }

      state.subTotal = calculateSubTotal(state.items);
    },

    increaseQuantity: (state, action) => {
      const menuItemId = action.payload;

      const item = state.items.find(
        (cartItem) => cartItem.menuItemId === menuItemId
      );

      if (item) {
        item.quantity += 1;
      }

      state.subTotal = calculateSubTotal(state.items);
    },

    decreaseQuantity: (state, action) => {
      const menuItemId = action.payload;

      const item = state.items.find(
        (cartItem) => cartItem.menuItemId === menuItemId
      );

      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.items = state.items.filter(
          (cartItem) => cartItem.menuItemId !== menuItemId
        );
      }

      if (state.items.length === 0) {
        state.restaurantId = null;
      }

      state.subTotal = calculateSubTotal(state.items);
    },

    removeItemFromCart: (state, action) => {
      const menuItemId = action.payload;

      state.items = state.items.filter(
        (cartItem) => cartItem.menuItemId !== menuItemId
      );

      if (state.items.length === 0) {
        state.restaurantId = null;
      }

      state.subTotal = calculateSubTotal(state.items);
    },

    clearCart: (state) => {
      state.restaurantId = null;
      state.items = [];
      state.subTotal = 0;
    },
  },
});

export const {
  addItemToCart,
  increaseQuantity,
  decreaseQuantity,
  removeItemFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;