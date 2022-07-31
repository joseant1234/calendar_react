import { useDispatch, useSelector } from "react-redux";
import { onAddNewEvent, onDeleteEvent, onSetActiveEvent, onUpdateEvent } from "../store/calendar/calendarSlice";

export const useCalendarStore = () => {

    const dispatch = useDispatch();

    const {
        events,
        activeEvent,
    } = useSelector(state => state.calendar);

    const setActiveEvent = (calendarEvent) => {
        dispatch(onSetActiveEvent(calendarEvent));
    }

    // otra forma de hacer en lugar de un thunk (simula un thunk)
    const startSavingEvent = async(calendarEvent) => {
        if (calendarEvent._id) {
            dispatch(onUpdateEvent({...calendarEvent}));
        } else {
            dispatch(onAddNewEvent({...calendarEvent, _id: new Date().getTime() }));
        }
    }

    const startDeletingEvent = async() => {
        dispatch(onDeleteEvent());
    }

    return {
        // Properties
        events,
        activeEvent,
        hasEventSelected: !!activeEvent,
        // Methods
        setActiveEvent,
        startSavingEvent,
        startDeletingEvent,
    }
}
