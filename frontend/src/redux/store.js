import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../redux/features/auth/authSlice';
import cartReducer from '../redux/features/auth/cartSlice';

const store = configureStore({
    reducer:{
        auth : authReducer,
        cart: cartReducer
    },
});

export default store;