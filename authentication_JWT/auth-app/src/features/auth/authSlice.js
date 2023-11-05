import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {user: null, token: null},
    reducers: {
        setCredentials: (state, action) => {
            const { user, accessToken } = action.payload;
            console.log('from authSlice', user, accessToken)
            state.user = user;
            state.token = accessToken
        },
        logOut: (state) => {
            state.user = null;
            state.token = null;
        }
    }
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;