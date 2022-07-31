import { configureStore } from "@reduxjs/toolkit";
import { uiSlice, calendarSlice } from "./";

// serializableCheck en false es para q no revise q se pueda serializar la fecha
export const store = configureStore({
    reducer: {
        calendar: calendarSlice.reducer,
        ui: uiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})
