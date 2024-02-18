import {createSlice} from '@reduxjs/toolkit'

// const name = JSON.parse(localStorage.getItem("name"));

// var name="";
// var email="";
// if(localStorage.getItem("name")===undefined)
// {
//     name = JSON.parse(localStorage.getItem("name"));
// }
// if(localStorage.getItem("email")===undefined)
// {
//     email = JSON.parse(localStorage.getItem("email"));
// }
// // const name = "ram"
const initialState = {
    isLoggedIn:false,
    name: "",
    email:"",
    blogs: [] 
}

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        SET_LOGIN_USER(state,action){
            state.isLoggedIn = action.payload
            // console.log(state.isLoggedIn)
        },
        SET_NAME(state,action){
            // localStorage.setItem("name",JSON.stringify(action.payload))
            state.name = action.payload
        //    console.log(action.payload)
        //    console.log(state.name)
        },
        SAVE_USER(state,action)
        {
            // localStorage.setItem("email",JSON.stringify(action.payload))
           state.email = action.payload;
        },
        addBlog: (state, action) => {
            state.blogs.push(action.payload);
        },
        deleteBlog: (state, action) => {
            state.blogs = state.blogs.filter((item) => { return item.id != action.payload })
        },
    },   
})

export const{SET_LOGIN_USER,SET_NAME,SAVE_USER,addBlog,deleteBlog} = authSlice.actions;


export default authSlice.reducer;