import { useState, useEffect } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

function MySessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchMySessions = async () => {
      try {
        const response = await api.get("/sessions");
        // Filtramos para mostrar solo las que creó el usuario actual
        const filtered = response.data.filter(s => Number(s.userId) === Number(user.id));
        setSessions(filtered);
      } catch (error) {
        console.error("Error al cargar tus sesiones", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMySessions();
  }, [user.id]);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta sesión?")) {
      try {
        await api.delete(`/sessions/${id}`);
        setSessions(sessions.filter(s => s.id !== id));
        alert("Sesión eliminada correctamente");
      } catch (error) {
        alert("Error al eliminar la sesión", error);
      }
    }
  };

  if (loading) return <div className="text-center mt-5">Cargando tus sesiones...</div>;

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Mis Sesiones Publicadas</h2>
        <Link to="/create-session" className="btn btn-primary rounded-pill">
          + Crear Nueva
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="alert alert-info text-center">
          Aún no has creado ninguna sesión. ¡Anímate a compartir tu conocimiento!
        </div>
      ) : (
        <div className="row">
          {sessions.map(session => (
            <div className="col-md-4 mb-4" key={session.id}>
              <div className="card h-100 shadow-sm border-0 session-card">
                <div className="card-body">
                  <span className="badge bg-soft-primary text-primary mb-2">
                    {session.category || "General"}
                  </span>
                  <h5 className="card-title fw-bold text-dark">{session.title}</h5>
                  <p className="card-text text-muted text-truncate">{session.description}</p>
                </div>
                <div className="card-footer bg-white border-0 d-flex justify-content-end gap-2 pb-3">
                  <Link to={`/edit-session/${session.id}`} className="btn btn-sm btn-warning">
                    <i className="bi bi-pencil"></i> Editar
                  </Link>
                  <button 
                    onClick={() => handleDelete(session.id)} 
                    className="btn btn-sm btn-danger"
                  >
                    <i className="bi bi-trash"></i> Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MySessions;