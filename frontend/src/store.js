import { configureStore } from '@reduxjs/toolkit'
import productReducer from './slices/productSlice'
import cartReducer from './slices/cartSlice'
import userReducer from './slices/userSlice';
import orderReducer from './slices/orderSlice';

const store = configureStore({
    reducer: {

        productList: productReducer,
        cart: cartReducer,
        user: userReducer,
        order: orderReducer,

    },
})

export default store