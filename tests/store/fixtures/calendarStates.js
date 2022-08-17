export const events = [
    {
        id: '1',
        title: 'Es un evento',
        notes: 'Es una nota del evento',
        start: new Date('2022-12-12 13:00:00'),
        end: new Date('2022-12-12 16:00:00'),
    },
    {
        id: '3',
        title: 'Mas eventos',
        notes: 'Es otra nota',
        start: new Date('2022-12-19 13:00:00'),
        end: new Date('2022-12-19 16:00:00'),
    }
]

export const initialState = {
    isLoadingEvents: true,
    events: [],
    activeEvent: null,
}

export const calendarWithEventsState = {
    isLoadingEvents: false,
    events: [...events],
    activeEvent: null,
}

export const calendarWithActiveEventState = {
    isLoadingEvents: false,
    events: [...events],
    activeEvent: {...events[0]},
}
