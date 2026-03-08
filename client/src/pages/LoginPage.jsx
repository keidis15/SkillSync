import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/users/login", { email, password });
      alert(`¡Hola de nuevo, ${res.data.user.name}!`);

      // Guardamos el nombre del usuario en el navegador para que no se "olvide" al recargar
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/sessions");
    } catch (error) {
      alert(
        "Error: " + (error.response?.data?.message || "Credenciales inválidas"),
      );
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          {/* Card de Login */}
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-5">
              {/* Logo o Icono */}
              <div className="text-center mb-4">
                <div className="bg-primary text-white rounded-circle d-inline-block p-3 mb-2">
                  <i className="bi bi-person-fill fs-2"></i>{" "}
                  {/* Si usas Bootstrap Icons */}
                  <span className="fs-1">🔒</span>
                </div>
                <h2 className="fw-bold">Bienvenido</h2>
                <p className="text-muted">Ingresa a tu cuenta de SkillSync</p>
              </div>

              <form onSubmit={handleLogin}>
                {/* Email */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    placeholder="nombre@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Contraseña</label>
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {/* Botón de Ingreso */}
                <div className="d-grid mb-3">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg shadow-sm"
                  >
                    Iniciar Sesión
                  </button>
                </div>

                {/* Link a Registro */}
                <div className="text-center">
                  <span className="text-muted small">¿No tienes cuenta? </span>
                  <Link
                    to="/register"
                    className="text-primary fw-bold text-decoration-none small"
                  >
                    Regístrate aquí
                  </Link>
                </div>
              </form>
            </div>
          </div>

          {/* Pie de página extra */}
          <div className="text-center mt-4">
            <Link to="/" className="text-muted small text-decoration-none">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
