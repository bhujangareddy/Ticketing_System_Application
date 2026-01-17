import { createSlice } from '@reduxjs/toolkit'
import React from 'react'

const AntDSlice = createSlice({
    name: "AntD",
    initialState: {
        isModalOpen: false,
    },
    reducers: {
        showModal: (state) => {
            state.isModalOpen = true;
        },
        closeModal: (state) => {
            state.isModalOpen = false;
        }
    }
})

export const { showModal, closeModal } = AntDSlice.actions;

export default AntDSlice.reducer;
