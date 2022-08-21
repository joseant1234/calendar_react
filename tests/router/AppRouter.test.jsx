import { render, screen } from "@testing-library/react";
import { useAuthStore } from "../../src/hooks/useAuthStore";
import { AppRouter } from "../../src/router/AppRouter";

jest.mock('../../src/hooks/useAuthStore');

describe('Pruebas en <AppRouter />', () => {

    const mockCheckAuthToken = jest.fn();

    beforeEach(() => jest.clearAllMocks());

    test('debe de mostrar la pantalla de carga y llamar checkAuthToken', () => {
        useAuthStore.mockReturnValue({
            status: 'checking',
            checkAuthToken: mockCheckAuthToken,
        });

        // al estar importado el CalendarPage, tambien está importando CalendarModal
        // por eso pide el Modal.setAppElement('#root'), para ignorar eso se puede condicionar a que solo se muestre si es diferente al ambiente de prueba;

        render(< AppRouter />)

        expect(screen.getByText('Cargando...')).toBeTruthy();
        expect(mockCheckAuthToken).toHaveBeenCalled();
    });
});
