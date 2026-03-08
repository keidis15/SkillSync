import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  // Si no hay usuario, lo mandamos al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si hay usuario, lo dejamos pasar al contenido (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;