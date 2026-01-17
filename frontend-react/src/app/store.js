import { configureStore } from '@reduxjs/toolkit'
import AuthReducer from '../features/auth/AuthSlice'
import AntDReducer from '../features/antd/AntDSlice';
import TicketReducer from '../features/ticket/TicketSlice';

const store = configureStore({
  reducer: {
    Auth: AuthReducer,
    AntD: AntDReducer,
    Tickets: TicketReducer,
  },
});

export default store;