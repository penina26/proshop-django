import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// 1. Thunk for fetching the list (HomeScreen)
// Notice the `_` as the first argument, because we aren't passing an ID, but we need the second argument
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts', 
    async (_, thunkAPI) => {
        try {
            const { data } = await axios.get('/api/products/')
            return data
        } catch (error) {
            // Extract the custom Django error message
            const message = error.response && error.response.data.detail 
                ? error.response.data.detail 
                : error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
)

// 2. Thunk for fetching a single item (ProductScreen)
export const fetchProductDetails = createAsyncThunk(
    'products/fetchProductDetails', 
    async (id, thunkAPI) => { 
        try {
            const { data } = await axios.get(`/api/products/${id}`)
            return data
        } catch (error) {
            // Extract the custom Django error message
            const message = error.response && error.response.data.detail 
                ? error.response.data.detail 
                : error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
)

const productSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        product: { reviews: [] },
        loading: false,
        error: null
    },
    reducers: {
        // Cleanup function to clear state when leaving a page
        clearProductDetails: (state) => {
            state.product = { reviews: [] }
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            // List Products Cases
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false
                state.products = action.payload
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false
                
                state.error = action.payload 
            })

            // Single Product Details Cases
            .addCase(fetchProductDetails.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchProductDetails.fulfilled, (state, action) => {
                state.loading = false
                state.product = action.payload
            })
            .addCase(fetchProductDetails.rejected, (state, action) => {
                state.loading = false
                
                state.error = action.payload 
            })
    },
})

export const { clearProductDetails } = productSlice.actions
export default productSlice.reducer