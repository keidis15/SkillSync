import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function CreateSession() {
  const [sessionData, setSessionData] = useState({
    title: "",
    description: "",
    date: "",
    resource_url: "",
    categoryId: 1, // Usamos la categoría que ya creaste en Neon
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setSessionData({ ...sessionData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));

    // Limpiamos los datos antes de enviar
    const dataToSend = {
      ...sessionData,
      resource_url: sessionData.resource_url?.trim() || null,
      userId: user.id,
    };
    try {
      await api.post("/sessions", dataToSend);
      alert("¡Sesión publicada con éxito! 🚀");
      navigate("/sessions");
    } catch (error) {
      console.error("Error detallado:", error.response?.data || error.message);
      alert("Error al crear la sesión. Revisa la consola del servidor.");
    }
  };
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">
          {/* Card Principal */}
          <div className="card shadow-lg border-0 rounded-3">
            <div className="card-header bg-primary text-white text-center py-3">
              <h3 className="mb-0">✨ Crear Nueva Sesión</h3>
              <p className="small mb-0 text-white-50">
                Comparte tus conocimientos con la comunidad
              </p>
            </div>

            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                {/* Input Título */}
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Título de la Sesión
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={sessionData.title}
                    className="form-control form-control-lg"
                    placeholder="Ej: Masterclass de React Avanzado"
                    onChange={handleChange}
                    required
                  />
                  <div className="form-text">
                    Usa un título descriptivo y llamativo.
                  </div>
                </div>

                {/* Input Descripción */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Descripción</label>
                  <textarea
                    name="description"
                    value={sessionData.description}
                    className="form-control"
                    rows="4"
                    placeholder="¿De qué trata la sesión? ¿Qué aprenderán?"
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold text-primary">
                    <i className="bi bi-github me-1"></i> Link de GitHub o
                    Documentación
                  </label>
                  <input
                    type="url"
                    name="resource_url"
                    className="form-control"
                    placeholder="https://github.com/usuario/repositorio"
                    value={sessionData.resource_url}
                    onChange={handleChange}
                  />
                  <div className="form-text small">
                    Opcional: Comparte el código o guía del tema.
                  </div>
                </div>

                {/* Fila para Fecha y Categoría */}
                <div className="row">
                  <div className="col-md-12 mb-3">
                    <label className="form-label fw-bold">
                      Fecha de la Sesión
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={sessionData.date}
                      className="form-control"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="d-grid gap-2 mt-4">
                  <button type="submit" className="btn btn-primary btn-lg">
                    Publicar Ahora
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/sessions")}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>

          <p className="text-center mt-4 text-muted small">
            SkillSync &copy; 2026 - Conectando Talento
          </p>
        </div>
      </div>
    </div>
  );
}

export default CreateSession;
