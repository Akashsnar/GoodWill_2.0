import { createSlice } from "@reduxjs/toolkit";

// const name = JSON.parse(localStorage.getItem("name"));
// const email = JSON.parse(localStorage.getItem("email"));


const initialState = {
  cartitems: [],
};

const cartSlice = createSlice({
  name: "cartitems",
  initialState,
  reducers: {
    addCartItems: (state, action) => {
      state.cartitems.push(action.payload);
    },
    deleteCartItems: (state, action) => {
      state.cartitems = state.cartitems.filter((item) => {
        return item.id !== action.payload;
      });
    },
  },
});

export const {
    addCartItems,
    deleteCartItems,
} = cartSlice.actions;

// export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
// export const selectName = (state) => state.auth.name;
// export const selectEmail = (state) => state.auth.email;
export default cartSlice.reducer;
