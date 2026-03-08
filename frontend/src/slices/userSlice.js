import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// --- 1. ASYNC THUNKS ---
export const loginUser = createAsyncThunk('user/login', async ({ email, password }, thunkAPI) => {
    try {
        const { data } = await axios.post('/api/users/login/', { email, password }, { headers: { 'Content-Type': 'application/json' } });
        localStorage.setItem('userInfo', JSON.stringify(data));
        return data;
    } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.detail || error.message); }
});

export const registerUser = createAsyncThunk('user/register', async ({ name, email, password }, thunkAPI) => {
    try {
        const { data } = await axios.post('/api/users/register/', { name, email, password }, { headers: { 'Content-Type': 'application/json' } });
        localStorage.setItem('userInfo', JSON.stringify(data));
        return data;
    } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.detail || error.message); }
});

export const updateUserProfile = createAsyncThunk('user/updateProfile', async (user, thunkAPI) => {
    try {
        const { user: { userInfo } } = thunkAPI.getState();
        const { data } = await axios.put('/api/users/profile/update/', user, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } });
        localStorage.setItem('userInfo', JSON.stringify(data));
        return data;
    } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.detail || error.message); }
});

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, thunkAPI) => {
    try {
        const { user: { userInfo } } = thunkAPI.getState();
        const { data } = await axios.get('/api/users/', { headers: { Authorization: `Bearer ${userInfo.access}` } });
        return data;
    } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.detail || error.message); }
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id, thunkAPI) => {
    try {
        const { user: { userInfo } } = thunkAPI.getState();
        const { data } = await axios.delete(`/api/users/delete/${id}/`, { headers: { Authorization: `Bearer ${userInfo.access}` } });
        return data;
    } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.detail || error.message); }
});

// NEW: Fetch specific user details for the edit form
export const fetchUserDetails = createAsyncThunk('users/fetchUserDetails', async (id, thunkAPI) => {
    try {
        const { user: { userInfo } } = thunkAPI.getState();
        const { data } = await axios.get(`/api/users/${id}/`, { headers: { Authorization: `Bearer ${userInfo.access}` } });
        return data;
    } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.detail || error.message); }
});

// NEW: Admin submitting the update
export const adminUpdateUser = createAsyncThunk('users/adminUpdateUser', async (user, thunkAPI) => {
    try {
        const { user: { userInfo } } = thunkAPI.getState();
        const { data } = await axios.put(`/api/users/update/${user._id}/`, user, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.access}` } });
        return data;
    } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.detail || error.message); }
});


// --- 2. INITIAL STATE ---
const userInfoFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

// --- 3. THE SLICE ---
const userSlice = createSlice({
    name: 'user',
    initialState: {
        userInfo: userInfoFromStorage, loading: false, error: null, success: false,
        users: [], loadingUsers: false, errorUsers: null, successDelete: false,

        // NEW: State variables for editing a user
        userDetails: {}, loadingDetails: false, errorDetails: null, successAdminUpdate: false,
    },
    reducers: {
        logout: (state) => {
            localStorage.removeItem('userInfo');
            state.userInfo = null; state.error = null; state.success = false;
            state.users = []; state.successDelete = false; state.userDetails = {};
        },
        resetUpdateSuccess: (state) => { state.success = false; },
        resetDeleteSuccess: (state) => { state.successDelete = false; },
        // NEW: Reset the admin update success flag so we don't get stuck in a redirect loop
        resetAdminUpdateSuccess: (state) => { state.successAdminUpdate = false; state.userDetails = {}; }
    },
    extraReducers: (builder) => {
        builder
            // Login / Register / Profile Update 
            .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(loginUser.fulfilled, (state, action) => { state.loading = false; state.userInfo = action.payload; })
            .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(registerUser.fulfilled, (state, action) => { state.loading = false; state.userInfo = action.payload; })
            .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(updateUserProfile.pending, (state) => { state.loading = true; state.error = null; state.success = false; })
            .addCase(updateUserProfile.fulfilled, (state, action) => { state.loading = false; state.success = true; state.userInfo = action.payload; })
            .addCase(updateUserProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            // Admin: Fetch & Delete Users 
            .addCase(fetchUsers.pending, (state) => { state.loadingUsers = true; state.errorUsers = null; })
            .addCase(fetchUsers.fulfilled, (state, action) => { state.loadingUsers = false; state.users = action.payload; })
            .addCase(fetchUsers.rejected, (state, action) => { state.loadingUsers = false; state.errorUsers = action.payload; })
            .addCase(deleteUser.pending, (state) => { state.loadingUsers = true; })
            .addCase(deleteUser.fulfilled, (state) => { state.loadingUsers = false; state.successDelete = true; })
            .addCase(deleteUser.rejected, (state, action) => { state.loadingUsers = false; state.errorUsers = action.payload; })

            // NEW: Admin Fetch User Details
            .addCase(fetchUserDetails.pending, (state) => { state.loadingDetails = true; state.errorDetails = null; })
            .addCase(fetchUserDetails.fulfilled, (state, action) => { state.loadingDetails = false; state.userDetails = action.payload; })
            .addCase(fetchUserDetails.rejected, (state, action) => { state.loadingDetails = false; state.errorDetails = action.payload; })

            // NEW: Admin Update User
            .addCase(adminUpdateUser.pending, (state) => { state.loadingDetails = true; state.errorDetails = null; state.successAdminUpdate = false; })
            .addCase(adminUpdateUser.fulfilled, (state) => { state.loadingDetails = false; state.successAdminUpdate = true; })
            .addCase(adminUpdateUser.rejected, (state, action) => { state.loadingDetails = false; state.errorDetails = action.payload; });
    },
});

export const { logout, resetUpdateSuccess, resetDeleteSuccess, resetAdminUpdateSuccess } = userSlice.actions;
export default userSlice.reducer;