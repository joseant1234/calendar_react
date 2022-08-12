import { useDispatch, useSelector } from "react-redux";
import { calendarApi } from "../api";
import { convertEventStringDateToDate } from "../helpers";
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from "../store/calendar/calendarSlice";

export const useCalendarStore = () => {

    const dispatch = useDispatch();

    const {
        events,
        activeEvent,
    } = useSelector(state => state.calendar);
    const { user } = useSelector(state => state.auth);

    const setActiveEvent = (calendarEvent) => {
        dispatch(onSetActiveEvent(calendarEvent));
    }

    // otra forma de hacer en lugar de un thunk (simula un thunk)
    const startSavingEvent = async(calendarEvent) => {
        if (calendarEvent._id) {
            dispatch(onUpdateEvent({...calendarEvent}));
        } else {
            const { data } = await calendarApi.post('/events', calendarEvent);
            dispatch(onAddNewEvent({...calendarEvent, id: data.event.id, user }));
        }
    }

    const startDeletingEvent = async() => {
        dispatch(onDeleteEvent());
    }

    const startLoadingEvents = async() => {
        try {
            const { data } = await calendarApi.get('/events');
            const events = convertEventStringDateToDate(data.events);
            dispatch(onLoadEvents(events));
        } catch (error) {
            console.log('Error cargando eventos');
            console.log(error);
        }
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
        startLoadingEvents,
    }
}
