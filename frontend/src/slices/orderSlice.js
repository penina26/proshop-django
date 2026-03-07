import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ASYNC THUNK: Create Order
export const createOrder = createAsyncThunk(
    'order/createOrder',
    async (order, thunkAPI) => {
        try {
            // Grab the current user's JWT token directly from the Redux store
            const { user: { userInfo } } = thunkAPI.getState();

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.access}`, // Attach the token
                },
            };

            // Send the exact payload structure the backend expects
            const { data } = await axios.post('/api/orders/add/', order, config);

            return data;
        } catch (error) {
            const message = error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// NEW ASYNC THUNK: Get Order Details
export const getOrderDetails = createAsyncThunk(
    'order/getOrderDetails',
    async (id, thunkAPI) => {
        try {
            const { user: { userInfo } } = thunkAPI.getState();

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.access}`,
                },
            };

            // Fetch the specific order by ID
            const { data } = await axios.get(`/api/orders/${id}/`, config);

            return data;
        } catch (error) {
            const message = error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// THE SLICE (Reducer)
const orderSlice = createSlice({
    name: 'order',
    initialState: {
        loading: false,
        error: null,
        success: false,
        order: {},
        // NEW: Safe default for our order details page so it doesn't crash on load
        orderDetails: { orderItems: [], shippingAddress: {} },
    },
    reducers: {
        // We will call this right after a successful order so the user can place another one later
        orderCreateReset: (state) => {
            state.order = {};
            state.success = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // --- Create Order Cases ---
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.order = action.payload;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // --- NEW: Get Order Details Cases ---
            .addCase(getOrderDetails.pending, (state) => {
                state.loading = true; // Shows the spinner while fetching
                state.error = null;
            })
            .addCase(getOrderDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.orderDetails = action.payload; // Saves the fetched data!
            })
            .addCase(getOrderDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Shows the red error box if it fails
            });
    },
});

export const { orderCreateReset } = orderSlice.actions;
export default orderSlice.reducer;