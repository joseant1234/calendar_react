import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
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
        try {
            if (calendarEvent.id) {
                await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent);
                dispatch(onUpdateEvent({...calendarEvent, user }));
                return;
            }
            const { data } = await calendarApi.post('/events', calendarEvent);
            dispatch(onAddNewEvent({...calendarEvent, id: data.event.id, user }));
        } catch (error) {
            console.log(error);
            Swal.fire('Error al guardar', error.response.data.msg, 'error');
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
