import { fireEvent, render, screen } from "@testing-library/react"
import { Provider } from "react-redux";
import { FabDelete } from "../../../src/calendar/components/FabDelete"
import { useCalendarStore } from "../../../src/hooks";
import { store } from "../../../src/store";

jest.mock('../../../src/hooks/useCalendarStore');

describe('Pruebas en el componente <FabDelete />', () => {

    // debe de llevar la palabra reservada mock
    const mockStartDeletingEvent = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        // limpiar los intervalos
        // jest.clearAllTimers();
    });

    test('debe de mostrar el componente correctamente', () => {
        // jest.fn().mockReturnValue
        // mockResolveValue para cosas asincronas o promesas
        // se analiza la información retornada del hook, no la implementación del hook
        useCalendarStore.mockReturnValue({
            hasEventSelected: false
        })

        render(<FabDelete />);
        // screen.debug();
        const btn = screen.getByLabelText('btn-delete');
        expect(btn.classList).toContain('btn');
        expect(btn.classList).toContain('btn-danger');
        expect(btn.classList).toContain('fab-danger');
        expect(btn.style.display).toBe('none');
    });

    test('debe de mostrar el botón si hay un evento activo', () => {
        useCalendarStore.mockReturnValue({
            hasEventSelected: true
        })

        render(<FabDelete />);

        const btn = screen.getByLabelText('btn-delete');
        expect(btn.style.display).toBe('');
    });

    test('debe de llamar startDeletingEvent si hay evento activo', () => {
        useCalendarStore.mockReturnValue({
            hasEventSelected: true,
            startDeletingEvent: mockStartDeletingEvent,
        })

        render(<FabDelete />);

        const btn = screen.getByLabelText('btn-delete');
        // simular el click del botón
        fireEvent.click(btn);
        expect(mockStartDeletingEvent).toHaveBeenCalled();

    });
})
