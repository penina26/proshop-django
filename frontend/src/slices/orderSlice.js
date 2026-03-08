import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ASYNC THUNK: Create Order
export const createOrder = createAsyncThunk('order/createOrder', async (order, thunkAPI) => {
    try {
        const { user: { userInfo } } = thunkAPI.getState();
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.access}` } };
        const { data } = await axios.post('/api/orders/add/', order, config);
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response && error.response.data.detail ? error.response.data.detail : error.message);
    }
});

// ASYNC THUNK: Get Order Details
export const getOrderDetails = createAsyncThunk('order/getOrderDetails', async (id, thunkAPI) => {
    try {
        const { user: { userInfo } } = thunkAPI.getState();
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.access}` } };
        const { data } = await axios.get(`/api/orders/${id}/`, config);
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response && error.response.data.detail ? error.response.data.detail : error.message);
    }
});

// ASYNC THUNK: Pay Order
export const payOrder = createAsyncThunk('order/payOrder', async ({ orderId, paymentResult }, thunkAPI) => {
    try {
        const { user: { userInfo } } = thunkAPI.getState();
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.access}` } };
        const { data } = await axios.put(`/api/orders/${orderId}/pay/`, paymentResult, config);
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response && error.response.data.detail ? error.response.data.detail : error.message);
    }
});

// ASYNC THUNK: Deliver Order (Admin Only)
export const deliverOrder = createAsyncThunk('order/deliverOrder', async (order, thunkAPI) => {
    try {
        const { user: { userInfo } } = thunkAPI.getState();
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.access}` } };
        const { data } = await axios.put(`/api/orders/${order._id}/deliver/`, {}, config);
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response && error.response.data.detail ? error.response.data.detail : error.message);
    }
});

// ASYNC THUNK: List My Orders (For the Customer Profile)
export const listMyOrders = createAsyncThunk('order/listMyOrders', async (_, thunkAPI) => {
    try {
        const { user: { userInfo } } = thunkAPI.getState();
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.access}` } };
        const { data } = await axios.get(`/api/orders/myorders/`, config);
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response && error.response.data.detail ? error.response.data.detail : error.message);
    }
});

// ASYNC THUNK: List ALL Orders (For the Admin)
export const listOrders = createAsyncThunk('order/listOrders', async (_, thunkAPI) => {
    try {
        const { user: { userInfo } } = thunkAPI.getState();
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.access}` } };
        const { data } = await axios.get(`/api/orders/`, config);
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response && error.response.data.detail ? error.response.data.detail : error.message);
    }
});

//  ASYNC THUNK: Delete Order (Admin Only)
export const deleteOrder = createAsyncThunk('order/deleteOrder', async (id, thunkAPI) => {
    try {
        const { user: { userInfo } } = thunkAPI.getState();
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.access}` } };
        const { data } = await axios.delete(`/api/orders/delete/${id}/`, config);
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response && error.response.data.detail ? error.response.data.detail : error.message);
    }
});

// THE SLICE (Reducer)
const orderSlice = createSlice({
    name: 'order',
    initialState: {
        loading: false, error: null, success: false, order: {}, orderDetails: { orderItems: [], shippingAddress: {} },
        loadingPay: false, successPay: false,
        myOrders: [], loadingMyOrders: false, errorMyOrders: null,
        orderList: [], loadingOrders: false, errorOrders: null,
        loadingDeliver: false, successDeliver: false,

        //  State for tracking the delete process
        loadingDelete: false, successDelete: false, errorDelete: null,
    },
    reducers: {
        orderCreateReset: (state) => { state.order = {}; state.success = false; state.error = null; },
        orderPayReset: (state) => { state.loadingPay = false; state.successPay = false; },
        orderDeliverReset: (state) => { state.loadingDeliver = false; state.successDeliver = false; },

        //  Reset delete state
        orderDeleteReset: (state) => { state.successDelete = false; state.errorDelete = null; }
    },
    extraReducers: (builder) => {
        builder
            // --- Create Order Cases ---
            .addCase(createOrder.pending, (state) => { state.loading = true; state.error = null; state.success = false; })
            .addCase(createOrder.fulfilled, (state, action) => { state.loading = false; state.success = true; state.order = action.payload; })
            .addCase(createOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            // --- Get Order Details Cases ---
            .addCase(getOrderDetails.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(getOrderDetails.fulfilled, (state, action) => { state.loading = false; state.orderDetails = action.payload; })
            .addCase(getOrderDetails.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            // --- Pay Order Cases ---
            .addCase(payOrder.pending, (state) => { state.loadingPay = true; })
            .addCase(payOrder.fulfilled, (state) => { state.loadingPay = false; state.successPay = true; })
            .addCase(payOrder.rejected, (state, action) => { state.loadingPay = false; state.error = action.payload; })
            // --- Deliver Order Cases ---
            .addCase(deliverOrder.pending, (state) => { state.loadingDeliver = true; })
            .addCase(deliverOrder.fulfilled, (state) => { state.loadingDeliver = false; state.successDeliver = true; })
            .addCase(deliverOrder.rejected, (state, action) => { state.loadingDeliver = false; state.error = action.payload; })
            // --- List My Orders Cases ---
            .addCase(listMyOrders.pending, (state) => { state.loadingMyOrders = true; state.errorMyOrders = null; })
            .addCase(listMyOrders.fulfilled, (state, action) => { state.loadingMyOrders = false; state.myOrders = action.payload; })
            .addCase(listMyOrders.rejected, (state, action) => { state.loadingMyOrders = false; state.errorMyOrders = action.payload; })
            // --- List ALL Orders Cases ---
            .addCase(listOrders.pending, (state) => { state.loadingOrders = true; state.errorOrders = null; })
            .addCase(listOrders.fulfilled, (state, action) => { state.loadingOrders = false; state.orderList = action.payload; })
            .addCase(listOrders.rejected, (state, action) => { state.loadingOrders = false; state.errorOrders = action.payload; })

            // ---  Delete Order Cases ---
            .addCase(deleteOrder.pending, (state) => { state.loadingDelete = true; })
            .addCase(deleteOrder.fulfilled, (state) => { state.loadingDelete = false; state.successDelete = true; })
            .addCase(deleteOrder.rejected, (state, action) => { state.loadingDelete = false; state.errorDelete = action.payload; });
    },
});

export const { orderCreateReset, orderPayReset, orderDeliverReset, orderDeleteReset } = orderSlice.actions;
export default orderSlice.reducer;