import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    blogs: []
};
    // title: "",
    // author: "",
    // description: "",
    // category: "",
    // image: "",
    // id

const blogDataSlice = createSlice({
    name: "blogs",
    initialState,
    reducers: {
        addBlog: (state, action) => {
            state.blogs.push(action.payload);
        },
        deleteBlog: (state, action) => {
            state.blogs = state.blogs.filter((item) => { return item.id != action.payload })
        },
    }
});


export const { addBlog, deleteBlog } = blogDataSlice.actions;

export default blogDataSlice.reducer;