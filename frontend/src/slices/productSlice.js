import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 1. Thunk for fetching the list (HomeScreen)
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (keyword = '', thunkAPI) => {
        try {
            const { data } = await axios.get(`/api/products/${keyword}`);
            return data;
        } catch (error) {
            const message = error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// 2. Thunk for fetching a single item (ProductScreen)
export const fetchProductDetails = createAsyncThunk(
    'products/fetchProductDetails',
    async (id, thunkAPI) => {
        try {
            const { data } = await axios.get(`/api/products/${id}`);
            return data;
        } catch (error) {
            const message = error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

//  Thunk for fetching top-rated products for the carousel
export const fetchTopRatedProducts = createAsyncThunk(
    'products/fetchTopRatedProducts',
    async (_, thunkAPI) => {
        try {
            const { data } = await axios.get(`/api/products/top/`);
            return data;
        } catch (error) {
            const message = error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// 3. Thunk for deleting a product
export const deleteProduct = createAsyncThunk(
    'products/deleteProduct',
    async (id, thunkAPI) => {
        try {
            const { user: { userInfo } } = thunkAPI.getState();
            const config = { headers: { Authorization: `Bearer ${userInfo.access}` } };
            const { data } = await axios.delete(`/api/products/${id}/delete/`, config);
            return data;
        } catch (error) {
            const message = error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// 4. Thunk for creating a sample product
export const createProduct = createAsyncThunk(
    'products/createProduct',
    async (_, thunkAPI) => {
        try {
            const { user: { userInfo } } = thunkAPI.getState();
            const config = { headers: { Authorization: `Bearer ${userInfo.access}` } };
            const { data } = await axios.post(`/api/products/create/`, {}, config);
            return data;
        } catch (error) {
            const message = error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// 5. Thunk for updating a product (Text data only)
export const updateProduct = createAsyncThunk(
    'products/updateProduct',
    async (product, thunkAPI) => {
        try {
            const { user: { userInfo } } = thunkAPI.getState();
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.access}`
                }
            };
            const { data } = await axios.put(`/api/products/${product._id}/update/`, product, config);
            return data;
        } catch (error) {
            const message = error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// 6. Thunk for uploading an image (File data)
export const uploadProductImage = createAsyncThunk(
    'products/uploadProductImage',
    async (formData, thunkAPI) => {
        try {
            const { user: { userInfo } } = thunkAPI.getState();
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userInfo.access}`
                }
            };
            const { data } = await axios.post(`/api/products/upload/`, formData, config);
            return data;
        } catch (error) {
            const message = error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// 7. Thunk for creating a product review
export const createProductReview = createAsyncThunk(
    'products/createProductReview',
    async ({ productId, review }, thunkAPI) => {
        try {
            const { user: { userInfo } } = thunkAPI.getState();
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.access}`
                }
            };
            const { data } = await axios.post(`/api/products/${productId}/reviews/`, review, config);
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
const productSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        page: 1,
        pages: 1,
        product: { reviews: [] },
        topProducts: [], loadingTop: false, errorTop: null,
        loading: false,
        error: null,

        // Admin Action States
        loadingDelete: false, successDelete: false, errorDelete: null,
        loadingCreate: false, successCreate: false, errorCreate: null, createdProduct: null,
        loadingUpdate: false, successUpdate: false, errorUpdate: null,
        loadingUpload: false, successUpload: false, errorUpload: null,
        loadingProductReview: false, successProductReview: false, errorProductReview: null,
    },
    reducers: {
        clearProductDetails: (state) => {
            state.product = { reviews: [] };
            state.error = null;
        },
        // Cleanup functions for Admin actions
        productCreateReset: (state) => {
            state.successCreate = false;
            state.errorCreate = null;
            state.createdProduct = null;
        },
        productUpdateReset: (state) => {
            state.successUpdate = false;
            state.errorUpdate = null;
        },
        productReviewCreateReset: (state) => {
            state.successProductReview = false;
            state.errorProductReview = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // --- List Products Cases ---
            .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products;
                state.page = action.payload.page;
                state.pages = action.payload.pages;

            })
            .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            // --- Single Product Details Cases ---
            .addCase(fetchProductDetails.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchProductDetails.fulfilled, (state, action) => { state.loading = false; state.product = action.payload; })
            .addCase(fetchProductDetails.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            // ---  Top Rated Products Cases ---
            .addCase(fetchTopRatedProducts.pending, (state) => { state.loadingTop = true; state.errorTop = null; })
            .addCase(fetchTopRatedProducts.fulfilled, (state, action) => { state.loadingTop = false; state.topProducts = action.payload; })
            .addCase(fetchTopRatedProducts.rejected, (state, action) => { state.loadingTop = false; state.errorTop = action.payload; })

            // --- Delete Product Cases ---
            .addCase(deleteProduct.pending, (state) => { state.loadingDelete = true; state.successDelete = false; })
            .addCase(deleteProduct.fulfilled, (state) => { state.loadingDelete = false; state.successDelete = true; })
            .addCase(deleteProduct.rejected, (state, action) => { state.loadingDelete = false; state.errorDelete = action.payload; })

            // --- Create Product Cases ---
            .addCase(createProduct.pending, (state) => { state.loadingCreate = true; state.successCreate = false; })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loadingCreate = false;
                state.successCreate = true;
                state.createdProduct = action.payload;
            })
            .addCase(createProduct.rejected, (state, action) => { state.loadingCreate = false; state.errorCreate = action.payload; })

            // --- Update Product Cases ---
            .addCase(updateProduct.pending, (state) => { state.loadingUpdate = true; state.successUpdate = false; })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loadingUpdate = false;
                state.successUpdate = true;
                state.product = action.payload;
            })
            .addCase(updateProduct.rejected, (state, action) => { state.loadingUpdate = false; state.errorUpdate = action.payload; })

            // --- Upload Image Cases ---
            .addCase(uploadProductImage.pending, (state) => { state.loadingUpload = true; state.successUpload = false; })
            .addCase(uploadProductImage.fulfilled, (state) => { state.loadingUpload = false; state.successUpload = true; })
            .addCase(uploadProductImage.rejected, (state, action) => { state.loadingUpload = false; state.errorUpload = action.payload; })

            // --- Create Review Cases ---
            .addCase(createProductReview.pending, (state) => { state.loadingProductReview = true; state.successProductReview = false; })
            .addCase(createProductReview.fulfilled, (state) => { state.loadingProductReview = false; state.successProductReview = true; })
            .addCase(createProductReview.rejected, (state, action) => { state.loadingProductReview = false; state.errorProductReview = action.payload; });
    },
});


export const { clearProductDetails, productCreateReset, productUpdateReset, productReviewCreateReset } = productSlice.actions;
export default productSlice.reducer;