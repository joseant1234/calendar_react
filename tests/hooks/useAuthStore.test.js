import { configureStore } from "@reduxjs/toolkit"
import { act, renderHook, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { calendarApi } from "../../src/api";
import { useAuthStore } from "../../src/hooks/useAuthStore";
import { authSlice } from "../../src/store";
import { initialState, notAuthenticatedState } from '../store/fixtures/authStates';
import { testUserCredentials } from "../store/fixtures/testUser";

const getMockStore = (initialState) => {
    return configureStore({
        reducer: {
            auth: authSlice.reducer
        },
        preloadedState: {
            auth: {...initialState}
        }
    })
}

describe('Pruebas en useAuthStore', () => {

    beforeEach(() => localStorage.clear())

    test('debe de regresar los valores por defecto', () => {
        const mockStore = getMockStore({...initialState});
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });
        expect(result.current).toEqual({
            errorMessage: undefined,
            status: 'checking',
            user: {},
            checkAuthToken: expect.any(Function),
            startLogin: expect.any(Function),
            startLogout: expect.any(Function),
            startRegister: expect.any(Function),
        })
    });

    test('startLogin debe de realizar el login correctamente', async() => {
        // en el ambiente de testing tambien se tiene un localStorage
        // se limpia el localStorage para asegurar q no tenga data
        // localStorage.clear();
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });
        await act(async() =>{
            await result.current.startLogin(testUserCredentials);
        });
        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: {name: 'tests', uid: expect.any(String) }
        });
        expect(localStorage.getItem('token')).toEqual(expect.any(String));
        expect(localStorage.getItem('token-init-date')).toEqual(expect.any(String));
    });

    test('startLogin debe de fallar la autenticación', async() => {
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });
        await act(async() =>{
            await result.current.startLogin({ email: 'esunejemplo@email.com', password: '123456' });
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: expect.any(String),
            status: 'not-authenticated',
            user: {},
        });
        expect(localStorage.getItem('token')).toBe(null);
        // espera por la condición, si no se ejecuta la condición se marca un error
        await waitFor(
            () => expect(result.current.errorMessage).toBe(undefined)
        );
    });

    test('startRegister debe de crear un usuario', async() => {
        const newUser = { email: 'esunejemplo@email.com', password: '123456', name: 'esunname' }
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        // solo mock peticiones post
        const spy = jest.spyOn(calendarApi, 'post').mockReturnValue({
            data: {
                "ok": true,
                "uid": "123",
                "name": "esunname",
                "token": "es un token",
            }
        });

        await act(async() =>{
            await result.current.startRegister(newUser);
        });

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'esunname', uid: '123' }
        });

        // si se hace un mock en un prueba se destruye el spy con mockRestore
        spy.mockRestore();
    });

    test('startRegister debe de fallar la creación', async() => {
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async() =>{
            await result.current.startRegister(testUserCredentials);
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: expect.any(String),
            status: 'not-authenticated',
            user: {}
        });
    });

    test('checkAuthToken debe de fallar si no hay token', async() => {
        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async() => {
            await result.current.checkAuthToken();
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'not-authenticated',
            user: {}
        });
    })

    test('checkAuthToken debe de autenticar el usuario si hay un token', async() => {
        const { data } = await calendarApi.post('/auth', testUserCredentials);
        localStorage.setItem('token', data.token);

        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async() => {
            await result.current.checkAuthToken();
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'tests', uid: expect.any(String) }
        });
    });
});
