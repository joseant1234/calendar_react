import { useEffect, useState } from 'react';
import { Calendar } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';
// import { addHours } from 'date-fns'
import { Navbar, CalendarEvent, CalendarModal, FabAddNew, FabDelete } from "../"
import { localizer, getMessagesES } from '../../helpers';
import { useUiStore, useCalendarStore, useAuthStore } from '../../hooks';

// const events = [{
//   title: 'Un evento',
//   notes: 'Hay que comprar el pastel',
//   start: new Date(),
//   end: addHours(new Date(), 3),
//   bgColor: "#fafafa",
//   user: {
//     _id: '123',
//     name: 'Jose'
//   }
// }]

export const CalendarPage = () => {

  const { user } = useAuthStore();
  const { openDateModal } = useUiStore();
  const { events, setActiveEvent, startLoadingEvents } = useCalendarStore();

  const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'week');

  const eventStyleGetter = (event, start, end, isSelected) => {
    const isMyEvent = (user.uid === event.user._id) || (user.uid === event.user.uid);
    // pone un color a cada evento
    const style = {
      backgroundColor: isMyEvent ? '#347CF7' : '#465660',
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white',
    };

    return {
      style
    }
  }

  const onDoubleClick = (event) => {
    openDateModal();
  }

  const onSelect = (event) => {
    setActiveEvent(event);
  }

  const onViewChanged = (event) => {
    localStorage.setItem('lastView', event);
    // no es necesario llamar a setLastView porque el calendario cambia la vista
    setLastView(event)
  }

  // solo se dispara una vez, al cargar el componente
  useEffect(() => {
    startLoadingEvents();
  }, []);


  return (
    <>
      <Navbar />

      <Calendar
        culture='es'
        localizer={localizer}
        events={events}
        defaultView={ lastView }
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc(100vh - 80px)' }}
        messages={ getMessagesES() }
        eventPropGetter={ eventStyleGetter }
        components={{
          event: CalendarEvent
        }}
        onDoubleClickEvent={ onDoubleClick }
        onSelectEvent={ onSelect }
        onView={ onViewChanged }
      />

      <CalendarModal />
      <FabAddNew />
      <FabDelete />
    </>
  )
}
