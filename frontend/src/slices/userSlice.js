import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


// 1. ASYNC THUNKS (The API Calls)
export const loginUser = createAsyncThunk(
    'user/login',
    async ({ email, password }, thunkAPI) => {
        try {
            const config = {
                headers: { 'Content-Type': 'application/json' },
            };
            const { data } = await axios.post('/api/users/login/', { email, password }, config);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } catch (error) {
            const message = error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Register User Thunk
export const registerUser = createAsyncThunk(
    'user/register',
    async ({ name, email, password }, thunkAPI) => {
        try {
            const config = {
                headers: { 'Content-Type': 'application/json' },
            };
            const { data } = await axios.post('/api/users/register/', { name, email, password }, config);

            // Automatically log them in after registration by saving the token
            localStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } catch (error) {
            const message = error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Update User Profile Thunk
export const updateUserProfile = createAsyncThunk(
    'user/updateProfile',
    async (user, thunkAPI) => {
        try {
            // Get the current user's token directly from the Redux state
            const { user: { userInfo } } = thunkAPI.getState();

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`, // Secure the route
                },
            };

            const { data } = await axios.put('/api/users/profile/update/', user, config);

            // Update local storage with the fresh token and new profile data
            localStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } catch (error) {
            const message = error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);


// 2. INITIAL STATE

const userInfoFromStorage = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;


// 3. THE SLICE (The Reducer)

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userInfo: userInfoFromStorage,
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        logout: (state) => {
            localStorage.removeItem('userInfo');
            state.userInfo = null;
            state.error = null;
            state.success = false;
        },
        // Clear the success alert when the user leaves the profile page
        resetUpdateSuccess: (state) => {
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // --- LOGIN CASES ---
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // --- REGISTER CASES ---
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // --- UPDATE PROFILE CASES ---
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true; // Triggers the success message on ProfileScreen
                state.userInfo = action.payload; // Updates state with the fresh JWT token
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout, resetUpdateSuccess } = userSlice.actions;
export default userSlice.reducer;