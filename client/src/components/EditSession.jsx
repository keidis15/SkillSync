import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

function EditSession() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estado inicial con campos vacíos
  const [sessionData, setSessionData] = useState({
    title: "",
    description: "",
    date: "",
  });

  // 1. Cargar los datos del backend al entrar
  useEffect(() => {
    const loadSession = async () => {
      try {
        const response = await api.get(`/sessions/${id}`);
        const currentUser = JSON.parse(localStorage.getItem("user"));

        if (Number(response.data.userId) !== Number(currentUser.id)) {
          alert("¡Alto ahí! Esta sesión no te pertenece.");
          navigate("/sessions");
          return;
        }
        // IMPORTANTE: Sincronizamos el estado con lo que viene de la DB
        setSessionData({
          title: response.data.title || "",
          description: response.data.description || "",
          // Formateamos la fecha para que el input tipo 'date' la entienda (YYYY-MM-DD)
          date: response.data.date ? response.data.date.split("T")[0] : "",
        });
      } catch (error) {
        console.error("No se pudo cargar la sesión", error);
      }
    };
    loadSession();
  },[id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/sessions/${id}`, sessionData);
      alert("¡Cambios guardados con éxito!");
      navigate("/sessions");
    } catch (error) {
      alert("Error al actualizar", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow border-0">
            <div className="card-header bg-warning text-dark text-center py-3">
              <h3 className="mb-0 fw-bold">📝 Editar Sesión</h3>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Título</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    value={sessionData.title}
                    onChange={(e) =>
                      setSessionData({ ...sessionData, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Descripción</label>
                  <textarea
                    name="description"
                    className="form-control"
                    rows="4"
                    value={sessionData.description}
                    onChange={(e) =>
                      setSessionData({
                        ...sessionData,
                        description: e.target.value,
                      })
                    }
                    required
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Fecha</label>
                  <input
                    type="date"
                    className="form-control"
                    value={sessionData.date}
                    onChange={(e) =>
                      setSessionData({ ...sessionData, date: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-warning w-100 fw-bold"
                  >
                    Actualizar Datos
                  </button>
                  <button
                    type="button"
                    className="btn btn-light w-100"
                    onClick={() => navigate("/sessions")}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditSession;
