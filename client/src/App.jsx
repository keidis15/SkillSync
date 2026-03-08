import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import RegisterPage from "./pages/RegisterPage";
import SessionList from "./pages/SessionList";
import CreateSession from "./pages/CreateSession";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import EditSession from "./components/EditSession";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import MySessions from "./components/MySessions";
import { SessionDetailPage } from "./components/SessionDetailPage";

function App() {
  const navigate = useNavigate();
  const location = useLocation(); // Esto detecta cambios de URL

  // Transformamos tu const en un useState
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  // Este efecto sincroniza el estado cada vez que navegamos
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    setUser(loggedUser);
  }, [location]);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null); // <--- ¡Esto limpia el menú al instante!
    navigate("/login");
  };
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Barra de Navegación simple */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
        <div className="container">
          <Link className="navbar-brand fw-bold text-primary" to="/">
            SkillSync
          </Link>

          {/* Botón hamburguesa */}
          <button
            className="navbar-toggler border-0 shadow-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            {/* ms-auto empuja los links a la derecha en desktop */}
            <ul className="navbar-nav ms-auto align-items-lg-center">
              <li className="nav-item">
                <Link className="nav-link px-3" to="/sessions">
                  Sesiones
                </Link>
              </li>

              {user ? (
                <>
                  <li className="nav-item">
                    <Link
                      className="nav-link text-info px-3"
                      to="/create-session"
                    >
                      <i className="bi bi-plus-lg me-1"></i>Crear
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-info px-3" to="/profile">
                      Mi Perfil
                    </Link>
                  </li>
                  {/* Texto de bienvenida con mejor espaciado en móvil */}
                  <li className="nav-item">
                    <span className="navbar-text mx-lg-3 px-3 d-block d-lg-inline my-2 my-lg-0 text-light opacity-75">
                      Hola, {user.name}
                    </span>
                  </li>
                  <li className="nav-item px-3 px-lg-0">
                    <button
                      onClick={logout}
                      className="btn btn-outline-danger btn-sm w-100 w-lg-auto"
                    >
                      Salir
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link px-3" to="/login">
                      Entrar
                    </Link>
                  </li>
                  <li className="nav-item px-3 px-lg-0">
                    <Link
                      className="btn btn-primary btn-sm w-100 w-lg-auto ms-lg-2"
                      to="/register"
                    >
                      Registro
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <main className="flex-grow-1">
        {/* Aquí es donde cambian las páginas */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/create-session" element={<CreateSession />} />
          <Route path="/login" element={<LoginPage />} />

          {/* RUTAS PROTEGIDAS: Solo entran logueados */}
          <Route element={<ProtectedRoute />}>
            <Route path="/sessions" element={<SessionList />} />

            <Route path="/sessions/:id" element={<SessionDetailPage />} />
            <Route path="/create-session" element={<CreateSession />} />
            <Route path="/edit-session/:id" element={<EditSession />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/mis-sesiones" element={<MySessions />} />
          </Route>
        </Routes>
      </main>

      <footer className="py-2 mt-5 bg-dark text-white-50">
        <div className="container  d-flex justify-content-between align-items-center ">
          <small>
            SkillSync &copy; 2026 | Desarrollado por
            <span className="text-white fw-bold"> Keidis Suarez </span>
          </small>
          <div className="mt-2">
            <a
              href="https://www.linkedin.com/in/keidis-stefania-suarez-ch-157a51280/"
              className="text-white-50 me-3 text-decoration-none"
              target="_blank"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/keidis15"
              className="text-white-50 text-decoration-none"
              target="_blank"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
