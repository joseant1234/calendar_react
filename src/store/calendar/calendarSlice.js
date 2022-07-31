import { createSlice } from '@reduxjs/toolkit';
import { addHours } from 'date-fns';

const tempEvent = {
    title: 'Un evento',
    notes: 'Hay que comprar el pastel',
    start: new Date(),
    end: addHours(new Date(), 3),
    bgColor: "#fafafa",
    user: {
      _id: '123',
      name: 'Jose'
    }
}

export const calendarSlice = createSlice({
    name: 'calendar',
    initialState: {
        events: [
            tempEvent
        ],
        activeEvent: null,
    },
    reducers: {
        increment: (state, /* action */ ) => {
            state.counter += 1;
        },
    }
});


// Action creators are generated for each case reducer function
export const { increment } = calendarSlice.actions;
