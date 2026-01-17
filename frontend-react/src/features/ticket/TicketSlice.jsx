import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async Thunks
export const fetchTickets = createAsyncThunk(
  "tickets/fetchTickets",
  async (username) => {
    // const userRes = await axios.get(`http://127.0.0.1:8000/users/me`);
    // const username = userRes.data.username;
    // const ticketRes = await axios.get(`http://127.0.0.1:8000/tickets/${username}`, {
      // headers: {
      //   Authorization: `Bearer ${token}`, // include token
      // },
    // });
    console.log(username);

    const token = localStorage.getItem("accessToken");
    const ticketRes = await axios.get(`http://127.0.0.1:8000/tickets/`, {
      headers: {
        Authorization: `Bearer ${token}`, // include token
      },
    });
    console.log("Line 22:", ticketRes.data);
    return ticketRes.data;
  }
);

export const addTicketAsync = createAsyncThunk(
  "tickets/addTicketAsync",
  async (ticketData) => {
    const token = localStorage.getItem("accessToken");
    const res = await axios.post("http://127.0.0.1:8000/tickets/create/", ticketData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // include token
        },
      }
    );
    return res.data;
  }
);

const TicketSlice = createSlice({
  name: "Tickets",
  initialState: {
    tickets: [],
    filters: {},
    selectedTicket: null,
    loading: false,
    error: null,
  },
  reducers: {
    addTicket: (state, action) => {
      console.log(action.payload);
      const exists = state.tickets.some((t) => t.id === action.payload.id);
      if (!exists) state.tickets.push(action.payload);
    },

    deleteTicket: (state, action) => {
      state.tickets = state.tickets.filter((ticket) => ticket.id !== action.payload.id);
    },

    updateTicket: (state, action) => {
      const { id, ...updatedFields } = action.payload;
      const ticket = state.tickets.find((t) => t.id === id);
      if (ticket) Object.assign(ticket, updatedFields);
    },

    updateTicketStatus: (state, action) => {
      const ticket = state.tickets.find((t) => t.id === action.payload.id);
      if (ticket) {
        ticket.status =
          ticket.status === "ToDo" ? "InProgress" : ticket.status === "InProgress" ? "Done" : "InProgress";
      }
    },

    selectTicket: (state, action) => {
      state.selectedTicket = state.tickets.find(
        (ticket) => ticket.id === action.payload.id
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(addTicketAsync.fulfilled, (state, action) => {
        state.tickets.push(action.payload);
      });
  },
});

export const {
  addTicket,
  deleteTicket,
  updateTicket,
  updateTicketStatus,
  selectTicket,
} = TicketSlice.actions;

export default TicketSlice.reducer;
