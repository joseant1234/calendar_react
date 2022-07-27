import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../auth";
import { CalendarPage } from "../calendar";


export const AppRouter = () => {

  const authStatus = 'authenticated';

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
