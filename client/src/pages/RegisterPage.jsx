import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // 1. Validar que no haya campos vacíos (aunque tengan 'required')
    if (!formData.name || !formData.email || !formData.password) {
      return alert("Todos los campos son obligatorios.");
    }

    // 2. Validar formato de Correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return alert("Por favor, ingresa un correo electrónico válido.");
    }

    // 3. Validar fuerza de la Contraseña
    // Al menos 8 caracteres, una letra y un número
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      return alert(
        "Seguridad insuficiente: La contraseña debe tener al menos 8 caracteres, incluir letras y números.",
      );
    }
    try {
      await api.post("/users", formData);
      alert("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
      navigate("/login");
    } catch (error) {
      if (error.response) {
        // El servidor respondió con un código de error (400, 404, 500)
        if (error.response.status === 404) {
          alert(
            "Error 404: No se encontró la ruta en el servidor. Revisa la URL.",
          );
        } else {
          alert(error.response.data.message || "Error en el servidor");
        }
      } else {
        // El servidor ni siquiera respondió (está apagado o hay error de red)
        alert(
          "No se pudo conectar con el servidor. ¿Está encendido el Backend?",
        );
      }
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          {/* Card de Registro */}
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-header bg-white border-0 pt-4 text-center">
              <div className="display-6 text-primary">🚀</div>
              <h2 className="fw-bold mt-2">Crea tu cuenta</h2>
              <p className="text-muted">Únete a la comunidad de SkillSync</p>
            </div>

            <div className="card-body p-4 pt-2">
              <form onSubmit={handleRegister}>
                {/* Nombre Completo */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Nombre Completo
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-person text-muted"></i>
                    </span>
                    <input
                      type="text"
                      name="name" // Importante para el handleChange
                      className="form-control border-start-0 ps-0"
                      placeholder="Tu nombre y apellido"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Correo Electrónico
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-envelope text-muted"></i>
                    </span>
                    <input
                      type="email"
                      name="email"
                      required
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Contraseña</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-lock text-muted"></i>
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      minLength="8"
                      required
                      className="form-control border-end-0"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      className="btn btn-outline-light border border-start-0 text-muted"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)} // Cambia de true a false
                      style={{ backgroundColor: "#f8f9fa" }}
                    >
                      <i
                        className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                      ></i>
                    </button>
                  </div>
                  <div className="form-text mt-2">
                    Tu contraseña está protegida con encriptación de nivel
                    bancario.
                  </div>
                </div>

                {/* Botón de Registro */}
                <div className="d-grid mb-3">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg shadow-sm"
                  >
                    Registrarme
                  </button>
                </div>

                {/* Link a Login */}
                <div className="text-center mt-4 border-top pt-3">
                  <span className="text-muted">¿Ya tienes una cuenta? </span>
                  <Link
                    to="/login"
                    className="text-primary fw-bold text-decoration-none"
                  >
                    Inicia sesión
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
