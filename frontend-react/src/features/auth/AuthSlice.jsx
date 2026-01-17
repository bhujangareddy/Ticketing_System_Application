import { createSlice } from "@reduxjs/toolkit";
import React from 'react'

const AuthSlice = createSlice({
    name: 'Auth',
    initialState: {
        user: {},
        isAuthenticated: false,
        role: "",
    },
    reducers: {
        login: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
            console.log("AuthSlice login method with values:", state.user);
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = {};
            state.role = "";
        },
        setRole: (state, action) => {
            console.log(action.payload)
            state.role = action.payload.role;
        },
    },
})

export const { login, logout, setRole } = AuthSlice.actions;

export default AuthSlice.reducer;
