import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../auth";
import { CalendarPage } from "../calendar";
import { useAuthStore } from "../hooks";


export const AppRouter = () => {

  // const authStatus = 'not-authenticated';
  const { status:authStatus, checkAuthToken } = useAuthStore();

  useEffect(() => {
    checkAuthToken();
  }, []);


  if (authStatus === 'checking') {
    return (
      <h3>Cargando...</h3>
    )
  }

  return (
    <Routes>
      {
        (authStatus == 'not-authenticated')
        ? <Route path='/auth/*' element={ <LoginPage />} />
        : <Route path='/*' element={ <CalendarPage />} />
      }

      {/* si no está autenticado y pone cualquier ruta va redireccionar al login */}
      <Route path="/*" element={<Navigate to="/auth/login" />} />
    </Routes>
  )
}
