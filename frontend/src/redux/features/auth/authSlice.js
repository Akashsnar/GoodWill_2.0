import { createSlice } from "@reduxjs/toolkit";

const name = JSON.parse(localStorage.getItem("name"));
const email = JSON.parse(localStorage.getItem("email"));

const initialState = {
  isLoggedIn: false,
  name: name ? name : "dfg",
  email: email ? email : "dfg@dsfd",
  mode: "user",
  blogs: [],
};  

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    SET_LOGIN_USER(state, action) {
      console.log(action.payload);
      state.isLoggedIn = action.payload;
    },
    SET_LOGOUT_USER(state, action) {
      state.isLoggedIn = action.payload;
    },
    SET_NAME(state, action) {
      console.log("User name in local storage", state, action);
      localStorage.setItem("name", JSON.stringify(action.payload));
      state.name = action.payload;
      console.log(state.name);
    },
    SET_USERID(state, action) {
      localStorage.setItem("userid", JSON.stringify(action.payload));
      state.userid = action.payload;
      console.log(state.userid);
    },
    SAVE_USER(state, action) {
      localStorage.setItem("email", JSON.stringify(action.payload));
      state.email = action.payload;
      console.log(state.email);
    },
    SAVE_MODE(state, action) {
      localStorage.setItem("mode", JSON.stringify(action.payload));
      state.mode = action.payload;
      console.log(state.mode);
    },
    addBlog: (state, action) => {
      state.blogs.push(action.payload);
    },
    deleteBlog: (state, action) => {
      state.blogs = state.blogs.filter((item) => {
        return item.id !== action.payload;
      });
    },
  },
});

export const {
  SET_LOGIN_USER,
  SET_LOGOUT_USER,
  SET_NAME,
  SET_USERID,
  SAVE_USER,
  SAVE_MODE,
  addBlog,
  deleteBlog,
} = authSlice.actions;

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectName = (state) => state.auth.name;
export const selectEmail = (state) => state.auth.email;
export default authSlice.reducer;
