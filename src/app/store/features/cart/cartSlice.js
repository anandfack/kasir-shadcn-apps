import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existing = state.items.find((i) => i.id === item.id);

      state.totalQuantity += action.payload.quantity;
      state.totalPrice += action.payload.price * action.payload.quantity;

      if (!existing) {
        state.items.push({
          ...item,
          quantity: action.payload.quantity,
        });
      } else {
        existing.quantity += action.payload.quantity;
      }
    },
    removeFormCart: (state, action) => {
      const item = action.payload;
      const existing = state.items.find((i) => i.id === item.id);

      if (!existing) return;

      state.totalQuantity--;
      state.totalPrice -= existing.price;

      if (existing.quantity === 1) {
        state.items = state.items.filter((i) => i.id !== id);
      } else {
        existing.quantity--;
      }
    },
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
