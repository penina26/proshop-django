import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async ({ id, qty }, thunkAPI) => {
        try {
            // Fetch the product data from Django
            const { data } = await axios.get(`/api/products/${id}`);

            return {
                _id: data._id,
                name: data.name,
                image: data.image,
                price: Number(data.price),
                countInStock: data.countInStock,
                qty: Number(qty),
            };
        } catch (error) {
            // Extract the custom error message if the fetch fails
            const message = error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartItems: localStorage.getItem('cartItems')
            ? JSON.parse(localStorage.getItem('cartItems'))
            : [],
        // NEW: Load the shipping address from local storage if it exists
        shippingAddress: localStorage.getItem('shippingAddress')
            ? JSON.parse(localStorage.getItem('shippingAddress'))
            : {},
        // NEW: Load the payment method from local storage
        paymentMethod: localStorage.getItem('paymentMethod')
            ? JSON.parse(localStorage.getItem('paymentMethod'))
            : '',
        error: null,
    },
    reducers: {
        removeFromCart: (state, action) => {
            // Filter based on _id
            state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        // NEW: Reducer to save the shipping address
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
            localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
        },
        // NEW: Reducer to save the payment method
        savePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload;
            localStorage.setItem('paymentMethod', JSON.stringify(action.payload));
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addToCart.fulfilled, (state, action) => {
                const item = action.payload;
                const existItem = state.cartItems.find((x) => x._id === item._id);

                if (existItem) {
                    state.cartItems = state.cartItems.map((x) =>
                        x._id === existItem._id ? item : x
                    );
                } else {
                    state.cartItems.push(item);
                }
                localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
            })

            .addCase(addToCart.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});


export const { removeFromCart, saveShippingAddress, savePaymentMethod } = cartSlice.actions;
export default cartSlice.reducer;